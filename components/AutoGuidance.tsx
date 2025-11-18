"use client";
import { useEffect, useRef } from "react";

/**
 * AutoGuidance runs once per minute and requests a whisper.
 * It dispatches a global event 'campfire:auto-whisper' — Campfire listens and responds.
 * This avoids coupling with SpiritEngine internals and respects cooldown/backoff.
 */

export default function AutoGuidance() {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // start after page load to avoid immediate spam
    const startDelay = 8_000; // 8s initial delay
    const tick = () => {
      // dispatch a gentle request; Campfire will decide whether to accept
      window.dispatchEvent(new CustomEvent("campfire:auto-whisper"));
    };

    const startTimer = window.setTimeout(() => {
      tick();
      intervalRef.current = window.setInterval(tick, 60 * 1000) as unknown as number;
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
