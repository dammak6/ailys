import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public login routes
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/auth/login"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("ailys_admin_token")?.value;
  let isValid = false;

  if (token) {
    try {
      const [dataPart, signaturePart] = token.split(".");
      if (dataPart && signaturePart) {
        // Decode payload in Edge-compatible way
        const jsonStr = atob(dataPart.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(jsonStr);
        if (payload.expiresAt && Date.now() < payload.expiresAt) {
          isValid = true;
        }
      }
    } catch {
      isValid = false;
    }
  }

  // Protect Admin UI pages
  if (pathname.startsWith("/admin")) {
    if (!isValid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Admin API routes
  if (pathname.startsWith("/api/admin")) {
    if (!isValid) {
      return NextResponse.json(
        { error: "Accès non autorisé. Session administrateur requise." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
