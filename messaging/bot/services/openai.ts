import OpenAI from "openai";
import dotenv from "dotenv";

/**
 * Instância configurada do OpenAI para ser usada em todo o sistema.
 */

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "OPENAI_API_KEY is missing. Please set it in your .env file."
  );
}

export const openai = new OpenAI({
  apiKey,
});
