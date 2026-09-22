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
 * An img rather than a background-image, and that is not a tidy-up: a
 * background cannot be lazy. The shelf is twenty-eight frames fetched from
 * an archive on the other side of a satellite link and eight of them are on
 * the glass, so twenty were being pulled down for a row nobody had scrolled
 * to yet. The browser knows which ones are visible; this lets it act on it.
 */
export function Poster({ film }: { film: Film }) {
  return (
    <span className="ife-poster">
      <img
        className="ife-poster-frame"
        src={stillUrl(film)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
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
