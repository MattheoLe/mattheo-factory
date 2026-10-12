import type { ElementType, ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  /** Show the 40px cobalt rule after the label. */
  rule?: boolean;
  as?: ElementType;
  className?: string;
};

/** Section eyebrow: spaced uppercase label + optional cobalt rule (DA.md §4). */
export function SectionLabel({ children, rule = true, as: Tag = "p", className = "" }: SectionLabelProps) {
  return (
    <Tag className={`type-eyebrow flex items-center gap-3 text-text-muted ${className}`}>
      <span>{children}</span>
      {rule && <span aria-hidden="true" className="h-0.5 w-10 shrink-0 rounded-pill bg-primary" />}
    </Tag>
  );
}
