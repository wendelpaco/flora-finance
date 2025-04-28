import fs from "fs";
import { openai } from "../services/openai";

export async function transcreverAudioWhisper(
  filePath: string
): Promise<string> {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
  });

  return response.text;
}
