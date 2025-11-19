"use client";

import React, { useEffect, useState } from "react";
import { Howl } from "howler";
import { performRitual } from "@/lib/rituals";

export default function BurdenRelease({ onRelease }: { onRelease?: () => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const fire = new Howl({
    src: ["/flame_whoosh.mp3"],
    volume: 0.45,
  });

  useEffect(() => {
    function openFromRitual() {
      window.dispatchEvent(new Event("close:modal"));
      setTimeout(() => setOpen(true), 50);
    }

    window.addEventListener("open:burden", openFromRitual);
    return () => window.removeEventListener("open:burden", openFromRitual);
  }, []);

  function confirmRelease() {
    if (!text.trim()) return;

    try { fire.play(); } catch {}

    setTimeout(() => {
      performRitual(
        { id: "burden_release", cooldownHours: 24, title: "Burden Release", warmth: 2 },
        { burden: text }
      );

      window.dispatchEvent(
        new CustomEvent("burden:released", { detail: { text } })
      );

      onRelease?.(); // ← FIX: fire callback if provided

      setText("");
      setOpen(false);
    }, 380);
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/70 z-[220] flex items-center justify-center">
          <div className="bg-black/50 p-5 border border-white/10 rounded-xl max-w-xs w-full">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-28 bg-black/30 border border-white/20 rounded p-2 text-white"
              placeholder="Lay down your burden…"
            />

            <div className="flex justify-between mt-3">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-white/10 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmRelease}
                className="px-3 py-1 bg-red-500/40 rounded"
              >
                Burn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
