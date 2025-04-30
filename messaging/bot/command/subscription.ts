import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";
import { logError, logInfo } from "../utils/logger";

export class SubscriptionCommand implements Command {
  async execute(sock: WASocket, user: User): Promise<boolean> {
    try {
      logInfo(`📝 [COMANDO] /inscricao solicitado por ${user.phone}`);

      await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
        text: `🛒 *Planos Flora Finance:*

1️⃣ *Plano Mensal* — R$9,90/mês
- Acesso ilimitado
- Registro por texto e áudio
- Resumos e alertas inteligentes

2️⃣ *Plano Anual* — R$99,90/ano (economize 20%)
- Todos os benefícios do mensal
- Relatórios avançados em PDF (em breve!)

Para prosseguir, responda:
🌐 Acesse: https://flora-finance.com.br/inscricao
Lá você poderá optar pelo plano Free, Basic ou Pro de acordo com suas necessidades!

🌟 Obrigado por confiar na Flora Finance!`,
      });

      return true;
    } catch (error) {
      logError(`❌ Erro ao processar /inscricao para ${user.phone}: ${error}`);
      return false;
    }
  }
}
