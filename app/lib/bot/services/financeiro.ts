import { Plan, PrismaClient } from "@prisma/client";
import { WASocket } from "@whiskeysockets/baileys";
import { callOpenAI, parseMessage } from "../../../lib/openai";
import { logError, logInfo } from "../utils/logger";

const prisma = new PrismaClient();

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

  let tipo: "gasto" | "ganho" | null = null;
  let valor = 0;
  let descricao = "";
  let categoria = "outros";

  try {
    const parsed = await parseMessage(text);
    if (!parsed) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não consegui interpretar sua mensagem. Pode tentar de outra forma?",
      });
      return;
    }
    valor = parsed.valor;
    descricao = parsed.descricao;
    categoria = parsed.categoria ?? "outros";
    tipo = parsed.tipo;
  } catch {
    logError(`Erro ao interpretar mensagem do telefone ${phone}: "${text}"`);
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "❌ Erro ao interpretar a mensagem. Tente enviar no formato correto!",
    });
    return;
  }

  if (!tipo) {
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "❌ Não consegui entender se é um gasto ou ganho. Tente novamente!",
    });
    return;
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return;

  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: tipo.toUpperCase() as "GASTO" | "GANHO",
      description: descricao,
      amount: valor,
      category: categoria,
      date: new Date(),
    },
  });

  logInfo(
    `🟢 [Novo ${tipo.toUpperCase()}] Telefone: ${phone} | Descrição: ${descricao} | Valor: R$${valor.toFixed(
      2
    )} | Categoria: ${categoria}`
  );

  const total = await prisma.transaction.aggregate({
    where: {
      userId: user.id,
      type: tipo.toUpperCase() as "GASTO" | "GANHO",
      createdAt: {
        gte: new Date(`${ano}-${String(mes).padStart(2, "0")}-01`),
        lte: new Date(`${ano}-${String(mes).padStart(2, "0")}-31`),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalMes = total._sum.amount || 0;

  // Definir emojis por categoria
  const emojisPorCategoria: { [categoria: string]: string } = {
    transporte: "🚗",
    alimentação: "🛒",
    lazer: "🎉",
    saúde: "🩺",
    assinaturas: "📺",
    vestuário: "👕",
    dívidas: "💳",
    outros: "💸",
    salário: "💼",
    freelance: "🧑‍💻",
    presente: "🎁",
    "outros-ganhos": "💵",
  };
  // Seleciona o emoji da categoria (caso não encontre, usa 💬 como padrão)
  const emojiCategoria = emojisPorCategoria[categoria.toLowerCase()] || "💬";
  // Mensagem formatada nova
  let mensagem = `✅ ${
    tipo === "gasto" ? "Gasto" : "Ganho"
  } registrado: R$${valor.toFixed(
    2
  )}\n${emojiCategoria} Categoria: ${capitalize(categoria)}\n`;

  if (plano === Plan.FREE) {
    mensagem += `📈 Seu total de ${
      tipo === "gasto" ? "gastos" : "ganhos"
    } este mês é R$${totalMes.toFixed(2)}.`;
  } else if (plano === Plan.BASIC) {
    mensagem += `📈 Seu total de ${
      tipo === "gasto" ? "gastos" : "ganhos"
    } este mês é R$${totalMes.toFixed(
      2
    )}.\n\nContinue acompanhando para bater suas metas! 🔥`;
  } else if (plano === Plan.PRO) {
    mensagem += `🚀 Seu total de ${
      tipo === "gasto" ? "gastos" : "ganhos"
    } este mês é R$${totalMes.toFixed(
      2
    )}.\n\nGerando uma dica financeira exclusiva para você...`;

    const prompt = `Usuário acabou de registrar um ${tipo} de R$${valor.toFixed(
      2
    )} com a descrição "${descricao}". O total de ${tipo}s no mês é R$${totalMes.toFixed(
      2
    )}. Gere uma dica financeira breve, amigável e prática para ele economizar mais.`;

    try {
      const respostaAI = await callOpenAI(prompt);
      if (respostaAI) {
        mensagem += `\n\n💡 *Dica:* ${respostaAI}`;
      }
    } catch {
      logError(`Erro ao gerar dica financeira para telefone ${phone}`);
      mensagem += `\n(⚠️ Erro ao gerar dica personalizada)`;
    }
  }

  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    text: mensagem,
  });
}
