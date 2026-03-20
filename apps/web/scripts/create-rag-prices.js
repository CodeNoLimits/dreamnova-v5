#!/usr/bin/env node
/**
 * Creates Stripe products and prices for Breslov RAG SaaS.
 * Run ONCE from the dreamnova-v5/apps/web directory:
 *   STRIPE_SECRET_KEY=sk_live_xxx node scripts/create-rag-prices.js
 *
 * Then add the printed price IDs to Vercel env vars:
 *   STRIPE_RAG_YACHID_PRICE_ID=price_xxx
 *   STRIPE_RAG_KEHILA_PRICE_ID=price_xxx
 *   STRIPE_RAG_MOSDOT_PRICE_ID=price_xxx
 */

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = [
  {
    key: 'YACHID',
    name: 'Breslov AI Chat — Yachid (Individual)',
    description: 'For individual Breslov students. 100 questions/month, FR/HE/EN, voice TTS.',
    amount: 900,     // $9/month
    envVar: 'STRIPE_RAG_YACHID_PRICE_ID',
  },
  {
    key: 'KEHILA',
    name: 'Breslov AI Chat — Kehila (Community)',
    description: 'For synagogues and yeshivot. Unlimited questions, up to 50 members, custom branding.',
    amount: 4900,    // $49/month
    envVar: 'STRIPE_RAG_KEHILA_PRICE_ID',
  },
  {
    key: 'MOSDOT',
    name: 'Breslov AI Chat — Mosdot (Institution)',
    description: 'For institutions and foundations. Unlimited members, white-label, API access.',
    amount: 14900,   // $149/month
    envVar: 'STRIPE_RAG_MOSDOT_PRICE_ID',
  },
];

async function main() {
  console.log('Creating Breslov RAG Stripe products and prices...\n');

  for (const plan of plans) {
    // Create product
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: { source: 'breslov-rag', plan: plan.key.toLowerCase() },
    });
    console.log(`✅ Product created: ${product.id} (${plan.name})`);

    // Create recurring price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { plan: plan.key.toLowerCase() },
    });
    console.log(`   Price ID: ${price.id}`);
    console.log(`   → Add to Vercel env: ${plan.envVar}=${price.id}\n`);
  }

  console.log('Done. Add the price IDs above to Vercel environment variables.');
  console.log('Then run: vercel env pull && vercel --prod');
}

main().catch(console.error);
