// /lib/covenant.ts
import { loadMemory, saveMemory, grantBadge } from "./memoryClient";
import { getOrCreateTravId } from "./traventurer";

export function createCovenant(data: { name?: string; promise?: string }) {
  const trav = getOrCreateTravId();
  const cov = { trav, name: data.name ?? "A Quiet Promise", promise: data.promise ?? "", createdAt: new Date().toISOString(), fulfilled: false };
  saveMemory("covenant", cov);
  grantBadge("covenant_created");
  return cov;
}

export function getCovenant() {
  return loadMemory<any>("covenant") ?? null;
}

export function fulfillCovenant(note?: string) {
  const cov = getCovenant();
  if (!cov) return null;
  cov.fulfilled = true;
  cov.fulfilledAt = new Date().toISOString();
  if (note) cov.note = note;
  saveMemory("covenant", cov);
  grantBadge("covenant_fulfilled");
  return cov;
}

export function clearCovenant() {
  saveMemory("covenant", null);
}
