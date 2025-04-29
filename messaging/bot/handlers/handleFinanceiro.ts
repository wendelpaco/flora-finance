import { Plan } from "@prisma/client";
import { WASocket } from "@whiskeysockets/baileys";
import { callOpenAI } from "../../openai/call-openai";
import { safeParseOpenAIResponse } from "../../openai/parse-response";
import { generateParseFinancialPrompt } from "../../openai/prompts/parse-financial";
// import { generateDicaPrompt } from "../../openai/prompts/generate-dica";
import { ParsedFinancialMessage } from "../../openai/models";
import { logError, logInfo } from "../utils/logger";
import prisma from "../../../lib/prisma";
import { formatTransactionMessage } from "../lib/formatTransactionMessage";

interface handleFinanceiroParams {
  sock: WASocket;
  phone: string;
  text: string;
  plano: Plan;
}

function capitalize(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function handleFinanceiro({
  sock,
  phone,
  text,
  plano,
}: handleFinanceiroParams) {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth() + 1;

  const prompt = generateParseFinancialPrompt(text);

  const respostaOpenAI = await callOpenAI(prompt, plano);

  const parsed = safeParseOpenAIResponse<ParsedFinancialMessage>(
    respostaOpenAI!
  );

  if (!parsed) {
    logError(`[ERRO AO INTERPRETAR] mensagem do telefone ${phone}: "${text}"`);
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "❌ Não consegui interpretar sua mensagem. Pode tentar de outra forma?",
    });
    return;
  }

  const { valor, descricao, categoria, tipo } = parsed;

  const desc = parsed.descricao == "" ? text : descricao;
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return;

  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: tipo.toUpperCase() as "GASTO" | "GANHO",
      description: desc,
      amount: valor,
      category: categoria,
      date: new Date(),
    },
  });

  const ganhos = await prisma.transaction.aggregate({
    where: {
      userId: user.id,
      type: "GANHO",
      createdAt: {
        gte: new Date(`${ano}-${String(mes).padStart(2, "0")}-01`),
        lte: new Date(`${ano}-${String(mes).padStart(2, "0")}-31`),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const gastos = await prisma.transaction.aggregate({
    where: {
      userId: user.id,
      type: "GASTO",
      createdAt: {
        gte: new Date(`${ano}-${String(mes).padStart(2, "0")}-01`),
        lte: new Date(`${ano}-${String(mes).padStart(2, "0")}-31`),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const saldoAtual = (ganhos._sum.amount || 0) - (gastos._sum.amount || 0);

  logInfo(
    `🟢 [NOVO ${tipo.toUpperCase()}] Telefone: ${phone} | Descrição: ${desc} | Valor: R$${valor.toFixed(
      2
    )} | Categoria: ${categoria}`
  );

  const mensagem = formatTransactionMessage({
    descricao: desc,
    valor,
    categoria: capitalize(categoria),
    tipo: tipo.toUpperCase() as "GANHO" | "GASTO",
    conta: "Conta Pessoal", // ajustar se necessário futuramente
    data: new Date().toISOString(),
    pago: true,
    saldoAtual,
  });

  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    text: mensagem,
  });
}
