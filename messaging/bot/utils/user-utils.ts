import prisma from "../../../lib/prisma";
import { logInfo } from "../utils/logger";

/**
 * Garante que o usuário exista no banco de dados.
 * Se não existir, cria um novo.
 */
export async function ensureUserExists(phone: string) {
  let user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    user = await prisma.user.create({ data: { phone } });
    logInfo(`🌱 Novo usuário criado: ${phone}`);
  }

  return user;
}
