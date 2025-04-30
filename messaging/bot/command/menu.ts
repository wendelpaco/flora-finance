/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { Plan, User } from "@prisma/client";
import { logError, logInfo } from "../utils/logger";

export class MenuCommand implements Command {
  async execute(sock: WASocket, user: User): Promise<boolean> {
    try {
      logInfo(`📚 [Comando] /menu solicitado por ${user.phone}`);

      await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
        text: `🌟 *Menu Flora Finance*:

Comandos disponíveis:
- /ajuda — Veja como usar a Flora Finance
- /comandos — Lista completa de comandos
- /incricao — Conheça nossos planos
- /sejapro — Vantagens do plano PRO

Funcionalidades principais:
- Registrar gastos e ganhos por texto ou áudio 🎤
- Consultar resumos mensais 📈
- Gerenciar seus lançamentos financeiros 📋

Conte comigo para organizar suas finanças! 💬`,
      });

      return true;
    } catch (error) {
      logError(`❌ Erro ao processar /menu para ${user.phone}: ${error}`);
      return false;
    }
  }
}
