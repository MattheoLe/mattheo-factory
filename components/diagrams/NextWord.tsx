import { SignalDot } from "@/components/brand";

type Candidate = { word: string; p: number };

type NextWordProps = {
  sentence: string;
  candidates: Candidate[];
};

/**
 * Next-word prediction, revealed step by step: each candidate with its probability,
 * then the most probable word completes the sentence.
 * The candidates come first in the DOM so their steps precede the completion step;
 * CSS `order` puts the sentence back on top.
 */
export function NextWord({ sentence, candidates }: NextWordProps) {
  const sorted = [...candidates].sort((a, b) => b.p - a.p);
  const winner = sorted[0];

  return (
    <div className="nextword">
      <ol className="nextword-candidates">
        {sorted.map((candidate, index) => (
          <li key={candidate.word} data-step="" className="nextword-row" data-top={index === 0 || undefined}>
            <span className="nextword-word">{candidate.word}</span>
            <span className="nextword-track">
              <span className="nextword-bar" style={{ width: `${candidate.p}%` }} />
            </span>
            <span className="nextword-p">{candidate.p} %</span>
            {index === 0 ? <SignalDot size="sm" /> : <span />}
          </li>
        ))}
      </ol>
      <p className="nextword-sentence">
        {sentence}{" "}
        <span className="nextword-blank">
          {winner && (
            <span data-step="" className="nextword-winner">
              {winner.word}
            </span>
          )}
        </span>
      </p>
    </div>
  );
}
