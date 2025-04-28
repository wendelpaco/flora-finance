import { PrismaClient, Transaction } from "@prisma/client";
import { logError } from "./logger";

/**
 * Busca uma transação para exclusão com base no valor e na categoria.
 * @param userId ID do usuário no banco
 * @param valor Valor da transação
 * @param categoria Categoria da transação
 * @returns A primeira transação encontrada, ou null se não houver
 */
export async function findTransactionForDeletion(
  userId: string,
  valor: number,
  categoria: string
): Promise<Transaction | null> {
  try {
    const prisma = new PrismaClient();
    const transaction = await prisma.transaction.findFirst({
      where: {
        userId,
        amount: valor,
        category: {
          contains: categoria,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return transaction;
  } catch (error) {
    logError(`❌ Erro ao buscar transação para exclusão: ${error}`);
    return null;
  }
}
