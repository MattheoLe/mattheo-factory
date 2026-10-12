import { ImageIcon } from "lucide-react";
import Image from "next/image";

type MediaProps = {
  /** Path under /public, e.g. "/formations/ia-generative/pape.jpg". Omit to show a placeholder. */
  src?: string;
  alt: string;
  caption?: string;
  source?: string;
  /** Small label on the image, e.g. "Généré par IA" */
  badge?: string;
  /** Wrap in a step to reveal it */
  step?: boolean;
};

/**
 * Image in a slide. Without `src`, renders a placeholder that describes the image
 * the trainer has to provide (content images may be bitmaps; brand assets may not).
 */
export function Media({ src, alt, caption, source, badge, step = false }: MediaProps) {
  return (
    <figure className="media" data-step={step ? "" : undefined}>
      <div className="media-frame">
        {src ? (
          <Image src={src} alt={alt} fill sizes="50vw" className="media-image" />
        ) : (
          <div className="media-placeholder">
            <ImageIcon aria-hidden="true" strokeWidth={1.4} />
            <p>
              <strong>Image à ajouter</strong>
              <br />
              {alt}
            </p>
          </div>
        )}
        {badge && <span className="media-badge">{badge}</span>}
      </div>
      {(caption || source) && (
        <figcaption>
          {caption && <p className="media-caption">{caption}</p>}
          {source && <p className="s-small">Source : {source}</p>}
        </figcaption>
      )}
    </figure>
  );
}
