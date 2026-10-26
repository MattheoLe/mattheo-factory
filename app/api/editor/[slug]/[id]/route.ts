import { NextResponse } from "next/server";
import { editorEnabled, readModule, writeModule } from "@/lib/canvas/storage";

/** Dev-only editor API (ADR-014): read and save one canvas sequence. */

export async function GET(_request: Request, { params }: RouteContext<"/api/editor/[slug]/[id]">) {
  if (!editorEnabled) return new NextResponse(null, { status: 404 });
  const { slug, id } = await params;
  try {
    const data = await readModule(slug, id);
    return data ? NextResponse.json(data) : NextResponse.json({ error: "Introuvable" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: RouteContext<"/api/editor/[slug]/[id]">) {
  if (!editorEnabled) return new NextResponse(null, { status: 404 });
  const { slug, id } = await params;
  try {
    await writeModule(slug, id, await request.json());
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Enregistrement impossible" }, { status: 400 });
  }
}
