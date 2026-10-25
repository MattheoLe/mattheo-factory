"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Maximize,
  MonitorPlay,
  RotateCcw,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LABELS, parseSessionConfig } from "@/lib/session";
import { SessionProvider, type SessionContextValue } from "./SessionContext";
import { clearDeckStore, useDeckStore } from "./useDeckStore";

type DeckProps = {
  deckId: string;
  title: string;
  /** Ordered module ids per format */
  formats: Partial<Record<string, string[]>>;
  children: ReactNode;
};

type Position = { slide: number; step: number };
const START: Position = { slide: 0, step: 0 };

function getSlides(track: HTMLElement | null): HTMLElement[] {
  return track ? Array.from(track.querySelectorAll<HTMLElement>("[data-slide]")) : [];
}

/** Steps of a slide in document order. List items inside [data-step-items] become steps too. */
function getSteps(slide: HTMLElement | undefined): HTMLElement[] {
  if (!slide) return [];
  slide
    .querySelectorAll("[data-step-items] > ul > li, [data-step-items] > ol > li")
    .forEach((item) => item.setAttribute("data-step", ""));
  return Array.from(slide.querySelectorAll<HTMLElement>("[data-step]"));
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export function Deck({ deckId, title, formats, children }: DeckProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme, setTheme } = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  const view = searchParams.get("vue") === "presentateur" ? "presenter" : "audience";
  const config = useMemo(
    () => parseSessionConfig(new URLSearchParams(searchParams.toString()), Object.keys(formats)),
    [searchParams, formats],
  );
  const session = useMemo<SessionContextValue>(
    () => ({
      deckId,
      config,
      view,
      moduleIds: config.modules ?? formats[config.format] ?? [],
    }),
    [deckId, config, view, formats],
  );

  const [position, setPosition] = useDeckStore<Position>(deckId, "position", START);
  const [startedAt, setStartedAt] = useDeckStore<number | null>(deckId, "startedAt", null);
  const [blank, setBlank] = useDeckStore<boolean>(deckId, "blank", false);
  const [, setTotal] = useDeckStore<number>(deckId, "total", 0);

  // Slide count follows the DOM (level/audience/format filters add or remove slides).
  const subscribeTrack = useCallback((onChange: () => void) => {
    const track = trackRef.current;
    if (!track) return () => {};
    const observer = new MutationObserver(onChange);
    observer.observe(track, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  const slideCount = useSyncExternalStore(
    subscribeTrack,
    () => getSlides(trackRef.current).length,
    () => 0,
  );

  const current = Math.max(0, Math.min(position.slide, slideCount - 1));
  const step = current === position.slide ? position.step : 0;

  const next = useCallback(() => {
    const slides = getSlides(trackRef.current);
    if (startedAt === null) setStartedAt(Date.now());
    if (step < getSteps(slides[current]).length) setPosition({ slide: current, step: step + 1 });
    else if (current < slides.length - 1) setPosition({ slide: current + 1, step: 0 });
  }, [current, step, startedAt, setPosition, setStartedAt]);

  const previous = useCallback(() => {
    const slides = getSlides(trackRef.current);
    if (step > 0) setPosition({ slide: current, step: step - 1 });
    else if (current > 0) setPosition({ slide: current - 1, step: getSteps(slides[current - 1]).length });
  }, [current, step, setPosition]);

  const goTo = useCallback((slide: number) => setPosition({ slide, step: 0 }), [setPosition]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  }, []);

  const openPresenter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("vue", "presentateur");
    window.open(`?${params.toString()}`, `presenter-${deckId}`, "popup,width=1400,height=860");
  }, [searchParams, deckId]);

  const configureHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("vue");
    const query = params.toString();
    return `/formations/${deckId}/configurer${query ? `?${query}` : ""}`;
  }, [searchParams, deckId]);

  const resetSession = useCallback(() => {
    if (window.confirm("Nouvelle session : effacer les réponses saisies et revenir au début ?")) {
      clearDeckStore(deckId);
    }
  }, [deckId]);

  // Slide total, read by the catalogue's "Reprendre" row.
  useEffect(() => {
    if (slideCount > 0) setTotal(slideCount);
  }, [slideCount, setTotal]);

  // Reflect position on the DOM: slide states, numbering, revealed steps, notes.
  useEffect(() => {
    const slides = getSlides(trackRef.current);
    slides.forEach((slide, index) => {
      const state =
        index === current ? "active" : index === current + 1 ? "next" : index < current ? "past" : "hidden";
      slide.dataset.state = state;
      const number = slide.querySelector(".slide-number");
      if (number) number.textContent = String(index + 1);
      slide.inert = index !== current;
      const steps = getSteps(slide);
      steps.forEach((element, stepIndex) => {
        const shown = index < current || (index === current && stepIndex < step);
        element.toggleAttribute("data-shown", shown);
      });
    });

    // Section numbers follow the sequences actually shown in this session.
    trackRef.current?.querySelectorAll("[data-auto-number]").forEach((element, index) => {
      element.textContent = String(index + 1).padStart(2, "0");
    });

    const notes = slides[current]?.querySelector("[data-notes]");
    if (notesRef.current) {
      notesRef.current.replaceChildren(...(notes ? Array.from(notes.cloneNode(true).childNodes) : []));
    }
  }, [current, step, slideCount, view]);

  // Keyboard control (PRD §3).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;
      const onButton = event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          next();
          break;
        case " ":
        case "Enter":
          if (onButton) return;
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          previous();
          break;
        case "Home":
        case "r":
        case "R":
          goTo(0);
          break;
        case "End":
          goTo(Math.max(0, slideCount - 1));
          break;
        case "t":
        case "T":
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "b":
        case "B":
          setBlank((value) => !value);
          break;
        case "p":
        case "P":
          openPresenter();
          break;
        case "Escape":
          if (document.fullscreenElement) return;
          router.push(configureHref);
          break;
        default:
          return;
      }
      event.preventDefault();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    next,
    previous,
    goTo,
    slideCount,
    resolvedTheme,
    setTheme,
    toggleFullscreen,
    setBlank,
    openPresenter,
    router,
    configureHref,
  ]);

  const progress = slideCount > 0 ? ((current + 1) / slideCount) * 100 : 0;
  const counter = `${slideCount > 0 ? current + 1 : 0} / ${slideCount}`;

  return (
    <SessionProvider value={session}>
      <div className="deck" data-view={view} data-blank={blank || undefined}>
        <div ref={trackRef} className="deck-track" aria-live="off">
          {children}
        </div>

        <p className="sr-only" aria-live="polite">
          Diapositive {counter}
        </p>

        {view === "audience" ? (
          <>
            <div className="deck-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <nav className="deck-hud" aria-label="Contrôles de la présentation">
              <HudButton label="Précédente (←)" onClick={previous}>
                <ChevronLeft size={18} />
              </HudButton>
              <span className="deck-hud-counter">{counter}</span>
              <HudButton label="Suivante (→ ou espace)" onClick={next}>
                <ChevronRight size={18} />
              </HudButton>
              <span className="deck-hud-sep" />
              <HudButton label="Vue présentateur (P)" onClick={openPresenter}>
                <MonitorPlay size={18} />
              </HudButton>
              <HudButton label="Plein écran (F)" onClick={toggleFullscreen}>
                <Maximize size={18} />
              </HudButton>
              <Link href={configureHref} className="deck-hud-button" aria-label="Configurer la session (Échap)" title="Configurer la session (Échap)">
                <Settings2 size={18} aria-hidden="true" />
              </Link>
            </nav>
          </>
        ) : (
          <PresenterPanel
            title={title}
            counter={counter}
            notesRef={notesRef}
            startedAt={startedAt}
            blank={blank}
            summary={[
              LABELS.level[config.level],
              config.audience ? LABELS.audience[config.audience] : "Tous publics",
              LABELS.format[config.format],
            ]}
            onPrevious={previous}
            onNext={next}
            onToggleBlank={() => setBlank((value) => !value)}
            onReset={resetSession}
            onRestartClock={() => setStartedAt(Date.now())}
          />
        )}
      </div>
    </SessionProvider>
  );
}

function HudButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="deck-hud-button" aria-label={label} title={label} onClick={onClick}>
      <span aria-hidden="true" className="contents">
        {children}
      </span>
    </button>
  );
}

type PresenterPanelProps = {
  title: string;
  counter: string;
  notesRef: React.RefObject<HTMLDivElement | null>;
  startedAt: number | null;
  blank: boolean;
  summary: string[];
  onPrevious: () => void;
  onNext: () => void;
  onToggleBlank: () => void;
  onReset: () => void;
  onRestartClock: () => void;
};

function PresenterPanel({
  title,
  counter,
  notesRef,
  startedAt,
  blank,
  summary,
  onPrevious,
  onNext,
  onToggleBlank,
  onReset,
  onRestartClock,
}: PresenterPanelProps) {
  return (
    <>
      <section className="presenter-notes" aria-label="Notes de l'orateur">
        <p className="type-eyebrow mb-3 text-text-muted">Notes</p>
        <div ref={notesRef} className="presenter-notes-body" />
      </section>
      <div className="presenter-bar">
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          <p className="text-sm text-text-muted">{summary.join(" · ")}</p>
        </div>
        <Clock startedAt={startedAt} onRestart={onRestartClock} />
        <div className="flex items-center gap-2">
          <button type="button" className="presenter-button" onClick={onPrevious} aria-label="Précédente">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <span className="min-w-20 text-center font-mono tabular-nums">{counter}</span>
          <button type="button" className="presenter-button" onClick={onNext} aria-label="Suivante">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="presenter-button"
            onClick={onToggleBlank}
            aria-pressed={blank}
            title="Masquer l'écran projeté (B)"
          >
            {blank ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            <span>{blank ? "Écran masqué" : "Écran visible"}</span>
          </button>
          <button type="button" className="presenter-button" onClick={onReset} title="Nouvelle session">
            <RotateCcw size={18} aria-hidden="true" />
            <span>Nouvelle session</span>
          </button>
          <ThemeToggle compact />
        </div>
      </div>
    </>
  );
}

function Clock({ startedAt, onRestart }: { startedAt: number | null; onRestart: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const elapsed = startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));
  const minutes = Math.floor(elapsed / 60);
  const seconds = String(elapsed % 60).padStart(2, "0");

  return (
    <button type="button" className="presenter-clock" onClick={onRestart} title="Relancer le chronomètre">
      <span className="font-mono text-2xl tabular-nums">
        {minutes}:{seconds}
      </span>
      <span className="text-xs text-text-muted">{startedAt === null ? "démarre à la 1re avance" : "écoulé"}</span>
    </button>
  );
}
