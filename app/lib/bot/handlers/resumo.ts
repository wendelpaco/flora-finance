import { PrismaClient, Plan } from "@prisma/client";
import { WASocket } from "@whiskeysockets/baileys";
import { logInfo } from "../utils/logger";

const prisma = new PrismaClient();

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

  let totalGanhos = 0;
  let totalGastos = 0;
  const ganhosPorCategoria: { [categoria: string]: number } = {};
  const gastosPorCategoria: { [categoria: string]: number } = {};

  transacoes.forEach((t) => {
    if (t.type === "GANHO") {
      totalGanhos += t.amount || 0;
      const categoria = t.category || "Outros";
      ganhosPorCategoria[categoria] =
        (ganhosPorCategoria[categoria] || 0) + (t.amount || 0);
    } else if (t.type === "GASTO") {
      totalGastos += t.amount || 0;
      const categoria = t.category || "Outros";
      gastosPorCategoria[categoria] =
        (gastosPorCategoria[categoria] || 0) + (t.amount || 0);
    }
  });

  // Monta texto detalhado de ganhos
  let ganhosTexto = "";
  for (const categoria in ganhosPorCategoria) {
    ganhosTexto += `- ${categoria}: R$ ${ganhosPorCategoria[categoria].toFixed(
      2
    )}\n`;
  }

  // Monta texto detalhado de gastos
  let gastosTexto = "";
  for (const categoria in gastosPorCategoria) {
    gastosTexto += `- ${categoria}: R$ ${gastosPorCategoria[categoria].toFixed(
      2
    )}\n`;
  }

  const saldoFinal = totalGanhos - totalGastos;

  const resumo = `📊 *Resumo de ${mesEncontrado || "Todos os meses"}*:

➕ *Ganhos:*
${ganhosTexto}

➖ *Gastos:*
${gastosTexto}

💰 *Saldo Final:* R$ ${saldoFinal.toFixed(2)}

*Observação:* Mantenha o controle para alcançar seus objetivos! 🚀`;

  await sock.sendMessage(`${phone}@s.whatsapp.net`, { text: resumo });

  // Atualiza o lastSummaryAt após enviar o resumo
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
    `📈 [Resumo enviado] Mês: ${mesEncontrado || "Todos"} | Usuário: ${phone}`
  );
}
