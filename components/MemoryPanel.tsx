"use client";
import { useEffect, useState } from "react";
import { listMemoryKeys, loadMemory } from "@/lib/memoryClient";

export default function MemoryPanel() {
  const [keys, setKeys] = useState<string[]>([]);
  const [last, setLast] = useState<any>(null);

  useEffect(() => {
    setKeys(listMemoryKeys());
    setLast(loadMemory("last_whisper"));
  }, []);

  return (
    <div className="text-sm text-white space-y-3">
      <div className="text-xs text-white/60">Keys: {keys.length}</div>

      {last ? (
        <div className="bg-black/20 p-3 rounded">
          <div className="text-xs text-white/60">Last whisper</div>
          <div className="mt-1">
            <div className="font-medium text-amber-200">{last.text}</div>
            <div className="text-xxs text-white/60 mt-1">Rarity: {last.rarity ?? "common"}</div>
            <div className="text-xxs text-white/60">
              Time: {last.at ? new Date(last.at).toLocaleString() : "—"}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white/50">No memory recorded yet.</div>
      )}
    </div>
  );
}
