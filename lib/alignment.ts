import { loadMemory } from "./memoryClient";
import { getWarmth } from "./innerWarmth";

export function getAlignment() {
  const warmth = getWarmth();
  const hist = loadMemory<any[]>("whisper_history") ?? [];
  const destiny = hist.some((w) => w.rarity === "destiny");
  const burdens = (loadMemory<any[]>("burden_history") ?? []).length;
  const rest = loadMemory<number>("rest_count") ?? 0;

  const score =
    warmth * 0.3 +
    rest * 0.1 +
    burdens * 0.05 +
    (destiny ? 40 : 0);

  if (score >= 200) return "ascended";
  if (score >= 100) return "glowing";
  if (score >= 40) return "warm";
  return "flickering";
}
