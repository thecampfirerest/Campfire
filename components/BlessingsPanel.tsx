"use client";
import React from "react";
import { loadMemory } from "@/lib/memoryClient";

// Full Blessing Icon + Label Mapping
const BLESSING_INFO: Record<
  string,
  { icon: string; label: string; desc: string }
> = {
  // Core Blessings
  rest_blessing: {
    icon: "💤",
    label: "Rest Blessing",
    desc: "A blessing tied to resting.",
  },
  strength_blessing: {
    icon: "🛡️",
    label: "Strength Blessing",
    desc: "A blessing tied to resilience.",
  },
  clarity_blessing: {
    icon: "✨",
    label: "Clarity Blessing",
    desc: "A blessing of divine clarity.",
  },
  journey_blessing: {
    icon: "🌿",
    label: "Journey Blessing",
    desc: "A blessing earned along the path.",
  },

  // Sample blessing (remove later if you don’t need)
  sample_blessing: {
    icon: "❔",
    label: "Unknown Blessing",
    desc: "A mysterious blessing.",
  },
};

export default function BlessingsPanel() {
  const raw = (loadMemory("blessings") ?? []).filter(
    (b: any) => !String(b).includes("sample")
  );

  if (!raw.length)
    return <div className="text-white/70">No blessings yet.</div>;

  return (
    <div className="grid grid-cols-2 gap-4 w-full px-1">
      {raw.map((r: any) => {
        const key =
          typeof r === "string" ? r : r.id ?? "unknown_blessing";
        const info =
          BLESSING_INFO[key] ?? {
            icon: "❔",
            label: key.replace(/_/g, " "),
            desc: "A mysterious blessing.",
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
