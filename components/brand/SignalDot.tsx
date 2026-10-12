const SIZES = { sm: "size-2", md: "size-3", lg: "size-4" } as const;

type SignalDotProps = {
  size?: keyof typeof SIZES;
  /** Diffuse orange glow around the dot. */
  glow?: boolean;
  /** Slow pulse; disabled by prefers-reduced-motion. */
  pulse?: boolean;
  className?: string;
};

/** Small orange disc marking the key point of a visual zone. One per zone. */
export function SignalDot({ size = "md", glow = true, pulse = false, className = "" }: SignalDotProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full bg-accent ${SIZES[size]} ${glow ? "glow-signal" : ""} ${
        pulse ? "animate-signal" : ""
      } ${className}`}
    />
  );
}
