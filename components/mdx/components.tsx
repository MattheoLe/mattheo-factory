import type { ComponentPropsWithoutRef } from "react";
import { Audience } from "@/components/adapt/Audience";
import { Level } from "@/components/adapt/Level";
import { SignalDot, Tag, TechStar } from "@/components/brand";
import { Embeddings } from "@/components/diagrams/Embeddings";
import { Embeddings3D } from "@/components/diagrams/Embeddings3D";
import { Hub } from "@/components/diagrams/Hub";
import { NextWord } from "@/components/diagrams/NextWord";
import { Pipeline } from "@/components/diagrams/Pipeline";
import { Rings } from "@/components/diagrams/Rings";
import { Timeline } from "@/components/diagrams/Timeline";
import { Captcha } from "@/components/pedagogy/Captcha";
import { Card, Columns, Excerpt, Pillars, Points, Quote } from "@/components/pedagogy/Layout";
import { Media } from "@/components/pedagogy/Media";
import { Poll } from "@/components/pedagogy/Poll";
import { QRCode } from "@/components/pedagogy/QRCode";
import { Quiz } from "@/components/pedagogy/Quiz";
import { ScamCard } from "@/components/pedagogy/ScamCard";
import { Stat } from "@/components/pedagogy/Stat";
import { WordCollect } from "@/components/pedagogy/WordCollect";
import { Notes } from "@/components/presenter/Notes";
import { Slide } from "@/components/presenter/Slide";
import { Step } from "@/components/presenter/Step";

/** Markdown elements inside slides use the slide typography (styles/deck.css). */
const markdown = {
  h1: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="s-title" {...props} />,
  h2: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="s-subtitle" {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="s-lead" {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="s-list" {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="s-list" {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => <strong className="s-strong" {...props} />,
};

/** Components available in course MDX files (CONTENT_MODEL.md §4). */
export const mdxComponents = {
  ...markdown,
  Slide,
  Notes,
  Step,
  Level,
  Audience,
  Card,
  Columns,
  Points,
  Quote,
  Excerpt,
  Pillars,
  Stat,
  Quiz,
  Poll,
  WordCollect,
  QRCode,
  Media,
  ScamCard,
  Captcha,
  Embeddings,
  Embeddings3D,
  Hub,
  NextWord,
  Rings,
  Pipeline,
  Timeline,
  SignalDot,
  Tag,
  TechStar,
};
