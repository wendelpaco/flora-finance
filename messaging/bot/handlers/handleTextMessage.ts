import { WASocket } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";
import { financeiroFilter } from "../filters/financeiro-filter";
import { logInfo } from "../utils/logger";
import { handleCommand } from "./command/command-router";
import { handleEdicao } from "./handleEdicao";
import { handleExclusao } from "./handleExclusao";
import { handleResumo } from "./handleResumo";

export async function handleTextMessage(
  sock: WASocket,
  phone: string,
  user: User,
  text: string
) {
  const comandoExecutado = await handleCommand(sock, phone, text, user.plan);
  if (comandoExecutado) return;

  if (text.toLowerCase().startsWith("resumo")) {
    logInfo(`📋 [Resumo solicitado] por ${phone}`);
    await handleResumo(sock, phone, user, text);
  } else if (text.toLowerCase().startsWith("excluir")) {
    logInfo(`🗑️ [Exclusão solicitada] por ${phone}`);
    await handleExclusao(sock, phone, user, text, user?.plan);
  } else if (text.toLowerCase().startsWith("editar")) {
    logInfo(`✏️ [Edição solicitada] por ${phone}`);
    await handleEdicao(sock, phone, user, text);
  } else {
    logInfo(`📝 [Registro financeiro] por ${phone}: ${text}`);
    await financeiroFilter({
      sock,
      phone,
      text,
      plano: user.plan,
    });
  }
}
