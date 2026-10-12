"use client";

import { contrastRatio, parseColor } from "@/lib/color";
import { useCssVar } from "@/lib/useCssVar";
import type { ContrastCheck } from "../_data";

export function ContrastRow({ fg, bg, label, min, usage, decorativeOnly }: ContrastCheck) {
  const fgValue = useCssVar(fg);
  const bgValue = useCssVar(bg);
  const fgColor = parseColor(fgValue);
  const bgColor = parseColor(bgValue);
  const ratio = fgColor && bgColor ? contrastRatio(fgColor, bgColor) : null;
  const passes = ratio !== null && ratio >= min;

  return (
    <tr className="border-t border-border">
      <td className="py-3 pr-4">
        <span
          className="inline-flex h-10 w-16 items-center justify-center rounded-lg border border-border"
          style={{ backgroundColor: `var(${bg})` }}
        >
          {decorativeOnly ? (
            // Forbidden as text: show a shape instead of letters.
            <span className="size-3 rounded-full" style={{ backgroundColor: `var(${fg})` }} />
          ) : (
            <span className="type-subtitle text-lg" style={{ color: `var(${fg})` }}>
              Aa
            </span>
          )}
        </span>
      </td>
      <td className="py-3 pr-4">
        <span className="font-medium">{label}</span>
        <code className="block text-xs text-text-muted">
          {fg} / {bg}
        </code>
      </td>
      <td className="py-3 pr-4 font-mono tabular-nums">{ratio ? `${ratio.toFixed(2)}:1` : "…"}</td>
      <td className="py-3 pr-4 text-text-muted">
        {usage}
        {!decorativeOnly && <span className="whitespace-nowrap"> (≥ {min}:1)</span>}
      </td>
      <td className="py-3">
        {ratio === null ? null : decorativeOnly ? (
          <span className="text-text-muted">Décoratif</span>
        ) : passes ? (
          <span className="font-semibold text-text">✓ Conforme</span>
        ) : (
          <span className="font-semibold text-text underline decoration-accent decoration-2 underline-offset-4">
            ✗ Non conforme
          </span>
        )}
      </td>
    </tr>
  );
}
