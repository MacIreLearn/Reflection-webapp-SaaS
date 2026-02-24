import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const subscriber = await prisma.subscriber.findUnique({ where: { email } });
  if (!subscriber) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (subscriber.stripeSubscriptionId) {
    try {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      await stripe.subscriptions.cancel(subscriber.stripeSubscriptionId);
    } catch {}
  }

  await prisma.subscriber.update({
    where: { email },
    data: { status: "UNSUBSCRIBED" },
  });

  return NextResponse.json({ success: true });
}
