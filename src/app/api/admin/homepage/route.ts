import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET() {
  try {
    const draftData = await AilysRepository.getDraftHomepage();
    return NextResponse.json(draftData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sections } = body;

    if (action === "save_draft" && Array.isArray(sections)) {
      const result = await AilysRepository.saveHomepageDraft(sections);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const id = data.id || data.sectionId;
    const { id: _id, sectionId: _secId, ...updates } = data;
    if (!id) {
      return NextResponse.json({ error: "ID de section requis" }, { status: 400 });
    }
    const updated = await AilysRepository.updateHomepageSection(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orderedIds } = body;

    if (action === "publish") {
      const pub = await AilysRepository.publishHomepageChanges();
      return NextResponse.json(pub);
    }

    if (action === "discard") {
      const discarded = await AilysRepository.discardHomepageDraft();
      return NextResponse.json(discarded);
    }

    if (orderedIds && Array.isArray(orderedIds)) {
      const sections = await AilysRepository.reorderHomepageSections(orderedIds);
      return NextResponse.json({ success: true, sections });
    }

    return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
