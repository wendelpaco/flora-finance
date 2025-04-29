"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  categorias: {
    nome: string;
    valor: number;
  }[];
}

export function DoughnutChart({ categorias }: DoughnutChartProps) {
  const data = {
    labels: categorias.map((c) => c.nome),
    datasets: [
      {
        data: categorias.map((c) => c.valor),
        backgroundColor: [
          "#34d399", // verde claro
          "#60a5fa", // azul claro
          "#f87171", // vermelho claro
          "#facc15", // amarelo
          "#a78bfa", // roxo claro
          "#fb923c", // laranja claro
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#4B5563", // cinza escuro
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
