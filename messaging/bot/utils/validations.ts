export function isAudioDurationValid(seconds: number): boolean {
  return seconds >= 2 && seconds <= 30;
}

export function isMessageRecent(timestamp: number): boolean {
  const now = Date.now() / 1000;
  return !!timestamp && now - Number(timestamp) <= 30;
}
