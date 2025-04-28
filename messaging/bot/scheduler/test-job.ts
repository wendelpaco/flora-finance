import cron from "node-cron";
import { WASocket } from "@whiskeysockets/baileys";
import { logInfo } from "../utils/logger";
import { startDailySummary } from "./scheduler";

// Função para rodar o cron job daqui a 5 minutos
export function startTestInFiveMinutes(sock: WASocket) {
  const currentDate = new Date();

  // Adiciona 5 minutos à data atual
  currentDate.setMinutes(currentDate.getMinutes() + 5);

  // Converte para uma expressão cron
  const cronTime = `${currentDate.getMinutes()} ${currentDate.getHours()} * * *`;

  // Agenda o cron job para rodar daqui a 5 minutos
  cron.schedule(cronTime, async () => {
    logInfo("⏰ [Testado] Enviando resumos em 5 minutos...");

    // Seu código para enviar resumos aqui
    // Exemplo: await startDailySummary(sock);
    await startDailySummary(sock);
  });
}
