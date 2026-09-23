import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify Admin session
    const { data: adminProfiles, error: authError } = await supabase.rpc("get_admin_profile" as any);
    const adminProfile = Array.isArray(adminProfiles) ? adminProfiles[0] : adminProfiles;
    if (authError || !adminProfile || !adminProfile.is_active) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
    }

    const { data: history, error } = await supabase
      .from("order_edit_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ history: history || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("edit_order_details" as any, {
      p_order_id: id,
      p_customer_name: body.customerName || null,
      p_phone: body.customerPhone || null,
      p_governorate: body.governorate || null,
      p_city: body.city || null,
      p_address: body.address || null,
      p_delivery_notes: body.deliveryNotes || null,
      p_courier_notes: body.courierNotes || null,
      p_items: body.items && body.items.length > 0 ? body.items : null,
      p_reason: body.reason || "Modification opérationnelle",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur serveur" }, { status: 500 });
  }
}
