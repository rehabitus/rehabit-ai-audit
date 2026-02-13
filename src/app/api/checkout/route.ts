import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "AI Transformation Audit — Complete Package",
              description:
                "Full business workflow audit, VALUE-scored opportunity matrix, tool-matched recommendations, ROI projections, professional audit report, 3-tier implementation proposal, Digital Twin activation, and 30-minute delivery call. Pay-in-full bonus: your first Core AI System delivered FREE in the same 5-day window.",
            },
            unit_amount: 120000, // $1,200.00 in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${baseUrl}?status=cancelled`,
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
