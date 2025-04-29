import { formatarValorParaBRL } from "../utils/ajustar-valor-texto";

export interface FormatTransactionMessageProps {
  descricao: string;
  valor: number;
  categoria: string;
  tipo: "GANHO" | "GASTO";
  conta: string;
  data: string;
  pago: boolean;
  saldoAtual: number;
}

export function formatTransactionMessage({
  descricao,
  valor,
  categoria,
  tipo,
  conta,
  data,
  pago,
  saldoAtual,
}: FormatTransactionMessageProps) {
  const value = formatarValorParaBRL(valor);
  const saldo = formatarValorParaBRL(saldoAtual);

  return `
🌿 Flora Finance
✅ Transação Registrada com Sucesso!

📝 Descrição: ${descricao}
💵 Valor: ${value}
🏷️ Categoria: ${categoria}
📊 Tipo: ${tipo === "GANHO" ? "Receita" : "Despesa"}
🏦 Conta: ${conta}
📅 Data: ${new Date(data).toLocaleDateString("pt-BR")}
💳 Pago: ${pago ? "✅" : "❌"}

💰 *Saldo Atual*: ${saldo}`;
  //-------------------------------------------------//
  //   BUGFIX- Gerar dicas para usuários PRO
  //-------------------------------------------------//
  //📈 Continue controlando suas finanças com inteligência! 🚀
}
