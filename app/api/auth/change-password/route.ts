import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyPassword,
  hashPassword,
  verifyCookie,
  validateSession,
  getAdminCookieName,
} from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

const COOKIE_NAME = getAdminCookieName();

/**
 * POST /api/auth/change-password
 * Changes the admin password. Requires an active session.
 */
export async function POST(request: Request) {
  try {
    // Verify session
    const cookieStore = await cookies();
    const signedValue = cookieStore.get(COOKIE_NAME)?.value;

    if (!signedValue) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const sessionId = verifyCookie(signedValue);
    if (!sessionId || !validateSession(sessionId)) {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Both current and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Get current password hash (DB first, then env)
    let currentHash: string;
    try {
      const setting = await prisma.setting.findUnique({
        where: { key: "admin_password_hash" },
      });
      currentHash = setting?.value || process.env.ADMIN_PASSWORD_HASH || "";
    } catch {
      currentHash = process.env.ADMIN_PASSWORD_HASH || "";
    }
    
    currentHash = currentHash.replace(/^['"]|['"]$/g, '');

    if (!currentHash) {
      return NextResponse.json(
        { success: false, message: "Password configuration error" },
        { status: 500 }
      );
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, currentHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password and store in DB
    const newHash = await hashPassword(newPassword);

    await prisma.setting.upsert({
      where: { key: "admin_password_hash" },
      update: { value: newHash },
      create: { key: "admin_password_hash", value: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
