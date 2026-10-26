import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { formations, modules } from "#site/content";
import { isCanvasModule, type CanvasSlide } from "@/lib/canvas/model";

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

/**
 * Canvas sequences are read straight from disk (not through Velite), so what the
 * editor saves is presented immediately in dev, and baked in at build time.
 */
function getCanvasModules(slug: string): Module[] {
  const dir = path.join(process.cwd(), "content", "formations", slug, "modules");
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((file) => /^\d{2}-.+\.json$/.test(file));
  } catch {
    return [];
  }
  return files.flatMap((file) => {
    const data: unknown = JSON.parse(readFileSync(path.join(dir, file), "utf8"));
    if (!isCanvasModule(data)) return [];
    return [
      {
        ...data,
        levels: data.levels as ModuleBase["levels"],
        id: file.slice(0, 2),
        formation: slug,
        source: "canvas" as const,
      },
    ];
  });
}

/** Modules of a formation (MDX and canvas), ordered by id (file prefix). */
export function getModules(slug: string): Module[] {
  const mdx: Module[] = modules
    .filter((module) => module.formation === slug)
    .map((module) => ({ ...module, source: "mdx" as const }));
  return [...mdx, ...getCanvasModules(slug)].sort((a, b) => a.id.localeCompare(b.id, "fr", { numeric: true }));
}

/** Formations that can actually be configured and presented (they have modules). */
export function getFormationSlugs() {
  return formations
    .filter((formation) => getModules(formation.slug).length > 0)
    .map((formation) => formation.slug);
}
