"use client";

import type { ReactNode } from "react";
import type { Level } from "@/lib/session";
import { useSession } from "./SessionContext";

type ModuleGateProps = {
  id: string;
  levels?: Level[];
  children: ReactNode;
};

/** Renders a module only if it belongs to the session (format/modules) and level. */
export function ModuleGate({ id, levels, children }: ModuleGateProps) {
  const { config, moduleIds } = useSession();
  if (!moduleIds.includes(id)) return null;
  if (levels && !levels.includes(config.level)) return null;
  return (
    <div className="deck-module" data-module={id}>
      {children}
    </div>
  );
}
