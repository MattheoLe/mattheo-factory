type GridProps = {
  /** Cell size in px. */
  cell?: number;
  /** Fade the grid out towards the edges. */
  fade?: boolean;
  className?: string;
};

/** Fine 1px grid (opacity 6–10 %) covering its relative parent. */
export function Grid({ cell = 48, fade = true, className = "" }: GridProps) {
  const line = "var(--grid-line) 1px, transparent 1px";
  const mask = fade ? "radial-gradient(ellipse at center, var(--mask) 35%, transparent 80%)" : undefined;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `linear-gradient(${line}), linear-gradient(90deg, ${line})`,
        backgroundSize: `${cell}px ${cell}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
