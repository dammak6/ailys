import { NextRequest, NextResponse } from "next/server";
import { AilysRepository } from "@/lib/db/repository";

export async function GET() {
  try {
    const collections = await AilysRepository.getAllAdminCollections();
    return NextResponse.json(collections);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.title) {
      return NextResponse.json({ error: "Titre de collection requis" }, { status: 400 });
    }
    const created = await AilysRepository.createCollection(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updates } = data;
    if (!id) {
      return NextResponse.json({ error: "ID de collection requis" }, { status: 400 });
    }
    const updated = await AilysRepository.updateCollection(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID de collection requis" }, { status: 400 });
    }
    const updated = await AilysRepository.togglePublishCollection(id);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de collection requis" }, { status: 400 });
    }
    const deleted = await AilysRepository.deleteCollection(id);
    return NextResponse.json(deleted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
