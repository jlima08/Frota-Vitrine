export interface Veiculo {
  id?: string;
  modelo: string;
  ano: string;
  placa: string;
  cor: string;
  status: 'Ativo' | 'Em uso' | 'Inativo';
}