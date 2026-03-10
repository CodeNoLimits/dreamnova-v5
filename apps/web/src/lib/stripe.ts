import Stripe from "stripe";

/**
 * Create a Stripe server-side client.
 * Only use in API routes / server functions.
 */
export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-01-28.clover" as Stripe.LatestApiVersion,
    typescript: true,
  });
}

/**
 * Format amount for Stripe (converts dollars to cents).
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Format amount from Stripe (converts cents to dollars).
 */
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}
