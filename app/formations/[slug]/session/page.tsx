import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CanvasSlideSection } from "@/components/canvas/CanvasSlideSection";
import { MDXContent } from "@/components/mdx/MDXContent";
import { Deck } from "@/components/presenter/Deck";
import { ModuleGate } from "@/components/presenter/ModuleGate";
import { getFormation, getFormationSlugs, getModules } from "@/lib/content";

type Params = PageProps<"/formations/[slug]/session">["params"];

export function generateStaticParams() {
  return getFormationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const formation = getFormation(slug);
  return { title: formation ? `Session · ${formation.title}` : "Session", robots: { index: false } };
}

/**
 * Presentation mode. Every module is rendered statically; the session config is
 * read from the URL on the client (ADR-003) and filters modules, levels and audiences.
 */
export default function SessionPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="p-8 text-text-muted">Préparation de la session…</p>}>
      <Session params={params} />
    </Suspense>
  );
}

async function Session({ params }: { params: Params }) {
  const { slug } = await params;
  const formation = getFormation(slug);
  if (!formation) notFound();
  const modules = getModules(slug);

  return (
    <Deck deckId={formation.slug} title={formation.title} formats={formation.formats}>
      {modules.map((module) => (
        <ModuleGate key={module.id} id={module.id} levels={module.levels}>
          {module.source === "mdx" ? (
            <MDXContent code={module.body} />
          ) : (
            module.slides.map((slide) => <CanvasSlideSection key={slide.id} slide={slide} />)
          )}
        </ModuleGate>
      ))}
    </Deck>
  );
}
