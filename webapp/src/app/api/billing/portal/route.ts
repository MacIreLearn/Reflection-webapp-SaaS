import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find subscriber record with Stripe customer ID
    const subscriber = await prisma.subscriber.findUnique({
      where: { email: user.email || "" },
    });

    if (!subscriber?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found. Subscribe to Premium first." },
        { status: 404 }
      );
    }

    const Stripe = require("stripe");
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    // Create Stripe Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscriber.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Billing portal error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create portal session" },
      { status: 500 }
    );
  }
}
