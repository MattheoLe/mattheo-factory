"use client";

import { Check, ChevronLeft, ChevronRight, Info, Play, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logotype } from "@/components/brand";
import { useDeckStore } from "@/components/presenter/useDeckStore";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LABELS, type Audience, type Format, type Level } from "@/lib/session";
import { Poster } from "./Poster";

export type CatalogueFormation = {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  pillar: "idees" | "produits" | "technologie" | "impact";
  status: "pilote" | "v1" | "bientot";
  promise: string;
  keyMessage?: string;
  highlight?: string;
  audiences: Audience[];
  levels: Level[];
  formats: Format[];
  tags: string[];
  /** Episodes (sequences of the reference format) — only for available courses */
  episodes: { id: string; title: string; duration: number }[];
};

const PILLARS = [
  { key: "technologie", label: "Technologie" },
  { key: "produits", label: "Produits" },
  { key: "idees", label: "Idées" },
  { key: "impact", label: "Impact" },
] as const;

const EMPTY_LIST: string[] = [];

function isAvailable(formation: CatalogueFormation) {
  return formation.episodes.length > 0;
}

function totalMinutes(formation: CatalogueFormation) {
  return formation.episodes.reduce((sum, episode) => sum + episode.duration, 0);
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours} h ${String(minutes % 60).padStart(2, "0")}` : `${minutes} min`;
}

function levelRange(levels: Level[]) {
  const first = levels[0];
  const last = levels[levels.length - 1];
  if (!first || !last) return "";
  return first === last ? LABELS.level[first] : `${LABELS.level[first]} → ${LABELS.level[last]}`;
}

/** Netflix-like catalogue: billboard, rows by category, top 10, my list, resume. */
export function Catalogue({ formations }: { formations: CatalogueFormation[] }) {
  const [favorites, setFavorites] = useDeckStore<string[]>("catalogue", "favoris", EMPTY_LIST);
  const [opened, setOpened] = useState<CatalogueFormation | null>(null);

  const featured = formations.find((formation) => formation.status === "pilote") ?? formations[0];
  const toggleFavorite = (slug: string) =>
    setFavorites((list) => (list.includes(slug) ? list.filter((item) => item !== slug) : [...list, slug]));

  const tileProps = { favorites, onToggleFavorite: toggleFavorite, onOpen: setOpened };
  const top = formations.filter((formation) => formation.status !== "bientot");
  const myList = formations.filter((formation) => favorites.includes(formation.slug));

  return (
    <div className="catalogue">
      <header className="catalogue-header">
        <Link href="/" className="rounded-md no-underline" aria-label="Accueil">
          <Logotype size="sm" className="text-lg" />
        </Link>
        <nav aria-label="Catalogue" className="catalogue-nav">
          <Link href="/">Accueil</Link>
          <a href="#formations" aria-current="page">
            Formations
          </a>
          <a href="#ma-liste">Ma liste</a>
        </nav>
        <ThemeToggle compact />
      </header>

      {featured && (
        <Billboard
          formation={featured}
          inList={favorites.includes(featured.slug)}
          onToggleFavorite={() => toggleFavorite(featured.slug)}
          onOpen={() => setOpened(featured)}
        />
      )}

      <main id="formations" className="catalogue-rows">
        <ResumeRow formations={formations.filter(isAvailable)} />

        <Row title="Top 10 des formations du moment">
          {top.slice(0, 10).map((formation, index) => (
            <li key={formation.slug} className="top-item">
              <span className="top-rank" aria-label={`Numéro ${index + 1}`}>
                {index + 1}
              </span>
              <Tile formation={formation} {...tileProps} />
            </li>
          ))}
        </Row>

        <section id="ma-liste" className="scroll-mt-24">
          {myList.length > 0 ? (
            <Row title="Ma liste">
              {myList.map((formation) => (
                <li key={formation.slug}>
                  <Tile formation={formation} {...tileProps} />
                </li>
              ))}
            </Row>
          ) : (
            <div className="row">
              <h2 className="row-title">Ma liste</h2>
              <p className="row-empty">
                Ajoutez des formations avec le bouton <Plus size={14} aria-hidden="true" className="inline" /> pour les
                retrouver ici.
              </p>
            </div>
          )}
        </section>

        {PILLARS.map((pillar) => (
          <Row key={pillar.key} title={pillar.label}>
            {formations
              .filter((formation) => formation.pillar === pillar.key)
              .map((formation) => (
                <li key={formation.slug}>
                  <Tile formation={formation} {...tileProps} />
                </li>
              ))}
          </Row>
        ))}

        <Row title="Grand public">
          {formations
            .filter((formation) => formation.tags.includes("grand-public") || formation.audiences.includes("seniors"))
            .map((formation) => (
              <li key={formation.slug}>
                <Tile formation={formation} {...tileProps} />
              </li>
            ))}
        </Row>

        <Row title="Bientôt disponibles">
          {formations
            .filter((formation) => formation.status === "bientot")
            .map((formation) => (
              <li key={formation.slug}>
                <Tile formation={formation} {...tileProps} />
              </li>
            ))}
        </Row>
      </main>

      {opened && (
        <InfoSheet
          formation={opened}
          inList={favorites.includes(opened.slug)}
          onToggleFavorite={() => toggleFavorite(opened.slug)}
          onClose={() => setOpened(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Billboard({
  formation,
  inList,
  onToggleFavorite,
  onOpen,
}: {
  formation: CatalogueFormation;
  inList: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}) {
  return (
    <section className="billboard" data-theme="dark" aria-labelledby="billboard-title">
      <Poster {...formation} variant="hero" />
      <div className="billboard-shade" />
      <div className="billboard-content">
        <p className="billboard-kicker">
          <span className="poster-mark">
            B<span className="text-accent">.</span>
          </span>
          Formation · N°1 des formations
        </p>
        <h1 id="billboard-title" className="billboard-title">
          {formation.title}
          {formation.subtitle && <span className="billboard-subtitle"> {formation.subtitle}</span>}
        </h1>
        <Meta formation={formation} />
        <p className="billboard-promise">{formation.promise}</p>
        <div className="billboard-actions">
          <PlayButton formation={formation} large />
          <button type="button" className="cta-secondary" onClick={onOpen}>
            <Info size={20} aria-hidden="true" />
            Plus d&apos;infos
          </button>
          <FavoriteButton inList={inList} onToggle={onToggleFavorite} label={formation.title} />
        </div>
      </div>
    </section>
  );
}

function Meta({ formation }: { formation: CatalogueFormation }) {
  const available = isAvailable(formation);
  return (
    <p className="meta">
      {formation.status === "pilote" && <span className="meta-match">Nouveau</span>}
      {available ? (
        <span>{formation.episodes.length} épisodes</span>
      ) : (
        <span>Bientôt</span>
      )}
      {available && <span>{formatDuration(totalMinutes(formation))}</span>}
      <span className="meta-box">{levelRange(formation.levels)}</span>
      <span>{formation.formats.map((format) => LABELS.format[format]).join(" · ")}</span>
    </p>
  );
}

function PlayButton({ formation, large = false }: { formation: CatalogueFormation; large?: boolean }) {
  if (!isAvailable(formation)) {
    return (
      <span className={`cta-play is-disabled ${large ? "is-large" : ""}`} aria-disabled="true">
        Bientôt
      </span>
    );
  }
  return (
    <Link href={`/formations/${formation.slug}/configurer`} className={`cta-play ${large ? "is-large" : ""}`}>
      <Play size={large ? 22 : 16} aria-hidden="true" fill="currentColor" />
      {large ? "Lancer" : <span className="sr-only">Lancer {formation.title}</span>}
    </Link>
  );
}

function FavoriteButton({ inList, onToggle, label }: { inList: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className="cta-round"
      onClick={onToggle}
      aria-pressed={inList}
      aria-label={inList ? `Retirer ${label} de ma liste` : `Ajouter ${label} à ma liste`}
      title={inList ? "Retirer de ma liste" : "Ajouter à ma liste"}
    >
      {inList ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */

function Row({ title, children }: { title: string; children: ReactNode }) {
  const scroller = useRef<HTMLUListElement>(null);
  const scroll = (direction: 1 | -1) =>
    scroller.current?.scrollBy({ left: direction * scroller.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <section className="row" aria-label={title}>
      <h2 className="row-title">{title}</h2>
      <div className="row-frame">
        <button type="button" className="row-arrow is-left" onClick={() => scroll(-1)} aria-label="Défiler à gauche">
          <ChevronLeft aria-hidden="true" />
        </button>
        <ul ref={scroller} className="row-track">
          {children}
        </ul>
        <button type="button" className="row-arrow is-right" onClick={() => scroll(1)} aria-label="Défiler à droite">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function Tile({
  formation,
  favorites,
  onToggleFavorite,
  onOpen,
}: {
  formation: CatalogueFormation;
  favorites: string[];
  onToggleFavorite: (slug: string) => void;
  onOpen: (formation: CatalogueFormation) => void;
}) {
  return (
    <article className="tile" aria-label={formation.title}>
      <button type="button" className="tile-poster" onClick={() => onOpen(formation)} aria-label={`Infos : ${formation.title}`}>
        <Poster {...formation} />
      </button>
      <div className="tile-panel">
        <div className="tile-actions">
          <PlayButton formation={formation} />
          <FavoriteButton
            inList={favorites.includes(formation.slug)}
            onToggle={() => onToggleFavorite(formation.slug)}
            label={formation.title}
          />
          <button
            type="button"
            className="cta-round ml-auto"
            onClick={() => onOpen(formation)}
            aria-label={`Plus d'infos sur ${formation.title}`}
            title="Plus d'infos"
          >
            <Info size={18} aria-hidden="true" />
          </button>
        </div>
        <Meta formation={formation} />
        <p className="tile-tags">
          {formation.audiences.slice(0, 3).map((audience) => LABELS.audience[audience]).join(" · ")}
        </p>
      </div>
    </article>
  );
}

const START = { slide: 0, step: 0 };

/**
 * "Reprendre la formation": reads the position and slide total saved by the deck
 * (localStorage, ADR-012). Only the pilot is presentable for now.
 */
function ResumeRow({ formations }: { formations: CatalogueFormation[] }) {
  const first = formations[0];
  const [position] = useDeckStore<{ slide: number; step: number }>(first?.slug ?? "-", "position", START);
  const [total] = useDeckStore<number>(first?.slug ?? "-", "total", 0);
  if (!first || position.slide === 0 || total === 0) return null;

  return (
    <Row title="Reprendre la formation">
      <li>
        <Link
          href={`/formations/${first.slug}/session`}
          className="tile-resume no-underline"
          aria-label={`Reprendre ${first.title}, diapositive ${position.slide + 1} sur ${total}`}
        >
          <Poster {...first} />
          <span className="tile-resume-play" aria-hidden="true">
            <Play size={28} fill="currentColor" />
          </span>
          <span className="tile-progress" aria-hidden="true">
            <span style={{ width: `${Math.round(((position.slide + 1) / total) * 100)}%` }} />
          </span>
        </Link>
        <p className="tile-resume-label">
          Diapositive {position.slide + 1} / {total}
        </p>
      </li>
    </Row>
  );
}

/* ------------------------------------------------------------------ */

function InfoSheet({
  formation,
  inList,
  onToggleFavorite,
  onClose,
}: {
  formation: CatalogueFormation;
  inList: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  // Opened as a modal (focus trap, Escape, backdrop). No close() in a cleanup:
  // it would fire onClose; unmounting removes the dialog anyway.
  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sheet-hero" data-theme="dark">
        <Poster {...formation} variant="hero" />
        <div className="billboard-shade" />
        <button type="button" className="sheet-close" onClick={onClose} aria-label="Fermer">
          <X aria-hidden="true" />
        </button>
        <div className="sheet-hero-content">
          <h2 id="sheet-title" className="billboard-title is-small">
            {formation.title}
          </h2>
          <div className="billboard-actions">
            <PlayButton formation={formation} large />
            <FavoriteButton inList={inList} onToggle={onToggleFavorite} label={formation.title} />
          </div>
        </div>
      </div>

      <div className="sheet-body">
        <div className="sheet-columns">
          <div className="grid content-start gap-4">
            <Meta formation={formation} />
            <p className="text-lg">{formation.promise}</p>
            {formation.keyMessage && <p className="text-text-muted">{formation.keyMessage}</p>}
          </div>
          <dl className="sheet-facts">
            <div>
              <dt>Publics</dt>
              <dd>{formation.audiences.map((audience) => LABELS.audience[audience]).join(", ")}</dd>
            </div>
            <div>
              <dt>Niveaux</dt>
              <dd>{formation.levels.map((level) => LABELS.level[level]).join(", ")}</dd>
            </div>
            <div>
              <dt>Formats</dt>
              <dd>{formation.formats.map((format) => LABELS.format[format]).join(", ")}</dd>
            </div>
            {formation.highlight && (
              <div>
                <dt>Moment fort</dt>
                <dd>{formation.highlight}</dd>
              </div>
            )}
          </dl>
        </div>

        <h3 className="sheet-section">Épisodes</h3>
        {isAvailable(formation) ? (
          <ol className="episodes">
            {formation.episodes.map((episode, index) => (
              <li key={episode.id} className="episode">
                <span className="episode-number">{index + 1}</span>
                <span className="episode-title">{episode.title}</span>
                <span className="episode-duration">{episode.duration} min</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-text-muted">Cette formation est en cours d&apos;écriture. Bientôt disponible.</p>
        )}
      </div>
    </dialog>
  );
}
