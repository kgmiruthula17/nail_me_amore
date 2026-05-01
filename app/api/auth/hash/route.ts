import { NextResponse } from "next/server";
import { hashPassword } from "../../../lib/auth";

/**
 * POST /api/auth/hash
 * Dev-only utility to generate bcrypt hashes.
 * Disabled in production.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 }
    );
  }

  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const hash = await hashPassword(password);
    return NextResponse.json({ hash });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate hash" },
      { status: 500 }
    );
  }
}
