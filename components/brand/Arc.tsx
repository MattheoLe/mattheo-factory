import { useId } from "react";

type ArcProps = {
  /** Stroke thickness in viewBox units (box is 600×600). */
  thickness?: number;
  className?: string;
};

/** Large thick rounded arc in --grad-main, meant to bleed out of its frame. */
export function Arc({ thickness = 56, className = "" }: ArcProps) {
  const gradientId = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      fill="none"
      className={`pointer-events-none overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--c-cobalt)" }} />
          <stop offset="1" style={{ stopColor: "var(--c-cyan)" }} />
        </linearGradient>
      </defs>
      <path
        d="M60 620A480 480 0 0 1 620 60"
        strokeWidth={thickness}
        strokeLinecap="round"
        stroke={`url(#${gradientId})`}
      />
    </svg>
  );
}
