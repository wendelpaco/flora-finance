import { WASocket } from "@whiskeysockets/baileys";

export async function sendOnboarding(sock: WASocket, phone: string) {
  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    text: `🌿 *Seja bem-vindo(a) ao Flora Finance!*  

        Aqui sua organização financeira fica fácil e prática:

        📌 O que você pode fazer:
        - Registrar *gastos* e *ganhos* em segundos
        - Excluir registros antigos sempre que precisar
        - Solicitar *resumos* mensais ou semanais
        - Acompanhar seu *saldo atualizado* de forma clara
        - Consultar *planos Premium* e turbinar sua experiência
        - Receber *dicas financeiras* exclusivas (usuários Pro)
        - Aproveitar a potência da nossa *Flora IA Turbo* para análises inteligentes ✨

        ⚡ *Importante:*  
        Usuários Free podem gerar 1 resumo gratuito por dia.  
        Assinantes têm acesso a *resumos ilimitados* e com análise avançada pela Flora IA Turbo!

        🛠️ *Comandos úteis:*
        - */ajuda* → Como usar o Flora
        - */menu* → Explorar funcionalidades
        - */planos* → Conhecer nossos planos
        - */inscricao* → Criar sua conta agora

        💬 *Comece agora!*  
        Envie algo como:
        ➔ "Recebi 500 reais de salário"  
        ➔ "Gastei 100 reais no mercado" 🛒

        Conte com a Flora para conquistar seus objetivos financeiros! 🚀💚`,
  });
}
