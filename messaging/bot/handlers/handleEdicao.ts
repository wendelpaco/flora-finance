import { WASocket } from "@whiskeysockets/baileys";
import { logInfo, logError } from "../utils/logger";
import prisma from "../../../lib/prisma";

export async function handleEdicao(
  sock: WASocket,
  phone: string,
  user: { id: string },
  text: string
) {
  try {
    const textoLower = text.toLowerCase();

    const isGasto = /gasto|despesa|compra|mercado|alimentação/.test(textoLower);
    const isGanho = /ganho|receita|salário|venda|pagamento|aposta/.test(
      textoLower
    );

    if (!isGasto && !isGanho) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não entendi se você quer editar um gasto ou um ganho. Por favor, diga 'editar ganho de 500 para 600'.",
      });
      return;
    }

    const valorAntigoRegex = /de(?:[^0-9]*)?(\d{1,6}(?:[.,]\d{1,2})?)/;
    const valorNovoRegex = /para(?:[^0-9]*)?(\d{1,6}(?:[.,]\d{1,2})?)/;

    const antigoMatch = textoLower.match(valorAntigoRegex);
    const novoMatch = textoLower.match(valorNovoRegex);

    if (!antigoMatch || !novoMatch) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não encontrei os valores 'de' e 'para' corretamente. Exemplo: 'editar ganho de 500 para 700'.",
      });
      return;
    }

    const valorAntigo = parseFloat(antigoMatch[1].replace(",", "."));
    const novoValor = parseFloat(novoMatch[1].replace(",", "."));

    if (isNaN(valorAntigo) || isNaN(novoValor)) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: "❌ Não entendi os valores que você quer alterar. Tente enviar como 'editar ganho de 500 para 700'.",
      });
      return;
    }

    // Buscar a transação mais recente que bate com o valor antigo
    const transacao = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        type: isGasto ? "GASTO" : "GANHO",
        amount: valorAntigo,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!transacao) {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `❌ Não encontrei um ${
          isGasto ? "gasto" : "ganho"
        } com o valor de R$${valorAntigo.toFixed(2)}.`,
      });
      return;
    }

    // Atualizar o valor
    await prisma.transaction.update({
      where: { id: transacao.id },
      data: { amount: novoValor },
    });

    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: `✅ ${
        isGasto ? "Gasto" : "Ganho"
      } atualizado de *R$${valorAntigo.toFixed(2)}* para *R$${novoValor.toFixed(
        2
      )}*! 🎯`,
    });

    logInfo(
      `✏️ [Transação editada] Usuário: ${phone} | De: R$${valorAntigo} -> Para: R$${novoValor}`
    );
  } catch (error) {
    logError(`❌ Erro ao editar transação: ${error}`);
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "❌ Ocorreu um erro ao tentar editar sua transação. Tente novamente mais tarde! 🛠️",
    });
  }
}

// function capitalize(text: string): string {
//   return text.charAt(0).toUpperCase() + text.slice(1);
// }
