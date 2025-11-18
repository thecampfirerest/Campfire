"use client";

import React, { useState } from "react";
import { Howl } from "howler";

export default function BurdenRelease({ onRelease }: { onRelease?: () => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const fire = new Howl({
    src: ["/flame_whoosh.mp3"],
    volume: 0.45,
  });

  function confirmRelease() {
    if (!text.trim()) return;

    fire.play();
    setTimeout(() => {
      onRelease?.();
      setText("");
      setOpen(false);
    }, 350);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-red-600/40 hover:bg-red-600/60 rounded text-sm border border-white/10"
      >
        Release Burden
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]">
          <div className="bg-black/50 p-5 rounded-xl border border-white/10 max-w-xs w-full">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-28 bg-black/30 border border-white/20 text-white p-2 rounded text-sm"
              placeholder="Lay down your burden…"
            />

            <div className="flex justify-between mt-3">
              <button onClick={() => setOpen(false)} className="px-3 py-1 bg-white/10 rounded">
                Cancel
              </button>

              <button onClick={confirmRelease} className="px-3 py-1 bg-red-500/40 rounded">
                Burn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
