import { NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await AilysRepository.getSiteSettings();
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    console.error("Public settings API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
