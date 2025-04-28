/* eslint-disable @typescript-eslint/no-unused-vars */

import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { Plan } from "@prisma/client";
import { logInfo, logError } from "../../utils/logger";

export class SubscriptionCommand implements Command {
  async execute(
    sock: WASocket,
    phone: string,
    text: string,
    plano: Plan
  ): Promise<boolean> {
    try {
      logInfo(`📝 [Comando] /inscricao solicitado por ${phone}`);

      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
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
      logError(`❌ Erro ao processar /inscricao para ${phone}: ${error}`);
      return false;
    }
  }
}
