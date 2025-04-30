import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";
import { logError, logInfo } from "../utils/logger";

export class CommandsCommand implements Command {
  async execute(sock: WASocket, user: User): Promise<boolean> {
    try {
      logInfo(`📚 [Comando] /comandos solicitado por ${user.phone}`);

      await sock.sendMessage(`${user.phone}@s.whatsapp.net`, {
        text: `📜 *Comandos Disponíveis*:

- /menu — Menu principal
- /ajuda — Como usar o Flora Finance
- /comandos — Lista de comandos
- /inscricao — Conheça nossos planos
- /sejapro — Benefícios do plano PRO
- /atendente — Falar com atendimento

- "Gastei..." — Registra um gasto
- "Recebi..." ou "Ganhei..." — Registra um ganho
- "Resumo mês" — Resumo financeiro
- "Excluir ..." — Remove um registro
`,
      });

      return true;
    } catch (error) {
      logError(`❌ Erro ao processar /comandos para ${user.phone}: ${error}`);
      return false;
    }
  }
}
