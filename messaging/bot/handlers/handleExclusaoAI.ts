import { WASocket } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";
import { logError, logInfo } from "../utils/logger";
import { callOpenAI } from "../../openai/call-openai";
import { safeParseOpenAIResponse } from "../../openai/parse-response";
import { generateParseExcluirPrompt } from "../../openai/prompts/generateParseExcluirPrompt";
import prisma from "../../../lib/prisma";

interface InterpretacaoExclusao {
  tipo: "GANHO" | "GASTO";
  valor: number;
  categoria?: string;
}

export async function handleExclusaoAI(
  sock: WASocket,
  user: User,
  text: string
) {
  try {
    const prompt = generateParseExcluirPrompt(text);
    const respostaOpenAI = await callOpenAI(prompt, user.plan);
    const parsed = safeParseOpenAIResponse<InterpretacaoExclusao>(
      respostaOpenAI!
    );

    if (!parsed || !parsed.valor || !parsed.tipo) {
      await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
        text: `❌ Não consegui entender qual transação você deseja excluir.`,
      });
      return;
    }

    const registro = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        amount: parsed.valor,
        type: parsed.tipo.toUpperCase() as "GANHO" | "GASTO",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!registro) {
      await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
        text: `❌ Não encontrei uma transação de R$${
          parsed.valor
        } como ${parsed.tipo.toLowerCase()}.`,
      });
      return;
    }

    await prisma.transaction.delete({
      where: { id: registro.id },
    });

    const tipoEmoji = registro.type === "GANHO" ? "➕" : "➖";
    const tipoTexto = registro.type === "GANHO" ? "Ganho" : "Gasto";

    logInfo(
      `🗑️ [${tipoTexto} EXCLUÍDO] - Telefone: ${user.phone} | Valor: R$${parsed.valor}`
    );

    await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
      text: `✅ ${tipoTexto} de R$${parsed.valor} excluído com sucesso! ${tipoEmoji}`,
    });
  } catch (error) {
    logError(
      `❌ [Erro ao tentar excluir transacao] - Telefone: ${user.phone} | Mensagem: ${error}`
    );
    await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
      text: `❌ Ocorreu um erro ao tentar excluir sua transação. Tente novamente mais tarde.`,
    });
  }
}
