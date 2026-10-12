import type { ReactNode } from "react";
import { SignalDot } from "@/components/brand";

/** Side-by-side columns. */
export function Columns({ children }: { children: ReactNode }) {
  return <div className="columns">{children}</div>;
}

/** A surface card; `step` reveals it progressively, `signal` marks the key concept. */
export function Card({
  title,
  children,
  step = false,
  signal = false,
}: {
  title: string;
  children?: ReactNode;
  step?: boolean;
  signal?: boolean;
}) {
  return (
    <div className="card" data-step={step ? "" : undefined}>
      <p className="card-title">
        {title}
        {signal && <SignalDot size="sm" />}
      </p>
      {children && <div className="card-body">{children}</div>}
    </div>
  );
}

/** Markdown list whose items are revealed one by one. */
export function Points({ children }: { children: ReactNode }) {
  return (
    <div data-step-items="" className="points">
      {children}
    </div>
  );
}

export function Quote({ children, author }: { children: ReactNode; author?: string }) {
  return (
    <figure className="quote">
      <blockquote className="s-statement">{children}</blockquote>
      {author && <figcaption className="s-lead">— {author}</figcaption>}
    </figure>
  );
}

/** Text shown as a projected "document" (e.g. Humain ou IA ?). */
export function Excerpt({ children }: { children: ReactNode }) {
  return <div className="excerpt">{children}</div>;
}

/** Recap of the course pillars, revealed one by one. */
export function Pillars({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="pillars">
      {items.map((item, index) => (
        <li key={item.title} className="card" data-step="">
          <span className="pillar-number">{String(index + 1).padStart(2, "0")}</span>
          <p className="card-title">{item.title}</p>
          <p className="card-body">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
