import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./types";

export async function createServerSupabaseClient() {
  let cookieStore: any = null;
  try {
    cookieStore = await cookies();
  } catch {
    // Called outside request scope (e.g. during static generation, builds, or scripts)
  }

  const DEFAULT_SUPABASE_URL = "https://kafyatqatggifedqtctm.supabase.co";
  const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZnlhdHFhdGdnaWZlZHF0Y3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTcwNzgsImV4cCI6MjEwNTU3MzA3OH0.Uo7z-jd2-cBVAlndWhTCfuOxRCpapPK2A7dEBBUqWf4";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet) {
          if (!cookieStore) return;
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
