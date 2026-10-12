import type { ReactNode } from "react";

/** Speaker notes: hidden on the projected slide, shown in the presenter view. */
export function Notes({ children }: { children: ReactNode }) {
  return (
    <aside data-notes="" hidden>
      {children}
    </aside>
  );
}
