// import { PrismaClient } from "@prisma/client";
// import { buffer } from "micro";
// import { stripe } from "../lib/stripe";
// import type Stripe from "stripe";

// const prisma = new PrismaClient();

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: Request) {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const buf = await buffer(req as any);
//   const sig = req.headers.get("stripe-signature");

//   if (!sig) {
//     return new Response("Missing stripe-signature header", { status: 400 });
//   }

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       buf,
//       sig!,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch (err: unknown) {
//     console.error(err);
//     if (err instanceof Error) {
//       return new Response(`Webhook error: ${err.message}`, { status: 400 });
//     }
//     return new Response("Webhook error", { status: 400 });
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;
//     const customerEmail = session.customer_email;

//     if (customerEmail) {
//       await prisma.user.updateMany({
//         where: { email: customerEmail },
//         data: { plan: "PRO" },
//       });
//     }
//   }

//   return new Response(JSON.stringify({ received: true }), { status: 200 });
// }
