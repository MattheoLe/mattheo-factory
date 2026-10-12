import {
  AudioLines,
  Clapperboard,
  Code2,
  Image as ImageIcon,
  Mic,
  Music,
  Type,
  type LucideIcon,
} from "lucide-react";
import { SignalDot } from "@/components/brand";

const ICONS: Record<string, LucideIcon> = {
  texte: Type,
  image: ImageIcon,
  voix: Mic,
  son: AudioLines,
  video: Clapperboard,
  musique: Music,
  code: Code2,
};

type HubItem = { label: string; hint?: string; icon: keyof typeof ICONS };

/**
 * A central concept with satellites on a dotted orbit (e.g. multimodal AI).
 * Satellites are revealed one by one.
 */
export function Hub({ center, items }: { center: string; items: HubItem[] }) {
  return (
    <div className="hub">
      <svg className="hub-orbit" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="50" rx="38" ry="36" />
      </svg>
      <p className="hub-center">
        {center}
        <SignalDot size="sm" />
      </p>
      {items.map((item, index) => {
        const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2;
        const Icon = ICONS[item.icon] ?? Type;
        return (
          <div
            key={item.label}
            data-step=""
            className="hub-item"
            style={{ left: `${50 + Math.cos(angle) * 38}%`, top: `${50 + Math.sin(angle) * 36}%` }}
          >
            <span className="hub-icon" aria-hidden="true">
              <Icon strokeWidth={1.6} />
            </span>
            <span className="hub-label">{item.label}</span>
            {item.hint && <span className="hub-hint">{item.hint}</span>}
          </div>
        );
      })}
    </div>
  );
}
