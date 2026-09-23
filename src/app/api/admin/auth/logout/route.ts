import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Logout error:", err);
  }

  return NextResponse.json({ success: true, message: "Déconnexion réussie." });
}
