# DA.md — Direction artistique « Building things. »

> Positionnement : **Créatif & audacieux × Tech contemporain**
> Signature : **Building things.** — *J'explore. J'imagine. Je construis.*
> Piliers : **Idées · Produits · Technologie · Impact**

Deux systèmes : **light** et **dark**. Même palette, rôles inversés pour fond et texte.

---

## 1. Palette

| Token | Hex | Nom | Rôle |
|---|---|---|---|
| `--c-night` | `#0B0F14` | Nuit profonde | Fond dark, texte light, contraste |
| `--c-white` | `#F7F8FA` | Blanc cassé | Fond light, texte dark |
| `--c-cobalt` | `#0057FF` | Bleu cobalt | Couleur principale, énergie |
| `--c-cyan` | `#7DD3FC` | Cyan doux | Secondaire, équilibre, fraîcheur |
| `--c-orange` | `#FF6B00` | Orange signal | Accent, ponctuation, CTA |
| `--c-frost` | `#CBD5E1` | Gris froid | UI, texte secondaire (dark), bordures |

> ⚠️ À valider : le nom unique de `#0B0F14` (« Bleu nuit profond » sur la planche light, « Charbon profond » sur la dark). Proposé : **Nuit profonde**.

### Tokens sémantiques

Les couleurs marquées *(dérivé)* ne figurent pas dans les planches. Ce sont des propositions à valider.

```css
:root, [data-theme="light"] {
  --bg:            #F7F8FA;
  --surface:       #FFFFFF;            /* (dérivé) cartes */
  --surface-2:     #EEF2F7;            /* (dérivé) zones secondaires */
  --border:        #CBD5E1;
  --text:          #0B0F14;
  --text-muted:    #5B6675;            /* (dérivé) contraste AA sur --bg */
  --primary:       #0057FF;
  --primary-soft:  #7DD3FC;
  --accent:        #FF6B00;
  --link:          #0057FF;
  --grad-main:     linear-gradient(135deg, #0057FF 0%, #7DD3FC 100%);
  --halo:          radial-gradient(circle, rgba(0,87,255,.35) 0%, rgba(125,211,252,.15) 45%, transparent 70%);
}

[data-theme="dark"] {
  --bg:            #0B0F14;
  --surface:       #111823;            /* (dérivé) */
  --surface-2:     #172131;            /* (dérivé) */
  --border:        rgba(203,213,225,.14);
  --text:          #F7F8FA;
  --text-muted:    #CBD5E1;
  --primary:       #0057FF;
  --primary-soft:  #7DD3FC;
  --accent:        #FF6B00;
  --link:          #7DD3FC;            /* cobalt trop sombre pour du texte sur nuit */
  --grad-main:     linear-gradient(135deg, #0057FF 0%, #7DD3FC 100%);
  --grad-deep:     linear-gradient(135deg, #0B0F14 0%, #0057FF 100%);
  --grad-signal:   linear-gradient(90deg, #0057FF 0%, #7DD3FC 55%, #FF6B00 100%);
  --halo:          radial-gradient(circle, rgba(0,87,255,.55) 0%, rgba(0,87,255,.15) 40%, transparent 70%);
}
```

> ⚠️ La planche light indique un dégradé dark `#0057FF → #0B3DFF`. C'est probablement une coquille pour `#0B0F14`, à confirmer.

> **Phase 1** : `styles/tokens.css` est l'implémentation de référence. Tokens dérivés ajoutés (`--on-primary`, `--on-accent`, `--star`, `--line-*`, `--grid-line`, `--dot-matrix`, `--signal-glow`, `--focus-*`…) et `--grad-deep` / `--grad-signal` définis aussi en light : voir ADR-007. Focus : voir ADR-008.

### Règles de contraste (calculées)

> Mesuré sur `--bg` light (`#F7F8FA`) et non sur blanc pur : cobalt 5.19:1, cyan 1.57:1, orange 2.69:1. Les règles ci-dessous restent valables (voir `/styleguide`, section Contrastes).

| Combinaison | Ratio | Usage |
|---|---|---|
| Cobalt sur blanc | ~5.5:1 | ✅ texte et liens |
| Cobalt sur nuit | ~3.5:1 | ⚠️ gros titres uniquement, pas de texte courant |
| Cyan sur nuit | ~11:1 | ✅ liens et texte en dark |
| Cyan sur blanc | ~1.7:1 | ❌ jamais en texte, décoratif uniquement |
| Orange sur blanc | ~2.9:1 | ❌ jamais en texte, points et formes uniquement |
| Orange sur nuit | ~6.7:1 | ✅ texte court possible |

---

## 2. Typographie

| Rôle | Police | Graisse | Notes |
|---|---|---|---|
| Display / titres | **Poppins** | 800 (ExtraBold) | Interlettrage serré (`-0.03em`), interligne 0.95 |
| Sous-titres | Poppins | 600 | |
| Texte courant / UI | **Inter** | 400 / 500 / 600 | |
| Sur-titres (labels de section) | Inter | 600 | MAJUSCULES, `letter-spacing: 0.25em`, petite taille |

> À vérifier : les titres des planches pourraient venir d'une autre police géométrique. Poppins 800 est l'approximation retenue.

### Le logotype « Building things. »
- « Building » en `--text`.
- « things » en `--grad-main`, appliqué au texte (`background-clip: text`).
- Le **point final est toujours orange** (`--accent`). C'est la signature.
- Toujours sur deux lignes, « things. » sous « Building », alignés à gauche.

---

## 3. Assets graphiques

Tous les assets sont réalisés en **CSS ou SVG** (pas d'images bitmap), pour fonctionner dans les deux thèmes.

| Asset | Description | Implémentation |
|---|---|---|
| **Halo / glow bleu** | Tache lumineuse floue, profondeur | `radial-gradient` + `filter: blur()` |
| **Grille subtile** | Quadrillage fin, structure | `background-image` en `linear-gradient` 1px, opacité 6–10 % |
| **Système de lignes** | Courbes fines qui se croisent, mouvement | SVG `<path>`, stroke 1–1.5px, cobalt et cyan |
| **Lignes pointillées** | Arcs en pointillés (orbites) | SVG `stroke-dasharray` |
| **Point signal** | Petit disque orange, parfois avec halo | `<span>` rond + `box-shadow` orange diffus |
| **Étoile tech** | Étoile à 4 branches fines | SVG, cobalt en light, blanc ou cyan en dark |
| **Capsule / tag** | Pilule arrondie, éventuellement avec flèche ronde | Composant `<Tag>`, rayon 999px |
| **Texture subtile** | Grain léger sur les dégradés | SVG `feTurbulence` en overlay, opacité 4–8 % |
| **Arc / ruban arrondi** | Grand arc épais en dégradé qui sort du cadre | SVG `<path>` épais + `--grad-main` |
| **Points matriciels** (dark) | Petites grilles de points | SVG `pattern` |

---

## 4. Composition

- Cartes à **coins arrondis** (rayon 16–20px), bordure fine `--border`.
- Grands espaces blancs : on laisse respirer.
- Les arcs et halos **débordent du cadre** (`overflow: hidden` sur le conteneur).
- Un seul point orange par zone visuelle, en général.
- Sur-titre en majuscules espacées avant chaque section, parfois suivi d'un trait cobalt de 40px.

---

## 5. Règles d'usage (issues des planches)

1. **Hiérarchie claire** : « Building things. » et la promesse d'abord, le reste ensuite.
2. **Orange en accent** : ponctuation, focus, CTA. Avec parcimonie.
3. **Zone de sécurité** : marges généreuses autour du logo et du texte.
4. **Cohérence visuelle** : mêmes dégradés, grille, courbes et halos partout.
5. **Ton moderne et builder** : épuré, audacieux, positif. Messages courts, visuels à fort contraste.

---

## 6. Spécifique aux schémas pédagogiques

- Nœuds = cartes `--surface` à coins arrondis, ou capsules.
- Liens = courbes fines (système de lignes), pas de flèches lourdes. Pointe discrète si nécessaire.
- Le **concept clé** d'un schéma reçoit le point signal orange.
- Les étapes séquentielles peuvent suivre un arc pointillé.
- Animation d'apparition **étape par étape** pilotable au clavier (le formateur révèle progressivement).
- Respecter `prefers-reduced-motion`.
