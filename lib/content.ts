import { formations, modules } from "#site/content";

export type Formation = (typeof formations)[number];
export type Module = (typeof modules)[number];

export function getFormation(slug: string) {
  return formations.find((formation) => formation.slug === slug);
}

/** All formations in catalogue order (CATALOGUE.md numbering). */
export function getFormations() {
  return [...formations].sort((a, b) => a.number - b.number);
}

/** Modules of a formation, ordered by id (file prefix). */
export function getModules(slug: string) {
  return modules
    .filter((module) => module.formation === slug)
    .sort((a, b) => a.id.localeCompare(b.id, "fr", { numeric: true }));
}

/** Formations that can actually be configured and presented (they have modules). */
export function getFormationSlugs() {
  return formations
    .filter((formation) => modules.some((module) => module.formation === formation.slug))
    .map((formation) => formation.slug);
}
