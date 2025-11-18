"use client";
import React from "react";
import { loadMemory } from "@/lib/memoryClient";

const INFO: Record<string, { icon: string; label: string; desc: string }> = {
  rest_blessing: { icon: "🔆", label: "Blessing of Rest", desc: "Earned after resting 3 times." },
  strength_blessing: { icon: "🛡", label: "Blessing of Strength", desc: "Granted after completing 5 rituals." },
  clarity_blessing: { icon: "✨", label: "Blessing of Clarity", desc: "Gifted after receiving a divine whisper." },
  journey_blessing: { icon: "🌿", label: "Blessing of Journey", desc: "Reached at 111 warmth." },
};

export default function BlessingsPanel() {
  const raw = (loadMemory("blessings") ?? []).filter((b: any) => !String(b).includes("sample"));
  if (!raw.length) return <div className="text-white/70">No blessings yet.</div>;

  return (
    <div className="flex flex-col gap-3">
      {raw.map((r: any, i: number) => {
        const key = typeof r === "string" ? r : r.id ?? JSON.stringify(r);
        const side = i % 2 === 0 ? "right" : "left";
        const info = INFO[key] ?? { icon: "❔", label: key, desc: "A mysterious blessing." };
        return (
          <div key={key} className="group relative p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-xl">{info.icon}</div>
              <div>
                <div className="text-white/90 font-semibold">{info.label}</div>
                <div className="text-xs text-white/60">{info.desc}</div>
              </div>
            </div>

            <div className={`hidden group-hover:block absolute top-1/2 -translate-y-1/2 ${side === "right" ? "left-full ml-3" : "right-full mr-3"} w-64 bg-black/70 p-3 rounded border border-white/10 text-xs`}>
              <pre className="whitespace-pre-wrap text-white/80 text-xs">{JSON.stringify(r, null, 2)}</pre>
            </div>
          </div>
        );
      })}
    </div>
  );
}
