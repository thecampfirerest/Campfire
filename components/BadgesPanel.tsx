"use client";
import React from "react";
import { loadMemory } from "@/lib/memoryClient";

const BADGE_INFO: Record<string, { icon: string; label: string; desc: string }> = {
  Rested: { icon: "😴", label: "Rested", desc: "A badge for choosing peace when the world felt heavy." },
  Lightened: { icon: "🕊", label: "Lightened", desc: "Earned after releasing a burden into the fire." },
  GratefulHeart: { icon: "💛", label: "Grateful Heart", desc: "A token of gratitude." },
  warmth_20: { icon: "🔥", label: "Warmth 20", desc: "Your inner flame reached 20." },
  warmth_50: { icon: "🔥🔥", label: "Warmth 50", desc: "Reached 50 warmth." },
  warmth_100: { icon: "🔥✨", label: "Warmth 100", desc: "A golden ember — a milestone." },
  DivineHeard: { icon: "✨", label: "Divine Heard", desc: "A divine whisper found you." },
};

export default function BadgesPanel() {
  const raw = loadMemory("badges") ?? [];
  if (!raw.length) return <div className="text-white/70">No badges yet.</div>;

  return (
    <div className="grid grid-cols-2 gap-3">
      {raw.map((r: any, i: number) => {
        const key = typeof r === "string" ? r : r.id ?? JSON.stringify(r);
        const side = i % 2 === 0 ? "right" : "left";
        const info = BADGE_INFO[key] ?? { icon: "❔", label: key, desc: "A mysterious badge." };
        return (
          <div key={key} className="group relative p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{info.icon}</div>
              <div className="text-white/90">{info.label}</div>
            </div>
            <div className={`hidden group-hover:block absolute top-1/2 -translate-y-1/2 ${side === "right" ? "left-full ml-3" : "right-full mr-3"} w-56 bg-black/70 p-3 rounded border border-white/10 text-xs`}>
              <div className="text-white/90">{info.desc}</div>
              <div className="mt-2 text-white/70 text-xs">{JSON.stringify(r)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
