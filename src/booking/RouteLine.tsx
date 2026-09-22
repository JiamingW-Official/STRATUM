import type { Airport } from "../flight-state/types";
import { atAirport } from "./format";

/**
 * A journey, in the order an airline writes one.
 *
 * The code goes above the time and the city below it. That is not decoration:
 * you check the route first — am I looking at the right pair of airports —
 * and only then read the clock, so the thing you check first is the thing
 * that comes first. The first version of this had the time on top and the
 * code beneath, which reads as "10:07, and by the way, SFO".
 *
 * When something is late the new time takes the big type and the old one
 * stays underneath with a line through it. An airline that quietly replaces
 * the departure time is an airline that has taken away the passenger's only
 * way of knowing how late they are.
 */
export function RouteLine({
  fromIata,
  from,
  departureUtc,
  toIata,
  to,
  arrivalUtc,
  duration,
  via,
  dayOffset = 0,
  delayMin = 0,
  size = "row",
}: {
  fromIata: string;
  from: Airport;
  departureUtc: string;
  toIata: string;
  to: Airport;
  arrivalUtc: string;
  duration: string;
  /** Airports changed at. Each becomes a dot on the line. */
  via?: string[];
  dayOffset?: number;
  /** Minutes late. Both ends move; the scheduled times stay on the screen. */
  delayMin?: number;
  size?: "row" | "lead";
}) {
  const stops = via ?? [];
  const late = delayMin > 0;
  // Where the journey is the subject of the card and there is nothing in the
  // middle of it, the line is the path an aeroplane actually flies: a shallow
  // arc, the one the pass and the seat-back globe already draw. In a list
  // row, and wherever there is a change to mark on it, it stays a rule.
  const arc = size === "lead" && stops.length === 0;
  const shift = (iso: string) =>
    new Date(Date.parse(iso) + delayMin * 60000).toISOString();

  return (
    <div className="bk-route-line" data-size={size} data-late={late}>
      <End
        code={fromIata}
        airport={from}
        iso={departureUtc}
        shifted={late ? shift(departureUtc) : null}
        city={size === "lead" ? from.city.en : null}
      />

      <div className="bk-rl-mid">
        <span className="bk-rl-dur">{duration}</span>
        <span className="bk-rl-track" data-arc={arc} aria-hidden="true">
          {arc && (
            <svg
              className="bk-rl-arc"
              viewBox="0 0 100 16"
              preserveAspectRatio="none"
            >
              <path
                d="M2 14 Q 50 -4 98 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
          {stops.map((s) => (
            <i key={s} />
          ))}
          <svg viewBox="0 0 24 24" className="bk-rl-plane">
            <path
              d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-4.5z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="bk-rl-stops" data-direct={stops.length === 0}>
          {stops.length === 0 ? "nonstop" : `via ${stops.join(" · ")}`}
        </span>
      </div>

      <End
        code={toIata}
        airport={to}
        iso={arrivalUtc}
        shifted={late ? shift(arrivalUtc) : null}
        city={size === "lead" ? to.city.en : null}
        dayOffset={dayOffset}
        align="end"
      />
    </div>
  );
}

function End({
  code,
  airport,
  iso,
  shifted,
  city,
  dayOffset = 0,
  align,
}: {
  code: string;
  airport: Airport;
  iso: string;
  shifted: string | null;
  city: string | null;
  dayOffset?: number;
  align?: "end";
}) {
  return (
    <div className="bk-rl-end" data-align={align}>
      <span className="bk-rl-code">{code}</span>
      <b className="bk-mono">
        {atAirport(shifted ?? iso, airport)}
        {dayOffset > 0 && <sup>+{dayOffset}</sup>}
      </b>
      {shifted && (
        <s className="bk-rl-was bk-mono">{atAirport(iso, airport)}</s>
      )}
      {city && <span className="bk-rl-city">{city}</span>}
    </div>
  );
}
