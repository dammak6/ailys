import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get("orderCode");
    const phone = searchParams.get("phone");

    if (!orderCode || !phone) {
      return NextResponse.json(
        { error: "Veuillez fournir le code de commande et le numéro de téléphone." },
        { status: 400 }
      );
    }

    const order = await AilysRepository.lookupOrderForReturn(orderCode, phone);

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable avec ces coordonnées." },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Return lookup API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche de la commande." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderId,
      orderCode,
      customerName,
      customerPhone,
      customerEmail,
      type,
      reason,
      comments,
      tagsIntactConfirmed,
      items,
    } = body;

    if (!orderCode || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Informations incomplètes pour la demande de retour." },
        { status: 400 }
      );
    }

    const result = await AilysRepository.createReturnRequest({
      orderId,
      orderCode,
      customerName,
      customerPhone,
      customerEmail,
      type: type || "echange",
      reason: reason || "Autre",
      comments,
      tagsIntactConfirmed: tagsIntactConfirmed ?? true,
      items,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Return submission API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du retour." },
      { status: 500 }
    );
  }
}
