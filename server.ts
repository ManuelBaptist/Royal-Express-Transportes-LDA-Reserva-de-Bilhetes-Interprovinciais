import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

// Types matching MySQL Schema
export interface ClienteData {
  id: number;
  nomeCompleto: string;
  telefone: string;
  email: string;
  numeroBi?: string;
  provincia?: string;
  municipio?: string;
  endereco?: string;
}

export interface ViaturaData {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
  ano: number;
  capacidade: number;
}

export interface RotaData {
  id: number;
  origem: string;
  destino: string;
  distanciaKm: number;
  duracaoEstimada: string;
  precoBase: number;
  descricao: string;
}

export interface ViagemData {
  id: number;
  rotaId: number;
  origem: string;
  destino: string;
  distanciaKm: number;
  duracaoEstimada: string;
  dataViagem: string; // YYYY-MM-DD
  horaPartida: string; // HH:mm
  horaChegadaEstimada: string;
  preco: number;
  viatura: string;
  viaturaMatricula: string;
  capacidade: number;
  estado: string;
}

export interface LugarData {
  id: number;
  viaturaId: number;
  numero: number;
  fila: number;
  coluna: 'A' | 'B' | 'C' | 'D';
  tipo: 'NORMAL' | 'PRIORITARIO' | 'MOTORISTA' | 'BLOQUEADO';
  estado: 'DISPONIVEL' | 'SELECCIONADO' | 'OCUPADO' | 'RESERVADO_TEMPORARIAMENTE' | 'BLOQUEADO';
}

export interface ReservaData {
  id: number; // Internal ID, ex: 145
  codigoReserva: string; // Public code, ex: RE-20261003-000145
  cliente: ClienteData;
  viagemId: number;
  lugarId: number;
  lugarNumero: number;
  estado: 'PENDENTE_PAGAMENTO' | 'CONFIRMADA' | 'EXPIRADA' | 'CANCELADA' | 'UTILIZADA';
  valor: number;
  createdAt: string; // ISO
  expiresAt: string; // ISO (createdAt + 60 min)
  confirmedAt?: string;
}

export interface PagamentoData {
  id: number;
  reservaId: number;
  codigoReserva: string;
  entidade: string; // "00578"
  referencia: string; // 9 digits, ex: "842731905"
  valor: number;
  moeda: string; // "AOA"
  estado: 'PENDENTE' | 'PROCESSANDO' | 'PAGO' | 'FALHOU' | 'EXPIRADO' | 'CANCELADO';
  metodoPagamento: string;
  provider: string;
  transactionId?: string;
  createdAt: string;
  expiresAt: string;
  paidAt?: string;
}

export interface BilheteData {
  id: number;
  numeroBilhete: string; // ex: "RX-20261003-000145"
  reservaId: number;
  codigoReserva: string;
  qrCodeUrl: string;
  estado: 'EMITIDO' | 'EMBARCADO' | 'CANCELADO' | 'EXPIRADO';
  emitidoEm: string;
  utilizadoEm?: string;
  // Detalhes desnormalizados para visualização rápida e fiscalização offline
  passageiro: string;
  telefone: string;
  email: string;
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
}

export interface NotificacaoData {
  id: number;
  tipo: 'SMS' | 'EMAIL';
  evento: 'RESERVA_CRIADA' | 'PAGAMENTO_CONFIRMADO' | 'BILHETE_EMITIDO';
  destinatario: string;
  assunto?: string;
  mensagem: string;
  conteudoHtml?: string;
  status: 'ENVIADO' | 'PENDENTE' | 'FALHA';
  reservaId?: number;
  codigoReserva?: string;
  bilheteId?: number;
  numeroBilhete?: string;
  linkBilhete?: string;
  enviadoEm: string;
}

// In-Memory Database store seeded with authentic Angola bus data
class DatabaseStore {
  rotas: RotaData[] = [
    { id: 1, origem: 'Luanda', destino: 'Benguela', distanciaKm: 540, duracaoEstimada: '8h30', precoBase: 18000, descricao: 'Viagem expressa via Sumbe e Lobito com paragem técnica e máximo conforto.' },
    { id: 2, origem: 'Luanda', destino: 'Huambo', distanciaKm: 590, duracaoEstimada: '9h30', precoBase: 19000, descricao: 'Ligação directa ao Planalto Central de Angola em autocarro executivo climatizado.' },
    { id: 3, origem: 'Luanda', destino: 'Bié', distanciaKm: 680, duracaoEstimada: '11h00', precoBase: 21000, descricao: 'Linha regular para o Cuíto com segurança e pontualidade Royal Express.' },
    { id: 4, origem: 'Luanda', destino: 'Waku Kungu', distanciaKm: 410, duracaoEstimada: '6h30', precoBase: 15000, descricao: 'Trajecto pelo Kwanza Sul com paisagens deslumbrantes e condução defensiva.' },
    { id: 5, origem: 'Luanda', destino: 'Soyo', distanciaKm: 480, duracaoEstimada: '7h30', precoBase: 17000, descricao: 'Ligação à província do Zaire com saídas matinais.' },
    { id: 6, origem: 'Luanda', destino: 'Kibala', distanciaKm: 320, duracaoEstimada: '5h00', precoBase: 11000, descricao: 'Percurso confortável pelo centro de Angola.' },
    { id: 7, origem: 'Benguela', destino: 'Luanda', distanciaKm: 540, duracaoEstimada: '8h30', precoBase: 18000, descricao: 'Retorno para a capital Luanda em autocarro de luxo.' },
    { id: 8, origem: 'Huambo', destino: 'Luanda', distanciaKm: 590, duracaoEstimada: '9h30', precoBase: 19000, descricao: 'Retorno do Huambo para Luanda com todo o conforto.' }
  ];

  viaturas: ViaturaData[] = [
    { id: 1, matricula: 'LD-84-21-HG', marca: 'Volvo', modelo: 'B11R Marcopolo G7', ano: 2023, capacidade: 50 },
    { id: 2, matricula: 'LD-52-90-JK', marca: 'Volvo', modelo: 'B11R Marcopolo G7', ano: 2023, capacidade: 50 },
    { id: 3, matricula: 'LD-19-44-MN', marca: 'Volvo', modelo: 'B11R Marcopolo G7', ano: 2024, capacidade: 50 },
    { id: 4, matricula: 'LD-77-33-OP', marca: 'Scania', modelo: 'K410 Marcopolo G8', ano: 2024, capacidade: 50 }
  ];

  // Helper to generate today and upcoming dates
  getTodayDateString(offsetDays = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  viagens: ViagemData[] = [];
  reservas: ReservaData[] = [];
  pagamentos: PagamentoData[] = [];
  bilhetes: BilheteData[] = [];
  notificacoes: NotificacaoData[] = [];

  private nextReservaId = 145;
  private nextPagamentoId = 1001;
  private nextBilheteId = 501;
  private nextNotificacaoId = 101;

  constructor() {
    this.seedTrips();
    this.seedInitialBookings();

    // REGRA 12 & 22: Servidor verifica automaticamente a cada 10 segundos
    // se o prazo de 60 minutos expirou (expires_at) para libertar o lugar
    setInterval(() => {
      this.verificarExpiracoesAutomaticas();
    }, 10000);
  }

  private seedTrips() {
    const today = this.getTodayDateString(0);
    const tomorrow = this.getTodayDateString(1);
    const dayAfter = this.getTodayDateString(2);

    const tripSeeds = [
      // Luanda -> Benguela (4 viagens por dia)
      { id: 1, rotaId: 1, origem: 'Luanda', destino: 'Benguela', dist: 540, dur: '8h30', data: today, partida: '06:30', chegada: '15:00', preco: 18000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-84-21-HG' },
      { id: 2, rotaId: 1, origem: 'Luanda', destino: 'Benguela', dist: 540, dur: '8h30', data: today, partida: '10:00', chegada: '18:30', preco: 18000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-52-90-JK' },
      { id: 3, rotaId: 1, origem: 'Luanda', destino: 'Benguela', dist: 540, dur: '8h30', data: today, partida: '14:00', chegada: '22:30', preco: 18000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-84-21-HG' },
      { id: 4, rotaId: 1, origem: 'Luanda', destino: 'Benguela', dist: 540, dur: '8h30', data: today, partida: '17:00', chegada: '01:30', preco: 18000, viatura: 'Scania K410 Marcopolo G8', mat: 'LD-77-33-OP' },
      
      // Luanda -> Huambo
      { id: 5, rotaId: 2, origem: 'Luanda', destino: 'Huambo', dist: 590, dur: '9h30', data: today, partida: '06:00', chegada: '15:30', preco: 19000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-19-44-MN' },
      { id: 6, rotaId: 2, origem: 'Luanda', destino: 'Huambo', dist: 590, dur: '9h30', data: today, partida: '13:00', chegada: '22:30', preco: 19000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-52-90-JK' },
      
      // Luanda -> Bié
      { id: 7, rotaId: 3, origem: 'Luanda', destino: 'Bié', dist: 680, dur: '11h00', data: today, partida: '05:30', chegada: '16:30', preco: 21000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-84-21-HG' },

      // Luanda -> Waku Kungu
      { id: 8, rotaId: 4, origem: 'Luanda', destino: 'Waku Kungu', dist: 410, dur: '6h30', data: today, partida: '07:30', chegada: '14:00', preco: 15000, viatura: 'Scania K410 Marcopolo G8', mat: 'LD-77-33-OP' },

      // Luanda -> Soyo
      { id: 9, rotaId: 5, origem: 'Luanda', destino: 'Soyo', dist: 480, dur: '7h30', data: today, partida: '06:00', chegada: '13:30', preco: 17000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-19-44-MN' },

      // Luanda -> Kibala
      { id: 10, rotaId: 6, origem: 'Luanda', destino: 'Kibala', dist: 320, dur: '5h00', data: today, partida: '08:00', chegada: '13:00', preco: 11000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-52-90-JK' },

      // Amanhã (Tomorrow trips)
      { id: 11, rotaId: 1, origem: 'Luanda', destino: 'Benguela', dist: 540, dur: '8h30', data: tomorrow, partida: '06:30', chegada: '15:00', preco: 18000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-84-21-HG' },
      { id: 12, rotaId: 1, origem: 'Luanda', destino: 'Benguela', dist: 540, dur: '8h30', data: tomorrow, partida: '10:00', chegada: '18:30', preco: 18000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-52-90-JK' },
      { id: 13, rotaId: 2, origem: 'Luanda', destino: 'Huambo', dist: 590, dur: '9h30', data: tomorrow, partida: '06:00', chegada: '15:30', preco: 19000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-19-44-MN' },
      
      // Depois de amanhã
      { id: 14, rotaId: 1, origem: 'Luanda', destino: 'Benguela', dist: 540, dur: '8h30', data: dayAfter, partida: '06:30', chegada: '15:00', preco: 18000, viatura: 'Volvo B11R Marcopolo G7', mat: 'LD-84-21-HG' }
    ];

    this.viagens = tripSeeds.map(t => ({
      id: t.id,
      rotaId: t.rotaId,
      origem: t.origem,
      destino: t.destino,
      distanciaKm: t.dist,
      duracaoEstimada: t.dur,
      dataViagem: t.data,
      horaPartida: t.partida,
      horaChegadaEstimada: t.chegada,
      preco: t.preco,
      viatura: t.viatura,
      viaturaMatricula: t.mat,
      capacidade: 50,
      estado: 'AGENDADA'
    }));
  }

  private seedInitialBookings() {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();
    const fortyMinutesLeft = new Date(now.getTime() + 40 * 60 * 1000).toISOString();

    // 1. Bilhete oficial de exemplo (conforme protótipo visual da imagem 4: Luanda -> Benguela, Bilhete Nº RE-0012 / RX-20261003-000012, Lugar 12, Manuel Baptista, 18.000 Kz)
    const cliente1: ClienteData = {
      id: 1,
      nomeCompleto: 'Manuel Baptista',
      telefone: '+244 931 324 022',
      email: 'manuelbaptista2023@gmail.com',
      numeroBi: '006245891LA042',
      provincia: 'Luanda',
      municipio: 'Talatona',
      endereco: 'Gamek, Nosso Centro'
    };

    const reserva1: ReservaData = {
      id: 12,
      codigoReserva: 'RE-20261003-000012',
      cliente: cliente1,
      viagemId: 1, // Luanda -> Benguela 06:30
      lugarId: 12,
      lugarNumero: 12,
      estado: 'CONFIRMADA',
      valor: 18000,
      createdAt: twoHoursAgo,
      expiresAt: oneHourAgo,
      confirmedAt: oneHourAgo
    };
    this.reservas.push(reserva1);

    const pagamento1: PagamentoData = {
      id: 1001,
      reservaId: 12,
      codigoReserva: 'RE-20261003-000012',
      entidade: '00578',
      referencia: '842731905',
      valor: 18000,
      moeda: 'AOA',
      estado: 'PAGO',
      metodoPagamento: 'REFERENCIA_MULTICAIXA',
      provider: 'EMIS_MULTICAIXA',
      transactionId: 'TRX-EMIS-994821',
      createdAt: twoHoursAgo,
      expiresAt: oneHourAgo,
      paidAt: oneHourAgo
    };
    this.pagamentos.push(pagamento1);

    const bilhete1: BilheteData = {
      id: 12,
      numeroBilhete: 'RX-20261003-000012',
      reservaId: 12,
      codigoReserva: 'RE-20261003-000012',
      qrCodeUrl: '/validar/RX-20261003-000012',
      estado: 'EMITIDO',
      emitidoEm: oneHourAgo,
      passageiro: 'Manuel Baptista',
      telefone: '+244 931 324 022',
      email: 'manuelbaptista2023@gmail.com',
      numeroBi: '006245891LA042',
      origem: 'Luanda',
      destino: 'Benguela',
      dataViagem: this.getTodayDateString(0),
      horaPartida: '07:00',
      duracaoEstimada: '8h30',
      lugarNumero: 12,
      viatura: 'Volvo B11R Marcopolo G7',
      viaturaMatricula: 'LD-84-21-HG',
      valor: 18000
    };
    this.bilhetes.push(bilhete1);

    // 2. Reserva temporária activa (Lugar 07 na Viagem 1)
    const cliente2: ClienteData = {
      id: 2,
      nomeCompleto: 'Esperança dos Santos',
      telefone: '+244 923 456 789',
      email: 'esperanca.santos@gmail.com'
    };

    const reserva2: ReservaData = {
      id: 144,
      codigoReserva: 'RE-20261003-000144',
      cliente: cliente2,
      viagemId: 1,
      lugarId: 7,
      lugarNumero: 7,
      estado: 'PENDENTE_PAGAMENTO',
      valor: 18000,
      createdAt: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
      expiresAt: fortyMinutesLeft
    };
    this.reservas.push(reserva2);

    const pagamento2: PagamentoData = {
      id: 1002,
      reservaId: 144,
      codigoReserva: 'RE-20261003-000144',
      entidade: '00578',
      referencia: '910384726',
      valor: 18000,
      moeda: 'AOA',
      estado: 'PENDENTE',
      metodoPagamento: 'REFERENCIA_MULTICAIXA',
      provider: 'EMIS_MULTICAIXA',
      createdAt: reserva2.createdAt,
      expiresAt: fortyMinutesLeft
    };
    this.pagamentos.push(pagamento2);

    // Notificações iniciais de demonstração para o Bilhete 1 (Manuel Baptista)
    this.notificacoes.push({
      id: 1,
      tipo: 'SMS',
      evento: 'BILHETE_EMITIDO',
      destinatario: cliente1.telefone,
      mensagem: `Royal Express: Pagamento confirmado! O seu bilhete digital RX-20261003-000012 para Benguela (Lugar 12) esta pronto. Aceda ao bilhete oficial com QR Code no link: /bilhete/RX-20261003-000012. Compareca no terminal 30 min antes. Boa viagem!`,
      status: 'ENVIADO',
      reservaId: 12,
      codigoReserva: 'RE-20261003-000012',
      bilheteId: 1,
      numeroBilhete: 'RX-20261003-000012',
      linkBilhete: '/bilhete/RX-20261003-000012',
      enviadoEm: twoHoursAgo
    });

    this.notificacoes.push({
      id: 2,
      tipo: 'EMAIL',
      evento: 'BILHETE_EMITIDO',
      destinatario: cliente1.email,
      assunto: 'O seu Bilhete Digital RX-20261003-000012 está Pronto | Royal Express',
      mensagem: `Prezado(a) Manuel Baptista, o pagamento da sua viagem foi confirmado. O seu Bilhete Digital RX-20261003-000012 para a viagem Luanda -> Benguela (Lugar 12) está pronto. Aceda ao bilhete digital no link: /bilhete/RX-20261003-000012`,
      conteudoHtml: `<p>Bilhete digital emitido com sucesso.</p>`,
      status: 'ENVIADO',
      reservaId: 12,
      codigoReserva: 'RE-20261003-000012',
      bilheteId: 1,
      numeroBilhete: 'RX-20261003-000012',
      linkBilhete: '/bilhete/RX-20261003-000012',
      enviadoEm: twoHoursAgo
    });

    // Notificação inicial para a reserva pendente (Esperança dos Santos)
    this.notificacoes.push({
      id: 3,
      tipo: 'SMS',
      evento: 'RESERVA_CRIADA',
      destinatario: cliente2.telefone,
      mensagem: `Royal Express: Ola Esperança dos Santos, a sua reserva RE-20261003-000144 para Benguela foi gerada. Pague no Multicaixa: Entidade 00578 | Ref 910384726 | Valor 18.000 Kz. Validade: 60 min.`,
      status: 'ENVIADO',
      reservaId: 144,
      codigoReserva: 'RE-20261003-000144',
      linkBilhete: '/reservar',
      enviadoEm: reserva2.createdAt
    });
  }

  // Gera uma referência segura de 9 dígitos para Entidade 00578
  gerarReferencia(): string {
    const base = Math.floor(1000000 + Math.random() * 9000000);
    const checkDigits = Math.floor(10 + Math.random() * 89);
    return `${base}${checkDigits}`;
  }

  // Formata o código público de reserva
  gerarCodigoReserva(id: number): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `RE-${dateStr}-${String(id).padStart(6, '0')}`;
  }

  // Formata o número do bilhete digital
  gerarNumeroBilhete(id: number): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `RX-${dateStr}-${String(id).padStart(6, '0')}`;
  }

  // Enviar e registar SMS oficial
  enviarNotificacaoSms(destinatario: string, mensagem: string, extra: Partial<NotificacaoData> = {}): NotificacaoData {
    const notif: NotificacaoData = {
      id: this.nextNotificacaoId++,
      tipo: 'SMS',
      evento: extra.evento || 'BILHETE_EMITIDO',
      destinatario,
      mensagem,
      status: 'ENVIADO',
      reservaId: extra.reservaId,
      codigoReserva: extra.codigoReserva,
      bilheteId: extra.bilheteId,
      numeroBilhete: extra.numeroBilhete,
      linkBilhete: extra.linkBilhete,
      enviadoEm: new Date().toISOString()
    };
    this.notificacoes.unshift(notif);
    console.log(`[ROYAL EXPRESS SMS GATEWAY] Dispatched to ${destinatario}: "${mensagem}"`);
    return notif;
  }

  // Enviar e registar E-mail oficial formatado em HTML
  enviarNotificacaoEmail(destinatario: string, assunto: string, mensagem: string, conteudoHtml: string, extra: Partial<NotificacaoData> = {}): NotificacaoData {
    const notif: NotificacaoData = {
      id: this.nextNotificacaoId++,
      tipo: 'EMAIL',
      evento: extra.evento || 'BILHETE_EMITIDO',
      destinatario,
      assunto,
      mensagem,
      conteudoHtml,
      status: 'ENVIADO',
      reservaId: extra.reservaId,
      codigoReserva: extra.codigoReserva,
      bilheteId: extra.bilheteId,
      numeroBilhete: extra.numeroBilhete,
      linkBilhete: extra.linkBilhete,
      enviadoEm: new Date().toISOString()
    };
    this.notificacoes.unshift(notif);
    console.log(`[ROYAL EXPRESS EMAIL GATEWAY] Dispatched to ${destinatario} | Subject: "${assunto}"`);
    return notif;
  }

  // REGRA 12 & 22: Expiração controlada pelo servidor
  verificarExpiracoesAutomaticas() {
    const now = new Date();
    for (const reserva of this.reservas) {
      if (reserva.estado === 'PENDENTE_PAGAMENTO') {
        const expiresAt = new Date(reserva.expiresAt);
        if (now >= expiresAt) {
          reserva.estado = 'EXPIRADA';
          const pag = this.pagamentos.find(p => p.reservaId === reserva.id);
          if (pag && pag.estado === 'PENDENTE') {
            pag.estado = 'EXPIRADO';
          }
          console.log(`[SWEEPER] Reserva ${reserva.codigoReserva} expirou pelo servidor. Lugar ${reserva.lugarNumero} libertado.`);
        }
      }
    }
  }

  // Criação da reserva com verificação atómica de integridade
  criarReserva(viagemId: number, lugarNumero: number, clienteInput: Partial<ClienteData>): { reserva: ReservaData; pagamento: PagamentoData } {
    this.verificarExpiracoesAutomaticas();

    const viagem = this.viagens.find(v => v.id === viagemId);
    if (!viagem) {
      throw new Error(`Viagem não encontrada: ID ${viagemId}`);
    }

    if (lugarNumero < 1 || lugarNumero > 50) {
      throw new Error(`Lugar inválido. O autocarro possui lugares de 1 a 50.`);
    }

    // REGRA 17: Dois clientes não podem comprar o mesmo lugar
    const now = new Date();
    const reservaExistente = this.reservas.find(r => 
      r.viagemId === viagemId &&
      r.lugarNumero === lugarNumero &&
      (r.estado === 'CONFIRMADA' || (r.estado === 'PENDENTE_PAGAMENTO' && new Date(r.expiresAt) > now))
    );

    if (reservaExistente) {
      if (reservaExistente.estado === 'CONFIRMADA') {
        throw new Error('Este lugar já foi vendido.');
      } else {
        throw new Error('Este lugar acabou de ser reservado por outro passageiro. Por favor, escolha outro lugar.');
      }
    }

    // Dados do passageiro
    const cliente: ClienteData = {
      id: Math.floor(Math.random() * 10000),
      nomeCompleto: clienteInput.nomeCompleto || '',
      telefone: clienteInput.telefone || '',
      email: clienteInput.email || '',
      numeroBi: clienteInput.numeroBi || '',
      provincia: clienteInput.provincia || '',
      municipio: clienteInput.municipio || '',
      endereco: clienteInput.endereco || ''
    };

    const id = this.nextReservaId++;
    const codigoReserva = this.gerarCodigoReserva(id);
    const createdAt = new Date();
    // REGRA 8: 60 minutos de validade controlado pelo servidor
    const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000);

    const reserva: ReservaData = {
      id,
      codigoReserva,
      cliente,
      viagemId,
      lugarId: lugarNumero,
      lugarNumero,
      estado: 'PENDENTE_PAGAMENTO',
      valor: viagem.preco,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    };
    this.reservas.push(reserva);

    // REGRA 4 & 5 & 16: Pagamento gerado pelo servidor, Entidade 00578, Referência única 9 dígitos
    const pagamentoId = this.nextPagamentoId++;
    const referencia = this.gerarReferencia();
    const pagamento: PagamentoData = {
      id: pagamentoId,
      reservaId: id,
      codigoReserva,
      entidade: '00578',
      referencia,
      valor: viagem.preco,
      moeda: 'AOA',
      estado: 'PENDENTE',
      metodoPagamento: 'REFERENCIA_MULTICAIXA',
      provider: 'EMIS_MULTICAIXA',
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    };
    this.pagamentos.push(pagamento);

    // Disparar notificações automáticas de confirmação de reserva (SMS & E-mail)
    const smsReserva = `Royal Express: Ola ${cliente.nomeCompleto}, a sua reserva ${codigoReserva} para ${viagem.destino} foi gerada. Pague no Multicaixa: Entidade 00578 | Ref ${referencia} | Valor ${viagem.preco.toLocaleString('pt-AO')} Kz. Validade: 60 min.`;
    this.enviarNotificacaoSms(cliente.telefone, smsReserva, {
      evento: 'RESERVA_CRIADA',
      reservaId: id,
      codigoReserva,
      linkBilhete: `/reservar`
    });

    if (cliente.email) {
      const emailReservaTxt = `Prezado(a) ${cliente.nomeCompleto}, a sua reserva ${codigoReserva} para a viagem ${viagem.origem} -> ${viagem.destino} (${viagem.dataViagem} às ${viagem.horaPartida}) foi registada. Dados para pagamento Multicaixa: Entidade: 00578, Referência: ${referencia}, Valor: ${viagem.preco.toLocaleString('pt-AO')} Kz. Prazo de validade: 60 minutos.`;
      const emailReservaHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #111E2E; padding: 24px; text-align: center; border-bottom: 4px solid #440717;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold;">Royal Express Transportes</h1>
            <p style="color: #d4af37; margin: 4px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 1px;">CONFIRMAÇÃO DE RESERVA DE BILHETE</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <p style="font-size: 15px; color: #1e293b;">Olá, <strong>${cliente.nomeCompleto}</strong>,</p>
            <p style="color: #475569; font-size: 13px; line-height: 1.6;">A sua reserva de lugar na Royal Express foi registada com sucesso. Para confirmar o seu bilhete e garantir o seu lugar a bordo, efectue o pagamento no Multicaixa Express, Internet Banking ou Caixa ATM com os dados abaixo:</p>
            
            <div style="background-color: #f8fafc; border: 2px dashed #440717; border-radius: 8px; padding: 18px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #64748b;">Entidade Multicaixa:</td><td style="font-weight: bold; color: #111E2E; font-size: 15px;">00578</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;">Referência:</td><td style="font-weight: bold; color: #440717; font-size: 18px; letter-spacing: 2px;">${referencia}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;">Valor Total:</td><td style="font-weight: bold; color: #047857; font-size: 16px;">${viagem.preco.toLocaleString('pt-AO')} Kz</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;">Prazo de Validade:</td><td style="font-weight: bold; color: #b91c1c;">60 Minutos</td></tr>
              </table>
            </div>

            <div style="background-color: #f1f5f9; padding: 14px; border-radius: 8px; font-size: 13px; color: #334155; margin-bottom: 20px;">
              <strong>Detalhes da Viagem:</strong><br/>
              • Trajecto: ${viagem.origem} → ${viagem.destino}<br/>
              • Data e Hora: ${viagem.dataViagem} às ${viagem.horaPartida}<br/>
              • Lugar Atribuído: Nº ${lugarNumero}<br/>
              • Viatura: ${viagem.viatura}
            </div>
            
            <p style="color: #94a3b8; font-size: 11px; margin-top: 24px; text-align: center; border-top: 1px solid #f1f5f9; pt: 16px;">
              Royal Express Transportes, LDA · Terminal Central: Gamek, Nosso Centro, Luanda · Apoio: +244 931 324 022
            </p>
          </div>
        </div>
      `;
      this.enviarNotificacaoEmail(cliente.email, `Confirmação de Reserva ${codigoReserva} | Royal Express`, emailReservaTxt, emailReservaHtml, {
        evento: 'RESERVA_CRIADA',
        reservaId: id,
        codigoReserva
      });
    }

    return { reserva, pagamento };
  }

  // Confirmação de Pagamento & Emissão de Bilhete Digital
  confirmarPagamento(pagamentoId: number, transactionId?: string): { bilhete: BilheteData; reserva: ReservaData; pagamento: PagamentoData } {
    this.verificarExpiracoesAutomaticas();

    const pagamento = this.pagamentos.find(p => p.id === pagamentoId);
    if (!pagamento) {
      throw new Error(`Pagamento não encontrado: ID ${pagamentoId}`);
    }

    const reserva = this.reservas.find(r => r.id === pagamento.reservaId);
    if (!reserva) {
      throw new Error(`Reserva associada não encontrada`);
    }

    if (pagamento.estado === 'PAGO') {
      const bilheteExistente = this.bilhetes.find(b => b.reservaId === reserva.id);
      if (bilheteExistente) {
        return { bilhete: bilheteExistente, reserva, pagamento };
      }
    }

    const now = new Date();
    if (now > new Date(pagamento.expiresAt)) {
      pagamento.estado = 'EXPIRADO';
      reserva.estado = 'EXPIRADA';
      throw new Error('A referência de pagamento expirou. O prazo de 60 minutos foi ultrapassado.');
    }

    pagamento.estado = 'PAGO';
    pagamento.paidAt = now.toISOString();
    pagamento.transactionId = transactionId || `TRX-SIM-${Date.now()}`;

    reserva.estado = 'CONFIRMADA';
    reserva.confirmedAt = now.toISOString();

    const viagem = this.viagens.find(v => v.id === reserva.viagemId)!;
    const bilheteId = this.nextBilheteId++;
    const numeroBilhete = this.gerarNumeroBilhete(reserva.id);

    const bilhete: BilheteData = {
      id: bilheteId,
      numeroBilhete,
      reservaId: reserva.id,
      codigoReserva: reserva.codigoReserva,
      qrCodeUrl: `/validar/${numeroBilhete}`,
      estado: 'EMITIDO',
      emitidoEm: now.toISOString(),
      passageiro: reserva.cliente.nomeCompleto,
      telefone: reserva.cliente.telefone,
      email: reserva.cliente.email,
      numeroBi: reserva.cliente.numeroBi,
      origem: viagem.origem,
      destino: viagem.destino,
      dataViagem: viagem.dataViagem,
      horaPartida: viagem.horaPartida,
      duracaoEstimada: viagem.duracaoEstimada,
      lugarNumero: reserva.lugarNumero,
      viatura: viagem.viatura,
      viaturaMatricula: viagem.viaturaMatricula,
      valor: reserva.valor
    };
    this.bilhetes.push(bilhete);

    // Disparar notificações automáticas de emissão do bilhete oficial (SMS & E-mail)
    const urlBilhete = `/bilhete/${numeroBilhete}`;
    const smsBilhete = `Royal Express: Pagamento confirmado! O seu bilhete digital ${numeroBilhete} para ${viagem.destino} (Lugar ${reserva.lugarNumero}) esta pronto. Aceda ao bilhete com QR Code no link: ${urlBilhete}. Compareca no terminal 30 min antes. Boa viagem!`;
    this.enviarNotificacaoSms(reserva.cliente.telefone, smsBilhete, {
      evento: 'BILHETE_EMITIDO',
      reservaId: reserva.id,
      codigoReserva: reserva.codigoReserva,
      bilheteId,
      numeroBilhete,
      linkBilhete: urlBilhete
    });

    if (reserva.cliente.email) {
      const emailBilheteTxt = `Prezado(a) ${reserva.cliente.nomeCompleto}, o pagamento da sua viagem foi confirmado com sucesso. O seu bilhete digital ${numeroBilhete} para ${viagem.origem} -> ${viagem.destino} (Lugar ${reserva.lugarNumero}) está pronto. Aceda ao bilhete oficial com QR Code: ${urlBilhete}`;
      const emailBilheteHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #111E2E; padding: 24px; text-align: center; border-bottom: 4px solid #440717;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold;">Royal Express Transportes</h1>
            <p style="color: #10b981; margin: 4px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 1px;">✓ BILHETE DIGITAL OFICIAL DE EMBARQUE</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <p style="font-size: 15px; color: #1e293b;">Olá, <strong>${reserva.cliente.nomeCompleto}</strong>,</p>
            <p style="color: #475569; font-size: 13px; line-height: 1.6;">O seu pagamento por Multicaixa foi confirmado com sucesso! O seu bilhete de embarque com código QR oficial foi emitido.</p>
            
            <div style="background-color: #440717; color: #ffffff; border-radius: 10px; padding: 18px; margin: 20px 0; text-align: center;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;">Bilhete Oficial Nº</span>
              <h2 style="font-size: 22px; margin: 4px 0; letter-spacing: 1px; color: #fbbf24;">${numeroBilhete}</h2>
              <p style="margin: 0; font-size: 14px; font-weight: bold;">${viagem.origem.toUpperCase()} → ${viagem.destino.toUpperCase()}</p>
            </div>

            <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Data de Viagem:</td><td style="font-weight: bold; color: #1e293b;">${viagem.dataViagem}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Hora de Partida:</td><td style="font-weight: bold; color: #1e293b;">${viagem.horaPartida} (${viagem.duracaoEstimada})</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Lugar Atribuído:</td><td style="font-weight: bold; color: #440717; font-size: 15px;">LUGAR Nº ${reserva.lugarNumero < 10 ? '0' + reserva.lugarNumero : reserva.lugarNumero}</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Viatura:</td><td style="color: #1e293b;">${viagem.viatura} (${viagem.viaturaMatricula})</td></tr>
              <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Valor Liquidado:</td><td style="font-weight: bold; color: #059669;">${reserva.valor.toLocaleString('pt-AO')} Kz (PAGO)</td></tr>
            </table>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${urlBilhete}" style="background-color: #440717; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">
                Aceder ao Bilhete Digital com QR Code
              </a>
            </div>

            <div style="background-color: #f8fafc; border-left: 4px solid #440717; padding: 12px; font-size: 11px; color: #64748b; line-height: 1.5;">
              <strong>Instruções de Embarque:</strong><br/>
              • Compareça no Terminal Gamek com pelo menos 30 minutos de antecedência.<br/>
              • Apresente este bilhete digital no seu telemóvel ou impresso com o documento de identificação original.<br/>
              • Bagagem permitida: 1 mala de porão até 25 kg e 1 mala de mão.
            </div>

            <p style="color: #94a3b8; font-size: 11px; margin-top: 24px; text-align: center; border-top: 1px solid #f1f5f9; pt: 16px;">
              Royal Express Transportes, LDA · Terminal Central: Gamek, Nosso Centro, Luanda · Apoio: +244 931 324 022
            </p>
          </div>
        </div>
      `;
      this.enviarNotificacaoEmail(reserva.cliente.email, `O seu Bilhete Digital ${numeroBilhete} está Pronto | Royal Express`, emailBilheteTxt, emailBilheteHtml, {
        evento: 'BILHETE_EMITIDO',
        reservaId: reserva.id,
        codigoReserva: reserva.codigoReserva,
        bilheteId,
        numeroBilhete,
        linkBilhete: urlBilhete
      });
    }

    return { bilhete, reserva, pagamento };
  }
}

const db = new DatabaseStore();

async function startServer() {
  const app = express();
  app.use(express.json());

  // ---------------------------------------------------------------
  // REST API ROUTES
  // ---------------------------------------------------------------

  // 1. GET /api/rotas
  app.get('/api/rotas', (req: Request, res: Response) => {
    res.json(db.rotas);
  });

  // 2. GET /api/viagens (with filters: origem, destino, data)
  app.get('/api/viagens', (req: Request, res: Response) => {
    const { origem, destino, data } = req.query;
    db.verificarExpiracoesAutomaticas();

    let list = db.viagens;
    if (origem) {
      list = list.filter(v => v.origem.toLowerCase() === String(origem).toLowerCase());
    }
    if (destino) {
      list = list.filter(v => v.destino.toLowerCase() === String(destino).toLowerCase());
    }
    if (data) {
      list = list.filter(v => v.dataViagem === String(data));
    }

    const now = new Date();
    // Calculate available seats in real-time
    const response = list.map(v => {
      const activeReservations = db.reservas.filter(r => 
        r.viagemId === v.id &&
        (r.estado === 'CONFIRMADA' || (r.estado === 'PENDENTE_PAGAMENTO' && new Date(r.expiresAt) > now))
      );
      const lugaresDisponiveis = Math.max(0, v.capacidade - activeReservations.length);
      return {
        ...v,
        lugaresDisponiveis
      };
    });

    res.json(response);
  });

  // 3. GET /api/viagens/:id
  app.get('/api/viagens/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const viagem = db.viagens.find(v => v.id === id);
    if (!viagem) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }
    res.json(viagem);
  });

  // 4. GET /api/viagens/:id/lugares (Bus seat map with server-computed states)
  app.get('/api/viagens/:id/lugares', (req: Request, res: Response) => {
    const viagemId = Number(req.params.id);
    db.verificarExpiracoesAutomaticas();

    const viagem = db.viagens.find(v => v.id === viagemId);
    if (!viagem) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    const now = new Date();
    const activeReservations = db.reservas.filter(r => 
      r.viagemId === viagemId &&
      (r.estado === 'CONFIRMADA' || (r.estado === 'PENDENTE_PAGAMENTO' && new Date(r.expiresAt) > now))
    );

    const seatMap: LugarData[] = [];
    // 50 seats layout: 13 rows
    for (let num = 1; num <= 50; num++) {
      const row = Math.ceil(num / 4);
      const colMod = (num - 1) % 4;
      const colMap: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
      const col = colMap[colMod];

      let estado: LugarData['estado'] = 'DISPONIVEL';
      const reserva = activeReservations.find(r => r.lugarNumero === num);
      if (reserva) {
        if (reserva.estado === 'CONFIRMADA') {
          estado = 'OCUPADO';
        } else if (reserva.estado === 'PENDENTE_PAGAMENTO') {
          estado = 'RESERVADO_TEMPORARIAMENTE';
        }
      }

      seatMap.push({
        id: num,
        viaturaId: 1,
        numero: num,
        fila: row,
        coluna: col,
        tipo: num <= 3 ? 'PRIORITARIO' : 'NORMAL',
        estado
      });
    }

    res.json({
      viagemId: viagem.id,
      viatura: viagem.viatura,
      capacidade: viagem.capacidade,
      preco: viagem.preco,
      lugares: seatMap
    });
  });

  // 5. POST /api/reservas (Create reservation & payment reference)
  app.post('/api/reservas', (req: Request, res: Response) => {
    try {
      const { viagemId, lugarNumero, cliente } = req.body;
      if (!viagemId || !lugarNumero || !cliente || !cliente.nomeCompleto || !cliente.telefone) {
        return res.status(400).json({ error: 'Campos obrigatórios em falta (viagem, lugar, nome e telefone).' });
      }

      const { reserva, pagamento } = db.criarReserva(Number(viagemId), Number(lugarNumero), cliente);
      res.status(201).json({ reserva, pagamento });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Erro ao criar reserva' });
    }
  });

  // 6. GET /api/reservas/:id
  app.get('/api/reservas/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const reserva = db.reservas.find(r => r.id === id || r.codigoReserva === req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    const pagamento = db.pagamentos.find(p => p.reservaId === reserva.id);
    const viagem = db.viagens.find(v => v.id === reserva.viagemId);
    res.json({ reserva, pagamento, viagem });
  });

  // 7. GET /api/pagamentos/:id
  app.get('/api/pagamentos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const pagamento = db.pagamentos.find(p => p.id === id);
    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }
    res.json(pagamento);
  });

  // 8. GET /api/pagamentos/:id/estado (REGRA 3 & 10 & 20: Server-authoritative timer & state)
  app.get('/api/pagamentos/:id/estado', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    db.verificarExpiracoesAutomaticas();

    const pagamento = db.pagamentos.find(p => p.id === id);
    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    const now = new Date();
    const expiresAt = new Date(pagamento.expiresAt);
    let segundosRestantes = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
    if (segundosRestantes < 0) segundosRestantes = 0;

    const bilhete = db.bilhetes.find(b => b.reservaId === pagamento.reservaId);

    res.json({
      id: pagamento.id,
      reservaId: pagamento.reservaId,
      codigoReserva: pagamento.codigoReserva,
      entidade: pagamento.entidade,
      referencia: pagamento.referencia,
      valor: pagamento.valor,
      moeda: pagamento.moeda,
      estado: pagamento.estado,
      serverTime: now.toISOString(),
      expiresAt: pagamento.expiresAt,
      segundosRestantes,
      expirado: now > expiresAt && pagamento.estado !== 'PAGO',
      bilheteId: bilhete ? bilhete.id : null,
      numeroBilhete: bilhete ? bilhete.numeroBilhete : null
    });
  });

  // 9. POST /api/pagamentos/:id/simular (Test Environment Mock Simulator)
  app.post('/api/pagamentos/:id/simular', (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = db.confirmarPagamento(id, `SIM-EMIS-${Date.now()}`);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Erro ao simular pagamento' });
    }
  });

  // 10. POST /api/pagamentos/:id/webhook (Bank / EMIS webhook endpoint)
  app.post('/api/pagamentos/:id/webhook', (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { transactionId } = req.body;
      const result = db.confirmarPagamento(id, transactionId);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Erro no webhook' });
    }
  });

  // 11. GET /api/bilhetes/:id
  app.get('/api/bilhetes/:id', (req: Request, res: Response) => {
    const idParam = req.params.id;
    const bilhete = db.bilhetes.find(b => 
      String(b.id) === idParam || 
      b.numeroBilhete.toUpperCase() === idParam.toUpperCase() ||
      b.codigoReserva.toUpperCase() === idParam.toUpperCase()
    );
    if (!bilhete) {
      return res.status(404).json({ error: 'Bilhete não encontrado' });
    }
    res.json(bilhete);
  });

  // 12. GET /api/bilhetes/consultar?numero=... (REGRA 29)
  app.get('/api/bilhetes/consultar/search', (req: Request, res: Response) => {
    const query = String(req.query.numero || '').trim().toUpperCase();
    if (!query) {
      return res.status(400).json({ error: 'Número de bilhete obrigatório' });
    }

    const bilhete = db.bilhetes.find(b => 
      b.numeroBilhete.toUpperCase() === query || 
      b.codigoReserva.toUpperCase() === query ||
      b.telefone.replace(/\s+/g, '') === query.replace(/\s+/g, '')
    );

    if (!bilhete) {
      return res.status(404).json({ error: 'BILHETE NÃO ENCONTRADO' });
    }
    res.json(bilhete);
  });

  // 13. GET /api/bilhetes/:codigo/validar (REGRA 28: Validation page endpoint for ticket check-in)
  app.get('/api/bilhetes/:codigo/validar', (req: Request, res: Response) => {
    const codigo = req.params.codigo.trim().toUpperCase();
    const bilhete = db.bilhetes.find(b => b.numeroBilhete.toUpperCase() === codigo || b.codigoReserva.toUpperCase() === codigo);

    if (!bilhete) {
      return res.status(404).json({
        valido: false,
        mensagem: 'BILHETE NÃO ENCONTRADO OU INVÁLIDO'
      });
    }

    const valido = bilhete.estado === 'EMITIDO';
    res.json({
      valido,
      numeroBilhete: bilhete.numeroBilhete,
      codigoReserva: bilhete.codigoReserva,
      passageiro: bilhete.passageiro,
      telefone: bilhete.telefone,
      numeroBi: bilhete.numeroBi,
      origem: bilhete.origem,
      destino: bilhete.destino,
      dataViagem: bilhete.dataViagem,
      horaPartida: bilhete.horaPartida,
      duracaoEstimada: bilhete.duracaoEstimada,
      lugarNumero: bilhete.lugarNumero,
      viatura: bilhete.viatura,
      viaturaMatricula: bilhete.viaturaMatricula,
      valor: bilhete.valor,
      estado: bilhete.estado,
      emitidoEm: bilhete.emitidoEm,
      utilizadoEm: bilhete.utilizadoEm
    });
  });

  // 14. POST /api/bilhetes/:codigo/checkin (Embarque passageiro)
  app.post('/api/bilhetes/:codigo/checkin', (req: Request, res: Response) => {
    const codigo = req.params.codigo.trim().toUpperCase();
    const bilhete = db.bilhetes.find(b => b.numeroBilhete.toUpperCase() === codigo);
    if (!bilhete) {
      return res.status(404).json({ error: 'Bilhete não encontrado' });
    }
    if (bilhete.estado !== 'EMITIDO') {
      return res.status(400).json({ error: `Bilhete não está emitido. Estado actual: ${bilhete.estado}` });
    }
    bilhete.estado = 'EMBARCADO';
    bilhete.utilizadoEm = new Date().toISOString();
    res.json({ success: true, bilhete });
  });

  // 15. GET /api/admin/dashboard (Dashboard operacional e métricas)
  app.get('/api/admin/dashboard', (req: Request, res: Response) => {
    db.verificarExpiracoesAutomaticas();
    const today = db.getTodayDateString(0);
    const viagensHoje = db.viagens.filter(v => v.dataViagem === today);
    const bilhetesEmitidos = db.bilhetes.length;

    const receitaTotal = db.pagamentos
      .filter(p => p.estado === 'PAGO')
      .reduce((acc, p) => acc + p.valor, 0);

    const reservasHoje = db.reservas.filter(r => r.createdAt.startsWith(today)).length;
    const pagamentosPendentes = db.pagamentos.filter(p => p.estado === 'PENDENTE').length;

    res.json({
      viagensHoje: viagensHoje.length,
      reservasHoje,
      bilhetesVendidos: bilhetesEmitidos,
      receitaTotalKz: receitaTotal,
      pagamentosPendentes,
      frotasTotal: db.viaturas.length,
      rotasTotal: db.rotas.length,
      ultimasReservas: db.reservas.slice(-5).reverse(),
      ultimosBilhetes: db.bilhetes.slice(-5).reverse()
    });
  });

  // 16. GET /api/notificacoes/reserva/:id (Histórico de notificações de reserva)
  app.get('/api/notificacoes/reserva/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const notifs = db.notificacoes.filter(n => 
      String(n.reservaId) === id || n.codigoReserva?.toUpperCase() === id.toUpperCase()
    );
    res.json(notifs);
  });

  // 17. GET /api/notificacoes/bilhete/:codigo (Histórico de notificações de bilhete)
  app.get('/api/notificacoes/bilhete/:codigo', (req: Request, res: Response) => {
    const codigo = req.params.codigo.trim().toUpperCase();
    const notifs = db.notificacoes.filter(n => 
      n.numeroBilhete?.toUpperCase() === codigo || n.codigoReserva?.toUpperCase() === codigo
    );
    res.json(notifs);
  });

  // 18. POST /api/notificacoes/enviar-sms (Envio / Reenvio de SMS sob demanda)
  app.post('/api/notificacoes/enviar-sms', (req: Request, res: Response) => {
    try {
      const { destinatario, tipo, id } = req.body;
      if (!destinatario) {
        return res.status(400).json({ error: 'Número de telemóvel é obrigatório' });
      }

      if (tipo === 'BILHETE') {
        const bilhete = db.bilhetes.find(b => b.numeroBilhete.toUpperCase() === String(id).toUpperCase());
        if (!bilhete) return res.status(404).json({ error: 'Bilhete não encontrado' });

        const urlBilhete = `/bilhete/${bilhete.numeroBilhete}`;
        const mensagem = `Royal Express: O seu bilhete digital ${bilhete.numeroBilhete} (${bilhete.origem} -> ${bilhete.destino}, Lugar ${bilhete.lugarNumero}, Data ${bilhete.dataViagem} as ${bilhete.horaPartida}) esta disponivel: ${urlBilhete}. Bom embarque!`;
        const notif = db.enviarNotificacaoSms(destinatario, mensagem, {
          evento: 'BILHETE_EMITIDO',
          reservaId: bilhete.reservaId,
          codigoReserva: bilhete.codigoReserva,
          bilheteId: bilhete.id,
          numeroBilhete: bilhete.numeroBilhete,
          linkBilhete: urlBilhete
        });
        return res.json({ success: true, notificacao: notif });
      } else {
        const reserva = db.reservas.find(r => String(r.id) === String(id) || r.codigoReserva.toUpperCase() === String(id).toUpperCase());
        if (!reserva) return res.status(404).json({ error: 'Reserva não encontrada' });
        const pagamento = db.pagamentos.find(p => p.reservaId === reserva.id);

        const mensagem = `Royal Express: A sua reserva ${reserva.codigoReserva} (Lugar ${reserva.lugarNumero}) aguarda pagamento. Entidade 00578 | Ref ${pagamento?.referencia} | Valor ${reserva.valor.toLocaleString('pt-AO')} Kz. Prazo: 60 min.`;
        const notif = db.enviarNotificacaoSms(destinatario, mensagem, {
          evento: 'RESERVA_CRIADA',
          reservaId: reserva.id,
          codigoReserva: reserva.codigoReserva,
          linkBilhete: '/reservar'
        });
        return res.json({ success: true, notificacao: notif });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao processar envio de SMS' });
    }
  });

  // 19. POST /api/notificacoes/enviar-email (Envio / Reenvio de Email sob demanda)
  app.post('/api/notificacoes/enviar-email', (req: Request, res: Response) => {
    try {
      const { destinatario, tipo, id } = req.body;
      if (!destinatario) {
        return res.status(400).json({ error: 'Endereço de email é obrigatório' });
      }

      if (tipo === 'BILHETE') {
        const bilhete = db.bilhetes.find(b => b.numeroBilhete.toUpperCase() === String(id).toUpperCase());
        if (!bilhete) return res.status(404).json({ error: 'Bilhete não encontrado' });

        const urlBilhete = `/bilhete/${bilhete.numeroBilhete}`;
        const assunto = `Bilhete Digital Oficial ${bilhete.numeroBilhete} | Royal Express`;
        const mensagem = `Prezado(a) ${bilhete.passageiro}, o seu bilhete digital para ${bilhete.origem} -> ${bilhete.destino} está pronto: ${urlBilhete}`;
        const conteudoHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="background-color: #111E2E; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0;">Royal Express Transportes</h2>
              <p style="color: #10b981; margin: 5px 0 0 0; font-size: 13px;">✓ BILHETE DIGITAL DE EMBARQUE</p>
            </div>
            <div style="padding: 20px; background-color: #ffffff;">
              <p>Olá, <strong>${bilhete.passageiro}</strong>,</p>
              <p>O seu bilhete digital para a rota <strong>${bilhete.origem} → ${bilhete.destino}</strong> (${bilhete.dataViagem} às ${bilhete.horaPartida}, Lugar Nº ${bilhete.lugarNumero}) está disponível.</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${urlBilhete}" style="background-color: #440717; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Aceder ao Bilhete com QR Code
                </a>
              </div>
            </div>
          </div>
        `;
        const notif = db.enviarNotificacaoEmail(destinatario, assunto, mensagem, conteudoHtml, {
          evento: 'BILHETE_EMITIDO',
          reservaId: bilhete.reservaId,
          codigoReserva: bilhete.codigoReserva,
          bilheteId: bilhete.id,
          numeroBilhete: bilhete.numeroBilhete,
          linkBilhete: urlBilhete
        });
        return res.json({ success: true, notificacao: notif });
      } else {
        const reserva = db.reservas.find(r => String(r.id) === String(id) || r.codigoReserva.toUpperCase() === String(id).toUpperCase());
        if (!reserva) return res.status(404).json({ error: 'Reserva não encontrada' });
        const pagamento = db.pagamentos.find(p => p.reservaId === reserva.id);

        const assunto = `Dados de Pagamento da Reserva ${reserva.codigoReserva} | Royal Express`;
        const mensagem = `Prezado(a) ${reserva.cliente.nomeCompleto}, pague a sua reserva no Multicaixa: Entidade 00578, Referência ${pagamento?.referencia}, Valor ${reserva.valor.toLocaleString('pt-AO')} Kz dentro de 60 minutos.`;
        const conteudoHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="background-color: #111E2E; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0;">Royal Express Transportes</h2>
              <p style="color: #d4af37; margin: 5px 0 0 0; font-size: 13px;">DADOS DE PAGAMENTO MULTICAIXA</p>
            </div>
            <div style="padding: 20px; background-color: #ffffff;">
              <p>Olá, <strong>${reserva.cliente.nomeCompleto}</strong>,</p>
              <p>Dados para liquidação no Multicaixa Express, ATM ou Internet Banking:</p>
              <p>• <strong>Entidade:</strong> 00578<br/>• <strong>Referência:</strong> ${pagamento?.referencia}<br/>• <strong>Valor:</strong> ${reserva.valor.toLocaleString('pt-AO')} Kz<br/>• <strong>Validade:</strong> 60 minutos</p>
            </div>
          </div>
        `;
        const notif = db.enviarNotificacaoEmail(destinatario, assunto, mensagem, conteudoHtml, {
          evento: 'RESERVA_CRIADA',
          reservaId: reserva.id,
          codigoReserva: reserva.codigoReserva,
          linkBilhete: '/reservar'
        });
        return res.json({ success: true, notificacao: notif });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao processar envio de email' });
    }
  });

  // ---------------------------------------------------------------
  // VITE DEV SERVER MIDDLEWARE
  // ---------------------------------------------------------------
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Royal Express Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
