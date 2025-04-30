"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HiOutlineTag,
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
import { Category } from "@prisma/client";

export default function CategoriasPage() {
  const [novaCategoria, setNovaCategoria] = useState<Partial<Category>>({
    name: "",
    color: "#10B981",
  });
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaEditando, setCategoriaEditando] = useState<number | null>(
    null
  );
  const [modalAberto, setModalAberto] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await fetch(
          "/api/category?userId=cma1dyzyx0000y7g9shgkv93i"
        );
        const data = await response.json();
        setCategorias(data);
        console.log(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    fetchCategorias();
  }, []);

  function abrirModalNovaCategoria() {
    setNovaCategoria({ name: "", color: "#10B981" });
    setCategoriaEditando(null);
    setModalAberto(true);
  }

  function editarCategoria(categoria: Category, index: number) {
    setNovaCategoria(categoria);
    setCategoriaEditando(index);
    setModalAberto(true);
  }

  async function desfazerExclusaoCategoria(categoria: Category) {
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });
      if (!res.ok) {
        throw new Error("Erro ao desfazer remoção");
      }
      const novaLista = await res.json();

      setCategorias(novaLista);
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Não foi possível desfazer a remoção.",
        variant: "destructive",
      });
    }
  }

  async function excluirCategoria(index: number) {
    const confirmar = confirm("Tem certeza que deseja excluir esta categoria?");
    if (confirmar) {
      try {
        const categoriaRemovida = categorias[index];
        const response = await fetch(`/api/category/${index}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Erro ao remover categoria");
        }
        const atualizadas = categorias.filter((_, i) => i !== index);
        setCategorias(atualizadas);
        toast({
          title: "Categoria removida",
          description: "Você pode desfazer essa ação.",
          action: (
            <Button
              variant="outline"
              onClick={async () => {
                await desfazerExclusaoCategoria(categoriaRemovida);
              }}
            >
              Desfazer
            </Button>
          ),
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Erro",
          description: "Não foi possível remover a categoria.",
          variant: "destructive",
        });
      }
    }
  }

  async function handleSubmitCategoria(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (novaCategoria?.name?.trim() === "") return;

    if (categoriaEditando === null) {
      if (categorias.some((cat) => cat.name === novaCategoria?.name)) {
        toast({
          title: "Ops!",
          description: "Essa categoria já existe.",
          variant: "destructive",
        });
        return;
      }
      try {
        const response = await fetch("/api/categorias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novaCategoria),
        });
        if (!response.ok) {
          throw new Error("Erro ao adicionar categoria");
        }
        const data = await response.json();
        setCategorias(data);
        toast({
          title: "Sucesso",
          description: "Categoria adicionada com sucesso!",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a categoria.",
          variant: "destructive",
        });
      }
    } else {
      if (
        categorias.some(
          (cat, i) =>
            cat.name === novaCategoria?.name && i !== categoriaEditando
        )
      ) {
        toast({
          title: "Ops!",
          description: "Essa categoria já existe.",
          variant: "destructive",
        });
        return;
      }
      try {
        const response = await fetch(`/api/category`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novaCategoria),
        });
        if (!response.ok) {
          throw new Error("Erro ao atualizar categoria");
        }
        const data = await response.json();
        setCategorias(data);
        toast({
          title: "Atualizada",
          description: "Categoria atualizada com sucesso!",
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a categoria.",
          variant: "destructive",
        });
      }
    }
    setCategoriaEditando(null);
    setNovaCategoria({ name: "", color: "#10B981" });
    setModalAberto(false);
  }

  return (
    <div className="relative">
      <UserHeader className="absolute top-6 right-6 z-50" />
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <HiOutlineTag className="w-6 h-6 text-emerald-600" />
          Minhas Categorias
        </h1>
        <p className="text-muted-foreground text-sm">
          Organize e personalize suas categorias de gastos e receitas.
        </p>

        {categorias.length > 0 && (
          <Button
            className=" bg-emerald-600 hover:bg-emerald-700"
            onClick={abrirModalNovaCategoria}
          >
            <HiOutlinePlusCircle className="w-5 h-5" />
            Nova Categoria
          </Button>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias?.map((categoria, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 dark:border-gray-700"
              style={{ borderLeft: `6px solid ${categoria.color}` }}
            >
              <Card className="shadow-sm border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white">
                    <span
                      className="h-4 w-1 rounded-full"
                      style={{ backgroundColor: categoria.color }}
                    />
                    {categoria.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    ID: {categoria.id}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs px-3 hover:bg-emerald-100 dark:hover:bg-emerald-900 flex items-center gap-1"
                      onClick={() => editarCategoria(categoria, index)}
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs px-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 flex items-center gap-1"
                      onClick={() => excluirCategoria(index)}
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
      </div>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoriaEditando !== null
                ? "Editar Categoria"
                : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCategoria} className="space-y-4">
            <Input
              placeholder="Ex: Alimentação, Transporte, Investimentos"
              value={novaCategoria?.name}
              onChange={(e) =>
                setNovaCategoria((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {/* Seção de cores predefinidas */}
            <div className="flex gap-2 flex-wrap">
              {[
                "#10B981",
                "#3B82F6",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
                "#0EA5E9",
              ].map((cor) => (
                <button
                  key={cor}
                  type="button"
                  className="w-6 h-6 rounded-full border-2"
                  style={{
                    backgroundColor: cor,
                    borderColor:
                      novaCategoria?.color === cor ? "#000" : "transparent",
                  }}
                  onClick={() =>
                    setNovaCategoria((prev) => ({ ...prev, color: cor }))
                  }
                />
              ))}
            </div>
            {/* Texto para cor personalizada */}
            <span className="text-sm text-muted-foreground">
              Ou escolha uma cor personalizada
            </span>
            <Input
              type="color"
              value={novaCategoria?.color}
              onChange={(e) =>
                setNovaCategoria((prev) => ({ ...prev, color: e.target.value }))
              }
            />
            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalAberto(false);
                  setCategoriaEditando(null);
                  setNovaCategoria({ name: "", color: "#10B981" });
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {categoriaEditando !== null ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        className="fixed bottom-6 right-6 z-50 md:hidden bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 rounded-full p-4"
        onClick={abrirModalNovaCategoria}
        aria-label="Nova Categoria"
      >
        <HiOutlinePlusCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
