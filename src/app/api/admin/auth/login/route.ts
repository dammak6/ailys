import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = body.password?.trim();
    const email = body.email?.trim() || "direction@ailys.tn";

    if (!password) {
      return NextResponse.json(
        { error: "Veuillez saisir le mot de passe d'administration." },
        { status: 400 }
      );
    }

    // Direct password verification: "aichalys2026"
    if (password === "aichalys2026") {
      const user = {
        id: "admin-ailys",
        email: "direction@ailys.tn",
        fullName: "Direction AÏLYS",
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

    // Attempt Supabase Auth login if configured and email is provided
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && !url.includes("placeholder-project") && body.email) {
      try {
        const supabase = createAdminSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: body.email,
          password,
        });

        if (!error && data?.session) {
          const { data: adminRecord } = await (supabase
            .from("admin_users") as any)
            .select("*")
            .eq("email", body.email)
            .eq("is_active", true)
            .single();

          if (adminRecord) {
            const user = {
              id: adminRecord.id,
              email: adminRecord.email,
              fullName: adminRecord.full_name,
              role: adminRecord.role,
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
              maxAge: 7 * 24 * 60 * 60,
            });
            return response;
          }
        }
      } catch (authErr) {
        console.warn("Supabase auth check skipped:", authErr);
      }
    }

    return NextResponse.json(
      { error: "Mot de passe incorrect. Veuillez réessayer." },
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
