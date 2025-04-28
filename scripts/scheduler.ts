import cron from "node-cron";
import { WASocket } from "@whiskeysockets/baileys";
import { generateSummaryPrompt } from "../messaging/openai/prompts/generate-summary";
import prisma from "../lib/prisma";

// Enviar resumo diário para os usuários com o plano PRO
export async function startDailySummary(sock: WASocket) {
  cron.schedule("0 21 * * *", async () => {
    console.log("⏰ Enviando resumos diários...");

    const users = await prisma.user.findMany({
      where: { enableSummary: true, plan: "PRO" },
    });

    for (const user of users) {
      // Obter transações do usuário
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const transactions = await prisma.transaction.findMany({
        where: { userId: user.id, createdAt: { gte: today } }, // Transações de hoje
      });

      // Gerar o resumo diário para o usuário
      const resumo = await generateSummaryPrompt(transactions);

      if (resumo) {
        // Enviar o resumo via WhatsApp
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: `🌟 *Resumo Diário* 🌟\n\n${resumo}\n\n💬 Continue acompanhando seus gastos diariamente!`,
        });
      }
    }
  });
}

// Enviar resumo semanal para os usuários com o plano PRO
export async function startWeeklySummary(sock: WASocket) {
  cron.schedule("0 18 * * 0", async () => {
    console.log("⏰ Enviando resumos semanais...");

    const users = await prisma.user.findMany({
      where: { enableSummary: true, plan: "PRO" },
    });

    for (const user of users) {
      // Obter transações do usuário
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Ajusta para 7 dias atrás
      const transactions = await prisma.transaction.findMany({
        where: { userId: user.id, createdAt: { gte: sevenDaysAgo } }, // Transações da última semana
      });

      // Gerar o resumo semanal para o usuário
      const resumo = await generateSummaryPrompt(transactions);

      if (resumo) {
        // Enviar o resumo via WhatsApp
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: `🌟 *Resumo Semanal* 🌟\n\n${resumo}\n\n📈 Parabéns por acompanhar suas finanças esta semana!`,
        });
      }
    }
  });
}
