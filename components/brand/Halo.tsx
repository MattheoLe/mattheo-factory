type HaloProps = {
  /** Position and size utilities, e.g. "-top-40 -right-40 size-[36rem]". */
  className?: string;
};

/** Blurred blue glow giving depth. Place inside a relative, overflow-hidden container. */
export function Halo({ className = "size-[32rem]" }: HaloProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ backgroundImage: "var(--halo)" }}
    />
  );
}
