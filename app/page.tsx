import { Box, Cpu, Lightbulb, Sprout, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Arc, DottedArc, Grid, Halo, Logotype, SectionLabel, SignalDot, Tag, TechStar } from "@/components/brand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const PILLARS: { label: string; icon: LucideIcon }[] = [
  { label: "Idées", icon: Lightbulb },
  { label: "Produits", icon: Box },
  { label: "Technologie", icon: Cpu },
  { label: "Impact", icon: Sprout },
];

/** Provisional home: the "Positionnement" block of the DA boards, used as a DA integration test. */
export default function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <Grid cell={56} />
      <Halo className="-right-48 -top-48 size-[40rem]" />
      <Arc className="absolute -bottom-72 -right-56 size-[36rem] sm:-bottom-80 sm:-right-40" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-end gap-4 px-6 py-6 sm:justify-between">
        <div className="hidden sm:block">
          <SectionLabel as="p">
            Formations
          </SectionLabel>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/styleguide"
            className="rounded-pill px-3 py-1.5 text-sm font-medium text-text-muted no-underline hover:bg-surface-2 hover:text-text"
          >
            Styleguide
          </Link>
          <ThemeToggle compact />
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-16 px-6 pb-24 pt-8 lg:grid-cols-[1fr_auto]">
        <section aria-labelledby="positioning-title">
          <SectionLabel className="mb-8">Positionnement</SectionLabel>

          <div className="relative inline-block">
            <Logotype as="h1" size="xl" className="relative" />
            <TechStar size={36} className="absolute -right-12 top-2 hidden sm:block" />
          </div>

          <p id="positioning-title" className="type-subtitle mt-10 text-2xl sm:text-3xl">
            J&apos;explore. J&apos;imagine. Je construis.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-lg text-text-muted">
            <span>Consultant en innovation &amp; IA</span>
            <Tag>chez onepoint</Tag>
          </div>

          <div className="mt-10">
            <Tag arrow href="/formations/ia-generative/configurer">
              Formation pilote : Comprendre l&apos;IA générative
            </Tag>
          </div>
        </section>

        <aside aria-label="Piliers" className="relative">
          <DottedArc className="absolute -left-20 -top-16 size-40 opacity-70" />
          <ul className="relative flex flex-col gap-3">
            {PILLARS.map(({ label, icon: Icon }, index) => (
              <li
                key={label}
                className="flex min-w-60 items-center gap-4 rounded-card border border-border bg-surface/80 px-5 py-4 backdrop-blur lg:min-w-80 lg:px-6 lg:py-5"
              >
                <span className="type-eyebrow text-text-muted">{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" size={20} strokeWidth={1.5} className="text-link" />
                <span className="type-subtitle text-lg lg:text-xl">{label}</span>
                {index === 0 && <SignalDot size="sm" pulse className="ml-auto" />}
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}
