type StatProps = {
  value: string;
  label: string;
  source: string;
  /** Mark the figure as not yet validated by the trainer */
  draft?: boolean;
};

/** A sourced key figure (CONTENT_MODEL.md §4: every figure carries a source and a date). */
export function Stat({ value, label, source, draft = false }: StatProps) {
  return (
    <figure className="stat">
      <p className="stat-value">{value}</p>
      <figcaption>
        <p className="stat-label">{label}</p>
        <p className="s-small">
          Source : {source}
          {draft && <span className="stat-draft"> · à valider</span>}
        </p>
      </figcaption>
    </figure>
  );
}
