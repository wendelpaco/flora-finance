import { WASocket } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";

export interface Command {
  execute(sock: WASocket, user: User, message?: string): Promise<boolean>;
}
