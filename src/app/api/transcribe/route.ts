import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
        return new Response(JSON.stringify({ error: "No audio file provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Forward to OpenAI Whisper
    const whisperForm = new FormData();
    whisperForm.append("file", audioFile, "audio.webm");
    whisperForm.append("model", "whisper-1");
    whisperForm.append("language", "en");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: whisperForm,
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Whisper error:", err);
        return new Response(JSON.stringify({ error: "Transcription failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ transcript: data.text ?? "" }), {
        headers: { "Content-Type": "application/json" },
    });
}
