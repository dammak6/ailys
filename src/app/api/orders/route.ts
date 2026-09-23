import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";
import { EmailService } from "@/lib/services/email-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      altPhone,
      governorate,
      city,
      address,
      notes,
      items,
      subtotal,
      shippingFee,
      total,
    } = body;

    if (!fullName || !phone || !governorate || !city || !address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Veuillez renseigner toutes les informations obligatoires de livraison." },
        { status: 400 }
      );
    }

    const orderResult = await AilysRepository.createOrder({
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      altPhone,
      governorate,
      city,
      address,
      notes,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      total: Number(total),
      items: items.map((it: any) => ({
        productId: it.productId,
        productName: it.name,
        size: it.size,
        color: it.color,
        unitPrice: Number(it.price),
        quantity: Number(it.quantity),
        totalPrice: Number(it.price) * Number(it.quantity),
        imageUrl: it.image,
      })),
    });

    // Asynchronously dispatch order confirmation email without blocking or failing the order
    EmailService.sendOrderConfirmation({
      orderCode: orderResult.orderCode,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      address,
      city,
      governorate,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      total: Number(total),
      items,
    }).catch((e) => console.warn("[OrderAPI] Confirmation email dispatch caught:", e));

    return NextResponse.json(orderResult, { status: 201 });
  } catch (error: any) {
    console.error("Order creation API error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la validation de votre commande." },
      { status: 500 }
    );
  }
}
