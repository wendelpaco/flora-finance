"use client";

import { useState, useEffect } from "react";
import { UserHeader } from "@/components/UserHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HiOutlinePlusCircle,
  HiOutlineArrowUpCircle,
  HiOutlineArrowDownCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChartBar,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Transaction } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

type TransactionForm = Omit<Transaction, "user">;

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transaction[] | null>(null);
  const [transacaoEditandoIndex, setTransacaoEditandoIndex] = useState<
    number | null
  >(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaTransacao, setNovaTransacao] = useState<TransactionForm>({
    id: "",
    userId: "",
    type: "GASTO",
    description: "",
    amount: 0,
    category: "",
    date: new Date(),
    createdAt: new Date(),
  });

  // Resumo dos valores
  const totalGanhos = transacoes
    ? transacoes
        .filter((t) => t.type === "GANHO")
        .reduce((acc, t) => acc + t.amount, 0)
    : 0;

  const totalGastos = transacoes
    ? transacoes
        .filter((t) => t.type === "GASTO")
        .reduce((acc, t) => acc + Math.abs(t.amount), 0)
    : 0;

  const saldo = totalGanhos - totalGastos;

  useEffect(() => {
    async function fetchTransacoes() {
      try {
        const res = await fetch("/api/summary?periodo=mes");
        if (!res.ok) throw new Error("Erro ao buscar transações");
        const data = await res.json();
        if (data?.recentTransactions) {
          setTransacoes(data.recentTransactions);
        } else {
          setTransacoes([]);
        }
      } catch {
        setTransacoes([]);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as transações.",
        });
      }
    }

    fetchTransacoes();
  }, []);

  function abrirModalNovaTransacao() {
    setNovaTransacao({
      id: "",
      userId: "",
      type: "GASTO",
      description: "",
      amount: 0,
      category: "",
      date: new Date(),
      createdAt: new Date(),
    });
    setTransacaoEditandoIndex(null);
    setModalAberto(true);
  }

  function salvarTransacao() {
    if (
      !novaTransacao.description.trim() ||
      !novaTransacao.category?.trim() ||
      !novaTransacao.date
    ) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    if (transacaoEditandoIndex !== null) {
      setTransacoes((prev) => {
        if (!prev) return [novaTransacao as Transaction];
        const atualizadas = [...prev];
        atualizadas[transacaoEditandoIndex] = {
          ...novaTransacao,
          id: atualizadas[transacaoEditandoIndex].id || novaTransacao.id || "",
          createdAt:
            atualizadas[transacaoEditandoIndex].createdAt || new Date(),
          userId: atualizadas[transacaoEditandoIndex].userId || "",
          type: novaTransacao.type,
          amount: novaTransacao.amount,
          category: novaTransacao.category,
          date: novaTransacao.date,
          description: novaTransacao.description,
        };
        return atualizadas;
      });
      toast({
        title: "Transação atualizada",
        description: "Sua transação foi atualizada com sucesso.",
      });
    } else {
      setTransacoes((prev) => {
        const nova = {
          ...novaTransacao,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          userId: novaTransacao.userId || "",
        } as Transaction;
        return prev ? [...prev, nova] : [nova];
      });
      toast({
        title: "Transação adicionada",
        description: "Sua nova transação foi adicionada com sucesso.",
      });
    }

    setModalAberto(false);
    setTransacaoEditandoIndex(null);
  }

  function excluirTransacao(index: number) {
    const confirmacao = confirm("Deseja realmente excluir esta transação?");
    if (!confirmacao) return;

    setTransacoes((prev) => {
      if (!prev) return [];
      const atualizadas = prev.filter((_, i) => i !== index);
      return atualizadas;
    });

    toast({
      title: "Transação excluída",
      description: "A transação foi removida com sucesso.",
    });
  }

  return (
    <div className="relative">
      <UserHeader className="absolute top-6 right-6 z-50" />

      <div className="flex flex-col gap-6 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <HiOutlineSwitchHorizontal className="w-6 h-6 text-emerald-600" />
          Minhas Transações
        </h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe e analise suas transações financeiras com inteligência.
          Organize seus ganhos e despesas com tecnologia de ponta.
        </p>

        {/* Cards de resumo com motion */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key="cards"
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    Receitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transacoes === null ? (
                    <div className="h-8 w-24 bg-gray-300 dark:bg-zinc-700 rounded animate-pulse" />
                  ) : (
                    <span className="text-2xl font-semibold text-emerald-600">
                      R${" "}
                      {totalGanhos.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    Despesas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transacoes === null ? (
                    <div className="h-8 w-24 bg-gray-300 dark:bg-zinc-700 rounded animate-pulse" />
                  ) : (
                    <span className="text-2xl font-semibold text-red-600">
                      R${" "}
                      {totalGastos.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    Saldo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transacoes === null ? (
                    <div className="h-8 w-24 bg-gray-300 dark:bg-zinc-700 rounded animate-pulse" />
                  ) : (
                    <span
                      className={`text-2xl font-semibold ${
                        saldo >= 0 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      R${" "}
                      {saldo.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Botões de ação */}
        {transacoes !== null && (
          <div className="mt-4 flex justify-between items-center">
            <div /> {/* Espaço vazio para manter alinhamento */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setTransacoes(null);
                  fetch("/api/summary?periodo=mes")
                    .then((res) => res.json())
                    .then((data) => setTransacoes(data.recentTransactions))
                    .catch(() =>
                      toast({
                        variant: "destructive",
                        title: "Erro",
                        description: "Erro ao atualizar transações.",
                      })
                    );
                }}
                className="flex items-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <HiOutlineArrowPath className="w-5 h-5" />
                Atualizar
              </Button>

              <Button
                onClick={abrirModalNovaTransacao}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
              >
                <HiOutlinePlusCircle className="w-5 h-5" />
                Nova Transação
              </Button>
            </div>
          </div>
        )}

        {/* Conteúdo principal */}
        <section className="mt-10">
          {/* Skeleton loader */}
          {transacoes === null && (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-300 dark:bg-zinc-700 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          {/* EmptyState elegante */}
          {transacoes !== null && transacoes.length === 0 && (
            <EmptyState
              icon={
                <HiOutlineChartBar className="w-12 h-12 text-emerald-600" />
              }
              message="Nenhuma transação encontrada."
              action={
                <Button
                  onClick={abrirModalNovaTransacao}
                  className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                >
                  <HiOutlinePlusCircle className="w-5 h-5" />
                  Criar minha primeira transação
                </Button>
              }
              className="mt-20"
            />
          )}

          {/* Tabela de transações */}
          {transacoes !== null && transacoes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-zinc-900"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  Histórico de Transações
                  <span className="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 text-sm font-semibold px-3 py-1 rounded-full">
                    {transacoes.length}
                  </span>
                </h2>
              </div>
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
                    <th className="py-3 px-6 text-right whitespace-nowrap">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.map((t, index) => {
                    const isReceita = t.type === "GANHO";
                    return (
                      <motion.tr
                        key={t.id || index}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="border-b bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <td className="py-3 px-6 whitespace-nowrap">
                          {new Date(t.date).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-6">{t.description}</td>
                        <td className="py-3 px-6">{t.category}</td>
                        <td className="py-3 px-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                              isReceita
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                            aria-label={isReceita ? "Receita" : "Despesa"}
                          >
                            {isReceita ? (
                              <HiOutlineArrowUpCircle className="w-4 h-4" />
                            ) : (
                              <HiOutlineArrowDownCircle className="w-4 h-4" />
                            )}
                            {isReceita ? "Receita" : "Despesa"}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right whitespace-nowrap font-medium">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              isReceita ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isReceita ? (
                              <HiOutlineArrowUpCircle className="w-4 h-4" />
                            ) : (
                              <HiOutlineArrowDownCircle className="w-4 h-4" />
                            )}
                            R${" "}
                            {Math.abs(t.amount).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right whitespace-nowrap flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs px-3 flex items-center gap-1 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                            onClick={() => {
                              setNovaTransacao({
                                id: t.id,
                                userId: t.userId,
                                type: t.type,
                                description: t.description,
                                amount: t.amount,
                                category: t.category,
                                date: new Date(t.date),
                                createdAt: new Date(t.createdAt),
                              });
                              setTransacaoEditandoIndex(index);
                              setModalAberto(true);
                            }}
                          >
                            <HiOutlinePencil className="w-4 h-4" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs px-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                            onClick={() => excluirTransacao(index)}
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                            Excluir
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </section>

        {/* Modal Nova/Editar Transação */}
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {transacaoEditandoIndex === null
                  ? "Nova Transação"
                  : "Editar Transação"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                salvarTransacao();
              }}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Descrição <span className="text-red-500">*</span>
                </label>
                <Input
                  id="description"
                  placeholder="Descrição da transação"
                  value={novaTransacao.description}
                  onChange={(e) =>
                    setNovaTransacao((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Valor <span className="text-red-500">*</span>
                </label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={novaTransacao.amount}
                  onChange={(e) =>
                    setNovaTransacao((prev) => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Categoria <span className="text-red-500">*</span>
                </label>
                <Input
                  id="category"
                  placeholder="Categoria da transação"
                  value={novaTransacao.category!}
                  onChange={(e) =>
                    setNovaTransacao((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Data <span className="text-red-500">*</span>
                </label>
                <Input
                  id="date"
                  type="date"
                  value={novaTransacao.date.toISOString().substring(0, 10)}
                  onChange={(e) =>
                    setNovaTransacao((prev) => ({
                      ...prev,
                      date: new Date(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={novaTransacao.type}
                  onChange={(e) =>
                    setNovaTransacao((prev) => ({
                      ...prev,
                      type: e.target.value as "GANHO" | "GASTO",
                    }))
                  }
                  required
                >
                  <option value="GASTO">Despesa</option>
                  <option value="GANHO">Receita</option>
                </select>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 w-full"
                >
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
