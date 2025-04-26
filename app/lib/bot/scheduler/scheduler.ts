import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { WASocket } from "@whiskeysockets/baileys";
import { generateSummary } from "../../openai";
import { logError, logInfo } from "../utils/logger";

const prisma = new PrismaClient();

export function startDailySummary(sock: WASocket) {
  cron.schedule("0 21 * * *", async () => {
    logInfo("⏰ [Agendado] Enviando resumos diários...");

    const users = await prisma.user.findMany({
      where: { enableSummary: true, plan: "PRO" },
    });
    for (const user of users) {
      const resumo = await generateSummary(user.id);
      if (resumo) {
        try {
          await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
            text: `🌟 *Resumo Diário* 🌟\n\n${resumo}\n\n💬 Continue acompanhando seus gastos diariamente!`,
          });
          logInfo(`📩 [Resumo Diário] enviado para ${user.phone}`);
        } catch (error) {
          logError(`Erro ao enviar Resumo Diário para ${user.phone}: ${error}`);
        }
      }
    }
  });
}

export function startWeeklySummary(sock: WASocket) {
  cron.schedule("0 18 * * 0", async () => {
    logInfo("⏰ [Agendado] Enviando resumos semanais...");

    const users = await prisma.user.findMany({
      where: { enableSummary: true, plan: "PRO" },
    });
    for (const user of users) {
      const resumo = await generateSummary(user.id);
      if (resumo) {
        try {
          await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
            text: `🌟 *Resumo Semanal* 🌟\n\n${resumo}\n\n📈 Parabéns por acompanhar suas finanças esta semana!`,
          });
          logInfo(`📩 [Resumo Semanal] enviado para ${user.phone}`);
        } catch (error) {
          logError(
            `Erro ao enviar Resumo Semanal para ${user.phone}: ${error}`
          );
        }
      }
    }
  });
}
