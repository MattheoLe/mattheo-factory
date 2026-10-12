import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  /** Adds the round arrow on the right (capsule-with-arrow variant). */
  arrow?: boolean;
  /** Renders the tag as a link. */
  href?: string;
  className?: string;
};

/** Pill-shaped capsule (radius 999px), optionally with a round arrow. */
export function Tag({ children, arrow = false, href, className = "" }: TagProps) {
  const classes = `inline-flex items-center gap-2 rounded-pill border border-border bg-surface text-sm font-medium text-text ${
    arrow ? "py-1 pl-4 pr-1" : "px-4 py-1.5"
  } ${href ? "transition-colors hover:border-primary" : ""} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-on-primary"
        >
          <ArrowUpRight size={16} strokeWidth={2} />
        </span>
      )}
    </>
  );

  return href ? (
    <Link href={href} className={`${classes} no-underline`}>
      {content}
    </Link>
  ) : (
    <span className={classes}>{content}</span>
  );
}
