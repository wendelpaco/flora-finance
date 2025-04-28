import { stripe } from "../../messaging/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${body.origin}/success`,
      cancel_url: `${body.origin}/cancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erro ao criar checkout" }), {
      status: 500,
    });
  }
}
