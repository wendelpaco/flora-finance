import { Plan } from "@prisma/client";
import { WASocket } from "@whiskeysockets/baileys";
import { logInfo } from "../utils/logger";
import { callOpenAI } from "../../openai/call-openai";
import { generateSummaryPrompt } from "../../openai/prompts/generate-summary";
import { safeParseOpenAIResponse } from "../../openai/parse-response";
import { SummaryResult } from "../../openai/models";
import prisma from "../../../lib/prisma";

export async function handleResumo(
  sock: WASocket,
  phone: string,
  user: { id: string },
  text: string
) {
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const textoMinusculo = text.toLowerCase();
  const mesEncontrado = meses.find((mes) => textoMinusculo.includes(mes));

  const usuarioBanco = await prisma.user.findUnique({
    where: { id: user.id },
    select: { plan: true, lastSummaryAt: true },
  });

  // Verifica se o usuário do plano FREE já gerou resumo hoje
  if (usuarioBanco?.plan === Plan.FREE && usuarioBanco.lastSummaryAt) {
    const today = new Date();
    if (
      usuarioBanco.lastSummaryAt.getDate() === today.getDate() &&
      usuarioBanco.lastSummaryAt.getMonth() === today.getMonth() &&
      usuarioBanco.lastSummaryAt.getFullYear() === today.getFullYear()
    ) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "⚡ Você já gerou seu resumo gratuito hoje! Para ter resumos ilimitados, conheça nossos planos Premium. 🚀",
      });
      logInfo(`🚫 [Resumo bloqueado - plano FREE] Usuário: ${phone}`);
      return;
    }
  }

  const transacoes = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      ...(mesEncontrado && {
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            meses.indexOf(mesEncontrado),
            1
          ),
          lt: new Date(
            new Date().getFullYear(),
            meses.indexOf(mesEncontrado) + 1,
            1
          ),
        },
      }),
    },
  });

  if (!transacoes.length) {
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: `📭 Nenhum registro encontrado para ${
        mesEncontrado || "todos os meses"
      }.`,
    });
    logInfo(
      `📭 [Resumo vazio] Mês: ${mesEncontrado || "Todos"} | Usuário: ${phone}`
    );
    return;
  }

  const prompt = generateSummaryPrompt(transacoes);

  const respostaOpenAI = await callOpenAI(
    prompt,
    usuarioBanco?.plan ?? Plan.FREE
  );

  const resumo = safeParseOpenAIResponse<SummaryResult>(respostaOpenAI!);

  if (!resumo) {
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "⚡ Ocorreu um problema ao gerar seu resumo. Tente novamente em instantes.",
    });
    logInfo(`❌ [Erro resumo OpenAI] Usuário: ${phone}`);
    return;
  }

  // Adicionando lógica para Ganhos por Categoria
  const ganhosPorCategoria = transacoes
    .filter((transacao) => transacao.type === "GANHO")
    .reduce((acc, transacao) => {
      const categoria = transacao.category || "outros" || "outros-ganhos";
      if (!acc[categoria]) {
        acc[categoria] = 0;
      }
      acc[categoria] += transacao.amount;
      return acc;
    }, {} as Record<string, number>);

  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    text: `
📊 *Resumo de ${mesEncontrado || "Todos os meses"}*

➕ *Total de Ganhos:* R$ ${resumo.totalGanhos.toFixed(2)}
➖ *Total de Gastos:* R$ ${resumo.totalGastos.toFixed(2)}
💰 *Saldo Final:* R$ ${resumo.saldoFinal.toFixed(2)}

🧾 *Gastos por Categoria:*
${Object.entries(resumo.gastosPorCategoria)
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

  await prisma.user.update({
    where: { id: user.id },
    data: { lastSummaryAt: new Date() },
  });

  if (usuarioBanco?.plan === Plan.FREE) {
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "🚀 Gostou do resumo? Desbloqueie resumos automáticos diários, insights financeiros e consultoria personalizada com nossos planos Premium!\n\nResponda */planos* para conhecer as opções disponíveis! 💬",
    });
  }

  logInfo(
    `📈 [RESUMO ENVIADO] Mês: ${mesEncontrado || "Todos"} | Usuário: ${phone}`
  );
}
