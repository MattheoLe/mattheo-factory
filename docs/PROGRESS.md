# PROGRESS.md — Avancement

_Dernière mise à jour : 12/10/2026_

## ✅ Fait
- Docs de pilotage initiales (CLAUDE.md, DA, PRD v0.1.1, TECH, DECISIONS, CATALOGUE)
- Choix de stack : Next.js (ADR-005)
- **Phase 1 : fondations** (branche `phase-1-fondations`)
  - [x] Dépôt git + docs rangés dans `docs/`
  - [x] Next.js 16.4 (App Router) + TypeScript strict + Tailwind 4.3 + ESLint (ADR-006, ADR-009)
  - [x] `styles/tokens.css` light/dark, Tailwind mappé uniquement sur les tokens (ADR-006, ADR-007)
  - [x] next-themes (`data-theme`, défaut `system`, sans flash) + `ThemeToggle` (Clair / Sombre / Système)
  - [x] Poppins 600/800 et Inter via next/font (`--font-poppins`, `--font-inter`)
  - [x] Composants brand : Logotype, Halo, Grid, Lines, DottedArc, SignalDot, TechStar, Tag, Texture, Arc, SectionLabel, DotMatrix
  - [x] Page `/styleguide` : palette, tokens, typo, logotype, assets, dégradés, contrastes calculés en direct
  - [x] Accueil provisoire : bloc « Positionnement »
  - [x] Focus double anneau (ADR-008), `prefers-reduced-motion`, navigation clavier

## 🔄 En cours / en attente du porteur de projet
- ⚠️ **Planches `docs/assets/da-light.png` et `da-dark.png` absentes** : la fidélité de `/` et `/styleguide` aux planches n'a pas pu être vérifiée.
- ⚠️ **`docs/CONTENT_MODEL.md` absent** (référencé par CLAUDE.md, TECH.md et CATALOGUE.md). Nécessaire avant la phase 2.
- Points ⚠️ de DA.md : nom de `#0B0F14`, dégradé `#0B3DFF`, `--grad-deep`/`--grad-signal` en light (ADR-007)
- Questions ouvertes du PRD (formation pilote, domaine, export PDF, mention onepoint)

## 📋 Phase 2 : catalogue
- [ ] Installer Velite + schémas des formations et modules (reporté de la phase 1, ADR-009)
- [ ] Données des 14 formations depuis CATALOGUE.md (métadonnées uniquement)
- [ ] Page catalogue + filtres
- [ ] Fiche formation

## 📋 Phase 3 : session
- [ ] Composants `<Level>` / `<Audience>`
- [ ] Configurateur de session
- [ ] Mode présentation (plein écran, clavier)
- [ ] Composants pédagogiques : Reveal, Quiz, FlipCard, Challenge, Scenario, KeyTakeaway
- [ ] Premiers composants de schémas

## 📋 Phase 4 : formation pilote
- [ ] Rédiger la formation pilote complète
- [ ] Test de projection en conditions réelles (16:9, light et dark)

## 💡 Idées pour plus tard (v2+)
- Vote du public depuis les téléphones (QR code)
- Récap envoyé aux participants après la session
- Export PDF du support
