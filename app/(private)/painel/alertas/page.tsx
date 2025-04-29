"use client";

import { useState } from "react";
import { UserHeader } from "@/components/UserHeader";
import {
  HiOutlineBell,
  HiOutlinePlusCircle,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export default function AlertasPage() {
  const { toast } = useToast();
  const [alertas, setAlertas] = useState([
    {
      nome: "Saldo abaixo de R$500",
      tipo: "Saldo Baixo",
      canal: "WhatsApp",
      ativo: true,
    },
    {
      nome: "Meta Viagem atingida",
      tipo: "Meta Atingida",
      canal: "Sistema",
      ativo: true,
    },
  ]);

  const [novoAlerta, setNovoAlerta] = useState({
    nome: "",
    tipo: "",
    canal: "",
    ativo: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="relative">
      <UserHeader className="absolute top-6 right-6 z-50" />
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <HiOutlineBell className="w-6 h-6 text-emerald-600" />
          Meus Alertas
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie alertas inteligentes e notificações personalizadas para
          otimizar suas finanças com tecnologia de ponta.
        </p>

        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogTrigger asChild>
            {alertas.length > 0 && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setModalAberto(true)}
              >
                <HiOutlinePlusCircle className="w-4 h-4 mr-2" />
                Novo Alerta
              </Button>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Alerta</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Crie alertas personalizados para ser notificado automaticamente
                sobre suas finanças.
              </p>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!novoAlerta.nome || !novoAlerta.tipo || !novoAlerta.canal)
                  return;

                setIsLoading(true);
                setTimeout(() => {
                  setAlertas((prev) => [...prev, novoAlerta]);
                  toast({
                    title: "Alerta criado com sucesso! 🎉",
                    description:
                      "Você será notificado automaticamente conforme o evento definido. 😉",
                  });
                  setNovoAlerta({
                    nome: "",
                    tipo: "",
                    canal: "",
                    ativo: true,
                  });
                  setIsLoading(false);
                  setModalAberto(false);
                }, 1000);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome do Alerta
                </label>
                <Input
                  className="focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Ex: Notifique-me se o saldo cair abaixo de R$100"
                  value={novoAlerta.nome}
                  onChange={(e) =>
                    setNovoAlerta((a) => ({ ...a, nome: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de Alerta
                </label>
                <Select
                  onValueChange={(valor) =>
                    setNovoAlerta((a) => ({ ...a, tipo: valor }))
                  }
                  value={novoAlerta.tipo}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    <SelectValue placeholder="Escolha o tipo de alerta que melhor se encaixa à sua necessidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Saldo Baixo">Saldo Baixo</SelectItem>
                    <SelectItem value="Meta Atingida">Meta Atingida</SelectItem>
                    <SelectItem value="Gasto Elevado">Gasto Elevado</SelectItem>
                    <SelectItem value="Despesa Fixa">Despesa Fixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Canal de Envio
                </label>
                <Select
                  onValueChange={(valor) =>
                    setNovoAlerta((a) => ({ ...a, canal: valor }))
                  }
                  value={novoAlerta.canal}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    <SelectValue placeholder="Selecione onde deseja receber suas notificações com carinho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Sistema">Sistema</SelectItem>
                    <SelectItem value="Ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alerta Ativo
                </label>
                <Switch
                  checked={novoAlerta.ativo}
                  className="data-[state=checked]:bg-emerald-600"
                  onCheckedChange={(valor) =>
                    setNovoAlerta((a) => ({ ...a, ativo: valor }))
                  }
                />
              </div>

              <hr className="border-muted my-4" />

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                Sugestões rápidas:
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border px-4 py-1 text-sm hover:bg-emerald-100"
                  onClick={() =>
                    setNovoAlerta({
                      nome: "Saldo abaixo de R$100",
                      tipo: "Saldo Baixo",
                      canal: "WhatsApp",
                      ativo: true,
                    })
                  }
                  type="button"
                >
                  Saldo Baixo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border px-4 py-1 text-sm hover:bg-emerald-100"
                  onClick={() =>
                    setNovoAlerta({
                      nome: "Meta X atingida",
                      tipo: "Meta Atingida",
                      canal: "Sistema",
                      ativo: true,
                    })
                  }
                  type="button"
                >
                  Meta Atingida
                </Button>
              </div>

              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalAberto(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2 text-white inline-block"
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
                          d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10h4z"
                        ></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alerta"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {alertas.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertas.map((alerta, index) => (
              <div
                key={index}
                className="transition-transform duration-300 ease-in-out hover:scale-[1.01]"
              >
                <Card className="shadow-md border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">
                      {alerta.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
                    <div>
                      <strong>Tipo:</strong> {alerta.tipo}
                    </div>
                    <div>
                      <strong>Canal:</strong> {alerta.canal}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <Badge
                        className={
                          alerta.ativo
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }
                      >
                        {alerta.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs px-3 flex items-center gap-1 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                        onClick={() => {
                          setNovoAlerta(alerta);
                          setModalAberto(true);
                        }}
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs px-3 text-red-600 flex items-center gap-1 hover:bg-red-100 dark:hover:bg-red-900"
                        onClick={() => {
                          const confirmar = confirm(
                            "Tem certeza que deseja excluir este alerta?"
                          );
                          if (confirmar) {
                            const alertaRemovido = alertas[index];
                            const atualizado = alertas.filter(
                              (_, i) => i !== index
                            );
                            setAlertas(atualizado);

                            toast({
                              title: "Alerta removido",
                              description: "Você pode desfazer essa ação.",
                              action: (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setAlertas((prev) => {
                                      const novo = [...prev];
                                      novo.splice(index, 0, alertaRemovido);
                                      return novo;
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
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<HiOutlineBell className="w-8 h-8" />}
            message="Você ainda não possui alertas configurados. Configure notificações personalizadas para manter suas finanças no controle."
            action={
              <Button
                onClick={() => setModalAberto(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <HiOutlinePlusCircle className="w-4 h-4 mr-2" />
                Criar meu primeiro alerta
              </Button>
            }
          />
        )}

        <Button
          onClick={() => setModalAberto(true)}
          className="fixed bottom-6 right-6 md:hidden bg-emerald-600 hover:bg-emerald-700 shadow-lg rounded-full px-4 py-3 text-sm"
        >
          <HiOutlinePlusCircle className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
