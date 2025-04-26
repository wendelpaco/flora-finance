import { WASocket } from "@whiskeysockets/baileys";
import { handleFinanceiro } from "../services/financeiro";
import { logInfo } from "../utils/logger";
import { Plan } from "@prisma/client";

interface FinanceiroFilterParams {
  sock: WASocket;
  phone: string;
  text: string;
  plano: Plan;
}

export async function financeiroFilter({
  sock,
  phone,
  text,
  plano,
}: FinanceiroFilterParams) {
  const textoLower = text.toLowerCase();
  const isMensagemFinanceira =
    textoLower.includes("gastei") ||
    textoLower.includes("ganhei") ||
    textoLower.includes("recebi") ||
    textoLower.includes("paguei") ||
    textoLower.includes("comprei") ||
    textoLower.includes("vendi");

  if (!isMensagemFinanceira) {
    logInfo(`🔍 Mensagem ignorada (não financeira): ${text}`);
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: `👋 Oi! Para registrar um gasto ou ganho, envie mensagens como:\n\n- "Gastei 50 reais no mercado"\n- "Recebi 200 reais de freelance"\n\nConte comigo para ajudar no seu controle financeiro! 📈✨`,
    });
    return;
  }

  await handleFinanceiro({ sock, phone, text, plano });
}
