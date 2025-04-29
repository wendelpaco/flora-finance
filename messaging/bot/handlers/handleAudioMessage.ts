import fs from "fs";
import { baixarAudioMensagem } from "../utils/baixar-audio";
import { transcreverAudioWhisper } from "../utils/transcrever-audio";
import { handleResumo } from "./handleResumo";
import { financeiroFilter } from "../filters/financeiro-filter";
import { logError, logInfo } from "../utils/logger";
import { WASocket, proto } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";
import { ajustarValorTexto } from "../utils/ajustar-valor-texto";
import { handleEdicaoAI } from "./handleEdicaoAI";
import { handleExclusaoAI } from "./handleExclusaoAI";

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
    const textoCorrigido = ajustarValorTexto(textoTranscrito);

    if (!textoCorrigido || textoCorrigido.trim().length < 5) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não consegui entender sua mensagem de voz. Pode tentar enviar novamente? 🎤",
      });
      return;
    }

    logInfo(
      `✍️ [TEXTO TRANSCRITO] - DE: ${user.phone} | MENSAGEM: ${textoCorrigido}`
    );
    //-------------------------------------------------//
    //   BUGFIX- Melhorar captura do comando resumo
    //-------------------------------------------------//
    if (textoCorrigido.toLowerCase().startsWith("resumo")) {
      await handleResumo(sock, phone, user, textoCorrigido);
    } else if (textoCorrigido.toLowerCase().startsWith("excluir")) {
      await handleExclusaoAI(sock, phone, user, textoCorrigido, user?.plan);
    } else if (textoCorrigido.toLowerCase().startsWith("editar")) {
      await handleEdicaoAI(sock, phone, user, textoCorrigido, user?.plan);
    } else {
      await financeiroFilter({
        sock,
        phone,
        text: textoCorrigido,
        plano: user.plan,
      });
    }
  } catch (error) {
    logError(
      `❌ [ERROR] - ERRO AO INTERPRETAR ÁUDIO | NOME: ${user.phone} | MENSAGEM:${error}`
    );
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "❌ Ocorreu um erro ao interpretar seu áudio. Pode tentar mandar em texto? 📩",
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
