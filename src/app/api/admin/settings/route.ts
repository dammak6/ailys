import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET() {
  try {
    const settings = await AilysRepository.getSiteSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();
    const updated = await AilysRepository.updateSiteSettings(updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
