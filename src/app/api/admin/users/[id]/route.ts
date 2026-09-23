import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    const supabase = await createServerSupabaseClient();

    if (action === "toggle_active") {
      const { isActive } = body;
      if (typeof isActive !== "boolean") {
        return NextResponse.json(
          { error: "Paramètre isActive booléen requis." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase.rpc("toggle_admin_active" as any, {
        p_admin_id: id,
        p_is_active: isActive,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(data);
    }

    if (action === "reset_password") {
      const { newPassword } = body;
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { error: "Le nouveau mot de passe doit comporter au moins 8 caractères." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase.rpc("reset_admin_password" as any, {
        p_admin_id: id,
        p_new_password: newPassword,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Action non reconnue." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
