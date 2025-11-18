"use client";
import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

function loadNumber(key: string) {
  try { return Number(localStorage.getItem(key) ?? "0"); } catch { return 0; }
}
function saveNumber(key: string, v: number) { try { localStorage.setItem(key, String(v)); } catch {} }

export default function RestButton() {
  const [coolUntil, setCoolUntil] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const chime = useRef<Howl | null>(null);

  useEffect(() => {
    chime.current = new Howl({ src: ["/rest_chime.mp3"], volume: 0.45 });
  }, []);

  useEffect(() => {
    let t: number | null = null;
    if (coolUntil) {
      t = window.setInterval(() => {
        const rem = Math.max(0, Math.ceil((coolUntil - Date.now()) / 1000));
        setRemaining(rem);
        if (rem <= 0) {
          setCoolUntil(null);
          if (t) { clearInterval(t); }
        }
      }, 250);
    }
    return () => { if (t) clearInterval(t); };
  }, [coolUntil]);

  // Listen for ritual-triggered rest (opened from RitualsPanel)
  useEffect(() => {
    function triggerRest() {
      doRest();
    }
    window.addEventListener("open:rest", triggerRest);
    return () => window.removeEventListener("open:rest", triggerRest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function doRest() {
    if (coolUntil && Date.now() < coolUntil) return;
    const prev = loadNumber("rest_count");
    const now = prev + 1;
    saveNumber("rest_count", now);
    window.dispatchEvent(new CustomEvent("rest:update", { detail: { restCount: now } }));

    // add warmth (central function)
    const warmthPrev = loadNumber("inner_warmth");
    const warmthNow = warmthPrev + 1;
    saveNumber("inner_warmth", warmthNow);
    window.dispatchEvent(new CustomEvent("warmth:update", { detail: { warmth: warmthNow } }));

    try { chime.current?.play(); } catch {}
    setCoolUntil(Date.now() + 8000);
    setRemaining(8);
    window.dispatchEvent(new CustomEvent("campfire:rest", { detail: { restCount: now } }));
  }

  return (
    <div className="relative inline-block">
      <button onClick={doRest} disabled={!!coolUntil} className="px-4 py-2 rounded-xl bg-amber-600/25 border border-amber-700/10 text-sm">
        {coolUntil ? `Rest (${remaining}s)` : "Rest"}
      </button>
    </div>
  );
}
