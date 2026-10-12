"use client";

import { useCssVar } from "@/lib/useCssVar";

/** Prints the live value of a token (uppercase for hex). */
export function TokenValue({ token }: { token: string }) {
  const value = useCssVar(token);
  if (!value) return <span className="text-text-muted">…</span>;
  return <>{value.startsWith("#") ? value.toUpperCase() : value}</>;
}
