import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { syncLeadToGHL } from "@/lib/crm";

export async function POST(req: NextRequest) {
    const stripe = getStripe();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    let event;
    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        const error = err as Error;
        console.error("Webhook signature verification failed:", error.message);
        return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as {
            id: string;
            customer_details?: { email?: string; name?: string };
            amount_total?: number
        };
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name || "Customer";
        const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

        if (!customerEmail) {
            console.error("No customer email in Stripe session");
            return NextResponse.json({ received: true });
        }

        try {
            // 1. Sync to GHL
            await syncLeadToGHL({
                name: customerName,
                email: customerEmail,
                source: "Stripe Purchase",
                tags: ["AI Audit Purchase", "Purchase", "Audit Customer"],
                customFields: {
                    order_id: session.id,
                    amount_paid: amountTotal
                }
            });

            // 2. Send confirmation email via Resend
            const resendKey = process.env.RESEND_API_KEY;
            if (resendKey && customerEmail) {
                const { buildBookingSuccessEmail } = await import("@/lib/emailTemplate");
                const html = buildBookingSuccessEmail({ name: customerName, amountPaid: amountTotal });

                await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${resendKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: "Rehabit AI Audit <hello@rehabit.ai>",
                        to: customerEmail,
                        bcc: "support@rehabit.ai", // Notify Support
                        reply_to: "support@rehabit.ai",
                        html,
                    }),
                });
            }
        } catch (err) {
            console.error("Post-purchase sync error:", err);
        }
    }

    return NextResponse.json({ received: true });
}
