"use client";

import { Check, Copy, MonitorPlay, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { clearDeckStore } from "@/components/presenter/useDeckStore";
import {
  FORMATS,
  LABELS,
  parseSessionConfig,
  sessionSearch,
  type Audience,
  type Format,
  type Level,
} from "@/lib/session";

type ModuleInfo = {
  id: string;
  title: string;
  duration: number;
  durations: Partial<Record<Format, number>>;
  levels: Level[] | null;
  kind: string;
};

type SessionFormProps = {
  slug: string;
  levels: Level[];
  audiences: Audience[];
  formats: Partial<Record<Format, string[]>>;
  modules: ModuleInfo[];
};

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text hover:border-primary";

export function SessionForm({ slug, levels, audiences, formats, modules }: SessionFormProps) {
  const searchParams = useSearchParams();
  const availableFormats = FORMATS.filter((format) => formats[format]);
  const initial = parseSessionConfig(new URLSearchParams(searchParams.toString()), availableFormats);

  const [level, setLevel] = useState<Level>(initial.level);
  const [audience, setAudience] = useState<Audience | null>(initial.audience);
  const [format, setFormat] = useState<Format>(initial.format);
  const [copied, setCopied] = useState(false);
  // Sequences unticked by the trainer (kept across format changes).
  const [skipped, setSkipped] = useState<string[]>(() =>
    initial.modules ? (formats[initial.format] ?? []).filter((id) => !initial.modules?.includes(id)) : [],
  );

  const available = useMemo(() => {
    const ids = formats[format] ?? [];
    return modules.filter((module) => ids.includes(module.id) && (!module.levels || module.levels.includes(level)));
  }, [formats, format, modules, level]);
  const included = available.filter((module) => !skipped.includes(module.id));
  const durationOf = (module: ModuleInfo) => module.durations[format] ?? module.duration;
  const total = included.reduce((sum, module) => sum + durationOf(module), 0);

  const formatIds = formats[format] ?? [];
  const hasSkipped = formatIds.some((id) => skipped.includes(id));
  const search = sessionSearch({
    level,
    audience,
    format,
    modules: hasSkipped ? formatIds.filter((id) => !skipped.includes(id)) : null,
  });
  const sessionHref = `/formations/${slug}/session?${search}`;

  const toggle = (id: string) =>
    setSkipped((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));

  async function copyLink() {
    await navigator.clipboard.writeText(new URL(sessionHref, window.location.origin).toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function openPresenter() {
    window.open(`${sessionHref}&vue=presentateur`, `presenter-${slug}`, "popup,width=1400,height=860");
  }

  function reset() {
    if (window.confirm("Effacer les réponses saisies lors de la dernière session ?")) clearDeckStore(slug);
  }

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form className="grid content-start gap-6" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-2">
          <label htmlFor="level" className="type-eyebrow text-text-muted">
            Niveau
          </label>
          <select id="level" className={fieldClass} value={level} onChange={(e) => setLevel(e.target.value as Level)}>
            {levels.map((value) => (
              <option key={value} value={value}>
                {LABELS.level[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="audience" className="type-eyebrow text-text-muted">
            Public
          </label>
          <select
            id="audience"
            className={fieldClass}
            value={audience ?? ""}
            onChange={(e) => setAudience((e.target.value || null) as Audience | null)}
          >
            <option value="">Tous publics</option>
            {audiences.map((value) => (
              <option key={value} value={value}>
                {LABELS.audience[value]}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="grid gap-2">
          <legend className="type-eyebrow mb-2 text-text-muted">Format</legend>
          <div className="flex flex-wrap gap-2">
            {availableFormats.map((value) => (
              <label
                key={value}
                className="cursor-pointer rounded-pill border border-border bg-surface px-4 py-2 font-medium has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-on-primary has-[:focus-visible]:outline-2"
              >
                <input
                  type="radio"
                  name="format"
                  value={value}
                  checked={format === value}
                  onChange={() => setFormat(value)}
                  className="sr-only"
                />
                {LABELS.format[value]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={sessionHref}
            className="inline-flex items-center gap-2 rounded-pill bg-primary px-6 py-3 font-semibold text-on-primary no-underline"
          >
            <Play size={18} aria-hidden="true" />
            Lancer la session
          </Link>
          <button
            type="button"
            onClick={openPresenter}
            className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-5 py-3 font-semibold"
          >
            <MonitorPlay size={18} aria-hidden="true" />
            Vue présentateur
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-5 py-3 font-semibold"
          >
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            {copied ? "Lien copié" : "Copier le lien"}
          </button>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex w-fit items-center gap-2 text-sm text-text-muted hover:text-text"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Effacer les réponses de la dernière session
        </button>
      </form>

      <section aria-labelledby="plan-title" className="rounded-card border border-border bg-surface p-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="plan-title" className="type-subtitle text-xl">
            Déroulé
          </h2>
          <p className="text-sm text-text-muted">
            {included.length} séquences · {Math.floor(total / 60)} h {String(total % 60).padStart(2, "0")}
          </p>
        </div>
        <ol className="grid gap-1">
          {available.map((module) => {
            const checked = !skipped.includes(module.id);
            return (
              <li key={module.id}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-2 ${
                    checked ? "" : "text-text-muted line-through"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(module.id)}
                    className="size-4 accent-primary"
                  />
                  <span className="font-mono text-xs text-text-muted no-underline">{module.id}</span>
                  <span className="flex-1">{module.title}</span>
                  <span className="text-sm tabular-nums text-text-muted">{durationOf(module)} min</span>
                </label>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-xs text-text-muted">Décochez une séquence pour la retirer de cette session.</p>
        <p className="mt-6 border-t border-border pt-4 text-sm text-text-muted">
          En session : <kbd>→</kbd> / <kbd>espace</kbd> avancer · <kbd>←</kbd> reculer · <kbd>R</kbd> revenir au début · <kbd>P</kbd> vue présentateur ·{" "}
          <kbd>F</kbd> plein écran · <kbd>T</kbd> thème · <kbd>B</kbd> masquer l&apos;écran · <kbd>Échap</kbd> revenir ici
        </p>
      </section>
    </div>
  );
}
