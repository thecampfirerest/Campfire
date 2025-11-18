"use client";
import React, { useEffect, useState } from "react";

function loadNumber(key: string) { try { return Number(localStorage.getItem(key) ?? "0"); } catch { return 0; } }

export default function TravBadge() {
  const [name, setName] = useState(localStorage.getItem("traventurer_name") ?? "Traventurer");
  const [rest, setRest] = useState(loadNumber("rest_count"));
  const [warmth, setWarmth] = useState(loadNumber("inner_warmth"));

  useEffect(() => {
    function onRest() { setRest(loadNumber("rest_count")); }
    function onWarmth() { setWarmth(loadNumber("inner_warmth")); }
    window.addEventListener("rest:update", onRest);
    window.addEventListener("warmth:update", onWarmth);
    return () => { window.removeEventListener("rest:update", onRest); window.removeEventListener("warmth:update", onWarmth); };
  }, []);

  return (
    <div className="fixed top-4 left-4 z-40 bg-black/40 border border-white/10 px-4 py-3 rounded-xl backdrop-blur-lg text-white/80 text-sm shadow-md">
      <div className="uppercase text-[10px] tracking-wide opacity-50 mb-1">Traventurer</div>
      <div className="text-lg font-semibold">{name}</div>
      <div className="opacity-70 mt-1 text-xs">Rests: {rest}</div>
      <div className="opacity-70 mt-1 text-xs">Warmth: {warmth}</div>
      <div className="mt-2">
        <button onClick={() => { const n = prompt("Name?"); if (n) { localStorage.setItem("traventurer_name", n); setName(n); } }} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">Edit</button>
      </div>
    </div>
  );
}
