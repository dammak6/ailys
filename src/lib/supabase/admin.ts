import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

/**
 * Creates a server-only Supabase client with the service-role key.
 * This client bypasses Row Level Security (RLS) and must NEVER be exposed
 * to the browser or imported in client-side code.
 */
export function createAdminSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error("CRITICAL SECURITY VIOLATION: createAdminSupabaseClient cannot be called on the client!");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
