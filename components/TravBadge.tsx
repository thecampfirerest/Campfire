"use client";
import { useEffect, useState } from "react";
import { loadMemory } from "@/lib/memoryClient";

export default function TravBadge() {
  const [name, setName] = useState("Traventurer");
  const [rest, setRest] = useState(0);
  const [warmth, setWarmth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // name
      const storedName = localStorage.getItem("traventurer_name");
      if (storedName) setName(storedName);

      // using your existing memory system
      const storedRest = loadMemory("rest_count");
      const storedWarmth = loadMemory("inner_warmth");

      if (typeof storedRest === "number") setRest(storedRest);
      if (typeof storedWarmth === "number") setWarmth(storedWarmth);
    }
  }, []);

  return (
    <div className="text-white/70 text-xs p-3 border rounded-xl bg-black/20 w-32">
      <div className="font-semibold text-white">{name}</div>
      <div>Rests: {rest}</div>
      <div>Warmth: {warmth}</div>
    </div>
  );
}
