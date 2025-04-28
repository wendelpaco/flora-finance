import { WASocket } from "@whiskeysockets/baileys";
import { User, Plan } from "@prisma/client";

export type MessageType = "audio" | "text";

export interface IncomingMessage {
  sock: WASocket;
  phone: string;
  user: User;
  text: string;
  type: MessageType;
}

export interface PrismaUser extends User {
  plan: Plan;
}
