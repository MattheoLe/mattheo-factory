"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/** Optional sound: drop your own file here (never a third-party brand sound). */
const SOUND_URL = "/sounds/intro.mp3";
const DURATION_MS = 3600;

/**
 * Opening "ident" played when arriving from the "Se former" CTA (?intro):
 * the logotype lights up, light ribbons burst, the camera dives into the orange dot.
 * Skippable (click, Escape, button); skipped entirely with prefers-reduced-motion.
 */
export function Intro() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requested = searchParams.has("intro");
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    setDone(true);
    router.replace("/formations", { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!requested) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audio = new Audio(SOUND_URL);
    if (!reduced) {
      audio.volume = 0.8;
      audio.play().catch(() => {
        // No sound file, or autoplay refused: the intro stays silent.
      });
    }
    // Reduced motion: no ident at all, straight to the catalogue.
    const timer = window.setTimeout(finish, reduced ? 0 : DURATION_MS);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === " " || event.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      audio.pause();
    };
  }, [requested, finish]);

  if (!requested || done) return null;

  return (
    <div className="intro" data-theme="dark" onClick={finish} role="presentation">
      <div className="intro-ribbons" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <p className="intro-logo" aria-label="Building things.">
        <span aria-hidden="true">Building</span>
        <span aria-hidden="true">
          <span className="text-grad-main">things</span>
          <span className="intro-dot" />
        </span>
      </p>
      <span className="intro-flash" aria-hidden="true" />
      <button
        type="button"
        className="intro-skip"
        onClick={(event) => {
          event.stopPropagation();
          finish();
        }}
      >
        Passer l&apos;intro
      </button>
    </div>
  );
}
