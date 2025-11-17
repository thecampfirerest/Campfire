// /lib/seasons.ts
import { loadMemory, saveMemory } from "./memoryClient";

type Season = {
  id: string;
  name: string;
  months: number[];
  colorFrom: string;
  colorTo: string;
  ambientBoost: number;
  description: string;
};

let _cache: { seasons?: Season[]; seasonalWhispers?: Record<string,string[]> } = {};

export async function loadSeasonData() {
  if (_cache.seasons) return _cache;
  const res = await fetch("/seasons.json"); 
  const j = await res.json();
  _cache.seasons = j.seasons;
  _cache.seasonalWhispers = j.seasonalWhispers;
  return _cache;
}

export function detectSeason(date = new Date()) {
  const m = date.getMonth() + 1;
  const seasons = _cache.seasons ?? null;
  if (!seasons) return null;
  return seasons.find(s => s.months.includes(m)) ?? seasons[0];
}

export function setUserSeasonOverride(seasonId: string | null) {
  saveMemory("season_override", seasonId);
}

export function getUserSeasonOverride() {
  return loadMemory<string | null>("season_override");
}
