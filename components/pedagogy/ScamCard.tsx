import { MessageSquare, Phone, Video, type LucideIcon } from "lucide-react";
import { SignalDot } from "@/components/brand";

const CHANNELS: Record<string, { icon: LucideIcon; label: string }> = {
  sms: { icon: MessageSquare, label: "SMS" },
  appel: { icon: Phone, label: "Appel" },
  visio: { icon: Video, label: "Visio" },
};

type ScamCardProps = {
  channel: keyof typeof CHANNELS;
  from: string;
  message: string;
  /** Warning signs, revealed one by one */
  flags: string[];
  /** The right reflex, revealed last */
  reflex: string;
};

/** A real-life scam scenario: the message as received, then the red flags, then the reflex. */
export function ScamCard({ channel, from, message, flags, reflex }: ScamCardProps) {
  const { icon: Icon, label } = CHANNELS[channel] ?? CHANNELS.sms!;
  return (
    <div className="scam">
      <div className="scam-phone">
        <p className="scam-from">
          <Icon aria-hidden="true" strokeWidth={1.6} />
          <span>
            {label} · {from}
          </span>
        </p>
        <p className="scam-bubble">{message}</p>
      </div>
      <div className="scam-analysis">
        <p className="type-eyebrow scam-title">Les signaux d&apos;alerte</p>
        <ul className="scam-flags">
          {flags.map((flag) => (
            <li key={flag} data-step="">
              {flag}
            </li>
          ))}
        </ul>
        <p data-step="" className="scam-reflex">
          <SignalDot size="sm" />
          <span>
            <strong>Le réflexe : </strong>
            {reflex}
          </span>
        </p>
      </div>
    </div>
  );
}
