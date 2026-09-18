import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET() {
  try {
    const info = await AilysRepository.getLastSavedInfo();
    return NextResponse.json({
      success: true,
      lastSavedAt: info.lastSavedAt,
      stats: info.stats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    const result = await AilysRepository.saveAll(body);

    return NextResponse.json(
      {
        success: true,
        message: "Toutes les modifications ont été enregistrées avec succès.",
        lastSavedAt: result.lastSavedAt,
        stats: result.stats,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Admin save error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}
