import { WASocket } from "@whiskeysockets/baileys";
import { Plan, PrismaClient } from "@prisma/client"; // Importar Plan
import { logError, logInfo } from "../utils/logger";
import { financeiroFilter } from "../filters/financeiro-filter";
import { handleEdicao } from "./edicao";

const prisma = new PrismaClient();

export async function handleComando(
  sock: WASocket,
  phone: string,
  text: string
) {
  const comando = text.toLowerCase();

  // Buscar o plano do usuário no banco de dados
  const usuarioBanco = await prisma.user.findUnique({
    where: { phone },
    select: { id: true, plan: true },
  });
  const plano = usuarioBanco?.plan || Plan.FREE;

  if (comando.startsWith("/ajuda")) {
    logInfo(`📚 [Comando] /ajuda solicitado por ${phone}`);
    if (plano === Plan.PRO) {
      try {
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
      } catch (error) {
        logError(`Erro ao enviar mensagem de /ajuda para ${phone}: ${error}`);
      }
    } else {
      try {
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
      } catch (error) {
        logError(`Erro ao enviar mensagem de /ajuda para ${phone}: ${error}`);
      }
    }
    return true;
  }

  if (comando.startsWith("/sejapro")) {
    logInfo(`🚀 [Comando] /sejapro solicitado por ${phone}`);
    if (plano === Plan.PRO) {
      try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `✨ Você já é um assinante PRO! Aproveite todos os recursos exclusivos do Flora Finance. 🚀`,
        });
      } catch (error) {
        logError(`Erro ao enviar mensagem de /sejapro para ${phone}: ${error}`);
      }
    } else {
      try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `🚀 *Seja PRO!*
      
Vantagens exclusivas:
- Resumo diário automático
- Alertas inteligentes de gastos
- Metas de economia
- Relatórios PDF

Responda */inscricao* para escolher seu plano agora! 🌟`,
        });
      } catch (error) {
        logError(`Erro ao enviar mensagem de /sejapro para ${phone}: ${error}`);
      }
    }
    return true;
  }

  if (comando.startsWith("/comandos") || comando.startsWith("/bot")) {
    logInfo(`📜 [Comando] /comandos solicitado por ${phone}`);
    try {
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
    } catch (error) {
      logError(`Erro ao enviar mensagem de /comandos para ${phone}: ${error}`);
    }
    return true;
  }

  if (comando.startsWith("/planos")) {
    logInfo(`🌟 [Comando] /planos solicitado por ${phone}`);
    if (plano === Plan.PRO) {
      try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `✨ Você já é assinante PRO! Todos os recursos do Flora Finance estão disponíveis para você. Aproveite! 🚀`,
        });
      } catch (error) {
        logError(`Erro ao enviar mensagem de /planos para ${phone}: ${error}`);
      }
    } else {
      try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `🌟 *Planos Flora Finance*:

🔹 *Plano Free* (Grátis)
- Registro de gastos e ganhos manualmente
- Resumo sob demanda
- Acesso ao bot Flora Finance

🔹 *Plano Basic* (R$29,90/mês)
- Tudo do Free
- Resumos automáticos diários
- Insights de economia
- Suporte prioritário

🔹 *Plano Pro* (R$269,90/ano)
- Tudo do Basic
- Consultoria financeira personalizada
- Treinamento para multiplicar sua renda
- Acesso antecipado a novos recursos

🚀 *Escolha o plano ideal para você e decole rumo à sua liberdade financeira!* ✨
`,
        });
      } catch (error) {
        logError(`Erro ao enviar mensagem de /planos para ${phone}: ${error}`);
      }
    }
    return true;
  }

  if (
    comando.includes("quero migrar") ||
    comando.includes("quero assinar") ||
    comando.includes("quero ser pro")
  ) {
    logInfo(`🚀 [Comando] Migração para PRO solicitado por ${phone}`);
    try {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `🚀 Que ótimo saber que você quer evoluir suas finanças! 

Clique no link abaixo para escolher seu plano e liberar todos os recursos premium do Flora Finance:

🌐 https://flora-finance.com.br/inscricao

Se precisar de ajuda, responda aqui! 🤝`,
      });
    } catch (error) {
      logError(
        `Erro ao enviar mensagem de migração para PRO para ${phone}: ${error}`
      );
    }
    return true;
  }

  if (
    comando.includes("falar com atendente") ||
    comando.includes("quero falar com atendente") ||
    comando.includes("/atendente") ||
    comando.includes("preciso de ajuda")
  ) {
    logInfo(`👩‍💻 [Comando] Atendimento solicitado por ${phone}`);
    if (plano === Plan.PRO) {
      try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `👩‍💻 *Atendimento Prioritário — Flora Finance (Usuário PRO)*

🚀 Você possui atendimento prioritário!

Escolha o tipo de ajuda:
- Dúvidas sobre cadastro
- Informações sobre planos
- Problemas técnicos
- Sugestões e feedback

📅 *Horário de atendimento:* Segunda a Sexta, das 9h às 18h.

Para atendimento direto, clique:
🌐 [Clique aqui para atendimento rápido](https://wa.me/5521999999999)

Agradecemos por ser um usuário PRO! ✨`,
        });
      } catch (error) {
        logError(
          `Erro ao enviar mensagem de atendimento PRO para ${phone}: ${error}`
        );
      }
    } else {
      try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `👩‍💻 *Atendimento Flora Finance*:

Estamos prontos para te ajudar! 🤝

Escolha o tipo de ajuda:
- Dúvidas sobre cadastro
- Informações sobre planos
- Problemas técnicos
- Sugestões e feedback

📅 *Horário de atendimento:* Segunda a Sexta, das 9h às 18h.

Caso prefira falar diretamente com um atendente agora:
🌐 [Clique aqui para atendimento](https://wa.me/5521999999999)

(Se sua mensagem for enviada fora do horário, responderemos o mais breve possível.) ✨`,
        });
      } catch (error) {
        logError(
          `Erro ao enviar mensagem de atendimento para ${phone}: ${error}`
        );
      }
    }
    return true;
  }

  // Respostas inteligentes após o usuário pedir suporte
  if (comando.includes("dúvida sobre cadastro")) {
    logInfo(`🙋‍♂️ [Suporte] Dúvida sobre cadastro solicitado por ${phone}`);
    try {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `📝 Para dúvidas sobre cadastro:

- Certifique-se de preencher corretamente seu nome e número de telefone.
- Após o cadastro, você poderá escolher seu plano e começar a registrar seus gastos!

Se precisar de mais ajuda, é só responder aqui! 🤝`,
      });
    } catch (error) {
      logError(
        `Erro ao enviar mensagem de suporte 'dúvida sobre cadastro' para ${phone}: ${error}`
      );
    }
    return true;
  }

  if (comando.includes("informações sobre planos")) {
    logInfo(`💳 [Suporte] Informações sobre planos solicitado por ${phone}`);
    try {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `💳 Sobre nossos planos:

- Free: Controle manual de finanças.
- Basic: Resumos automáticos e suporte prioritário.
- Pro: Consultoria financeira e recursos exclusivos.

Responda */planos* para ver detalhes! 🚀`,
      });
    } catch (error) {
      logError(
        `Erro ao enviar mensagem de suporte 'informações sobre planos' para ${phone}: ${error}`
      );
    }
    return true;
  }

  if (comando.includes("problemas técnicos")) {
    logInfo(`🛠️ [Suporte] Problemas técnicos solicitado por ${phone}`);
    try {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `🛠️ Encontrou algum problema técnico?

Envie uma breve descrição do que aconteceu para nossa equipe técnica analisar e corrigir o mais rápido possível. 💬`,
      });
    } catch (error) {
      logError(
        `Erro ao enviar mensagem de suporte 'problemas técnicos' para ${phone}: ${error}`
      );
    }
    return true;
  }

  if (comando.includes("sugestões") || comando.includes("feedback")) {
    logInfo(`💡 [Suporte] Sugestões/feedback solicitado por ${phone}`);
    try {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `
        💡 Adoramos ouvir você!
           Envie sua sugestão ou feedback. Vamos usar suas ideias para melhorar ainda mais a experiência no Flora Finance! 🌟`,
      });
    } catch (error) {
      logError(
        `Erro ao enviar mensagem de suporte 'sugestões/feedback' para ${phone}: ${error}`
      );
    }
    return true;
  }

  if (comando.startsWith("/menu")) {
    logInfo(`📋 [Comando] /menu solicitado por ${phone}`);
    if (plano === Plan.PRO) {
      try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `📋 *Menu Principal — Flora Finance (Usuário PRO)*

✨ *Você tem acesso total!*

📊 *Minhas Finanças:*
- Registrar gastos ou ganhos: "Gastei 50 reais no mercado" / "Recebi 500 reais de salário"
- Ver meus resumos: "Resumo abril"

💎 *Benefícios Exclusivos PRO:*
- Relatórios personalizados
- Metas e alertas inteligentes
- Consultoria financeira especial

🤝 *Falar com Atendimento Prioritário:*
- /atendente — Suporte dedicado

🚀 *Obrigado por ser um usuário PRO! Flora Finance está aqui para impulsionar suas finanças!*`,
        });
      } catch (error) {
        logError(
          `Erro ao enviar mensagem de /menu PRO para ${phone}: ${error}`
        );
      }
    } else {
      try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
          text: `📋 *Menu Principal — Flora Finance*

O que você gostaria de fazer? 👇

✨ *Começar agora:*
- /ajuda — Aprenda como usar o bot
- /inscricao — Escolher meu plano

📊 *Minhas Finanças:*
- Registrar gastos ou ganhos: "Gastei 50 reais no mercado" / "Recebi 500 reais de salário"
- Ver meus resumos: "Resumo abril"

💎 *Melhorar minha conta:*
- /planos — Conhecer planos pagos
- /sejapro — Vantagens do plano PRO

🤝 *Falar com Atendimento:*
- /atendente — Suporte humano

🚀 *Use o Flora para transformar sua vida financeira!*`,
        });
      } catch (error) {
        logError(`Erro ao enviar mensagem de /menu para ${phone}: ${error}`);
      }
    }
    return true;
  }
  if (comando.startsWith("/inscricao")) {
    logInfo(`📝 [Comando] /inscricao solicitado por ${phone}`);
    try {
      await sock.sendMessage(`${phone}@s.whatsapp.net`, {
        text: `📝 *Cadastro Flora Finance*

Escolha seu plano e comece agora a organizar suas finanças de forma inteligente!

🌐 Acesse: https://flora-finance.com.br/inscricao

Lá você poderá optar pelo plano Free, Basic ou Pro de acordo com suas necessidades!

🚀 Vamos juntos transformar sua vida financeira!`,
      });
    } catch (error) {
      logError(`Erro ao enviar mensagem de /inscricao para ${phone}: ${error}`);
    }
    return true;
  }

  // Se não for comando, tenta tratar como gasto ou ganho
  if (
    text.toLowerCase().includes("gastei") ||
    text.toLowerCase().includes("recebi") ||
    text.toLowerCase().includes("ganhei")
  ) {
    await financeiroFilter({ sock, phone, text, plano });
    return true;
  }

  if (text.toLowerCase().startsWith("editar")) {
    await handleEdicao(sock, phone, usuarioBanco!, text);
    return true;
  }

  return false;
}
