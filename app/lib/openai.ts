import { OpenAI } from "openai";
import { Plan, PrismaClient } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";
import { logError, logInfo } from "./bot/utils/logger";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callOpenAI(
  prompt: string,
  temperature = 0.2,
  plano: Plan = Plan.FREE
) {
  try {
    const model =
      plano === Plan.PRO || plano === Plan.BASIC
        ? "gpt-4-turbo"
        : "gpt-3.5-turbo";
    logInfo(`🤖 Chamando OpenAI API com modelo: ${model}...`);
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
    });

    return completion.choices[0].message.content ?? null;
  } catch (error) {
    logError(`❌ Erro ao chamar OpenAI: ${error}`);
    return null;
  }
}

const prisma = new PrismaClient();

// Função para interpretar uma mensagem de gasto
export async function parseMessage(text: string, plano: Plan = Plan.FREE) {
  const prompt = `
Interprete a mensagem abaixo relacionada a finanças pessoais e extraia as informações em formato JSON puro.

Mensagem: "${text}"

Formato obrigatório da resposta:
{
  "valor": número (ex: 50),
  "categoria": "transporte" | "alimentação" | "lazer" | "saúde" | "assinaturas" | "vestuário" | "dívidas" | "outros" | "salário" | "freelance" | "presente" | "outros-ganhos",
  "descricao": texto descritivo (campo livre resumido),
  "tipo": "gasto" | "ganho"
}

Regras:
- Sempre informe se é um "gasto" ou "ganho" no campo "tipo".
- Caso não consiga interpretar, retorne apenas null (sem aspas, sem JSON).
- Não envie comentários, mensagens extras ou qualquer texto fora o JSON.

Responda apenas o JSON ou null.
`;

  logInfo("📝 Interpretando mensagem de gasto usando OpenAI...");
  try {
    const resposta = await callOpenAI(prompt, 0.2, plano);
    if (!resposta) return null;

    const parsed = JSON.parse(resposta);
    return parsed;
  } catch (parseError) {
    logError(`❌ Erro ao fazer JSON.parse da resposta: ${parseError}`);
    return null;
  }
}

// Função para gerar resumo de gastos do usuário (reestruturada e aprimorada)
export async function generateSummary(
  userId: string,
  mesTexto?: string,
  plano: Plan = Plan.FREE
) {
  const meses: Record<string, number> = {
    janeiro: 0,
    fevereiro: 1,
    março: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11,
  };

  // Checar se o usuário free já gerou hoje
  // if (plano === Plan.FREE) {
  //   const user = await prisma.user.findUnique({ where: { id: userId } });

  //   if (user?.lastSummaryAt && isToday(user.lastSummaryAt)) {
  //     logInfo(
  //       `🚫 Usuário ${userId} tentou gerar mais de um resumo gratuito no mesmo dia.`
  //     );
  //     return "⚡ Você já gerou seu resumo gratuito hoje! Para ter resumos ilimitados, conheça nossos planos Premium. 🚀";
  //   }
  // }

  let dateFilter = {};
  if (mesTexto) {
    const mesNormalizado = mesTexto.trim().toLowerCase();
    const mesIndex = meses[mesNormalizado];
    if (mesIndex === undefined) {
      return `❌ Mês "${mesTexto}" não reconhecido. Por favor, tente novamente informando um mês válido.`;
    }

    const now = new Date();
    const start = startOfMonth(new Date(now.getFullYear(), mesIndex));
    const end = endOfMonth(new Date(now.getFullYear(), mesIndex));
    dateFilter = {
      createdAt: {
        gte: start,
        lte: end,
      },
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...dateFilter,
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  if (transactions.length === 0)
    return "📄 Você não possui gastos registrados neste período.";

  const dados = transactions.map((t) => ({
    valor: t.amount ?? 0,
    categoria: t.category ?? "outros",
    descricao: t.description,
  }));

  const listaFormatada = dados
    .map((d) => `- R$${d.valor.toFixed(2)} em ${d.categoria}`)
    .join("\n");

  const prompt = `
    Aqui estão os gastos:

    ${listaFormatada}

    Crie um resumo para WhatsApp:
    - Informe o total gasto
    - Liste os gastos por categoria de forma amigável
    - Dê 2 ou 3 dicas de economia com base nos maiores gastos
    - Use emojis se achar interessante
    - Seja direto, amigável e não explique o que está fazendo
    - Responda apenas o resumo, sem comentários extras
    `;

  try {
    logInfo("📊 Gerando resumo de gastos usando OpenAI...");
    const resumo = await callOpenAI(prompt, 0.3, plano);

    // Atualizar lastSummaryAt se for plano free e resumo gerado com sucesso

    console.log("DEU RUIM - " + (plano === Plan.FREE));

    if (plano === Plan.FREE) {
      await prisma.user.update({
        where: { id: userId },
        data: { lastSummaryAt: new Date() },
      });
    }

    return resumo || "Resumo gerado.";
  } catch (error) {
    logError(`❌ Erro ao gerar resumo com OpenAI: ${error}`);

    const total = dados.reduce((acc, d) => acc + d.valor, 0);
    const resumoManual = `
      Resumo dos seus gastos:
      Total gasto: R$${total.toFixed(2)}
      Itens:
      ${dados
        .map((d) => `- R$${d.valor.toFixed(2)} em ${d.categoria}`)
        .join("\n")}
      💡 Dica: Continue acompanhando seus gastos para melhorar seu controle financeiro!
      `;
    return resumoManual;
  }
}

// Função auxiliar
// function isToday(date: Date) {
//   const today = new Date();
//   return (
//     date.getDate() === today.getDate() &&
//     date.getMonth() === today.getMonth() &&
//     date.getFullYear() === today.getFullYear()
//   );
// }
