"use client";
import React, { useState } from "react";
import { performRitual } from "@/lib/rituals";

export default function DestinyVigilPanel() {
  const [working, setWorking] = useState(false);

  async function complete() {
    if (working) return;
    setWorking(true);
    try {
      performRitual({ id: "destiny_vigil", title: "Destiny Vigil", cooldownHours: 72, warmth: 5 }, { fromUI: true });
      try { (window as any).playDivineChime?.(); } catch {}
      window.dispatchEvent(new Event("close:modal"));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-4 text-white text-sm">
      <div className="font-semibold text-lg">Destiny Vigil</div>
      <div className="text-xs text-white/70">
        A gentle vigil: reflect on your path for a few moments. Press Complete when you are ready.
      </div>

      <div className="flex gap-2">
        <button onClick={complete} disabled={working} className="px-3 py-1 bg-amber-600/30 rounded">
          {working ? "Completing…" : "Complete Vigil"}
        </button>
        <div className="flex-1" />
        <button onClick={() => window.dispatchEvent(new Event("close:modal"))} className="px-3 py-1 bg-white/10 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
