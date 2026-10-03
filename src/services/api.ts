import { Rota, Viagem, Lugar, Reserva, Pagamento, Bilhete, Cliente, Notificacao } from '../types';

const API_BASE = '/api';

export const api = {
  // Rotas
  async getRotas(): Promise<Rota[]> {
    const res = await fetch(`${API_BASE}/rotas`);
    if (!res.ok) throw new Error('Falha ao carregar rotas');
    return res.json();
  },

  // Viagens
  async getViagens(filters?: { origem?: string; destino?: string; data?: string }): Promise<Viagem[]> {
    const params = new URLSearchParams();
    if (filters?.origem) params.append('origem', filters.origem);
    if (filters?.destino) params.append('destino', filters.destino);
    if (filters?.data) params.append('data', filters.data);

    const res = await fetch(`${API_BASE}/viagens?${params.toString()}`);
    if (!res.ok) throw new Error('Falha ao carregar viagens');
    return res.json();
  },

  async getViagem(id: number): Promise<Viagem> {
    const res = await fetch(`${API_BASE}/viagens/${id}`);
    if (!res.ok) throw new Error('Viagem não encontrada');
    return res.json();
  },

  // Lugares da Viagem
  async getLugaresDaViagem(viagemId: number): Promise<{
    viagemId: number;
    viatura: string;
    capacidade: number;
    preco: number;
    lugares: Lugar[];
  }> {
    const res = await fetch(`${API_BASE}/viagens/${viagemId}/lugares`);
    if (!res.ok) throw new Error('Falha ao obter lugares');
    return res.json();
  },

  // Criar Reserva
  async criarReserva(viagemId: number, lugarNumero: number, cliente: Partial<Cliente>): Promise<{
    reserva: Reserva;
    pagamento: Pagamento;
  }> {
    const res = await fetch(`${API_BASE}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viagemId, lugarNumero, cliente })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erro ao processar reserva');
    }
    return data;
  },

  // Obter Reserva
  async getReserva(id: number | string): Promise<{
    reserva: Reserva;
    pagamento: Pagamento;
    viagem: Viagem;
  }> {
    const res = await fetch(`${API_BASE}/reservas/${id}`);
    if (!res.ok) throw new Error('Reserva não encontrada');
    return res.json();
  },

  // Estado do Pagamento & Timer do Servidor
  async getEstadoPagamento(pagamentoId: number): Promise<Pagamento> {
    const res = await fetch(`${API_BASE}/pagamentos/${pagamentoId}/estado`);
    if (!res.ok) throw new Error('Pagamento não encontrado');
    return res.json();
  },

  // Simular Pagamento (Ambiente de Testes)
  async simularPagamento(pagamentoId: number): Promise<{
    success: boolean;
    bilhete: Bilhete;
    reserva: Reserva;
    pagamento: Pagamento;
  }> {
    const res = await fetch(`${API_BASE}/pagamentos/${pagamentoId}/simular`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao simular pagamento');
    return data;
  },

  // Obter Bilhete
  async getBilhete(id: number | string): Promise<Bilhete> {
    const res = await fetch(`${API_BASE}/bilhetes/${id}`);
    if (!res.ok) throw new Error('Bilhete não encontrado');
    return res.json();
  },

  // Consultar Bilhete por Número
  async consultarBilhete(numero: string): Promise<Bilhete> {
    const res = await fetch(`${API_BASE}/bilhetes/consultar/search?numero=${encodeURIComponent(numero)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'BILHETE NÃO ENCONTRADO');
    return data;
  },

  // Validar Bilhete via Código QR
  async validarBilhete(codigo: string): Promise<{
    valido: boolean;
    mensagem?: string;
    numeroBilhete: string;
    codigoReserva: string;
    passageiro: string;
    telefone: string;
    numeroBi?: string;
    origem: string;
    destino: string;
    dataViagem: string;
    horaPartida: string;
    duracaoEstimada: string;
    lugarNumero: number;
    viatura: string;
    viaturaMatricula: string;
    valor: number;
    estado: string;
    emitidoEm: string;
    utilizadoEm?: string;
  }> {
    const res = await fetch(`${API_BASE}/bilhetes/${encodeURIComponent(codigo)}/validar`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensagem || 'Código de bilhete inválido');
    return data;
  },

  // Fazer Check-in / Embarque
  async embarcarPassageiro(codigo: string): Promise<{ success: boolean; bilhete: Bilhete }> {
    const res = await fetch(`${API_BASE}/bilhetes/${encodeURIComponent(codigo)}/checkin`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Falha ao validar embarque');
    return data;
  },

  // Métricas do Admin
  async getAdminDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/dashboard`);
    if (!res.ok) throw new Error('Falha ao obter dados operacionais');
    return res.json();
  },

  // Obter notificações por Reserva
  async getNotificacoesReserva(reservaId: number | string): Promise<Notificacao[]> {
    const res = await fetch(`${API_BASE}/notificacoes/reserva/${reservaId}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Obter notificações por Bilhete
  async getNotificacoesBilhete(codigoBilhete: string): Promise<Notificacao[]> {
    const res = await fetch(`${API_BASE}/notificacoes/bilhete/${encodeURIComponent(codigoBilhete)}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Enviar / Reenviar Notificação por SMS
  async enviarSmsNotificacao(params: {
    destinatario: string;
    tipo: 'RESERVA' | 'BILHETE';
    id: string | number;
  }): Promise<{ success: boolean; notificacao: Notificacao }> {
    const res = await fetch(`${API_BASE}/notificacoes/enviar-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao enviar SMS');
    return data;
  },

  // Enviar / Reenviar Notificação por E-mail
  async enviarEmailNotificacao(params: {
    destinatario: string;
    tipo: 'RESERVA' | 'BILHETE';
    id: string | number;
  }): Promise<{ success: boolean; notificacao: Notificacao }> {
    const res = await fetch(`${API_BASE}/notificacoes/enviar-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao enviar E-mail');
    return data;
  }
};
