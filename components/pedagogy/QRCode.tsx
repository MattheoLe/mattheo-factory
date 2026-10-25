import { qrPath } from "@/lib/qr";

type QRCodeProps = {
  url?: string;
  label?: string;
};

/** QR code rendered as SVG paths. Always drawn on a light card so phones can scan it in both themes. */
export function QRCode({ url, label }: QRCodeProps) {
  if (!url) {
    return (
      <div className="qr qr-missing">
        <p className="s-small">Lien à configurer</p>
      </div>
    );
  }

  const { path, size } = qrPath(url);

  return (
    <figure className="qr" data-theme="light">
      <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} role="img" aria-label={label ?? `QR code vers ${url}`}>
        <path d={path} style={{ fill: "var(--text)" }} />
      </svg>
      {label && <figcaption className="s-small">{label}</figcaption>}
    </figure>
  );
}
