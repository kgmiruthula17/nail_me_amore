import { createHmac, randomUUID } from "crypto";
import { cookies } from "next/headers";
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

// ─── Stateless Session Tokens ───────────────────────────────────────────────
// Session data is encoded directly in the signed cookie value as:
//   `sessionId:expiresAtTimestamp`
// The HMAC signature prevents tampering. No server-side state is needed,
// which is critical for serverless platforms like Netlify where each request
// can hit a different function instance with its own memory.

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Create a session token string containing the session ID and expiry.
 * This token will be signed and stored in a cookie.
 */
export function createSession(): string {
  const id = randomUUID();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return `${id}:${expiresAt}`;
}

/**
 * Validate a session token by checking its expiry timestamp.
 * The token has already been verified via HMAC signature by verifyCookie(),
 * so we only need to check if it has expired.
 */
export function validateSession(sessionToken: string): boolean {
  const parts = sessionToken.split(":");
  if (parts.length < 2) return false;

  const expiresAt = parseInt(parts[parts.length - 1], 10);
  if (isNaN(expiresAt)) return false;

  return Date.now() < expiresAt;
}

/**
 * Destroy a session. With stateless tokens this is a no-op on the server side.
 * The cookie is deleted by the caller.
 */
export function destroySession(_sessionToken: string): void {
  // Stateless — nothing to clean up server-side.
  // The cookie deletion in the route handler is what actually ends the session.
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
 * Verify that the current request has a valid admin session.
 * Uses Next.js cookies() API which works reliably on serverless platforms.
 */
export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const signedValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!signedValue) return false;

    const sessionToken = verifyCookie(signedValue);
    if (!sessionToken) return false;

    return validateSession(sessionToken);
  } catch {
    return false;
  }
}

