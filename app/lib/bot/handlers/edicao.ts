import { WASocket } from "@whiskeysockets/baileys";
import { logInfo, logError } from "../utils/logger";
import { PrismaClient } from "@prisma/client";

/**
 * Função que trata a edição de uma transação financeira
 */

export async function handleEdicao(
  sock: WASocket,
  phone: string,
  user: { id: string },
  text: string
) {
  try {
    const prisma = new PrismaClient();
    const textoLower = text.toLowerCase();

    // Detectar se é gasto ou ganho
    const isGasto = textoLower.includes("gasto");
    const isGanho = textoLower.includes("ganho");

    if (!isGasto && !isGanho) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não entendi se você quer editar um gasto ou um ganho. Por favor, especifique! 📄",
      });
      return;
    }

    // Extrair o novo valor
    const valorRegex = /(\d{1,5}(?:[.,]\d{1,2})?)/;
    const valorEncontrado = textoLower.match(valorRegex);

    if (!valorEncontrado) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não encontrei o valor para atualizar. Pode tentar novamente informando o valor? 💵",
      });
      return;
    }

    const novoValor = parseFloat(valorEncontrado[0].replace(",", "."));

    // Extrair categoria (pegamos a palavra depois de 'gasto' ou 'ganho')
    const categoriaRegex = isGasto ? /gasto (.*?) para/ : /ganho (.*?) para/;

    const categoriaEncontrada = textoLower.match(categoriaRegex);

    const categoria = categoriaEncontrada
      ? categoriaEncontrada[1].trim()
      : "outros";

    const sinonimosCategoria: { [key: string]: string } = {
      mercado: "alimentação",
      shop: "alimentação",
      compras: "alimentação",
      academia: "saúde",
      netflix: "assinaturas",
      streaming: "assinaturas",
      roupa: "vestuário",
      roupas: "vestuário",
      aluguel: "dívidas",
    };

    // Normalizar a categoria caso exista sinônimo
    const categoriaNormalizada =
      sinonimosCategoria[categoria.toLowerCase()] || categoria;

    if (!categoria) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não consegui identificar a categoria que você quer editar. Pode tentar novamente? 📚",
      });
      return;
    }

    // Buscar a transação mais recente para aquela categoria
    const transacao = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        type: isGasto ? "GASTO" : "GANHO",
        category: { contains: categoriaNormalizada, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!transacao) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `❌ Não encontrei um ${
          isGasto ? "gasto" : "ganho"
        } recente na categoria "${categoriaNormalizada}".`,
      });
      return;
    }

    // Atualizar o valor
    await prisma.transaction.update({
      where: { id: transacao.id },
      data: { amount: novoValor },
    });

    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: `✅ ${isGasto ? "Gasto" : "Ganho"} na categoria *${capitalize(
        categoriaNormalizada
      )}* atualizado para *R$${novoValor.toFixed(2)}*! 🎯`,
    });

    logInfo(
      `✏️ [Transação editada] Usuário: ${phone} | Categoria: ${categoriaNormalizada} | Novo Valor: ${novoValor}`
    );
  } catch (error) {
    logError(`❌ Erro ao editar transação: ${error}`);
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "❌ Ocorreu um erro ao tentar editar sua transação. Tente novamente mais tarde! 🛠️",
    });
  }
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
