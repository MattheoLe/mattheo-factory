import QR from "qrcode";

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

  const { modules } = QR.create(url, { errorCorrectionLevel: "M" });
  const size = modules.size;
  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules.get(y, x)) path += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <figure className="qr" data-theme="light">
      <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} role="img" aria-label={label ?? `QR code vers ${url}`}>
        <path d={path} style={{ fill: "var(--text)" }} />
      </svg>
      {label && <figcaption className="s-small">{label}</figcaption>}
    </figure>
  );
}
