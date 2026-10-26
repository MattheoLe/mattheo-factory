import { canvasModules, formations, modules } from "#site/content";
import type { CanvasSlide } from "@/lib/canvas/model";

export type Formation = (typeof formations)[number];

type ModuleBase = {
  id: string;
  formation: string;
  title: string;
  kind: string;
  duration: number;
  durations?: Partial<Record<string, number>>;
  levels?: ("decouverte" | "intermediaire" | "expert")[];
};

/** A sequence is either written in MDX or drawn in the visual editor (ADR-014). */
export type Module =
  | (ModuleBase & { source: "mdx"; body: string })
  | (ModuleBase & { source: "canvas"; slides: CanvasSlide[] });

export function getFormation(slug: string) {
  return formations.find((formation) => formation.slug === slug);
}

/** All formations in catalogue order (CATALOGUE.md numbering). */
export function getFormations() {
  return [...formations].sort((a, b) => a.number - b.number);
}

/** Modules of a formation (MDX and canvas), ordered by id (file prefix). */
export function getModules(slug: string): Module[] {
  const mdx: Module[] = modules
    .filter((module) => module.formation === slug)
    .map((module) => ({ ...module, source: "mdx" as const }));
  const canvas: Module[] = canvasModules
    .filter((module) => module.formation === slug)
    .map((module) => ({ ...module, slides: module.slides as CanvasSlide[], source: "canvas" as const }));
  return [...mdx, ...canvas].sort((a, b) => a.id.localeCompare(b.id, "fr", { numeric: true }));
}

/** Formations that can actually be configured and presented (they have modules). */
export function getFormationSlugs() {
  return formations
    .filter((formation) => getModules(formation.slug).length > 0)
    .map((formation) => formation.slug);
}
