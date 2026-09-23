import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productSlug, size, contact } = body;

    if (!productSlug || !size || !contact) {
      return NextResponse.json(
        { error: "Informations manquantes: produit, taille et contact obligatoires." },
        { status: 400 }
      );
    }

    const trimmedContact = String(contact).trim();
    const isEmail = trimmedContact.includes("@");

    const supabase = await createServerSupabaseClient();
    const { data: prod } = await supabase
      .from("products")
      .select("id, name")
      .eq("slug", productSlug)
      .single();

    if (!prod) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    const { error } = await (supabase.from("restock_requests") as any).insert({
      product_id: prod.id,
      product_name: prod.name,
      size_name: size,
      contact_info: trimmedContact,
      contact_type: isEmail ? "email" : "phone",
      preferred_channel: isEmail ? "email" : "phone",
      status: "en_attente",
    });

    if (error) {
      console.error("Restock request error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Votre demande de réassort a bien été enregistrée.",
    });
  } catch (error: any) {
    console.error("Restock API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de votre demande." },
      { status: 500 }
    );
  }
}
