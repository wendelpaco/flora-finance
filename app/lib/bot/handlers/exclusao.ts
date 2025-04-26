import { WASocket } from "@whiskeysockets/baileys";
import { PrismaClient } from "@prisma/client";
import { parseMessage } from "../../openai";
import { logError, logInfo } from "../utils/logger";

const prisma = new PrismaClient();

export async function handleExclusao(
  sock: WASocket,
  phone: string,
  user: { id: string },
  text: string
) {
  try {
    const parsed = await parseMessage(text);

    if (!parsed || !parsed.valor || !parsed.categoria) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `❌ Não consegui entender o que você deseja excluir.`,
      });
      return;
    }

    const registro = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        amount: parsed.valor,
        category: parsed.categoria,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!registro) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `❌ Não encontrei um registro de R$${parsed.valor} em "${parsed.categoria}".`,
      });
      return;
    }

    await prisma.transaction.delete({
      where: { id: registro.id },
    });

    const tipoEmoji = registro.type === "GANHO" ? "➕" : "➖";
    const tipoTexto = registro.type === "GANHO" ? "Ganho" : "Gasto";

    logInfo(
      `🗑️ [${tipoTexto} excluído] Telefone: ${phone} | Valor: R$${parsed.valor} | Categoria: ${parsed.categoria}`
    );

    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: `✅ ${tipoTexto} excluído com sucesso!\n${tipoEmoji} Valor: R$${parsed.valor}\n📂 Categoria: ${parsed.categoria}`,
    });
  } catch (error) {
    logError(
      `Erro ao tentar excluir registro para o telefone ${phone}: ${error}`
    );
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: `❌ Ocorreu um erro ao tentar excluir seu registro. Por favor, tente novamente.`,
    });
  }
}
