"use client";
import React from "react";
import { loadMemory } from "@/lib/memoryClient";

const BADGE_INFO: Record<string, { icon: string; label: string; desc: string }> = {
  Rested: { icon: "😴", label: "Rested", desc: "A badge for choosing peace when the world felt heavy." },
  Lightened: { icon: "🕊", label: "Lightened", desc: "Earned after releasing a burden." },
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
      {raw.map((r: any) => {
        const key = typeof r === "string" ? r : r.id ?? "unknown";
        const info = BADGE_INFO[key] ?? { icon: "❔", label: key, desc: "" };

        return (
          <div key={key} className="p-4 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{info.icon}</div>
              <div className="text-white/90">
                {info.label}
                <div className="text-xs text-white/60 mt-1">{info.desc}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
