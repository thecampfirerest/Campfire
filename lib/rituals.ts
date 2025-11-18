// /lib/rituals.ts
import { loadMemory, saveMemory } from "./memoryClient";
import { addWarmth } from "./innerWarmth";
import { evaluateBlessings } from "./blessings";

type RitualDef = {
  id: string;
  title: string;
  description: string;
  cooldownHours: number;
  warmth: number;
  type: "simple" | "input" | "guided";
  unlockWarmth?: number;
  tags?: string[];
};

export async function loadRituals(): Promise<{ rituals: RitualDef[]; scripturePrompts: any[] }> {
  const res = await fetch("/rituals.json");
  return res.json();
}

export function lastPerformed(ritualId: string): string | null {
  return loadMemory<string>(`ritual_last_${ritualId}`);
}

export function canPerform(ritual: RitualDef): boolean {
  const last = lastPerformed(ritual.id);
  if (!last) return true;
  const lastDate = new Date(last);
  const now = new Date();
  const deltaH = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
  return deltaH >= (ritual.cooldownHours || 0);
}

export function performRitual(ritual: RitualDef, payload?: any) {
  saveMemory(`ritual_last_${ritual.id}`, new Date().toISOString());

  const hist = loadMemory<any[]>("ritual_history") ?? [];
  hist.unshift({ id: ritual.id, at: new Date().toISOString(), payload });
  saveMemory("ritual_history", hist.slice(0, 200));

  if (ritual.warmth) addWarmth(ritual.warmth);

  // Evaluate blessings after rituals (progression)
  try { evaluateBlessings(); } catch {}

  return { ok: true };
}
