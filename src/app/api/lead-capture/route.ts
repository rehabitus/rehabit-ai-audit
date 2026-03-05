import { NextRequest, NextResponse } from "next/server";
import { syncLeadToNotion } from "@/lib/notion";

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
        const resendKey = process.env.RESEND_API_KEY_TOKEN;
        const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;

        // Sync to GHL + Notion (fire-and-forget — don't block the response)
        const { syncLeadToGHL } = await import("@/lib/crm");
        syncLeadToGHL({
            name: body.name,
            email: body.email,
            phone: body.phone,
            source: "AI Scorecard Optin",
            tags: ["AI Scorecard", "Optin", body.mode === "survey" ? "Survey" : "Chat-Bot"],
            customFields: {
                ...body.answers,
                chat_transcript: body.chatTranscript || "None",
            },
        }).catch((e) => console.error("GHL sync failed:", e));

        syncLeadToNotion({
            name: body.name,
            email: body.email,
            source: body.mode === "chat" ? "Chat" : "Scorecard",
            businessType: body.answers.business_type || body.answers.business_model,
            teamSize: body.answers.team_size,
            revenue: body.answers.revenue,
            painPoint: body.answers.pain_point || body.answers.bottleneck,
            chatTranscript: body.chatTranscript,
        }).catch((e) => console.error("Notion sync failed:", e));

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

            // Note: score email is sent by /api/generate-score (buildScoreEmail)
            // Do NOT send a user-facing email here — wrong context for scorecard leads
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Lead capture error:", err);
        return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
    }
}
