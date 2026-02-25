import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, plan } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    if (plan === "PREMIUM") {
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
      }

      // require dynamically to avoid ESM/CJS import issues in some Next runtimes
      const Stripe = require("stripe");
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

      // determine price id: prefer env var but fall back to finding a monthly recurring price
      let priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
      if (!priceId) {
        const prices = await stripe.prices.list({ limit: 100 });
        const recurringPrice = prices.data.find(
          (p: any) => p.active && p.type === "recurring" && p.recurring?.interval === "month"
        );
        if (recurringPrice) priceId = recurringPrice.id;
      }

      if (!priceId) {
        return NextResponse.json({ error: "No subscription price found in Stripe" }, { status: 500 });
      }

      const customer = await stripe.customers.create({ email });
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}?subscribed=premium`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?cancelled=true`,
        metadata: { email },
      });

      await prisma.subscriber.create({
        data: { email, plan: "PREMIUM", stripeCustomerId: customer.id },
      });

      if (!session || !session.url) {
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
      }

      return NextResponse.json({ checkoutUrl: session.url });
    }

    await prisma.subscriber.create({ data: { email, plan: "FREE" } });
    return NextResponse.json({ success: true });
  } catch (err) {
    // ensure we always return JSON (avoids client-side json() parse errors)
    console.error("/api/subscribe error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
