import { logInfo, logError } from "./logger";
import { WASocket } from "@whiskeysockets/baileys";

function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Envia uma mensagem de texto para um número de WhatsApp
 * @param sock Conexão ativa do WhatsApp
 * @param phone Número do destinatário (sem o domínio @s.whatsapp.net)
 * @param text Conteúdo da mensagem
 */
export async function sendWhatsappMessage(
  sock: WASocket,
  phone: string,
  text: string
) {
  try {
    const sanitizedPhone = sanitizePhone(phone);

    await sock.sendMessage(`${sanitizedPhone}@s.whatsapp.net`, {
      text,
    });
    logInfo(`📩 Mensagem enviada para ${sanitizedPhone}: ${text}`);
  } catch (error) {
    logError(`❌ Erro ao enviar mensagem para ${phone}: ${error}`);
  }
}
