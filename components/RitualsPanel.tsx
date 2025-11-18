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
  // tick used solely to force re-render
  const [, tick] = useState(0);

  useEffect(() => {
    let mounted = true;

    // load rituals once
    loadRituals().then((d) => {
      if (!mounted) return;
      setData(d);
    }).catch(() => {
      if (!mounted) return;
      setData({ rituals: [] , scripturePrompts: [] });
    });

    // interval to update countdown display every second
    const timer = setInterval(() => tick((s) => s + 1), 1000);

    // refresh UI when a ritual is performed elsewhere
    function onRitualUpdate(_e: any) {
      // force a redraw and allow components to re-read lastPerformed
      tick((s) => s + 1);
    }
    window.addEventListener("ritual:update", onRitualUpdate);

    return () => {
      mounted = false;
      clearInterval(timer);
      window.removeEventListener("ritual:update", onRitualUpdate);
    };
  }, []);

  if (!data) return <div className="text-white/70">Loading…</div>;

  function openPanel(id: string, prefill?: any) {
    window.dispatchEvent(new CustomEvent("open:panel", { detail: { id, prefill } }));
  }

  function closeModal() {
    // close modal (some UIs listen to this event)
    window.dispatchEvent(new Event("close:modal"));
  }

  return (
    <div className="space-y-4 text-white text-sm">
      {data.rituals.map((r: any) => {
        const allowed = canPerform(r);
        const last = lastPerformed(r.id);
        let remaining = 0;
        if (last) {
          const delta = Date.now() - new Date(last).getTime();
          remaining = Math.max(
            0,
            Math.floor((r.cooldownHours * 3600 * 1000 - delta) / 1000)
          );
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
                <div className="text-xxs text-white/60">
                  {isDone
                    ? `Cooldown: ${secondsToHuman(remaining)}`
                    : allowed
                    ? "Ready"
                    : "Cooling"}
                </div>

                <button
                  onClick={() => {
                    if (!allowed) return;

                    const id = (r.id ?? "").toLowerCase();
                    const title = (r.title ?? "").toLowerCase();

                    // DAILY REST pair: mark ritual then trigger rest action
                    if (title.includes("daily rest") || id.includes("daily_rest") || id.includes("daily-rest")) {
                      performRitual(r, { fromRitual: true });
                      // give UI a tick to update
                      window.dispatchEvent(new CustomEvent("ritual:update", { detail: { id: r.id } }));
                      closeModal();
                      setTimeout(() => window.dispatchEvent(new Event("open:rest")), 80);
                      return;
                    }

                    // BURDEN: mark ritual then open burden modal
                    if (title.includes("burden") || id.includes("burden")) {
                      performRitual(r, { fromRitual: true });
                      window.dispatchEvent(new CustomEvent("ritual:update", { detail: { id: r.id } }));
                      closeModal();
                      setTimeout(() => window.dispatchEvent(new Event("open:burden")), 80);
                      return;
                    }

                    // GRATITUDE: perform then open journal with prefill
                    if (title.includes("gratitude") || id.includes("gratitude")) {
                      performRitual(r, { fromRitual: true });
                      window.dispatchEvent(new CustomEvent("ritual:update", { detail: { id: r.id } }));
                      closeModal();
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent("open:panel", {
                          detail: { id: "journal", prefill: "I am thankful for:\n1.\n2.\n3." }
                        }));
                      }, 80);
                      return;
                    }

                    // STILLNESS: open breathing panel (it will perform ritual when done)
                    if (title.includes("stillness") || id.includes("stillness")) {
                      closeModal();
                      setTimeout(() => window.dispatchEvent(new CustomEvent("open:panel", { detail: { id: "stillness" } })), 80);
                      return;
                    }

                    // FORGIVENESS -> open covenant panel (the covenant panel can call performRitual when user completes)
                    if (title.includes("forgive") || id.includes("forgiveness")) {
                      closeModal();
                      setTimeout(() => window.dispatchEvent(new CustomEvent("open:panel", { detail: { id: "covenant" } })), 80);
                      return;
                    }

                    // DESTINY VIGIL -> open destiny panel
                    if (title.includes("destiny") || id.includes("destiny")) {
                      closeModal();
                      setTimeout(() => window.dispatchEvent(new CustomEvent("open:panel", { detail: { id: "destiny" } })), 80);
                      return;
                    }

                    // default: perform instantly
                    performRitual(r, { fromRitual: true });
                    // ensure UI updates immediately
                    window.dispatchEvent(new CustomEvent("ritual:update", { detail: { id: r.id } }));
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
