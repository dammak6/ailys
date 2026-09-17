import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    // Attempt Supabase Auth login if configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && !url.includes("placeholder-project")) {
      try {
        const supabase = createAdminSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return NextResponse.json(
            { error: "Identifiants d'administration invalides." },
            { status: 401 }
          );
        }

        // Verify role in admin_users table
        const { data: adminRecord, error: roleError }: { data: any; error: any } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", email)
          .eq("is_active", true)
          .single();

        if (roleError || !adminRecord) {
          return NextResponse.json(
            { error: "Accès refusé. Privilèges administrateur requis." },
            { status: 403 }
          );
        }

        return NextResponse.json({
          success: true,
          user: {
            id: adminRecord.id,
            email: adminRecord.email,
            fullName: adminRecord.full_name,
            role: adminRecord.role,
          },
          session: data.session,
        });
      } catch (authErr) {
        console.warn("Supabase auth failed:", authErr);
      }
    }

    // Default admin development authentication fallback
    if (email === "admin@ailys.tn" && password === "AilysAdmin2026!") {
      const user = {
        id: "admin-dev-01",
        email: "admin@ailys.tn",
        fullName: "Directeur Atelier AÏLYS",
        role: "super_admin",
      };

      const token = createAdminToken(user);
      const response = NextResponse.json({
        success: true,
        user,
        token,
      });

      response.cookies.set("ailys_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: "Identifiants d'administration invalides." },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}
