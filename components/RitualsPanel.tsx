"use client";
import { useEffect, useState } from "react";
import { loadRituals, canPerform, performRitual, lastPerformed } from "@/lib/rituals";

function secondsToHuman(s: number) {
  if (s <= 0) return "Ready";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export default function RitualsPanel() {
  const [data, setData] = useState<any>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    loadRituals().then((d) => setData(d));
    const t = setInterval(() => tick((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="text-white/70">Loading…</div>;

  return (
    <div className="space-y-4 text-white text-sm">
      {data.rituals.map((r: any) => {
        const allowed = canPerform(r);
        const last = lastPerformed(r.id);
        let remaining = 0;
        if (last) {
          const delta = Date.now() - new Date(last).getTime();
          remaining = Math.max(0, Math.floor((r.cooldownHours * 3600 * 1000 - delta) / 1000));
        }
        const isDone = !allowed && remaining > 0;

        return (
          <div key={r.id} className="p-3 bg-white/5 rounded border border-white/10">
            <div className="flex justify-between items-start">
              <div className="max-w-[70%]">
                <div className="font-semibold">{r.title}</div>
                <div className="text-xs text-white/60">{r.description}</div>
              </div>

              <div className="text-right flex flex-col items-end gap-2">
                <div className="text-xxs text-white/60">{isDone ? `Cooldown: ${secondsToHuman(remaining)}` : (allowed ? "Ready" : "Cooling")}</div>
                <button
                  onClick={() => {
                    // perform the ritual (UI state will update via lastPerformed + interval)
                    performRitual(r, { fromUI: true });
                  }}
                  disabled={!allowed}
                  className={`px-3 py-1 rounded text-xs ${
                    allowed ? "bg-amber-500/30 hover:bg-amber-500/40" : "bg-white/10 opacity-60"
                  }`}
                >
                  {allowed ? "Begin" : "Done"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
