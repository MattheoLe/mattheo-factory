# CLAUDE.md — Point d'entrée pour l'IA

Projet : **Building things. — Catalogue de formations**
Site vitrine + support de présentation pour des formations animées en présentiel/visio par le formateur (Consultant en innovation & IA chez onepoint).

## Ordre de lecture obligatoire avant toute tâche
1. `docs/PRD.md` — ce qu'on construit et pourquoi (version courante en haut)
2. `docs/PROGRESS.md` — ce qui est fait, en cours, à faire
3. `docs/DA.md` — direction artistique, tokens, règles visuelles
   + `docs/assets/da-light.png` et `docs/assets/da-dark.png` — planches de référence visuelle (à regarder)
4. `docs/TECH.md` — stack, structure, conventions de code
5. `docs/CONTENT_MODEL.md` — structure d'une formation et adaptation niveau/public
6. `docs/CATALOGUE.md` — les formations proposées, leur statut (pilote / v1 / bientot)
7. `docs/DECISIONS.md` — décisions déjà prises (ne pas les rediscuter sans raison)

## Règles non négociables
- **Jamais de couleur en dur.** Toujours les tokens CSS définis dans `DA.md` et `styles/tokens.css` (`var(--bg)`, `var(--text)`…), ou les classes Tailwind qui y sont mappées (`bg-surface`, `text-text-muted`…). Voir ADR-007.
- **Light ET dark** : chaque composant est vérifié dans les deux modes avant d'être considéré terminé.
- **Contraste** : respecter les règles de contraste de `DA.md` (pas de texte orange ou cyan sur fond clair).
- **Orange avec parcimonie** : ponctuation, focus, CTA. Jamais en aplat large.
- **Contenu en français.** Code, noms de fichiers et commentaires techniques en anglais.
- **Pas de comptes, pas de backend** en v1 (voir ADR-001).

## Méthode de travail
- **Explorer → Planifier → Valider → Coder → Vérifier → Documenter.**
- Ne jamais coder une phase sans plan validé par le porteur de projet.
- Petites étapes, un commit par étape logique, messages de commit clairs (Conventional Commits).
- Une branche par phase (`phase-1-fondations`, etc.).
- En cas d'ambiguïté : poser la question, ne pas inventer.

## Fin de chaque tâche
- Mettre à jour `docs/PROGRESS.md` (cocher, ajouter, déplacer).
- Si une décision structurante a été prise : ajouter un ADR dans `docs/DECISIONS.md`.
- Si le périmètre change : proposer une nouvelle version du PRD plutôt que modifier silencieusement.
- Signaler toute incohérence trouvée entre les docs au lieu de trancher seul.
