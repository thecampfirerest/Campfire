// /lib/blessings.ts
import { loadMemory, saveMemory, grantBadge } from "./memoryClient";
import { getWarmth } from "./innerWarmth";

/**
 * Blessings progression system
 * - Blessings stored in memory key "blessings" as [{id, when, meta}]
 * - evaluateBlessings() checks conditions and grants blessings when met
 */

export function listBlessings() {
  return loadMemory<any[]>("blessings") ?? [];
}

export function saveBlessings(bs: any[]) {
  saveMemory("blessings", bs);
}

export function grantBlessing(id: string, meta?: any) {
  const bs = listBlessings();
  if (!bs.find((b) => b.id === id)) {
    const item = { id, when: new Date().toISOString(), meta: meta ?? {} };
    bs.push(item);
    saveBlessings(bs);
    grantBadge(`blessing_${id}`);
  }
}

export function hasBlessing(id: string) {
  return !!listBlessings().find((b) => b.id === id);
}

export function evaluateBlessings() {
  // Check conditions and grant blessings accordingly
  try {
    const restCount = loadMemory<number>("rest_count") ?? 0;
    const ritualHist = loadMemory<any[]>("ritual_history") ?? [];
    const whisperHist = loadMemory<any[]>("whisper_history") ?? [];
    const covenant = loadMemory<any>("covenant") ?? null;
    const warmth = getWarmth();

    // Blessing of Rest: after 3 rests
    if (restCount >= 3 && !hasBlessing("rest_blessing")) {
      grantBlessing("rest_blessing", { warmth: 10, reason: "3 rests" });
    }

    // Blessing of Strength: after 5 rituals performed
    if (ritualHist.length >= 5 && !hasBlessing("strength_blessing")) {
      grantBlessing("strength_blessing", { warmth: 15, reason: "5 rituals" });
    }

    // Blessing of Clarity: after first divine whisper recorded
    if (whisperHist.some((w) => w.rarity === "divine") && !hasBlessing("clarity_blessing")) {
      grantBlessing("clarity_blessing", { warmth: 12, reason: "first divine whisper" });
    }

    // Blessing of Covenant: when covenant exists
    if (covenant && !hasBlessing("covenant_blessing")) {
      grantBlessing("covenant_blessing", { warmth: 20, reason: "created covenant" });
    }

    // Blessing of Journey: warmth milestone 111
    if (warmth >= 111 && !hasBlessing("journey_blessing")) {
      grantBlessing("journey_blessing", { warmth: 25, reason: "warmth 111" });
    }

    // Blessing of Ascension handled elsewhere when user ascends (777)
  } catch (err) {
    // fail silently
    console.warn("evaluateBlessings failed", err);
  }
}
