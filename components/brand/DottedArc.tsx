type DottedArcProps = {
  /** Put a small signal point at the end of the orbit. */
  signal?: boolean;
  className?: string;
};

/** Dotted orbit arc (stroke-dasharray). Fills its box. */
export function DottedArc({ signal = false, className = "" }: DottedArcProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 240"
      fill="none"
      className={`pointer-events-none overflow-visible ${className}`}
    >
      <path
        d="M20 200A160 160 0 0 1 220 40"
        strokeWidth={1.5}
        strokeDasharray="2 7"
        strokeLinecap="round"
        style={{ stroke: "var(--line-1)" }}
      />
      {signal && <circle cx={220} cy={40} r={5} style={{ fill: "var(--accent)" }} />}
    </svg>
  );
}
