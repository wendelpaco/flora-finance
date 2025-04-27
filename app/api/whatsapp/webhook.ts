// import {
//   makeWASocket,
//   useMultiFileAuthState as createMultiFileAuthState,
// } from "@whiskeysockets/baileys";
// import { PrismaClient } from "@prisma/client";
// import { generateSummary, parseMessage } from "../../lib/openai";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   const { state, saveCreds } = await createMultiFileAuthState("./sessions");

//   const sock = makeWASocket({
//     auth: state,
//     printQRInTerminal: true,
//   });

//   sock.ev.on("creds.update", saveCreds);

//   sock.ev.on("messages.upsert", async ({ messages }) => {
//     const msg = messages[0];
//     if (!msg.message || !msg.key.remoteJid) return;

//     const phone = msg.key.remoteJid.split("@")[0];
//     const text = msg.message.conversation || "";

//     if (!text) return;

//     const user = await prisma.user.upsert({
//       where: { phone },
//       update: {},
//       create: { phone },
//     });

//     if (text.toLowerCase().startsWith("resumo")) {
//       const resumo = await generateSummary(user.id);
//       await sock.sendMessage(msg.key.remoteJid!, { text: resumo });
//       return;
//     }

//     const parsed = await parseMessage(text);
//     if (parsed) {
//       await prisma.transaction.create({
//         data: {
//           userId: user.id,
//           content: text,
//           amount: parsed.amount,
//           category: parsed.category,
//         },
//       });

//       await sock.sendMessage(msg.key.remoteJid!, {
//         text: `Gasto de R$${parsed.amount} em ${parsed.category} registrado! ✅`,
//       });
//     } else {
//       await sock.sendMessage(msg.key.remoteJid!, {
//         text: `Mensagem recebida! 📩`,
//       });
//     }
//   });

//   return Response.json({ status: "WhatsApp Bot Running" });
// }
