import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicApiRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting: 30 requests per minute per IP
  const rateLimitResult = publicApiRateLimit(request);
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult.reset);
  }

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
