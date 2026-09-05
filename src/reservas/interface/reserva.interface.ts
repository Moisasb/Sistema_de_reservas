export type ReservaStatus = 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA' | 'CONCLUIDA';

export interface Reserva {
  id: number;
  usuario_id: number;
  data_inicio: string;
  data_fim: string;
  quantidade_pessoas: number;
  status: ReservaStatus;
  observacoes: string | null;
  criado_em: Date;
  atualizado_em: Date;
}
