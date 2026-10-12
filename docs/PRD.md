# PRD — Building things. Formations

**Version courante : v0.2** — mode présentateur, effet miroir, quiz bimodes, vote téléphone en v1.1
Historique : voir section « Changelog » en bas.

---

## 1. Vision

Un site unique qui sert à la fois de **vitrine du catalogue** de formations et de **support de présentation** pendant les sessions animées par le formateur. Chaque formation s'adapte au **niveau** et au **public** choisis par le formateur avant la session, à partir d'un seul contenu source.

## 2. Utilisateurs

| Persona | Besoin |
|---|---|
| **Le formateur** (utilisateur principal) | Configurer une session en 2 minutes, projeter un support beau et interactif, naviguer au clavier |
| **Le prospect / commanditaire** | Parcourir le catalogue, comprendre les objectifs, la durée et les publics, contacter le formateur |
| **Le participant** (secondaire) | Voir un support clair. Plus tard : retrouver un récap après la session |

## 3. Périmètre v1

### Inclus
- **Catalogue** : liste des formations, filtres par pilier (Idées, Produits, Technologie, Impact), niveau et public.
- **Fiche formation** : promesse, objectifs, publics, niveaux, durées possibles, plan des modules.
- **Configurateur de session** : choix du niveau, du public, du format de durée et des modules → génère une URL de session.
- **Mode présentation** : plein écran, navigation clavier (←/→, espace pour révéler, `T` pour le thème, `Échap` pour quitter).
- **Composants pédagogiques** : schémas animés, quiz projetés (réponse révélée par le formateur), cartes à retourner, défis chronométrés, mises en situation.
- **Mode présentateur** : sur l'écran du formateur, notes de l'orateur, slide suivante et chronomètre ; la salle ne voit que la slide (second écran ou seconde fenêtre).
- **Effet miroir** : le formateur saisit en direct les réponses de la salle (mots, décomptes à main levée) ; une slide ultérieure les réaffiche pour comparer. Stocké dans le navigateur uniquement.
- **Quiz et avis en deux modes** : mode « salle » (main levée, réponse orale) en v1 ; composants conçus dès la v1 pour accueillir le mode « téléphone » (v1.1). En attendant, l'avis global peut passer par un QR code vers un formulaire externe.
- **QR codes** générés pour pointer vers une ressource ou un formulaire.
- **Thème light/dark** avec bascule, préférence système par défaut.
- **Page à propos et contact** (lien mailto ou LinkedIn).

### Exclus de la v1
- Comptes utilisateurs, authentification.
- Suivi de progression, certificats.
- Paiement ou inscription en ligne.
- Vote du public en temps réel depuis les téléphones : **prévu en v1.1**, juste après le pilote, via un service hébergé (ADR-010).
- Back-office : le contenu s'édite en fichiers MDX dans le repo.

## 4. User stories prioritaires

1. En tant que formateur, je choisis « Comprendre l'IA générative », niveau découverte, public seniors, format 2h, et j'obtiens une URL que j'ouvre en session.
2. En tant que formateur, j'avance slide par slide au clavier, et je révèle les étapes d'un schéma une à une.
3. En tant que formateur, je lance un quiz, la salle répond à voix haute, puis je révèle la bonne réponse et l'explication.
4. En tant que formateur, je bascule en dark mode si la salle est sombre.
5. En tant que prospect, je filtre le catalogue sur « Managers » et je vois les formations adaptées.
6. En tant que formateur, je vois mes notes et la slide suivante sur mon écran pendant que la salle ne voit que la slide.
7. En tant que formateur, je note les mots de la salle en début de session et je les réaffiche à la fin pour mesurer ce qui a changé.

## 5. Critères de réussite v1
- Une session complète configurable et projetable de bout en bout pour **une formation pilote**.
- Lighthouse ≥ 90 partout. Site 100 % statique.
- Rendu correct en 16:9 projeté et sur mobile pour le catalogue.
- Les deux thèmes sont conformes au `DA.md`.

## 6. Questions ouvertes
- ~~Quelle formation pilote ?~~ → « Comprendre l'IA générative sans jargon » (validé, ADR-011).
- Nom de domaine et hébergement ?
- Faut-il un export PDF du support pour l'envoyer après la session ?
- Faut-il mentionner onepoint sur le site (validation marque employeur) ?

---

## Changelog
- **v0.2** — Ajout du mode présentateur, de l'effet miroir, des quiz/avis bimodes et des QR codes. Vote par téléphone sorti des exclusions et planifié en v1.1 (ADR-010). Formation pilote validée (ADR-011).
- **v0.1.1** — Stack : Next.js (ADR-005). Pas de changement de périmètre.
- **v0.1** — Création. Vitrine + support de présentation, sans compte, configuration par le formateur.
