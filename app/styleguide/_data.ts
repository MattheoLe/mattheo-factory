/** Styleguide metadata. Values are never listed here: they are read live from tokens.css. */

export type TokenInfo = { token: string; name?: string; role: string; derived?: boolean };

export const PALETTE: TokenInfo[] = [
  { token: "--c-night", name: "Nuit profonde", role: "Fond dark, texte light, contraste" },
  { token: "--c-white", name: "Blanc cassé", role: "Fond light, texte dark" },
  { token: "--c-cobalt", name: "Bleu cobalt", role: "Couleur principale, énergie" },
  { token: "--c-cyan", name: "Cyan doux", role: "Secondaire, équilibre, fraîcheur" },
  { token: "--c-orange", name: "Orange signal", role: "Accent, ponctuation, CTA" },
  { token: "--c-frost", name: "Gris froid", role: "UI, texte secondaire (dark), bordures" },
];

export const SEMANTIC: TokenInfo[] = [
  { token: "--bg", role: "Fond de page" },
  { token: "--surface", role: "Cartes", derived: true },
  { token: "--surface-2", role: "Zones secondaires", derived: true },
  { token: "--border", role: "Bordures fines" },
  { token: "--text", role: "Texte principal" },
  { token: "--text-muted", role: "Texte secondaire", derived: true },
  { token: "--primary", role: "Couleur principale" },
  { token: "--primary-soft", role: "Secondaire (décoratif en light)" },
  { token: "--accent", role: "Accent : ponctuation, focus, CTA" },
  { token: "--link", role: "Liens" },
  { token: "--on-primary", role: "Texte sur cobalt", derived: true },
  { token: "--on-accent", role: "Texte sur orange", derived: true },
  { token: "--star", role: "Étoile tech", derived: true },
  { token: "--line-1", role: "Système de lignes (1)", derived: true },
  { token: "--line-2", role: "Système de lignes (2)", derived: true },
  { token: "--grid-line", role: "Grille subtile", derived: true },
  { token: "--dot-matrix", role: "Points matriciels", derived: true },
  { token: "--signal-glow", role: "Halo du point signal", derived: true },
  { token: "--focus-inner", role: "Anneau de focus intérieur", derived: true },
  { token: "--focus-outer", role: "Anneau de focus extérieur", derived: true },
];

export const GRADIENTS: TokenInfo[] = [
  { token: "--grad-main", role: "Dégradé principal : logotype, arcs" },
  { token: "--grad-deep", role: "Dégradé profond : fonds immersifs" },
  { token: "--grad-signal", role: "Dégradé signal : barres, progression" },
  { token: "--halo", role: "Halo lumineux (avant flou)" },
];

export type ContrastCheck = {
  fg: string;
  bg: string;
  label: string;
  /** Minimum ratio for the intended use. */
  min: number;
  usage: string;
  /** Text samples are forbidden for this pair (decorative only). */
  decorativeOnly?: boolean;
};

/** Brand pairs from DA.md §1 — identical in both themes. */
export const BRAND_CONTRASTS: ContrastCheck[] = [
  { fg: "--c-cobalt", bg: "--c-white", label: "Cobalt sur blanc", min: 4.5, usage: "Texte et liens" },
  { fg: "--c-cobalt", bg: "--c-night", label: "Cobalt sur nuit", min: 3, usage: "Gros titres uniquement" },
  { fg: "--c-cyan", bg: "--c-night", label: "Cyan sur nuit", min: 4.5, usage: "Liens et texte en dark" },
  { fg: "--c-cyan", bg: "--c-white", label: "Cyan sur blanc", min: 4.5, usage: "Jamais en texte, décoratif", decorativeOnly: true },
  { fg: "--c-orange", bg: "--c-white", label: "Orange sur blanc", min: 4.5, usage: "Jamais en texte, points et formes", decorativeOnly: true },
  { fg: "--c-orange", bg: "--c-night", label: "Orange sur nuit", min: 4.5, usage: "Texte court possible" },
];

/** Semantic pairs, evaluated in the current theme. */
export const SEMANTIC_CONTRASTS: ContrastCheck[] = [
  { fg: "--text", bg: "--bg", label: "Texte / fond", min: 4.5, usage: "Texte courant" },
  { fg: "--text", bg: "--surface", label: "Texte / carte", min: 4.5, usage: "Texte courant" },
  { fg: "--text-muted", bg: "--bg", label: "Texte secondaire / fond", min: 4.5, usage: "Texte courant" },
  { fg: "--text-muted", bg: "--surface-2", label: "Texte secondaire / zone 2", min: 4.5, usage: "Texte courant" },
  { fg: "--link", bg: "--bg", label: "Lien / fond", min: 4.5, usage: "Liens" },
  { fg: "--link", bg: "--surface", label: "Lien / carte", min: 4.5, usage: "Liens" },
  { fg: "--on-primary", bg: "--primary", label: "Texte sur bouton cobalt", min: 4.5, usage: "Boutons" },
  { fg: "--on-accent", bg: "--accent", label: "Texte sur CTA orange", min: 4.5, usage: "CTA" },
  { fg: "--focus-inner", bg: "--bg", label: "Anneau de focus / fond", min: 3, usage: "Indicateur de focus (UI)" },
];
