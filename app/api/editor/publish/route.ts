import { NextResponse } from "next/server";
import { editorEnabled, publish } from "@/lib/canvas/storage";

/** Dev-only: commit the content and push it to GitHub (the "Publier" button). */
export async function POST(request: Request) {
  if (!editorEnabled) return new NextResponse(null, { status: 404 });
  const { message } = (await request.json().catch(() => ({}))) as { message?: string };
  try {
    return NextResponse.json(await publish(message?.trim() || "mise à jour depuis l'éditeur"));
  } catch (error) {
    return NextResponse.json(
      { published: false, reason: error instanceof Error ? error.message : "Publication impossible" },
      { status: 500 },
    );
  }
}
