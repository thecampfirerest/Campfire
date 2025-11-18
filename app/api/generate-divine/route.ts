// app/api/generate-divine/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { seed = "destiny" } = (await req.json().catch(() => ({}))) as { seed?: string };
    const OR_KEY = process.env.OPENROUTER_API_KEY;
    if (!OR_KEY) {
      return NextResponse.json({
        text: "The flame swells with ancient tenderness, but no key was found…",
      });
    }

    const prompt = `You are "The Fire" — an ancient Spirit, speaking in warm, biblical, prophetic poetry.
Give a DIVINE WHISPER (70–120 words).
Tone: slow, ancient, loving, mysterious.
Theme: ${seed}.
No predictions. No finance calls. Only wisdom, assurance, spiritual depth.`;

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
      console.warn("generate-divine failed:", resp.status, txt);
      return NextResponse.json({ text: "The flame murmurs… but words do not form." });
    }

    const j = await resp.json().catch(() => ({}));
    const text =
      j?.choices?.[0]?.message?.content?.[0]?.text ??
      j?.choices?.[0]?.message?.content ??
      j?.choices?.[0]?.text ??
      j?.output_text ??
      "The flame murmurs… but words do not form.";

    return NextResponse.json({ text: (text + "").trim() });
  } catch (err) {
    console.error("generate-divine error:", err);
    return NextResponse.json({ text: "The divine ember flickers, but remains silent…" });
  }
}
