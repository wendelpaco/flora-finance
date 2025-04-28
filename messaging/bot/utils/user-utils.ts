import prisma from "../../../lib/prisma";
import { logInfo } from "../utils/logger";

/**
 * Garante que o usuário exista no banco de dados.
 * Se não existir, cria um novo.
 * Se já existir, atualiza o nome se estiver diferente.
 */
export async function ensureUserExists(phone: string, name: string) {
  let user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    user = await prisma.user.create({ data: { phone, name } });
    logInfo(`🌱 [NOVO USUÁRIO CADASTRADO] - TELEFONE: ${user.phone}`);
  } else if (user.name !== name) {
    user = await prisma.user.update({
      where: { phone },
      data: { name },
    });
    logInfo(
      `🔄 [ALTERAÇÃO NO NOME USUÁRIO] - TELEFONE: ${user.phone} | NOME: "${user.name}`
    );
  }

  return user;
}
