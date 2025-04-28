/**
 * Gera o prompt para interpretar uma mensagem financeira.
 *
 * Exemplo de uso: "gastei 50 reais no mercado"
 */
export function generateParseFinancialPrompt(text: string): string {
  return `
Interprete a mensagem abaixo relacionada a finanças pessoais e extraia as informações em formato JSON puro.

Mensagem: "${text}"

Formato obrigatório da resposta:
{
  "valor": número (ex: 50),
  "categoria": "transporte" | "alimentação" | "lazer" | "saúde" | "assinaturas" | "vestuário" | "dívidas" | "outros" | "salário" | "freelance" | "presente" | "outros-ganhos",
  "descricao": "texto",  // descrição adicional do gasto ou ganho, como por exemplo "mercado", "salário"
  "tipo": "gasto" | "ganho"
}

Regras:
- Responda **apenas com JSON**, sem markdown, sem comentários, sem formatação, ou qualquer texto extra.
- **Não inclua "json"** ou qualquer outra marcação de código.
- Sempre informe se é um "gasto" ou "ganho" no campo "tipo".
- Caso não consiga interpretar, retorne apenas null (sem aspas, sem JSON).
- Não envie comentários, mensagens extras ou qualquer texto fora o JSON.
- Se a categoria não estiver clara, retorne "outros" e faça uma análise cuidadosa do contexto.

Responda **apenas o JSON ou null**.
`;
}
