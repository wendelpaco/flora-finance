import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth"; // Suponho que usa next-auth
import prisma from "../../../lib/prisma";
import { TransactionType } from "@prisma/client";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const periodo =
    (searchParams.get("periodo") as "hoje" | "semana" | "mes") || "mes";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return NextResponse.json(
        { error: "Erro ao buscar usuário" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);
    if (periodo === "hoje") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );
    } else if (periodo === "semana") {
      const dayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }

    // Buscar todas as transações do período para os totais
    const allTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Buscar apenas as transações da página atual
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalTransactions = await prisma.transaction.count({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalGanhos = allTransactions
      .filter((t) => t.type === TransactionType.income)
      .reduce((acc, t) => acc + t.amount, 0);

    const totalGastos = allTransactions
      .filter((t) => t.type === TransactionType.expense)
      .reduce((acc, t) => acc + t.amount, 0);

    const saldo = totalGanhos - totalGastos;

    const gastosPorCategoria: Record<string, number> = {};
    const ganhosPorCategoria: Record<string, number> = {};

    for (const t of transactions) {
      const categoria = t.category || "outros" || "outros-ganhos";
      if (t.type === TransactionType.expense) {
        gastosPorCategoria[categoria] =
          (gastosPorCategoria[categoria] || 0) + t.amount;
      } else if (t.type === TransactionType.income) {
        ganhosPorCategoria[categoria] =
          (ganhosPorCategoria[categoria] || 0) + t.amount;
      }
    }

    const recentTransactions = transactions;

    const historicoDiario: { dia: string; ganhos: number; gastos: number }[] =
      [];
    const historicoSemanal: {
      semana: string;
      ganhos: number;
      gastos: number;
    }[] = [];
    const historicoMensal: { mes: string; ganhos: number; gastos: number }[] =
      [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const label = day.toLocaleDateString("pt-BR", { weekday: "short" });

      const ganhosDia = transactions
        .filter(
          (t) => t.type === TransactionType.income && sameDay(t.date, day)
        )
        .reduce((acc, t) => acc + t.amount, 0);

      const gastosDia = transactions
        .filter(
          (t) => t.type === TransactionType.expense && sameDay(t.date, day)
        )
        .reduce((acc, t) => acc + t.amount, 0);

      historicoDiario.push({
        dia: label,
        ganhos: ganhosDia,
        gastos: gastosDia,
      });
    }

    for (let i = 5; i >= 0; i--) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(startOfWeek.getDate() - i * 7);
      const label = `Semana ${6 - i}`;

      const ganhosSemana = transactions
        .filter(
          (t) =>
            t.type === TransactionType.income && inSameWeek(t.date, startOfWeek)
        )
        .reduce((acc, t) => acc + t.amount, 0);

      const gastosSemana = transactions
        .filter(
          (t) =>
            t.type === TransactionType.expense &&
            inSameWeek(t.date, startOfWeek)
        )
        .reduce((acc, t) => acc + t.amount, 0);

      historicoSemanal.push({
        semana: label,
        ganhos: ganhosSemana,
        gastos: gastosSemana,
      });
    }

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = month.toLocaleDateString("pt-BR", { month: "short" });

      const ganhosMes = transactions
        .filter(
          (t) => t.type === TransactionType.income && sameMonth(t.date, month)
        )
        .reduce((acc, t) => acc + t.amount, 0);

      const gastosMes = transactions
        .filter(
          (t) => t.type === TransactionType.expense && sameMonth(t.date, month)
        )
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
      totalTransactions,
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
      categoriasGanhos,
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
