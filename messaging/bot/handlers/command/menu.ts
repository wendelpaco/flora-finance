/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { Plan } from "@prisma/client";
import { logInfo, logError } from "../../utils/logger";

export class MenuCommand implements Command {
  async execute(
    sock: WASocket,
    phone: string,
    text: string,
    plano: Plan
  ): Promise<boolean> {
    try {
      logInfo(`📚 [COMANDO] /menu solicitado por ${phone}`);

      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `🌟 *Menu Flora Finance*:

Comandos disponíveis:
- /ajuda — Veja como usar a Flora Finance
- /comandos — Lista completa de comandos
- /planos — Conheça nossos planos
- /sejapro — Vantagens do plano PRO

Funcionalidades principais:
- Registrar gastos e ganhos por texto ou áudio 🎤
- Consultar resumos mensais 📈
- Gerenciar seus lançamentos financeiros 📋

Conte comigo para organizar suas finanças! 💬`,
      });

      return true;
    } catch (error) {
      logError(`❌ Erro ao processar /menu para ${phone}: ${error}`);
      return false;
    }
  }
}
