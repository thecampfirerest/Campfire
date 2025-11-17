import { loadMemory, saveMemory } from "./memoryClient";

export function getWarmth() {
  return loadMemory<number>("inner_warmth") ?? 0;
}

export function addWarmth(amount: number) {
  const prev = getWarmth();
  const now = prev + amount;
  saveMemory("inner_warmth", now);

  const milestones = [20, 50, 100, 200, 400, 777];
  const badges = loadMemory<any[]>("badges") ?? [];

  milestones.forEach((m) => {
    if (now >= m && !badges.find((b) => b.id === `warmth_${m}`)) {
      badges.push({ id: `warmth_${m}`, when: new Date().toISOString() });
    }
  });

  saveMemory("badges", badges);
  return now;
}
