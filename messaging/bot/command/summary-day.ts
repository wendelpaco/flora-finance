import { WASocket } from "@whiskeysockets/baileys";
import { Command } from "./command.interface";
import { Plan, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { generateSummaryPrompt } from "@/messaging/openai/prompts/generate-summary";
import { callOpenAI } from "@/messaging/openai/call-openai";
import { SummaryResult } from "@/messaging/openai/models";
import { safeParseOpenAIResponse } from "@/messaging/openai/parse-response";
import { logError, logInfo } from "../utils/logger";

export class SummaryDayCommand implements Command {
  async execute(sock: WASocket, user: User): Promise<boolean> {
    // Verifica se o usuário é PRO
    if (user.plan !== Plan.PRO) {
      await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
        text: "❌ Este comando é exclusivo para usuários PRO. Faça upgrade para acessar o resumo diário ou semanal.",
      });
      return false; // Retorna false quando o plano não é PRO
    }

    try {
      // Gerar transações do usuário
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const transacoes = await prisma.transaction.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: today }, // Transações de hoje
        },
      });

      if (!transacoes.length) {
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: "❌ Não foram encontradas transações para hoje.",
        });
        return false; // Retorna false se não houver transações
      }

      // Organize gastos and ganhos by category
      const gastosPorCategoria = transacoes
        .filter((transacao) => transacao.type === "GASTO")
        .reduce((acc, transacao) => {
          const categoria = transacao.category || "outros";
          if (!acc[categoria]) {
            acc[categoria] = 0;
          }
          acc[categoria] += transacao.amount;
          return acc;
        }, {} as Record<string, number>);

      const ganhosPorCategoria = transacoes
        .filter((transacao) => transacao.type === "GANHO")
        .reduce((acc, transacao) => {
          const categoria = transacao.category || "outros";
          if (!acc[categoria]) {
            acc[categoria] = 0;
          }
          acc[categoria] += transacao.amount;
          return acc;
        }, {} as Record<string, number>);

      // Gerar o resumo
      const prompt = generateSummaryPrompt(transacoes);
      const respostaOpenAI = await callOpenAI(prompt, user.plan);
      const resumo = safeParseOpenAIResponse<SummaryResult>(respostaOpenAI!);

      if (!resumo) {
        throw new Error("Erro ao gerar o resumo com o OpenAI.");
      }

      // Verificar se os dados necessários existem
      if (!resumo.totalGanhos || !resumo.totalGastos || !resumo.saldoFinal) {
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: "❌ Falha ao gerar resumo. Dados financeiros incompletos.",
        });
        return false; // Retorna false se os dados estiverem faltando
      }

      // Enviar resumo para o usuário
      await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
        text: `
🌟 *Resumo Diário - ${today.toISOString().split("T")[0]}* 🌟

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

      logInfo(`📩 [RESUMO] Enviado para ${user.phone}`);
      return true; // Retorna true quando a mensagem foi enviada com sucesso
    } catch (error) {
      logError(`Erro ao enviar resumo para ${user.phone}: ${error}`);
      await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
        text: "❌ Ocorreu um erro ao gerar o seu resumo. Tente novamente mais tarde.",
      });
      return false; // Retorna false em caso de erro
    }
  }
}
