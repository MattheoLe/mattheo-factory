import { Bike, Building2, Bus, Car, Check, TreePine, type LucideIcon } from "lucide-react";

const TILES: { icon: LucideIcon; target: boolean }[] = [
  { icon: Bus, target: true },
  { icon: TreePine, target: false },
  { icon: Car, target: false },
  { icon: Building2, target: false },
  { icon: Bus, target: true },
  { icon: Bike, target: false },
  { icon: Car, target: false },
  { icon: Bus, target: true },
  { icon: TreePine, target: false },
];

/**
 * A CAPTCHA-like challenge drawn in the brand DA (not a copy of any vendor UI).
 * First step: the right tiles get ticked. The point: by answering, people
 * have been labelling images for vision AI without knowing it.
 */
export function Captcha({ label = "Sélectionnez toutes les images contenant un bus" }: { label?: string }) {
  return (
    <div className="captcha" aria-label="Exemple de test « je ne suis pas un robot »">
      <p className="captcha-head">{label}</p>
      <div className="captcha-grid" data-step="">
        {TILES.map(({ icon: Icon, target }, index) => (
          <span key={index} className="captcha-tile" data-target={target || undefined}>
            <Icon aria-hidden="true" strokeWidth={1.4} />
            {target && (
              <span className="captcha-check" aria-hidden="true">
                <Check strokeWidth={3} />
              </span>
            )}
          </span>
        ))}
      </div>
      <p className="captcha-foot">
        <span className="captcha-box" aria-hidden="true" />
        Je ne suis pas un robot
      </p>
    </div>
  );
}
