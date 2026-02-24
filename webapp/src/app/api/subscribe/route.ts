import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { email, plan } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
  }

  if (plan === "PREMIUM") {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const customer = await stripe.customers.create({ email });
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}?subscribed=premium`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?cancelled=true`,
      metadata: { email },
    });

    await prisma.subscriber.create({
      data: { email, plan: "PREMIUM", stripeCustomerId: customer.id },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  }

  await prisma.subscriber.create({ data: { email, plan: "FREE" } });
  return NextResponse.json({ success: true });
}
