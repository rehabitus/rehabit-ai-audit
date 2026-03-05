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
            const labelMap: Record<string, { label: string; category: string }> = {
                business_model:    { label: "Business Model",          category: "Basic" },
                revenue:           { label: "Annual Revenue",           category: "Basic" },
                team_size:         { label: "Team Size",                category: "Basic" },
                bottleneck:        { label: "Biggest Bottleneck",       category: "Basic" },
                mkt_nurture:       { label: "Lead Nurture System",      category: "Marketing" },
                mkt_hours:         { label: "Content Hours / Week",     category: "Marketing" },
                mkt_ai:            { label: "AI in Marketing",          category: "Marketing" },
                sales_followup:    { label: "Lead Follow-up Speed",     category: "Sales" },
                sales_transcripts: { label: "Transcript Analysis",      category: "Sales" },
                sales_crm:         { label: "CRM Automation",           category: "Sales" },
                del_onboarding:    { label: "Client Onboarding",        category: "Delivery" },
                del_twin:          { label: "Digital Twin / AI Support", category: "Delivery" },
                del_admin_hrs:     { label: "Admin Hours / Week",       category: "Delivery" },
                ops_churn:         { label: "Churn Detection",          category: "Operations" },
                ops_reporting:     { label: "Reporting Automation",     category: "Operations" },
                ops_growth_ratio:  { label: "Fires vs. Growth",         category: "Operations" },
            };

            const categoryMeta: Record<string, { color: string; bg: string; emoji: string }> = {
                Basic:      { color: "#94A3B8", bg: "#1E293B", emoji: "👤" },
                Marketing:  { color: "#10B981", bg: "#052E1C", emoji: "📣" },
                Sales:      { color: "#3B82F6", bg: "#0C1A3B", emoji: "💰" },
                Delivery:   { color: "#F97316", bg: "#2A1400", emoji: "🚀" },
                Operations: { color: "#F59E0B", bg: "#2A1E00", emoji: "⚙️" },
            };

            const grouped: Record<string, Array<{ label: string; value: string }>> = {
                Basic: [], Marketing: [], Sales: [], Delivery: [], Operations: [],
            };

            for (const [k, v] of Object.entries(body.answers)) {
                const meta = labelMap[k];
                const cat = meta?.category ?? "Basic";
                (grouped[cat] ?? grouped.Basic).push({ label: meta?.label ?? k, value: v });
            }

            const renderSection = (cat: string) => {
                const rows = grouped[cat];
                if (!rows || rows.length === 0) return "";
                const { color, bg, emoji } = categoryMeta[cat];
                const rowsHtml = rows.map(({ label, value }) => `
                    <tr>
                        <td style="padding:10px 16px;border-bottom:1px solid #1E293B;color:#94A3B8;font-size:13px;width:45%">${label}</td>
                        <td style="padding:10px 16px;border-bottom:1px solid #1E293B;color:#F1F5F9;font-size:13px;font-weight:600">${value}</td>
                    </tr>`).join("");
                return `
                <div style="margin-bottom:20px;border-radius:12px;overflow:hidden;border:1px solid ${color}40">
                    <div style="background:${bg};padding:10px 16px">
                        <span style="font-size:14px">${emoji}</span>
                        <span style="color:${color};font-size:11px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;margin-left:8px">${cat}</span>
                    </div>
                    <table style="width:100%;border-collapse:collapse;background:#0F172A">
                        ${rowsHtml}
                    </table>
                </div>`;
            };

            const modeBadge = body.mode === "chat"
                ? `<span style="background:#1E3A5F;color:#60A5FA;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.1em">CHAT AI</span>`
                : `<span style="background:#052E1C;color:#10B981;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.1em">SURVEY</span>`;

            const htmlEmail = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060D1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px">
    <div style="font-size:22px;font-weight:800;color:#10B981;letter-spacing:-0.5px;margin-bottom:4px">rehabit<span style="color:#fff">.ai</span></div>
    <div style="color:#475569;font-size:11px;letter-spacing:0.12em;text-transform:uppercase">AI Opportunity Scorecard — New Lead</div>
  </div>

  <!-- Lead Card -->
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="vertical-align:top">
          <div style="color:#F1F5F9;font-size:20px;font-weight:800;margin-bottom:4px">${body.name}</div>
          <div style="color:#10B981;font-size:14px">${body.email}</div>
          ${body.phone ? `<div style="color:#64748B;font-size:13px;margin-top:4px">${body.phone}</div>` : ""}
        </td>
        <td style="text-align:right;vertical-align:top">${modeBadge}</td>
      </tr>
    </table>
    <div style="margin-top:16px">
      <a href="mailto:${body.email}" style="display:inline-block;background:#10B981;color:#0F172A;font-weight:700;font-size:13px;padding:10px 20px;border-radius:8px;text-decoration:none">Reply to ${body.name} →</a>
    </div>
  </div>

  <!-- Sections -->
  ${["Basic", "Marketing", "Sales", "Delivery", "Operations"].map(renderSection).join("")}

  ${body.chatTranscript ? `
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:12px;overflow:hidden;margin-bottom:20px">
    <div style="background:#1E293B;padding:10px 16px">
      <span style="color:#94A3B8;font-size:11px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase">💬 Chat Transcript</span>
    </div>
    <div style="padding:16px;color:#94A3B8;font-size:13px;line-height:1.6;white-space:pre-wrap">${body.chatTranscript}</div>
  </div>` : ""}

  <!-- Footer -->
  <div style="text-align:center;color:#334155;font-size:11px;margin-top:24px">
    Sent by rehabit.ai · audit.rehabit.ai/scorecard
  </div>

</div>
</body>
</html>`;

            const plainText = [
                `New lead: ${body.name} (${body.email})`,
                `Mode: ${body.mode}`,
                "",
                ...Object.entries(body.answers).map(([k, v]) => `${labelMap[k]?.label ?? k}: ${v}`),
                ...(body.chatTranscript ? ["", "Chat Transcript:", body.chatTranscript] : []),
            ].join("\n");

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
                    html: htmlEmail,
                    text: plainText,
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
