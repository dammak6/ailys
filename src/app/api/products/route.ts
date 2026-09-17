import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const size = searchParams.get("size") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    const products = await AilysRepository.getProducts({
      category,
      size,
      sortBy,
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits." },
      { status: 500 }
    );
  }
}
