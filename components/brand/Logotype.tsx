import type { ElementType } from "react";

const SIZES = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-7xl sm:text-8xl lg:text-9xl",
} as const;

type LogotypeProps = {
  size?: keyof typeof SIZES;
  /** Rendered element; use "h1" when the logotype is the page title. */
  as?: ElementType;
  className?: string;
};

/**
 * « Building things. » — always on two lines, left aligned.
 * "things" uses --grad-main, the final dot is always --accent (DA.md §2).
 */
export function Logotype({ size = "md", as: Tag = "p", className = "" }: LogotypeProps) {
  return (
    <Tag className={`type-display text-text ${SIZES[size]} ${className}`}>
      <span className="sr-only">Building things.</span>
      <span aria-hidden="true" className="block">
        Building
      </span>
      <span aria-hidden="true" className="block">
        {/* pb keeps the "g" descender inside the clipped gradient box */}
        <span className="text-grad-main pb-[0.08em]">things</span>
        <span className="text-accent">.</span>
      </span>
    </Tag>
  );
}
