import { NextRequest, NextResponse } from "next/server";
import { getStripe, formatAmountForStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tierName, price, quantity, email } = body;

    if (!tierName || !price || !quantity || !email) {
      return NextResponse.json(
        { error: "Missing required fields: tierName, price, quantity, email" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

    if (typeof quantity !== "number" || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: "Quantity must be between 1 and 99" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamnova.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Dream Nova — ${tierName}`,
              description: `Nova Key NFC Card — ${tierName} Edition. Sacred covenant with the Nova network.`,
              images: [`${siteUrl}/og-image.png`],
              metadata: {
                tier: tierName,
                sacred_number: "63",
              },
            },
            unit_amount: formatAmountForStripe(price),
          },
          quantity,
        },
      ],
      shipping_address_collection: {
        allowed_countries: [
          "US", "IL", "FR", "GB", "DE", "CA", "AU", "NL", "BE", "CH",
          "AT", "ES", "IT", "BR", "AR", "MX", "ZA", "IN", "JP", "KR",
        ],
      },
      metadata: {
        tier: tierName,
        source: "dreamnova-v5",
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
