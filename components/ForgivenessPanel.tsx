"use client";
import React, { useState } from "react";
import { performRitual } from "@/lib/rituals";

export default function ForgivenessPanel() {
  const [text, setText] = useState("");
  const [working, setWorking] = useState(false);

  async function offer() {
    if (working) return;
    if (!text.trim()) return;
    setWorking(true);
    try {
      performRitual({ id: "forgiveness_rite", title: "Forgiveness Rite", cooldownHours: 24, warmth: 3 }, { text, fromUI: true });
      try { (window as any).playDivineChime?.(); } catch {}
      // optionally save a covenant-like entry or dispatch event
      window.dispatchEvent(new Event("close:modal"));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-4 text-white text-sm">
      <div className="font-semibold text-lg">Forgiveness Rite</div>
      <div className="text-xs text-white/70">Write a short forgiveness prayer or declaration, then offer it to the fire.</div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-24 bg-black/30 border border-white/10 rounded p-2 text-sm"
        placeholder="I forgive..."
      />

      <div className="flex gap-2">
        <button onClick={offer} disabled={working || !text.trim()} className="px-3 py-1 bg-amber-600/30 rounded">
          {working ? "Offering…" : "Offer Forgiveness"}
        </button>

        <div className="flex-1" />
        <button onClick={() => window.dispatchEvent(new Event("close:modal"))} className="px-3 py-1 bg-white/10 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
