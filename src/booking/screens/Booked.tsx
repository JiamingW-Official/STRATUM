import { useBooking } from "../store";
import { atAirport, dayAt, dayOffset, hhmm } from "../format";
import { RouteLine } from "../RouteLine";
import { Go, Seat } from "../icons";
import { useMinute } from "../clock";
import { checkInIsOpen, disruptionFor } from "../schedule";
import {
  legArrivalUtc,
  legCheckedIn,
  legDepartureUtc,
  legFrom,
  legSeats,
  legStops,
  legTo,
  legTotalMin,
} from "../leg";
import type { Leg, LegBooking } from "../types";

/**
 * Trips: every flight on the booking, one panel each.
 *
 * It showed only the next one for a while, with the other half of a return
 * named in a grey line underneath — which is the right answer to "which
 * aeroplane am I about to get on" and the wrong answer to "what have I
 * booked". Those are two questions and there are two places for them: the day
 * of travel has its own tab, and this is the booking.
 *
 * A panel is one flight and nothing else: where it goes, when, on what, in
 * which seat, and where it has got to. It opens the trip, where the seats,
 * the changes and the money live.
 */
export function Booked() {
  const pnr = useBooking((s) => s.pnr);
  const legs = useBooking((s) => s.legs);
  const go = useBooking((s) => s.go);
  const passengers = useBooking((s) => s.passengers);
  const now = useMinute();

  if (!pnr || !legs.out) return null;
  const booked: Array<{ leg: LegBooking; which: Leg }> = [
    { leg: legs.out, which: "out" as Leg },
    ...(legs.back ? [{ leg: legs.back, which: "back" as Leg }] : []),
  ];
  // Only a party is worth naming here: one traveller's own surname printed
  // on each of their own flights told them nothing.
  const who = passengers.length > 1 ? `${passengers.length} travellers` : "";

  return (
    <div className="bk-body">
      {booked.map(({ leg, which }, i) => (
        <Panel
          key={which}
          leg={leg}
          now={now}
          label={booked.length > 1 && i === 1 ? "Returning" : "Departing"}
          who={who}
          onOpen={() => go("trip")}
        />
      ))}
    </div>
  );
}

function Panel({
  leg,
  now,
  label,
  who,
  onOpen,
}: {
  leg: LegBooking;
  now: number;
  label: string;
  who: string;
  onOpen: () => void;
}) {
  const from = legFrom(leg);
  const to = legTo(leg);
  const departUtc = legDepartureUtc(leg);
  const arriveUtc = legArrivalUtc(leg);

  const ds = leg.segments.map((sg) =>
    disruptionFor(sg.option.flightNo, sg.option.departureUtc),
  );
  const d =
    ds.find((x) => x.status === "cancelled") ??
    ds.find((x) => x.status === "delayed") ??
    ds[0];
  const checked = legCheckedIn(leg);
  const seats = legSeats(leg).filter(Boolean).join(" · ");
  const opens = checkInIsOpen(departUtc);
  // Where the flight itself has got to. A trip stays in this tab after it
  // lands, and for those hours it was still offering to check somebody in.
  const gone = now >= Date.parse(departUtc);
  const landed = now >= Date.parse(arriveUtc);
  const opensUtc = new Date(
    Date.parse(departUtc) - 24 * 3600_000,
  ).toISOString();

  return (
    <button className="bk-card bk-panel" onClick={onOpen}>
      <div className="bk-trip-head">
        <span className="bk-label">
          {label} · {dayAt(departUtc, from)}
        </span>
        {d.status === "onTime" ? (
          <span className="bk-ontime">On time</span>
        ) : (
          <span className="bk-flag" data-kind={d.status} title={d.reason}>
            {d.status === "cancelled"
              ? "Cancelled"
              : `Delayed ${hhmm(d.minutes)}`}
          </span>
        )}
      </div>

      <h2 className="bk-trip-title">
        {from.city.en} to {to.city.en}
      </h2>

      <RouteLine
        fromIata={from.iata}
        from={from}
        departureUtc={departUtc}
        toIata={to.iata}
        to={to}
        arrivalUtc={arriveUtc}
        duration={hhmm(legTotalMin(leg))}
        via={legStops(leg)}
        dayOffset={dayOffset(departUtc, from, arriveUtc, to)}
        delayMin={d.status === "delayed" ? d.minutes : 0}
        size="lead"
      />

      <div className="bk-panel-foot">
        <span>
          <span className="bk-panel-who">
            <b className="bk-mono">
              {leg.segments.map((sg) => sg.option.flightNo).join(" + ")}
            </b>
            {who && <span>{who}</span>}
            {seats && (
              <span className="bk-panel-seat">
                <Seat size={13} />
                {seats}
              </span>
            )}
          </span>
          <span
            className="bk-panel-state"
            data-on={!gone && (checked || opens)}
          >
            {d.status === "cancelled"
              ? "Cancelled"
              : landed
                ? "Landed"
                : gone
                  ? "In the air"
                  : checked
                    ? "Checked in"
                    : opens
                      ? "Check-in is open"
                      : `Check-in opens ${dayAt(opensUtc, from)}, ${atAirport(
                          opensUtc,
                          from,
                        )}`}
          </span>
        </span>
        <Go />
      </div>
    </button>
  );
}
