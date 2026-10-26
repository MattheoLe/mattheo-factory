"use client";

import { useSyncExternalStore } from "react";
import { contrastRatio, parseColor } from "@/lib/color";
import { COLOR_TOKENS, GRADIENT_TOKENS, cssColor, isGradient, type ColorValue } from "@/lib/canvas/model";

/* ------------------------------------------------------------------ */
/* Live contrast (follows the light / dark theme)                      */
/* ------------------------------------------------------------------ */

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

let probe: HTMLSpanElement | null = null;

/** Resolves a stored color (token or custom) to an rgb() string in the current theme. */
function resolve(value: ColorValue) {
  probe ??= Object.assign(document.createElement("span"), { hidden: true });
  if (!probe.isConnected) document.body.append(probe);
  probe.style.color = cssColor(value) ?? "";
  return getComputedStyle(probe).color;
}

/** WCAG ratio between two solid colors, or null (gradients, missing values, SSR). */
export function useContrast(foreground: ColorValue | null | undefined, background: ColorValue | null | undefined) {
  return useSyncExternalStore(
    subscribeTheme,
    () => {
      if (!foreground || !background || isGradient(foreground) || isGradient(background)) return null;
      const fg = parseColor(resolve(foreground));
      const bg = parseColor(resolve(background));
      return fg && bg ? Math.round(contrastRatio(fg, bg) * 100) / 100 : null;
    },
    () => null,
  );
}

export function ContrastBadge({ ratio, large }: { ratio: number | null; large?: boolean }) {
  if (ratio === null) return null;
  const minimum = large ? 3 : 4.5;
  const ok = ratio >= minimum;
  return (
    <p className="editor-contrast" data-ok={ok || undefined}>
      Contraste {ratio.toFixed(2)}:1 {ok ? "· lisible" : `· insuffisant (minimum ${minimum}:1)`}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Color field: DA tokens first, then a free color                     */
/* ------------------------------------------------------------------ */

type ColorFieldProps = {
  label: string;
  value: ColorValue | null | undefined;
  onChange: (value: ColorValue | null) => void;
  gradients?: boolean;
  allowNone?: boolean;
};

export function ColorField({ label, value, onChange, gradients = false, allowNone = false }: ColorFieldProps) {
  const custom = value && !value.startsWith("token:") ? value : null;
  return (
    <fieldset className="editor-field">
      <legend className="editor-label">{label}</legend>
      <div className="editor-swatches">
        {allowNone && (
          <button
            type="button"
            className="editor-swatch is-none"
            aria-pressed={!value}
            title="Aucune"
            aria-label="Aucune couleur"
            onClick={() => onChange(null)}
          />
        )}
        {COLOR_TOKENS.map(({ token, label: name }) => (
          <button
            key={token}
            type="button"
            className="editor-swatch"
            aria-pressed={value === `token:${token}`}
            title={name}
            aria-label={name}
            style={{ backgroundColor: `var(--${token})` }}
            onClick={() => onChange(`token:${token}`)}
          />
        ))}
        {gradients &&
          GRADIENT_TOKENS.map(({ token, label: name }) => (
            <button
              key={token}
              type="button"
              className="editor-swatch"
              aria-pressed={value === `token:${token}`}
              title={name}
              aria-label={name}
              style={{ backgroundImage: `var(--${token})` }}
              onClick={() => onChange(`token:${token}`)}
            />
          ))}
        <label className="editor-swatch is-custom" title="Couleur personnalisée" aria-pressed={Boolean(custom)}>
          <span className="sr-only">Couleur personnalisée</span>
          <input key={custom ?? "none"} type="color" defaultValue={custom ?? undefined} onChange={(event) => onChange(event.target.value)} />
        </label>
      </div>
      {custom && <p className="editor-hint">Couleur libre {custom.toUpperCase()} : elle ne s&apos;adapte pas au thème sombre.</p>}
    </fieldset>
  );
}
