import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const { seed } = await req.json();

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 200,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `You are "The Fire" — an ancient Spirit, 
speaking in warm, biblical, prophetic poetry.

Give a divine whisper (70–120 words).
Tone: slow, ancient, loving, mysterious.
Theme: ${seed}.

No predictions. No finance calls. 
Only wisdom, assurance, spiritual depth.`,
        },
      ],
    });

    const text = msg.content[0].text.trim();

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({
      text:
        "The flame swells with ancient tenderness, but its voice softens into silence…",
    });
  }
}
