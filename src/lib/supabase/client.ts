import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

const DEFAULT_SUPABASE_URL = "https://kafyatqatggifedqtctm.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZnlhdHFhdGdnaWZlZHF0Y3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTcwNzgsImV4cCI6MjEwNTU3MzA3OH0.Uo7z-jd2-cBVAlndWhTCfuOxRCpapPK2A7dEBBUqWf4";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
