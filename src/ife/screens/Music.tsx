import { useNav } from "../nav";
import { useT } from "../i18n";
import { STATIONS, splitTrack, trackLength } from "../stations";
import { Sleeve } from "../chrome/Sleeve";
import { IconMusic } from "../chrome/icons";
import { usePlayer } from "../player";

/**
 * Real music, not a mock-up: these are the four stations and the actual files
 * the sky view plays, read from the one list both share.
 *
 * The shape is the one every audio app has settled on and every seat-back
 * system has copied from it — a library down the left, the thing you picked
 * filling the right. It opens on the shelf rather than on a track list,
 * because the first question is which station, not which song.
 */
export function Music() {
  const { t, lang } = useT();
  const { stationIdx, trackIdx, playing } = usePlayer();
  const select = usePlayer((s) => s.select);
  // Which station the right pane is showing. Null is the shelf.
  const open = useNav((s) => s.station);
  const setOpen = useNav((s) => s.openStation);

  return (
    <div className="ife-music">
      {/* The sidebar is the navigation, and that is the whole of it.

          The shelf is the first row and the four records are under it, so an
          open record needs no back key of its own: going back is pressing
          "Music", and changing records is pressing another one — which is
          what you would press anyway. The arrow that used to sit beside the
          title was a second way to do the thing the list already does, and it
          sat in the header's baseline like a dropped word.

          Two lines to a row, not three. The count was on every row and it is
          also the first thing the record's own page says; what is worth
          knowing at a glance is which of them is playing, and that is the
          name in the station's colour rather than a fourth line of grey. */}
      <aside className="ife-library">
        <button
          className="ife-library-all"
          data-on={open === null}
          onClick={() => setOpen(null)}
        >
          <IconMusic size={30} />
          <span>{t("music")}</span>
        </button>
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            className="ife-library-row"
            data-on={open === i}
            data-playing={playing && stationIdx === i}
            style={{ ["--stationColor" as string]: s.color }}
            onClick={() => setOpen(i)}
          >
            {/* The sleeve, not a colour chip. A shelf of records is a shelf
                of covers, and each of these has one. */}
            <span className="ife-library-art">
              <Sleeve station={s} />
            </span>
            <span className="ife-library-text">
              <span className="ife-library-name">{s.name}</span>
              <span className="ife-library-genre">{s.genre}</span>
            </span>
          </button>
        ))}
      </aside>

      {open === null ? (
        <section className="ife-shelf">
          <header className="ife-head">
            <h2 className="ife-head-title">{t("music")}</h2>
            <span className="ife-head-meta ife-cap">
              {STATIONS.reduce((n, s) => n + s.tracks.length, 0)}{" "}
              {t("tracksOnBoard")}
            </span>
          </header>

          {/* The shelf. No cover art exists for these files and none is
              invented: the sleeve is a label — the station's name in the
              cabin's own face, its colour, and one groove per track — which is
              what a record with no artwork has always had. A generated
              picture would be the one untrue thing in here. */}
          <div className="ife-shelf-grid">
            {STATIONS.map((s, i) => {
              const artists = [
                ...new Set(s.tracks.map((tr) => splitTrack(tr).artist)),
              ].filter(Boolean);
              return (
                <button
                  key={s.id}
                  className="ife-album"
                  style={{ ["--stationColor" as string]: s.color }}
                  onClick={() => setOpen(i)}
                >
                  {/* The name is on the record and only on the record.
                      It was under the sleeve as well, from when a sleeve
                      might arrive with no title on it — every sleeve carries
                      its own now, art or drawn, in the bottom left corner
                      where a printed sleeve puts it, so the label underneath
                      was the same word in the same face twice over. What is
                      left under the cover is what the cover cannot say:
                      who is on it. */}
                  <Sleeve station={s} />
                  <span className="ife-album-artists">
                    {artists.slice(0, 3).join(" · ")}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="ife-station-view">
          <header
            className="ife-head"
            style={{ ["--stationColor" as string]: STATIONS[open].color }}
          >
            <h2 className="ife-head-title ife-station-title">
              {STATIONS[open].name}
            </h2>
            <div className="ife-head-meta ife-cap">
              {STATIONS[open].tracks.length} {t("tracksShort")}
            </div>
          </header>

          {/* The sleeve stays beside the tracklist, which is how every player
              and every seat-back system shows a record you have opened: the
              cover is how you know which one you are inside. */}
          <div className="ife-station-cover">
            <Sleeve station={STATIONS[open]} />
          </div>

          <ol
            className="ife-tracklist"
            style={{ ["--stationColor" as string]: STATIONS[open].color }}
          >
            {STATIONS[open].tracks.map((tr, i) => {
              const s = splitTrack(tr);
              const on = open === stationIdx && i === trackIdx;
              return (
                <li key={tr}>
                  <button
                    className="ife-track"
                    data-on={on}
                    onClick={() => select(open, i)}
                  >
                    <span className="ife-track-n ife-mono">
                      {on && playing ? "▮▮" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ife-track-title">{s.title}</span>
                    <span className="ife-track-artist">{s.artist}</span>
                    <span className="ife-track-len ife-mono">
                      {trackLength(STATIONS[open], i)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* No player here. It had a bar of its own above the rail, which put
          two rows of controls on top of each other and made the player exist
          only while you were on this page. It is in the rail now, where a
          seat-back system keeps it, and it is on every screen. */}
    </div>
  );
}
