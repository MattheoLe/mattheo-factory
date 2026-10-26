# Building things. — Formations

> **J'explore. J'imagine. Je construis.**
> Le site de formation de Matthéo Lecarpentier, consultant en innovation & IA chez onepoint.

Un seul site, deux usages :

1. **Une vitrine** : un catalogue de formations façon plateforme de streaming (tête d'affiche, rangées par thème, top 10, ma liste, reprendre la formation).
2. **Un support de présentation** : le formateur configure sa session (niveau, public, durée), la projette en plein écran et la pilote au clavier, avec quiz, sondages, schémas animés et vue présentateur.

Pas de compte, pas de base de données : le site est statique. Le contenu des formations est écrit en fichiers MDX.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Démarrer](#démarrer)
- [Animer une session](#animer-une-session)
- [Écrire ou modifier une formation](#écrire-ou-modifier-une-formation)
- [Structure du projet](#structure-du-projet)
- [Stack technique](#stack-technique)
- [Documentation](#documentation)
- [État du projet](#état-du-projet)

---

## Fonctionnalités

### Catalogue (`/formations`)
- **Intro animée** en arrivant par le bouton « Se former » de l'accueil, avec un son original synthétisé dans le navigateur.
- **Tête d'affiche**, rangées qui défilent par pilier (Technologie, Produits, Idées, Impact), **Top 10**, **Grand public**, **Bientôt disponibles**.
- Tuiles qui s'agrandissent au survol, **Ma liste** (favoris), **Reprendre la formation** (là où la dernière session s'est arrêtée).
- Fiche « Plus d'infos » avec les **épisodes** (les séquences du cours).
- Une **affiche générée** (SVG, dans la DA) pour chacune des 14 formations.

### Mode présentation (`/formations/<formation>/session`)
- Diapositives 16:9 qui s'adaptent à tous les écrans, **révélations étape par étape**, thème clair ou sombre.
- **Vue présentateur** dans une seconde fenêtre : diapositive en cours, suivante, notes de l'orateur, chronomètre. Les deux fenêtres restent synchronisées.
- **Adaptation** au niveau (découverte, intermédiaire, expert), au public et au format (1 h, 2 h, demi-journée), à partir d'un seul contenu.
- **Interactions avec la salle** : nuage de mots, baromètre à main levée, quiz, effet miroir (les réponses du début réaffichées à la fin).
- **Schémas animés** : carte des mots en 3D interactive, prédiction du mot suivant, familles de l'IA, frises, pipelines.

### Formations
- **Pilote complet** : *Comprendre l'IA générative sans jargon* (16 séquences, notes de l'orateur, quiz final).
- **13 autres formations** au catalogue (fiches et affiches), contenu à rédiger.

---

## Démarrer

Prérequis : [Node.js](https://nodejs.org/) 20 ou plus récent.

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

Le premier démarrage prend 15 à 30 secondes, le temps de compiler le contenu des formations.

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance le site en local, avec rechargement automatique |
| `npm run build` | Compile le contenu et construit la version de production |
| `npm run start` | Sert la version de production construite |
| `npm run lint` | Vérifie le code |
| `npm run content` | Recompile uniquement le contenu des formations |

---

## Animer une session

1. Aller sur **Configurer** depuis le catalogue (bouton « Lancer » de la formation).
2. Choisir le **niveau**, le **public** et le **format** ; décocher les séquences à sauter si besoin.
3. Cliquer sur **Lancer la session**, puis sur **Vue présentateur** pour ouvrir les notes sur son propre écran.

| Touche | Action |
|---|---|
| `→` `espace` `Entrée` | Avancer (étape suivante ou diapositive suivante) |
| `←` | Reculer |
| `R` ou `Début` | Revenir au début du deck |
| `Fin` | Aller à la dernière diapositive |
| `P` | Ouvrir la vue présentateur |
| `F` | Plein écran |
| `T` | Basculer clair / sombre |
| `B` | Masquer l'écran projeté (pause) |
| `Échap` | Revenir à la configuration |

La session se partage par son adresse : niveau, public et format sont dans l'URL, par exemple
`/formations/ia-generative/session?niveau=decouverte&public=seniors&format=2h`.

---

## Écrire ou modifier une formation

Chaque formation est un dossier dans `content/formations/` :

```
content/formations/ia-generative/
├─ index.mdx          ← fiche : titre, promesse, publics, niveaux, formats…
└─ modules/
   ├─ 01-accroche.mdx ← une séquence = une suite de diapositives
   ├─ 02-cest-quoi-l-ia.mdx
   └─ …
```

Une diapositive s'écrit en MDX (du Markdown avec des composants) :

```mdx
<Slide kicker="Petit quiz">

<Quiz
  question="Une IA générative comprend-elle ce qu'elle dit ?"
  options={["Oui, comme nous", "Non : elle calcule ce qui est probable"]}
  answer={1}
/>

<Notes>
Ce que le formateur dit à l'oral, visible uniquement dans la vue présentateur.
</Notes>

</Slide>
```

Adapter un passage au niveau ou au public :

```mdx
<Level is="expert">…</Level>
<Audience is={["seniors"]}>…</Audience>
```

La liste des composants disponibles est dans [`components/mdx/components.tsx`](components/mdx/components.tsx), et le modèle de contenu complet dans [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md).

---

## Structure du projet

```
├─ app/                 Pages du site (accueil, catalogue, configuration, session, styleguide)
├─ components/
│  ├─ brand/            Éléments de la DA : logotype, halo, arcs, étoile, point signal…
│  ├─ catalogue/        Catalogue « streaming », affiches, intro animée
│  ├─ presenter/        Moteur de présentation, vue présentateur
│  ├─ pedagogy/         Quiz, sondage, nuage de mots, QR code, cartes d'arnaque…
│  ├─ diagrams/         Schémas animés (vecteurs 3D, mot suivant, familles de l'IA…)
│  └─ adapt/            Adaptation au niveau et au public
├─ content/formations/  Les formations (MDX)
├─ docs/                Documentation du projet (voir ci-dessous)
├─ lib/                 Configuration de session, contrastes, QR codes…
└─ styles/              Tokens de la DA (source unique des couleurs), styles des diapositives
```

---

## Stack technique

- [Next.js](https://nextjs.org/) 16 (App Router) et TypeScript strict
- [Tailwind CSS](https://tailwindcss.com/) v4, branché uniquement sur les tokens de la DA
- [Velite](https://velite.js.org/) pour le contenu MDX
- [next-themes](https://github.com/pacocoursey/next-themes) pour le thème clair / sombre
- Polices Poppins et Inter via `next/font`

Pas de backend : les réponses de la salle, les favoris et la position dans le deck sont stockés dans le navigateur.

---

## Documentation

Le projet est piloté par des fichiers Markdown, à lire dans cet ordre :

| Fichier | Contenu |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Point d'entrée et règles du projet |
| [`docs/PRD.md`](docs/PRD.md) | Ce qu'on construit et pourquoi (versionné) |
| [`docs/PROGRESS.md`](docs/PROGRESS.md) | Ce qui est fait, en cours, à faire |
| [`docs/DA.md`](docs/DA.md) | Direction artistique : couleurs, typographie, règles |
| [`docs/TECH.md`](docs/TECH.md) | Stack, structure, conventions de code |
| [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md) | Structure d'une formation et adaptation |
| [`docs/CATALOGUE.md`](docs/CATALOGUE.md) | Les 14 formations et leur statut |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Journal des décisions (ADR) |

Le site contient aussi un **styleguide** vivant : http://localhost:3000/styleguide.

---

## État du projet

- ✅ Fondations et DA, moteur de présentation, formation pilote complète, catalogue « streaming »
- 🚧 **Mode QR code** : les participants répondent depuis leur téléphone (nécessite un service en ligne, en cours)
- 📋 Rédaction des autres formations, filtres du catalogue, mise en ligne

Le détail est dans [`docs/PROGRESS.md`](docs/PROGRESS.md).
