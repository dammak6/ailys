/**
 * AÏLYS Authentication Module
 * Administration authentication is handled exclusively by Supabase Auth (GoTrue).
 * Custom HMAC token generation and legacy hardcoded secrets have been fully removed.
 */

export interface AdminUserSession {
  id: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "ADMIN";
}
