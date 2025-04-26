import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { generateSummary } from "../app/lib/openai";
import { WASocket } from "@whiskeysockets/baileys";

const prisma = new PrismaClient();

export function startDailySummary(sock: WASocket) {
  cron.schedule("0 21 * * *", async () => {
    console.log("⏰ Enviando resumos diários...");

    const users = await prisma.user.findMany({
      where: { enableSummary: true, plan: "PRO" },
    });
    for (const user of users) {
      const resumo = await generateSummary(user.id);
      if (resumo) {
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: `🌟 *Resumo Diário* 🌟\n\n${resumo}\n\n💬 Continue acompanhando seus gastos diariamente!`,
        });
      }
    }
  });
}

export function startWeeklySummary(sock: WASocket) {
  cron.schedule("0 18 * * 0", async () => {
    console.log("⏰ Enviando resumos semanais...");

    const users = await prisma.user.findMany({
      where: { enableSummary: true, plan: "PRO" },
    });
    for (const user of users) {
      const resumo = await generateSummary(user.id);
      if (resumo) {
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: `🌟 *Resumo Semanal* 🌟\n\n${resumo}\n\n📈 Parabéns por acompanhar suas finanças esta semana!`,
        });
      }
    }
  });
}
