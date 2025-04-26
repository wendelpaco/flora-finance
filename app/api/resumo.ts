import { generateSummary } from "../lib/openai";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Usuário não informado" }), {
        status: 400,
      });
    }

    const summary = await generateSummary(userId);
    return Response.json({ summary });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erro ao gerar resumo" }), {
      status: 500,
    });
  }
}
