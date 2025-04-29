"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HiOutlineTag,
  HiOutlineFolder,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserHeader } from "@/components/UserHeader";

export default function CategoriasPage() {
  const [novaCategoria, setNovaCategoria] = useState("");
  const [categorias, setCategorias] = useState([
    "Alimentação",
    "Transporte",
    "Investimentos",
    "Educação",
    "Lazer",
  ]);
  const [categoriaEditando, setCategoriaEditando] = useState<number | null>(
    null
  );
  const [modalAberto, setModalAberto] = useState(false);
  const { toast } = useToast();

  return (
    <div className="relative">
      <UserHeader className="absolute top-6 right-6 z-50" />
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <HiOutlineTag className="w-6 h-6" /> Minhas Categorias
        </h1>
        <p className="text-muted-foreground text-sm">
          Organize e personalize suas categorias de gastos e receitas.
        </p>

        <Card className="shadow-md border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Nova Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (novaCategoria.trim() === "") return;

                if (categorias.includes(novaCategoria)) {
                  toast({
                    title: "Ops!",
                    description: "Essa categoria já existe.",
                    variant: "destructive",
                  });
                  return;
                }

                setCategorias((prev) => [...prev, novaCategoria]);
                toast({
                  title: "Sucesso",
                  description: "Categoria adicionada com sucesso!",
                });
                setNovaCategoria("");
              }}
              className="flex flex-col md:flex-row gap-4"
            >
              <Input
                placeholder="Ex: Alimentação, Transporte, Investimentos"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  <span>Adicionar</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista mockada de categorias */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] group"
            >
              <CardHeader className="px-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white">
                  <HiOutlineFolder className="w-5 h-5" /> {categoria}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center px-4 pb-2">
                <span className="text-xs text-muted-foreground">
                  ID: {index + 1}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs px-3 hover:bg-emerald-100 dark:hover:bg-emerald-900 flex items-center gap-1"
                    onClick={() => {
                      setNovaCategoria(categoria);
                      setCategoriaEditando(index);
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
                        "Tem certeza que deseja excluir esta categoria?"
                      );
                      if (confirmar) {
                        const categoriaRemovida = categorias[index];
                        const atualizadas = categorias.filter(
                          (_, i) => i !== index
                        );
                        setCategorias(atualizadas);
                        toast({
                          title: "Categoria removida",
                          description: "Você pode desfazer essa ação.",
                          action: (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setCategorias((prev) => {
                                  const novas = [...prev];
                                  novas.splice(index, 0, categoriaRemovida);
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
      </div>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (novaCategoria.trim() === "") return;

              setCategorias((prev) =>
                prev.map((cat, i) =>
                  i === categoriaEditando ? novaCategoria : cat
                )
              );
              toast({
                title: "Atualizada",
                description: "Categoria atualizada com sucesso!",
              });
              setCategoriaEditando(null);
              setNovaCategoria("");
              setModalAberto(false);
            }}
            className="space-y-4"
          >
            <Input
              placeholder="Nome da categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
            />
            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalAberto(false);
                  setCategoriaEditando(null);
                  setNovaCategoria("");
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
