// /lib/cryptoClient.ts
// Simple WebCrypto helpers (AES-GCM). Use for encrypting personal notes before sending to server.
const enc = new TextEncoder();
const dec = new TextDecoder();

export async function deriveKeyFromPassword(password: string, saltStr = "campfire_salt_v1") {
  const salt = enc.encode(saltStr);
  const pwKey = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    pwKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
}

export async function encryptWithKey(key: CryptoKey, plaintext: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  const combined = new Uint8Array(iv.byteLength + ct.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ct), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptWithKey(key: CryptoKey, b64: string) {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const ct = raw.slice(12);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return dec.decode(pt);
}
