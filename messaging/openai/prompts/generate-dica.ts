/**
 * Gera o prompt para criar uma dica financeira.
 */
export function generateDicaPrompt(
  tipo: string,
  valor: number,
  descricao: string,
  totalMes: number
): string {
  return `
Usuário registrou um ${tipo} de R$${valor.toFixed(
    2
  )}, descrição: "${descricao}".
O total de ${tipo}s no mês é R$${totalMes.toFixed(2)}.

Gere uma dica financeira breve, amigável e prática para ajudar este usuário a economizar mais.

Responda apenas com o texto da dica, sem comentários ou formatação adicional.
`;
}
