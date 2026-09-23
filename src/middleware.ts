import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public authentication endpoints without inspection
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/auth/login"
  ) {
    return NextResponse.next();
  }

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({
          request: req,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated:
  if (!user) {
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { error: "Accès non autorisé. Session administrateur requise." },
        { status: 401 }
      );
    }
    return res;
  }

  // Verify active administrator status and role
  const { data: profiles, error: profileErr } = await supabase.rpc("get_admin_profile");
  const profile = Array.isArray(profiles) ? profiles[0] : null;

  if (profileErr || !profile || !profile.is_active) {
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("error", "inactive_account");
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json(
      { error: "Compte administrateur inactif ou non autorisé." },
      { status: 403 }
    );
  }

  const userRole = profile.role_name === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN";

  // Role-based restrictions for UI:
  // Operational ADMIN must NOT access user management or unrestricted system settings
  if (pathname.startsWith("/admin")) {
    const isSuperAdminUi =
      pathname.startsWith("/admin/users") ||
      pathname.startsWith("/admin/settings");

    if (isSuperAdminUi && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/orders", req.url));
    }
  }

  // Role-based restrictions for API:
  // Operational ADMIN must NOT access settings, analytics, or user management APIs
  if (pathname.startsWith("/api/admin")) {
    const isRestrictedApi =
      pathname.startsWith("/api/admin/settings") ||
      pathname.startsWith("/api/admin/analytics") ||
      pathname.startsWith("/api/admin/users");

    if (isRestrictedApi && userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé. Privilèges SUPER_ADMIN requis." },
        { status: 403 }
      );
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
