import { useId } from "react";

type Pillar = "idees" | "produits" | "technologie" | "impact";

export type PosterData = {
  title: string;
  pillar: Pillar;
  number: number;
  status: "pilote" | "v1" | "bientot";
};

/** Points linked to their neighbours: a small "map of meaning". */
function constellationPoints(seed: number) {
  let state = seed * 9301 + 49297;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  return Array.from({ length: 14 }, () => ({ x: 160 + random() * 150, y: 20 + random() * 140 }));
}

function Constellation({ seed }: { seed: number }) {
  const points = constellationPoints(seed);
  return (
    <g>
      {points.slice(1).map((point, index) => {
        const previous = points[index]!;
        return (
          <line
            key={index}
            x1={previous.x}
            y1={previous.y}
            x2={point.x}
            y2={point.y}
            style={{ stroke: "var(--line-1)" }}
            strokeWidth={0.8}
            opacity={0.6}
          />
        );
      })}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={index % 5 === 0 ? 5 : 2.5}
          style={{ fill: index % 5 === 0 ? "var(--c-cyan)" : "var(--text-muted)" }}
        />
      ))}
    </g>
  );
}

type PosterProps = PosterData & {
  /** "tile": 16:9 card in a row · "hero": full-width billboard art (no title) */
  variant?: "tile" | "hero";
};

/**
 * Course "key art", drawn in SVG from the DA assets (no bitmap). Each pillar has its
 * own composition; the catalogue number varies angles and positions so every
 * poster is unique. Posters are cinematic: always rendered with the dark tokens.
 */
export function Poster({ title, pillar, number, status, variant = "tile" }: PosterProps) {
  const id = useId();
  const turn = (number * 47) % 360;
  const shift = ((number * 37) % 40) - 20;

  return (
    <div className="poster" data-theme="dark" data-variant={variant} data-pillar={pillar}>
      <svg className="poster-art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-main`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: "var(--c-cobalt)" }} />
            <stop offset="1" style={{ stopColor: "var(--c-cyan)" }} />
          </linearGradient>
          <radialGradient id={`${id}-halo`}>
            <stop offset="0" style={{ stopColor: "var(--c-cobalt)", stopOpacity: 0.7 }} />
            <stop offset="1" style={{ stopColor: "var(--c-cobalt)", stopOpacity: 0 }} />
          </radialGradient>
          <pattern id={`${id}-dots`} width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="0.8" style={{ fill: "var(--dot-matrix)" }} />
          </pattern>
        </defs>

        <rect width="320" height="180" style={{ fill: "var(--bg)" }} />
        <circle cx={230 + shift} cy={40} r={140} fill={`url(#${id}-halo)`} />

        {pillar === "technologie" && number % 3 === 2 && <Constellation seed={number} />}

        {pillar === "technologie" && number % 3 === 0 && (
          <g transform={`translate(${shift} 0)`}>
            {Array.from({ length: 14 }, (_, index) => {
              const height = 30 + ((index * 53 + number * 29) % 110);
              return (
                <rect
                  key={index}
                  x={160 + index * 11}
                  y={150 - height}
                  width={6}
                  height={height}
                  rx={3}
                  fill={index % 4 === 1 ? `url(#${id}-main)` : undefined}
                  style={index % 4 === 1 ? undefined : { fill: "var(--line-1)" }}
                  opacity={index % 4 === 1 ? 1 : 0.55}
                />
              );
            })}
          </g>
        )}

        {pillar === "technologie" && number % 3 === 1 && (
          <g transform={`rotate(${turn} 230 90)`}>
            {[20, 40, 60, 80, 100].map((r, index) => (
              <circle
                key={r}
                cx={230}
                cy={90}
                r={r}
                fill="none"
                style={{ stroke: index === 4 ? `url(#${id}-main)` : "var(--line-1)" }}
                strokeWidth={index === 4 ? 10 : 1}
                strokeDasharray={index % 2 ? "2 5" : undefined}
                opacity={index === 4 ? 1 : 0.7}
              />
            ))}
            <rect x={150} y={0} width={170} height={180} fill={`url(#${id}-dots)`} />
          </g>
        )}

        {pillar === "produits" && (
          <g transform={`translate(${shift} 0) rotate(-12 230 90)`}>
            {[0, 1, 2].map((index) => (
              <rect
                key={index}
                x={170 + index * 26}
                y={30 + index * 18}
                width={110}
                height={76}
                rx={10}
                style={{
                  fill: index === 2 ? `url(#${id}-main)` : "var(--surface)",
                  stroke: "var(--border)",
                }}
                opacity={index === 2 ? 1 : 0.9}
              />
            ))}
          </g>
        )}

        {pillar === "idees" && (
          <g>
            <ellipse
              cx={235}
              cy={90}
              rx={95}
              ry={55}
              fill="none"
              style={{ stroke: "var(--line-2)" }}
              strokeDasharray="2 6"
              transform={`rotate(${turn % 60 - 30} 235 90)`}
            />
            <ellipse
              cx={235}
              cy={90}
              rx={60}
              ry={95}
              fill="none"
              style={{ stroke: "var(--line-1)" }}
              strokeDasharray="2 6"
              transform={`rotate(${-(turn % 50)} 235 90)`}
            />
            <path
              d="M235 30C238 75 250 87 295 90 250 93 238 105 235 150 232 105 220 93 175 90 220 87 232 75 235 30Z"
              fill={`url(#${id}-main)`}
            />
          </g>
        )}

        {pillar === "impact" && (
          <g transform={`translate(${shift} 0)`}>
            <path
              d="M120 210A170 170 0 0 1 330 20"
              fill="none"
              stroke={`url(#${id}-main)`}
              strokeWidth={26}
              strokeLinecap="round"
            />
            <path d="M150 180C200 120 250 140 320 60" fill="none" style={{ stroke: "var(--line-2)" }} strokeWidth={1.2} />
            <path d="M170 190C220 100 280 120 330 90" fill="none" style={{ stroke: "var(--line-1)" }} strokeWidth={1.2} />
          </g>
        )}

        <circle cx={variant === "hero" ? 300 : 296} cy={150} r={4} style={{ fill: "var(--accent)" }} />
      </svg>

      <div className="poster-shade" />

      <p className="poster-badge" aria-hidden="true">
        <span className="poster-mark">
          B<span className="text-accent">.</span>
        </span>
        Formation
      </p>

      {status === "pilote" && <span className="poster-flag">Nouveau</span>}
      {status === "bientot" && <span className="poster-flag poster-flag-soon">Bientôt</span>}

      {variant === "tile" && <p className="poster-title">{title}</p>}
    </div>
  );
}
