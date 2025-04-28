import { logError } from "../bot/utils/logger";

/**
 * Faz o parsing seguro da resposta do OpenAI.
 * Se falhar, retorna null.
 */
export function safeParseOpenAIResponse<T = unknown>(
  content: string
): T | null {
  try {
    if (!content) return null;

    const parsed = JSON.parse(content.trim());

    return parsed;
  } catch (error) {
    logError(`❌ Erro ao parsear resposta do OpenAI: ${error}`);
    return null;
  }
}
