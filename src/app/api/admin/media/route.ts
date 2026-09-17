import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET() {
  try {
    const media = await AilysRepository.getAllMedia();
    return NextResponse.json(media);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.url) {
      return NextResponse.json({ error: "URL de média requise" }, { status: 400 });
    }
    const created = await AilysRepository.uploadMedia(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de média requis" }, { status: 400 });
    }
    const deleted = await AilysRepository.deleteMedia(id);
    return NextResponse.json(deleted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "ID de média requis" }, { status: 400 });
    }
    const updated = await AilysRepository.updateMediaTransform(data.id, data.transform);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

