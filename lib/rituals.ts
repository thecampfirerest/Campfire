// /lib/rituals.ts
import { loadMemory, saveMemory, grantBadge } from "@/lib/memoryClient";
import { addWarmth } from "@/lib/innerWarmth";

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
  // record performed At
  saveMemory(`ritual_last_${ritual.id}`, new Date().toISOString());

  // add to ritual history
  const hist = loadMemory<any[]>("ritual_history") ?? [];
  hist.unshift({ id: ritual.id, at: new Date().toISOString(), payload });
  saveMemory("ritual_history", hist.slice(0, 200));

  // add warmth
  if (ritual.warmth) addWarmth(ritual.warmth);

  // badges for milestones
  if (ritual.id === "gratitude_list") grantBadge("GratefulHeart");
  if (ritual.id === "burden_release") grantBadge("Lightened");

  // return a simple result
  return { ok: true };
}
