import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isPreview = searchParams.get("preview") === "true";

    if (isPreview) {
      const draft = await AilysRepository.getDraftHomepage();
      return NextResponse.json({
        isPreview: true,
        sections: draft.sections.filter((s: any) => s.isEnabled),
        meta: draft.meta,
      });
    }

    const sections = await AilysRepository.getPublishedHomepage();
    return NextResponse.json({
      isPreview: false,
      sections,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
