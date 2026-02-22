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

        // Log to server console (always available)
        console.log("=== NEW LEAD CAPTURED ===");
        console.log(JSON.stringify(body, null, 2));

        // Send email notification via Resend (if configured)
        const resendKey = process.env.RESEND_API_KEY;
        const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;

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
                    from: "leads@rehabit.ai",
                    to: notifyEmail,
                    subject: `New Lead: ${body.name} (${body.email})`,
                    text: emailBody,
                }),
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Lead capture error:", err);
        return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
    }
}
