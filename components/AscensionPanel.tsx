"use client";
import { useEffect, useState } from "react";
import { getWarmth } from "@/lib/innerWarmth";
import { exportChronicleAsText } from "@/lib/chronicle";
import { saveMemory } from "@/lib/memoryClient";

export default function AscensionPanel() {
  const [warmth, setWarmth] = useState(0);
  const [ascended, setAscended] = useState(false);

  useEffect(() => {
    const w = getWarmth();
    setWarmth(w);
    setAscended(w >= 777);
  }, []);

  return (
    <div className="text-white text-sm space-y-3">
      <div>Inner Warmth: {warmth}</div>
      {!ascended ? (
        <button
          onClick={() => {
            saveMemory("ascended_at", new Date().toISOString());
            setAscended(true);
          }}
          disabled={warmth < 777}
          className={`px-3 py-1 rounded ${
            warmth >= 777
              ? "bg-amber-500/30"
              : "bg-white/10 opacity-50 cursor-not-allowed"
          }`}
        >
          Ascend
        </button>
      ) : (
        <button
          onClick={() =>
            navigator.clipboard.writeText(exportChronicleAsText())
          }
          className="px-3 py-1 bg-white/10 rounded"
        >
          Export Chronicle
        </button>
      )}
    </div>
  );
}
