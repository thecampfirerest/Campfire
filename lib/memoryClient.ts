const PREFIX = "campfire_memory_v1_";

export function saveMemory<T = any>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    PREFIX + key,
    JSON.stringify({ value, createdAt: new Date().toISOString() })
  );
}

export function loadMemory<T = any>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PREFIX + key);
  if (!raw) return null;
  try {
    return JSON.parse(raw).value as T;
  } catch {
    return null;
  }
}

export function listMemoryKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k.replace(PREFIX, ""));
  }
  return keys;
}

export function grantBadge(id: string, meta?: any) {
  const badges = loadMemory<any[]>("badges") ?? [];
  const exists = badges.find((b) => b.id === id);
  if (!exists) {
    badges.push({ id, when: new Date().toISOString(), meta });
    saveMemory("badges", badges);
  }
}

export function listBadges() {
  return loadMemory<any[]>("badges") ?? [];
}
