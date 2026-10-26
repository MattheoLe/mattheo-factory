/**
 * "Canvas" slide format (ADR-014): a slide is a list of positioned elements on a
 * logical 1600 × 900 stage. Rendered with percentages and cqw, so it scales to any
 * screen exactly like the presentation engine.
 *
 * Colors are stored as content, never in code:
 *   "token:text"  → var(--text)        (adapts to light / dark)
 *   "token:grad-main" → var(--grad-main) (gradients, fills only)
 *   "#0057ff"     → custom color chosen in the editor
 */

export const STAGE = { width: 1600, height: 900 } as const;

export type ColorValue = string;

export type FontSettings = {
  /** "display" (Poppins), "sans" (Inter) or a font family name */
  family: string;
  size: number;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  align: "left" | "center" | "right";
  italic?: boolean;
  uppercase?: boolean;
};

export type ElementType = "text" | "rect" | "ellipse" | "line";

export type CanvasElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity?: number;
  locked?: boolean;
  /** text */
  text?: string;
  font?: FontSettings;
  /** text color, or line color */
  color?: ColorValue;
  /** background (shapes and text boxes); null = transparent */
  fill?: ColorValue | null;
  stroke?: { color: ColorValue; width: number } | null;
  radius?: number;
};

export type CanvasSlide = {
  id: string;
  name?: string;
  background: ColorValue;
  notes?: string;
  elements: CanvasElement[];
};

export type CanvasModule = {
  title: string;
  kind: string;
  duration: number;
  durations?: Record<string, number>;
  levels?: string[];
  slides: CanvasSlide[];
};

/** Semantic tokens offered by the editor (DA.md); the default library. */
export const COLOR_TOKENS: { token: string; label: string }[] = [
  { token: "text", label: "Texte" },
  { token: "text-muted", label: "Texte secondaire" },
  { token: "bg", label: "Fond" },
  { token: "surface", label: "Carte" },
  { token: "surface-2", label: "Zone secondaire" },
  { token: "border", label: "Bordure" },
  { token: "primary", label: "Cobalt" },
  { token: "primary-soft", label: "Cyan" },
  { token: "link", label: "Lien" },
  { token: "accent", label: "Orange signal" },
];

export const GRADIENT_TOKENS: { token: string; label: string }[] = [
  { token: "grad-main", label: "Dégradé principal" },
  { token: "grad-deep", label: "Dégradé profond" },
  { token: "grad-signal", label: "Dégradé signal" },
];

export function isGradient(value: ColorValue | null | undefined) {
  return Boolean(value?.startsWith("token:grad-"));
}

/** CSS value of a stored color. */
export function cssColor(value: ColorValue | null | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("token:")) return `var(--${value.slice(6)})`;
  return value;
}

/** CSS font-family of a stored family. */
export function cssFont(family: string) {
  if (family === "display") return "var(--font-display)";
  if (family === "sans") return "var(--font-sans)";
  return `"${family}", var(--font-sans)`;
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export const DEFAULT_FONT: FontSettings = {
  family: "sans",
  size: 40,
  weight: 400,
  lineHeight: 1.3,
  letterSpacing: 0,
  align: "left",
};

/** Factories for the elements the toolbar can add. */
export function createElement(type: ElementType): CanvasElement {
  const base = { id: newId(), rotation: 0 };
  switch (type) {
    case "text":
      return {
        ...base,
        type,
        x: 160,
        y: 360,
        w: 900,
        h: 140,
        text: "Votre texte",
        font: { ...DEFAULT_FONT, family: "display", size: 96, weight: 800, lineHeight: 1, letterSpacing: -0.03 },
        color: "token:text",
        fill: null,
      };
    case "rect":
      return { ...base, type, x: 600, y: 300, w: 400, h: 300, fill: "token:surface", radius: 24, stroke: { color: "token:border", width: 2 } };
    case "ellipse":
      return { ...base, type, x: 650, y: 300, w: 300, h: 300, fill: "token:primary" };
    case "line":
      return { ...base, type, x: 500, y: 448, w: 600, h: 4, color: "token:primary" };
  }
}

export function createSlide(): CanvasSlide {
  return { id: newId(), background: "token:bg", notes: "", elements: [] };
}

/** Light validation of data coming from disk or from the editor. */
export function isCanvasModule(value: unknown): value is CanvasModule {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CanvasModule>;
  return (
    typeof candidate.title === "string" &&
    typeof candidate.kind === "string" &&
    typeof candidate.duration === "number" &&
    Array.isArray(candidate.slides) &&
    candidate.slides.every(
      (slide) => slide && typeof slide.id === "string" && Array.isArray(slide.elements),
    )
  );
}
