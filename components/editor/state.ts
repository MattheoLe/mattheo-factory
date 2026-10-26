"use client";

import { useCallback, useReducer } from "react";
import { newId, type CanvasElement, type CanvasModule, type CanvasSlide } from "@/lib/canvas/model";

/** Editor state with undo / redo history (ADR-014). */

type State = {
  module: CanvasModule | null;
  slideIndex: number;
  selected: string[];
  past: CanvasModule[];
  future: CanvasModule[];
  /** Incremented on every content change (drives autosave). */
  revision: number;
};

type Action =
  | { type: "load"; module: CanvasModule }
  | { type: "slide"; index: number }
  | { type: "select"; ids: string[] }
  | { type: "change"; update: (module: CanvasModule) => CanvasModule }
  | { type: "undo" }
  | { type: "redo" };

const HISTORY_LIMIT = 100;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load":
      return { module: action.module, slideIndex: 0, selected: [], past: [], future: [], revision: 0 };
    case "slide":
      return { ...state, slideIndex: action.index, selected: [] };
    case "select":
      return { ...state, selected: action.ids };
    case "change": {
      if (!state.module) return state;
      const next = action.update(state.module);
      if (next === state.module) return state;
      const slideIndex = Math.min(state.slideIndex, next.slides.length - 1);
      return {
        ...state,
        module: next,
        slideIndex: Math.max(0, slideIndex),
        past: [...state.past.slice(-HISTORY_LIMIT), state.module],
        future: [],
        revision: state.revision + 1,
      };
    }
    case "undo": {
      const previous = state.past[state.past.length - 1];
      if (!previous || !state.module) return state;
      return {
        ...state,
        module: previous,
        past: state.past.slice(0, -1),
        future: [state.module, ...state.future],
        slideIndex: Math.min(state.slideIndex, previous.slides.length - 1),
        selected: [],
        revision: state.revision + 1,
      };
    }
    case "redo": {
      const next = state.future[0];
      if (!next || !state.module) return state;
      return {
        ...state,
        module: next,
        past: [...state.past, state.module],
        future: state.future.slice(1),
        slideIndex: Math.min(state.slideIndex, next.slides.length - 1),
        selected: [],
        revision: state.revision + 1,
      };
    }
  }
}

const INITIAL: State = { module: null, slideIndex: 0, selected: [], past: [], future: [], revision: 0 };

export function useEditorState() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const change = useCallback((update: (module: CanvasModule) => CanvasModule) => dispatch({ type: "change", update }), []);

  /** Updates the current slide. */
  const updateSlide = useCallback(
    (index: number, update: (slide: CanvasSlide) => CanvasSlide) =>
      change((module) => ({
        ...module,
        slides: module.slides.map((slide, slideIndex) => (slideIndex === index ? update(slide) : slide)),
      })),
    [change],
  );

  /** Patches elements of a slide by id. */
  const updateElements = useCallback(
    (index: number, ids: string[], patch: (element: CanvasElement) => Partial<CanvasElement>) =>
      updateSlide(index, (slide) => ({
        ...slide,
        elements: slide.elements.map((element) => (ids.includes(element.id) ? { ...element, ...patch(element) } : element)),
      })),
    [updateSlide],
  );

  return {
    state,
    load: useCallback((module: CanvasModule) => dispatch({ type: "load", module }), []),
    setSlide: useCallback((index: number) => dispatch({ type: "slide", index }), []),
    select: useCallback((ids: string[]) => dispatch({ type: "select", ids }), []),
    undo: useCallback(() => dispatch({ type: "undo" }), []),
    redo: useCallback(() => dispatch({ type: "redo" }), []),
    change,
    updateSlide,
    updateElements,
  };
}

/** Deep copy with fresh ids (duplicate / paste). */
export function cloneElement(element: CanvasElement, offset = 24): CanvasElement {
  return { ...structuredClone(element), id: newId(), x: element.x + offset, y: element.y + offset };
}

export function cloneSlide(slide: CanvasSlide): CanvasSlide {
  return { ...structuredClone(slide), id: newId(), elements: slide.elements.map((element) => cloneElement(element, 0)) };
}
