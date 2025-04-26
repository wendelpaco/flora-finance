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

    logInfo(`💬 Mensagem recebida de ${phone}: ${text}`);

    let user = await prisma.user.findUnique({ where: { phone } });

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
    } else {
      logInfo(`📝 [Registro financeiro] Mensagem de ${phone}: ${text}`);
      await financeiroFilter({
        sock,
        phone,
        text,
        plano: user.plan,
      });
    }
  });
}
