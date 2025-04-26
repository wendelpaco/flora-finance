export function logInfo(message: string) {
  const agora = new Date().toISOString().replace("T", " ").split(".")[0];
  console.log(`[${agora}] ${message}`);
}

export function logError(message: string) {
  const agora = new Date().toISOString().replace("T", " ").split(".")[0];
  console.error(`[${agora}] ❌ ${message}`);
}
