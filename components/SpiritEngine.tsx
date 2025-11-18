"use client";
import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

type Whisper = { text: string; rarity?: string; tags?: string[] };

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

function localFallback() {
  const arr = [
    "Patience shapes the best trades.",
    "The ember whispers: guard your heart from haste.",
    "Rest more than you react; wisdom grows in stillness.",
  ];
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SpiritEngine({ onWhisper }: { onWhisper?: (w: Whisper) => void }) {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [coolUntil, setCoolUntil] = useState<number | null>(null);
  const chime = useRef<Howl | null>(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    chime.current = new Howl({ src: ["/divine_chime.mp3"], volume: 0.34 });
    fetch("/whispers.json").then(r => r.json()).then(j => {
      setWhispers(j.whispers ?? []);
      setWeights(j.weights ?? { common: 70, rare: 25, divine: 5 });
    }).catch(() => {
      setWhispers([]);
      setWeights({ common: 70, rare: 25, divine: 5 });
    });
  }, []);

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
    return () => { if (t) clearInterval(t); };
  }, [coolUntil]);

  async function callSpirit() {
    if (coolUntil && Date.now() < coolUntil) return;
    const chosen = whispers.length ? weightedPick(whispers, (w) => weights[w.rarity ?? "common"]) : { text: localFallback(), rarity: "common" };

    if (!chosen.rarity || chosen.rarity === "common") {
      onWhisper?.({ text: chosen.text ?? localFallback(), rarity: "common" });
      return;
    }

    setLoading(true);
    try {
      if (chosen.rarity === "rare") {
        // call rare endpoint
        const res = await fetch("/api/generate-rare", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seed: chosen.tags?.[0] ?? "trading" }) });
        const j = await res.json();
        onWhisper?.({ text: j.text ?? j.story ?? localFallback(), rarity: "rare" });
      } else {
        chime.current?.play();
        const res = await fetch("/api/generate-divine", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seed: chosen.tags?.[0] ?? "destiny" }) });
        const j = await res.json();
        onWhisper?.({ text: j.text ?? j.story ?? localFallback(), rarity: "divine" });
      }
    } catch (e) {
      onWhisper?.({ text: localFallback(), rarity: "common" });
      console.warn("spirit call failed", e);
    } finally {
      setLoading(false);
      setCoolUntil(Date.now() + 10000);
      setRemaining(10);
    }
  }

  return (
    <button onClick={callSpirit} disabled={loading || !!coolUntil} className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition text-sm disabled:opacity-60">
      {loading ? "Listening..." : coolUntil ? `Cooling (${remaining}s)` : "Call the Spirit"}
    </button>
  );
}
