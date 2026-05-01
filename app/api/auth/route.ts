import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyPassword,
  createSession,
  signCookie,
  verifyCookie,
  validateSession,
  destroySession,
  getAdminCookieName,
} from "../../lib/auth";
import { checkRateLimit, resetRateLimit } from "../../lib/rateLimit";
import { prisma } from "../../lib/prisma";

const COOKIE_NAME = getAdminCookieName();
const SESSION_DURATION_S = 8 * 60 * 60; // 8 hours in seconds

/**
 * Get the admin password hash.
 * Checks DB (Setting table) first, falls back to env var.
 */
async function getPasswordHash(): Promise<string> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "admin_password_hash" },
    });
    if (setting?.value) return setting.value.replace(/^['"]|['"]$/g, '');
  } catch {
    // Setting table might not exist yet — fall back to env
  }

  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (!envHash) {
    throw new Error("ADMIN_PASSWORD_HASH environment variable is not set");
  }
  return envHash.replace(/^['"]|['"]$/g, '');
}

// ─── POST /api/auth — Login ─────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    const rateCheck = checkRateLimit(ip);
    if (rateCheck.limited) {
      const retryAfterSec = Math.ceil((rateCheck.retryAfterMs || 0) / 1000);
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    const storedHash = await getPasswordHash();
    console.log("[DEBUG] Password provided:", password);
    console.log("[DEBUG] Stored Hash:", storedHash);
    console.log("[DEBUG] Stored Hash Length:", storedHash.length);
    
    const isValid = await verifyPassword(password, storedHash);
    console.log("[DEBUG] Password Valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid credentials",
          debug: {
            password,
            storedHash,
            storedHashLength: storedHash.length
          }
        },
        { status: 401 }
      );
    }

    // Successful login — reset rate limit and create session
    resetRateLimit(ip);
    const sessionId = createSession();
    const signedValue = signCookie(sessionId);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, signedValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_S,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── GET /api/auth — Session Check ──────────────────────────────────────────

export async function GET() {
  try {
    const cookieStore = await cookies();
    const signedValue = cookieStore.get(COOKIE_NAME)?.value;

    if (!signedValue) {
      return NextResponse.json({ authenticated: false });
    }

    const sessionId = verifyCookie(signedValue);
    if (!sessionId || !validateSession(sessionId)) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

// ─── DELETE /api/auth — Logout ──────────────────────────────────────────────

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const signedValue = cookieStore.get(COOKIE_NAME)?.value;

    if (signedValue) {
      const sessionId = verifyCookie(signedValue);
      if (sessionId) {
        destroySession(sessionId);
      }
    }

    cookieStore.delete(COOKIE_NAME);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
