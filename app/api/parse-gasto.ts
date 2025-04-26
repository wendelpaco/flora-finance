import { parseMessage } from "../lib/openai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Texto é obrigatório" }), {
        status: 400,
      });
    }

    const parsed = await parseMessage(text);
    return Response.json(parsed);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Erro ao interpretar a mensagem" }),
      {
        status: 500,
      }
    );
  }
}
