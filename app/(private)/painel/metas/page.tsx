"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  HiOutlineFlag,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import { useToast } from "@/hooks/use-toast";
import { UserHeader } from "@/components/UserHeader";
import { EmptyState } from "@/components/empty-state";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export default function MetasPage() {
  const userId = "cmaln9iey000o1521zzdzfcwj";
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [metaEditando, setMetaEditando] = useState<Goal | null>(null);
  const [novaMeta, setNovaMeta] = useState({ nome: "", valor: "", prazo: "" });
  const [modalAberto, setModalAberto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar metas
  const {
    data: metas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["goals", userId],
    queryFn: async () => {
      const response = await fetch(`/api/goals?userId=${userId}`);
      if (!response.ok) throw new Error("Erro ao carregar metas");
      return response.json();
    },
  });

  // Criar meta
  const criarMeta = useMutation({
    mutationFn: async (nova: {
      nome: string;
      valor: string;
      prazo: string;
    }) => {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nova.nome,
          target: parseFloat(nova.valor),
          deadline: nova.prazo,
          userId,
        }),
      });
      if (!response.ok) throw new Error("Erro ao criar meta");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", userId] });
      toast({
        title: "✨ Meta criada!",
        description: `A meta "${novaMeta.nome}" foi adicionada com sucesso.`,
      });
      setModalAberto(false);
      setNovaMeta({ nome: "", valor: "", prazo: "" });
    },
    onError: () => {
      toast({
        title: "Erro ao criar meta",
        description: "Não foi possível salvar sua meta. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  // Editar meta
  const editarMeta = useMutation({
    mutationFn: async (meta: {
      id: string;
      name: string;
      target: number;
      deadline: string;
      current: number;
    }) => {
      const response = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meta),
      });
      if (!response.ok) throw new Error("Erro ao atualizar meta");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", userId] });
      toast({
        title: "🎉 Meta atualizada!",
        description: `A meta "${novaMeta.nome}" foi editada com sucesso.`,
      });
      setModalAberto(false);
      setMetaEditando(null);
      setNovaMeta({ nome: "", valor: "", prazo: "" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar meta",
        description: "Não foi possível atualizar sua meta. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  // Deletar meta
  const deletarMeta = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir meta");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", userId] });
      toast({
        title: "Meta excluída! 🗑️",
        description: "Você pode desfazer essa ação se quiser.",
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir meta",
        description: "Não foi possível excluir sua meta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMeta.nome.trim() || !novaMeta.valor || !novaMeta.prazo) return;
    if (parseFloat(novaMeta.valor) <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor da meta deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    if (metaEditando !== null) {
      editarMeta.mutate({
        id: metaEditando.id,
        name: novaMeta.nome,
        target: parseFloat(novaMeta.valor),
        deadline: novaMeta.prazo,
        current: metaEditando.current,
      });
    } else {
      criarMeta.mutate(novaMeta);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      deletarMeta.mutate(id);
    }
  };

  return (
    <div className="relative">
      <UserHeader className="absolute top-6 right-6 z-50" />
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <HiOutlineFlag className="w-6 h-6 text-emerald-600" /> Suas Metas
        </h1>
        <p className="text-muted-foreground text-sm">
          Alcance seus objetivos com organização e inteligência.
        </p>
        {isLoading && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
            <div className="text-center text-gray-400 text-sm mt-2">
              Carregando suas metas...
            </div>
          </>
        )}
        {isError && (
          <div className="text-center text-red-500">
            Erro ao carregar metas.
          </div>
        )}
        {!isLoading && !isError && metas.length > 0 && (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setModalAberto(true)}
          >
            <HiOutlinePlusCircle className="w-5 h-5" />
            Adicionar Meta
          </Button>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {!isLoading && !isError && metas.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={<HiOutlineFlag className="w-8 h-8" />}
                message="Você ainda não tem metas. Que tal criar a primeira?"
                action={
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setModalAberto(true)}
                  >
                    <HiOutlinePlusCircle className="w-5 h-5" />
                    Criar Meta
                  </Button>
                }
              />
            </div>
          )}
          {!isLoading &&
            !isError &&
            metas.map((meta: Goal) => (
              <Card
                key={meta.id}
                className="flex flex-col justify-between border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] group rounded-xl bg-white dark:bg-zinc-900"
              >
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-gray-800 dark:text-white flex-1">
                    {meta.name}
                  </CardTitle>
                  <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold ml-2">
                    {meta.target.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col justify-between px-4 pb-4 text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      Até {new Date(meta.deadline).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Progresso</div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{
                          width: `${(meta.current / meta.target) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-emerald-100 dark:hover:bg-emerald-900 flex items-center justify-center rounded-full p-2"
                      title="Editar"
                      onClick={() => {
                        setNovaMeta({
                          nome: meta.name,
                          valor: meta.target.toString(),
                          prazo: new Date(meta.deadline)
                            .toISOString()
                            .split("T")[0],
                        });
                        setMetaEditando(meta);
                        setModalAberto(true);
                      }}
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900 flex items-center justify-center rounded-full p-2"
                      title="Excluir"
                      onClick={() => handleDelete(meta.id)}
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {metaEditando !== null ? "Editar Meta" : "Nova Meta"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome da Meta
                </label>
                <Input
                  placeholder="Ex: Viagem para o Chile"
                  value={novaMeta.nome}
                  onChange={(e) =>
                    setNovaMeta((m) => ({ ...m, nome: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor Desejado (R$)
                </label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="R$ 5.000,00"
                  value={novaMeta.valor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseFloat(value) < 0) return;
                    setNovaMeta((m) => ({ ...m, valor: value }));
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prazo
                </label>
                <Input
                  type="date"
                  value={novaMeta.prazo}
                  onChange={(e) =>
                    setNovaMeta((m) => ({ ...m, prazo: e.target.value }))
                  }
                />
              </div>

              {/* Sugestões rápidas */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sugestões rápidas
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Viagem", "Fundo Emergência", "Curso", "Carro", "Casa"].map(
                    (sugestao) => (
                      <Button
                        key={sugestao}
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() =>
                          setNovaMeta((m) => ({
                            ...m,
                            nome: sugestao,
                          }))
                        }
                      >
                        {sugestao}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setModalAberto(false);
                    setMetaEditando(null);
                    setNovaMeta({ nome: "", valor: "", prazo: "" });
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : null}
                  {isSubmitting
                    ? "Salvando..."
                    : metaEditando !== null
                    ? "Salvar"
                    : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Button
        onClick={() => setModalAberto(true)}
        className="fixed bottom-6 right-6 md:hidden bg-emerald-600 hover:bg-emerald-700 shadow-lg rounded-full px-4 py-3 text-sm"
      >
        <HiOutlinePlusCircle className="w-5 h-5" />
      </Button>
    </div>
  );
}
