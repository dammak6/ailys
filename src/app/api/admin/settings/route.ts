import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";
import { enforceRbac } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  const authCheck = await enforceRbac(req, "settings");
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status || 403 });
  }

  try {
    const settings = await AilysRepository.getSiteSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authCheck = await enforceRbac(req, "settings");
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status || 403 });
  }

  try {
    const updates = await req.json();
    const updated = await AilysRepository.updateSiteSettings(updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
