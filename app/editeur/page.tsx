import type { Metadata } from "next";
import Link from "next/link";
import { Logotype, SectionLabel } from "@/components/brand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LocalOnly } from "@/components/editor/LocalOnly";
import { editorEnabled } from "@/lib/canvas/storage";
import { getFormations } from "@/lib/content";

export const metadata: Metadata = { title: "Éditeur", robots: { index: false } };

/** Formation picker for the local visual editor (ADR-014). */
export default function EditorHome() {
  const formations = getFormations();
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="rounded-md no-underline" aria-label="Accueil">
          <Logotype size="sm" className="text-xl" />
        </Link>
        <ThemeToggle compact />
      </header>
      <SectionLabel className="mb-4">Éditeur de formations</SectionLabel>
      <h1 className="type-display mb-6 text-5xl">Quelle formation modifier ?</h1>
      {!editorEnabled && <LocalOnly />}
      <ul className="grid gap-3 sm:grid-cols-2">
        {formations.map((formation) => (
          <li key={formation.slug}>
            <Link
              href={`/editeur/${formation.slug}`}
              className="flex items-baseline justify-between gap-4 rounded-card border border-border bg-surface px-5 py-4 text-text no-underline hover:border-primary"
            >
              <span className="font-semibold">{formation.title}</span>
              <span className="text-sm text-text-muted">{formation.status === "pilote" ? "Pilote" : formation.status === "v1" ? "v1" : "Bientôt"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

