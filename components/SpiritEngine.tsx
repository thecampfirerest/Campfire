"use client";

import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

// ----------------------------------
// TypedWhisper Component
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

      const delay = ch === " " ? 35 : 65;
      timer.current = window.setTimeout(step, delay);
    }

    timer.current = window.setTimeout(step, 300);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      sound.current?.stop();
    };
  }, [text]);

  return <span>{out}</span>;
}

// ----------------------------------
// Main SpiritEngine Component
// ----------------------------------
type Whisper = { text: string; rarity?: string; tags?: string[] };

export default function SpiritEngine({
  onWhisper,
}: {
  onWhisper?: (w: Whisper) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [coolUntil, setCoolUntil] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  const [typedText, setTypedText] = useState(""); // NEW

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
      // 20% divine → call divine endpoint
      const divineChance = Math.random() < 0.2;
      const endpoint = divineChance
        ? "/api/generate-divine"
        : "/api/generate-rare";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: "wisdom" }),
      });

      const j = await res.json();
      const text = j.text ?? "The ember glows softly for you.";
      const rarity = divineChance ? "divine" : "rare";

      // Send to Campfire
      onWhisper?.({ text, rarity });

      // Local typed display
      setTypedText(text);
    } catch (err) {
      console.error("SpiritEngine error:", err);
      const fallback = "The ember glows softly for you.";
      onWhisper?.({ text: fallback, rarity: "common" });
      setTypedText(fallback);
    } finally {
      setLoading(false);
      setCoolUntil(Date.now() + 10000);
      setRemaining(10);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={callSpirit}
        disabled={loading || !!coolUntil}
        className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition text-sm disabled:opacity-60"
      >
        {loading
          ? "Listening..."
          : coolUntil
          ? `Cooling (${remaining}s)`
          : "Call the Spirit"}
      </button>

      {/* TYPED WHISPER BELOW BUTTON */}
      {typedText && (
        <div className="mt-1 text-center text-sm text-amber-200 italic max-w-xs">
          <TypedWhisper text={typedText} />
        </div>
      )}
    </div>
  );
}
