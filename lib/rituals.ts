// /lib/rituals.ts
import { loadMemory, saveMemory } from "./memoryClient";
import { addWarmth } from "./innerWarmth";
import { evaluateBlessings } from "./blessings";

type RitualDef = {
  id: string;
  title: string;
  description?: string; // FIXED: optional
  cooldownHours: number;
  warmth: number;
  type?: "simple" | "input" | "guided"; // FIXED: optional
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
  const time = new Date().toISOString();
  saveMemory<string>(`ritual_last_${ritual.id}`, time);

  const hist = loadMemory<any[]>("ritual_history") ?? [];
  hist.unshift({ id: ritual.id, at: time, payload });
  saveMemory("ritual_history", hist.slice(0, 200));

  if (ritual.warmth) addWarmth(ritual.warmth);

  try { evaluateBlessings(); } catch {}

  try {
    if ((window as any).playRestChime) {
      try { (window as any).playRestChime(); } catch {}
    }

    if ((window as any).playRitualChime) {
      try { (window as any).playRitualChime(); } catch {}
    }

    if (ritual.tags?.includes("divine") && (window as any).playDivineChime) {
      try { (window as any).playDivineChime(); } catch {}
    }
  } catch {}

  try {
    window.dispatchEvent(
      new CustomEvent("ritual:update", { detail: { id: ritual.id, at: time } })
    );
  } catch {}

  return { ok: true };
}
