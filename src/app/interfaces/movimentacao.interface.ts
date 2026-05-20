export interface Movimentacao {

  id?: string;
  motoristaId: string;
  motoristaNome: string;
  veiculoId: string;
  modelo: string;
  placa: string;
  observacao: string;
  dataRetirada: string;
  dataDevolucao?: string | null;
  status: 'Em uso' | 'Finalizado';
}