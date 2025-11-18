"use client";

import React, { useState } from "react";
import { Howl } from "howler";

export default function BurdenRelease({
  onRelease,
}: {
  onRelease?: () => void;
}) {
  const [text, setText] = useState("");

  const flame = new Howl({
    src: ["/flame_whoosh.mp3"], // place this file in /public
    volume: 0.45,
  });

  function handleRelease() {
    if (!text.trim()) return;

    flame.play();

    setTimeout(() => {
      onRelease?.();
      setText("");
    }, 400); // slight delay for effect
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <textarea
        className="w-40 h-20 bg-black/30 border border-white/10 rounded p-2 text-xs text-white"
        placeholder="Lay down a burden..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleRelease}
        className="px-3 py-1 bg-red-600/40 hover:bg-red-600/60 text-xs rounded border border-white/10"
      >
        Release
      </button>
    </div>
  );
}
