/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from "./command.interface";
import { WASocket } from "@whiskeysockets/baileys";
import { Plan } from "@prisma/client";
import { logInfo, logError } from "../../utils/logger";

export class OnboardingCommand implements Command {
  async execute(
    sock: WASocket,
    phone: string,
    text: string,
    plano: Plan
  ): Promise<boolean> {
    try {
      logInfo(`👋 [Onboarding] Novo usuário iniciado: ${phone}`);

      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `🌿 *Seja bem-vindo(a) ao Flora Finance!*  

Aqui sua organização financeira fica fácil, prática e inteligente:

📌 O que você pode fazer:
- Registrar *gastos* e *ganhos* enviando texto ou áudio 🎤
- Excluir ou editar registros antigos sempre que precisar
- Solicitar *resumos* mensais ou semanais
- Acompanhar seu *saldo atualizado* de forma clara
- Consultar *planos Premium* e turbinar sua experiência
- Receber *dicas financeiras* exclusivas (usuários Pro)
- Aproveitar a potência da nossa *Flora IA Turbo* para análises inteligentes ✨

⚡ *Importante:*  
Usuários Free podem gerar 1 resumo gratuito por dia.  
Assinantes têm acesso a *resumos ilimitados* e com análise avançada pela Flora IA Turbo!

🛠️ *Comandos úteis:*
- */ajuda* → Como usar a Flora Finance
- */menu* → Explorar funcionalidades
- */planos* → Conhecer nossos planos
- */inscricao* → Assinar e desbloquear recursos avançados

💬 *Exemplos para começar agora:*  
➔ "Recebi 500 reais de salário" (texto ou áudio)  
➔ "Gastei 100 reais no mercado" 🛒 (texto ou áudio)

Conte com a Flora para conquistar seus objetivos financeiros! 🚀💚`,
      });

      return true;
    } catch (error) {
      logError(`❌ Erro no onboarding para ${phone}: ${error}`);
      return false;
    }
  }
}
