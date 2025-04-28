import { Plan } from "@prisma/client";
import { logError, logInfo } from "../bot/utils/logger";
import { openai } from "../bot/services/openai";

/**
 * Realiza uma chamada ao OpenAI baseado no plano do usuário.
 * FREE usa gpt-3.5, PRO usa gpt-4o.
 */
export async function callOpenAI(
  prompt: string,
  plano: Plan,
  temperature = 0
): Promise<string | null> {
  try {
    const model = plano === "PRO" ? "gpt-4o" : "gpt-3.5-turbo";

    const response = await openai.chat.completions.create({
      //forcando a usar versao baixa
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      logError(
        `[OpenAI] ❌ [RESPOSTA VAZIA] - [PLANO]: ${plano}, [PROMPT]: ${prompt.slice(
          0,
          50
        )}...`
      );
      return null;
    }

    logInfo(
      `[OpenAI] ✅ [RESPOSTA RECEBIDA] - [MODELO]: ${model}, [PLANO]: ${plano}`
    );
    return content.trim();
  } catch (error) {
    logError(`❌ Erro na chamada OpenAI: ${error}`);
    return null;
  }
}
