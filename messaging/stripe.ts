import Stripe from "stripe";
import { logError, logInfo } from "./bot/utils/logger";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-03-31.basil",
});

export async function createCheckoutSession(params: {
  successUrl: string;
  cancelUrl: string;
  priceId: string;
  customerEmail?: string;
}) {
  try {
    logInfo("🛒 Criando sessão de checkout no Stripe...");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
    });

    logInfo(`✅ Sessão de checkout criada: ${session.id}`);
    return session;
  } catch (error) {
    logError(`❌ Erro ao criar sessão de checkout: ${error}`);
    throw error;
  }
}

export async function retrieveCheckoutSession(sessionId: string) {
  try {
    logInfo(`🔍 Buscando sessão de checkout: ${sessionId}`);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    logError(`❌ Erro ao buscar sessão de checkout: ${error}`);
    throw error;
  }
}
