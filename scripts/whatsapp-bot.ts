// function timestamp() {
//   return new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
// }
// import {
//   makeWASocket,
//   useMultiFileAuthState as createMultiFileAuthState,
//   WASocket,
//   proto,
// } from "@whiskeysockets/baileys";
// import { pino } from "pino";
// import { PrismaClient } from "@prisma/client";
// import { generateSummary, parseMessage } from "../app/lib/openai";
// import { startDailySummary, startWeeklySummary } from "./scheduler";

// const prisma = new PrismaClient();
// const ALLOWED_PHONES = ["5521968577262", "5521994966227", "5521964090866"];

// async function handleResumo(
//   sock: WASocket,
//   phone: string,
//   user: { id: string },
//   text: string
// ) {
//   const meses = [
//     "janeiro",
//     "fevereiro",
//     "março",
//     "abril",
//     "maio",
//     "junho",
//     "julho",
//     "agosto",
//     "setembro",
//     "outubro",
//     "novembro",
//     "dezembro",
//   ];

//   const textoMinusculo = text.toLowerCase();
//   const mesEncontrado = meses.find((mes) => textoMinusculo.includes(mes));

//   if (mesEncontrado || textoMinusculo.trim() === "resumo") {
//     const resumo = await generateSummary(user.id, mesEncontrado);
//     await sock.sendMessage(`${phone}@s.whatsapp.net`, { text: resumo });
//     console.log(
//       `[${timestamp()}] 📈 [Resumo enviado] Mês: ${
//         mesEncontrado || "Todos"
//       } | Usuário: ${phone}`
//     );
//   } else {
//     await sock.sendMessage(`${phone}@s.whatsapp.net`, {
//       text: `❌ Não entendi o mês solicitado. Por favor, envie "Resumo abril", "Resumo maio", etc.`,
//     });
//   }
// }

// async function handleRegistroFinanceiro(
//   sock: WASocket,
//   phone: string,
//   user: { id: string },
//   text: string
// ) {
//   const parsed = await parseMessage(text);

//   if (parsed && typeof parsed.valor === "number" && parsed.valor > 0) {
//     const textoMinusculo = text.toLowerCase();
//     const tipo =
//       textoMinusculo.includes("recebi") ||
//       textoMinusculo.includes("ganhei") ||
//       textoMinusculo.includes("ganho")
//         ? "GANHO"
//         : "GASTO";

//     await prisma.message.create({
//       data: {
//         userId: user.id,
//         content: text,
//         amount: parsed.valor,
//         category: parsed.categoria,
//         type: tipo,
//       },
//     });

//     if (tipo === "GANHO") {
//       console.log(
//         `[${timestamp()}] ➕ [Ganho registrado] Valor: R$${
//           parsed.valor
//         } | Categoria: ${parsed.categoria} | Usuário: ${phone}`
//       );
//       await sock.sendMessage(`${phone}@s.whatsapp.net`, {
//         text: `✅ Ganho de R$${parsed.valor} em ${parsed.categoria} registrado com sucesso!`,
//       });
//     } else {
//       console.log(
//         `[${timestamp()}] ✅ [Gasto registrado] Valor: R$${
//           parsed.valor
//         } | Categoria: ${parsed.categoria} | Usuário: ${phone}`
//       );
//       await sock.sendMessage(`${phone}@s.whatsapp.net`, {
//         text: `✅ Gasto de R$${parsed.valor} em ${parsed.categoria} registrado com sucesso!`,
//       });
//     }
//   } else {
//     await sock.sendMessage(`${phone}@s.whatsapp.net`, {
//       text: `Mensagem recebida! 📩`,
//     });
//   }
// }

// async function handleMessage(sock: WASocket, msg: proto.IWebMessageInfo) {
//   if (!msg.message || !msg.key.remoteJid) return;

//   const phone = msg.key.remoteJid.split("@")[0];
//   if (!ALLOWED_PHONES.includes(phone)) {
//     // await sock.sendMessage(msg.key.remoteJid!, {
//     //   text: `❌ Acesso não autorizado.`,
//     // });
//     return;
//   }

//   const text = msg.message.conversation || "";
//   if (!text) return;

//   console.log(
//     `[${timestamp()}] 💬 [Mensagem recebida] De: ${phone} | Conteúdo: "${text}"`
//   );

//   const user = await prisma.user.upsert({
//     where: { phone },
//     update: {},
//     create: { phone },
//   });

//   // Onboarding automático para novo usuário
//   const agora = new Date();
//   const diferencaSegundos =
//     (agora.getTime() - new Date(user.createdAt).getTime()) / 1000;
//   if (diferencaSegundos < 10) {
//     console.log(
//       `[${timestamp()}] 🌱 [Onboarding] Novo usuário criado: ${phone}`
//     );
//     await sock.sendMessage(msg.key.remoteJid!, {
//       text: `🌱 Bem-vindo(a) ao Flora Finance!\n\nComigo você pode:\n\n💸 Registrar seus gastos: "Gastei 50 reais no mercado"\n📈 Pedir um resumo: "Resumo abril" ou "Resumo"\n❌ Excluir um gasto: "Excluir alimentação 50"\n🔔 Ativar ou desativar resumos automáticos\n\nDigite */bot* para ver tudo o que você pode fazer! 🚀`,
//     });
//   }

//   // Comando /bot
//   if (text.toLowerCase().startsWith("/bot")) {
//     await sock.sendMessage(msg.key.remoteJid!, {
//       text: `🌟 *bot disponíveis:*\n
// • */bot* — Lista todos os comandos que você pode usar.
// • */ajuda* — Explica como usar o Flora Finance e tirar o máximo proveito.
// • */sejapro* — Descubra as vantagens de se tornar um usuário Pro.
// • *Resumo [mês]* — Veja um resumo dos seus gastos de um mês (ex: "Resumo abril").
// • *Gastei [valor] no [local]* — Registra rapidamente um novo gasto no sistema.
// • *Excluir [categoria] [valor]* — Apaga um gasto específico (ex: "Excluir alimentação 50").
// • *Ativar resumo* / *Desativar resumo* — Controle o envio automático dos seus resumos diários e semanais.

// Conte comigo para organizar suas finanças! 🌱🚀`,
//     });
//     return;
//   }

//   if (text.toLowerCase().startsWith("/ajuda")) {
//     await sock.sendMessage(msg.key.remoteJid!, {
//       text: `🛟 *Central de Ajuda Flora Finance*\n\nComigo, você pode registrar seus gastos de forma simples apenas enviando mensagens naturais, como:\n
// - "Gastei 50 reais no mercado"\n
// - "Comprei gasolina 100 reais"\n
// Posso também gerar resumos dos seus gastos e te dar dicas de economia!\n\nEnvie */comandos* para ver todas as opções. 🌱`,
//     });
//     return;
//   }

//   if (text.toLowerCase().startsWith("/sejapro")) {
//     await sock.sendMessage(msg.key.remoteJid!, {
//       text: `🚀 *Vantagens de ser um usuário Pro no Flora Finance:*\n\n• Receba resumos diários e semanais automáticos!\n• Tenha acompanhamento mais detalhado dos seus gastos.\n• Suporte prioritário.\n• Novidades e recursos exclusivos primeiro!\n\nEm breve, enviaremos informações sobre como se tornar Pro! 🌟`,
//     });
//     return;
//   }

//   if (text.toLowerCase().includes("ativar resumo")) {
//     await prisma.user.update({
//       where: { phone },
//       data: { enableSummary: true },
//     });

//     await sock.sendMessage(msg.key.remoteJid!, {
//       text: `✅ Resumo automático ativado! Você começará a receber resumos diários e semanais.`,
//     });
//     return;
//   }

//   if (text.toLowerCase().includes("desativar resumo")) {
//     await prisma.user.update({
//       where: { phone },
//       data: { enableSummary: false },
//     });

//     await sock.sendMessage(msg.key.remoteJid!, {
//       text: `✅ Resumo automático desativado! Você não receberá mais resumos automáticos.`,
//     });
//     return;
//   }

//   if (
//     text.toLowerCase().includes("excluir") ||
//     text.toLowerCase().includes("deletar") ||
//     text.toLowerCase().includes("apagar")
//   ) {
//     const parsed = await parseMessage(text);

//     if (!parsed || typeof parsed.valor !== "number" || !parsed.categoria) {
//       await sock.sendMessage(msg.key.remoteJid!, {
//         text: `❌ Não consegui entender qual gasto você quer excluir. Tente algo como "Excluir alimentação 50".`,
//       });
//       return;
//     }

//     const registro = await prisma.message.findFirst({
//       where: {
//         userId: user.id,
//         amount: parsed.valor,
//         category: parsed.categoria,
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     if (!registro) {
//       await sock.sendMessage(msg.key.remoteJid!, {
//         text: `❌ Não encontrei um registro de R$${parsed.valor} em "${parsed.categoria}".`,
//       });
//       return;
//     }

//     await prisma.message.delete({
//       where: { id: registro.id },
//     });

//     const tipoEmoji = registro.type === "GANHO" ? "➕" : "➖";
//     const tipoTexto = registro.type === "GANHO" ? "Ganho" : "Gasto";

//     console.log(
//       `[${timestamp()}] 🗑️ [${tipoTexto} excluído] Valor: R$${
//         parsed.valor
//       } | Categoria: ${parsed.categoria} | Usuário: ${phone}`
//     );

//     await sock.sendMessage(msg.key.remoteJid!, {
//       text: `✅ ${tipoTexto} excluído com sucesso!\n${tipoEmoji} Valor: R$${parsed.valor}\n📂 Categoria: ${parsed.categoria}`,
//     });
//     return;
//   }

//   if (text.toLowerCase().includes("resumo")) {
//     await handleResumo(sock, phone, user, text);
//   } else {
//     await handleRegistroFinanceiro(sock, phone, user, text);
//   }
// }

// async function startBot() {
//   const { state, saveCreds } = await createMultiFileAuthState("./sessions");
//   const sock = makeWASocket({
//     auth: state,
//     printQRInTerminal: true,
//     browser: ["WhatsApp", "Windows", "10.0"],
//     logger: pino({ level: "silent" }),
//   });

//   sock.ev.on("creds.update", saveCreds);
//   startDailySummary(sock);
//   startWeeklySummary(sock);

//   sock.ev.on("connection.update", ({ connection }) => {
//     if (connection === "close") {
//       console.log(
//         `[${timestamp()}] 🔴 [Conexão] Bot desconectado. Tentando reconectar...`
//       );
//       startBot();
//     } else if (connection === "open") {
//       console.log(`[${timestamp()}] 🟢 [Conexão] Bot conectado com sucesso!`);
//     }
//   });

//   sock.ev.on("messages.upsert", async ({ messages, type }) => {
//     if (type !== "notify") return;

//     const msg = messages[0];
//     if (!msg.messageTimestamp) return;

//     const agora = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
//     const diferencaSegundos = agora - Number(msg.messageTimestamp);

//     if (diferencaSegundos > 600) {
//       // 10 minutos
//       console.log(
//         `[${timestamp()}] ⚠️ Ignorando mensagem antiga (${diferencaSegundos}s atrás) de ${
//           msg.key.remoteJid
//         }`
//       );
//       return;
//     }

//     await handleMessage(sock, msg);
//   });
// }

// startBot();
