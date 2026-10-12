import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Halo, Logotype, SectionLabel } from "@/components/brand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getFormation, getFormationSlugs, getModules } from "@/lib/content";
import { SessionForm } from "./SessionForm";

export function generateStaticParams() {
  return getFormationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/formations/[slug]/configurer">): Promise<Metadata> {
  const { slug } = await params;
  const formation = getFormation(slug);
  return { title: formation ? `Configurer · ${formation.title}` : "Configurer", robots: { index: false } };
}

type Params = PageProps<"/formations/[slug]/configurer">["params"];

export default function ConfigurePage({ params }: { params: Params }) {
  return (
    <Suspense>
      <Configure params={params} />
    </Suspense>
  );
}

async function Configure({ params }: { params: Params }) {
  const { slug } = await params;
  const formation = getFormation(slug);
  if (!formation) notFound();

  const modules = getModules(slug).map(({ id, title, duration, durations, levels, kind }) => ({
    id,
    title,
    duration,
    durations: durations ?? {},
    levels: levels ?? null,
    kind,
  }));

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Halo className="-right-40 -top-56 size-[36rem]" />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="rounded-md no-underline" aria-label="Accueil">
          <Logotype size="sm" className="text-xl" />
        </Link>
        <ThemeToggle compact />
      </header>

      <main className="relative mx-auto max-w-5xl px-6 pb-24">
        <SectionLabel className="mb-4">Configurer la session</SectionLabel>
        <h1 className="type-display max-w-3xl text-4xl sm:text-5xl">{formation.title}</h1>
        {formation.subtitle && <p className="type-subtitle mt-2 text-2xl text-text-muted">{formation.subtitle}</p>}
        <p className="mt-6 max-w-2xl text-lg text-text-muted">{formation.promise}</p>

        <Suspense>
          <SessionForm
            slug={formation.slug}
            levels={formation.levels}
            audiences={formation.audiences}
            formats={formation.formats}
            modules={modules}
          />
        </Suspense>
      </main>
    </div>
  );
}
