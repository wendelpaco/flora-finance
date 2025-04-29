/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { motion } from "framer-motion";
import { CardDashboard } from "../../../../components/ui/card-dashboard";
import { DoughnutChart } from "../../../../components/ui/doughnut-chart";
import { TransactionTable } from "../../../../components/ui/transaction-table";
import { Transaction } from "../../../types/Transaction";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Categoria {
  nome: string;
  valor: number;
}

export default function DashboardPage() {
  const [name, setName] = useState("");
  const [periodo, setPeriodo] = useState<"hoje" | "semana" | "mes">("mes");
  const [saldo, setSaldo] = useState(0);
  const [ganhos, setGanhos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [saldoAnterior, setSaldoAnterior] = useState(0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasGanhos, setCategoriasGanhos] = useState<Categoria[]>([]);
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saldosMensais, setSaldosMensais] = useState<
    { mes: string; saldo: number }[]
  >([]);

  const saldoProjetado = saldo + (saldo - saldoAnterior) * 6;

  const chartRef = useRef<ChartJS<"line", (number | null)[], string> | null>(
    null
  );

  useEffect(() => {
    async function carregarDashboard() {
      setLoading(true);
      const res = await fetch(`/api/summary?periodo=${periodo}`);
      const data = await res.json();

      setName(data.username);
      setSaldo(data.saldo || 0);
      setGanhos(data.totalGanhos || 0);
      setGastos(data.totalGastos || 0);
      setSaldoAnterior(data.saldoAnterior || 0);
      setCategorias(data.categorias || []);
      setCategoriasGanhos(data.categoriasGanhos || []);
      const transacoesConvertidas = (data.recentTransactions || []).map(
        (item: any) => ({
          id: item.id,
          descricao: item.description,
          valor: item.amount,
          tipo: item.type,
          categoria: item.category || "",
          pago: true, // Placeholder; ajuste se quiser usar status real
          data: item.date,
        })
      );
      setTransacoes(transacoesConvertidas);
      setSaldosMensais(data.saldosMensais || []);
      setLoading(false);
      // Removido setPaginaAtual(1);
    }

    carregarDashboard();
  }, [periodo]);

  // Meta Financeira (exemplo: pode vir de API futuramente)
  const metaFinanceira = 10000;
  const percentualMeta =
    metaFinanceira > 0 ? Math.min((saldo / metaFinanceira) * 100, 100) : 0;

  function gerarInsightAutomatico() {
    if (ganhos > gastos) {
      return "💡 Você está economizando mais do que gastando. Ótimo trabalho!";
    }
    if (gastos > ganhos) {
      return "⚡ Seus gastos estão superiores aos ganhos. Atenção nas despesas!";
    }
    if (ganhos === 0 && gastos === 0) {
      return "📭 Nenhuma movimentação registrada ainda.";
    }
    return "📊 Continue acompanhando suas finanças para melhores resultados.";
  }

  // Função para gerar insight por categoria
  function gerarInsightCategoria() {
    if (categorias.length === 0) {
      return "💬 Sem dados suficientes para gerar insights por categoria ainda.";
    }

    const categoriaMaiorGasto = categorias.reduce((prev, current) => {
      return prev.valor > current.valor ? prev : current;
    });

    if (categoriaMaiorGasto.nome.toLowerCase().includes("transporte")) {
      return "🚗 Gastos com Transporte estão impactando seu orçamento. Revise deslocamentos.";
    }
    if (categoriaMaiorGasto.nome.toLowerCase().includes("alimentação")) {
      return "🍔 Gastos com Alimentação cresceram. Pode ser interessante revisar refeições.";
    }
    if (categoriaMaiorGasto.nome.toLowerCase().includes("lazer")) {
      return "🎉 Seu Lazer aumentou bastante! Ótimo, mas cuide do equilíbrio financeiro.";
    }

    return `📈 Seu maior gasto é em ${categoriaMaiorGasto.nome}. Acompanhe de perto para manter o controle.`;
  }

  function calcularCrescimentoMensal() {
    if (saldosMensais.length < 2) return null;

    const saldoAtual = saldosMensais[saldosMensais.length - 1].saldo;
    const saldoAnterior = saldosMensais[saldosMensais.length - 2].saldo;

    if (saldoAnterior === 0) return null; // evitar divisão por zero

    const crescimento =
      ((saldoAtual - saldoAnterior) / Math.abs(saldoAnterior)) * 100;

    return crescimento;
  }

  const dataLine: ChartData<"line", (number | null)[], string> = {
    labels: saldosMensais.map((item) => item.mes),
    datasets: [
      {
        label: "Saldo",
        data: saldosMensais.map((item) => item.saldo),
        borderColor: "#10B981",
        backgroundColor: chartRef.current
          ? (() => {
              const ctx = chartRef.current.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
              gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
              return gradient;
            })()
          : "rgba(16, 185, 129, 0.4)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#10B981",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `Saldo: R$ ${context.parsed.y.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`,
        },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `R$ ${value}`,
        },
      },
    },
  };

  return (
    <main className="flex flex-col gap-10 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-emerald-600">
          Visão Geral - {name}
        </h1>
        <div className="flex gap-2 bg-emerald-100 p-2 rounded-full">
          {["hoje", "semana", "mes"].map((item) => (
            <button
              key={item}
              onClick={() => setPeriodo(item as "hoje" | "semana" | "mes")}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                periodo === item
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-transparent text-emerald-600 hover:bg-emerald-200"
              }`}
            >
              {item === "hoje" ? "Hoje" : item === "semana" ? "Semana" : "Mês"}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Automáticos */}
      {!loading && (
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div className="text-emerald-600 font-semibold text-lg">
            {gerarInsightAutomatico()}
          </div>
        </div>
      )}

      {/* Insights por Categoria */}
      {!loading && (
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div className="text-emerald-600 font-semibold text-lg">
            {gerarInsightCategoria()}
          </div>
        </div>
      )}

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="h-24 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 animate-[pulse_1.5s_ease-in-out_infinite] rounded-lg"
              />
            ))
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <CardDashboard
                title="Saldo Atual"
                value={
                  <span className="text-emerald-700 font-bold">
                    R${" "}
                    {saldo.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                }
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <CardDashboard
                title="Ganhos"
                value={
                  <span className="text-emerald-700 font-bold">
                    R${" "}
                    {ganhos.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                }
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <CardDashboard
                title="Gastos"
                value={
                  <span className="text-emerald-700 font-bold">
                    R${" "}
                    {gastos.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                }
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <CardDashboard
                title="Projeção de Saldo"
                value={
                  <span className="text-emerald-700 font-bold">
                    R${" "}
                    {saldoProjetado.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                }
              />
            </motion.div>
          </>
        )}
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardDashboard title="Distribuição de Gastos">
          {loading ? (
            <div className="h-64 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 animate-[pulse_1.5s_ease-in-out_infinite] rounded-lg" />
          ) : categorias.length > 0 ? (
            <DoughnutChart categorias={categorias} />
          ) : (
            <p className="text-center text-gray-400">Sem dados para mostrar</p>
          )}
        </CardDashboard>

        <CardDashboard title="Distribuição de Ganhos">
          {loading ? (
            <div className="h-64 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 animate-[pulse_1.5s_ease-in-out_infinite] rounded-lg" />
          ) : categoriasGanhos.length > 0 ? (
            <DoughnutChart categorias={categoriasGanhos} />
          ) : (
            <p className="text-center text-gray-400">Sem dados para mostrar</p>
          )}
        </CardDashboard>
      </section>

      {/* Meta Financeira */}
      {!loading && (
        <section className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-emerald-600">
              Meta Financeira
            </h2>
            <span className="text-sm font-semibold text-emerald-700">
              {percentualMeta.toFixed(1)}% atingido
            </span>
          </div>
          <div className="w-full bg-emerald-100 rounded-full h-5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-5 rounded-full transition-all duration-700"
              style={{ width: `${percentualMeta}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Saldo Atual: R$ {saldo.toLocaleString("pt-BR")}</span>
            <span>Meta: R$ {metaFinanceira.toLocaleString("pt-BR")}</span>
          </div>
        </section>
      )}

      {/* Últimas Transações */}
      <section className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-emerald-600 mb-4">
          Últimas Transações
        </h2>
        {loading ? (
          <div className="h-32 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 animate-[pulse_1.5s_ease-in-out_infinite] rounded-lg" />
        ) : (
          <>
            <TransactionTable transacoes={transacoes} />
          </>
        )}
      </section>

      {/* Evolução mês a mês */}
      <section className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-emerald-600 mb-4">
          Evolução do Saldo
        </h2>
        {loading ? (
          <div className="h-64 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 animate-[pulse_1.5s_ease-in-out_infinite] rounded-lg" />
        ) : saldosMensais.length > 0 ? (
          <>
            {calcularCrescimentoMensal() !== null && (
              <div className="flex items-center gap-2 mb-4">
                {calcularCrescimentoMensal()! > 0 ? (
                  <span className="text-green-600 font-semibold">
                    📈 Crescimento de {calcularCrescimentoMensal()?.toFixed(1)}%
                    no último mês
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    📉 Queda de{" "}
                    {Math.abs(calcularCrescimentoMensal()!).toFixed(1)}% no
                    último mês
                  </span>
                )}
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Line ref={chartRef} data={dataLine} options={options} />
            </motion.div>
          </>
        ) : (
          <p className="text-center text-gray-400">
            Sem dados de evolução disponíveis.
          </p>
        )}
      </section>
    </main>
  );
}
