import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogue, type CatalogueFormation } from "@/components/catalogue/Catalogue";
import { Intro } from "@/components/catalogue/Intro";
import { getFormations, getModules } from "@/lib/content";
import { FORMATS, type Format } from "@/lib/session";

export const metadata: Metadata = {
  title: "Formations",
  description: "Le catalogue des formations Building things. : technologie, produits, idées, impact.",
};

/** Episodes = sequences of the reference format (2h when available). */
function episodesOf(slug: string, formats: Partial<Record<Format, string[]>>) {
  const reference = formats["2h"]?.length ? "2h" : FORMATS.find((format) => formats[format]?.length);
  const ids = reference ? (formats[reference] ?? []) : [];
  return getModules(slug)
    .filter((module) => ids.includes(module.id))
    .map((module) => ({
      id: module.id,
      title: module.title,
      duration: (reference && module.durations?.[reference]) || module.duration,
    }));
}

export default function FormationsPage() {
  const formations: CatalogueFormation[] = getFormations().map((formation) => ({
    slug: formation.slug,
    number: formation.number,
    title: formation.title,
    subtitle: formation.subtitle,
    pillar: formation.pillar,
    status: formation.status,
    promise: formation.promise,
    keyMessage: formation.keyMessage,
    highlight: formation.highlight,
    audiences: formation.audiences,
    levels: formation.levels,
    formats: FORMATS.filter((format) => format in formation.formats),
    tags: formation.tags,
    episodes: episodesOf(formation.slug, formation.formats),
  }));

  return (
    <>
      <Suspense>
        <Intro />
      </Suspense>
      <Catalogue formations={formations} />
    </>
  );
}
