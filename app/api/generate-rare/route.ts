// app/api/generate-rare/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { seed = "trading" } = (await req.json().catch(() => ({}))) as { seed?: string };
    const OR_KEY = process.env.OPENROUTER_API_KEY;
    if (!OR_KEY) {
      return NextResponse.json({ text: "The ember reminds you to move with patience." });
    }

    const prompt = `Give a short, warm, trading-first piece of wisdom (60–120 words).
Campfire tone. Biblical calm. Practical emotional guidance.
Theme: ${seed}.
Avoid signals, predictions, or direct trading calls.`;

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OR_KEY}`,
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 220,
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      console.warn("generate-rare failed:", resp.status, txt);
      return NextResponse.json({ text: "The fire reminds you: patience is a quiet shield." });
    }

    const j = await resp.json().catch(() => ({}));
    const text =
      j?.choices?.[0]?.message?.content?.[0]?.text ??
      j?.choices?.[0]?.message?.content ??
      j?.choices?.[0]?.text ??
      j?.output_text ??
      "The fire reminds you: patience is a quiet shield.";

    return NextResponse.json({ text: (text + "").trim() });
  } catch (e) {
    console.error("generate-rare error:", e);
    return NextResponse.json({ text: "The ember whispers softly: patience protects the wise." });
  }
}
