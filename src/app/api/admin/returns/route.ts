import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET() {
  try {
    const returns = await AilysRepository.getAllAdminReturns();
    return NextResponse.json(returns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, adminNotes } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID de retour et statut requis" }, { status: 400 });
    }
    const updated = await AilysRepository.updateReturnStatus(id, status, adminNotes);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
