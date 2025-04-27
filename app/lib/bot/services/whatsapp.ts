import path from "path";
import {
  makeWASocket,
  useMultiFileAuthState as createMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";

import { Boom } from "@hapi/boom";
import { pino } from "pino";
import { handleResumo } from "../../../lib/bot/handlers/resumo";
import { handleComando } from "../../../lib/bot/handlers/comandos";
import { handleExclusao } from "../../../lib/bot/handlers/exclusao";
import { sendOnboarding } from "../../../lib/bot/handlers/onboarding";
import { PrismaClient } from "@prisma/client";
import { startDailySummary, startWeeklySummary } from "../scheduler/scheduler";
import { logError, logInfo } from "../utils/logger";
import { financeiroFilter } from "../../../lib/bot/filters/financeiro-filter";

import { baixarAudioMensagem } from "../utils/baixar-audio";
import { transcreverAudioWhisper } from "../utils/transcrever-audio";
import fs from "fs";
import { handleEdicao } from "../handlers/edicao";

const prisma = new PrismaClient();

export async function startBot() {
  const sessionPath = path.resolve(process.cwd(), "sessions");
  const { state, saveCreds } = await createMultiFileAuthState(sessionPath);
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ["WhatsApp", "Windows", "10.0"], // Ambiente confiável
    logger: pino({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);
  startDailySummary(sock);
  startWeeklySummary(sock);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error instanceof Boom &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
      logError(`🔴 Bot desconectado. Reconnect? ${shouldReconnect}`);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === "open") {
      logInfo(`🟢 Bot conectado com sucesso!`);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify" && type !== "append") {
      logInfo(`⚡ Ignorando mensagem de tipo diferente de notify ou append.`);
      return;
    }

    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    // ⚡ Ignorar mensagens muito antigas
    const now = Date.now() / 1000; // Timestamp atual em segundos
    if (msg.messageTimestamp && now - Number(msg.messageTimestamp) > 30) {
      logInfo(`⚡ Ignorando mensagem muito antiga (>30s).`);
      return;
    }

    if (!msg.key.remoteJid) {
      logError(`⚠️ Mensagem recebida sem remoteJid. Ignorando.`);
      return;
    }

    const phone = msg.key.remoteJid.split("@")[0];
    const text =
      msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return null;

    // Detectar mensagens de voz
    if (msg.message.audioMessage) {
      const duracaoAudio = msg.message.audioMessage.seconds || 0;

      // Se o áudio for maior que 30 segundos, recusar
      if (duracaoAudio > 30) {
        logInfo(`⏱️ Áudio muito longo de ${phone}: ${duracaoAudio} segundos.`);
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: "🌱 Oi! Para melhor eficiência, só consigo interpretar áudios de até 30 segundos. Pode tentar mandar um áudio mais curtinho? 🎤",
        });
        return;
      }

      // Se o áudio for muito curto (menos de 2 segundos), recusar
      if (duracaoAudio < 2) {
        logInfo(`⏱️ Áudio muito curto de ${phone}: ${duracaoAudio} segundos.`);
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: "🌱 Oi! Seu áudio foi muito curtinho e não consegui entender. Pode tentar enviar um pouco mais de informação? 🎤",
        });
        return;
      }

      logInfo(
        `🔊 Mensagem de voz recebida de ${phone}. Tentando interpretar...`
      );

      try {
        const filePath = await baixarAudioMensagem(msg, phone);
        const textoTranscrito = await transcreverAudioWhisper(filePath);

        if (!textoTranscrito || textoTranscrito.trim().length < 5) {
          logInfo(`⚠️ Áudio transcrito muito curto ou vazio de ${phone}.`);
          await sock.sendMessage(`${phone}@s.whatsapp.net`, {
            text: "❌ Não consegui entender sua mensagem de voz. Pode tentar enviar novamente com mais detalhes? 📩",
          });
          fs.unlinkSync(filePath);
          return;
        }

        logInfo(`✍️ Texto transcrito de ${phone}: ${textoTranscrito}`);

        if (textoTranscrito.toLowerCase().startsWith("resumo")) {
          logInfo(`📋 [Resumo solicitado via áudio] por ${phone}`);
          await handleResumo(sock, phone, user, textoTranscrito);
          fs.unlinkSync(filePath);
          return;
        } else if (textoTranscrito.toLowerCase().startsWith("excluir")) {
          logInfo(`🗑️ [Exclusão solicitada via áudio] por ${phone}`);
          await handleExclusao(sock, phone, user, textoTranscrito);
          fs.unlinkSync(filePath);
          return;
        } else if (textoTranscrito.toLowerCase().startsWith("editar")) {
          logInfo(`✏️ [Edição solicitada via áudio] por ${phone}`);
          await handleEdicao(sock, phone, user, textoTranscrito);
          fs.unlinkSync(filePath);
          return;
        } else {
          logInfo(
            `📝 [Registro financeiro via áudio] por ${phone}: ${textoTranscrito}`
          );
          await financeiroFilter({
            sock,
            phone,
            text: textoTranscrito,
            plano: user.plan,
          });
        }

        fs.unlinkSync(filePath);
      } catch (error) {
        logError(`❌ Erro ao interpretar áudio de ${phone}: ${error}`);
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: "❌ Ocorreu um erro ao interpretar seu áudio. Pode tentar mandar em texto, por favor? 📩",
        });
      }

      return;
    }

    logInfo(`💬 Mensagem recebida de ${phone}: ${text}`);

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          // name: "Usuário",
        },
      });
      await sendOnboarding(sock, phone);
      logInfo(`🌱 Novo usuário criado: ${phone}`);
    }

    if (text.startsWith("/")) {
      logInfo(`📩 [Comando recebido] ${text} de ${phone}`);
      const comandoExecutado = await handleComando(sock, phone, text);
      if (comandoExecutado) return;
    }

    if (text.toLowerCase().startsWith("resumo")) {
      logInfo(`📋 [Resumo solicitado] por ${phone}`);
      await handleResumo(sock, phone, user, text);
    } else if (text.toLowerCase().startsWith("excluir")) {
      logInfo(`🗑️ [Exclusão solicitada] por ${phone}`);
      await handleExclusao(sock, phone, user, text);
    } else if (text.toLowerCase().startsWith("editar")) {
      logInfo(`✏️ [Edição solicitada] por ${phone}`);
      await handleEdicao(sock, phone, user, text);
    } else {
      logInfo(`📝 [Registro financeiro] por de ${phone}: ${text}`);
      await financeiroFilter({
        sock,
        phone,
        text,
        plano: user.plan,
      });
    }
  });
}
