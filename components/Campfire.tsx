"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { saveMemory, loadMemory, grantBadge } from "@/lib/memoryClient";
import { addWarmth } from "@/lib/innerWarmth";
import BurdenRelease from "./BurdenRelease";
import SpiritEngine from "./SpiritEngine";

export default function Campfire() {
  const [line, setLine] = useState("Warming the flames…");
  const [rarity, setRarity] = useState("common");

  useEffect(() => {
    const last = loadMemory("last_whisper");
    if (last?.text) {
      setLine(last.text);
      setRarity(last.rarity ?? "common");
    }
  }, []);

  function receiveWhisper(text: string, rarity: string, tags?: string[]) {
    const restPrev = loadMemory<number>("rest_count") ?? 0;
    const rest = restPrev + 1;
    saveMemory("rest_count", rest);

    const payload = {
      text,
      rarity,
      tags,
      at: new Date().toISOString(),
    };

    saveMemory("last_whisper", payload);

    const hist = loadMemory<any[]>("whisper_history") ?? [];
    hist.unshift(payload);
    saveMemory("whisper_history", hist.slice(0, 200));

    if (rarity === "rare") addWarmth(3);
    if (rarity === "divine") addWarmth(7);
    if (rarity === "destiny") addWarmth(10);

    if (rest === 1) grantBadge("Rested");

    setLine(text);
    setRarity(rarity);
  }

  return (
    <div className="flex flex-col items-center gap-8 z-20 select-none">
      <motion.div
        animate={{ scale: [1, 1.07, 1], opacity: [0.7, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-72 h-72 rounded-full bg-orange-500/60 blur-3xl shadow-[0_0_120px_rgba(255,100,30,0.7)]"
      />

      <motion.div
        key={line}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className={`text-center text-xl max-w-xl leading-relaxed italic tracking-wide drop-shadow-lg ${
          rarity === "divine" || rarity === "destiny"
            ? "text-amber-200 ring-2 ring-amber-300/40 p-4 rounded-xl shadow-[0_0_25px_rgba(255,200,120,0.45)]"
            : "text-white/90"
        }`}
      >
        {line}
      </motion.div>

      <button
        onClick={() => {
           receiveWhisper(
              "You rest by the fire. Its warmth settles into your spirit.",
              "common"
  );
}}

        className="px-7 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-lg transition shadow-lg"
      >
        ✨ Rest
      </button>

      <SpiritEngine
        onWhisper={(w) =>
          receiveWhisper(w.text, w.rarity ?? "common", w.tags)
        }
      />

      <BurdenRelease onRelease={() => receiveWhisper("The fire accepts what you release.", "rare")} />
    </div>
  );
}
