"use client";

import { useState, useEffect } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { CardDashboard } from "../../../components/ui/card-dashboard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "GANHO" | "GASTO";
  category?: string;
  date: string;
}

export default function DashboardPage() {
  const objetivoFinanceiro = {
    nome: "Viagem para Europa",
    valorObjetivo: 10000,
    dataLimite: new Date(new Date().getFullYear(), 11, 31), // 31 de dezembro deste ano
  };
  const [saldo, setSaldo] = useState(0);
  const [ganhos, setGanhos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<
    Record<string, number>
  >({});
  const [ganhosPorCategoria, setGanhosPorCategoria] = useState<
    Record<string, number>
  >({});
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  // Novo estado para o período (diário, semanal, mensal)
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );

  const [historico, setHistorico] = useState<{
    diario: { dia: string; ganhos: number; gastos: number }[];
    semanal: { semana: string; ganhos: number; gastos: number }[];
    mensal: { mes: string; ganhos: number; gastos: number }[];
  }>({ diario: [], semanal: [], mensal: [] });

  // Estado para saldo anterior
  const [saldoAnterior, setSaldoAnterior] = useState(0);

  useEffect(() => {
    async function fetchSummary() {
      const res = await fetch("/api/summary");
      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      setSaldo(data.saldo);
      setGanhos(data.totalGanhos);
      setGastos(data.totalGastos);
      setGastosPorCategoria(data.gastosPorCategoria);
      setGanhosPorCategoria(data.ganhosPorCategoria);
      setRecentTransactions(data.recentTransactions);
      setHistorico(data.historico);
      setSaldoAnterior(
        data.historico.mensal.length > 1
          ? data.historico.mensal[data.historico.mensal.length - 2].ganhos -
              data.historico.mensal[data.historico.mensal.length - 2].gastos
          : 0
      );
    }

    fetchSummary();
  }, []);

  const doughnutData = {
    labels: ["Ganhos", "Gastos"],
    datasets: [
      {
        data: [ganhos, gastos],
        backgroundColor: ["#34d399", "#f87171"],
        borderColor: ["#10b981", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  // Função para gerar dados do gráfico de barras conforme o período selecionado
  function buildBarData() {
    let labels: string[] = [];
    let ganhosData: number[] = [];
    let gastosData: number[] = [];

    if (period === "monthly") {
      labels = historico.mensal.map((m) => m.mes);
      ganhosData = historico.mensal.map((m) => m.ganhos);
      gastosData = historico.mensal.map((m) => m.gastos);
    } else if (period === "weekly") {
      labels = historico.semanal.map((s) => s.semana);
      ganhosData = historico.semanal.map((s) => s.ganhos);
      gastosData = historico.semanal.map((s) => s.gastos);
    } else if (period === "daily") {
      labels = historico.diario.map((d) => d.dia);
      ganhosData = historico.diario.map((d) => d.ganhos);
      gastosData = historico.diario.map((d) => d.gastos);
    }

    return {
      labels,
      datasets: [
        {
          label: "Ganhos",
          data: ganhosData,
          backgroundColor: "#34d399",
        },
        {
          label: "Gastos",
          data: gastosData,
          backgroundColor: "#f87171",
        },
      ],
    };
  }

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#047857",
          font: { weight: "bold" as const },
        },
      },
    },
    responsive: true,
  };

  // Cálculo da projeção de saldo futuro
  const crescimentoMedioMensal =
    historico.mensal.length >= 2
      ? historico.mensal
          .map((m) => m.ganhos - m.gastos)
          .reduce((acc, saldo) => acc + saldo, 0) / historico.mensal.length
      : 0;
  const mesesProjecao = 6;
  const saldoProjetado = saldo + crescimentoMedioMensal * mesesProjecao;

  // Função para gerar alertas automáticos inteligentes
  function gerarAlertas() {
    const alertas: string[] = [];

    const totalGastos = Object.values(gastosPorCategoria).reduce(
      (acc, v) => acc + v,
      0
    );
    const totalGanhos = Object.values(ganhosPorCategoria).reduce(
      (acc, v) => acc + v,
      0
    );

    if (totalGanhos > 0) {
      const poupancaPercentual = (saldo / totalGanhos) * 100;
      if (poupancaPercentual >= 30) {
        alertas.push(
          "🎯 Ótimo! Você poupou mais de 30% dos seus ganhos este mês."
        );
      } else if (poupancaPercentual < 10) {
        alertas.push(
          "⚠️ Atenção: Você poupou menos de 10% dos seus ganhos este mês."
        );
      }
    }

    const categoriaMaiorGasto = Object.entries(gastosPorCategoria).sort(
      (a, b) => b[1] - a[1]
    )[0];
    if (categoriaMaiorGasto && totalGastos > 0) {
      const percentualCategoria = (categoriaMaiorGasto[1] / totalGastos) * 100;
      if (percentualCategoria >= 50) {
        alertas.push(
          `🚨 Mais de 50% dos seus gastos foram com ${categoriaMaiorGasto[0]}.`
        );
      }
    }

    if (totalGastos > totalGanhos) {
      alertas.push("🚨 Seus gastos superaram seus ganhos este mês.");
    }

    return alertas;
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 text-gray-800 px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-600 mb-4 text-center tracking-tight">
        Flora Finance - Dashboard
      </h1>

      <p className="text-center text-emerald-700 font-medium mb-12">
        Visão geral financeira consolidada
      </p>

      {/* Saldo destacado */}
      <section className="flex flex-col items-center mb-10">
        <div className="bg-white rounded-2xl px-8 py-6 shadow-xl border-2 border-emerald-200 mb-4 w-full max-w-lg">
          <h2 className="text-lg font-semibold mb-2 text-emerald-700 text-center">
            Saldo Total
          </h2>
          <p className="text-4xl font-extrabold text-emerald-500 text-center tracking-tight">
            R$ {saldo.toLocaleString("pt-BR")}
          </p>
          {saldoAnterior !== 0 && (
            <div className="flex justify-center items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  saldo - saldoAnterior >= 0 ? "text-green-500" : "text-red-500"
                } flex items-center`}
              >
                {saldo - saldoAnterior >= 0 ? "▲" : "▼"}{" "}
                {saldoAnterior
                  ? Math.abs(
                      ((saldo - saldoAnterior) / saldoAnterior) * 100
                    ).toFixed(1)
                  : "0"}
                % {saldo - saldoAnterior >= 0 ? "a mais" : "a menos"} que o mês
                anterior
              </span>
            </div>
          )}
        </div>
        {/* Insights Automáticos */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 w-full max-w-2xl mt-4">
          <h3 className="text-lg font-bold text-emerald-600 mb-4 text-center">
            Insights Financeiros
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {saldoAnterior !== 0 && (
              <li>
                {saldo - saldoAnterior >= 0 ? (
                  <>
                    ✅ Seu saldo aumentou em{" "}
                    {Math.abs(
                      ((saldo - saldoAnterior) / saldoAnterior) * 100
                    ).toFixed(1)}
                    % em relação ao mês anterior. Ótimo progresso!
                  </>
                ) : (
                  <>
                    ⚠️ Seu saldo caiu em{" "}
                    {Math.abs(
                      ((saldo - saldoAnterior) / saldoAnterior) * 100
                    ).toFixed(1)}
                    % em relação ao mês anterior. Atenção aos gastos!
                  </>
                )}
              </li>
            )}
            {Object.keys(gastosPorCategoria).length > 0 && (
              <li>
                📉 Sua maior despesa foi com{" "}
                <strong>
                  {
                    Object.entries(gastosPorCategoria).sort(
                      (a, b) => b[1] - a[1]
                    )[0][0]
                  }
                </strong>
                .
              </li>
            )}
            {Object.keys(ganhosPorCategoria).length > 0 && (
              <li>
                📈 Sua principal fonte de renda foi{" "}
                <strong>
                  {
                    Object.entries(ganhosPorCategoria).sort(
                      (a, b) => b[1] - a[1]
                    )[0][0]
                  }
                </strong>
                .
              </li>
            )}
          </ul>
        </section>
        {/* Projeção Financeira */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 w-full max-w-2xl mt-8">
          <h3 className="text-lg font-bold text-emerald-600 mb-4 text-center">
            Projeção de Saldo Futuro
          </h3>
          {crescimentoMedioMensal !== 0 ? (
            <p className="text-center text-gray-700">
              Se você mantiver seu padrão atual, em{" "}
              <strong>{mesesProjecao} meses</strong> seu saldo será
              aproximadamente{" "}
              <span
                className={`font-bold ${
                  saldoProjetado >= saldo ? "text-green-500" : "text-red-500"
                }`}
              >
                R${" "}
                {saldoProjetado.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
              .
            </p>
          ) : (
            <p className="text-center text-gray-400">
              Dados insuficientes para projeção.
            </p>
          )}
        </section>

        {/* Alertas Inteligentes */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 w-full max-w-2xl mt-8">
          <h3 className="text-lg font-bold text-emerald-600 mb-4 text-center">
            Alertas Inteligentes
          </h3>
          {gerarAlertas().length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {gerarAlertas().map((alerta, idx) => (
                <li key={idx}>🔔 {alerta}</li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">
              Nenhum alerta para este período.
            </p>
          )}
        </section>
        {/* Objetivo Financeiro */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 w-full max-w-2xl mt-8">
          <h3 className="text-lg font-bold text-emerald-600 mb-4 text-center">
            Seu Objetivo Financeiro
          </h3>
          <div className="text-center text-gray-700">
            <p className="font-medium">🎯 {objetivoFinanceiro.nome}</p>
            <p className="mt-2">
              Meta:{" "}
              <strong>
                R$ {objetivoFinanceiro.valorObjetivo.toLocaleString("pt-BR")}
              </strong>
            </p>
            <p>
              Data limite:{" "}
              <strong>
                {objetivoFinanceiro.dataLimite.toLocaleDateString("pt-BR")}
              </strong>
            </p>
            <p className="mt-2">
              Faltam:{" "}
              <span
                className={`font-bold ${
                  saldo >= objetivoFinanceiro.valorObjetivo
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                R${" "}
                {(objetivoFinanceiro.valorObjetivo - saldo > 0
                  ? objetivoFinanceiro.valorObjetivo - saldo
                  : 0
                ).toLocaleString("pt-BR")}
              </span>
            </p>
            <p className="mt-2">
              Você precisa acumular cerca de{" "}
              <strong>
                R${" "}
                {Math.ceil(
                  (objetivoFinanceiro.valorObjetivo - saldo) /
                    Math.max(
                      1,
                      objetivoFinanceiro.dataLimite.getMonth() +
                        1 -
                        (new Date().getMonth() + 1)
                    )
                ).toLocaleString("pt-BR")}
              </strong>{" "}
              por mês.
            </p>
          </div>
        </section>
      </section>

      {/* Evolução do Saldo Mensal */}
      <section className="bg-white p-8 rounded-xl shadow-lg border border-emerald-100 mb-12 w-full max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-emerald-600 mb-6 text-center">
          Evolução do Saldo Mensal
        </h2>
        <Line
          data={{
            labels: historico.mensal.map((m) => m.mes),
            datasets: [
              {
                label: "Saldo",
                data: historico.mensal.map((m) => m.ganhos - m.gastos),
                fill: true,
                backgroundColor: "rgba(16,185,129,0.1)",
                borderColor: "#10b981",
                tension: 0.4,
                pointBackgroundColor: "#10b981",
                pointBorderColor: "#10b981",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "#047857",
                  font: { weight: "bold" as const },
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#6b7280" },
                grid: { display: false },
              },
              y: {
                ticks: { color: "#6b7280" },
                grid: { color: "#e5e7eb" },
              },
            },
          }}
        />
      </section>

      {/* Cards de Ganhos/Gastos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 text-center transition-transform hover:scale-105">
          <h2 className="text-lg font-semibold mb-2 text-green-600">Ganhos</h2>
          <p className="text-3xl font-bold text-green-500">
            +R$ {ganhos.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 text-center transition-transform hover:scale-105">
          <h2 className="text-lg font-semibold mb-2 text-red-500">Gastos</h2>
          <p className="text-3xl font-bold text-red-400">
            -R$ {gastos.toLocaleString("pt-BR")}
          </p>
        </div>
      </section>

      {/* Ganhos vs Gastos e Distribuição de Gastos por Categoria - Premium Clean Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Gráfico de Ganhos vs Gastos */}
        <CardDashboard title="Ganhos vs Gastos">
          <Doughnut
            data={{
              labels: ["Ganhos", "Gastos"],
              datasets: [
                {
                  data: [ganhos, gastos],
                  backgroundColor: ["#34d399", "#f87171"],
                  borderColor: ["#10b981", "#ef4444"],
                  borderWidth: 2,
                },
              ],
            }}
            options={chartOptions}
          />
        </CardDashboard>

        {/* Gráfico de Categorias de Gastos */}
        <CardDashboard title="Distribuição de Gastos por Categoria">
          {Object.keys(gastosPorCategoria).length > 0 ? (
            <Doughnut
              data={{
                labels: Object.keys(gastosPorCategoria),
                datasets: [
                  {
                    data: Object.values(gastosPorCategoria),
                    backgroundColor: [
                      "#60a5fa",
                      "#fb923c",
                      "#34d399",
                      "#f472b6",
                      "#facc15",
                      "#38bdf8",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={chartOptions}
            />
          ) : (
            <p className="text-center text-gray-400">Sem dados de gastos</p>
          )}
        </CardDashboard>
      </section>

      {/* Resumo Geral de Ganhos vs Gastos */}
      <section className="bg-white p-8 rounded-xl shadow-lg border border-emerald-100 mb-12 w-full max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-emerald-600 mb-6 text-center">
          Resumo Geral de Ganhos vs Gastos
        </h2>
        <Doughnut data={doughnutData} options={chartOptions} />
        <div className="flex justify-center mt-6 space-x-8">
          <div className="flex items-center space-x-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ background: "#34d399" }}
            />
            <span className="text-green-700 font-medium">Ganhos</span>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ background: "#f87171" }}
            />
            <span className="text-red-500 font-medium">Gastos</span>
          </div>
        </div>
      </section>

      {/* Distribuição de Ganhos e Gastos por Categoria */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Gráfico de Ganhos */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
          <h2 className="text-xl font-bold text-emerald-600 mb-6 text-center">
            Distribuição de Ganhos por Categoria
          </h2>
          {Object.keys(ganhosPorCategoria).length > 0 ? (
            <Doughnut
              data={{
                labels: Object.keys(ganhosPorCategoria),
                datasets: [
                  {
                    data: Object.values(ganhosPorCategoria),
                    backgroundColor: [
                      "#60a5fa",
                      "#fb923c",
                      "#34d399",
                      "#f472b6",
                      "#facc15",
                      "#38bdf8",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={chartOptions}
            />
          ) : (
            <p className="text-gray-400 text-center">Sem dados de ganhos</p>
          )}
        </div>

        {/* Gráfico de Gastos */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
          <h2 className="text-xl font-bold text-emerald-600 mb-6 text-center">
            Distribuição de Gastos por Categoria
          </h2>
          {Object.keys(gastosPorCategoria).length > 0 ? (
            <Doughnut
              data={{
                labels: Object.keys(gastosPorCategoria),
                datasets: [
                  {
                    data: Object.values(gastosPorCategoria),
                    backgroundColor: [
                      "#60a5fa",
                      "#fb923c",
                      "#34d399",
                      "#f472b6",
                      "#facc15",
                      "#38bdf8",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={chartOptions}
            />
          ) : (
            <p className="text-gray-400 text-center">Sem dados de gastos</p>
          )}
        </div>
      </section>

      {/* Gráfico de Barras */}
      <section className="bg-white p-8 rounded-xl shadow-lg border border-emerald-100 mb-12">
        {/* Botões para trocar o período */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setPeriod("daily")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              period === "daily"
                ? "bg-emerald-500 text-white"
                : "bg-white border border-emerald-300 text-emerald-600"
            }`}
          >
            Diário
          </button>
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              period === "weekly"
                ? "bg-emerald-500 text-white"
                : "bg-white border border-emerald-300 text-emerald-600"
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              period === "monthly"
                ? "bg-emerald-500 text-white"
                : "bg-white border border-emerald-300 text-emerald-600"
            }`}
          >
            Mensal
          </button>
        </div>
        {/* Título do gráfico com período */}
        <h2 className="text-xl font-bold text-emerald-600 mb-6 text-center">
          Resumo{" "}
          {period === "daily"
            ? "Diário"
            : period === "weekly"
            ? "Semanal"
            : "Mensal"}
        </h2>
        <Bar
          data={buildBarData()}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              legend: {
                ...chartOptions.plugins.legend,
                labels: {
                  ...chartOptions.plugins.legend.labels,
                  color: "#374151",
                },
              },
              title: {
                display: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text:
                    period === "monthly"
                      ? "Mês"
                      : period === "weekly"
                      ? "Semana"
                      : "Dia",
                  color: "#047857",
                  font: { weight: "bold" },
                },
                ticks: { color: "#6b7280" },
                grid: { display: false },
              },
              y: {
                title: {
                  display: true,
                  text: "Valor (R$)",
                  color: "#047857",
                  font: { weight: "bold" },
                },
                ticks: { color: "#6b7280" },
                grid: { color: "#e5e7eb" },
              },
            },
          }}
        />
      </section>

      {/* Transações Recentes */}
      <section className="bg-white rounded-xl p-8 shadow-lg border border-emerald-100 mb-12 w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-emerald-600 mb-6">
          Últimas Transações
        </h2>
        <ul>
          {recentTransactions.map((t, idx) => (
            <li
              key={t.id}
              className={`flex justify-between text-sm ${
                idx < recentTransactions.length - 1
                  ? "border-b border-emerald-100 pb-2 mb-2"
                  : ""
              }`}
            >
              <span>{t.description}</span>
              <span
                className={
                  t.type === "GANHO" ? "text-green-500" : "text-red-400"
                }
              >
                {t.type === "GANHO" ? "+" : "-"}R${" "}
                {Math.abs(t.amount).toLocaleString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Botão */}
      <div className="flex justify-center">
        <button className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 hover:scale-105 hover:brightness-110 transition-transform text-white font-bold py-3 px-8 rounded-full shadow-md">
          Gerar Resumo Manual
        </button>
      </div>
    </main>
  );
}
