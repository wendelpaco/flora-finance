import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth"; // Suponho que usa next-auth
import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const periodo =
    (searchParams.get("periodo") as "hoje" | "semana" | "mes") || "mes";

  try {
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user?.phone) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const user = await prisma.user.findUnique({
      where: { phone: "5521982800594" },
      include: { transactions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let transactions = user.transactions;

    // Filtrar transações conforme o período
    const now = new Date();
    if (periodo === "hoje") {
      transactions = transactions.filter((t) => sameDay(t.date, now));
    } else if (periodo === "semana") {
      transactions = transactions.filter((t) => inSameWeek(t.date, now));
    } else if (periodo === "mes") {
      transactions = transactions.filter((t) => sameMonth(t.date, now));
    }

    const totalGanhos = transactions
      .filter((t) => t.type === "GANHO")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalGastos = transactions
      .filter((t) => t.type === "GASTO")
      .reduce((acc, t) => acc + t.amount, 0);

    const saldo = totalGanhos - totalGastos;

    const gastosPorCategoria: Record<string, number> = {};
    const ganhosPorCategoria: Record<string, number> = {};

    for (const t of transactions) {
      const categoria = t.category || "outros" || "outros-ganhos";
      if (t.type === "GASTO") {
        gastosPorCategoria[categoria] =
          (gastosPorCategoria[categoria] || 0) + t.amount;
      } else if (t.type === "GANHO") {
        ganhosPorCategoria[categoria] =
          (ganhosPorCategoria[categoria] || 0) + t.amount;
      }
    }

    const recentTransactions = transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    // Novo agrupamento para histórico
    const historicoDiario: { dia: string; ganhos: number; gastos: number }[] =
      [];
    const historicoSemanal: {
      semana: string;
      ganhos: number;
      gastos: number;
    }[] = [];
    const historicoMensal: { mes: string; ganhos: number; gastos: number }[] =
      [];

    // Agrupar por dia (últimos 7 dias)
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      // Dia da semana abreviado (ex: 'seg', 'ter')
      const label = day.toLocaleDateString("pt-BR", { weekday: "short" });

      const ganhosDia = user.transactions
        .filter((t) => t.type === "GANHO" && sameDay(t.date, day))
        .reduce((acc, t) => acc + t.amount, 0);

      const gastosDia = user.transactions
        .filter((t) => t.type === "GASTO" && sameDay(t.date, day))
        .reduce((acc, t) => acc + t.amount, 0);

      historicoDiario.push({
        dia: label,
        ganhos: ganhosDia,
        gastos: gastosDia,
      });
    }

    // Agrupar por semana (últimas 6 semanas)
    for (let i = 5; i >= 0; i--) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(startOfWeek.getDate() - i * 7);
      const label = `Semana ${6 - i}`;

      const ganhosSemana = user.transactions
        .filter((t) => t.type === "GANHO" && inSameWeek(t.date, startOfWeek))
        .reduce((acc, t) => acc + t.amount, 0);

      const gastosSemana = user.transactions
        .filter((t) => t.type === "GASTO" && inSameWeek(t.date, startOfWeek))
        .reduce((acc, t) => acc + t.amount, 0);

      historicoSemanal.push({
        semana: label,
        ganhos: ganhosSemana,
        gastos: gastosSemana,
      });
    }

    // Agrupar por mês (últimos 6 meses)
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = month.toLocaleDateString("pt-BR", { month: "short" });

      const ganhosMes = user.transactions
        .filter((t) => t.type === "GANHO" && sameMonth(t.date, month))
        .reduce((acc, t) => acc + t.amount, 0);

      const gastosMes = user.transactions
        .filter((t) => t.type === "GASTO" && sameMonth(t.date, month))
        .reduce((acc, t) => acc + t.amount, 0);

      historicoMensal.push({
        mes: label,
        ganhos: ganhosMes,
        gastos: gastosMes,
      });
    }

    const categorias = Object.entries(gastosPorCategoria).map(
      ([nome, valor]) => ({
        nome,
        valor,
      })
    );

    const categoriasGanhos = Object.entries(ganhosPorCategoria).map(
      ([nome, valor]) => ({
        nome,
        valor,
      })
    );

    return NextResponse.json({
      username: user.name,
      saldo,
      totalGanhos,
      totalGastos,
      gastosPorCategoria,
      ganhosPorCategoria,
      recentTransactions,
      historico: {
        diario: historicoDiario,
        semanal: historicoSemanal,
        mensal: historicoMensal,
      },
      saldosMensais: historicoMensal.map((item) => ({
        mes: item.mes,
        saldo: item.ganhos - item.gastos,
      })),
      categorias,
      categoriasGanhos, // novo campo adicionado
    });
  } catch (error) {
    console.error("[DASHBOARD_SUMMARY]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helpers
function sameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function inSameWeek(date: Date, refDate: Date) {
  const start = new Date(refDate);
  start.setDate(refDate.getDate() - refDate.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  // Zerar horas para comparação correta
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return date >= start && date <= end;
}

function sameMonth(date1: Date, date2: Date) {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
