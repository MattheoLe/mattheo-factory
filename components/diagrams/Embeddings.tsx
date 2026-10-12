import type { CSSProperties } from "react";

/**
 * "Words become vectors": a camera that starts zoomed on one word, reveals its
 * neighbours, shows the king − man + woman ≈ queen analogy, then zooms out to the
 * whole map of meaning. Each phase is a step; the camera is driven by CSS `:has`
 * on the revealed steps (styles/slides.css), so there is no client JavaScript.
 *
 * Coordinates are illustrative: real embeddings have hundreds of dimensions,
 * projected here on a plane.
 */

type Word = { text: string; x: number; y: number; key?: boolean };
type Cluster = { name: string; x: number; y: number; words: Word[] };

const VIEW = { width: 1000, height: 520 };

const ROYALTY: Word[] = [
  { text: "reine", x: 650, y: 330, key: true },
  { text: "prince", x: 515, y: 300 },
  { text: "princesse", x: 610, y: 395 },
  { text: "royaume", x: 470, y: 215 },
  { text: "couronne", x: 545, y: 165 },
  { text: "château", x: 640, y: 200 },
];

const GENDER: Word[] = [
  { text: "homme", x: 330, y: 300 },
  { text: "femme", x: 420, y: 380 },
];

const CLUSTERS: Cluster[] = [
  {
    name: "Animaux",
    x: 860,
    y: 400,
    words: [
      { text: "chat", x: 820, y: 440 },
      { text: "chien", x: 880, y: 470 },
      { text: "lion", x: 900, y: 395 },
      { text: "tigre", x: 950, y: 440 },
    ],
  },
  {
    name: "Cuisine",
    x: 150,
    y: 110,
    words: [
      { text: "pomme", x: 120, y: 120 },
      { text: "pain", x: 190, y: 85 },
      { text: "fromage", x: 220, y: 150 },
      { text: "soupe", x: 140, y: 175 },
    ],
  },
  {
    name: "Technologie",
    x: 860,
    y: 110,
    words: [
      { text: "ordinateur", x: 830, y: 95 },
      { text: "téléphone", x: 900, y: 140 },
      { text: "clavier", x: 810, y: 160 },
      { text: "écran", x: 930, y: 80 },
    ],
  },
  {
    name: "Émotions",
    x: 160,
    y: 430,
    words: [
      { text: "joie", x: 120, y: 420 },
      { text: "peur", x: 190, y: 460 },
      { text: "colère", x: 230, y: 405 },
      { text: "tristesse", x: 140, y: 485 },
    ],
  },
];

const KING: Word = { text: "roi", x: 560, y: 250 };

/** Deterministic "dust" of faint points suggesting a huge space. */
function dust(count: number) {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: count }, () => ({
    x: random() * VIEW.width,
    y: random() * VIEW.height,
    r: 1 + random() * 1.6,
  }));
}

const DUST = dust(140);

function Point({ word, delay = 0 }: { word: Word; delay?: number }) {
  return (
    <g className="emb-point" data-key={word.key || undefined} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      <circle cx={word.x} cy={word.y} r={word.key ? 7 : 5.5} />
      <text x={word.x + 11} y={word.y + 5}>
        {word.text}
      </text>
    </g>
  );
}

export function Embeddings() {
  return (
    <div className="emb">
      <svg className="emb-svg" viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} role="img" aria-label="Carte des mots : les mots de sens proche sont proches">
        <defs>
          <marker id="emb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" style={{ fill: "var(--link)" }} />
          </marker>
        </defs>

        <g className="emb-camera">
          <g className="emb-dust" aria-hidden="true">
            {DUST.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r={point.r} />
            ))}
          </g>

          {/* Step 1: neighbours of "roi" */}
          <g data-step="" className="emb-s1">
            <circle className="emb-halo" cx={575} cy={275} r={150} />
            {ROYALTY.map((word, index) => (
              <Point key={word.text} word={word} delay={index * 90} />
            ))}
          </g>

          {/* Step 2: the analogy roi − homme + femme ≈ reine */}
          <g data-step="" className="emb-s2">
            {GENDER.map((word) => (
              <Point key={word.text} word={word} />
            ))}
            <line className="emb-vector" x1={336} y1={306} x2={414} y2={374} markerEnd="url(#emb-arrow)" />
            <line className="emb-vector" x1={566} y1={256} x2={644} y2={324} markerEnd="url(#emb-arrow)" />
            <text className="emb-equation" x={300} y={470}>
              roi − homme + femme ≈ reine
            </text>
          </g>

          {/* Step 3: zoom out, other families of words */}
          <g data-step="" className="emb-s3">
            {CLUSTERS.map((cluster) => (
              <g key={cluster.name}>
                <text className="emb-cluster" x={cluster.x} y={cluster.y - 60} textAnchor="middle">
                  {cluster.name}
                </text>
                {cluster.words.map((word, index) => (
                  <Point key={word.text} word={word} delay={index * 70} />
                ))}
              </g>
            ))}
          </g>

          {/* "roi" stays on top of everything */}
          <g className="emb-king">
            <circle className="emb-king-ring" cx={KING.x} cy={KING.y} r={14} />
            <Point word={KING} />
            <text className="emb-numbers" x={KING.x + 11} y={KING.y + 24}>
              [ 0,21 · −0,47 · 0,88 · 0,05 · … ]
            </text>
          </g>
        </g>
      </svg>

      <div className="emb-captions" aria-live="polite">
        <p className="emb-caption" data-phase="0">
          Pour l&apos;IA, un mot est une <strong className="s-strong">liste de nombres</strong> : un vecteur, une position
          sur une carte.
        </p>
        <p className="emb-caption" data-phase="1">
          Les mots de sens proche sont <strong className="s-strong">proches</strong> sur la carte.
        </p>
        <p className="emb-caption" data-phase="2">
          Les directions ont un sens : on peut même <strong className="s-strong">calculer avec les mots</strong>.
        </p>
        <p className="emb-caption" data-phase="3">
          Dézoomons : tout le langage devient une <strong className="s-strong">carte du sens</strong>, en des centaines
          de dimensions.
        </p>
      </div>
    </div>
  );
}
