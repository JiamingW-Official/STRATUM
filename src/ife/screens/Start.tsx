import { useSelf } from "../../flight-state/store";
import type { SeatMode } from "../../flight-state/types";
import { FILMS, stillUrl } from "../films";
import { pick, useT } from "../i18n";
import { currentTrack, usePlayer } from "../player";
import { Sleeve } from "../chrome/Sleeve";
import { RouteMini } from "../chrome/RouteMini";

/**
 * The first question, asked once.
 *
 * Every cabin asks some version of it and it is worth having, but only if the
 * answer does something. So each of these four is a place this screen will
 * actually go, and one of them also turns the reading light off — and then
 * nothing else in the interface changes because of what you picked. A mode
 * that quietly reorders the whole system is a system that has decided who you
 * are on the strength of one tap at the gate.
 *
 * The faces are the cabin's own contents rather than stock photography of
 * people enjoying themselves: the film that is on the shelf, the record that
 * is on the turntable, the route that is on the map. Rest has no face, which
 * is the truest thing this screen can say about it.
 */
export function Start({
  onDone,
}: {
  onDone: (mode: SeatMode | null) => void;
}) {
  const { t, lang } = useT();
  const { stationIdx, trackIdx } = usePlayer();
  const now = currentTrack(stationIdx, trackIdx);
  const setMode = useSelf((s) => s.setMode);
  const feature = FILMS[0];

  const choose = (m: SeatMode | null) => () => {
    setMode(m);
    onDone(m);
  };

  return (
    <div className="ife-start">
      <h2 className="ife-start-title">{t("startTitle")}</h2>

      <div className="ife-start-grid">
        <button className="ife-start-card" onClick={choose("watch")}>
          <span
            className="ife-start-face"
            style={{ backgroundImage: `url(${stillUrl(feature)})` }}
          />
          <span className="ife-start-body">
            <span className="ife-start-name">{t("modeWatch")}</span>
            <span className="ife-start-sub">
              {FILMS.length} {lang === "zh" ? "部公有领域影片" : "public-domain films"}
              {" · "}
              {pick(feature.title, lang)}
            </span>
          </span>
        </button>

        <button className="ife-start-card" onClick={choose("listen")}>
          <span className="ife-start-face ife-start-face--sleeve">
            <Sleeve station={now.station} />
          </span>
          <span className="ife-start-body">
            <span className="ife-start-name">{t("modeListen")}</span>
            <span className="ife-start-sub">{now.station.name}</span>
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

        {/* No picture. Rest is the one answer whose honest face is nothing. */}
        <button className="ife-start-card" onClick={choose("rest")}>
          <span className="ife-start-face ife-start-face--rest" />
          <span className="ife-start-body">
            <span className="ife-start-name">{t("modeRest")}</span>
            <span className="ife-start-sub">{t("modeRestSub")}</span>
          </span>
        </button>
      </div>

      <div className="ife-start-foot">
        <span className="ife-start-later">{t("changeLater")}</span>
        <button className="ife-btn ife-start-skip" onClick={choose(null)}>
          {t("skip")}
        </button>
      </div>
    </div>
  );
}
