import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Arc,
  DotMatrix,
  DottedArc,
  Grid,
  Halo,
  Lines,
  Logotype,
  SectionLabel,
  SignalDot,
  Tag,
  TechStar,
  Texture,
} from "@/components/brand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ContrastRow } from "./_components/ContrastRow";
import { TokenValue } from "./_components/TokenValue";
import { BRAND_CONTRASTS, GRADIENTS, PALETTE, SEMANTIC, SEMANTIC_CONTRASTS, type ContrastCheck } from "./_data";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "palette", label: "Palette" },
  { id: "tokens", label: "Tokens sémantiques" },
  { id: "typographie", label: "Typographie" },
  { id: "logotype", label: "Logotype" },
  { id: "assets", label: "Assets" },
  { id: "degrades", label: "Dégradés" },
  { id: "contrastes", label: "Contrastes" },
] as const;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 py-14">
      <SectionLabel className="mb-3">{`${String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, "0")} · Styleguide`}</SectionLabel>
      <h2 id={`${id}-title`} className="type-subtitle mb-8 text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function AssetCard({ name, description, children }: { name: string; description: string; children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-bg">{children}</div>
      <figcaption className="border-t border-border p-4">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-text-muted">{description}</p>
      </figcaption>
    </figure>
  );
}

function ContrastTable({ caption, rows }: { caption: string; rows: ContrastCheck[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface p-4">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <caption className="type-eyebrow pb-3 text-left text-text-muted">{caption}</caption>
        <thead className="text-text-muted">
          <tr>
            <th scope="col" className="pb-2 font-medium">Aperçu</th>
            <th scope="col" className="pb-2 font-medium">Combinaison</th>
            <th scope="col" className="pb-2 font-medium">Ratio</th>
            <th scope="col" className="pb-2 font-medium">Usage</th>
            <th scope="col" className="pb-2 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ContrastRow key={`${row.fg}${row.bg}`} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="rounded-md" aria-label="Retour à l'accueil">
              <Logotype size="sm" className="text-xl" />
            </Link>
            <span className="type-eyebrow text-text-muted">Styleguide</span>
          </div>
          <ThemeToggle />
        </div>
        <nav aria-label="Sections du styleguide" className="scrollbar-none mx-auto max-w-6xl overflow-x-auto px-6 pb-3">
          <ul className="flex gap-2 text-sm">
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block whitespace-nowrap rounded-pill px-3 py-1 text-text-muted no-underline hover:bg-surface-2 hover:text-text"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden py-16">
          <Halo className="-right-40 -top-56 size-[32rem]" />
          <SectionLabel as="p" className="relative mb-4">
            Direction artistique
          </SectionLabel>
          <h1 className="type-display relative max-w-3xl text-5xl sm:text-6xl">
            Le système visuel, <span className="text-grad-main pb-[0.08em]">vivant</span>
            <span className="text-accent">.</span>
          </h1>
          <p className="relative mt-6 max-w-2xl text-lg text-text-muted">
            Toutes les valeurs ci-dessous sont lues en direct dans <code>styles/tokens.css</code>. Basculez le
            thème pour vérifier chaque élément en clair et en sombre.
          </p>
        </div>

        <Section id="palette" title="Palette">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PALETTE.map(({ token, name, role }) => (
              <li key={token} className="overflow-hidden rounded-card border border-border bg-surface">
                <div className="h-28 border-b border-border" style={{ backgroundColor: `var(${token})` }} />
                <div className="p-4">
                  <p className="font-semibold">{name}</p>
                  <p className="font-mono text-sm">
                    <TokenValue token={token} />
                  </p>
                  <code className="text-xs text-text-muted">{token}</code>
                  <p className="mt-2 text-sm text-text-muted">{role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="tokens" title="Tokens sémantiques">
          <div className="overflow-x-auto rounded-card border border-border bg-surface p-4">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="text-text-muted">
                <tr>
                  <th scope="col" className="pb-2 font-medium">Couleur</th>
                  <th scope="col" className="pb-2 font-medium">Token</th>
                  <th scope="col" className="pb-2 font-medium">Valeur (thème actif)</th>
                  <th scope="col" className="pb-2 font-medium">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {SEMANTIC.map(({ token, role, derived }) => (
                  <tr key={token} className="border-t border-border">
                    <td className="py-2 pr-4">
                      <span
                        className="block h-8 w-12 rounded-md border border-border"
                        style={{ backgroundColor: `var(${token})` }}
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <code>{token}</code>
                    </td>
                    <td className="py-2 pr-4 font-mono">
                      <TokenValue token={token} />
                    </td>
                    <td className="py-2 text-text-muted">
                      {role}
                      {derived && <Tag className="ml-2 px-2 py-0 text-xs">dérivé</Tag>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="typographie" title="Typographie">
          <div className="space-y-8 rounded-card border border-border bg-surface p-8">
            <div>
              <p className="mb-2 text-xs text-text-muted">Display · Poppins 800 · -0.03em · 0.95</p>
              <p className="type-display text-6xl sm:text-7xl">J&apos;explore.</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-text-muted">Titre 1 · Poppins 800</p>
              <p className="type-display text-5xl">J&apos;imagine. Je construis.</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-text-muted">Titre 2 · Poppins 800</p>
              <p className="type-display text-3xl">Comprendre l&apos;IA générative</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-text-muted">Sous-titre · Poppins 600</p>
              <p className="type-subtitle text-2xl">Idées, produits, technologie, impact</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-text-muted">Sur-titre · Inter 600 · majuscules · 0.25em</p>
              <SectionLabel>Positionnement</SectionLabel>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="mb-2 text-xs text-text-muted">Corps · Inter 400</p>
                <p>Des formations concrètes pour comprendre, imaginer et construire avec l&apos;IA.</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-text-muted">Corps · Inter 500</p>
                <p className="font-medium">Des formations concrètes pour comprendre, imaginer et construire.</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-text-muted">Corps · Inter 600</p>
                <p className="font-semibold">Des formations concrètes pour comprendre, imaginer et construire.</p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-text-muted">Texte secondaire · --text-muted</p>
                <p className="text-text-muted">Session de 2 h · niveau découverte · tous publics</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-text-muted">Lien · --link</p>
                <a href="#typographie" className="underline underline-offset-4">
                  Voir le programme détaillé
                </a>
              </div>
            </div>
          </div>
        </Section>

        <Section id="logotype" title="Logotype">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative flex min-h-80 items-center overflow-hidden rounded-card border border-border bg-surface p-10">
              <Logotype size="lg" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["sm", "md"] as const).map((size) => (
                <div key={size} className="rounded-card border border-border bg-surface p-6">
                  <p className="mb-4 text-xs text-text-muted">Taille {size}</p>
                  <Logotype size={size} />
                </div>
              ))}
              <div className="rounded-card border border-border bg-surface-2 p-6 sm:col-span-2">
                <p className="text-sm text-text-muted">
                  « Building » en <code>--text</code>, « things » en <code>--grad-main</code>, point final toujours
                  en <code>--accent</code>. Toujours sur deux lignes, aligné à gauche.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="assets" title="Assets graphiques">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AssetCard name="Halo" description="Tache lumineuse floue, profondeur.">
              <Halo className="size-64" />
            </AssetCard>
            <AssetCard name="Grid" description="Quadrillage fin 1px, opacité 6–10 %.">
              <Grid cell={24} />
            </AssetCard>
            <AssetCard name="Lines" description="Courbes fines cobalt et cyan qui se croisent.">
              <Lines className="absolute inset-0 size-full" />
            </AssetCard>
            <AssetCard name="DottedArc" description="Arc pointillé (orbite), avec point signal optionnel.">
              <DottedArc signal className="size-36" />
            </AssetCard>
            <AssetCard name="SignalDot" description="Disque orange avec halo diffus. Un par zone.">
              <div className="flex items-center gap-6">
                <SignalDot size="sm" />
                <SignalDot size="md" />
                <SignalDot size="lg" pulse />
              </div>
            </AssetCard>
            <AssetCard name="TechStar" description="Étoile à 4 branches : cobalt en clair, cyan en sombre.">
              <div className="flex items-end gap-6">
                <TechStar size={16} />
                <TechStar size={32} />
                <TechStar size={56} />
              </div>
            </AssetCard>
            <AssetCard name="Tag" description="Capsule arrondie, variante avec flèche ronde.">
              <div className="flex flex-col items-center gap-3">
                <Tag>chez onepoint</Tag>
                <Tag arrow href="#assets">
                  Découvrir
                </Tag>
              </div>
            </AssetCard>
            <AssetCard name="Texture" description="Grain léger (feTurbulence) sur un dégradé.">
              <div className="absolute inset-6 overflow-hidden rounded-xl bg-grad-main">
                <Texture />
              </div>
            </AssetCard>
            <AssetCard name="Arc" description="Grand ruban arrondi en dégradé qui sort du cadre.">
              <Arc className="absolute -bottom-24 -left-16 size-80" thickness={48} />
            </AssetCard>
            <AssetCard name="DotMatrix" description="Petite grille de points matriciels.">
              <DotMatrix className="size-36" />
            </AssetCard>
            <AssetCard name="SectionLabel" description="Sur-titre en majuscules espacées + trait cobalt 40px.">
              <SectionLabel>Nos formations</SectionLabel>
            </AssetCard>
          </div>
        </Section>

        <Section id="degrades" title="Dégradés">
          <ul className="grid gap-4 sm:grid-cols-2">
            {GRADIENTS.map(({ token, role }) => (
              <li key={token} className="overflow-hidden rounded-card border border-border bg-surface">
                <div className="relative h-36 overflow-hidden bg-bg">
                  <div className="absolute inset-0" style={{ backgroundImage: `var(${token})` }} />
                </div>
                <div className="p-4">
                  <code className="font-semibold">{token}</code>
                  <p className="text-sm text-text-muted">{role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="contrastes" title="Contrastes">
          <p className="mb-6 max-w-3xl text-text-muted">
            Ratios WCAG calculés en direct à partir des tokens. Les couleurs marquées « décoratif » ne sont jamais
            utilisées en texte : l&apos;aperçu montre alors une forme plutôt que des lettres.
          </p>
          <div className="space-y-6">
            <ContrastTable caption="Palette de marque (DA.md §1)" rows={BRAND_CONTRASTS} />
            <ContrastTable caption="Tokens sémantiques (thème actif)" rows={SEMANTIC_CONTRASTS} />
          </div>
        </Section>
      </main>
    </>
  );
}
