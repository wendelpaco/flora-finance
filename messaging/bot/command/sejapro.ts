import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { User, Plan } from "@prisma/client";
import { logError, logInfo } from "../utils/logger";

export class SejaProCommand implements Command {
  async execute(sock: WASocket, user: User): Promise<boolean> {
    try {
      logInfo(`🏆 [Comando] /sejapro solicitado por ${user.phone}`);

      if (user.plan === Plan.PRO) {
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
          text: `✨ Você já é um assinante PRO! Aproveite todos os recursos exclusivos do Flora Finance. 🚀`,
        });
      } else {
        await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
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
      logError(`❌ Erro ao processar /sejapro para ${user.phone}: ${error}`);
      return false;
    }
  }
}
