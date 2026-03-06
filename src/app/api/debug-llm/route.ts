import { NextResponse } from "next/server";

/**
 * GET /api/debug-llm
 * Tests each LLM provider with a minimal prompt and returns status.
 * REMOVE THIS ENDPOINT before going to production with real traffic.
 */
export async function GET() {
    const results: Record<string, unknown> = {};

    // --- OpenAI ---
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
        results.openai = { status: "skipped", reason: "OPENAI_API_KEY not set" };
    } else {
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 15_000);
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                signal: controller.signal,
                headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "gpt-4o",
                    max_tokens: 20,
                    messages: [{ role: "user", content: 'Reply with {"ok":true}' }],
                }),
            });
            const body = await res.text();
            results.openai = { status: res.ok ? "ok" : "error", http: res.status, body: body.slice(0, 300) };
        } catch (e) {
            results.openai = { status: "threw", error: String(e) };
        }
    }

    // --- Gemini 2.5-pro ---
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        results.gemini_2_5_pro = { status: "skipped", reason: "GEMINI_API_KEY not set" };
        results.gemini_2_0_flash = { status: "skipped", reason: "GEMINI_API_KEY not set" };
    } else {
        for (const model of ["gemini-2.5-pro", "gemini-2.0-flash-001"] as const) {
            const key = model.replace(/\./g, "_").replace(/-/g, "_");
            try {
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 15_000);
                const res = await fetch(
                    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
                    {
                        method: "POST",
                        signal: controller.signal,
                        headers: { Authorization: `Bearer ${geminiKey}`, "Content-Type": "application/json" },
                        body: JSON.stringify({
                            model,
                            max_tokens: 20,
                            messages: [{ role: "user", content: 'Reply with {"ok":true}' }],
                        }),
                    }
                );
                const body = await res.text();
                results[key] = { status: res.ok ? "ok" : "error", http: res.status, body: body.slice(0, 300) };
            } catch (e) {
                results[key] = { status: "threw", error: String(e) };
            }
        }
    }

    return NextResponse.json(results);
}
