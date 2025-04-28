import { WASocket } from "@whiskeysockets/baileys";
import { Plan } from "@prisma/client";

export interface Command {
  execute(
    sock: WASocket,
    phone: string,
    text: string,
    plano: Plan
  ): Promise<boolean>;
}
