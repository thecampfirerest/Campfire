"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { saveMemory, loadMemory } from "@/lib/memoryClient";
import { addWarmth } from "@/lib/innerWarmth";
import BurdenRelease from "./BurdenRelease";
import SpiritEngine from "./SpiritEngine";
import RestButton from "./RestButton";
import AmbientAudio from "./AmbientAudio";
import { evaluateBlessings } from "@/lib/blessings";

/* ----------------------------------------
   Whisper Typing Component (Minimal Patch)
   ---------------------------------------- */
function TypedWhisper({ text }: { text: string }) {
  const [out, setOut] = useState("");
  const idx = useRef(0);
  const timer = useRef<number | null>(null);

  // typing sound
  const sound = useRef<Howl | null>(null);

  useEffect(() => {
    // reset
    setOut("");
    idx.current = 0;

    // create local typing sound instance
    sound.current = new Howl({
      src: ["/typing.mp3"],
      volume: 0.20, // softer than welcome banner
      preload: true,
    });

    function step() {
      if (idx.current >= text.length) {
        sound.current?.stop();
        return;
      }

      const ch = text[idx.current++];
      setOut((p) => p + ch);

      // synced sound
      if (ch !== " " && sound.current) {
        if (!sound.current.playing()) {
          sound.current.seek(0);
          sound.current.play();
        }
      }

      timer.current = window.setTimeout(step, ch === " " ? 25 : 40);
    }

    timer.current = window.setTimeout(step, 40);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      sound.current?.stop();
    };
  }, [text]);

  return <span>{out}</span>;
}

/* ----------------------------------------
   MAIN CAMPFIRE
   ---------------------------------------- */
export default function Campfire() {
  const [line, setLine] = useState("Warming the flames…");
  const [rarity, setRarity] = useState("common");
  const [processingAuto, setProcessingAuto] = useState(false);

  useEffect(() => {
    const last = loadMemory("last_whisper");
    if (last?.text) {
      setLine(last.text);
      setRarity(last.rarity ?? "common");
    }
  }, []);

  function receiveWhisper(text: string, rarity: string, tags?: string[]) {
    const payload = { text, rarity, tags, at: new Date().toISOString() };
    saveMemory("last_whisper", payload);
    const hist = loadMemory<any[]>("whisper_history") ?? [];
    hist.unshift(payload);
    saveMemory("whisper_history", hist.slice(0, 200));

    if (rarity === "rare") addWarmth(3);
    if (rarity === "divine") addWarmth(7);
    if (rarity === "destiny") addWarmth(10);

    try { evaluateBlessings(); } catch {}

    setLine(text);
    setRarity(rarity);
  }

  useEffect(() => {
    function onWh(e: any) {
      const d = e.detail ?? {};
      if (d?.text) receiveWhisper(d.text, d.rarity ?? "common", d.tags);
    }

    async function onAuto() {
      if (processingAuto) return;
      setProcessingAuto(true);

      try {
        const res = await fetch("/api/generate-rare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seed: "auto" }),
        });
        if (!res.ok) throw new Error();

        const j = await res.json();
        receiveWhisper(j.text ?? j.story ?? "The ember glows softly for you.", "common");
      } catch {
        receiveWhisper("The ember glows softly for you.", "common");
      } finally {
        setProcessingAuto(false);
      }
    }

    function onRest() {
      receiveWhisper("“In the warmth of the fire, your spirit finds rest.", "rare");
    }

    window.addEventListener("campfire:whisper", onWh as EventListener);
    window.addEventListener("campfire:auto-whisper", onAuto as EventListener);
    window.addEventListener("campfire:rest", onRest as EventListener);

    return () => {
      window.removeEventListener("campfire:whisper", onWh as EventListener);
      window.removeEventListener("campfire:auto-whisper", onAuto as EventListener);
      window.removeEventListener("campfire:rest", onRest as EventListener);
    };
  }, [processingAuto]);

  return (
    <>
      <AmbientAudio />
      <div className="flex flex-col items-center gap-8 z-20">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.82] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-72 h-72 rounded-full bg-orange-500/60 blur-3xl shadow-[0_0_120px_rgba(255,100,30,0.7)]"
        />

        {/* TYPED WHISPER (new) */}
        <motion.div
          key={line}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className={`text-center text-xl max-w-xl leading-relaxed italic ${
            rarity === "divine"
              ? "text-amber-200 ring-2 ring-amber-300/40 p-4 rounded-xl"
              : "text-white/90"
          }`}
        >
          <TypedWhisper text={line} />
        </motion.div>

        <div className="flex gap-3 items-center">
  <RestButton />

  {/* Call the Spirit (SpiritEngine) */}
  <SpiritEngine
    onWhisper={(w) =>
      receiveWhisper(w.text, w.rarity ?? "common", w.tags)
    }
  />

  {/* 🔥 Burden Release restored */}
  <BurdenRelease
    onRelease={() =>
      receiveWhisper(
        "The fire accepts what you release.",
        "rare"
      )
    }
  />
</div>


      </div>
    </>
  );
}
