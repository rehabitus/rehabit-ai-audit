import { NextRequest, NextResponse } from "next/server";

const QUALIFY_PROMPT = (answers: Record<string, string>) => `You are a qualification specialist for rehabit.ai, an AI transformation consultancy.

Evaluate if this prospect is a good candidate for a 15-minute strategy call with Mike. We help them reclaim hours and scale by automating manual ops.

Prospect survey answers:
- Business type: ${answers.business_type ?? "Not specified"}
- Annual revenue: ${answers.revenue ?? "Not specified"}
- Team size: ${answers.team_size ?? "Not specified"}
- Manual man-hours/week: ${answers.manual_hours ?? "Not specified"}
- Biggest pain point: ${answers.pain_point ?? "Not specified"}
- Readiness to invest: ${answers.commitment ?? "Not specified"}

Qualification logic (ROI Math):
A $20,000+ annual saving corresponds to reclaiming ~8-10 hours/week across a business.

QUALIFIED if:
- They spend 10+ hours/week on manual admin/ops.
- OR they have a team of 2+ people (easier to find inefficiencies).
- OR revenue is $50K+ (they have budget and complexity).
- AND they are not in the "No budget" category.

NOT QUALIFIED if:
- They are Solo AND Under $50k revenue AND spend Under 10 hours/week on manual work (ROI is too low for a custom engagement).
- OR they explicitly have "No budget".

Respond with ONLY valid JSON:
{"qualified": true, "reason": "one short friendly sentence about their ROI potential"}`;

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
