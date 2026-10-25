import QR from "qrcode";

/** SVG path + size of a QR code, rendered with token colors by the caller. */
export function qrPath(url: string) {
  const { modules } = QR.create(url, { errorCorrectionLevel: "M" });
  const size = modules.size;
  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules.get(y, x)) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { path, size };
}
