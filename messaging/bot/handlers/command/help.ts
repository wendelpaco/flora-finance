import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { Plan } from "@prisma/client";
import { logInfo, logError } from "../../utils/logger";

export class HelpCommand implements Command {
  async execute(
    sock: WASocket,
    phone: string,
    text: string,
    plano: Plan
  ): Promise<boolean> {
    try {
      logInfo(`📚 [COMANDO] /ajuda solicitado por ${phone}`);

      if (plano === Plan.PRO) {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `🤖 *Ajuda Flora Finance — Usuário PRO*:

Você tem acesso a todos os recursos! ✨

- Registrar gasto por texto ou áudio: "Gastei 50 reais no mercado" 🎤
- Registrar ganho por texto ou áudio: "Recebi 1000 reais de salário" 🎤
- Ver resumo mensal: "Resumo abril"
- Excluir registro: "Excluir mercado 50"
- Criar metas financeiras (em breve!)
- Consultar relatórios PDF (em breve!)

Para mais detalhes dos seus benefícios: /menu 🚀`,
        });
      } else {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `🤖 *Ajuda Flora Finance*:

Use comandos simples para gerenciar suas finanças:
- Registrar gasto: "Gastei 50 reais no mercado"
- Registrar ganho: "Recebi 1000 reais de salário"
- Ver resumo mensal: "Resumo abril"
- Excluir registro: "Excluir mercado 50"

📣 *Novidade para usuários PRO:* Agora também é possível registrar gastos e ganhos enviando áudios! 🎤

Para mais informações: /comandos`,
        });
      }
      return true;
    } catch (error) {
      logError(`❌ Erro no /ajuda para ${phone}: ${error}`);
      return false;
    }
  }
}
