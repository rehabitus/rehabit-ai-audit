import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getCurrentPricing } from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const { origin } = await req.json().catch(() => ({}));
    const baseUrl = origin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const stripe = getStripe();
    const { priceCents, priceUsd, label } = getCurrentPricing();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: { product: "ai_transformation_audit" },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AI Transformation Audit — ${label} ($${priceUsd})`,
              description:
                "Includes: full workflow audit, AI opportunity matrix, tool-matched recommendations, ROI projections, professional audit report, 3-tier implementation roadmap, and a 30-minute delivery call. Guaranteed to reveal $20,000+ in annual savings — or full refund.",
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
