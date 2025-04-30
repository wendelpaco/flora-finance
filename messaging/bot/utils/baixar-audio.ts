import { downloadContentFromMessage, proto } from "@whiskeysockets/baileys";
import fs from "fs";
import path from "path";

/**
 * Baixa o áudio recebido no WhatsApp e salva como arquivo temporário.
 * @param msg A mensagem recebida contendo audioMessage
 * @param phone O número de telefone do usuário
 * @returns O caminho absoluto do arquivo de áudio salvo
 */
export async function baixarAudioMensagem(
  message: proto.IWebMessageInfo,
  phone: string
): Promise<string> {
  if (!message.message?.audioMessage) {
    throw new Error("Nenhuma mensagem de áudio encontrada para baixar.");
  }

  const stream = await downloadContentFromMessage(
    message.message.audioMessage,
    "audio"
  );

  const tempDir = path.resolve(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const filePath = path.join(tempDir, `audio-${phone}.ogg`);
  const writableStream = fs.createWriteStream(filePath);

  for await (const chunk of stream) {
    writableStream.write(chunk);
  }
  writableStream.end();

  return filePath;
}
