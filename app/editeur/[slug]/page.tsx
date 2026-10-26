import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Editor } from "@/components/editor/Editor";
import { editorEnabled } from "@/lib/canvas/storage";
import { getFormation, getFormations } from "@/lib/content";
import { LocalOnly } from "@/components/editor/LocalOnly";

type Params = PageProps<"/editeur/[slug]">["params"];

export const metadata: Metadata = { title: "Éditeur", robots: { index: false } };

export function generateStaticParams() {
  return getFormations().map((formation) => ({ slug: formation.slug }));
}

export default function EditorPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="p-8 text-text-muted">Chargement de l&apos;éditeur…</p>}>
      <EditorLoader params={params} />
    </Suspense>
  );
}

async function EditorLoader({ params }: { params: Params }) {
  const { slug } = await params;
  const formation = getFormation(slug);
  if (!formation) notFound();
  if (!editorEnabled) {
    return (
      <div className="mx-auto max-w-3xl p-10">
        <LocalOnly />
      </div>
    );
  }
  return <Editor slug={slug} title={formation.title} />;
}
