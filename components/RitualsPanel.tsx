"use client";
import { useEffect, useState } from "react";
import { loadRituals, canPerform, performRitual } from "@/lib/rituals";

export default function RitualsPanel() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadRituals().then((d) => setData(d));
  }, []);

  if (!data) return <div className="text-white/70">Loading…</div>;

  return (
    <div className="space-y-4 text-white text-sm">
      {data.rituals.map((r: any) => {
        const allowed = canPerform(r);
        return (
          <div
            key={r.id}
            className="p-3 bg-white/5 rounded border border-white/10"
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{r.title}</div>
                <div className="text-xs text-white/60">{r.description}</div>
              </div>
              <button
                onClick={() => performRitual(r)}
                className={`px-3 py-1 rounded text-xs ${
                  allowed
                    ? "bg-amber-500/30 hover:bg-amber-500/40"
                    : "bg-white/10 opacity-60"
                }`}
              >
                Begin
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
