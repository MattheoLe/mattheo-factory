import { SignalDot } from "@/components/brand";

type Ring = { label: string; hint?: string };

/**
 * Nested sets (e.g. IA ⊃ apprentissage automatique ⊃ … ⊃ IA générative).
 * Outer ring is visible first, each inner ring is a step; the innermost gets the signal point.
 */
export function Rings({ rings }: { rings: Ring[] }) {
  function render(index: number): React.ReactNode {
    const ring = rings[index];
    if (!ring) return null;
    const isLast = index === rings.length - 1;
    return (
      <div className="ring" data-step={index === 0 ? undefined : ""} data-depth={index} data-last={isLast || undefined}>
        <p className="ring-label">
          {ring.label}
          {isLast && <SignalDot size="sm" />}
        </p>
        {ring.hint && <p className="ring-hint">{ring.hint}</p>}
        {render(index + 1)}
      </div>
    );
  }

  return <div className="rings">{render(0)}</div>;
}
