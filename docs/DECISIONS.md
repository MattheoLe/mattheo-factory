# DECISIONS.md — Journal des décisions (ADR)

Format : contexte → décision → conséquences. On ajoute, on ne réécrit pas. Une décision remplacée est marquée « Remplacée par ADR-XXX ».

---

## ADR-001 — Site statique, sans comptes (v1) — *Amendée par ADR-010*
**Contexte** : les formations sont animées par le formateur. Le site est un support, pas une plateforme e-learning.
**Décision** : aucun compte, aucun backend, aucune base de données en v1.
**Conséquences** : hébergement simple et gratuit, pas de RGPD lourd. Le suivi des participants et le vote en direct devront attendre une v2 avec backend.

## ADR-002 — Astro + MDX + React islands — *Remplacée par ADR-005*
**Contexte** : beaucoup de contenu rédactionnel, de l'interactivité ciblée, une DA exigeante.
**Décision** : Astro pour le site, MDX pour le contenu, React pour les composants interactifs.
**Conséquences** : le contenu reste lisible et éditable par une IA en Markdown. Performances élevées.

## ADR-003 — Configuration de session par URL
**Contexte** : le formateur configure avant la session, sans compte.
**Décision** : niveau, public, format et modules passent en paramètres d'URL.
**Conséquences** : une session se prépare à l'avance, se met en favori, se partage. Aucun état serveur.

## ADR-004 — Un contenu source, des variantes conditionnelles
**Contexte** : chaque formation doit s'adapter à plusieurs niveaux et publics.
**Décision** : composants `<Level>` et `<Audience>` dans le MDX plutôt que des fichiers dupliqués.
**Conséquences** : maintenance simple. Il faudra un mode « aperçu de toutes les variantes » pour relire.

## ADR-005 — Next.js (App Router) + Velite + MDX
**Contexte** : forte part d'interactivité (mode présentation, quiz, configurateur), préférence du porteur de projet pour Next.js, et travail en agentic coding.
**Décision** : Next.js App Router, contenu MDX géré par Velite, Tailwind mappé sur les tokens, next-themes pour le light/dark, hébergement Vercel. Remplace ADR-002.
**Conséquences** : écosystème très bien connu des agents de code. Catalogue et fiches générés statiquement. La page session lit sa config côté client.

## ADR-006 — Tailwind CSS v4, configuration CSS-first
**Contexte** : la phase 1 démarre avec Tailwind 4.3 (dernière stable), qui n'a plus de `tailwind.config` : le thème se déclare en CSS (`@theme`).
**Décision** : `app/globals.css` vide la palette par défaut (`--color-*: initial`) et les ombres par défaut (qui embarquent des couleurs), puis mappe uniquement les tokens de `styles/tokens.css` (`bg-surface`, `text-text-muted`, `bg-brand-cobalt`…). Les dégradés et rôles typographiques sont exposés en utilitaires (`bg-grad-main`, `text-grad-main`, `type-display`, `type-subtitle`, `type-eyebrow`). Les valeurs arbitraires de couleur (`bg-(--x)`, ex-`bg-[--x]` en v3) restent interdites ; dans les SVG, les couleurs passent par `style={{ fill: "var(--token)" }}`.
**Conséquences** : impossible d'utiliser une couleur Tailwind hors charte (la classe n'existe pas). Les rayons (`rounded-card` 20px, `rounded-pill`) sont des constantes de thème Tailwind, pas des tokens de couleur.

## ADR-007 — Nommage des tokens et valeurs dérivées
**Contexte** : trois conventions coexistaient (`--color-…` dans CLAUDE.md, `--c-…` pour la palette, `--bg`/`--text`… pour les sémantiques). Plusieurs besoins de la phase 1 n'avaient pas de token. Les planches n'étaient pas disponibles pour trancher.
**Décision** :
- Palette brute `--c-*` (inchangée), tokens sémantiques `--bg`, `--text`… qui **référencent** la palette au lieu de répéter les hex. Côté Tailwind : `--color-<sémantique>` et `--color-brand-<nom>`. CLAUDE.md corrigé.
- `--grad-deep` et `--grad-signal` définis aussi en light, avec les valeurs dark (à confirmer avec les planches, cf. ⚠️ DA.md).
- Tokens dérivés ajoutés : `--on-primary` (blanc cassé sur cobalt, ~5.2:1), `--on-accent` (nuit sur orange, ~6.7:1), `--star` (cobalt en light, **cyan** en dark), `--line-1`/`--line-2`, `--grid-line`, `--dot-matrix`, `--signal-glow`, `--texture-opacity`, `--focus-inner`/`--focus-outer`, `--mask` (masques alpha uniquement).
- Aucune valeur dérivée de DA.md n'a été modifiée.
**Conséquences** : une seule source (`styles/tokens.css`). Le styleguide lit les valeurs en direct et ne duplique aucun hex.

## ADR-008 — Indicateur de focus à double anneau
**Contexte** : DA.md réserve l'orange au focus, mais l'orange sur `--bg` light ne fait que ~2.7:1 (WCAG 2.2 demande 3:1 pour un indicateur de focus).
**Décision** : `:focus-visible` = anneau intérieur 2px en `--focus-inner` (`--text`) + anneau extérieur 2px orange (`--accent`). L'anneau intérieur assure ≥ 3:1 dans les deux thèmes, l'orange garde la signature.
**Conséquences** : focus visible et conforme partout, sans style de focus spécifique par composant.

## ADR-009 — Périmètre technique de la phase 1
**Contexte** : PROGRESS.md prévoyait Velite en phase 1, alors que la phase 1 exclut tout contenu de formation.
**Décision** :
- Velite est reporté en phase 2 (avec les schémas de contenu). Motion n'est pas installé : les seules animations (pulsation du point signal) sont en CSS.
- Les réglages par défaut de `create-next-app` 16.4 sont conservés : `cacheComponents` et `partialPrefetching` activés, ESLint en flat config lancé via `eslint` (`next lint` n'existe plus en Next 16). `noUncheckedIndexedAccess` est activé en plus de `strict`.
- `prefers-reduced-motion` : garde globale CSS dans `globals.css` (Motion `useReducedMotion` viendra avec Motion).
**Conséquences** : dépendances minimales ; `cacheComponents` impose d'envelopper toute lecture dynamique (`useSearchParams` de la page session) dans `<Suspense>`, ce que prévoyait déjà TECH.md.

## ADR-010 — Quiz et avis bimodes, vote par téléphone en v1.1
**Contexte** : le formateur veut que le quiz final et l'avis global fonctionnent avec **et** sans téléphone. ADR-001 exclut tout backend en v1.
**Décision** :
- Les composants d'interaction (`Quiz`, `Poll`/avis, baromètre) ont deux modes dès leur conception : **« salle »** (main levée ou réponse orale, révélation par le formateur) et **« téléphone »**.
- v1 : seul le mode « salle » est actif. L'avis global peut passer par un QR code vers un formulaire externe.
- v1.1 (juste après le pilote) : mode « téléphone » via un **service temps réel hébergé** (choix du service dans un ADR dédié : Supabase, Firebase, PartyKit…), votes **anonymes**, page de vote mobile à la DA du site, résultats animés dans les slides.
- Le site reste statique : aucun serveur propre, le service hébergé est le seul composant dynamique. ADR-001 reste valable pour les comptes (aucun compte participant).
**Conséquences** : l'API des composants doit prévoir une source de réponses interchangeable (saisie formateur ou flux temps réel). Le mode « salle » sert de solution de repli si le réseau tombe.

## ADR-011 — Pilote d'abord, catalogue ensuite
**Contexte** : le cœur du produit est le support de présentation. Le formateur veut construire un premier cours en profondeur, qui servira de modèle aux autres.
**Décision** : formation pilote = `ia-generative`. Ordre des phases : conception du cours (storyboard + modèle de contenu) → moteur de présentation et composants → rédaction MDX du pilote + configurateur → catalogue et fiches des autres formations. MDX + Velite est confirmé (ADR-005).
**Conséquences** : les composants sont tirés d'un vrai cours. Le catalogue public arrive plus tard.

## ADR-012 — Architecture du moteur de présentation
**Contexte** : le pilote doit être projetable de bout en bout (PRD v0.2) avec révélations, mode présentateur synchronisé, effet miroir, sans backend.
**Décision** :
- **Contenu** : Velite compile chaque séquence (`content/formations/<slug>/modules/*.mdx`) ; toutes les séquences sont rendues statiquement. Le format, le niveau et le public (URL) sont appliqués côté client par `ModuleGate`, `<Level>`, `<Audience>`.
- **Slides pilotées par le DOM** : `<Deck>` repère les `[data-slide]` et `[data-step]` dans l'ordre du document et pose des attributs (`data-state`, `data-shown`) ; l'affichage et les révélations sont en CSS. Les listes dans `<Points>` deviennent des étapes.
- **Format 16:9 unique** : chaque slide est un conteneur CSS ; toutes les tailles sont en `cqw`, le rendu est identique sur projecteur, portable et aperçu présentateur.
- **Synchronisation sans serveur** : position, chrono, écran masqué et réponses de la salle sont stockés dans `localStorage` ; la fenêtre présentateur et la fenêtre projetée se synchronisent via l'événement `storage` (même navigateur).
- **Animations** : CSS uniquement (entrée de slide, révélations, nuage de mots), neutralisées par `prefers-reduced-motion`. Motion reste disponible si un besoin dépasse le CSS.
- **Quiz** : révélation en CSS pur (`:has`), sans JavaScript.
**Conséquences** : aucune dépendance lourde, aucune donnée envoyée. Limite : la synchronisation ne fonctionne qu'entre fenêtres du même navigateur (suffisant pour le duo écran portable + projecteur). Le mode téléphone (v1.1) se branchera sur la même API de stockage.
