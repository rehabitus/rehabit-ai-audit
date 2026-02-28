import { NextRequest, NextResponse } from "next/server";

export interface ScoreResult {
    score: number;
    grade: string;
    savings_min: number;
    savings_max: number;
    key_finding: string;
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
  "score": <integer 0-100, AI readiness score — higher means more opportunity>,
  "grade": <"A", "B+", "B", "C+", "C" — based on score>,
  "savings_min": <integer, minimum realistic annual savings in USD from AI automation>,
  "savings_max": <integer, maximum realistic annual savings in USD>,
  "key_finding": <1-2 sentence personalized insight about their biggest opportunity>,
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
- opportunities: exactly 3 items, specific to their business type
- checklist: exactly 5 items ordered by priority (quick wins first)
- savings estimates: realistic — based on team size and revenue bracket
- Be specific and actionable, not generic
- Do NOT wrap in markdown code blocks — return pure JSON only
`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
    }

    const {
        name,
        email,
        website,
        answers,
        chatTranscript,
    }: { name: string; email: string; website?: string; answers: Record<string, string>; chatTranscript?: string } =
        await req.json();

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o",
                temperature: 0.4,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert AI transformation consultant. Always respond with pure JSON only — no markdown, no code fences.",
                    },
                    {
                        role: "user",
                        content: SCORE_PROMPT(name, answers, website, chatTranscript),
                    },
                ],
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("OpenAI error:", err);
            return NextResponse.json({ error: "OpenAI request failed" }, { status: 500 });
        }

        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content ?? "{}";

        let result: ScoreResult;
        try {
            result = JSON.parse(raw);
        } catch {
            console.error("Failed to parse score JSON:", raw);
            return NextResponse.json({ error: "Invalid JSON from OpenAI" }, { status: 500 });
        }

        // Send the score email
        await sendScoreEmail({ name, email, result });

        // Sync lead to GHL (including score results)
        const { syncLeadToGHL } = await import("@/lib/crm");
        await syncLeadToGHL({
            name,
            email,
            source: "AI Scorecard Generated",
            tags: ["AI Scorecard", `Grade-${result.grade}`, "Qualified Lead"],
            customFields: {
                ai_readiness_score: result.score,
                ai_readiness_grade: result.grade,
                potential_savings: `${result.savings_min}-${result.savings_max}`
            }
        });

        return NextResponse.json({ success: true, score: result.score });
    } catch (err) {
        console.error("generate-score error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

async function sendScoreEmail({
    name,
    email,
    result,
}: {
    name: string;
    email: string;
    result: ScoreResult;
}) {
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return;

    const { buildScoreEmail } = await import("@/lib/emailTemplate");
    const html = buildScoreEmail({ name, result });

    await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "AI Score <score@rehabit.biz>",
            to: email,
            subject: `Your AI Readiness Score: ${result.grade} — ${result.score}/100`,
            reply_to: "support@rehabit.ai",
            html,
        }),
    });
}
