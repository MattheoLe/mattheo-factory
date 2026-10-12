type LinesProps = {
  className?: string;
};

/** Thin crossing curves (cobalt + cyan) suggesting movement. Fills its box. */
export function Lines({ className = "" }: LinesProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={`pointer-events-none ${className}`}
    >
      <g strokeWidth={1.25} strokeLinecap="round" vectorEffect="non-scaling-stroke">
        <path d="M-10 190C80 60 170 40 250 110S360 210 410 60" style={{ stroke: "var(--line-1)" }} />
        <path d="M-10 120C70 200 160 220 240 140S350 20 410 120" style={{ stroke: "var(--line-2)" }} />
        <path
          d="M-10 220C110 160 190 170 270 70S370 0 410 20"
          style={{ stroke: "var(--line-1)" }}
          opacity={0.55}
        />
      </g>
    </svg>
  );
}
