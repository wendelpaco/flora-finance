/**
 * Gera o prompt para interpretar um pedido de exclusão de transação.
 *
 * Exemplo de uso: "excluir gasto de 300 reais"
 */
export function generateParseExcluirPrompt(text: string): string {
  return `
Interprete a mensagem abaixo relacionada a EXCLUSÃO de uma transação financeira e extraia as informações em formato JSON puro.

Mensagem: "${text}"

Formato obrigatório da resposta:
{
  "valor": número (ex: 300),
  "tipo": "gasto" | "ganho",
  "categoria": string (opcional)
}

Regras:
- Responda **apenas com JSON**, sem markdown, sem comentários, sem formatação, ou qualquer texto extra.
- **Não inclua "json"** ou qualquer outra marcação de código.
- Caso não consiga interpretar, retorne apenas null (sem aspas, sem JSON).
- Seja preciso no reconhecimento de valores.
- Se a categoria for mencionada, inclua-a; caso contrário, ignore.

Responda **apenas o JSON ou null**.
`;
}
