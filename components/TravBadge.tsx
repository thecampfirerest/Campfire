"use client";
import { useEffect, useState } from "react";
import { loadMemory } from "@/lib/memoryClient";

export default function TravBadge() {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const [rest, setRest] = useState(0);
  const [warmth, setWarmth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("traventurer_name");
      if (storedName) setName(storedName);

      const storedRest = loadMemory("rest_count");
      const storedWarmth = loadMemory("inner_warmth");

      if (typeof storedRest === "number") setRest(storedRest);
      if (typeof storedWarmth === "number") setWarmth(storedWarmth);
    }

    // 🔥 Listen for live Rest updates
    function onRest(e: any) {
      if (e.detail?.restCount !== undefined) {
        setRest(e.detail.restCount);
      }
    }

    // 🔥 Listen for live Warmth updates
    function onWarmth(e: any) {
      if (e.detail?.warmth !== undefined) {
        setWarmth(e.detail.warmth);
      }
    }

    window.addEventListener("rest:update", onRest);
    window.addEventListener("warmth:update", onWarmth);

    return () => {
      window.removeEventListener("rest:update", onRest);
      window.removeEventListener("warmth:update", onWarmth);
    };
  }, []);

  function saveName() {
    localStorage.setItem("traventurer_name", name.trim());
    setEditing(false);
  }

  return (
    <div className="text-white/70 text-xs p-3 border rounded-xl bg-black/20 w-40">

      {/* NAME + EDIT BUTTON */}
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold text-white">
          {name?.trim() ? `Traventurer ${name.trim()}` : "Traventurer"}
        </div>

        <button
          onClick={() => setEditing(true)}
          className="text-white/50 hover:text-white text-[10px]"
        >
          ✏️
        </button>
      </div>

      {/* NAME EDIT FIELD */}
      {editing && (
        <div className="flex items-center gap-1 mb-2">
          <input
            className="bg-black/40 border border-white/20 rounded px-1 py-0.5 text-white text-xs w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
          />
          <button
            onClick={saveName}
            className="text-green-400 text-xs px-1"
          >
            ✔
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-red-400 text-xs px-1"
          >
            ✖
          </button>
        </div>
      )}

      <div>Rests: {rest}</div>
      <div>Warmth: {warmth}</div>
    </div>
  );
}
