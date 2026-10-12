import { SignalDot } from "@/components/brand";

type Event = { year: string; text: string };

/** Horizontal timeline on a dotted orbit; the last event gets the signal point. */
export function Timeline({ events }: { events: Event[] }) {
  return (
    <ol className="timeline">
      {events.map((event, index) => (
        <li key={event.year} className="timeline-item" data-step={index === 0 ? undefined : ""}>
          <span className="timeline-dot" aria-hidden="true">
            {index === events.length - 1 ? <SignalDot size="md" /> : <span className="timeline-node" />}
          </span>
          <p className="timeline-year">{event.year}</p>
          <p className="card-body">{event.text}</p>
        </li>
      ))}
    </ol>
  );
}
