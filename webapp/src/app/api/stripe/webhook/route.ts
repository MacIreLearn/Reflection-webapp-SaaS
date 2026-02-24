import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.metadata?.email;
      if (email) {
        await prisma.subscriber.update({
          where: { email },
          data: {
            stripeSubscriptionId: session.subscription,
            plan: "PREMIUM",
          },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await prisma.subscriber.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: "UNSUBSCRIBED", plan: "FREE" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
