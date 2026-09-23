import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AilysRole = "SUPER_ADMIN" | "ADMIN";

export type AdminResource =
  | "orders"
  | "products"
  | "returns"
  | "collections"
  | "media"
  | "homepage"
  | "analytics"
  | "settings"
  | "admins"
  | "system";

export interface AuthenticatedAdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: AilysRole;
}

/**
 * Normalizes role strings to standard AÏLYS roles
 */
export function normalizeRole(role?: string | null): AilysRole {
  if (!role) return "ADMIN";
  const upper = role.toUpperCase().trim();
  if (upper === "SUPER_ADMIN" || upper === "SUPERADMIN") {
    return "SUPER_ADMIN";
  }
  return "ADMIN";
}

/**
 * Checks whether role is SUPER_ADMIN
 */
export function isSuperAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "SUPER_ADMIN";
}

/**
 * Checks whether role is at least an operational ADMIN
 */
export function isOperationalAdmin(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "ADMIN" || normalized === "SUPER_ADMIN";
}

/**
 * Server-side RBAC validation:
 * SUPER_ADMIN: Full access
 * ADMIN: Restricted to operational management (orders, products, returns, media, collections).
 *        Strictly BLOCKED from statistics, analytics, admin management, and system-level management/settings.
 */
export function canAccessResource(role: string | null | undefined, resource: AdminResource): boolean {
  const normalized = normalizeRole(role);

  // SUPER_ADMIN has full unrestricted access
  if (normalized === "SUPER_ADMIN") {
    return true;
  }

  // ADMIN is restricted to operational scopes
  switch (resource) {
    case "orders":
    case "products":
    case "returns":
    case "collections":
    case "media":
    case "homepage":
      return true;

    case "analytics":
    case "settings":
    case "admins":
    case "system":
      // Strictly forbidden for ADMIN role
      return false;

    default:
      return false;
  }
}

/**
 * Extracts and verifies active administrator profile from Supabase Auth session
 */
export async function getAuthenticatedAdmin(_req?: NextRequest): Promise<AuthenticatedAdminProfile | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) return null;

    const { data: profiles, error: profileErr } = await supabase.rpc("get_admin_profile");
    const profile = Array.isArray(profiles) ? profiles[0] : null;

    if (profileErr || !profile || !profile.is_active) {
      return null;
    }

    return {
      id: profile.admin_id,
      email: profile.email,
      fullName: profile.full_name,
      role: normalizeRole(profile.role_name),
    };
  } catch {
    return null;
  }
}

/**
 * Enforces role-based access for an incoming request.
 * Returns { authorized: true, user } or { authorized: false, status: 401 | 403, error }
 */
export async function enforceRbac(
  req: NextRequest,
  requiredResource: AdminResource
): Promise<{ authorized: boolean; user?: AuthenticatedAdminProfile; status?: number; error?: string }> {
  const user = await getAuthenticatedAdmin(req);

  if (!user) {
    return {
      authorized: false,
      status: 401,
      error: "Accès non autorisé. Session administrateur valide requise.",
    };
  }

  if (!canAccessResource(user.role, requiredResource)) {
    return {
      authorized: false,
      user,
      status: 403,
      error: `Accès interdit. Le rôle [${user.role}] n'est pas autorisé à accéder à [${requiredResource}]. Privilèges SUPER_ADMIN requis.`,
    };
  }

  return {
    authorized: true,
    user,
  };
}
