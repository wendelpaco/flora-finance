import fs from "fs";
import { baixarAudioMensagem } from "../utils/baixar-audio";
import { transcreverAudioWhisper } from "../utils/transcrever-audio";
import { handleResumo } from "./handleResumo";
import { handleExclusao } from "./handleExclusao";
import { handleEdicao } from "./handleEdicao";
import { financeiroFilter } from "../filters/financeiro-filter";
import { logError, logInfo } from "../utils/logger";
import { WASocket, proto } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";

export async function handleAudioMessage(
  sock: WASocket,
  phone: string,
  user: User,
  msg: proto.IWebMessageInfo
) {
  let filePath = "";

  try {
    filePath = await baixarAudioMensagem(msg, phone);
    const textoTranscrito = await transcreverAudioWhisper(filePath);

    if (!textoTranscrito || textoTranscrito.trim().length < 5) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não consegui entender sua mensagem de voz. Pode tentar enviar novamente? 🎤",
      });
      return;
    }

    logInfo(`✍️ Texto transcrito de ${phone}: ${textoTranscrito}`);

    if (textoTranscrito.toLowerCase().startsWith("resumo")) {
      await handleResumo(sock, phone, user, textoTranscrito);
    } else if (textoTranscrito.toLowerCase().startsWith("excluir")) {
      await handleExclusao(sock, phone, user, textoTranscrito, user?.plan);
    } else if (textoTranscrito.toLowerCase().startsWith("editar")) {
      await handleEdicao(sock, phone, user, textoTranscrito);
    } else {
      await financeiroFilter({
        sock,
        phone,
        text: textoTranscrito,
        plano: user.plan,
      });
    }
  } catch (error) {
    logError(`❌ Erro ao interpretar áudio de ${phone}: ${error}`);
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "❌ Ocorreu um erro ao interpretar seu áudio. Pode tentar mandar em texto? 📩",
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
