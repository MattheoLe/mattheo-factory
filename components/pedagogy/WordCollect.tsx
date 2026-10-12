"use client";

import { X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useSession } from "@/components/presenter/SessionContext";
import { useDeckStore } from "@/components/presenter/useDeckStore";

type WordCollectProps = {
  /** Storage id, unique in the course */
  id: string;
  /** Read-only display of an earlier collection (mirror effect) */
  readOnly?: boolean;
  placeholder?: string;
};

type Word = { text: string; count: number };
const EMPTY: Word[] = [];

/** Words said by the room, typed live by the trainer and shown as a growing cloud. */
export function WordCollect({ id, readOnly = false, placeholder = "Un mot de la salle…" }: WordCollectProps) {
  const { deckId } = useSession();
  const [words, setWords] = useDeckStore<Word[]>(deckId, `words:${id}`, EMPTY);
  const [draft, setDraft] = useState("");
  const max = Math.max(1, ...words.map((word) => word.count));

  function add(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setWords((list) => {
      const existing = list.find((word) => word.text.toLowerCase() === text.toLowerCase());
      return existing
        ? list.map((word) => (word === existing ? { ...word, count: word.count + 1 } : word))
        : [...list, { text, count: 1 }];
    });
    setDraft("");
  }

  return (
    <div className="words">
      <ul className="words-cloud" aria-label="Mots de la salle">
        {words.length === 0 && (
          <li className="words-empty">{readOnly ? "Aucun mot noté." : "Les mots apparaîtront ici."}</li>
        )}
        {words.map((word, index) => (
          <li
            key={word.text}
            className="words-item"
            data-tone={index % 3}
            style={{ fontSize: `${2 + (word.count / max) * 2.4}cqw` }}
          >
            {word.text}
            {!readOnly && (
              <button
                type="button"
                className="words-remove"
                aria-label={`Retirer ${word.text}`}
                onClick={() => setWords((list) => list.filter((item) => item.text !== word.text))}
              >
                <X size={12} aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {!readOnly && (
        <form className="words-form" onSubmit={add}>
          <label className="sr-only" htmlFor={`words-${id}`}>
            Ajouter un mot
          </label>
          <input
            id={`words-${id}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={placeholder}
            autoComplete="off"
          />
          <button type="submit">Ajouter</button>
        </form>
      )}
    </div>
  );
}
