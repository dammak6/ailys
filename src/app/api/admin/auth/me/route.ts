import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { data: profiles, error: profileError } = await supabase.rpc("get_admin_profile");
    const profile = Array.isArray(profiles) ? profiles[0] : null;

    if (profileError || !profile || !profile.is_active) {
      return NextResponse.json(
        { authenticated: false, error: "Compte administrateur inactif ou non trouvé." },
        { status: 401 }
      );
    }

    const role = profile.role_name === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN";

    return NextResponse.json({
      authenticated: true,
      user: {
        id: profile.admin_id,
        email: profile.email,
        fullName: profile.full_name,
        role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
