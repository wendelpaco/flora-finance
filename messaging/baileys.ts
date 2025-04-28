import {
  makeWASocket,
  useMultiFileAuthState as createMultiFileAuthState,
} from "@whiskeysockets/baileys";

export async function createSocket() {
  const { state, saveCreds } = await createMultiFileAuthState("./sessions");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}
