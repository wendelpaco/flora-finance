export interface ParsedFinancialMessage {
  valor: number;
  categoria:
    | "transporte"
    | "alimentação"
    | "lazer"
    | "saúde"
    | "assinaturas"
    | "vestuário"
    | "dívidas"
    | "outros"
    | "salário"
    | "freelance"
    | "presente"
    | "outros-ganhos";
  descricao: string;
  tipo: "gasto" | "ganho";
}

export interface SummaryResult {
  resumoTexto: string;
  totalGanhos: number; // Adicionando totalGanhos
  totalGastos: number; // Adicionando totalGastos
  saldoFinal: number; // Adicionando saldoFinal
  gastosPorCategoria: Record<string, number>; // Gastos por categoria
  ganhosPorCategoria: Record<string, number>; // Ganhos por categoria
}
