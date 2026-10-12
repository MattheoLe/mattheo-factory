"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store shared by every window of the same browser
 * (audience + presenter). Other windows are notified by the native "storage" event.
 */

const PREFIX = "bt:";
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: unknown }>();
const initials = new Map<string, unknown>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key.startsWith(PREFIX)) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function initialFor<T>(key: string, initial: T): T {
  if (!initials.has(key)) initials.set(key, initial);
  return initials.get(key) as T;
}

function read<T>(key: string, initial: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // Storage unavailable (private mode): fall back to the initial value.
  }
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  let value: T = initialFor(key, initial);
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      // Corrupted entry: ignore it.
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    cache.set(key, { raw: null, value });
  }
  listeners.forEach((listener) => listener());
}

export function storeKey(deckId: string, name: string) {
  return `${PREFIX}${deckId}:${name}`;
}

export function useDeckStore<T>(deckId: string, name: string, initial: T) {
  const key = storeKey(deckId, name);
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, initial),
    () => initialFor(key, initial),
  );
  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (previous: T) => T)(read(key, initial)) : next;
      write(key, resolved);
    },
    [key, initial],
  );
  return [value, setValue] as const;
}

/** Clears every stored value of a deck (new session). */
export function clearDeckStore(deckId: string) {
  try {
    const prefix = storeKey(deckId, "");
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
  cache.clear();
  listeners.forEach((listener) => listener());
}
