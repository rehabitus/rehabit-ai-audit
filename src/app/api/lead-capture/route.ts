import { NextRequest, NextResponse } from "next/server";

export interface LeadPayload {
    name: string;
    email: string;
    phone?: string;
    answers: Record<string, string>;
    mode: "survey" | "chat";
    chatTranscript?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: LeadPayload = await req.json();

        // Send email notification via Resend (if configured)
        const resendKey = process.env.RESEND_API_KEY;
        const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;

        // Sync to GHL
        const { syncLeadToGHL } = await import("@/lib/crm");
        await syncLeadToGHL({
            name: body.name,
            email: body.email,
            phone: body.phone,
            source: "AI Scorecard Optin",
            tags: ["AI Scorecard", "Optin", body.mode === "survey" ? "Survey" : "Chat-Bot"],
            customFields: {
                ...body.answers,
                chat_transcript: body.chatTranscript || "None"
            }
        });

        if (resendKey && notifyEmail) {
            const emailBody = `
New lead captured from the AI Readiness Survey:

Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone || "Not provided"}
Mode: ${body.mode}

Answers:
${Object.entries(body.answers)
                    .map(([k, v]) => `  ${k}: ${v}`)
                    .join("\n")}

${body.chatTranscript ? `\nChat Transcript:\n${body.chatTranscript}` : ""}
`.trim();

            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "leads@rehabit.biz",
                    to: notifyEmail,
                    subject: `New Lead: ${body.name} (${body.email})`,
                    text: emailBody,
                }),
            });

            // ALSO: Send a "Thank You" email to the user
            const { buildApplicationReceivedEmail } = await import("@/lib/emailTemplate");
            const userHtml = buildApplicationReceivedEmail({ name: body.name });

            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Rehabit Team <hello@rehabit.biz>",
                    to: body.email,
                    subject: "Application Received - re-habit.ai",
                    reply_to: "support@rehabit.ai",
                    html: userHtml,
                }),
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Lead capture error:", err);
        return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
    }
}
