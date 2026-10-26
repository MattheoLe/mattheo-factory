import { NextResponse } from "next/server";
import { createModule, editorEnabled, listModules } from "@/lib/canvas/storage";

/** Dev-only editor API (ADR-014): list and create the sequences of a formation. */

export async function GET(_request: Request, { params }: RouteContext<"/api/editor/[slug]">) {
  if (!editorEnabled) return new NextResponse(null, { status: 404 });
  const { slug } = await params;
  try {
    return NextResponse.json(await listModules(slug));
  } catch {
    return NextResponse.json({ error: "Formation introuvable" }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: RouteContext<"/api/editor/[slug]">) {
  if (!editorEnabled) return new NextResponse(null, { status: 404 });
  const { slug } = await params;
  try {
    const id = await createModule(slug, await request.json());
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Séquence invalide" }, { status: 400 });
  }
}
