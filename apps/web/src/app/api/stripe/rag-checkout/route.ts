import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// Breslov RAG SaaS subscription plans
// Price IDs must be created in Stripe Dashboard first
// Run: node scripts/create-rag-prices.js to create them
const RAG_PLANS: Record<string, { priceId: string; name: string; amount: number }> = {
  yachid: {
    priceId: process.env.STRIPE_RAG_YACHID_PRICE_ID || "",
    name: "Breslov AI Chat — Yachid (Individual)",
    amount: 900, // $9/month in cents
  },
  kehila: {
    priceId: process.env.STRIPE_RAG_KEHILA_PRICE_ID || "",
    name: "Breslov AI Chat — Kehila (Community)",
    amount: 4900, // $49/month in cents
  },
  mosdot: {
    priceId: process.env.STRIPE_RAG_MOSDOT_PRICE_ID || "",
    name: "Breslov AI Chat — Mosdot (Institution)",
    amount: 14900, // $149/month in cents
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, email } = body;

    if (!plan || !email) {
      return NextResponse.json(
        { error: "Missing required fields: plan, email" },
        { status: 400 }
      );
    }

    const planConfig = RAG_PLANS[plan as keyof typeof RAG_PLANS];
    if (!planConfig) {
      return NextResponse.json(
        { error: `Invalid plan. Choose: ${Object.keys(RAG_PLANS).join(", ")}` },
        { status: 400 }
      );
    }

    if (!planConfig.priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured. Run: node scripts/create-rag-prices.js" },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamnova.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          plan,
          source: "breslov-rag",
        },
      },
      metadata: {
        plan,
        source: "breslov-rag",
      },
      allow_promotion_codes: true,
      success_url: `${siteUrl}/rag/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${siteUrl}/rag#pricing`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Breslov RAG Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
