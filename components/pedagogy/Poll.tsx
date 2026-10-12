"use client";

import { Minus, Plus } from "lucide-react";
import { useSession } from "@/components/presenter/SessionContext";
import { useDeckStore } from "@/components/presenter/useDeckStore";

type PollProps = {
  /** Storage id, unique in the course */
  id: string;
  options: string[];
  /** Id of an earlier poll with the same options, shown as "début" markers */
  compareTo?: string;
};

type Counts = Record<string, number>;
const EMPTY: Counts = {};

function percentages(options: string[], counts: Counts) {
  const total = options.reduce((sum, option) => sum + (counts[option] ?? 0), 0);
  return {
    total,
    share: (option: string) => (total ? Math.round(((counts[option] ?? 0) / total) * 100) : 0),
  };
}

/** Show-of-hands barometer: the trainer enters the counts, bars animate (room mode, ADR-010). */
export function Poll({ id, options, compareTo }: PollProps) {
  const { deckId } = useSession();
  const [counts, setCounts] = useDeckStore<Counts>(deckId, `poll:${id}`, EMPTY);
  const [previous] = useDeckStore<Counts>(deckId, `poll:${compareTo ?? id}`, EMPTY);
  const now = percentages(options, counts);
  const before = percentages(options, previous);

  const change = (option: string, delta: number) =>
    setCounts((value) => ({ ...value, [option]: Math.max(0, (value[option] ?? 0) + delta) }));

  return (
    <div className="poll">
      {options.map((option) => (
        <div key={option} className="poll-row">
          <span className="poll-label">{option}</span>
          <div className="poll-track">
            <span className="poll-bar" style={{ width: `${now.share(option)}%` }} />
            {compareTo && before.total > 0 && (
              <span className="poll-before" style={{ left: `${before.share(option)}%` }}>
                <span className="poll-before-label">début : {before.share(option)} %</span>
              </span>
            )}
          </div>
          <span className="poll-value">
            {now.share(option)} %<span className="poll-count"> ({counts[option] ?? 0})</span>
          </span>
          <span className="poll-controls">
            <button type="button" aria-label={`Retirer une voix à ${option}`} onClick={() => change(option, -1)}>
              <Minus size={14} aria-hidden="true" />
            </button>
            <button type="button" aria-label={`Ajouter une voix à ${option}`} onClick={() => change(option, 1)}>
              <Plus size={14} aria-hidden="true" />
            </button>
          </span>
        </div>
      ))}
      <p className="s-small">
        {now.total === 0 ? "Comptez les mains levées et saisissez les voix avec + / −." : `${now.total} réponses`}
      </p>
    </div>
  );
}
