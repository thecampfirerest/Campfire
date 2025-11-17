"use client";
import { useEffect, useState } from "react";
import { getOrCreateTravId } from "@/lib/traventurer";
import { loadMemory } from "@/lib/memoryClient";

export default function TravBadge() {
  const [id, setId] = useState("");
  const [rest, setRest] = useState(0);

  useEffect(() => {
    setId(getOrCreateTravId());
    setRest(loadMemory<number>("rest_count") ?? 0);
  }, []);

  return (
    <div className="absolute top-6 left-6 bg-black/40 border border-white/10 p-3 rounded-xl text-xs text-white/80 backdrop-blur-sm z-40">
      <div className="font-mono text-xxs text-white/60">traventurer id</div>
      <div className="mt-1 break-all text-sm font-mono">{id}</div>
      <div className="mt-2 text-xs">rests: {rest}</div>
    </div>
  );
}
