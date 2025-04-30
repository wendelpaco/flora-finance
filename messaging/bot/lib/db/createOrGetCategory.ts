import prisma from "@/lib/prisma";

/**
 * Função para encontrar uma categoria existente ou criar uma nova.
 * @param userId ID do usuário dono da categoria
 * @param nome Nome da categoria
 * @param cor Cor da categoria (opcional)
 * @returns Categoria encontrada ou criada
 */
export async function createOrGetCategory(
  userId: string,
  name: string,
  color?: string
) {
  if (!userId || !name) {
    throw new Error("userId e nome são obrigatórios.");
  }

  // Tenta encontrar uma categoria existente
  const categoriaExistente = await prisma.category.findFirst({
    where: {
      userId,
      name,
    },
  });

  if (categoriaExistente) {
    return categoriaExistente;
  }

  // Se não encontrar, cria uma nova categoria
  const novaCategoria = await prisma.category.create({
    data: {
      userId,
      name,
      color: color || gerarCorAleatoriaHex(), //"#10B981", // Default para verde caso não seja passado
    },
  });

  return novaCategoria;
}

function gerarCorAleatoriaHex() {
  const letras = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letras[Math.floor(Math.random() * 16)];
  }
  return color;
}
