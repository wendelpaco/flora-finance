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

export default function MetasPage() {
  const [metas, setMetas] = useState([
    {
      nome: "Viagem para o Chile",
      valor: 5000,
      prazo: "29/12/2025",
      progresso: 40,
    },
    {
      nome: "Fundo de Emergência",
      valor: 10000,
      prazo: "14/11/2025",
      progresso: 60,
    },
    {
      nome: "Curso de Inglês",
      valor: 3000,
      prazo: "31/08/2025",
      progresso: 20,
    },
  ]);
  const [metaEditando, setMetaEditando] = useState<number | null>(null);
  const [novaMeta, setNovaMeta] = useState({ nome: "", valor: "", prazo: "" });
  const [modalAberto, setModalAberto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  return (
    <div className="relative">
      <UserHeader className="absolute top-6 right-6 z-50" />
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <HiOutlineFlag className="w-6 h-6" /> Minhas Metas
        </h1>
        <p className="text-muted-foreground text-sm">
          Defina e acompanhe metas financeiras personalizadas.
        </p>

        <Card className="shadow-md border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Nova Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!novaMeta.nome.trim() || !novaMeta.valor || !novaMeta.prazo)
                  return;

                setMetas((prev) => [
                  ...prev,
                  {
                    ...novaMeta,
                    valor: parseFloat(novaMeta.valor),
                    progresso: 0,
                  },
                ]);
                setNovaMeta({ nome: "", valor: "", prazo: "" });
                toast({
                  title: "Meta criada",
                  description: "Meta adicionada com sucesso!",
                });
              }}
              className="grid md:grid-cols-3 gap-4"
            >
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
                  placeholder="R$ 5.000,00"
                  value={novaMeta.valor}
                  onChange={(e) =>
                    setNovaMeta((m) => ({ ...m, valor: e.target.value }))
                  }
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
              <Button
                type="submit"
                className="col-span-full bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 ring-1 ring-emerald-700/30 hover:ring-emerald-700"
              >
                <HiOutlinePlusCircle className="w-4 h-4" />
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metas.length === 0 && (
            <Card className="col-span-full p-6 text-center text-muted-foreground border-dashed border-2 border-gray-300 dark:border-gray-700">
              <HiOutlineFlag className="w-8 h-8 mx-auto mb-2" />
              <p>Nenhuma meta cadastrada ainda. Crie a sua primeira meta!</p>
            </Card>
          )}
          {metas.map((meta, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] group"
            >
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">
                  {meta.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between px-4 pb-4 text-sm text-muted-foreground gap-4">
                <div className="space-y-1">
                  <div className="text-gray-800 dark:text-white font-medium">
                    Valor: R$ {meta.valor.toLocaleString("pt-BR")}
                  </div>
                  <div>Prazo: {meta.prazo}</div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Progresso</div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${meta.progresso}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs px-3 hover:bg-emerald-100 dark:hover:bg-emerald-900 flex items-center gap-1"
                    onClick={() => {
                      setNovaMeta({ ...meta, valor: meta.valor.toString() });
                      setMetaEditando(index);
                      setModalAberto(true);
                    }}
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs px-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 flex items-center gap-1"
                    onClick={() => {
                      const confirmar = confirm(
                        "Tem certeza que deseja excluir esta meta?"
                      );
                      if (confirmar) {
                        const metaRemovida = metas[index];
                        const atualizadas = metas.filter((_, i) => i !== index);
                        setMetas(atualizadas);
                        toast({
                          title: "Meta excluída!",
                          description: "Você pode desfazer essa ação.",
                          duration: 5000,
                          action: (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setMetas((prev) => {
                                  const novas = [...prev];
                                  novas.splice(index, 0, metaRemovida);
                                  return novas;
                                });
                              }}
                            >
                              Desfazer
                            </Button>
                          ),
                        });
                      }
                    }}
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Meta</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!novaMeta.nome.trim() || !novaMeta.valor || !novaMeta.prazo)
                  return;
                setIsSubmitting(true);

                setMetas((prev) =>
                  prev.map((meta, i) =>
                    i === metaEditando
                      ? {
                          ...novaMeta,
                          valor: parseFloat(novaMeta.valor),
                          progresso: prev[i].progresso,
                        }
                      : meta
                  )
                );
                toast({
                  title: "Meta atualizada",
                  description: "Meta editada com sucesso!",
                });
                setMetaEditando(null);
                setNovaMeta({ nome: "", valor: "", prazo: "" });
                setModalAberto(false);
                setIsSubmitting(false);
              }}
              className="space-y-4"
            >
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
                  placeholder="R$ 5.000,00"
                  value={novaMeta.valor}
                  onChange={(e) =>
                    setNovaMeta((m) => ({ ...m, valor: e.target.value }))
                  }
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
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setModalAberto(false);
                    setMetaEditando(null);
                    setNovaMeta({ nome: "", valor: "", prazo: "" });
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
