import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { syncLeadToGHL } from "@/lib/crm";

export async function POST(req: NextRequest) {
    const stripe = getStripe();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const body = await req.text();

    let event;
    try {
        if (signature && webhookSecret) {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } else {
            // No secret configured yet — skip verification (set STRIPE_WEBHOOK_SECRET in prod)
            console.warn("Stripe webhook: no signing secret set, skipping signature verification");
            event = JSON.parse(body);
        }
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

            // 2. Send emails via Resend
            const resendKey = process.env.RESEND_API_KEY_TOKEN ?? process.env.RESEND_API_KEY;
            const notifyEmail = process.env.LEAD_NOTIFY_EMAIL ?? process.env.NOTIFICATION_EMAIL ?? "mike@rehabit.us";
            if (resendKey) {
                const { buildBookingSuccessEmail } = await import("@/lib/emailTemplate");
                const html = buildBookingSuccessEmail({ name: customerName, amountPaid: amountTotal });

                // Confirmation to buyer
                if (customerEmail) {
                    await fetch("https://api.resend.com/emails", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${resendKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            from: process.env.RESEND_FROM || "Rehabit AI Audit <hello@rehabit.biz>",
                            to: customerEmail,
                            reply_to: "mike@rehabit.us",
                            subject: "Your Audit is Reserved — Here's What Happens Next",
                            html,
                        }),
                    });
                }

                // Internal notification to Mike
                await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${resendKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: process.env.RESEND_FROM || "Rehabit AI Audit <hello@rehabit.biz>",
                        to: notifyEmail,
                        subject: `💰 New Audit Purchase — ${customerName} ($${amountTotal})`,
                        html: `<p><strong>New purchase!</strong></p>
                               <p><strong>Name:</strong> ${customerName}</p>
                               <p><strong>Email:</strong> ${customerEmail ?? "unknown"}</p>
                               <p><strong>Amount:</strong> $${amountTotal}</p>
                               <p><strong>Session:</strong> ${session.id}</p>`,
                    }),
                });
            }
        } catch (err) {
            console.error("Post-purchase sync error:", err);
        }
    }

    return NextResponse.json({ received: true });
}
