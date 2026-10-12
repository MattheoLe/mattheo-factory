# Contexte

Tu rejoins le projet **« Building things. — Catalogue de formations »**. C'est le site d'un consultant en innovation & IA (chez onepoint) qui anime des formations. Le site a deux rôles :
1. **Vitrine** : un catalogue de formations filtrable.
2. **Support de présentation** : le formateur configure une session (niveau, public, durée, modules), puis la projette en plein écran et la pilote au clavier pendant qu'il anime.

Pas de comptes, pas de backend, pas de base de données en v1.

# Méthode : agentic coding piloté par la documentation

Ce projet fonctionne avec des **fichiers Markdown qui sont la mémoire du projet**. Tu ne t'appuies pas sur ce dont tu « te souviens » d'une session à l'autre : tu t'appuies sur ces fichiers, et tu les tiens à jour.

- `CLAUDE.md` : point d'entrée, règles non négociables, méthode.
- `docs/PRD.md` : quoi et pourquoi. Versionné. Le périmètre ne change que par une nouvelle version du PRD.
- `docs/DA.md` : direction artistique complète (tokens light/dark, typo, assets, règles de contraste, règles pour les schémas).
- `docs/assets/da-light.png`, `docs/assets/da-dark.png` : planches de référence visuelle. **Ouvre-les et regarde-les.**
- `docs/TECH.md` : stack, structure du repo, conventions.
- `docs/CONTENT_MODEL.md` : structure d'une formation, adaptation par niveau et public, configuration de session par URL.
- `docs/CATALOGUE.md` : les 14 formations, leurs publics, niveaux, formats et statuts.
- `docs/DECISIONS.md` : journal des décisions (ADR). On ajoute, on ne réécrit pas.
- `docs/PROGRESS.md` : fait / en cours / à faire.

Ton cycle de travail, à chaque fois : **Explorer → Planifier → Faire valider → Coder → Vérifier → Documenter.**

# Étape 1 — Exploration (maintenant, sans écrire de code)

1. Lis `CLAUDE.md`, puis tous les fichiers de `docs/` dans l'ordre indiqué dans `CLAUDE.md`.
2. Ouvre et observe les deux planches de DA dans `docs/assets/`.
3. Réponds-moi avec :
   - **Ta compréhension** du projet en 10 lignes maximum : objectif, utilisateurs, ce qu'on construit en v1, stack.
   - **Les incohérences ou trous** que tu repères entre les docs et les planches. Il y en a au moins deux signalés par ⚠️ dans `DA.md`. Cherche-en d'autres.
   - **Tes questions**, numérotées, uniquement celles qui bloquent la phase 1.
   - **Ton plan détaillé pour la phase 1** (voir ci-dessous) : étapes ordonnées, fichiers créés, et un commit prévu par étape.

**Puis arrête-toi et attends ma validation.** N'écris aucun code avant mon « go ».

# Étape 2 — Phase 1 : fondations (après validation)

Objectif : un projet Next.js propre, dont la DA est entièrement implémentée et vérifiable sur une page `/styleguide`. **Aucun contenu de formation dans cette phase.**

Travaille sur la branche `phase-1-fondations`.

## Tâches
1. **Initialisation** : Next.js (dernière version stable, App Router), TypeScript strict, Tailwind, ESLint. Le dossier contient déjà `CLAUDE.md` et `docs/` : si `create-next-app` refuse un dossier non vide, génère le projet dans un dossier temporaire puis déplace les fichiers sans écraser `CLAUDE.md` ni `docs/`.
2. **Tokens** : `styles/tokens.css` reprend exactement les tokens de `DA.md` (light et dark). Tailwind est configuré pour ne référencer que ces tokens.
3. **Thème** : next-themes avec `attribute="data-theme"`, défaut `system`, composant `ThemeToggle`. Aucun flash au chargement.
4. **Polices** : Poppins (600, 800) et Inter via `next/font/google`, exposées en variables CSS.
5. **Composants brand** dans `components/brand/` :
   `Logotype` (« Building » + « things » en dégradé + point orange, voir `DA.md` §2), `Halo`, `Grid`, `Lines`, `DottedArc`, `SignalDot`, `TechStar`, `Tag` (capsule, variante avec flèche ronde), `Texture`, `Arc`, `SectionLabel` (sur-titre majuscules espacées + trait cobalt).
   Tous en CSS ou SVG, sans image bitmap, et corrects dans les deux thèmes.
6. **Page `/styleguide`** : palette (pastilles + hex + nom + rôle), tokens sémantiques, échelle typographique, logotype, chaque asset avec son nom, dégradés, tableau de contrastes. Avec un bouton de bascule de thème bien visible.
7. **Page d'accueil provisoire** : reproduis le bloc « Positionnement » des planches (logotype, promesse « J'explore. J'imagine. Je construis. », ligne « Consultant en innovation & IA » + tag « chez onepoint », piliers à droite, halo, arc, étoile, point signal). Elle sert de test d'intégration de la DA.

## Critères d'acceptation
- `npm run build` et `npm run lint` passent sans erreur.
- Aucune couleur en dur hors de `tokens.css` (vérifie avec une recherche dans le code).
- `/styleguide` et `/` sont fidèles aux planches, en light **et** en dark.
- Les règles de contraste de `DA.md` sont respectées (pas de texte orange ou cyan sur fond clair).
- `prefers-reduced-motion` est respecté.
- Navigation clavier et focus visibles.

## Fin de phase
- Mets à jour `docs/PROGRESS.md`.
- Ajoute dans `docs/DECISIONS.md` les ADR des décisions que tu as dû prendre (version de Tailwind, valeurs dérivées ajustées…).
- Donne-moi un récapitulatif : ce qui est fait, ce qui a dévié du plan et pourquoi, captures ou description de `/styleguide` dans les deux thèmes, et ta proposition de plan pour la phase 2.

# Règles permanentes

- Tu ne modifies pas le périmètre de toi-même. Si une idée te semble utile, propose-la, ne l'implémente pas.
- En cas de doute sur la DA, les planches font foi. Si les planches et `DA.md` divergent, tu me le signales.
- Contenu affiché en français, code et noms techniques en anglais.
- Petits commits, messages clairs (Conventional Commits).
