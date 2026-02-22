import { NextRequest } from "next/server";
import { CHAT_SYSTEM_PROMPT } from "@/lib/survey";

export async function POST(req: NextRequest) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: "OpenAI API key not configured" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    const { messages, name } = await req.json();

    const systemPrompt = CHAT_SYSTEM_PROMPT.replace("{{name}}", name || "there");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
        }),
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: "OpenAI request failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Stream the response directly
    return new Response(response.body, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
