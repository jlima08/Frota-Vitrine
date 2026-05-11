export interface Motorista {
  id?: string;
  nome: string;
  sobrenome: string;
  celular: string;
  cargo: string;
  email: string;
  senha?: string;
  role: 'Administrador' | 'Motorista';
}
