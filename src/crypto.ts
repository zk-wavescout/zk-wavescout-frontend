export interface EncryptedPayload {
  ciphertext: string; // base64
  iv: string;         // base64
  authTag: string;    // base64 (last 16 bytes of GCM output)
}

/** Derive a 256-bit AES key from a shared secret string via SHA-256. */
async function deriveKey(secret: string): Promise<CryptoKey> {
  const raw = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encrypt(plaintext: string, secret: string): Promise<EncryptedPayload> {
  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  // GCM appends 16-byte auth tag at end of ciphertext
  const full = new Uint8Array(cipherBuf);
  const ciphertext = full.slice(0, full.length - 16);
  const authTag = full.slice(full.length - 16);

  return {
    ciphertext: btoa(String.fromCharCode(...ciphertext)),
    iv: btoa(String.fromCharCode(...iv)),
    authTag: btoa(String.fromCharCode(...authTag)),
  };
}

export async function decrypt(payload: EncryptedPayload, secret: string): Promise<string> {
  const key = await deriveKey(secret);
  const iv = Uint8Array.from(atob(payload.iv), (c) => c.charCodeAt(0));
  const cipher = Uint8Array.from(atob(payload.ciphertext), (c) => c.charCodeAt(0));
  const tag = Uint8Array.from(atob(payload.authTag), (c) => c.charCodeAt(0));
  const combined = new Uint8Array([...cipher, ...tag]);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined);
  return new TextDecoder().decode(plain);
}
