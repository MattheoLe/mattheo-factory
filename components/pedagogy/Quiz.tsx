import type { ReactNode } from "react";
import { SignalDot } from "@/components/brand";

type QuizProps = {
  question: string;
  options: string[];
  /** Index of the correct option */
  answer: number;
  /** Short explanation revealed with the answer */
  explanation?: string;
  /** e.g. "Question 3 / 10" */
  label?: string;
  /** Optional stimulus shown above the options (text, quote…) */
  children?: ReactNode;
};

/**
 * Projected quiz, "room" mode (ADR-010): the room answers aloud or by show of hands,
 * the next key press reveals the answer. Pure CSS reveal (`:has`), no client JS.
 */
export function Quiz({ question, options, answer, explanation, label, children }: QuizProps) {
  return (
    <div className="quiz">
      {label && <p className="s-kicker">{label}</p>}
      <p className="s-title quiz-question">{question}</p>
      {children && <div className="quiz-stimulus">{children}</div>}
      <ol className="quiz-options" data-count={options.length}>
        {options.map((option, index) => (
          <li key={option} className="quiz-option" data-correct={index === answer || undefined}>
            <span className="quiz-letter" aria-hidden="true">
              {String.fromCharCode(65 + index)}
            </span>
            <span>{option}</span>
            {index === answer && <SignalDot size="md" className="quiz-dot" />}
          </li>
        ))}
      </ol>
      <div data-step="" className="quiz-reveal">
        {explanation && <p className="s-text">{explanation}</p>}
      </div>
    </div>
  );
}
