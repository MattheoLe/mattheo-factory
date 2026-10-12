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
- **Pilote `ia-generative` v0 projetable de bout en bout** (« fonce, on itérera après ») : phases 2 à 4 menées d'un bloc
  - [x] Velite + schémas formation / module ; moteur de présentation (ADR-012)
  - [x] Mode présentation (clavier, plein écran, écran masqué) + vue présentateur synchronisée (notes, slide suivante, chrono)
  - [x] Composants : Slide (5 mises en page), Step/Points, Quiz, Poll, WordCollect (effet miroir), Stat, QRCode, Quote, Excerpt, Pillars, Card/Columns ; schémas NextWord, Rings, Pipeline, Timeline
  - [x] `<Level>` / `<Audience>` + configurateur de session (`/formations/ia-generative/configurer`)
  - [x] Cours en MDX, notes de l'orateur, quiz final de 10 questions
- **Itération 1 sur le pilote** (retours du formateur)
  - [x] IA / ML / DL / IA générative / IA agentique ; animation des vecteurs (roi − homme + femme ≈ reine, dézoom)
  - [x] Multimodalité, exemples en images, démos texte / image / vidéo
  - [x] Nouvelle séquence « Ce qu'elle rend possible » (santé, science, accessibilité)
  - [x] Nouvelle séquence « Prévention » (énergie, coûts cachés, 3 arnaques réelles, loi SREN)
  - [x] Atelier deepfake (demi-journée) ; vote d'arbitrage bénéfices / risques
  - [x] Numérotation automatique des séquences, durées par format (2h = 114 min, 1h = 53 min, demi-journée = 3h09), séquences décochables
- **Catalogue « streaming »** (PRD v0.3, ADR-013)
  - [x] CTA « Se former » + intro animée (son optionnel, à fournir)
  - [x] Tête d'affiche, rangées défilantes, tuiles qui s'agrandissent, top 10, ma liste, reprendre, fiche avec épisodes
  - [x] Affiches SVG pour les 14 formations ; fiches Velite des 13 autres formations (métadonnées)

## 🔄 En cours — Itérations sur le pilote (branche `phase-2-conception`)
- [ ] Relecture du cours par le formateur (fond, ton, exemples, anecdotes personnelles)
- [ ] Valider les chiffres « à valider » (séquences 2, 5, 7, 9), le cas *Mata v. Avianca*, les montants de la loi SREN
- [ ] Slide « Qui suis-je » : nom et accroches à valider
- [ ] Images à fournir (`public/formations/ia-generative/`) : exemples multimodaux, photo réelle/générée, images virales
- [ ] « Humain ou IA ? » : remplacer/compléter les extraits
- [ ] Lien du formulaire d'avis (QR code séquence 15)
- [ ] Son d'intro original (`public/sounds/intro.mp3`)
- [ ] Aperçu de toutes les variantes (ADR-004)
- [ ] Test de projection en conditions réelles (16:9, light et dark, deux écrans)

## ⏸️ En attente du porteur de projet
- ⚠️ **Planches `docs/assets/da-light.png` et `da-dark.png` absentes** : fidélité aux planches non vérifiée.
- Validation de `docs/CONTENT_MODEL.md` v0
- Points ⚠️ de DA.md : nom de `#0B0F14`, dégradé `#0B3DFF`, `--grad-deep`/`--grad-signal` en light (ADR-007)
- Questions ouvertes du PRD (domaine, export PDF, mention onepoint)

## 📋 Catalogue : suite
- [ ] Filtres par niveau et public (PRD v0.3)
- [ ] Rédiger les formations `v1` (art du prompt, prototyper, créativité augmentée, IA responsable)

## 📋 v1.1
- [ ] Mode « téléphone » pour Quiz et Poll via service temps réel hébergé (ADR dédié)

## 💡 Idées pour plus tard
- Récap envoyé aux participants après la session
- Export PDF du support
