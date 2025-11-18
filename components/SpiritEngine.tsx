"use client";

import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

// ----------------------------------
// Typed Whisper – used only internally for typing out AI responses
// ----------------------------------
function TypedWhisper({ text }: { text: string }) {
  const [out, setOut] = useState("");
  const idx = useRef(0);
  const timer = useRef<number | null>(null);
  const sound = useRef<Howl | null>(null);

  useEffect(() => {
    setOut("");
    idx.current = 0;

    sound.current = new Howl({
      src: ["/typing.mp3"],
      volume: 0.24,
      preload: true,
    });

    function step() {
      if (idx.current >= text.length) {
        sound.current?.stop();
        return;
      }

      const ch = text[idx.current++];
      setOut((p) => p + ch);

      if (ch !== " " && sound.current) {
        try {
          sound.current.stop();
          sound.current.seek(0);
          sound.current.play();
        } catch {}
      }

      timer.current = window.setTimeout(step, ch === " " ? 35 : 65);
    }

    timer.current = window.setTimeout(step, 200);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      sound.current?.stop();
    };
  }, [text]);

  return <span>{out}</span>;
}

type Whisper = { text: string; rarity?: string; tags?: string[] };

export default function SpiritEngine({
  onWhisper,
}: {
  onWhisper?: (w: Whisper) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [coolUntil, setCoolUntil] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    let t: number | null = null;
    if (coolUntil) {
      t = window.setInterval(() => {
        const rem = Math.max(0, Math.ceil((coolUntil - Date.now()) / 1000));
        setRemaining(rem);
        if (rem <= 0) {
          setCoolUntil(null);
          setRemaining(0);
          if (t) clearInterval(t);
        }
      }, 250);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [coolUntil]);

  async function callSpirit() {
    if (coolUntil && Date.now() < coolUntil) return;

    setLoading(true);

    try {
      const divine = Math.random() < 0.2;
      const res = await fetch(divine ? "/api/generate-divine" : "/api/generate-rare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: "guidance" }),
      });

      const j = await res.json();
      const text = j.text ?? "The ember glows softly for you.";
      const rarity = divine ? "divine" : "rare";

      // Send typed whisper to Campfire (which handles display)
      onWhisper?.({ text, rarity });
    } catch {
      onWhisper?.({ text: "The ember glows softly for you.", rarity: "common" });
    } finally {
      setLoading(false);
      setCoolUntil(Date.now() + 10000);
      setRemaining(10);
    }
  }

  return (
    <button
      onClick={callSpirit}
      disabled={loading || !!coolUntil}
      className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition text-sm disabled:opacity-50"
    >
      {loading ? "Listening..." : coolUntil ? `Cooling (${remaining}s)` : "Call the Spirit"}
    </button>
  );
}
