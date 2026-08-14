/**
 * app/api/ai/chat/route.ts
 *
 * Next.js API route for Groq Llama 3 AI responses.
 * Reads GROQ_API_KEY securely from server environment variables (.env.local or Vercel).
 */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in server environment." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { prompt, systemPrompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt || "You are Vayam, an official Indian civic knowledge assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Groq API Route Error]", response.status, errText);
      return NextResponse.json({ error: `Groq API returned ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ content });
  } catch (err: any) {
    console.error("[Groq API Route Exception]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
