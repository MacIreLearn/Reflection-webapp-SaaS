"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  plan: z.enum(["FREE", "PREMIUM"]).default("FREE"),
});

export type SubscribeState = {
  success: boolean;
  error?: string;
  checkoutUrl?: string;
};

export async function subscribeAction(
  _prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const rawData = {
    email: formData.get("email"),
    plan: formData.get("plan") || "FREE",
  };

  const parsed = subscribeSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { email, plan } = parsed.data;

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Already subscribed" };
    }

    if (plan === "PREMIUM") {
      if (!process.env.STRIPE_SECRET_KEY) {
        return { success: false, error: "Payment not configured" };
      }

      const Stripe = require("stripe");
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

      let priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
      if (!priceId) {
        const prices = await stripe.prices.list({ limit: 100 });
        const recurringPrice = prices.data.find(
          (p: any) => p.active && p.type === "recurring" && p.recurring?.interval === "month"
        );
        if (recurringPrice) priceId = recurringPrice.id;
      }

      if (!priceId) {
        return { success: false, error: "No subscription price found" };
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

      return { success: true, checkoutUrl: session.url };
    }

    await prisma.subscriber.create({ data: { email, plan: "FREE" } });
    return { success: true };
  } catch (err) {
    console.error("subscribeAction error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Something went wrong" };
  }
}
