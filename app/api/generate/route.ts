import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 10 * 1000; // 10s window
const RATE_LIMIT_MAX = 6; // max calls per window
const calls: number[] = []; // timestamps

async function limited() {
  const now = Date.now();
  // purge old
  while (calls.length && calls[0] < now - RATE_LIMIT_WINDOW) calls.shift();
  if (calls.length >= RATE_LIMIT_MAX) return true;
  calls.push(now);
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const seedTag = body.seedTag || "general";

    // very small server-side rate limiter to stop loops or abuse
    if (await limited()) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "AI not configured" }, { status: 400 });
    }

    const prompt = `You are "The Campfire", a warm gentle guide. Produce a single short whisper (8-18 words) in a restful, poetic tone. If seedTag == "divine", include gentle God-centered encouragement (NLT-like tone). Return one line only.`;

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: prompt }, { role: "user", content: `seedTag: ${seedTag}` }],
        temperature: 0.85,
        max_tokens: 48,
      }),
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      return NextResponse.json({ error: text }, { status: 502 });
    }

    const j = await apiRes.json();
    const text = j.choices?.[0]?.message?.content?.trim() ?? null;
    if (!text) return NextResponse.json({ error: "no_text" }, { status: 502 });
    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "server_error" }, { status: 500 });
  }
}
