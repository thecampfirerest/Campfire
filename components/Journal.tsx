"use client";
import { useState, useEffect } from "react";
import { loadMemory, saveMemory } from "@/lib/memoryClient";

export default function Journal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    setEntries(loadMemory("journal_entries") ?? []);
  }, []);

  function add() {
    if (!text.trim()) return;
    const next = [{ text, at: new Date().toISOString() }, ...entries];
    setEntries(next);
    saveMemory("journal_entries", next);
    setText("");
  }

  return (
    <div className="text-white text-sm space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-24 bg-black/30 border border-white/10 rounded p-2"
        placeholder="A prayer, a note, or a small thanks..."
      />
      <div className="flex gap-2">
        <button onClick={add} className="px-3 py-1 bg-amber-500/30 rounded">
          Add
        </button>
        <button
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(entries, null, 2))
          }
          className="px-3 py-1 bg-white/10 rounded"
        >
          Export
        </button>
      </div>

      <div className="max-h-56 overflow-auto text-xs space-y-2">
        {entries.length === 0 && (
          <div className="text-white/50">No entries yet.</div>
        )}
        {entries.map((e, i) => (
          <div key={i}>
            <div className="text-white/60">
              {new Date(e.at).toLocaleString()}
            </div>
            <div>{e.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
