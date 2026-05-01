import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac } from "crypto";

/**
 * Next.js 16 Proxy (replaces middleware.ts).
 * Protects all /admin/* routes except /admin/login.
 * 
 * NOTE: We only verify the cookie signature here (HMAC check),
 * not the session store, because the proxy and route handlers
 * run in separate module contexts and don't share in-memory state.
 * Full session validation happens in the route handlers via verifySession().
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes, except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const signedCookie = request.cookies.get("admin_session")?.value;

    if (!signedCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify cookie signature only (lightweight check)
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const lastDot = signedCookie.lastIndexOf(".");
    if (lastDot === -1) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_session");
      return response;
    }

    const value = signedCookie.substring(0, lastDot);
    const signature = signedCookie.substring(lastDot + 1);
    const expected = createHmac("sha256", secret).update(value).digest("hex");

    // Constant-time comparison
    if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const config = {
  matcher: ["/admin/:path*"],
};
