import { useFlight, useSelf } from "../../flight-state/store";
import { localTime } from "../format";
import { pick, useT } from "../i18n";

/**
 * What is leaving the airport you are landing at.
 *
 * The board is the cabin's, not the screen's: the IFE has no way of knowing
 * what leaves an airport and never guesses it, so this draws whatever the
 * flight was given and says plainly when it was given nothing.
 *
 * And the evidence rule turns up a third time, in the place it matters most
 * on a board like this. A departure board is a set of statements about the
 * future: until the ground tells the aircraft otherwise, every row is the
 * schedule rather than the fact. Rows the cabin has actually been told about
 * are solid; rows that are only the plan are dashed, in the brass this work
 * uses for everything it believes but has not heard. A passenger running for
 * a gate deserves to know which of those two they are reading.
 */
export function Connections() {
  const { t, lang } = useT();
  const { connections, route } = useFlight();
  // The one row on this board that belongs to the seat reading it. Which row
  // that is came off the boarding pass and is in SeatPrivate, so the board
  // can mark it without the rest of the cabin learning whose it is.
  const mine = useSelf((s) => s.booking?.onward?.flightNo);
  const setScreen = useSelf((s) => s.setScreen);

  const statusKey = {
    onTime: "onTime",
    delayed: "delayed",
    cancelled: "cancelled",
  } as const;

  return (
    <div className="ife-conns">
      <header className="ife-head">
        <h2 className="ife-head-title">{t("connections")}</h2>
        <span className="ife-head-meta ife-cap">
          {route.to.iata} · {pick(route.to.city, lang)}
        </span>
        <button
          className="ife-btn ife-btn--quiet"
          onClick={() => setScreen("home")}
        >
          ✕
        </button>
      </header>

      {connections.length === 0 ? (
        <p className="ife-conns-empty">{t("noConnections")}</p>
      ) : (
        <>
          <div className="ife-conns-table" role="table">
            <div className="ife-conns-row ife-conns-row--head ife-cap" role="row">
              <span>{t("colDestination")}</span>
              <span>{t("colDeparture")}</span>
              <span>{t("colFlight")}</span>
              <span>{t("colGate")}</span>
              <span>{t("colTerminal")}</span>
              <span>{t("colStatus")}</span>
            </div>
            {connections.map((c) => (
              <div
                key={c.flightNo}
                className="ife-conns-row"
                data-mine={c.flightNo === mine}
                role="row"
                data-confirmed={c.confirmed}
                data-status={c.status}
              >
                <span className="ife-conns-dest">
                  {pick(c.to.city, lang)}, {c.to.iata}
                </span>
                <span className="ife-mono">
                  {localTime(c.departsUtc, route.to)}
                </span>
                <span className="ife-mono">
                  {c.flightNo}
                  {c.flightNo === mine && (
                    <span className="ife-conns-mine ife-cap">{t("yourConnection")}</span>
                  )}
                </span>
                {/* A gate nobody has been given is a dash, not a guess. */}
                <span className="ife-mono">{c.gate ?? "—"}</span>
                <span className="ife-mono">{c.terminal ?? "—"}</span>
                <span className="ife-conns-status">
                  {t(statusKey[c.status])}
                  <span className="ife-conns-evidence ife-cap">
                    {c.confirmed ? t("confirmed") : t("scheduled")}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="ife-conns-note">{t("connectionsWhen")}</p>
        </>
      )}
    </div>
  );
}
