import { WASocket } from "@whiskeysockets/baileys";
import { handleFinanceiro } from "../handlers/handleFinanceiro";
import { logInfo } from "../utils/logger";
import { User } from "@prisma/client";

interface FinanceiroFilterParams {
  sock: WASocket;
  user: User;
  message: string;
}

export async function financeiroFilter({
  sock,
  user,
  message,
}: FinanceiroFilterParams) {
  const textoLower = message.toLowerCase();
  const keywords = [
    "gastei",
    "ganhei",
    "recebi",
    "paguei",
    "comprei",
    "vendi",
    "editar",
    "alterar",
    "modificar",
    "compra",
    "venda",
    "salário",
    "freelance",
    "boleto",
    "despesa",
    "recebimento",
    "investimento",
    "poupança",
    "perdi",
    "perda",
    "dívida",
    "comprometimento",
  ];

  const isMensagemFinanceira = keywords.some((keyword) =>
    textoLower?.includes(keyword)
  );
  if (!isMensagemFinanceira) {
    logInfo(`🔍 [MENSAGEM IGNORADA] - NÃO FINANCEIRA: ${message}`);
    await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
      text: `👋 Oi! Para registrar um gasto ou ganho, envie mensagens como:\n\n- "Gastei 50 reais no mercado"\n- "Recebi 200 reais de freelance"\n\nConte comigo para ajudar no seu controle financeiro! 📈✨`,
    });
    return;
  }

  await handleFinanceiro({ sock, user, message });
}
