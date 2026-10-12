"use client";

import type { ReactNode } from "react";
import { matches, useSession, type AudienceFilter } from "@/components/presenter/SessionContext";

/** Shows its content only for the matching audience(s). Without a session audience, only `not` blocks match. */
export function Audience({ is, not, children }: AudienceFilter & { children: ReactNode }) {
  const { config } = useSession();
  return matches(config.audience, is, not) ? <>{children}</> : null;
}
