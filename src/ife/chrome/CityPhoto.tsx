import { useEffect, useState } from "react";
import type { Destination } from "../../flight-state/destination";

/**
 * The photograph of where you are going, in the order it arrives.
 *
 * Wikipedia hands back two renders of the same upload: a 330px thumbnail and
 * the original, which for a city is routinely several megabytes — Beijing's
 * is 4.5. On a cabin's link the big one can take seconds, and what was on
 * the glass until it landed was black. The thumbnail is ten kilobytes and
 * arrives almost at once, so it goes up first, scaled and softened; the full
 * render fades over it when it has decoded.
 *
 * Blurred on purpose while it is the thumbnail. A 330px image stretched to
 * 1920 is not a photograph of a city, it is a photograph of its own pixels —
 * blurring it says "this is the shape of the picture, the picture is coming"
 * rather than "this is the picture and it is broken".
 *
 * `decode()` rather than `onload`: onload fires when the bytes are in, and
 * the paint that follows can still drop a frame while the browser turns
 * several megabytes of JPEG into a bitmap. Decoding first means the swap is
 * a compositor fade and nothing else.
 */
export function CityPhoto({
  dest,
  className = "ife-photo",
}: {
  dest: Destination | null;
  className?: string;
}) {
  const full = dest?.image ?? null;
  const thumb = dest?.thumb ?? null;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    if (!full) return;
    // Nothing to fade to if the two are the same file, which happens when a
    // city has only a thumbnail.
    if (full === thumb) {
      setReady(true);
      return;
    }
    let live = true;
    const img = new Image();
    img.decoding = "async";
    img.src = full;
    const done = () => live && setReady(true);
    // A decode that fails still gets the swap: the img tag may yet paint it,
    // and a stuck thumbnail is worse than a risk.
    (img.decode?.() ?? Promise.reject()).then(done, done);
    return () => {
      live = false;
    };
  }, [full, thumb]);

  if (!full && !thumb) return null;

  return (
    <div className={className}>
      {thumb && (
        <span
          className="ife-photo-layer ife-photo-layer--thumb"
          data-hidden={ready}
          style={{ backgroundImage: `url(${thumb})` }}
        />
      )}
      {full && (
        <span
          className="ife-photo-layer"
          data-shown={ready}
          style={{ backgroundImage: `url(${full})` }}
        />
      )}
    </div>
  );
}
