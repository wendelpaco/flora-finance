import { Transaction } from "@prisma/client";

/**
 * Gera o prompt para o OpenAI criar um resumo financeiro.
 *
 * @param transactions Lista de transações do usuário
 */
export function generateSummaryPrompt(transactions: Transaction[]): string {
  const transacoesFormatadas = transactions
    .map((t) => {
      const tipo = t.type === "GANHO" ? "ganho" : "gasto";
      return `${tipo} de R$${t.amount} na categoria ${t.category}`;
    })
    .join("; ");

  return `
Receba transações financeiras e gere um resumo.

Transações:
${transacoesFormatadas}

Responda apenas no formato JSON:
{
  "resumoTexto": "texto motivador",
  "totalGastos": número,
  "totalGanhos": número,
  "saldoFinal": número,
  "gastosPorCategoria": {
    "categoria1": número,
    "categoria2": número
  }
}

Instruções:
- Se não houver transações, retorne todos os valores zerados e objeto vazio.
- Não adicione nenhum comentário ou texto fora do JSON.
`;
}
