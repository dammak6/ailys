import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Identifiant administrateur requis." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // 1. Verify caller session
    const {
      data: { user: callerUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !callerUser) {
      return NextResponse.json(
        { error: "Non authentifié. Session requise." },
        { status: 401 }
      );
    }

    // 2. Fetch target admin to verify existence and obtain auth_user_id
    const { data: targetAdmin, error: targetFetchError } = await supabase
      .from("admin_users")
      .select("id, auth_user_id, email, full_name, role_id, roles(name)")
      .eq("id", id)
      .single();

    if (targetFetchError || !targetAdmin) {
      return NextResponse.json(
        { error: "Administrateur introuvable." },
        { status: 404 }
      );
    }

    // 3. Safety: Prevent self-deletion
    if (targetAdmin.auth_user_id === callerUser.id) {
      return NextResponse.json(
        { error: "Action interdite : vous ne pouvez pas supprimer votre propre compte." },
        { status: 400 }
      );
    }

    // 4. Execute atomic deletion RPC in database
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "delete_admin_user" as any,
      { p_admin_id: id }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || "Échec de la suppression de l'administrateur." },
        { status: 400 }
      );
    }

    // 5. Best-effort Supabase GoTrue Auth session revocation via Admin API
    try {
      if (targetAdmin.auth_user_id) {
        const adminClient = createAdminSupabaseClient();
        await adminClient.auth.admin.deleteUser(targetAdmin.auth_user_id);
      }
    } catch {
      // User was already deleted by RPC from auth.users, continue safely
    }

    return NextResponse.json({
      success: true,
      deletedAdminId: id,
      email: targetAdmin.email,
      message: `Le compte administrateur ${targetAdmin.email} a été définitivement supprimé.`,
    });
  } catch (error: any) {
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur lors de la suppression." },
      { status: 500 }
    );
  }
}

