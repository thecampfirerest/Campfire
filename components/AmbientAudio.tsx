"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export default function AmbientAudio() {
  const started = useRef(false);

  // ambient sources: play all three continuously
  const ambientRef = useRef<Howl | null>(null);
  const fireRef = useRef<Howl | null>(null);
  const windRef = useRef<Howl | null>(null);
  const divineRef = useRef<Howl | null>(null);

  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("campfire_muted") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // create howls (ensure filenames match files in /public)
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

    // attach a global helper so other components can trigger divine chime
    // e.g. window.playDivineChime?.()
    // keep it idempotent
    (window as any).playDivineChime = () => {
      try {
        if (muted) return;
        divineRef.current?.stop();
        divineRef.current?.play();
      } catch (e) {
        // ignore
      }
    };

    function startAudio() {
      if (started.current) return;
      started.current = true;

      // only play if not muted
      if (!muted) {
        // NOTE: Howler.play() does not return a Promise — do not call .catch on it.
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

  // keep Howl mute state synced
  useEffect(() => {
    try {
      localStorage.setItem("campfire_muted", muted ? "1" : "0");
    } catch {}
    const list = [ambientRef.current, fireRef.current, windRef.current, divineRef.current];
    list.forEach((h) => {
      if (!h) return;
      h.mute(muted);
    });
  }, [muted]);

  // minimal UI control: small mute button top-right (matches your request)
  return (
    <>
      <button
        aria-label={muted ? "Unmute site audio" : "Mute site audio"}
        title={muted ? "Unmute" : "Mute"}
        onClick={() => setMuted((s) => !s)}
        className="fixed right-4 top-12 z-[90] w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center shadow-lg"
      >
        <span style={{ fontSize: 16 }}>{muted ? "🔇" : "🔊"}</span>
      </button>
    </>
  );
}
