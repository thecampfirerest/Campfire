"use client";
import { useState } from "react";
import { loadMemory, saveMemory } from "@/lib/memoryClient";
import { addWarmth } from "@/lib/innerWarmth";

export default function BurdenRelease({ onRelease }: { onRelease?: () => void }) {
  const [open, setOpen] = useState(false);
  const [burden, setBurden] = useState("");

  function release() {
    if (!burden.trim()) return;

    const history = loadMemory<any[]>("burden_history") ?? [];
    history.unshift({ burden, at: new Date().toISOString() });
    saveMemory("burden_history", history.slice(0, 200));

    addWarmth(5);

    setBurden("");
    setOpen(false);
    onRelease?.();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-sm hover:bg-white/20"
      >
        Release Burden
      </button>

      {open && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-xl w-80 text-white/90">
            <div className="mb-3">What weighs on your spirit?</div>
            <textarea
              value={burden}
              onChange={(e) => setBurden(e.target.value)}
              className="w-full h-24 bg-black/30 border border-white/10 rounded-lg p-2 mb-4"
            />
            <button
              onClick={release}
              className="px-4 py-2 bg-amber-500/30 hover:bg-amber-500/40 border border-white/10 rounded-xl"
            >
              Burn It Away
            </button>
          </div>
        </div>
      )}
    </>
  );
}
