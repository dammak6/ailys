import { createClient } from "@supabase/supabase-js";
import { Database } from "../../src/lib/supabase/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const anonClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export const adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export interface AuditResult {
  section: string;
  name: string;
  status: "PASS" | "PARTIAL" | "REMAINING" | "FAIL";
  details: string;
}

export const auditResults: AuditResult[] = [];

export function record(section: string, name: string, status: "PASS" | "PARTIAL" | "REMAINING" | "FAIL", details: string) {
  auditResults.push({ section, name, status, details });
  const icon = status === "PASS" ? "✅" : status === "PARTIAL" ? "⚠️" : status === "REMAINING" ? "⏳" : "❌";
  console.log(`${icon} [${section}] ${name}: ${status} - ${details}`);
}
