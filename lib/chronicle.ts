// /lib/chronicle.ts
import { loadMemory } from "./memoryClient";

export function buildChronicle() {
  const travId = loadMemory("traventurer_id_v1") ?? "anon";
  const warmth = loadMemory("inner_warmth") ?? 0;
  const history = loadMemory("whisper_history") ?? [];
  const rituals = loadMemory("ritual_history") ?? [];
  const burdens = loadMemory("burden_history") ?? [];
  const blessings = loadMemory("blessings") ?? [];
  const covenant = loadMemory("covenant") ?? null;
  const badges = loadMemory("badges") ?? [];

  const chron = {
    travId,
    warmth,
    totals: { whispers: history.length, rituals: rituals.length, burdens: burdens.length, blessings: blessings.length, badges: badges.length },
    covenant,
    history,
    rituals,
    burdens,
    blessings,
    badges,
    generatedAt: new Date().toISOString()
  };

  return chron;
}

export function exportChronicleAsText() {
  const c = buildChronicle();
  let out = `Pilgrim's Chronicle — Generated ${c.generatedAt}\n\n`;
  out += `Traventurer: ${c.travId}\nInner Warmth: ${c.warmth}\n\nTotals: ${JSON.stringify(c.totals, null, 2)}\n\n`;
  out += `Covenant:\n${c.covenant ? JSON.stringify(c.covenant, null, 2) : "— none —"}\n\n`;
  out += `Recent whispers:\n`;
  c.history.slice(0, 20).forEach((h:any,i:number)=> out += `${i+1}. [${h.rarity}] ${h.text}\n`);
  out += `\nRituals:\n` + JSON.stringify(c.rituals.slice(0,20), null, 2) + `\n\nBurdens:\n` + JSON.stringify(c.burdens.slice(0,20), null, 2) + `\n\nBlessings:\n` + JSON.stringify(c.blessings, null, 2) + `\n\nBadges:\n` + JSON.stringify(c.badges, null, 2);
  return out;
}
