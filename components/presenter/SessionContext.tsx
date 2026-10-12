"use client";

import { createContext, useContext } from "react";
import type { Audience, Level, SessionConfig } from "@/lib/session";

export type SessionContextValue = {
  deckId: string;
  config: SessionConfig;
  /** Module ids in display order for the current session */
  moduleIds: string[];
  view: "audience" | "presenter";
};

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider = SessionContext.Provider;

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <Deck>");
  return value;
}

/** Shared matcher for <Level> / <Audience>: no "is" means everyone, "not" excludes. */
export function matches<T extends string>(current: T | null, is?: T | T[], not?: T | T[]) {
  const list = (value?: T | T[]) => (value === undefined ? undefined : Array.isArray(value) ? value : [value]);
  const included = list(is);
  const excluded = list(not);
  if (included && (current === null || !included.includes(current))) return false;
  if (excluded && current !== null && excluded.includes(current)) return false;
  return true;
}

export type LevelFilter = { is?: Level | Level[]; not?: Level | Level[] };
export type AudienceFilter = { is?: Audience | Audience[]; not?: Audience | Audience[] };
