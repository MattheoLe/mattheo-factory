"use client";

import {
  AlignCenter,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignLeft,
  AlignRight,
  AlignStartHorizontal,
  AlignStartVertical,
  ArrowDownToLine,
  ArrowUpToLine,
  Copy,
  Lock,
  Trash2,
  Unlock,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { DEFAULT_FONT, STAGE, type CanvasElement, type CanvasSlide, type FontSettings } from "@/lib/canvas/model";
import { ColorField, ContrastBadge, useContrast } from "./ColorField";

type InspectorProps = {
  slide: CanvasSlide;
  selection: CanvasElement[];
  onElements: (patch: (element: CanvasElement) => Partial<CanvasElement>) => void;
  onSlide: (update: (slide: CanvasSlide) => CanvasSlide) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArrange: (direction: "front" | "back") => void;
};

const FONTS = [
  { value: "display", label: "Poppins (titres)" },
  { value: "sans", label: "Inter (texte)" },
];

const WEIGHTS = [
  { value: 400, label: "Normal" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semi-gras" },
  { value: 800, label: "Extra-gras" },
];

/** Type-scale presets from DA.md (logical px on the 1600 stage). */
const SIZES = [
  { label: "Titre XL", size: 128, family: "display", weight: 800, lineHeight: 0.92, letterSpacing: -0.03 },
  { label: "Titre", size: 74, family: "display", weight: 800, lineHeight: 0.98, letterSpacing: -0.03 },
  { label: "Sous-titre", size: 38, family: "display", weight: 600, lineHeight: 1.2, letterSpacing: -0.01 },
  { label: "Texte", size: 32, family: "sans", weight: 400, lineHeight: 1.4, letterSpacing: 0 },
  { label: "Sur-titre", size: 18, family: "sans", weight: 600, lineHeight: 1.4, letterSpacing: 0.25 },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="editor-section">
      <h3 className="editor-section-title">{title}</h3>
      {children}
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="editor-number">
      <span>{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
      />
    </label>
  );
}

function IconButton({
  icon: Icon,
  label,
  onClick,
  pressed,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button type="button" className="editor-icon-button" title={label} aria-label={label} aria-pressed={pressed} onClick={onClick}>
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}

export function Inspector({ slide, selection, onElements, onSlide, onDelete, onDuplicate, onArrange }: InspectorProps) {
  const single = selection.length === 1 ? selection[0] : undefined;
  const textColor = single?.type === "text" ? single.color : undefined;
  const contrast = useContrast(textColor, single?.fill ?? slide.background);

  if (selection.length === 0) {
    return (
      <div className="editor-inspector">
        <Section title="Slide">
          <label className="editor-field">
            <span className="editor-label">Nom</span>
            <input
              className="editor-input"
              value={slide.name ?? ""}
              placeholder="Sans titre"
              onChange={(event) => onSlide((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
          <ColorField
            label="Fond"
            value={slide.background}
            gradients
            onChange={(value) => onSlide((current) => ({ ...current, background: value ?? "token:bg" }))}
          />
        </Section>
        <Section title="Notes de l'orateur">
          <textarea
            className="editor-input editor-notes"
            value={slide.notes ?? ""}
            placeholder="Ce que vous direz à l'oral (visible seulement dans la vue présentateur)."
            onChange={(event) => onSlide((current) => ({ ...current, notes: event.target.value }))}
          />
        </Section>
        <p className="editor-hint">Cliquez un élément pour le modifier. Glissez sur le fond pour en sélectionner plusieurs.</p>
      </div>
    );
  }

  const font: FontSettings = { ...DEFAULT_FONT, ...single?.font };
  const setFont = (patch: Partial<FontSettings>) =>
    onElements((element) => ({ font: { ...DEFAULT_FONT, ...element.font, ...patch } }));

  /** Aligns the selection: to the stage for one element, to the selection bounds for several. */
  const align = (mode: "left" | "hcenter" | "right" | "top" | "vcenter" | "bottom") => {
    const box =
      selection.length === 1
        ? { left: 0, top: 0, right: STAGE.width, bottom: STAGE.height }
        : {
            left: Math.min(...selection.map((element) => element.x)),
            top: Math.min(...selection.map((element) => element.y)),
            right: Math.max(...selection.map((element) => element.x + element.w)),
            bottom: Math.max(...selection.map((element) => element.y + element.h)),
          };
    onElements((element) => {
      switch (mode) {
        case "left":
          return { x: box.left };
        case "hcenter":
          return { x: Math.round((box.left + box.right - element.w) / 2) };
        case "right":
          return { x: box.right - element.w };
        case "top":
          return { y: box.top };
        case "vcenter":
          return { y: Math.round((box.top + box.bottom - element.h) / 2) };
        case "bottom":
          return { y: box.bottom - element.h };
      }
    });
  };

  return (
    <div className="editor-inspector">
      <Section title={selection.length > 1 ? `${selection.length} éléments` : "Élément"}>
        <div className="editor-row">
          <IconButton icon={AlignStartVertical} label="Aligner à gauche" onClick={() => align("left")} />
          <IconButton icon={AlignCenterVertical} label="Centrer horizontalement" onClick={() => align("hcenter")} />
          <IconButton icon={AlignEndVertical} label="Aligner à droite" onClick={() => align("right")} />
          <IconButton icon={AlignStartHorizontal} label="Aligner en haut" onClick={() => align("top")} />
          <IconButton icon={AlignCenterHorizontal} label="Centrer verticalement" onClick={() => align("vcenter")} />
          <IconButton icon={AlignEndHorizontal} label="Aligner en bas" onClick={() => align("bottom")} />
        </div>
        <div className="editor-row">
          <IconButton icon={ArrowUpToLine} label="Premier plan" onClick={() => onArrange("front")} />
          <IconButton icon={ArrowDownToLine} label="Arrière-plan" onClick={() => onArrange("back")} />
          <IconButton icon={Copy} label="Dupliquer (Ctrl+D)" onClick={onDuplicate} />
          {single && (
            <IconButton
              icon={single.locked ? Lock : Unlock}
              label={single.locked ? "Déverrouiller" : "Verrouiller"}
              pressed={single.locked}
              onClick={() => onElements((element) => ({ locked: !element.locked }))}
            />
          )}
          <IconButton icon={Trash2} label="Supprimer (Suppr)" onClick={onDelete} />
        </div>
        {single && (
          <div className="editor-grid">
            <NumberField label="X" value={single.x} onChange={(x) => onElements(() => ({ x }))} />
            <NumberField label="Y" value={single.y} onChange={(y) => onElements(() => ({ y }))} />
            <NumberField label="L" value={single.w} min={4} onChange={(w) => onElements(() => ({ w }))} />
            <NumberField label="H" value={single.h} min={2} onChange={(h) => onElements(() => ({ h }))} />
            <NumberField label="Rotation" value={single.rotation} onChange={(rotation) => onElements(() => ({ rotation }))} />
            <NumberField
              label="Opacité %"
              value={Math.round((single.opacity ?? 1) * 100)}
              min={0}
              max={100}
              onChange={(value) => onElements(() => ({ opacity: Math.min(1, Math.max(0, value / 100)) }))}
            />
          </div>
        )}
      </Section>

      {single?.type === "text" && (
        <Section title="Texte">
          <div className="editor-presets">
            {SIZES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="editor-chip"
                onClick={() =>
                  setFont({
                    family: preset.family,
                    size: preset.size,
                    weight: preset.weight,
                    lineHeight: preset.lineHeight,
                    letterSpacing: preset.letterSpacing,
                    uppercase: preset.label === "Sur-titre",
                  })
                }
              >
                {preset.label}
              </button>
            ))}
          </div>
          <label className="editor-field">
            <span className="editor-label">Police</span>
            <select className="editor-input" value={font.family} onChange={(event) => setFont({ family: event.target.value })}>
              {FONTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="editor-grid">
            <NumberField label="Taille" value={font.size} min={8} onChange={(size) => setFont({ size })} />
            <label className="editor-number">
              <span>Graisse</span>
              <select value={font.weight} onChange={(event) => setFont({ weight: Number(event.target.value) })}>
                {WEIGHTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <NumberField label="Interligne" value={font.lineHeight} step={0.05} min={0.6} onChange={(lineHeight) => setFont({ lineHeight })} />
            <NumberField
              label="Espacement"
              value={font.letterSpacing}
              step={0.01}
              onChange={(letterSpacing) => setFont({ letterSpacing })}
            />
          </div>
          <div className="editor-row">
            <IconButton icon={AlignLeft} label="Aligné à gauche" pressed={font.align === "left"} onClick={() => setFont({ align: "left" })} />
            <IconButton icon={AlignCenter} label="Centré" pressed={font.align === "center"} onClick={() => setFont({ align: "center" })} />
            <IconButton icon={AlignRight} label="Aligné à droite" pressed={font.align === "right"} onClick={() => setFont({ align: "right" })} />
            <button type="button" className="editor-chip" aria-pressed={font.uppercase} onClick={() => setFont({ uppercase: !font.uppercase })}>
              AA
            </button>
            <button type="button" className="editor-chip" aria-pressed={font.italic} onClick={() => setFont({ italic: !font.italic })}>
              <em>I</em>
            </button>
          </div>
          <ColorField label="Couleur du texte" value={single.color} gradients onChange={(color) => onElements(() => ({ color: color ?? "token:text" }))} />
          <ContrastBadge ratio={contrast} large={font.size >= 48} />
          <ColorField label="Fond du bloc" value={single.fill} gradients allowNone onChange={(fill) => onElements(() => ({ fill }))} />
          <p className="editor-hint">Double-cliquez sur le texte pour l&apos;écrire.</p>
        </Section>
      )}

      {single && (single.type === "rect" || single.type === "ellipse") && (
        <Section title="Forme">
          <ColorField label="Remplissage" value={single.fill} gradients allowNone onChange={(fill) => onElements(() => ({ fill }))} />
          <ColorField
            label="Contour"
            value={single.stroke?.color}
            allowNone
            onChange={(color) =>
              onElements((element) => ({ stroke: color ? { color, width: element.stroke?.width ?? 2 } : null }))
            }
          />
          <div className="editor-grid">
            {single.stroke && (
              <NumberField
                label="Épaisseur"
                value={single.stroke.width}
                min={1}
                onChange={(width) => onElements((element) => ({ stroke: element.stroke ? { ...element.stroke, width } : null }))}
              />
            )}
            {single.type === "rect" && (
              <NumberField label="Arrondi" value={single.radius ?? 0} min={0} onChange={(radius) => onElements(() => ({ radius }))} />
            )}
          </div>
        </Section>
      )}

      {single?.type === "line" && (
        <Section title="Ligne">
          <ColorField label="Couleur" value={single.color} gradients onChange={(color) => onElements(() => ({ color: color ?? "token:primary" }))} />
          <div className="editor-grid">
            <NumberField label="Épaisseur" value={single.h} min={1} onChange={(h) => onElements(() => ({ h }))} />
          </div>
        </Section>
      )}
    </div>
  );
}
