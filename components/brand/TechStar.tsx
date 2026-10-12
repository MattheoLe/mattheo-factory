type TechStarProps = {
  /** Side length in px. */
  size?: number;
  className?: string;
};

/** Thin four-pointed star: cobalt in light, cyan in dark (--star). */
export function TechStar({ size = 24, className = "" }: TechStarProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      style={{ fill: "var(--star)" }}
    >
      <path d="M12 0C12.6 8.4 15.6 11.4 24 12 15.6 12.6 12.6 15.6 12 24 11.4 15.6 8.4 12.6 0 12 8.4 11.4 11.4 8.4 12 0Z" />
    </svg>
  );
}
