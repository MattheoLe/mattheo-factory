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
  - [x] Cours complet en MDX : 13 séquences, 64 slides (2h · découverte), notes de l'orateur, quiz final de 10 questions

## 🔄 En cours — Itérations sur le pilote (branche `phase-2-conception`)
- [ ] Relecture du cours par le formateur (fond, ton, exemples, anecdotes personnelles)
- [ ] Valider les chiffres marqués « à valider » (séquences 2 et 6) et le cas *Mata v. Avianca*
- [ ] Slide « Qui suis-je » : nom et accroches à valider
- [ ] « Humain ou IA ? » : remplacer/compléter les extraits, ajouter des images (photos réelles vs générées)
- [ ] Lien du formulaire d'avis (QR code séquence 12)
- [ ] Variante 1h : les durées affichées sont celles de la 2h (68 min) → choisir les séquences à raccourcir
- [ ] Numéros de séquence en dur (« 01 », « 02 »…) : décalés quand une séquence est masquée (expert) → numérotation automatique
- [ ] Aperçu de toutes les variantes (ADR-004)
- [ ] Test de projection en conditions réelles (16:9, light et dark, deux écrans)

## ⏸️ En attente du porteur de projet
- ⚠️ **Planches `docs/assets/da-light.png` et `da-dark.png` absentes** : fidélité aux planches non vérifiée.
- Validation de `docs/CONTENT_MODEL.md` v0
- Points ⚠️ de DA.md : nom de `#0B0F14`, dégradé `#0B3DFF`, `--grad-deep`/`--grad-signal` en light (ADR-007)
- Questions ouvertes du PRD (domaine, export PDF, mention onepoint)

## 📋 Phase 5 : catalogue
- [ ] Fiches des 13 autres formations (métadonnées)
- [ ] Page catalogue + filtres
- [ ] Fiche formation

## 📋 v1.1
- [ ] Mode « téléphone » pour Quiz et Poll via service temps réel hébergé (ADR dédié)

## 💡 Idées pour plus tard
- Récap envoyé aux participants après la session
- Export PDF du support
