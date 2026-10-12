"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Full-screen, interactive 3D "map of meaning".
 *
 * - Camera phases follow the deck steps (hidden step markers): 0 zoom on "roi",
 *   1 its neighbours, 2 the analogy roi − homme + femme ≈ reine, 3 zoom out on the
 *   whole space (+ Paris − France + Italie ≈ Rome).
 * - When the slide becomes active the camera flies in from far away (warp effect).
 * - Drag to orbit, wheel to zoom, click a word to fly to it.
 * - Rendering: canvas for points and lines, DOM for crisp labels. Colors come from
 *   the design tokens (read from CSS), so both themes work.
 *
 * Coordinates are illustrative: real embeddings have hundreds of dimensions.
 */

type Vec3 = [number, number, number];
type Word = { text: string; at: Vec3; group: number; key?: boolean; strong?: boolean };

// group = phase from which the word is visible
const WORDS: Word[] = [
  { text: "roi", at: [0, 0, 0], group: 0, strong: true },
  { text: "reine", at: [14, -10, 8], group: 1, key: true },
  { text: "prince", at: [-8, 6, -6], group: 1 },
  { text: "princesse", at: [6, -4, 2], group: 1 },
  { text: "royaume", at: [-6, 12, 6], group: 1 },
  { text: "couronne", at: [4, 16, -4], group: 1 },
  { text: "château", at: [12, 10, -10], group: 1 },
  { text: "trône", at: [-4, 20, 2], group: 1 },
  { text: "homme", at: [-40, -8, 10], group: 2 },
  { text: "femme", at: [-26, -18, 18], group: 2 },
  { text: "France", at: [62, 30, -30], group: 3 },
  { text: "Paris", at: [74, 42, -22], group: 3 },
  { text: "Italie", at: [52, 18, -52], group: 3 },
  { text: "Rome", at: [64, 30, -44], group: 3, key: true },
  { text: "Espagne", at: [76, 14, -56], group: 3 },
  { text: "Madrid", at: [88, 26, -48], group: 3 },
  { text: "chat", at: [-62, 44, -40], group: 3 },
  { text: "chien", at: [-54, 36, -50], group: 3 },
  { text: "lion", at: [-72, 54, -30], group: 3 },
  { text: "tigre", at: [-78, 46, -44], group: 3 },
  { text: "cheval", at: [-50, 52, -34], group: 3 },
  { text: "pomme", at: [-52, -42, 44], group: 3 },
  { text: "pain", at: [-62, -34, 52], group: 3 },
  { text: "fromage", at: [-44, -50, 56], group: 3 },
  { text: "chocolat", at: [-66, -52, 38], group: 3 },
  { text: "ordinateur", at: [52, -40, 44], group: 3 },
  { text: "téléphone", at: [62, -48, 36], group: 3 },
  { text: "clavier", at: [44, -52, 52], group: 3 },
  { text: "internet", at: [64, -34, 54], group: 3 },
  { text: "joie", at: [4, -60, -44], group: 3 },
  { text: "peur", at: [-8, -70, -38], group: 3 },
  { text: "colère", at: [12, -72, -50], group: 3 },
  { text: "amour", at: [-2, -56, -56], group: 3 },
];

const CLUSTERS: { label: string; at: Vec3 }[] = [
  { label: "Royauté", at: [2, 30, 0] },
  { label: "Pays & capitales", at: [70, 56, -40] },
  { label: "Animaux", at: [-64, 68, -40] },
  { label: "Cuisine", at: [-56, -26, 48] },
  { label: "Technologie", at: [56, -24, 46] },
  { label: "Émotions", at: [2, -44, -48] },
];

const ARROWS: { from: string; to: string; phase: number }[] = [
  { from: "roi", to: "reine", phase: 2 },
  { from: "homme", to: "femme", phase: 2 },
  { from: "France", to: "Paris", phase: 3 },
  { from: "Italie", to: "Rome", phase: 3 },
];

type Camera = { target: Vec3; distance: number; yaw: number; pitch: number };

const PHASES: Camera[] = [
  { target: [0, 0, 0], distance: 34, yaw: 0.2, pitch: 0.12 },
  { target: [2, 4, 0], distance: 78, yaw: -0.25, pitch: 0.18 },
  { target: [-14, -4, 6], distance: 105, yaw: 0.1, pitch: 0.1 },
  { target: [0, 0, 0], distance: 330, yaw: -0.6, pitch: 0.28 },
];

const CAPTIONS = [
  "Pour l'IA, un mot est une liste de nombres : une position dans un espace.",
  "Les mots de sens proche sont proches.",
  "Les directions ont un sens : roi − homme + femme ≈ reine.",
  "Paris − France + Italie ≈ Rome. Le langage devient une carte.",
];

/** Faint dust: deterministic points in a sphere. */
const DUST: Vec3[] = (() => {
  let state = 42;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  return Array.from({ length: 520 }, () => {
    const radius = 60 + random() * 260;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    return [radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)];
  });
})();

/** Each word links to its two nearest neighbours of the same phase (constellation). */
const LINKS: [number, number][] = (() => {
  const links: [number, number][] = [];
  WORDS.forEach((word, index) => {
    const nearest = WORDS.map((other, otherIndex) => ({
      otherIndex,
      d: Math.hypot(...(other.at.map((v, axis) => v - word.at[axis]!) as Vec3)),
    }))
      .filter(({ otherIndex, d }) => otherIndex !== index && d < 30)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    nearest.forEach(({ otherIndex }) => {
      if (!links.some(([a, b]) => (a === otherIndex && b === index) || (a === index && b === otherIndex))) {
        links.push([index, otherIndex]);
      }
    });
  });
  return links;
})();

type Colors = { text: string; muted: string; link: string; accent: string; dust: string; line: string; bg: string };

function readColors(element: Element): Colors {
  const style = getComputedStyle(element);
  const get = (name: string) => style.getPropertyValue(name).trim();
  return {
    text: get("--text"),
    muted: get("--text-muted"),
    link: get("--link"),
    accent: get("--accent"),
    dust: get("--dot-matrix"),
    line: get("--line-1"),
    bg: get("--bg"),
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Embeddings3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const clusterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const numbersRef = useRef<HTMLSpanElement>(null);

  // Phase = number of revealed step markers (driven by <Deck>).
  const subscribe = useCallback((onChange: () => void) => {
    const root = rootRef.current;
    const slide = root?.closest("[data-slide]");
    if (!root || !slide) return () => {};
    const observer = new MutationObserver(onChange);
    observer.observe(slide, { attributes: true, subtree: true, attributeFilter: ["data-shown", "data-state"] });
    return () => observer.disconnect();
  }, []);
  const phase = useSyncExternalStore(
    subscribe,
    () => rootRef.current?.querySelectorAll(".emb3d-step[data-shown]").length ?? 0,
    () => 0,
  );
  const slideState = useSyncExternalStore(
    subscribe,
    () => (rootRef.current?.closest("[data-slide]") as HTMLElement | null)?.dataset.state ?? "hidden",
    () => "hidden",
  );

  // Mutable animation state (never triggers React renders).
  const sim = useRef({
    camera: { ...PHASES[3]!, distance: 2400 } as Camera,
    user: { yaw: 0, pitch: 0, zoom: 1 },
    focus: null as number | null,
    alpha: WORDS.map(() => 0),
    arrows: ARROWS.map(() => 0),
    clusters: CLUSTERS.map(() => 0),
    phase: 0,
    time: 0,
    dragging: null as null | { x: number; y: number },
    reduced: false,
  });

  useEffect(() => {
    sim.current.phase = phase;
    sim.current.focus = null;
  }, [phase]);

  // Fly in from far away each time the slide becomes active.
  useEffect(() => {
    const state = sim.current;
    if (slideState === "active") {
      state.camera = { ...state.camera, distance: state.reduced ? PHASES[state.phase]!.distance : 2400 };
      state.user = { yaw: 0, pitch: 0, zoom: 1 };
      state.focus = null;
      state.alpha = state.alpha.map(() => 0);
      state.arrows = state.arrows.map(() => 0);
      state.clusters = state.clusters.map(() => 0);
    }
  }, [slideState]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const state = sim.current;
    state.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let colors = readColors(root);
    const themeObserver = new MutationObserver(() => {
      colors = readColors(root);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let width = 0;
    let height = 0;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = root.clientWidth;
      height = root.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);

    const previous = new Map<number, [number, number]>();
    let frame = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const slide = root.closest("[data-slide]") as HTMLElement | null;
      const active = slide?.dataset.state === "active";
      // Large cap keeps the motion time-based even on slow or throttled displays.
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      state.time += dt;

      // Camera target: phase, focused word, user offsets.
      const goal = { ...PHASES[active ? state.phase : 3]! };
      if (state.focus !== null) {
        goal.target = WORDS[state.focus]!.at;
        goal.distance = 40;
      }
      const autoYaw = state.reduced || state.dragging ? 0 : state.time * (state.phase >= 3 ? 0.06 : 0.025);
      const k = state.reduced ? 1 : 1 - Math.exp(-dt * 2.2);
      const cam = state.camera;
      cam.target = cam.target.map((v, axis) => lerp(v, goal.target[axis]!, k)) as Vec3;
      cam.distance = lerp(cam.distance, goal.distance * state.user.zoom, state.reduced ? 1 : 1 - Math.exp(-dt * 1.6));
      cam.yaw = lerp(cam.yaw, goal.yaw + state.user.yaw + autoYaw, k);
      cam.pitch = lerp(cam.pitch, Math.max(-1.2, Math.min(1.2, goal.pitch + state.user.pitch)), k);

      const visiblePhase = active ? state.phase : 3;
      const fade = state.reduced ? 1 : 1 - Math.exp(-dt * 3);
      WORDS.forEach((word, index) => {
        state.alpha[index] = lerp(state.alpha[index]!, word.group <= visiblePhase ? 1 : 0, fade);
      });
      ARROWS.forEach((arrow, index) => {
        state.arrows[index] = lerp(state.arrows[index]!, arrow.phase <= visiblePhase ? 1 : 0, fade * 0.7);
      });
      CLUSTERS.forEach((_, index) => {
        state.clusters[index] = lerp(state.clusters[index]!, visiblePhase >= 3 ? 1 : 0, fade);
      });

      // Projection.
      const cy = Math.cos(cam.yaw);
      const sy = Math.sin(cam.yaw);
      const cp = Math.cos(cam.pitch);
      const sp = Math.sin(cam.pitch);
      const focal = Math.min(width, height * 1.6) * 0.9;
      const project = (point: Vec3) => {
        const x = point[0] - cam.target[0];
        const y = point[1] - cam.target[1];
        const z = point[2] - cam.target[2];
        const x1 = x * cy - z * sy;
        const z1 = x * sy + z * cy;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const depth = cam.distance - z2;
        if (depth < 2) return null;
        const scale = focal / depth;
        return { x: width / 2 + x1 * scale, y: height / 2 - y2 * scale, scale, depth };
      };

      context.clearRect(0, 0, width, height);

      // Dust, with warp streaks while flying fast.
      const speed = Math.abs(cam.distance - goal.distance * state.user.zoom) / 400;
      context.fillStyle = colors.dust;
      context.strokeStyle = colors.dust;
      DUST.forEach((point, index) => {
        const p = project(point);
        if (!p || p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
          previous.delete(index);
          return;
        }
        const radius = Math.min(3, 0.6 + p.scale * 0.9);
        const before = previous.get(index);
        if (before && speed > 0.15) {
          context.lineWidth = radius;
          context.beginPath();
          context.moveTo(before[0], before[1]);
          context.lineTo(p.x, p.y);
          context.stroke();
        } else {
          context.beginPath();
          context.arc(p.x, p.y, radius, 0, Math.PI * 2);
          context.fill();
        }
        previous.set(index, [p.x, p.y]);
      });

      const projected = WORDS.map((word) => project(word.at));

      // Constellation links.
      context.strokeStyle = colors.line;
      context.lineWidth = 1;
      LINKS.forEach(([a, b]) => {
        const pa = projected[a];
        const pb = projected[b];
        const alpha = Math.min(state.alpha[a]!, state.alpha[b]!) * 0.35;
        if (!pa || !pb || alpha < 0.02) return;
        context.globalAlpha = alpha;
        context.beginPath();
        context.moveTo(pa.x, pa.y);
        context.lineTo(pb.x, pb.y);
        context.stroke();
      });
      context.globalAlpha = 1;

      // Analogy arrows, drawn progressively.
      ARROWS.forEach((arrow, index) => {
        const progress = state.arrows[index]!;
        const from = projected[WORDS.findIndex((word) => word.text === arrow.from)];
        const to = projected[WORDS.findIndex((word) => word.text === arrow.to)];
        if (!from || !to || progress < 0.02) return;
        const x = lerp(from.x, to.x, progress);
        const y = lerp(from.y, to.y, progress);
        context.strokeStyle = colors.link;
        context.fillStyle = colors.link;
        context.lineWidth = 2.5;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(x, y);
        context.stroke();
        const angle = Math.atan2(y - from.y, x - from.x);
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - 11 * Math.cos(angle - 0.4), y - 11 * Math.sin(angle - 0.4));
        context.lineTo(x - 11 * Math.cos(angle + 0.4), y - 11 * Math.sin(angle + 0.4));
        context.closePath();
        context.fill();
      });

      // Word points, far to near.
      projected
        .map((p, index) => ({ p, index }))
        .filter(({ p, index }) => p && state.alpha[index]! > 0.02)
        .sort((a, b) => b.p!.depth - a.p!.depth)
        .forEach(({ p, index }) => {
          const word = WORDS[index]!;
          const color = word.key ? colors.accent : word.strong ? colors.link : colors.muted;
          const radius = Math.max(2.5, Math.min(14, p!.scale * (word.key || word.strong ? 1.6 : 1.1)));
          context.globalAlpha = state.alpha[index]!;
          if (word.key || word.strong) {
            const glow = context.createRadialGradient(p!.x, p!.y, 0, p!.x, p!.y, radius * 4);
            glow.addColorStop(0, color);
            glow.addColorStop(1, "transparent");
            context.fillStyle = glow;
            context.globalAlpha = state.alpha[index]! * 0.35;
            context.beginPath();
            context.arc(p!.x, p!.y, radius * 4, 0, Math.PI * 2);
            context.fill();
            context.globalAlpha = state.alpha[index]!;
          }
          context.fillStyle = color;
          context.beginPath();
          context.arc(p!.x, p!.y, radius, 0, Math.PI * 2);
          context.fill();
        });
      context.globalAlpha = 1;

      // DOM labels.
      projected.forEach((p, index) => {
        const label = labelRefs.current[index];
        if (!label) return;
        const alpha = state.alpha[index]!;
        if (!p || alpha < 0.02) {
          label.style.opacity = "0";
          label.style.pointerEvents = "none";
          return;
        }
        const size = Math.max(11, Math.min(46, p.scale * 4.2));
        label.style.opacity = String(alpha * Math.max(0.35, Math.min(1, 160 / p.depth + 0.3)));
        label.style.transform = `translate(${p.x + size * 0.45}px, ${p.y - size * 0.62}px)`;
        label.style.fontSize = `${size}px`;
        label.style.zIndex = String(Math.round(10000 - p.depth));
        label.style.pointerEvents = "auto";
      });

      CLUSTERS.forEach((cluster, index) => {
        const element = clusterRefs.current[index];
        const p = project(cluster.at);
        if (!element) return;
        if (!p || state.clusters[index]! < 0.02) {
          element.style.opacity = "0";
          return;
        }
        element.style.opacity = String(state.clusters[index]! * 0.9);
        element.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      });

      const king = projected[0];
      if (numbersRef.current) {
        const show = king && visiblePhase === 0 && active;
        numbersRef.current.style.opacity = show ? "1" : "0";
        if (king) numbersRef.current.style.transform = `translate(${king.x + 20}px, ${king.y + 34}px)`;
      }

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    // Interaction: drag to orbit, wheel to zoom.
    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("button")) return;
      state.dragging = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!state.dragging) return;
      state.user.yaw += (event.clientX - state.dragging.x) * 0.006;
      state.user.pitch += (event.clientY - state.dragging.y) * 0.004;
      state.dragging = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = () => {
      state.dragging = null;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      state.user.zoom = Math.max(0.25, Math.min(4, state.user.zoom * Math.exp(event.deltaY * 0.0012)));
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("wheel", onWheel);
    };
  }, []);

  const focusWord = (index: number) => {
    const state = sim.current;
    state.focus = state.focus === index ? null : index;
    state.user = { yaw: state.user.yaw, pitch: state.user.pitch, zoom: 1 };
  };

  return (
    <div ref={rootRef} className="emb3d">
      <canvas ref={canvasRef} className="emb3d-canvas" aria-hidden="true" />

      <div className="emb3d-labels">
        {CLUSTERS.map((cluster, index) => (
          <span
            key={cluster.label}
            ref={(element) => {
              clusterRefs.current[index] = element;
            }}
            className="emb3d-cluster"
            aria-hidden="true"
          >
            {cluster.label}
          </span>
        ))}
        {WORDS.map((word, index) => (
          <button
            key={word.text}
            ref={(element) => {
              labelRefs.current[index] = element;
            }}
            type="button"
            className="emb3d-word"
            data-key={word.key || undefined}
            data-strong={word.strong || undefined}
            onClick={() => focusWord(index)}
            tabIndex={-1}
          >
            {word.text}
          </button>
        ))}
        <span ref={numbersRef} className="emb3d-numbers" aria-hidden="true">
          [ 0,21 · −0,47 · 0,88 · 0,05 · −0,63 · … ]
        </span>
      </div>

      <div className="emb3d-caption" aria-live="polite">
        <p>{CAPTIONS[phase]}</p>
        <p className="emb3d-hint">Glissez pour tourner · molette pour zoomer · cliquez un mot pour y voler</p>
      </div>

      {/* Hidden step markers: each key press advances one camera phase. */}
      <span data-step="" className="emb3d-step" />
      <span data-step="" className="emb3d-step" />
      <span data-step="" className="emb3d-step" />
    </div>
  );
}
