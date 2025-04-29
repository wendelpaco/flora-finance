import { WASocket } from "@whiskeysockets/baileys";
import prisma from "../../../lib/prisma";
import { logError, logInfo } from "../utils/logger";
import { callOpenAI } from "../../openai/call-openai";
import { safeParseOpenAIResponse } from "../../openai/parse-response";
import { Plan } from "@prisma/client";
import { generateParseEditPrompt } from "../../openai/prompts/generateParseEditPrompt";

interface InterpretacaoEdicao {
  tipo: "GANHO" | "GASTO";
  valor_antigo: number;
  valor_novo: number;
  categoria?: string;
}

export async function handleEdicaoAI(
  sock: WASocket,
  phone: string,
  user: { id: string },
  text: string,
  plano: Plan
) {
  try {
    const prompt = generateParseEditPrompt(text);
    const respostaOpenAI = await callOpenAI(prompt, plano);
    const parsed = safeParseOpenAIResponse<InterpretacaoEdicao>(
      respostaOpenAI!
    );

    if (!parsed || !parsed.valor_antigo || !parsed.valor_novo || !parsed.tipo) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `❌ Não consegui entender o que você deseja editar.`,
      });
      return;
    }

    const registro = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        amount: parsed.valor_antigo,
        type: parsed.tipo.toUpperCase() as "GANHO" | "GASTO",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!registro) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `❌ Não encontrei um ${
          parsed.tipo === "GANHO" ? "ganho" : "gasto"
        } de R$${parsed.valor_antigo}.`,
      });
      return;
    }

    await prisma.transaction.update({
      where: { id: registro.id },
      data: { amount: parsed.valor_novo },
    });

    const tipoEmoji = registro.type === "GANHO" ? "➕" : "➖";
    const tipoTexto = registro.type === "GANHO" ? "Ganho" : "Gasto";

    logInfo(
      `✏️ [${tipoTexto} EDITADO] - TELEFONE: ${phone} | DE: R$${parsed.valor_antigo} | PARA: R$${parsed.valor_novo}`
    );

    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: `✅ ${tipoTexto} atualizado com sucesso!\n${tipoEmoji} De: R$${parsed.valor_antigo}\n🔄 Para: R$${parsed.valor_novo}`,
    });
  } catch (error) {
    logError(
      `❌ [ERRO AO TENTAR EDITAR REGISTRO] - TELEFONE ${phone} | MESSAGE: ${error}`
    );
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: `❌ Ocorreu um erro ao tentar editar seu registro. Por favor, tente novamente.`,
    });
  }
}
