import cron from "node-cron";
import { WASocket } from "@whiskeysockets/baileys";
import { logError, logInfo } from "../utils/logger";
import { generateSummaryPrompt } from "../../openai/prompts/generate-summary";
import { callOpenAI } from "../../openai/call-openai"; // Ensure this function is available
import { safeParseOpenAIResponse } from "../../openai/parse-response";
import { SummaryResult } from "../../openai/models"; // Make sure the correct model is imported
import prisma from "../../../lib/prisma";

// Function to generate daily summary
export function startDailySummary(sock: WASocket) {
  cron.schedule("0 21 * * *", async () => {
    logInfo("⏰ [Agendado] Enviando resumos diários...");

    const users = await prisma.user.findMany({
      where: { enableSummary: true, plan: "PRO" },
    });

    for (const user of users) {
      try {
        const transacoes = await prisma.transaction.findMany({
          where: { userId: user.id },
        });

        // Separate transactions into gastos and ganhos
        const gastos = transacoes.filter(
          (transacao) => transacao.type === "GASTO"
        );
        const ganhos = transacoes.filter(
          (transacao) => transacao.type === "GANHO"
        );

        // Organize gastos and ganhos by category
        const gastosPorCategoria = gastos.reduce((acc, transacao) => {
          const categoria = transacao.category || "outros";
          if (!acc[categoria]) {
            acc[categoria] = 0;
          }
          acc[categoria] += transacao.amount;
          return acc;
        }, {} as Record<string, number>);

        const ganhosPorCategoria = ganhos.reduce((acc, transacao) => {
          const categoria = transacao.category || "outros";
          if (!acc[categoria]) {
            acc[categoria] = 0;
          }
          acc[categoria] += transacao.amount;
          return acc;
        }, {} as Record<string, number>);

        // Generate the summary with the transactions
        const prompt = generateSummaryPrompt(transacoes);
        const respostaOpenAI = await callOpenAI(prompt, user.plan);
        const resumo = safeParseOpenAIResponse<SummaryResult>(respostaOpenAI!);

        if (!resumo) {
          throw new Error("Erro ao gerar o resumo com o OpenAI.");
        }

        // Send the summary to the user via WhatsApp
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: `
🌟 *Resumo Diário* 🌟

💰 *Total de Ganhos:* R$ ${resumo.totalGanhos.toFixed(2)}
🛒 *Total de Gastos:* R$ ${resumo.totalGastos.toFixed(2)}
💸 *Saldo Final:* R$ ${resumo.saldoFinal.toFixed(2)}

🧾 *Gastos por Categoria:*
${Object.entries(gastosPorCategoria)
  .map(([categoria, valor]) => `- ${categoria}: R$ ${valor.toFixed(2)}`)
  .join("\n")}

🧾 *Ganhos por Categoria:*
${Object.entries(ganhosPorCategoria)
  .map(([categoria, valor]) => `- ${categoria}: R$ ${valor.toFixed(2)}`)
  .join("\n")}

📝 *Resumo:*
${resumo.resumoTexto}
          `,
        });
        logInfo(`📩 [Resumo Diário] enviado para ${user.phone}`);
      } catch (error) {
        logError(`Erro ao enviar Resumo Diário para ${user.phone}: ${error}`);
      }
    }
  });
}

// Function to generate weekly summary
export function startWeeklySummary(sock: WASocket) {
  cron.schedule("0 18 * * 0", async () => {
    logInfo("⏰ [Agendado] Enviando resumos semanais...");

    const users = await prisma.user.findMany({
      where: { enableSummary: true, plan: "PRO" },
    });

    for (const user of users) {
      try {
        const transacoes = await prisma.transaction.findMany({
          where: { userId: user.id },
        });

        // Separate transactions into gastos and ganhos
        const gastos = transacoes.filter(
          (transacao) => transacao.type === "GASTO"
        );
        const ganhos = transacoes.filter(
          (transacao) => transacao.type === "GANHO"
        );

        // Organize gastos and ganhos by category
        const gastosPorCategoria = gastos.reduce((acc, transacao) => {
          const categoria = transacao.category || "outros";
          if (!acc[categoria]) {
            acc[categoria] = 0;
          }
          acc[categoria] += transacao.amount;
          return acc;
        }, {} as Record<string, number>);

        const ganhosPorCategoria = ganhos.reduce((acc, transacao) => {
          const categoria = transacao.category || "outros";
          if (!acc[categoria]) {
            acc[categoria] = 0;
          }
          acc[categoria] += transacao.amount;
          return acc;
        }, {} as Record<string, number>);

        // Generate the summary with the transactions
        const prompt = generateSummaryPrompt(transacoes);
        const respostaOpenAI = await callOpenAI(prompt, user.plan);
        const resumo = safeParseOpenAIResponse<SummaryResult>(respostaOpenAI!);

        if (!resumo) {
          throw new Error("Erro ao gerar o resumo com o OpenAI.");
        }

        // Send the summary to the user via WhatsApp
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: `
🌟 *Resumo Semanal* 🌟

💰 *Total de Ganhos:* R$ ${resumo.totalGanhos.toFixed(2)}
🛒 *Total de Gastos:* R$ ${resumo.totalGastos.toFixed(2)}
💸 *Saldo Final:* R$ ${resumo.saldoFinal.toFixed(2)}

🧾 *Gastos por Categoria:*
${Object.entries(gastosPorCategoria)
  .map(([categoria, valor]) => `- ${categoria}: R$ ${valor.toFixed(2)}`)
  .join("\n")}

🧾 *Ganhos por Categoria:*
${Object.entries(ganhosPorCategoria)
  .map(([categoria, valor]) => `- ${categoria}: R$ ${valor.toFixed(2)}`)
  .join("\n")}

📝 *Resumo:*
${resumo.resumoTexto}
          `,
        });
        logInfo(`📩 [Resumo Semanal] enviado para ${user.phone}`);
      } catch (error) {
        logError(`Erro ao enviar Resumo Semanal para ${user.phone}: ${error}`);
      }
    }
  });
}
