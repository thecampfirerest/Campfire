"use client";

import { useEffect, useState, useRef } from "react";
import { Howl } from "howler";

type Whisper = { text: string; rarity?: string; tags?: string[] };
type Weights = { [k: string]: number };

function weightedPick<T>(items: T[], getWeight: (i: T) => number) {
  const total = items.reduce((s, it) => s + getWeight(it), 0);
  let rnd = Math.random() * total;
  for (const it of items) {
    const w = getWeight(it);
    if (rnd < w) return it;
    rnd -= w;
  }
  return items[0];
}

// Simple local templates for fallback
function localGenerate(seedTag?: string) {
  if (seedTag === "divine") {
    return "The Lord steadies your steps in the quiet hours.";
  }
  const templates = [
    "The ember remembers what the cold cannot keep.",
    "Breathe slowly; tomorrow will still be there.",
    "A single gentle choice tonight becomes a bright path."
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export default function SpiritEngine({
  faithMode = false,
  onWhisper,
}: {
  faithMode?: boolean;
  onWhisper?: (w: Whisper) => void;
}) {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [weights, setWeights] = useState<Weights>({});
  const [loading, setLoading] = useState(false);
  const lastCallAt = useRef<number | null>(null);
  const chime = useRef<Howl | null>(null);

  useEffect(() => {
    chime.current = new Howl({ src: ["/divine_chime.mp3"], volume: 0.32 });
    fetch("/whispers.json")
      .then((r) => r.json())
      .then((data) => {
        setWhispers(data.whispers || []);
        setWeights(data.weights || { common: 70, rare: 25, divine: 5 });
      })
      .catch(() => {
        setWhispers([]);
        setWeights({ common: 70, rare: 25, divine: 5 });
      });
  }, []);

  // Client-side cooldown to prevent accidental loops / double-click spamming
  const CAN_CALL_MS = 2500; // 2.5s between requests

  async function pickWhisper() {
    const now = Date.now();
    if (lastCallAt.current && now - lastCallAt.current < CAN_CALL_MS) return;
    lastCallAt.current = now;

    if (!whispers.length) {
      const fallback = localGenerate();
      onWhisper?.({ text: fallback, rarity: "common" });
      return;
    }

    const pool = whispers.filter((w) => (faithMode ? true : w.rarity !== "divine"));
    const pick = weightedPick(pool, (w) => weights[w.rarity ?? "common"]);

    const shouldGenerate = pick.rarity === "divine" || Math.random() < 0.12;

    if (!shouldGenerate) {
      if (pick.rarity === "divine") chime.current?.play();
      onWhisper?.(pick);
      return;
    }

    setLoading(true);
    try {
      // Only call AI if server is configured (server will self-check as well)
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedTag: pick.tags?.[0] }),
      });

      if (!res.ok) throw new Error("AI unavailable");
      const json = await res.json();
      const text = json.text?.trim() ?? localGenerate(pick.tags?.[0]);
      if (pick.rarity === "divine") chime.current?.play();
      onWhisper?.({ text, rarity: pick.rarity, tags: pick.tags });
    } catch {
      const local = localGenerate(pick.tags?.[0]);
      if (pick.rarity === "divine") chime.current?.play();
      onWhisper?.({ text: local, rarity: pick.rarity, tags: pick.tags });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 z-30">
      <button
        onClick={pickWhisper}
        disabled={loading}
        className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-lg transition shadow-md text-sm"
      >
        {loading ? "…breathing…" : "Call the Spirit"}
      </button>
    </div>
  );
}
