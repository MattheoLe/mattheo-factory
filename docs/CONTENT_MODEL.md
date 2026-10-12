# CONTENT_MODEL.md — Modèle de contenu

**Statut : v0, à valider.** Ce document avait été perdu ; il est reconstruit à partir de CATALOGUE.md, du PRD (v0.2), des ADR-003/004/010 et de la méthode d'animation du formateur (storyboard du pilote).

---

## 1. Clés de référence

Utilisées dans le frontmatter, les composants `<Level>` / `<Audience>` et l'URL de session.

| Dimension | Clés |
|---|---|
| **Pilier** | `idees`, `produits`, `technologie`, `impact` |
| **Niveau** | `decouverte`, `intermediaire`, `expert` |
| **Public** | `jeunes`, `actifs`, `managers`, `dirigeants`, `seniors`, `tech` |
| **Format** | `1h`, `2h`, `demi-journee`, `journee` |
| **Statut** | `pilote`, `v1`, `bientot` |

## 2. Structure d'une formation

```
content/formations/<slug>/
├─ index.mdx          ← fiche : frontmatter + présentation
└─ modules/
   ├─ 01-<slug>.mdx   ← un module = une séquence du cours, composée de slides
   └─ ...
```

**Frontmatter de `index.mdx`** (validé par Velite) : `title`, `slug`, `pillar`, `status`, `promise`, `keyMessage`, `audiences[]`, `levels[]`, `formats[]`, `highlight` (moment fort), et pour chaque format la liste ordonnée des modules et leur durée.

**Frontmatter d'un module** : `title`, `order`, `duration` (minutes, par format si besoin), `levels[]` (niveaux où le module apparaît), `kind` (voir §3).

## 3. Gabarit narratif d'un cours

Chaque cours raconte une histoire : un début, une progression, une fin qui **ouvre**.

| Étape | `kind` | Rôle |
|---|---|---|
| Accroche | `hook` | Faire émerger les représentations de la salle (question ouverte, baromètre). Les réponses sont **saisies** pour l'effet miroir. |
| Corps | `core` | Le propos, en plusieurs modules. Slides sobres + questions, mini-quiz, chiffres qui lancent le débat. |
| Récap | `recap` | Les 3–4 piliers du message clé. |
| Miroir | `mirror` | La question de l'accroche est reposée ; les réponses du début sont réaffichées. |
| Mise en action | `action` | Un usage concret à tester après la session. |
| Quiz final | `quiz` | ~10 questions de vérification. |
| Avis | `feedback` | Ressenti global sur la session. |
| Ouverture | `opening` | Question d'ouverture, dernière slide, reste affichée à la sortie. |

## 4. Slides et composants

- Le support **ne se suffit pas à lui-même** : le fond est porté à l'oral. Une slide = un titre + au plus un élément fort (schéma, quelques mots, chiffre, image).
- Chaque slide peut porter des **notes de l'orateur**, visibles uniquement en mode présentateur.
- Composants prévus (liste à affiner avec le storyboard) : `Slide` (avec mises en page), `Notes`, `Reveal`, `Quiz`, `Poll` (baromètre / avis), `WordCollect` (saisie des mots de la salle), `Mirror`, `Stat` (chiffre sourcé), `QRCode`, `Diagram.*`, `FlipCard`, `Challenge`, `Scenario`, `KeyTakeaway`.
- **Interactions bimodes** (ADR-010) : `Quiz` et `Poll` fonctionnent en mode « salle » (v1) et « téléphone » (v1.1).
- **Chiffres** : tout `Stat` porte une source et une date, validées par le formateur.

## 5. Adaptation niveau et public (ADR-004)

Un seul contenu source par formation. Les variantes passent par :
- `<Level is="expert">…</Level>` / `<Level not="decouverte">…</Level>`
- `<Audience is={["seniors", "jeunes"]}>…</Audience>`
- le champ `levels[]` d'un module (module entier masqué selon le niveau).

Un mode « aperçu de toutes les variantes » permet de relire le cours en entier.

## 6. Configuration de session par URL (ADR-003)

```
/formations/<slug>/session?niveau=decouverte&public=seniors&format=2h&modules=01,02,03
```

| Paramètre | Valeurs | Défaut |
|---|---|---|
| `niveau` | une clé de niveau | `decouverte` |
| `public` | une clé de public | aucun (contenu générique) |
| `format` | une clé de format | le premier format de la formation |
| `modules` | liste d'ordres séparés par des virgules | tous les modules du format |

Paramètre invalide → valeur par défaut + avertissement discret pour le formateur. Les réponses saisies (effet miroir) sont stockées dans le navigateur, par session, et jamais envoyées.
