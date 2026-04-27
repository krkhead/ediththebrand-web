// Edge Runtime compatible session reading — uses Web Crypto (crypto.subtle), not node:crypto.
// Import this file in proxy.ts (middleware). Use lib/admin-auth.ts everywhere else.
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "etb_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

const adminEmail = process.env.ADMIN_EMAIL?.trim() || "editholufestus@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD?.trim() || "";
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim() || "";
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() || "";

export const adminAuth = {
  enabled:
    adminSessionSecret.length > 0 &&
    (adminPassword.length > 0 || adminPasswordHash.length > 0),
  email: adminEmail,
  cookieName: ADMIN_SESSION_COOKIE,
  maxAge: ADMIN_SESSION_MAX_AGE,
} as const;

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(adminSessionSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

async function readAdminSessionValue(value?: string | null) {
  if (!value || !adminAuth.enabled) return null;

  const dotIndex = value.indexOf(".");
  if (dotIndex === -1) return null;

  const encodedPayload = value.slice(0, dotIndex);
  const signature = value.slice(dotIndex + 1);

  let payload: string;
  try {
    payload = new TextDecoder().decode(base64UrlToBytes(encodedPayload));
  } catch {
    return null;
  }

  try {
    const key = await getHmacKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature),
      new TextEncoder().encode(payload)
    );
    if (!valid) return null;
  } catch {
    return null;
  }

  try {
    const session = JSON.parse(payload) as { email: string; expiresAt: number };
    if (
      session.email !== adminAuth.email ||
      !session.expiresAt ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  return readAdminSessionValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
