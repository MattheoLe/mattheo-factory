import { formations, modules } from "#site/content";

export function getFormation(slug: string) {
  return formations.find((formation) => formation.slug === slug);
}

/** Modules of a formation, ordered by id (file prefix). */
export function getModules(slug: string) {
  return modules
    .filter((module) => module.formation === slug)
    .sort((a, b) => a.id.localeCompare(b.id, "fr", { numeric: true }));
}

export function getFormationSlugs() {
  return formations.map((formation) => formation.slug);
}
