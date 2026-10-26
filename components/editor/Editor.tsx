"use client";

import {
  ChevronDown,
  ChevronUp,
  Circle,
  Copy,
  Minus,
  Play,
  Plus,
  Redo2,
  Square,
  Trash2,
  Type,
  Undo2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasView } from "@/components/canvas/CanvasView";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { createElement, createSlide, type CanvasElement, type CanvasModule, type ElementType } from "@/lib/canvas/model";
import { Inspector } from "./Inspector";
import { Stage } from "./Stage";
import { useDialog } from "@/components/ui/useDialog";
import { cloneElement, cloneSlide, useEditorState } from "./state";

type ModuleSummary = { id: string; file: string; title: string; source: "mdx" | "canvas" };
type SaveStatus = "idle" | "saving" | "saved" | "error";

const TOOLS: { type: ElementType; label: string; icon: typeof Type }[] = [
  { type: "text", label: "Texte", icon: Type },
  { type: "rect", label: "Rectangle", icon: Square },
  { type: "ellipse", label: "Ellipse", icon: Circle },
  { type: "line", label: "Ligne", icon: Minus },
];

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export function Editor({ slug, title }: { slug: string; title: string }) {
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const editor = useEditorState();
  const { state } = editor;
  const clipboard = useRef<CanvasElement[]>([]);
  const { dialog, ask, confirm } = useDialog();

  const deck = state.module;
  const slide = deck?.slides[state.slideIndex];
  const selection = slide?.elements.filter((element) => state.selected.includes(element.id)) ?? [];

  /* ---------------------------------------------------------------- */
  /* Loading and saving                                                */
  /* ---------------------------------------------------------------- */

  const refreshModules = useCallback(async () => {
    const response = await fetch(`/api/editor/${slug}`);
    if (!response.ok) return [] as ModuleSummary[];
    const list = (await response.json()) as ModuleSummary[];
    setModules(list);
    return list;
  }, [slug]);

  useEffect(() => {
    let active = true;
    fetch(`/api/editor/${slug}`)
      .then((response) => (response.ok ? (response.json() as Promise<ModuleSummary[]>) : []))
      .then((list) => {
        if (!active) return;
        setModules(list);
        const first = list.find((item) => item.source === "canvas");
        if (first) setModuleId(first.id);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const { load } = editor;
  useEffect(() => {
    if (!moduleId) return;
    fetch(`/api/editor/${slug}/${moduleId}`)
      .then((response) => (response.ok ? (response.json() as Promise<CanvasModule>) : null))
      .then((data) => {
        if (data) load(data);
      });
  }, [slug, moduleId, load]);

  // Autosave, 700 ms after the last change.
  useEffect(() => {
    if (!deck || !moduleId || state.revision === 0) return;
    const timer = window.setTimeout(async () => {
      setStatus("saving");
      const response = await fetch(`/api/editor/${slug}/${moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deck),
      });
      setStatus(response.ok ? "saved" : "error");
    }, 700);
    return () => window.clearTimeout(timer);
  }, [deck, moduleId, slug, state.revision]);

  async function createSequence() {
    const name = await ask({
      title: "Nouvelle séquence",
      message: "Une séquence regroupe plusieurs slides (par exemple « Accroche » ou « Comment ça marche »).",
      placeholder: "Titre de la séquence",
      confirmLabel: "Créer",
    });
    if (!name) return;
    const data: CanvasModule = { title: name.trim(), kind: "core", duration: 10, slides: [createSlide()] };
    const response = await fetch(`/api/editor/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return;
    const { id } = (await response.json()) as { id: string };
    await refreshModules();
    setModuleId(id);
  }

  async function publishContent() {
    const note = await ask({
      title: "Publier sur GitHub",
      message: "Vos modifications seront enregistrées dans l'historique du projet et envoyées sur GitHub. Décrivez-les en quelques mots.",
      defaultValue: "mise à jour des slides",
      confirmLabel: "Publier",
    });
    if (note === null) return;
    setMessage("Publication en cours…");
    const response = await fetch("/api/editor/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: note }),
    });
    const result = (await response.json()) as { published: boolean; reason?: string; files?: string[] };
    setMessage(
      result.published
        ? `Publié sur GitHub (${result.files?.length ?? 0} fichier(s)).`
        : `Non publié : ${result.reason ?? "erreur inconnue"}`,
    );
  }

  /* ---------------------------------------------------------------- */
  /* Editing helpers                                                   */
  /* ---------------------------------------------------------------- */

  const index = state.slideIndex;
  const { updateSlide, updateElements, select, change, setSlide, undo, redo } = editor;

  const addElement = (type: ElementType) => {
    const element = createElement(type);
    updateSlide(index, (current) => ({ ...current, elements: [...current.elements, element] }));
    select([element.id]);
  };

  const deleteSelection = useCallback(() => {
    if (!state.selected.length) return;
    updateSlide(index, (current) => ({
      ...current,
      elements: current.elements.filter((element) => !state.selected.includes(element.id)),
    }));
    select([]);
  }, [index, select, state.selected, updateSlide]);

  const duplicateSelection = useCallback(() => {
    if (!slide || !state.selected.length) return;
    const copies = slide.elements.filter((element) => state.selected.includes(element.id)).map((element) => cloneElement(element));
    updateSlide(index, (current) => ({ ...current, elements: [...current.elements, ...copies] }));
    select(copies.map((element) => element.id));
  }, [index, select, slide, state.selected, updateSlide]);

  const arrange = (direction: "front" | "back") =>
    updateSlide(index, (current) => {
      const chosen = current.elements.filter((element) => state.selected.includes(element.id));
      const others = current.elements.filter((element) => !state.selected.includes(element.id));
      return { ...current, elements: direction === "front" ? [...others, ...chosen] : [...chosen, ...others] };
    });

  const moveSlide = (from: number, to: number) =>
    change((current) => {
      if (to < 0 || to >= current.slides.length) return current;
      const slides = [...current.slides];
      const [moved] = slides.splice(from, 1);
      if (moved) slides.splice(to, 0, moved);
      return { ...current, slides };
    });

  // Keyboard shortcuts (Figma-like).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTyping(event.target)) return;
      if (event.target instanceof Element && event.target.closest("dialog")) return;
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      if (mod && key === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if ((mod && key === "y") || (mod && key === "z" && event.shiftKey)) {
        event.preventDefault();
        redo();
      } else if (mod && key === "d") {
        event.preventDefault();
        duplicateSelection();
      } else if (mod && key === "c" && slide) {
        clipboard.current = slide.elements.filter((element) => state.selected.includes(element.id));
      } else if (mod && key === "v" && clipboard.current.length) {
        event.preventDefault();
        const copies = clipboard.current.map((element) => cloneElement(element));
        updateSlide(index, (current) => ({ ...current, elements: [...current.elements, ...copies] }));
        select(copies.map((element) => element.id));
      } else if (key === "delete" || key === "backspace") {
        event.preventDefault();
        deleteSelection();
      } else if (key === "escape") {
        select([]);
      } else if (key.startsWith("arrow") && state.selected.length) {
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        const dx = key === "arrowleft" ? -step : key === "arrowright" ? step : 0;
        const dy = key === "arrowup" ? -step : key === "arrowdown" ? step : 0;
        updateElements(index, state.selected, (element) => ({ x: element.x + dx, y: element.y + dy }));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteSelection, duplicateSelection, index, redo, select, slide, state.selected, undo, updateElements, updateSlide]);

  /* ---------------------------------------------------------------- */
  /* Layout                                                            */
  /* ---------------------------------------------------------------- */

  const statusLabel = { idle: "", saving: "Enregistrement…", saved: "Enregistré", error: "Erreur d'enregistrement" }[status];

  return (
    <div className="editor">
      {dialog}
      <header className="editor-bar">
        <Link href="/editeur" className="editor-brand no-underline">
          Éditeur<span className="text-accent">.</span>
        </Link>
        <span className="editor-title">{title}</span>
        <select
          className="editor-input editor-module-select"
          value={moduleId ?? ""}
          onChange={(event) => setModuleId(event.target.value)}
          aria-label="Séquence"
        >
          <option value="" disabled>
            Choisir une séquence
          </option>
          {modules.map((item) => (
            <option key={item.id} value={item.id} disabled={item.source === "mdx"}>
              {item.id} · {item.title}
              {item.source === "mdx" ? " (MDX, conversion à venir)" : ""}
            </option>
          ))}
        </select>
        <button type="button" className="editor-button" onClick={createSequence}>
          <Plus size={16} aria-hidden="true" /> Séquence
        </button>

        <div className="editor-tools" role="toolbar" aria-label="Ajouter">
          {TOOLS.map(({ type, label, icon: Icon }) => (
            <button key={type} type="button" className="editor-button" onClick={() => addElement(type)} disabled={!slide}>
              <Icon size={16} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>

        <div className="editor-actions">
          <button type="button" className="editor-icon-button" onClick={undo} disabled={!state.past.length} title="Annuler (Ctrl+Z)" aria-label="Annuler">
            <Undo2 size={16} aria-hidden="true" />
          </button>
          <button type="button" className="editor-icon-button" onClick={redo} disabled={!state.future.length} title="Rétablir (Ctrl+Y)" aria-label="Rétablir">
            <Redo2 size={16} aria-hidden="true" />
          </button>
          <span className="editor-status" aria-live="polite">
            {statusLabel}
          </span>
          {moduleId && (
            <Link
              href={`/formations/${slug}/session?modules=${moduleId}`}
              target="_blank"
              className="editor-button no-underline"
            >
              <Play size={16} aria-hidden="true" /> Présenter
            </Link>
          )}
          <button type="button" className="editor-button is-primary" onClick={publishContent}>
            <UploadCloud size={16} aria-hidden="true" /> Publier
          </button>
          <ThemeToggle compact />
        </div>
      </header>

      {message && (
        <p className="editor-message" role="status">
          {message}
          <button type="button" onClick={() => setMessage(null)} aria-label="Fermer">
            ×
          </button>
        </p>
      )}

      <aside className="editor-slides" aria-label="Slides">
        {deck?.slides.map((item, slideIndex) => (
          <div key={item.id} className="editor-thumb-row">
            <button
              type="button"
              className="editor-thumb"
              aria-current={slideIndex === index || undefined}
              aria-label={`Slide ${slideIndex + 1}${item.name ? ` : ${item.name}` : ""}`}
              onClick={() => setSlide(slideIndex)}
            >
              <span className="editor-thumb-number">{slideIndex + 1}</span>
              <span className="editor-thumb-canvas">
                <CanvasView slide={item} />
              </span>
            </button>
            {slideIndex === index && (
              <div className="editor-thumb-actions">
                <button type="button" onClick={() => moveSlide(slideIndex, slideIndex - 1)} aria-label="Monter">
                  <ChevronUp size={14} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => moveSlide(slideIndex, slideIndex + 1)} aria-label="Descendre">
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Dupliquer la slide"
                  onClick={() => {
                    change((current) => {
                      const slides = [...current.slides];
                      slides.splice(slideIndex + 1, 0, cloneSlide(item));
                      return { ...current, slides };
                    });
                    setSlide(slideIndex + 1);
                  }}
                >
                  <Copy size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Supprimer la slide"
                  disabled={deck.slides.length === 1}
                  onClick={async () => {
                    if (await confirm({ title: "Supprimer cette slide ?", confirmLabel: "Supprimer", danger: true })) {
                      change((current) => ({ ...current, slides: current.slides.filter((_, i) => i !== slideIndex) }));
                    }
                  }}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        ))}
        {deck && (
          <button
            type="button"
            className="editor-button editor-add-slide"
            onClick={() => {
              change((current) => {
                const slides = [...current.slides];
                slides.splice(index + 1, 0, createSlide());
                return { ...current, slides };
              });
              setSlide(index + 1);
            }}
          >
            <Plus size={16} aria-hidden="true" /> Nouvelle slide
          </button>
        )}
      </aside>

      <main className="editor-canvas">
        {slide ? (
          <Stage
            slide={slide}
            selected={state.selected}
            onSelect={select}
            onChange={(changes) =>
              updateSlide(index, (current) => ({
                ...current,
                elements: current.elements.map((element) =>
                  changes[element.id] ? { ...element, ...changes[element.id] } : element,
                ),
              }))
            }
          />
        ) : (
          <div className="editor-empty">
            <p>
              {modules.some((item) => item.source === "canvas")
                ? "Choisissez une séquence."
                : "Aucune séquence modifiable pour l'instant. Créez-en une avec « + Séquence »."}
            </p>
          </div>
        )}
      </main>

      <aside className="editor-panel" aria-label="Propriétés">
        {slide && (
          <Inspector
            slide={slide}
            selection={selection}
            onElements={(patch) => updateElements(index, state.selected, patch)}
            onSlide={(update) => updateSlide(index, update)}
            onDelete={deleteSelection}
            onDuplicate={duplicateSelection}
            onArrange={arrange}
          />
        )}
      </aside>
    </div>
  );
}
