# TECH.md — Stack et conventions

## Stack (voir ADR-005)

| Besoin | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js** (dernière version stable), **App Router** | Écosystème React, maîtrisé par les agents de code, rendu statique + interactivité |
| Langage | **TypeScript** strict | |
| Contenu | **MDX** via **Velite** | Collections typées (formations, modules), frontmatter validé au build, compilation MDX |
| Style | **CSS custom properties** (`tokens.css`, source unique) + **Tailwind CSS** mappé sur ces tokens | Thème piloté par `data-theme` |
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
│  ├─ brand/       ← Logotype, Halo, Grid, Lines, SignalDot, TechStar, Arc, Tag, Texture
│  ├─ diagrams/    ← schémas réutilisables
│  ├─ pedagogy/    ← Quiz, FlipCard, Reveal, Challenge, Scenario, KeyTakeaway
│  ├─ adapt/       ← Level, Audience (affichage conditionnel)
│  ├─ presenter/   ← plein écran, navigation clavier
│  └─ mdx/         ← mapping des composants MDX
├─ lib/
│  └─ session.ts   ← parsing/validation de la config URL
└─ styles/
   └─ tokens.css   ← source unique des tokens
```

## Conventions
- Composants en PascalCase, contenu en kebab-case.
- Aucune couleur hors de `tokens.css`. Tailwind ne référence que les tokens (`bg-[--surface]` interdit, utiliser les classes mappées).
- `"use client"` uniquement là où c'est nécessaire.
- La configuration de session passe **uniquement par l'URL** (voir `CONTENT_MODEL.md`).
- `localStorage` uniquement pour le confort (dernière config). Le thème est géré par next-themes.
- Accessibilité : focus visible, navigation clavier complète, `prefers-reduced-motion` respecté (Motion `useReducedMotion`).
- Commandes : `npm run dev`, `npm run build` (doit passer sans erreur ni warning de type avant de déclarer une tâche finie), `npm run lint`.
