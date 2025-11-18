"use client";
import React, { useEffect, useState } from "react";
import { loadMemory, saveMemory } from "@/lib/memoryClient";

export default function MemoryPanel() {
  const [memories, setMemories] = useState<any[]>(() => loadMemory("memories") ?? []);
  const [index, setIndex] = useState(0);
  const last = loadMemory("last_whisper") ?? null;

  useEffect(() => { setMemories(loadMemory("memories") ?? []); }, []);

  function saveCurrent() {
    if (!last) return;
    const m = loadMemory("memories") ?? [];
    m.unshift({ ...last, savedAt: new Date().toISOString() });
    saveMemory("memories", m.slice(0, 200));
    setMemories(m.slice(0, 200));
    setIndex(0);
  }
  function next() { setIndex((i) => Math.min(memories.length - 1, i + 1)); }
  function prev() { setIndex((i) => Math.max(0, i - 1)); }
  const current = memories[index];

  return (
    <div className="space-y-3 text-white text-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Memory</div>
        <div className="text-xs text-white/60">Keys: {memories.length}</div>
      </div>

      <div className="bg-white/3 p-3 rounded min-h-[140px]">
        {current ? (
          <div>
            <div className="text-xs text-white/60 mb-2">Saved: {current.savedAt ?? current.at}</div>
            <div className="whitespace-pre-wrap">{current.text ?? JSON.stringify(current)}</div>
          </div>
        ) : (
          <div className="text-white/70">No saved memories. Save last whisper to keep it.</div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={prev} className="px-3 py-1 bg-white/6 rounded" disabled={index === 0}>◀ Prev</button>
        <button onClick={next} className="px-3 py-1 bg-white/6 rounded" disabled={index >= Math.max(0, memories.length - 1)}>Next ▶</button>
        <div className="flex-1" />
        <button onClick={saveCurrent} className="px-3 py-1 bg-amber-600/30 rounded" disabled={!last}>Save Last Whisper</button>
      </div>
    </div>
  );
}
