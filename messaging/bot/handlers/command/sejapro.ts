import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { Plan } from "@prisma/client";
import { logInfo, logError } from "../../utils/logger";

export class SejaProCommand implements Command {
  async execute(
    sock: WASocket,
    phone: string,
    text: string,
    plano: Plan
  ): Promise<boolean> {
    try {
      logInfo(`🏆 [COMANDO] /sejapro solicitado por ${phone}`);

      if (plano === Plan.PRO) {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `✨ Você já é um assinante PRO! Aproveite todos os recursos exclusivos do Flora Finance. 🚀`,
        });
      } else {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `🚀 *Seja PRO!*

Vantagens exclusivas:
- Registrar gastos e ganhos por Áudio 🎤
- Resumo diário automático
- Alertas inteligentes de gastos
- Metas de economia
- Relatórios PDF

Responda */inscricao* para escolher seu plano agora! 🌟`,
        });
      }

      return true;
    } catch (error) {
      logError(`❌ Erro ao processar /sejapro para ${phone}: ${error}`);
      return false;
    }
  }
}
