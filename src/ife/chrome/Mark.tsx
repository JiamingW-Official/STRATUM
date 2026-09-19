import { useState } from "react";

/**
 * A made mark, if one has been made.
 *
 * Found rather than declared, the same way the sleeves are: whatever .webp is
 * sitting in src/marks named after a row's key is that row's icon, and a row
 * with no file keeps the drawn one. That is why it is a glob and not a path
 * in the data — a path to a file that is not there is a 404 on every screen
 * that draws a menu, and this way an empty folder costs nothing and dropping
 * a file in is the whole installation step.
 *
 * What may be here at all: these are icons, and an icon is obviously a
 * drawing. Nothing in src/marks is allowed to sit where this interface
 * presents evidence — no city photograph, no film frame, no map tile, no
 * piece of hardware presented as a real receiver. A made picture of a record
 * on a menu row is a made picture of a record; a made picture of London on
 * the home screen would be the one untrue object in the work.
 */
const MARKS = import.meta.glob("../../marks/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function markFor(id: string): string | undefined {
  const key = Object.keys(MARKS).find((k) => k.endsWith(`/${id}.webp`));
  return key ? MARKS[key] : undefined;
}

/**
 * The made mark, or the drawn one.
 *
 * The fallback is not a placeholder. If the file is missing, or has not been
 * made yet, or fails to decode, the drawn mark is what is there — and a
 * drawn mark is what this cabin had before any of these existed.
 */
export function Mark({ id, drawn }: { id: string; drawn: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  const src = markFor(id);
  if (!src || failed) return <>{drawn}</>;
  return (
    <img
      className="ife-mark"
      src={src}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
    />
  );
}
