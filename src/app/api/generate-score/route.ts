import { syncLeadToNotion } from "@/lib/notion";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // seconds — gpt-4o needs room to breathe

export interface ScoreResult {
    score: number;
    grade: string;
    savings_min: number;
    savings_max: number;
    key_finding: string;
    department_scores: {
        marketing: number;
        sales: number;
        delivery: number;
        operations: number;
    };
    opportunities: Array<{
        title: string;
        description: string;
        hrs_saved_per_year: number;
    }>;
    checklist: Array<{
        priority: number;
        action: string;
        impact: "high" | "medium" | "low";
        effort: "high" | "medium" | "low";
        category: string;
    }>;
}

const SCORE_PROMPT = (name: string, answers: Record<string, string>, website?: string, chatTranscript?: string) => `
You are an expert AI transformation consultant. Analyze this business owner's survey responses and generate a detailed AI Readiness Report.

User: ${name}
${chatTranscript ? `\n--- CHAT TRANSCRIPT ---\n${chatTranscript}\n--- END TRANSCRIPT ---\n` : ""}

Business Information:
- Business Type: ${answers.business_type || answers.business_model || "Not specified"}
- Team Size: ${answers.team_size || "Not specified"}
- Annual Revenue: ${answers.revenue || "Not specified"}
- Biggest Bottleneck: ${answers.pain_point || answers.bottleneck || "Not specified"}

Big 4 Departments Analysis (Marketing, Sales, Delivery, Operations):
${Object.entries(answers)
        .filter(([k]) => k.startsWith("mkt_") || k.startsWith("sales_") || k.startsWith("del_") || k.startsWith("ops_"))
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")}
${website ? `\nWebsite: ${website}` : ""}

Generate a JSON response (ONLY JSON, no markdown) with this exact structure:
{
  "score": <integer 0-100, overall AI readiness score — higher means more AI automation opportunity>,
  "grade": <"A", "B+", "B", "C+", "C" — based on score>,
  "savings_min": <integer, minimum realistic annual savings in USD from AI automation>,
  "savings_max": <integer, maximum realistic annual savings in USD>,
  "key_finding": <1-2 sentence personalized insight about their biggest opportunity>,
  "department_scores": {
    "marketing": <integer 0-100, score for Marketing — higher means more untapped AI opportunity>,
    "sales": <integer 0-100, score for Sales — higher means more untapped AI opportunity>,
    "delivery": <integer 0-100, score for Delivery/Fulfillment — higher means more untapped AI opportunity>,
    "operations": <integer 0-100, score for Operations/Admin — higher means more untapped AI opportunity>
  },
  "opportunities": [
    {
      "title": <short title, e.g. "Automated Client Onboarding">,
      "description": <1 sentence specific to their business type and pain>,
      "hrs_saved_per_year": <realistic integer>
    }
  ],
  "checklist": [
    {
      "priority": <1-5, 1 is highest>,
      "action": <specific, actionable step — no fluff>,
      "impact": <"high"|"medium"|"low">,
      "effort": <"high"|"medium"|"low">,
      "category": <"Automation"|"AI Tool"|"Process"|"Integration">
    }
  ]
}

Rules:
- department_scores: base each on the mkt_/sales_/del_/ops_ answers; if no answers for a dept, infer from business type
- opportunities: exactly 3 items, specific to their business type
- checklist: exactly 5 items ordered by priority (quick wins first)
- savings estimates: realistic — based on team size and revenue bracket
- Be specific and actionable, not generic
- Do NOT wrap in markdown code blocks — return pure JSON only
`;

export async function POST(req: NextRequest) {
    const {
        name,
        email,
        website,
        answers,
        chatTranscript,
    }: { name: string; email: string; website?: string; answers: Record<string, string>; chatTranscript?: string } =
        await req.json();

    try {
        const raw = await callLLM(SCORE_PROMPT(name, answers, website, chatTranscript));

        let result: ScoreResult;
        try {
            result = JSON.parse(raw);
        } catch {
            const errMsg = `JSON parse failed. Raw LLM output (first 500 chars): ${raw?.slice(0, 500)}`;
            console.error("Failed to parse score JSON:", raw);
            sendFallbackEmail({ name, email, errorMessage: errMsg, answers }).catch(() => {});
            return NextResponse.json({ error: "Invalid JSON from LLM" }, { status: 500 });
        }

        // Build tokenized results URL (base64url-encoded, no DB needed)
        const token = Buffer.from(JSON.stringify(result)).toString("base64url");
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("http")
            ? process.env.NEXT_PUBLIC_BASE_URL
            : "https://audit.rehabit.ai";
        const resultsUrl = `${baseUrl}/scorecard-results?token=${token}`;

        // Fire-and-forget — don't block the response
        sendScoreEmail({ name, email, result, resultsUrl }).catch((e) =>
            console.error("Score email failed:", e)
        );
        import("@/lib/crm").then(({ syncLeadToGHL }) =>
            syncLeadToGHL({
                name,
                email,
                source: "AI Scorecard Generated",
                tags: ["AI Scorecard", `Grade-${result.grade}`, "Qualified Lead"],
                customFields: {
                    ai_readiness_score: result.score,
                    ai_readiness_grade: result.grade,
                    potential_savings: `${result.savings_min}-${result.savings_max}`,
                },
            }).catch((e) => console.error("GHL sync failed:", e))
        );
        const ds = result.department_scores;
        syncLeadToNotion({
            name,
            email,
            website,
            source: chatTranscript ? "Chat" : "Scorecard",
            grade: result.grade,
            score: result.score,
            savingsRange: `$${result.savings_min.toLocaleString()}–$${result.savings_max.toLocaleString()}`,
            keyFinding: result.key_finding,
            departmentScores: ds
                ? `Mkt:${ds.marketing} / Sales:${ds.sales} / Del:${ds.delivery} / Ops:${ds.operations}`
                : undefined,
            businessType: answers.business_type || answers.business_model,
            teamSize: answers.team_size,
            revenue: answers.revenue,
            painPoint: answers.pain_point || answers.bottleneck,
            chatTranscript,
        }).catch((e) => console.error("Notion sync failed:", e));

        return NextResponse.json({ success: true, score: result.score });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("generate-score error:", errorMessage);
        sendFallbackEmail({ name, email, errorMessage, answers }).catch(() => {});
        return NextResponse.json({ error: "Score generation failed" }, { status: 500 });
    }
}

/**
 * Tries OpenAI (gpt-4o) first, falls back to Gemini (gemini-2.5-pro) if
 * the key is missing or the request fails. Throws if both providers fail.
 */
async function callLLM(userPrompt: string): Promise<string> {
    const systemPrompt =
        "You are an expert AI transformation consultant. Always respond with pure JSON only — no markdown, no code fences.";

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20_000);
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                signal: controller.signal,
                headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "gpt-4o",
                    temperature: 0.4,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                }),
            });
            clearTimeout(timeout);
            if (res.ok) {
                const data = await res.json();
                return data.choices?.[0]?.message?.content ?? "{}";
            }
            console.warn("OpenAI failed (%d) — falling back to Gemini", res.status);
        } catch (e) {
            console.warn("OpenAI threw — falling back to Gemini:", e);
        }
    } else {
        console.warn("OPENAI_API_KEY not set — trying Gemini");
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        throw new Error("No LLM provider available (OPENAI_API_KEY and GEMINI_API_KEY both missing)");
    }

    // Gemini exposes an OpenAI-compatible endpoint — try 2.5-pro first, fall back to 2.0-flash
    const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    const geminiBody = (model: string) =>
        JSON.stringify({
            model,
            temperature: 0.4,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
        });

    for (const model of ["gemini-2.5-pro", "gemini-2.0-flash"]) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 18_000);
            const res = await fetch(geminiEndpoint, {
                method: "POST",
                signal: controller.signal,
                headers: { Authorization: `Bearer ${geminiKey}`, "Content-Type": "application/json" },
                body: geminiBody(model),
            });
            clearTimeout(timeout);
            if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) return content;
                console.warn(`Gemini ${model} returned empty content — trying next model`);
            } else {
                const errBody = await res.text().catch(() => "");
                console.warn(`Gemini ${model} failed (${res.status}): ${errBody.slice(0, 200)} — trying next model`);
            }
        } catch (e) {
            console.warn(`Gemini ${model} threw — trying next model:`, e);
        }
    }

    throw new Error("All LLM providers failed (OpenAI + Gemini 2.5-pro + Gemini 2.0-flash)");
}

async function sendFallbackEmail({
    name,
    email,
    errorMessage,
    answers,
}: {
    name: string;
    email: string;
    errorMessage: string;
    answers: Record<string, string>;
}) {
    const resendKey = process.env.RESEND_API_KEY_TOKEN;
    if (!resendKey) return;

    const { buildScorecardProcessingEmail, buildScoreFailureAlert } = await import("@/lib/emailTemplate");

    // 1. Send honest fallback to the lead
    await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            from: "Mike Olaski — rehabit.ai <score@rehabit.biz>",
            to: email,
            subject: "Your AI Readiness Scorecard — rehabit.ai",
            reply_to: "mike@rehabit.ai",
            html: buildScorecardProcessingEmail({ name }),
        }),
    });

    // 2. Alert Mike so he can follow up manually
    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL ?? "mike@rehabit.ai";
    await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: "rehabit.ai Alerts <leads@rehabit.biz>",
                to: notifyEmail,
                subject: `ACTION NEEDED: Score failed for ${name} — ${email}`,
                reply_to: email,
                html: buildScoreFailureAlert({ name, email, errorMessage, answers }),
            }),
    });
}

async function sendScoreEmail({
    name,
    email,
    result,
    resultsUrl,
}: {
    name: string;
    email: string;
    result: ScoreResult;
    resultsUrl: string;
}) {
    const resendKey = process.env.RESEND_API_KEY_TOKEN;
    if (!resendKey) return;

    const { buildScoreEmail } = await import("@/lib/emailTemplate");
    const html = buildScoreEmail({ name, result, resultsUrl });

    await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "Mike Olaski — rehabit.ai <score@rehabit.biz>",
            to: email,
            subject: `Your AI Score: ${result.grade} (${result.score}/100) — $${Math.round(result.savings_min / 1000)}K–$${Math.round(result.savings_max / 1000)}K savings identified`,
            reply_to: "mike@rehabit.ai",
            html,
        }),
    });
}
