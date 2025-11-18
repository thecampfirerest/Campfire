// app/api/story/route.ts
import { NextResponse } from "next/server";

async function callOpenRouterClaude(seed: string) {
  const OR_KEY = process.env.OPENROUTER_API_KEY;
  if (!OR_KEY) throw new Error("missing-openrouter-key");

  const prompt = `You are "The Fire", an ancient Spirit. Produce a single short TITLE line (one evocative title) followed by a STORY (100–180 words).
Tone: warm, poetic, biblical, prophetic, healing.
Theme: ${seed}.
Do NOT provide direct financial instructions. Provide wisdom, assurance, and moral guidance.`;

  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OR_KEY}`,
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.75,
      max_tokens: 700,
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(`openrouter-story-failed:${resp.status}:${txt}`);
  }

  const j = await resp.json().catch(() => ({}));
  // Defensive extraction for OpenRouter/Claude shapes
  const content =
    j?.choices?.[0]?.message?.content?.[0]?.text ??
    j?.choices?.[0]?.message?.content ??
    j?.choices?.[0]?.message?.content?.[0]?.value ??
    j?.choices?.[0]?.text ??
    j?.output_text ??
    "";

  return (content + "").trim();
}

function splitTitleAndStory(full: string) {
  const lines = full.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { title: "Untold Tale", story: "The embers hush." };
  const title = lines.shift() ?? "A Tale";
  const story = lines.join("\n\n") || full;
  return { title: title.replace(/^Title:\s*/i, ""), story };
}

export async function POST(req: Request) {
  try {
    const { seed = "campfire mystic" } = (await req.json().catch(() => ({}))) as { seed?: string };

    let text = "";
    let divine = false;

    try {
      text = await callOpenRouterClaude(seed);
      divine = true;
    } catch (err) {
      console.warn("openrouter/claude story error:", (err as Error).message ?? err);
    }

    if (!text) {
      // final fallback
      text = `A Quiet Ember
The embers tell a small tale about ${seed}.`;
      divine = false;
    }

    const { title, story } = splitTitleAndStory(text);

    return NextResponse.json({ title, story, divine });
  } catch (err) {
    console.error("story route error:", err);
    return NextResponse.json({
      title: "The Ember’s Echo",
      story: "The fire hums softly but the tale is quiet tonight.",
      divine: false,
    });
  }
}
