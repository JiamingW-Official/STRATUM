import { stillUrl, type Film } from "../films";

/**
 * A film's cover, portrait, because that is the shape a shelf of films is.
 *
 * None of these films has a poster. They are industrial and educational
 * shorts and somebody's home movie: they were shipped in a can with a typed
 * label on it, and the only image that belongs to them is a frame. So the
 * cover is the frame, cropped to portrait, with the label across the bottom —
 * which is the object, not a poster invented for it.
 *
 * The frames the archive serves are 180px wide, and at a poster's size that is
 * soft. The scanlines are the answer and they are not a trick: half this shelf
 * is kinescope — a film camera pointed at a television — so a scanline is what
 * the material actually is. It makes the softness read as the source rather
 * than as a mistake.
 */
export function Poster({ film }: { film: Film }) {
  return (
    <span className="ife-poster">
      <span
        className="ife-poster-frame"
        style={{ backgroundImage: `url(${stillUrl(film)})` }}
      />
      <span className="ife-poster-lines" />
      {film.creator ? (
        <span className="ife-poster-label ife-cap">{film.creator}</span>
      ) : (
        // The home movie has no creator in the archive, and a blank label is
        // the truth about it: somebody filmed their own flight and nobody
        // wrote down who.
        <span className="ife-poster-label ife-poster-label--none ife-cap">
          ——
        </span>
      )}
    </span>
  );
}
