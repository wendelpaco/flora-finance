import { Transaction } from "../app/types/Transaction";
import prisma from "./prisma";
import { subDays, startOfMonth, endOfMonth } from "date-fns";

interface Categoria {
  nome: string;
  valor: number;
}
export interface DashboardData {
  saldo: number;
  ganhos: number;
  gastos: number;
  saldoAnterior: number;
  categorias: Categoria[];
  transactions: Transaction[];
}

export async function fetchDashboardData(
  periodo: "hoje" | "semana" | "mes"
): Promise<DashboardData> {
  const hoje = new Date();

  let dataInicio: Date;
  let dataFim: Date;

  if (periodo === "hoje") {
    dataInicio = new Date(hoje.setHours(0, 0, 0, 0));
    dataFim = new Date(hoje.setHours(23, 59, 59, 999));
  } else if (periodo === "semana") {
    dataInicio = subDays(hoje, 7);
    dataFim = hoje;
  } else {
    dataInicio = startOfMonth(hoje);
    dataFim = endOfMonth(hoje);
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: dataInicio,
        lte: dataFim,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const ganhos = transactions
    .filter((t) => t.type === "GANHO")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const gastos = transactions
    .filter((t) => t.type === "GASTO")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldo = ganhos - gastos;

  // Buscar saldo do mês passado para comparar
  const mesAnterior = subDays(startOfMonth(new Date()), 1);
  const inicioMesAnterior = startOfMonth(mesAnterior);
  const fimMesAnterior = endOfMonth(mesAnterior);

  const transacoesMesAnterior = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: inicioMesAnterior,
        lte: fimMesAnterior,
      },
    },
  });

  const ganhosAnteriores = transacoesMesAnterior
    .filter((t) => t.type === "GANHO")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const gastosAnteriores = transacoesMesAnterior
    .filter((t) => t.type === "GASTO")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldoAnterior = ganhosAnteriores - gastosAnteriores;

  const categorias = [
    { nome: "Transporte", valor: 400 },
    { nome: "Alimentação", valor: 600 },
    { nome: "Lazer", valor: 300 },
  ]; // Depois pode mudar para buscar categorias reais

  return {
    saldo,
    ganhos,
    gastos,
    saldoAnterior,
    categorias,
    transactions: transactions.map((t) => ({
      id: t.id,
      descricao: t.description,
      valor: t.amount,
      tipo: t.type,
      categoria: t.category ?? "Outros",
      pago: new Date(t.date) <= new Date(),
      data: t.date,
    })),
  };
}
