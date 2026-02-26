import { NextRequest, NextResponse } from "next/server";

const QUALIFY_PROMPT = (answers: Record<string, string>) => `You are a qualification specialist for rehabit.ai, an AI transformation consultancy targeting coaches, course creators, and online platform operators.

Evaluate if this prospect is a good candidate for a 15-minute strategy call with Mike (the founder), which typically leads to a $1,200 AI Transformation Audit.

Prospect survey answers:
- Business type: ${answers.business_type ?? "Not specified"}
- Annual revenue: ${answers.revenue ?? "Not specified"}
- Biggest pain point: ${answers.pain_point ?? "Not specified"}
- Readiness to invest: ${answers.commitment ?? "Not specified"}

Qualification logic:

QUALIFIED (qualified: true) if:
- Business is a coach, consultant, course creator, online platform, or service agency
- Revenue is $50K+ annually (established business with real operations)
- Has a genuine operational pain point that AI automation can solve
- Shows any degree of readiness (even "evaluating" qualifies — only "no budget" alone disqualifies)

NOT QUALIFIED (qualified: false) if ALL of these are true:
- Revenue is under $50K (too early-stage — the ROI math won't work yet)
- Commitment is "Still exploring" or "No budget available right now"

Note: Be generous — err toward qualifying when in doubt. A coach at $50K+ revenue with any operational pain should almost always qualify.

Respond with ONLY valid JSON, no markdown, no code fences:
{"qualified": true, "reason": "one short friendly sentence"}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  // Fallback if no API key: always qualify (never block users)
  if (!apiKey) {
    return NextResponse.json({ qualified: true, reason: "Ready to connect." });
  }

  const { answers }: { answers: Record<string, string> } = await req.json();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        max_tokens: 80,
        messages: [
          {
            role: "system",
            content:
              "You are a qualification specialist. Always respond with pure JSON only — no markdown, no code fences.",
          },
          {
            role: "user",
            content: QUALIFY_PROMPT(answers),
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ qualified: true, reason: "Ready to connect." });
    }

    const data = await response.json();
    const raw =
      data.choices?.[0]?.message?.content ??
      '{"qualified":true,"reason":"Ready to connect."}';

    let result: { qualified: boolean; reason: string };
    try {
      result = JSON.parse(raw.trim());
    } catch {
      result = { qualified: true, reason: "Ready to connect." };
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ qualified: true, reason: "Ready to connect." });
  }
}
