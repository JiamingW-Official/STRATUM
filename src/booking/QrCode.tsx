import { useMemo } from "react";
import { encodeQr, qrPath } from "./qr";

/**
 * The code, as one SVG path on a light plate.
 *
 * The quiet zone is four modules and it is not optional: a QR code printed to
 * the edge of its own field is a QR code that does not scan, which is the one
 * way this screen can fail at the thing it exists for.
 */
export function Qr({ text, title }: { text: string; title: string }) {
  const { path, extent } = useMemo(() => {
    const m = encodeQr(text);
    return { path: qrPath(m), extent: m.size + 8 };
  }, [text]);

  return (
    <svg viewBox={`-4 -4 ${extent} ${extent}`} role="img" aria-label={title}>
      <title>{title}</title>
      <rect x={-4} y={-4} width={extent} height={extent} fill="none" />
      <path d={path} fill="var(--plate-ink)" />
    </svg>
  );
}
