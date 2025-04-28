export function logInfo(message: string) {
  const agora = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Sao_Paulo", // Fuso horário do Rio de Janeiro
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "shortOffset", // "shortOffset" para mostrar o GMT com o offset
  };

  // Formatação da data para o formato desejado
  const formattedTime = new Intl.DateTimeFormat("pt-BR", options).format(agora);
  console.log(`[${formattedTime}] ${message}`);
}

export function logError(message: string) {
  const agora = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Sao_Paulo", // Fuso horário do Rio de Janeiro
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "shortOffset", // "shortOffset" para mostrar o GMT com o offset
  };

  // Formatação da data para o formato desejado
  const formattedTime = new Intl.DateTimeFormat("pt-BR", options).format(agora);
  console.error(`[${formattedTime}] ❌ ${message}`);
}
