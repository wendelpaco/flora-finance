export interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  tipo: "GANHO" | "GASTO";
  categoria: string;
  pago: boolean;
  data: Date;
}
