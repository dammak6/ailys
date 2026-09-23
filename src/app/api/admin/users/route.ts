import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("get_all_admins" as any);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, mot de passe et nom complet sont requis." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("create_operational_admin" as any, {
      p_email: email,
      p_password: password,
      p_full_name: fullName,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
