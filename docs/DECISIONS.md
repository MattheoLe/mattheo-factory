# DECISIONS.md — Journal des décisions (ADR)

Format : contexte → décision → conséquences. On ajoute, on ne réécrit pas. Une décision remplacée est marquée « Remplacée par ADR-XXX ».

---

## ADR-001 — Site statique, sans comptes (v1)
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
