import { useId } from "react";

type DotMatrixProps = {
  /** Distance between dots in px. */
  gap?: number;
  className?: string;
};

/** Small grid of dots (mostly used in dark). Fills its box. */
export function DotMatrix({ gap = 14, className = "size-32" }: DotMatrixProps) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" className={`pointer-events-none ${className}`}>
      <pattern id={patternId} width={gap} height={gap} patternUnits="userSpaceOnUse">
        <circle cx={gap / 2} cy={gap / 2} r={1.3} style={{ fill: "var(--dot-matrix)" }} />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
