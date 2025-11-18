"use client";
import React, { useEffect, useRef, useState } from "react";
import { performRitual } from "@/lib/rituals";

export default function StillnessPanel() {
  const INHALE = 4;
  const HOLD = 2;
  const EXHALE = 6;

  const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale" | "done">("idle");
  const [count, setCount] = useState(INHALE);
  const intervalRef = useRef<number | null>(null);

  function startPhase(newPhase: typeof phase) {
    setPhase(newPhase);
    if (newPhase === "inhale") setCount(INHALE);
    if (newPhase === "hold") setCount(HOLD);
    if (newPhase === "exhale") setCount(EXHALE);
  }

  function begin() {
    if (phase !== "idle") return;
    startPhase("inhale");
  }

  // Countdown logic
  useEffect(() => {
    if (phase === "idle" || phase === "done") return;

    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
  if (phase === "inhale") {
    startPhase("hold");
  } else if (phase === "hold") {
    startPhase("exhale");
  } else if (phase === "exhale") {
    clearInterval(intervalRef.current!);
    // delay to ensure React renders "done"
    setTimeout(() => setPhase("done"), 80);
  }
  return 0;
}

        return c - 1;
      });
    }, 1000);

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [phase]);

  // when ritual completes
  useEffect(() => {
    if (phase === "done") {
  performRitual(
    { id: "stillness", title: "Stillness", cooldownHours: 24, warmth: 2 },
    { done: true }
  );

  // Ensure “Done” stays visible long enough BEFORE modal closes
  setTimeout(() => {
    window.dispatchEvent(new Event("close:modal"));
  }, 1300); // ← this is the key 
}

  }, [phase]);

  return (
    <div className="text-white text-sm space-y-4">
      <div className="font-semibold text-lg">Ritual of Stillness</div>

      <div className="bg-black/30 p-4 rounded text-center">
        {phase === "idle" && (
          <button
            onClick={begin}
            className="px-4 py-2 bg-amber-600/30 rounded"
          >
            Begin Breath
          </button>
        )}

        {phase !== "idle" && phase !== "done" && (
          <div>
            <div className="text-xl font-semibold capitalize">{phase}</div>
            <div className="text-4xl mt-3">{count}</div>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center">
            <div className="font-semibold text-lg">Ritual Complete</div>
          </div>
        )}
      </div>

      <button
        onClick={() => window.dispatchEvent(new Event("close:modal"))}
        className="px-3 py-1 bg-white/10 rounded"
      >
        Close
      </button>
    </div>
  );
}
