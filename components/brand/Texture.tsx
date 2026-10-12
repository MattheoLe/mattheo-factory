import { useId } from "react";

type TextureProps = {
  className?: string;
};

/** Subtle grain overlay (feTurbulence) for gradients. Covers its relative parent. */
export function Texture({ className = "" }: TextureProps) {
  const filterId = useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      style={{ opacity: "var(--texture-opacity)" }}
    >
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
