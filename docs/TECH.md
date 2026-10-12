# TECH.md — Stack et conventions

## Stack (voir ADR-005)

| Besoin | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js** 16.4, **App Router** | Écosystème React, maîtrisé par les agents de code, rendu statique + interactivité |
| Langage | **TypeScript** strict | |
| Contenu | **MDX** via **Velite** (installé en phase 2, ADR-009) | Collections typées (formations, modules), frontmatter validé au build, compilation MDX |
| Style | **CSS custom properties** (`tokens.css`, source unique) + **Tailwind CSS v4** mappé sur ces tokens dans `app/globals.css` (ADR-006) | Thème piloté par `data-theme` |
| Thème | **next-themes** (`attribute="data-theme"`, défaut `system`) | Pas de flash au chargement |
| Polices | **next/font/google** : Poppins (600, 800), Inter (variable) | Auto-hébergées au build, pas d'appel externe en prod |
| Animations | **Motion** (ex-Framer Motion) | Révélations étape par étape, transitions de slides |
| Schémas | Composants **SVG React maison** | Fidélité à la DA, révélables par étape |
| Icônes | **lucide-react** | Trait fin cohérent avec le système de lignes |
| Hébergement | **Vercel** | Déploiement à chaque push, previews par branche |

## Rendu
- Catalogue et fiches : **Server Components**, générés statiquement (`generateStaticParams`).
- Session : page statique dont la config est lue côté client via `useSearchParams` (enveloppée dans `<Suspense>`).
- Composants interactifs (`Quiz`, `Reveal`, `FlipCard`, `Presenter`…) : `"use client"`, le reste en Server Components.
- Aucune API route, aucune base de données en v1 (ADR-001).

## Structure du repo

```
/
├─ CLAUDE.md
├─ docs/
├─ content/
│  └─ formations/
│     └─ ia-generative/
│        ├─ index.mdx              ← fiche + métadonnées
│        └─ modules/
│           ├─ 01-cest-quoi.mdx
│           └─ 02-...mdx
├─ velite.config.ts                ← schémas des collections
├─ app/
│  ├─ layout.tsx                   ← polices, ThemeProvider
│  ├─ page.tsx                     ← accueil
│  ├─ formations/
│  │  ├─ page.tsx                  ← catalogue + filtres
│  │  └─ [slug]/
│  │     ├─ page.tsx               ← fiche formation
│  │     ├─ configurer/page.tsx    ← configurateur
│  │     └─ session/page.tsx       ← mode présentation
│  ├─ a-propos/page.tsx
│  └─ styleguide/page.tsx          ← interne : tous les tokens et assets, light + dark
├─ components/
│  ├─ brand/       ← Logotype, Halo, Grid, Lines, DottedArc, SignalDot, TechStar, Arc, Tag, Texture, SectionLabel, DotMatrix
│  ├─ theme/       ← ThemeProvider, ThemeToggle
│  ├─ diagrams/    ← schémas réutilisables
│  ├─ pedagogy/    ← Quiz, Poll, WordCollect, Stat, QRCode, Layout (Card, Columns, Points, Quote, Excerpt, Pillars)…
│  ├─ adapt/       ← Level, Audience (affichage conditionnel)
│  ├─ presenter/   ← Deck (clavier, plein écran, vue présentateur), Slide, Step, Notes, ModuleGate, store partagé (ADR-012)
│  └─ mdx/         ← mapping des composants MDX
├─ lib/
│  ├─ session.ts   ← parsing/validation de la config URL
│  ├─ color.ts     ← calcul de contraste WCAG (styleguide)
│  └─ useCssVar.ts ← lecture live d'un token CSS
└─ styles/
   ├─ tokens.css   ← source unique des tokens
   ├─ deck.css     ← scène 16:9, typographie des slides (cqw), vue présentateur
   └─ slides.css   ← styles des composants pédagogiques et schémas
```

## Conventions
- Composants en PascalCase, contenu en kebab-case.
- Aucune couleur hors de `tokens.css`. Tailwind ne référence que les tokens : utiliser les classes mappées (`bg-surface`, `text-text-muted`, `bg-grad-main`…), jamais de valeur arbitraire (`bg-(--surface)`). En SVG : `style={{ fill: "var(--token)" }}` (ADR-006).
- `"use client"` uniquement là où c'est nécessaire.
- La configuration de session passe **uniquement par l'URL** (voir `CONTENT_MODEL.md`).
- `localStorage` uniquement pour le confort (dernière config). Le thème est géré par next-themes.
- Accessibilité : focus visible, navigation clavier complète, `prefers-reduced-motion` respecté (Motion `useReducedMotion`).
- Commandes : `npm run dev`, `npm run build` (doit passer sans erreur ni warning de type avant de déclarer une tâche finie), `npm run lint`.
