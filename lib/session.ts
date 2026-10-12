/** Session configuration carried by the URL (ADR-003, CONTENT_MODEL.md §6). */

export const LEVELS = ["decouverte", "intermediaire", "expert"] as const;
export const AUDIENCES = ["jeunes", "actifs", "managers", "dirigeants", "seniors", "tech"] as const;
export const FORMATS = ["1h", "2h", "demi-journee", "journee"] as const;

export type Level = (typeof LEVELS)[number];
export type Audience = (typeof AUDIENCES)[number];
export type Format = (typeof FORMATS)[number];

export const LABELS = {
  level: { decouverte: "Découverte", intermediaire: "Intermédiaire", expert: "Expert" },
  audience: {
    jeunes: "Jeunes",
    actifs: "Actifs",
    managers: "Managers",
    dirigeants: "Dirigeants",
    seniors: "Seniors",
    tech: "Profils tech",
  },
  format: { "1h": "1 h", "2h": "2 h", "demi-journee": "Demi-journée", journee: "Journée" },
} as const satisfies {
  level: Record<Level, string>;
  audience: Record<Audience, string>;
  format: Record<Format, string>;
};

export type SessionConfig = {
  level: Level;
  audience: Audience | null;
  format: Format;
  /** Explicit module ids; null = every module of the format */
  modules: string[] | null;
};

function pick<T extends string>(values: readonly T[], value: string | null): T | null {
  return values.find((v) => v === value) ?? null;
}

export function parseSessionConfig(params: URLSearchParams, availableFormats: string[]): SessionConfig {
  const formats = FORMATS.filter((f) => availableFormats.includes(f));
  const modules = params.get("modules");
  return {
    level: pick(LEVELS, params.get("niveau")) ?? "decouverte",
    audience: pick(AUDIENCES, params.get("public")),
    format: pick(formats, params.get("format")) ?? (formats.includes("2h") ? "2h" : formats[0]) ?? "2h",
    modules: modules ? modules.split(",").filter(Boolean) : null,
  };
}

export function sessionSearch(config: Partial<SessionConfig>): string {
  const params = new URLSearchParams();
  if (config.level) params.set("niveau", config.level);
  if (config.audience) params.set("public", config.audience);
  if (config.format) params.set("format", config.format);
  if (config.modules?.length) params.set("modules", config.modules.join(","));
  return params.toString();
}
