"use client";
import React, { useEffect, useState } from "react";
import { Howl } from "howler";

// GLOBAL SINGLETON
let ambient: Howl | null = null;
let initialized = false;

export default function AmbientAudio() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initialized = true;

      ambient = new Howl({
        src: ["/ambient.mp3"],
        loop: true,
        volume: 0.18,
        html5: true,
      });

      // Start only once
      const start = () => {
        try {
          if (ambient && !ambient.playing()) ambient.play();
        } catch {}
      };

      window.addEventListener("click", start, { once: true });
      setTimeout(start, 1000);
    }
  }, []);

  useEffect(() => {
    if (!ambient) return;
    ambient.mute(muted);
  }, [muted]);

  return (
    <button
      onClick={() => setMuted((m) => !m)}
      className="fixed top-6 right-6 z-60 w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shadow-lg"
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
