#!/usr/bin/env node
/**
 * create-rag-prices.js
 *
 * Creates Stripe Products + Prices for the Breslov RAG SaaS subscription plans.
 * Run once, then copy the Price IDs into Vercel environment variables.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_xxx node scripts/create-rag-prices.js
 *
 * Output: three STRIPE_RAG_*_PRICE_ID values to add to Vercel env vars.
 */

const Stripe = require("stripe");

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("ERROR: STRIPE_SECRET_KEY environment variable not set.");
  console.error("Usage: STRIPE_SECRET_KEY=sk_live_xxx node scripts/create-rag-prices.js");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2023-10-16" });

const PLANS = [
  {
    envVar: "STRIPE_RAG_YACHID_PRICE_ID",
    productName: "Breslov AI Chat — Yachid (Individual)",
    description: "Personal access to the Breslov RAG AI assistant. Unlimited queries, Likutey Moharan corpus, Hebrew/French/English.",
    amount: 900,       // $9/month in cents
    nickname: "yachid-monthly",
    metadata: { plan: "yachid", source: "breslov-rag" },
  },
  {
    envVar: "STRIPE_RAG_KEHILA_PRICE_ID",
    productName: "Breslov AI Chat — Kehila (Community)",
    description: "Community plan — up to 50 users. Ideal for synagogues, chevroth, and study groups.",
    amount: 4900,      // $49/month in cents
    nickname: "kehila-monthly",
    metadata: { plan: "kehila", source: "breslov-rag" },
  },
  {
    envVar: "STRIPE_RAG_MOSDOT_PRICE_ID",
    productName: "Breslov AI Chat — Mosdot (Institution)",
    description: "Institutional plan — unlimited users, API access, custom corpus extension, priority support.",
    amount: 14900,     // $149/month in cents
    nickname: "mosdot-monthly",
    metadata: { plan: "mosdot", source: "breslov-rag" },
  },
];

async function main() {
  console.log("Creating Breslov RAG Stripe products and prices...\n");

  const results = [];

  for (const plan of PLANS) {
    // 1. Create product
    const product = await stripe.products.create({
      name: plan.productName,
      description: plan.description,
      metadata: plan.metadata,
    });
    console.log(`✓ Product created: ${product.name} (${product.id})`);

    // 2. Create recurring price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: "usd",
      recurring: { interval: "month" },
      nickname: plan.nickname,
      metadata: plan.metadata,
    });
    console.log(`✓ Price created: $${plan.amount / 100}/month → ${price.id}\n`);

    results.push({ envVar: plan.envVar, priceId: price.id, amount: plan.amount });
  }

  console.log("=".repeat(60));
  console.log("ADD THESE TO VERCEL ENVIRONMENT VARIABLES:");
  console.log("=".repeat(60));
  for (const r of results) {
    console.log(`${r.envVar}=${r.priceId}`);
  }
  console.log("\nVercel CLI:");
  for (const r of results) {
    console.log(`vercel env add ${r.envVar} production`);
  }
  console.log("\nDone. Deploy after adding env vars:\n  vercel --prod");
}

main().catch((err) => {
  console.error("Stripe error:", err.message);
  process.exit(1);
});
