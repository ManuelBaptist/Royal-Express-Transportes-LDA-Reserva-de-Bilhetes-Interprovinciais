export interface Cliente {
  id?: number;
  nomeCompleto: string;
  telefone: string;
  email?: string;
  numeroBi?: string;
  dataNascimento?: string;
  provincia?: string;
  municipio?: string;
  endereco?: string;
}

export interface Viatura {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
  ano: number;
  capacidade: number;
}

export interface Rota {
  id: number;
  origem: string;
  destino: string;
  distanciaKm: number;
  duracaoEstimada: string;
  precoBase: number;
  descricao: string;
}

export interface Viagem {
  id: number;
  rotaId: number;
  origem: string;
  destino: string;
  distanciaKm: number;
  duracaoEstimada: string;
  dataViagem: string;
  horaPartida: string;
  horaChegadaEstimada: string;
  preco: number;
  viatura: string;
  viaturaMatricula: string;
  capacidade: number;
  lugaresDisponiveis: number;
  estado: string;
}

export type EstadoLugar = 'DISPONIVEL' | 'SELECCIONADO' | 'OCUPADO' | 'RESERVADO_TEMPORARIAMENTE' | 'BLOQUEADO';

export interface Lugar {
  id: number;
  viaturaId: number;
  numero: number;
  fila: number;
  coluna: 'A' | 'B' | 'C' | 'D';
  tipo: 'NORMAL' | 'PRIORITARIO' | 'MOTORISTA' | 'BLOQUEADO';
  estado: EstadoLugar;
}

export interface Reserva {
  id: number;
  codigoReserva: string;
  cliente: Cliente;
  viagemId: number;
  lugarId: number;
  lugarNumero: number;
  estado: 'PENDENTE_PAGAMENTO' | 'CONFIRMADA' | 'EXPIRADA' | 'CANCELADA' | 'UTILIZADA';
  valor: number;
  createdAt: string;
  expiresAt: string;
  confirmedAt?: string;
}

export interface Pagamento {
  id: number;
  reservaId: number;
  codigoReserva: string;
  entidade: string;
  referencia: string;
  valor: number;
  moeda: string;
  estado: 'PENDENTE' | 'PROCESSANDO' | 'PAGO' | 'FALHOU' | 'EXPIRADO' | 'CANCELADO';
  metodoPagamento: string;
  provider: string;
  transactionId?: string;
  createdAt: string;
  expiresAt: string;
  paidAt?: string;
  serverTime?: string;
  segundosRestantes?: number;
  expirado?: boolean;
  bilheteId?: number;
  numeroBilhete?: string;
}

export interface Bilhete {
  id: number;
  numeroBilhete: string;
  reservaId: number;
  codigoReserva: string;
  qrCodeUrl: string;
  estado: 'EMITIDO' | 'EMBARCADO' | 'CANCELADO' | 'EXPIRADO';
  emitidoEm: string;
  utilizadoEm?: string;
  passageiro: string;
  telefone: string;
  email?: string;
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

export interface Notificacao {
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

