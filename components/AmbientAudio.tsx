"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export default function AmbientAudio() {
  const started = useRef(false);

  const ambientRef = useRef<Howl | null>(null);
  const fireRef = useRef<Howl | null>(null);
  const windRef = useRef<Howl | null>(null);
  const divineRef = useRef<Howl | null>(null);
  const ritualRef = useRef<Howl | null>(null);

  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("campfire_muted") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    ambientRef.current = new Howl({
      src: ["/ambient.mp3"],
      loop: true,
      volume: 0.18,
      preload: true,
    });

    fireRef.current = new Howl({
      src: ["/fireplace.mp3"],
      loop: true,
      volume: 0.28,
      preload: true,
    });

    ritualRef.current = new Howl({
      src: ["/ritual_chime.mp3"],
      loop: false,
      volume: 0.6,
      preload: true,
    });

    windRef.current = new Howl({
      src: ["/forest-wind.mp3"],
      loop: true,
      volume: 0.22,
      preload: true,
    });

    divineRef.current = new Howl({
      src: ["/divine_chime.mp3"],
      loop: false,
      volume: 0.6,
      preload: true,
    });

    (window as any).playRitualChime = () => {
      if (!muted) {
        ritualRef.current?.stop();
        ritualRef.current?.play();
      }
    };

    (window as any).playDivineChime = () => {
      if (!muted) {
        divineRef.current?.stop();
        divineRef.current?.play();
      }
    };

    function startAudio() {
      if (started.current) return;
      started.current = true;

      if (!muted) {
        ambientRef.current?.play();
        fireRef.current?.play();
        windRef.current?.play();
      }
    }

    window.addEventListener("click", startAudio);

    return () => {
      window.removeEventListener("click", startAudio);
      ambientRef.current?.stop();
      fireRef.current?.stop();
      windRef.current?.stop();
      divineRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("campfire_muted", muted ? "1" : "0");
    } catch {}

    const list = [
      ambientRef.current,
      fireRef.current,
      windRef.current,
      divineRef.current,
      ritualRef.current,
    ];

    list.forEach((h) => h?.mute(muted));
  }, [muted]);

  return (
    <>
      <button
        aria-label={muted ? "Unmute site audio" : "Mute site audio"}
        title={muted ? "Unmute" : "Mute"}
        onClick={() => setMuted((s) => !s)}
        className="
          fixed z-[90]

          right-4 
          top-24          /* mobile phones */

          sm:top-20       /* iPhone+, small tablets */
          md:top-16       /* iPad portrait */
          lg:top-12       /* laptops */
          
          sm:right-6
          md:right-8
          lg:right-10

          w-10 h-10 rounded-full
          bg-black/60 border border-white/10
          flex items-center justify-center shadow-lg
        "
      >
        <span style={{ fontSize: 16 }}>{muted ? "🔇" : "🔊"}</span>
      </button>
    </>
  );
}
