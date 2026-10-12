import type { ElementType, ReactNode } from "react";

type StepProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** Content revealed on the next key press, in document order. */
export function Step({ as: Tag = "div", className = "", children }: StepProps) {
  return (
    <Tag data-step="" className={className}>
      {children}
    </Tag>
  );
}
