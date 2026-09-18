import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isPreview = searchParams.get("preview") === "true";

    if (isPreview) {
      const draft = await AilysRepository.getDraftHomepage();
      return NextResponse.json(
        {
          isPreview: true,
          sections: draft.sections.filter((s: any) => s.isEnabled),
          meta: draft.meta,
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    const sections = await AilysRepository.getPublishedHomepage();
    return NextResponse.json(
      {
        isPreview: false,
        sections,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
