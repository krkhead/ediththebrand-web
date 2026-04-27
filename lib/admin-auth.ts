import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "etb_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

const adminEmail = process.env.ADMIN_EMAIL?.trim() || "editholufestus@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD?.trim() || "";
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim() || "";
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() || "";

if (adminPassword && !adminPasswordHash) {
  console.warn("[admin-auth] ADMIN_PASSWORD is set as plaintext. Prefer ADMIN_PASSWORD_HASH (scrypt:<salt>:<hash>) for better security.");
}

type AdminSession = {
  email: string;
  expiresAt: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  return createHmac("sha256", adminSessionSecret)
    .update(payload)
    .digest("base64url");
}

function parseScryptHash(value: string) {
  if (!value.startsWith("scrypt:")) return null;

  const [, salt, hash] = value.split(":");
  if (!salt || !hash) return null;

  return { salt, hash };
}

function verifyPassword(password: string) {
  if (adminPasswordHash) {
    const parsed = parseScryptHash(adminPasswordHash);
    if (!parsed) return false;

    const derived = scryptSync(password, parsed.salt, 64).toString("hex");
    return timingSafeEqual(
      Buffer.from(derived, "hex"),
      Buffer.from(parsed.hash, "hex")
    );
  }

  if (!adminPassword) return false;
  if (password.length !== adminPassword.length) return false;

  return timingSafeEqual(
    Buffer.from(password, "utf8"),
    Buffer.from(adminPassword, "utf8")
  );
}

export const adminAuth = {
  enabled:
    adminSessionSecret.length > 0 &&
    (adminPassword.length > 0 || adminPasswordHash.length > 0),
  email: adminEmail,
  cookieName: ADMIN_SESSION_COOKIE,
  maxAge: ADMIN_SESSION_MAX_AGE,
} as const;

export function getAdminAuthDisabledReason() {
  if (!adminSessionSecret) {
    return "Missing ADMIN_SESSION_SECRET.";
  }

  if (!adminPassword && !adminPasswordHash) {
    return "Missing ADMIN_PASSWORD or ADMIN_PASSWORD_HASH.";
  }

  return null;
}

export function createAdminSessionValue(email: string) {
  const session: AdminSession = {
    email,
    expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
  };
  const payload = JSON.stringify(session);
  const signature = signPayload(payload);
  return `${base64UrlEncode(payload)}.${signature}`;
}

export function readAdminSessionValue(value?: string | null) {
  if (!value || !adminAuth.enabled) return null;

  const [encodedPayload, signature] = value.split(".");
  if (!encodedPayload || !signature) return null;

  let payload = "";
  try {
    payload = base64UrlDecode(encodedPayload);
  } catch {
    return null;
  }

  const expectedSignature = signPayload(payload);
  if (
    expectedSignature.length !== signature.length ||
    !timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(signature, "utf8")
    )
  ) {
    return null;
  }

  try {
    const session = JSON.parse(payload) as AdminSession;
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

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  return readAdminSessionValue(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export function getAdminSessionFromRequest(request: NextRequest) {
  return readAdminSessionValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

export function validateAdminCredentials(email: string, password: string) {
  return (
    adminAuth.enabled &&
    email.trim().toLowerCase() === adminAuth.email.toLowerCase() &&
    verifyPassword(password)
  );
}
