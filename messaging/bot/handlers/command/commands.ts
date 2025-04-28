/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { Plan } from "@prisma/client";
import { logInfo, logError } from "../../utils/logger";

export class CommandsCommand implements Command {
  async execute(
    sock: WASocket,
    phone: string,
    text: string,
    plano: Plan
  ): Promise<boolean> {
    try {
      logInfo(`📚 [COMANDO] /comandos solicitado por ${phone}`);

      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `📜 *Comandos Disponíveis*:

- /menu — Menu principal
- /ajuda — Como usar o Flora Finance
- /comandos — Lista de comandos
- /planos — Conheça nossos planos
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
      logError(`❌ Erro ao processar /comandos para ${phone}: ${error}`);
      return false;
    }
  }
}
