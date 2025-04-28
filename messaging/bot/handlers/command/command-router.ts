import { WASocket } from "@whiskeysockets/baileys";
import { Plan } from "@prisma/client";
import { Command } from "./command.interface";
import { HelpCommand } from "./help";
import { SejaProCommand } from "./sejapro";
import { MenuCommand } from "./menu";
import { CommandsCommand } from "./commands";
import { SubscriptionCommand } from "./subscription";
import { OnboardingCommand } from "./onboarding";

const commandsMap: { [key: string]: Command } = {
  "/ajuda": new HelpCommand(),
  "/sejapro": new SejaProCommand(),
  "/menu": new MenuCommand(),
  "/comandos": new CommandsCommand(),
  "/inscricao": new SubscriptionCommand(),
  "/onboarding": new OnboardingCommand(),
};

export async function handleCommand(
  sock: WASocket,
  phone: string,
  text: string,
  plano: Plan
) {
  const comando = text.toLowerCase().split(" ")[0]; // pegar a primeira palavra
  const commandHandler = commandsMap[comando];

  if (commandHandler) {
    return await commandHandler.execute(sock, phone, text, plano);
  }

  return false;
}
