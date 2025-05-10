"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HiOutlinePlusCircle,
  HiOutlineChartPie,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import { DoughnutChart } from "@/components/ui/doughnut-chart";
import { useState } from "react";
import { UserHeader } from "@/components/UserHeader";

// Dados mockados para exemplo visual
const resumo = {
  saldo: 4068.5,
  ganhos: 5000,
  gastos: 931.5,
};

const categorias = [
  { nome: "Alimentação", valor: 400 },
  { nome: "Transporte", valor: 200 },
  { nome: "Lazer", valor: 150 },
  { nome: "Saúde", valor: 100 },
  { nome: "Outros", valor: 81.5 },
];

const ultimasTransacoes = [
  {
    data: "10/05/2025",
    descricao: "Salário",
    categoria: "Salário",
    tipo: "Receita",
    valor: 4000,
  },
  {
    data: "12/05/2025",
    descricao: "Mercado",
    categoria: "Alimentação",
    tipo: "Despesa",
    valor: 250,
  },
  {
    data: "13/05/2025",
    descricao: "Uber",
    categoria: "Transporte",
    tipo: "Despesa",
    valor: 60,
  },
  {
    data: "14/05/2025",
    descricao: "Farmácia",
    categoria: "Saúde",
    tipo: "Despesa",
    valor: 100,
  },
];

export default function VisaoGeralPage() {
  const [periodo, setPeriodo] = useState<"mes" | "semana">("mes");

  return (
    <div className="relative">
      <UserHeader className="absolute top-6 right-6 z-50" />
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <HiOutlineChartBar className="w-7 h-7 text-emerald-600" />
          Visão Geral
        </h1>
        <p className="text-muted-foreground text-sm mb-2">
          Acompanhe o panorama das suas finanças, visualize gráficos, últimas
          movimentações e insights inteligentes.
        </p>

        {/* Cards de resumo */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-emerald-600">
                R${" "}
                {resumo.ganhos.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-red-600">
                R${" "}
                {resumo.gastos.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span
                className={`text-2xl font-semibold ${
                  resumo.saldo >= 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                R${" "}
                {resumo.saldo.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <HiOutlineChartPie className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-base">Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <DoughnutChart categorias={categorias} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <HiOutlineChartBar className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-base">Evolução Financeira</CardTitle>
              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  variant={periodo === "mes" ? "default" : "outline"}
                  onClick={() => setPeriodo("mes")}
                >
                  Mês
                </Button>
                <Button
                  size="sm"
                  variant={periodo === "semana" ? "default" : "outline"}
                  onClick={() => setPeriodo("semana")}
                >
                  Semana
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Aqui pode entrar um gráfico de linha/barras futuramente */}
              <div className="h-40 flex items-center justify-center text-gray-400">
                <span>Gráfico de evolução financeira (em breve)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Últimas transações */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <CardTitle className="text-base">Últimas Transações</CardTitle>
            <Button size="sm" className="ml-auto flex items-center gap-2">
              <HiOutlinePlusCircle className="w-4 h-4" /> Nova Transação
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b text-muted-foreground">
                    <th className="py-3 px-6 text-left whitespace-nowrap">
                      Data
                    </th>
                    <th className="py-3 px-6 text-left whitespace-nowrap">
                      Descrição
                    </th>
                    <th className="py-3 px-6 text-left whitespace-nowrap">
                      Categoria
                    </th>
                    <th className="py-3 px-6 text-left whitespace-nowrap">
                      Tipo
                    </th>
                    <th className="py-3 px-6 text-right whitespace-nowrap">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasTransacoes.map((t, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <td className="py-3 px-6 whitespace-nowrap">{t.data}</td>
                      <td className="py-3 px-6">{t.descricao}</td>
                      <td className="py-3 px-6">{t.categoria}</td>
                      <td className="py-3 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            t.tipo === "Receita"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t.tipo}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-6 text-right whitespace-nowrap font-medium ${
                          t.tipo === "Receita"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        R${" "}
                        {t.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Metas e alertas (placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metas Financeiras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400">
                Em breve: acompanhe suas metas aqui!
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alertas & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400">
                Em breve: veja alertas e dicas inteligentes aqui!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
