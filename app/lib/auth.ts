import { createHmac, randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// ─── Password Hashing ───────────────────────────────────────────────────────

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ─── Session Store (in-memory) ──────────────────────────────────────────────

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

interface Session {
  id: string;
  createdAt: number;
  expiresAt: number;
}

const sessionStore = new Map<string, Session>();

export function createSession(): string {
  const id = randomUUID();
  const now = Date.now();
  sessionStore.set(id, {
    id,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
  return id;
}

export function validateSession(sessionId: string): boolean {
  const session = sessionStore.get(sessionId);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessionStore.delete(sessionId);
    return false;
  }
  return true;
}

export function destroySession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

// ─── Cookie Signing (HMAC-SHA256) ───────────────────────────────────────────

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return secret;
}

export function signCookie(value: string): string {
  const secret = getAuthSecret();
  const signature = createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${signature}`;
}

export function verifyCookie(signed: string): string | null {
  const secret = getAuthSecret();
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;

  const value = signed.substring(0, lastDot);
  const signature = signed.substring(lastDot + 1);

  const expected = createHmac("sha256", secret).update(value).digest("hex");

  // Constant-time comparison
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(signature, expected)
  ) {
    return null;
  }

  return value;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ─── Request Verification ───────────────────────────────────────────────────

const ADMIN_COOKIE_NAME = "admin_session";

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME;
}

/**
 * Verify that a request has a valid admin session.
 * Works with the standard Request object used in Route Handlers.
 */
export function verifySession(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  const cookies = parseCookies(cookieHeader);
  const signedValue = cookies[ADMIN_COOKIE_NAME];
  if (!signedValue) return false;

  const sessionId = verifyCookie(signedValue);
  if (!sessionId) return false;

  return validateSession(sessionId);
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (name) {
      cookies[name.trim()] = decodeURIComponent(rest.join("=").trim());
    }
  });
  return cookies;
}
