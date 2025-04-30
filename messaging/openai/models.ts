export interface ParsedFinancialMessage {
  valor: number;
  categoria:
    | "transporte"
    | "alimentação"
    | "lazer"
    | "saúde"
    | "moradia"
    | "educação"
    | "compras"
    | "entretenimento"
    | "viagens"
    | "pets"
    | "manutenção"
    | "impostos"
    | "dívidas"
    | "presentes"
    | "assinaturas"
    | "outros"
    | "salário"
    | "freelance"
    | "investimentos"
    | "vendas"
    | "prêmios"
    | "reembolsos"
    | "aposentadoria"
    | "pensão"
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
