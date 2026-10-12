import { SignalDot } from "@/components/brand";

type PipelineStep = { title: string; text?: string };

type PipelineProps = {
  steps: PipelineStep[];
  /** Index of the key step (gets the signal point) */
  highlight?: number;
  /** Draw a return arrow from the last to the first step (a loop) */
  loop?: boolean;
};

/** Left-to-right process; nodes are revealed one by one and linked by thin curves. */
export function Pipeline({ steps, highlight, loop = false }: PipelineProps) {
  return (
    <div className="pipeline" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((step, index) => (
        <div key={step.title} className="pipeline-node" data-step={index === 0 ? undefined : ""}>
          {index > 0 && (
            <svg className="pipeline-link" viewBox="0 0 40 20" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 10 C 14 2, 26 18, 40 10" fill="none" style={{ stroke: "var(--line-1)" }} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          <span className="pipeline-index">{String(index + 1).padStart(2, "0")}</span>
          <p className="card-title">
            {step.title}
            {highlight === index && <SignalDot size="sm" />}
          </p>
          {step.text && <p className="card-body">{step.text}</p>}
        </div>
      ))}
      {loop && (
        <p data-step="" className="pipeline-loop s-small">
          ↺ … et on recommence, mot après mot.
        </p>
      )}
    </div>
  );
}
