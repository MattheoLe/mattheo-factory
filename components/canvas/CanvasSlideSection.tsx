import { Notes } from "@/components/presenter/Notes";
import type { CanvasSlide } from "@/lib/canvas/model";
import { CanvasView } from "./CanvasView";

/** A canvas slide inside the presentation deck (same contract as <Slide>). */
export function CanvasSlideSection({ slide }: { slide: CanvasSlide }) {
  return (
    <section data-slide="" data-layout="canvas" className="slide" aria-roledescription="slide">
      <CanvasView slide={slide} />
      {slide.notes ? (
        <Notes>
          {slide.notes.split(/\n{2,}/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Notes>
      ) : null}
    </section>
  );
}
