import { proto, WASocket } from "@whiskeysockets/baileys";
import { User } from "@prisma/client";
import { Command } from "./command.interface";
import { HelpCommand } from "./help";
import { SejaProCommand } from "./sejapro";
import { MenuCommand } from "./menu";
import { CommandsCommand } from "./commands";
import { SubscriptionCommand } from "./subscription";
import { OnboardingCommand } from "./onboarding";
import { SummaryDayCommand } from "./summary-day";

const commandsMap: { [key: string]: Command } = {
  "/ajuda": new HelpCommand(),
  "/sejapro": new SejaProCommand(),
  "/menu": new MenuCommand(),
  "/comandos": new CommandsCommand(),
  "/inscricao": new SubscriptionCommand(),
  "/onboarding": new OnboardingCommand(),
  "/resumodia": new SummaryDayCommand(),
};

export async function handleCommand(
  sock: WASocket,
  user: User,
  message: string
) {
  const comando = message.toLowerCase().split(" ")[0]; // pegar a primeira palavra
  const commandHandler = commandsMap[comando!];

  if (commandHandler) {
    return await commandHandler.execute(sock, user, message);
  }

  return false;
}
