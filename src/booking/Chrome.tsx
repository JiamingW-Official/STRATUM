import { useEffect, useState } from "react";
import { useBooking } from "./store";
import { atAirport } from "./format";
import { disruptionFor, gateChangeFor } from "./schedule";

// The top of the phone, which the first version of this simply did not have.
//
// A screenshot of an app with no status bar reads as a mockup, because no
// phone has ever shown one. And once the bar is there the island is there
// too, and the island is not decoration here: a boarding pass is the exact
// thing Apple built Live Activities for — a number that matters for a few
// hours, that you want without unlocking anything, and that goes away by
// itself. So it carries what a passenger actually looks at twice a minute
// between check-in and the gate: how long until boarding, and which gate.

/** Always the real clock. A frozen 9:41 beside a running countdown is a lie
 *  the eye catches immediately, and this whole screen is about not being
 *  caught. */
function useClock(everyMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), everyMs);
    return () => window.clearInterval(id);
  }, [everyMs]);
  return now;
}

export function StatusBar() {
  const now = useClock(15_000);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(now));

  return (
    <div className="bk-status">
      <span className="bk-status-time">{time}</span>
      <span className="bk-status-icons" aria-hidden="true">
        <svg width="18" height="12" viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4.5}
              y={9 - i * 2.6}
              width="3"
              height={3 + i * 2.6}
              rx="1"
              fill="currentColor"
            />
          ))}
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path
            d="M8 10.6 6.1 8.5a2.7 2.7 0 0 1 3.8 0zM8 6.3c-1.4 0-2.7.5-3.7 1.4L2.9 6.3A7.5 7.5 0 0 1 8 4.3c1.9 0 3.7.7 5.1 2l-1.4 1.4A5.4 5.4 0 0 0 8 6.3M8 2.1c-2.5 0-4.8.9-6.6 2.5L0 3.2A11.7 11.7 0 0 1 8 0c3 0 5.8 1.1 8 3.2L14.6 4.6A9.7 9.7 0 0 0 8 2.1"
            fill="currentColor"
          />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="3.2"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
          <path
            d="M24 4.2v3.6a2 2 0 0 0 0-3.6"
            fill="currentColor"
            fillOpacity="0.4"
          />
        </svg>
      </span>
    </div>
  );
}

function until(ms: number): string {
  const m = Math.round(ms / 60000);
  if (m <= 0) return "now";
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

/**
 * The island, and the activity it is carrying.
 *
 * Three states, which is what the real one has: the bare pill when there is
 * nothing to say, the compact presentation with one item either side of the
 * sensors, and the expanded one when it is touched. The shape animates
 * between them because that is the entire idea of the component — the pill is
 * the same object the whole time, growing, not a panel appearing over it.
 */
export function DynamicIsland() {
  const passLeg = useBooking((s) => s.passLeg);
  const legs = useBooking((s) => s.legs);
  const passIndex = useBooking((s) => s.passIndex);
  const passSeg = useBooking((s) => s.passSeg);
  const seg = legs[passLeg]?.segments[passSeg] ?? null;
  const pass = seg?.passes[passIndex] ?? null;
  const selected = seg?.option ?? null;
  const [open, setOpen] = useState(false);
  const now = useClock(1000);

  const live = Boolean(pass && selected);
  useEffect(() => {
    if (!live) setOpen(false);
  }, [live]);

  if (!pass || !selected) {
    return <div className="bk-island" data-state="idle" aria-hidden="true" />;
  }

  // The aeroplane may not be going when it said it was, and this is the
  // component Apple built for exactly that: a number that matters for a few
  // hours and that you want without unlocking anything.
  const d = disruptionFor(pass.flightNo, pass.departureUtc, now);
  const slip = d.status === "delayed" ? d.minutes * 60000 : 0;
  const newGate = gateChangeFor(
    pass.flightNo,
    pass.departureUtc,
    pass.gate,
    now,
  );
  const gate = newGate ?? pass.gate;

  const boards = new Date(pass.boardingUtc).getTime() + slip;
  const left = boards - now;
  const boarding = left <= 0 && d.status !== "cancelled";
  // From check-in to the gate, which is the window the activity is alive for.
  const span = 24 * 60 * 60000;
  const progress = Math.min(1, Math.max(0, 1 - left / span));

  return (
    <>
      {/* Expanded, the activity covers the top of the app — including the
          back button. On a phone a tap anywhere else puts it away, and
          without that this one is a lid: the chrome underneath it stays
          unreachable until you find the island again. */}
      {open && (
        <div
          className="bk-island-off"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className="bk-island"
        data-state={open ? "open" : "live"}
        role="button"
        tabIndex={0}
        aria-label={`Flight ${pass.flightNo}, ${
          d.status === "cancelled"
            ? "cancelled"
            : boarding
              ? "boarding now"
              : `boards in ${until(left)}`
        }`}
        data-alert={d.status !== "onTime" || Boolean(newGate)}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
      >
        {open ? (
          <div className="bk-la">
            <div className="bk-la-top">
              <span className="bk-la-flight">{pass.flightNo}</span>
              <span
                className="bk-la-status"
                data-boarding={boarding}
                data-kind={d.status}
              >
                {d.status === "cancelled"
                  ? "Cancelled"
                  : d.status === "delayed"
                    ? `Delayed ${Math.round(d.minutes / 60) >= 1 ? `${Math.floor(d.minutes / 60)}h ${String(d.minutes % 60).padStart(2, "0")}m` : `${d.minutes}m`}`
                    : boarding
                      ? "Boarding"
                      : "On time"}
              </span>
            </div>
            <div className="bk-la-ports">
              <span>
                <b>{pass.fromIata}</b>
                <i data-slipped={slip > 0}>
                  {atAirport(
                    new Date(
                      Date.parse(selected.departureUtc) + slip,
                    ).toISOString(),
                    selected.from,
                  )}
                </i>
              </span>
              <span className="bk-la-track">
                <span
                  className="bk-la-track-fill"
                  style={{ width: `${progress * 100}%` }}
                />
              </span>
              <span className="bk-la-to">
                <b>{pass.toIata}</b>
                <i>{atAirport(selected.arrivalUtc, selected.to)}</i>
              </span>
            </div>
            <div className="bk-la-facts">
              <span data-changed={Boolean(newGate)}>
                Gate <b>{gate}</b>
                {newGate && " (new)"}
              </span>
              <span>
                Seat <b>{pass.seat}</b>
              </span>
              <span>
                Group <b>{pass.zone}</b>
              </span>
              <span className="bk-la-count">
                {d.status === "cancelled"
                  ? d.reason
                  : boarding
                    ? "Boarding now"
                    : `Boards in ${until(left)}`}
              </span>
            </div>
          </div>
        ) : (
          <>
            <span className="bk-island-lead" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-4.5z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="bk-island-trail" data-kind={d.status}>
              {d.status === "cancelled"
                ? "Cancelled"
                : newGate
                  ? `Gate ${gate}`
                  : boarding
                    ? "Now"
                    : until(left)}
            </span>
          </>
        )}
      </div>
    </>
  );
}
