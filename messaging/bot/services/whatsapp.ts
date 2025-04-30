import path from "path";
import {
  makeWASocket,
  useMultiFileAuthState as createMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";

import { Boom } from "@hapi/boom";
import { pino } from "pino";
import { startDailySummary, startWeeklySummary } from "../scheduler/scheduler";
import { logError, logInfo } from "../utils/logger";

import { handleAudioMessage } from "../handlers/handleAudioMessage";
import { handleTextMessage } from "../handlers/handleTextMessage";
import { isMessageRecent } from "../utils/validations";
import { ensureUserExists } from "../utils/user-utils";

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
      logError(`🔴🔴🔴 [BOT DESCONECTADO] 🔴🔴🔴 ${shouldReconnect}`);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === "open") {
      logInfo(`🟢🟢🟢 [BOT CONECTADO COM SUCESSO] 🟢🟢🟢`);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify" && type !== "append") {
      logInfo(`⚡ Ignorando mensagem de tipo diferente de notify ou append.`);
      return;
    }

    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const phone = msg.key.remoteJid?.split("@")[0];
    if (!phone) {
      logError(`⚠️ Mensagem recebida sem remoteJid. Ignorando.`);
      return;
    }

    const text =
      msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    if (
      !msg.messageTimestamp ||
      !isMessageRecent(Number(msg.messageTimestamp))
    ) {
      logInfo(`⚡ Ignorando mensagem muito antiga (>30s).`);
      return;
    }

    const user = await ensureUserExists(phone, `${msg.pushName}`);

    try {
      if (msg.message.audioMessage) {
        await handleAudioMessage(sock, user, msg);
      } else {
        await handleTextMessage(sock, user, text);
      }
    } catch (error) {
      logError(
        `❌ [ERRO] - ERRO AO PROCESSAR IMAGEM | TELEFONE: ${phone} | MENSAGEM: ${error}`
      );
    }
  });
}
