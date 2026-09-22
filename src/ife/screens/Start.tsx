import { useState } from "react";
import { useCabin, useSelf } from "../../flight-state/store";
import type { SeatMode } from "../../flight-state/types";
import { FILMS, stillUrl } from "../films";
import { useT } from "../i18n";
import { currentTrack, usePlayer } from "../player";
import { Sleeve } from "../chrome/Sleeve";
import { RouteMini } from "../chrome/RouteMini";
import { IconDining, IconFilm, IconPower } from "../chrome/icons";

/**
 * The first question, asked once.
 *
 * Every cabin asks some version of it and it is worth having, but only if the
 * answer does something. So each of these is a place this screen will
 * actually go, and one of them also turns the reading light off — and then
 * nothing else in the interface changes because of what you picked. A mode
 * that quietly reorders the whole system is a system that has decided who you
 * are on the strength of one tap at the gate.
 *
 * The faces are the cabin's own contents rather than stock photography of
 * people enjoying themselves: the film that is on the shelf, the record that
 * is on the turntable, the route that is on the map.
 *
 * Every face fills its card and every card is the same shape. They used to
 * be four different objects — a photograph bled to the edges, a sleeve
 * floating in a padded box with its own title printed on it, a line drawing,
 * and a black rectangle — and the black rectangle was the worst of it: "rest
 * has no face" is a nice sentence and on the glass it reads as an image that
 * failed to load. A mark is not a picture, but it is not a hole either.
 */
export function Start({ onDone }: { onDone: (mode: SeatMode | null) => void }) {
  const { t } = useT();
  const { stationIdx, trackIdx } = usePlayer();
  const now = currentTrack(stationIdx, trackIdx);
  const setMode = useSelf((s) => s.setMode);
  const seat = useSelf((s) => s.seat);
  const cabinClass = useCabin((s) => s.seats[seat]?.cabinClass ?? "economy");
  const feature = FILMS[0];
  // The still comes from archive.org over whatever link this aircraft has,
  // and sometimes it does not come. A background-image cannot tell you that;
  // an img can, and then the card falls back to the drawn mark rather than
  // to a rectangle of nothing.
  const [stillFailed, setStillFailed] = useState(false);

  const choose = (m: SeatMode | null) => () => {
    setMode(m);
    onDone(m);
  };

  return (
    <div className="ife-start">
      <h2 className="ife-start-title">{t("startTitle")}</h2>

      <div className="ife-start-grid">
        <button className="ife-start-card" onClick={choose("watch")}>
          <span className="ife-start-face">
            {stillFailed ? (
              <span className="ife-start-mark">
                <IconFilm size={96} />
              </span>
            ) : (
              <img
                className="ife-start-still"
                src={stillUrl(feature)}
                alt=""
                aria-hidden="true"
                onError={() => setStillFailed(true)}
              />
            )}
          </span>
          <span className="ife-start-body">
            <span className="ife-start-name">{t("modeWatch")}</span>
            <span className="ife-start-sub">{t("modeWatchSub")}</span>
          </span>
        </button>

        <button className="ife-start-card" onClick={choose("listen")}>
          {/* Full bleed, and the sleeve's own caption is off: the card
              already carries a title, and a record's name printed inside a
              card titled "Listen to something" is the same word twice. */}
          <span className="ife-start-face ife-start-face--sleeve">
            <Sleeve station={now.station} />
          </span>
          <span className="ife-start-body">
            <span className="ife-start-name">{t("modeListen")}</span>
            <span className="ife-start-sub">{t("modeListenSub")}</span>
          </span>
        </button>

        <button className="ife-start-card" onClick={choose("look")}>
          <span className="ife-start-face ife-start-face--route">
            <RouteMini />
          </span>
          <span className="ife-start-body">
            <span className="ife-start-name">{t("modeLook")}</span>
            <span className="ife-start-sub">{t("modeLookSub")}</span>
          </span>
        </button>

        {/* Up front only, and it is not a preference — it is the one thing
            in either cabin that happens on the ground, so it is the one
            answer that is only true for one of them. Down the back the
            drinks come with the service, which the dining screen says. */}
        {(cabinClass === "business" || cabinClass === "first") && (
          <button className="ife-start-card" onClick={choose("drink")}>
            <span className="ife-start-face">
              <span className="ife-start-mark">
                <IconDining size={96} />
              </span>
            </span>
            <span className="ife-start-body">
              <span className="ife-start-name">{t("modeDrink")}</span>
              <span className="ife-start-sub">{t("modeDrinkSub")}</span>
            </span>
          </button>
        )}

        <button className="ife-start-card" onClick={choose("rest")}>
          <span className="ife-start-face">
            <span className="ife-start-mark ife-start-mark--quiet">
              <IconPower size={96} />
            </span>
          </span>
          <span className="ife-start-body">
            <span className="ife-start-name">{t("modeRest")}</span>
            <span className="ife-start-sub">{t("modeRestSub")}</span>
          </span>
        </button>
      </div>

      <div className="ife-start-foot">
        <button className="ife-btn ife-start-skip" onClick={choose(null)}>
          {t("skip")}
        </button>
      </div>
    </div>
  );
}
