"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type ThemeOption = { value: "light" | "dark" | "system"; label: string; icon: LucideIcon };

const OPTIONS: ThemeOption[] = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
  { value: "system", label: "Système", icon: Monitor },
];

const noopSubscribe = () => () => {};

/** True once hydrated: the stored theme is unknown during server rendering. */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

type ThemeToggleProps = {
  /** Hide text labels and keep icons only. */
  compact?: boolean;
  className?: string;
};

export function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const current = isClient ? theme : undefined;

  return (
    <div
      role="radiogroup"
      aria-label="Thème d'affichage"
      className={`inline-flex items-center gap-1 rounded-pill border border-border bg-surface p-1 ${className}`}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const checked = current === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={compact ? label : undefined}
            title={label}
            onClick={() => setTheme(value)}
            className={`inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-sm font-medium transition-colors ${
              checked
                ? "bg-primary text-on-primary"
                : "text-text-muted hover:bg-surface-2 hover:text-text"
            }`}
          >
            <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
            {!compact && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
