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
- PRD v0.2 : mode présentateur, effet miroir, quiz/avis bimodes, vote téléphone en v1.1 (ADR-010)
- Réorganisation : pilote d'abord, catalogue ensuite (ADR-011)
- `docs/CONTENT_MODEL.md` reconstruit (v0, à valider)

## 🔄 En cours — Phase 2 : conception du pilote (branche `phase-2-conception`)
- [x] Message clé, principes d'animation, fil en 13 séquences, ouverture
- [ ] Valider les durées (2h)
- [ ] Détailler slide par slide, séquence par séquence (+ notes de l'orateur)
- [ ] Recherche des chiffres sourcés (séquence 6), validation par le formateur
- [ ] Matière « Humain ou IA ? »
- [ ] Questions du quiz final
- [ ] Liste définitive des composants et mises en page de slides nécessaires

## ⏸️ En attente du porteur de projet
- ⚠️ **Planches `docs/assets/da-light.png` et `da-dark.png` absentes** : fidélité aux planches non vérifiée (indispensables pour le design des slides).
- Validation de `docs/CONTENT_MODEL.md` v0
- Points ⚠️ de DA.md : nom de `#0B0F14`, dégradé `#0B3DFF`, `--grad-deep`/`--grad-signal` en light (ADR-007)
- Questions ouvertes du PRD (domaine, export PDF, mention onepoint)

## 📋 Phase 3 : moteur de présentation et composants
- [ ] Installer Velite + schémas formation / module (ADR-009)
- [ ] `Slide` et ses mises en page, transitions (Motion)
- [ ] Mode présentation (plein écran, clavier) + mode présentateur (notes, slide suivante, chrono)
- [ ] Composants : Reveal, Quiz et Poll (mode salle, API prête pour le mode téléphone), WordCollect + Mirror, Stat, QRCode, schémas animés
- [ ] Deck de démonstration

## 📋 Phase 4 : rédaction du pilote
- [ ] Cours `ia-generative` complet en MDX (variante 2h · découverte, puis les autres)
- [ ] Composants `<Level>` / `<Audience>` + aperçu de toutes les variantes
- [ ] Configurateur de session
- [ ] Test de projection en conditions réelles (16:9, light et dark)

## 📋 Phase 5 : catalogue
- [ ] Fiches des 13 autres formations (métadonnées)
- [ ] Page catalogue + filtres
- [ ] Fiche formation

## 📋 v1.1
- [ ] Mode « téléphone » pour Quiz et Poll via service temps réel hébergé (ADR dédié)

## 💡 Idées pour plus tard
- Récap envoyé aux participants après la session
- Export PDF du support
