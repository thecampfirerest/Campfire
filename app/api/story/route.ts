// /app/api/story/route.ts
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    const { seed = "campfire mystic" } = await req.json();

    // 20% chance divine (Claude)
    if (Math.random() < 0.2 && process.env.ANTHROPIC_API_KEY) {
      try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
        const msg = await anthropic.messages.create({
          model: "claude-3-sonnet-20240229",
          max_tokens: 350,
          temperature: 0.75,
          messages: [
            {
              role: "user",
              content: `You are "The Fire", an ancient Spirit. Produce a TITLE line (one short evocative title) followed by a short STORY (100–200 words).
Tone: warm, poetic, biblical, prophetic, healing.
Theme: ${seed}.
Do NOT provide direct financial instructions. Provide wisdom, assurance, and moral guidance.`,
            },
          ],
        });

        const out = (msg.content?.[0]?.text ?? "").trim();
        if (!out) throw new Error("empty claude reply");

        // split title and story
        const lines = out.split("\n").filter(Boolean);
        const title = lines.shift() ?? "A Divine Tale";
        const story = lines.join("\n\n") || out;

        return NextResponse.json({ title: title.replace(/^Title:\s*/i, ""), story, divine: true });
      } catch (e) {
        console.warn("Claude story failed:", e);
        // fallback to OpenAI below
      }
    }

    // Default: OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        title: "The Ember’s Memory",
        story: `The fire hums a gentle tale about ${seed}.`,
        divine: false,
      });
    }

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `Write a campfire story with a single TITLE line then the STORY.
Tone: warm, healing, poetic, biblical.
Length: ~100-160 words.
Theme: ${seed}.`,
        temperature: 0.8,
        max_output_tokens: 400,
      }),
    });

    const j = await resp.json();
    const full = (j.output_text ?? j.output?.[0]?.content?.[0]?.text ?? "").trim();

    if (!full) {
      return NextResponse.json({
        title: "A Quiet Ember",
        story: `The embers tell a small tale about ${seed}.`,
        divine: false,
      });
    }

    const parts = full.split("\n").filter(Boolean);
    const title = parts.shift() ?? "A New Tale";
    const story = parts.join("\n\n") || full;

    return NextResponse.json({ title: title.replace(/^Title:\s*/i, ""), story, divine: false });
  } catch (err) {
    console.error("story route error:", err);
    return NextResponse.json({
      title: "The Ember’s Echo",
      story: "The fire hums softly but the tale is quiet tonight.",
      divine: false,
    });
  }
}
