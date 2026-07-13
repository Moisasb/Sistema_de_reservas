export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  profissao: string;
  data_nascimento: string;
  criado_em?: string;
  atualizado_em?: string;
}
