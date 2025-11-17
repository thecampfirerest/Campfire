"use client";
import { useEffect, useState } from "react";
import { loadSeasonData, detectSeason, getUserSeasonOverride, setUserSeasonOverride } from "@/lib/seasons";
import { saveMemory, loadMemory } from "@/lib/memoryClient";

export default function SeasonalManager({ onSeasonChange }: { onSeasonChange?: (s:any)=>void }) {
  const [season, setSeason] = useState<any>(null);
  const [override, setOverride] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await loadSeasonData();
      const o = getUserSeasonOverride();
      setOverride(o);
      const s = o ? (await loadSeasonData()).seasons.find((x:any)=>x.id===o) : detectSeason();
      setSeason(s);
      onSeasonChange?.(s);
    })();
  }, []);

  function applyOverride(id: string | null) {
    setUserSeasonOverride(id);
    setOverride(id);
    const s = id ? (_seasonFind(id)) : detectSeason();
    setSeason(s);
    onSeasonChange?.(s);
  }

  function _seasonFind(id: string) {
    // load cache quickly
    // @ts-ignore
    const seasons = (window as any)._season_cache ?? null;
    // fallback loadSeasonData
    return (id && seasons ? seasons.find((x:any)=>x.id===id) : null) ?? null;
  }

  if (!season) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-black/30 border border-white/6 p-2 rounded-xl text-xs text-white/90">
      <div className="font-medium">{season.name}</div>
      <div className="text-xxs text-white/70">{season.description}</div>
      <div className="mt-1 flex gap-2">
        <button onClick={() => applyOverride(null)} className="px-2 py-1 rounded bg-white/6 text-xxs">Auto</button>
        <button onClick={() => applyOverride("spring")} className="px-2 py-1 rounded bg-white/6 text-xxs">Spring</button>
        <button onClick={() => applyOverride("summer")} className="px-2 py-1 rounded bg-white/6 text-xxs">Summer</button>
        <button onClick={() => applyOverride("autumn")} className="px-2 py-1 rounded bg-white/6 text-xxs">Autumn</button>
        <button onClick={() => applyOverride("winter")} className="px-2 py-1 rounded bg-white/6 text-xxs">Winter</button>
      </div>
    </div>
  );
}
