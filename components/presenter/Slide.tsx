import type { ReactNode } from "react";
import { Arc, DottedArc, Grid, Halo, Lines, TechStar } from "@/components/brand";

export type SlideLayout = "default" | "title" | "section" | "statement" | "center" | "full";

type SlideProps = {
  layout?: SlideLayout;
  /** Kicker shown above the content. Section slides without kicker are numbered automatically. */
  kicker?: string;
  children: ReactNode;
};

/** One 16:9 slide. Visibility, numbering and steps are driven by <Deck> through data attributes. */
export function Slide({ layout = "default", kicker, children }: SlideProps) {
  return (
    <section data-slide="" data-layout={layout} className="slide" aria-roledescription="slide">
      <SlideDecor layout={layout} />
      <div className="slide-body">
        {kicker ? (
          <p className="s-kicker">{kicker}</p>
        ) : (
          layout === "section" && <p className="s-kicker" data-auto-number="" />
        )}
        {children}
      </div>
      <footer className="slide-footer" aria-hidden="true">
        <span>
          Building things<span className="text-accent">.</span>
        </span>
        <span className="slide-number" />
      </footer>
    </section>
  );
}

function SlideDecor({ layout }: { layout: SlideLayout }) {
  switch (layout) {
    case "title":
      return (
        <div className="slide-decor" aria-hidden="true">
          <Grid cell={64} />
          <Halo className="-right-[10%] -top-[30%] size-[60%]" />
          <Arc className="absolute -bottom-[45%] -right-[12%] w-[55%]" />
          <TechStar size={40} className="absolute right-[38%] top-[16%]" />
        </div>
      );
    case "section":
      return (
        <div className="slide-decor" aria-hidden="true">
          <Halo className="-left-[15%] -top-[40%] size-[60%]" />
          <Lines className="absolute bottom-0 right-0 h-[55%] w-[60%] opacity-80" />
        </div>
      );
    case "statement":
      return (
        <div className="slide-decor" aria-hidden="true">
          <Grid cell={64} />
          <DottedArc className="absolute -right-[4%] -top-[6%] w-[28%] opacity-70" />
        </div>
      );
    default:
      return null;
  }
}
