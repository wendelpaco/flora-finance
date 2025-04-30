import { WASocket } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";
import { financeiroFilter } from "../filters/financeiro-filter";
import { logInfo } from "../utils/logger";
import { handleResumo } from "./handleResumo";
import { handleExclusaoAI } from "./handleExclusaoAI";
import { handleEdicaoAI } from "./handleEdicaoAI";
import { handleCommand } from "../command/command-router";

export async function handleTextMessage(
  sock: WASocket,
  user: User,
  message: string
) {
  const comandoExecutado = await handleCommand(sock, user, message);
  if (comandoExecutado) return;

  //-------------------------------------------------//
  //   BUGFIX- Melhorar captura do comando resumo
  //-------------------------------------------------//

  if (message.toLowerCase().startsWith("resumo")) {
    logInfo(`📋 [Resumo solicitado] por ${user.phone}`);
    await handleResumo(sock, user, message);
  } else if (message.toLowerCase().startsWith("excluir")) {
    logInfo(`🗑️ [Exclusão solicitada] por ${user.phone}`);
    await handleExclusaoAI(sock, user, message);
  } else if (message.toLowerCase().startsWith("editar")) {
    logInfo(`✏️ [Edição solicitada] por ${user.phone}`);
    await handleEdicaoAI(sock, user, message);
  } else {
    logInfo(`📝 [Registro financeiro] por ${user.phone}: ${message}`);
    await financeiroFilter({
      sock,
      user,
      message,
    });
  }
}
