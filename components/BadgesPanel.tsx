"use client";
import React from "react";
import { loadMemory } from "@/lib/memoryClient";

// Full badge registry (all known IDs mapped)
const BADGE_INFO: Record<
  string,
  { icon: string; label: string; desc: string }
> = {
  // Core badges
  Rested: {
    icon: "😴",
    label: "Rested",
    desc: "A badge for choosing peace when the world felt heavy.",
  },
  Lightened: {
    icon: "🕊",
    label: "Lightened",
    desc: "Earned after releasing a burden.",
  },
  GratefulHeart: {
    icon: "💛",
    label: "Grateful Heart",
    desc: "A token of gratitude.",
  },

  // Warmth milestones
  warmth_20: { icon: "🔥", label: "Warmth 20", desc: "Your inner flame reached 20." },
  warmth_50: { icon: "🔥🔥", label: "Warmth 50", desc: "Reached 50 warmth." },
  warmth_100: { icon: "🔥✨", label: "Warmth 100", desc: "A golden ember — a milestone." },
  warmth_200: { icon: "🔥🔥🔥", label: "Warmth 200", desc: "Your flame burns exceptionally strong." },
  warmth_400: { icon: "🔥✨🔥", label: "Warmth 400", desc: "A blazing soul of unmatched fire." },

  // Divine
  DivineHeard: {
    icon: "✨",
    label: "Divine Heard",
    desc: "A divine whisper found you.",
  },

  // Blessings (your missing ones)
  "blessing mystery blessing": {
    icon: "❔",
    label: "Unknown Blessing",
    desc: "A mysterious blessing.",
  },
  "blessing rest blessing": {
    icon: "💤",
    label: "Rest Blessing",
    desc: "A blessing tied to resting.",
  },
  "blessing strength blessing": {
    icon: "🛡️",
    label: "Strength Blessing",
    desc: "A blessing tied to resilience.",
  },
  "blessing journey blessing": {
    icon: "🌿",
    label: "Journey Blessing",
    desc: "A blessing earned along the path.",
  },
  "blessing clarity blessing": {
    icon: "✨",
    label: "Clarity Blessing",
    desc: "A blessing of divine clarity.",
  },
};

export default function BadgesPanel() {
  const raw = loadMemory("badges") ?? [];
  if (!raw.length) return <div className="text-white/70">No badges yet.</div>;

  return (
    <div className="grid grid-cols-3 gap-4 w-full px-2">
      {raw.map((r: any) => {
        const key = typeof r === "string" ? r : r.id ?? "unknown";
        const info =
          BADGE_INFO[key] ?? {
            icon: "❔",
            label: key,
            desc: "A mysterious badge.",
          };

        return (
          <div
            key={key}
            className="p-4 bg-white/5 border border-white/10 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{info.icon}</div>

              <div className="text-white/90 leading-tight">
                <div className="font-semibold">{info.label}</div>
                <div className="text-xs text-white/60 mt-1 break-words">
                  {info.desc}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
