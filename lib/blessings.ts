// /lib/blessings.ts
import { loadMemory, saveMemory, grantBadge } from "./memoryClient";
import { addWarmth } from "./innerWarmth";

export function listBlessings() {
  return loadMemory<any[]>("blessings") ?? [];
}

export function grantBlessing(id: string, meta?: any) {
  const bs = listBlessings();
  if (!bs.find(b=>b.id===id)) {
    bs.push({ id, when: new Date().toISOString(), meta });
    saveMemory("blessings", bs);
    grantBadge(`blessing_${id}`);
    // blessings give warmth
    if (meta?.warmth) addWarmth(meta.warmth);
  }
}

export function hasBlessing(id: string) {
  return !!listBlessings().find(b=>b.id===id);
}
