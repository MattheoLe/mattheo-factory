"use client";

import type { ReactNode } from "react";
import { matches, useSession, type LevelFilter } from "@/components/presenter/SessionContext";

/** Shows its content only for the matching session level(s). */
export function Level({ is, not, children }: LevelFilter & { children: ReactNode }) {
  const { config } = useSession();
  return matches(config.level, is, not) ? <>{children}</> : null;
}
