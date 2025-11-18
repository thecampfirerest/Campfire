import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { seed } = await req.json();

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `Give a short, warm, trading-first piece of wisdom (60–120 words).
Campfire tone. Biblical calm. Practical emotional guidance.
Theme: ${seed}.
Avoid signals, predictions, or direct trading calls.`,
      }),
    });

    const j = await res.json();

    return NextResponse.json({
      text: j.output_text?.trim() ?? "The fire reminds you to move with patience.",
    });
  } catch (e) {
    return NextResponse.json({
      text: "The ember whispers softly: patience protects the wise.",
    });
  }
}
