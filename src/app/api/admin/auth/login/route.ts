import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez fournir un email et un mot de passe valides." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session || !authData.user) {
      return NextResponse.json(
        { error: "Identifiants invalides ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Verify active administrator status and role via Security Definer RPC
    const { data: profiles, error: profileError } = await supabase.rpc("get_admin_profile");
    const profile = Array.isArray(profiles) ? profiles[0] : null;

    if (profileError || !profile || !profile.is_active) {
      // Immediate logout if inactive or not in admin_users
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Compte administrateur inactif ou non autorisé." },
        { status: 403 }
      );
    }

    const role = profile.role_name === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN";

    return NextResponse.json({
      success: true,
      user: {
        id: profile.admin_id,
        email: profile.email,
        fullName: profile.full_name,
        role,
      },
    });
  } catch (error: any) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}
