import { Fragment, useMemo, useState, useRef } from "react";
import { AIRPORTS } from "../../flight-state/airports";
import { useBooking } from "../store";
import { useThumb } from "../useThumb";
import { DateSheet } from "../DateSheet";
import { Close, Go, Plane, Search as Magnifier, Swap } from "../icons";
import { money } from "../format";
import { skyWash } from "../Strata";
import { useMinute } from "../clock";
import { FARE_FAMILIES, priceItinerary, searchItineraries } from "../schedule";
import { hhmm } from "../format";

const CODES = Object.keys(AIRPORTS);

/** Where a place is, as a traveller would group it rather than as a continent
 *  table would. Four headings is a list you can take in; twenty-eight cities
 *  under one heading is a phone book. */
const REGIONS = ["Europe", "North America", "Asia Pacific", "Middle East"];

const EUROPE = ["GB", "FR", "DE", "ES", "IT", "CH", "AT", "NL", "DK", "SE", "IE", "PT", "GR"];
const AMERICAS = ["US", "CA"];

function REGION(cc: string): string {
  // Membership, not a substring search of a joined string: two letters can
  // fall across the gap between two other codes and land somewhere false.
  if (EUROPE.includes(cc)) return "Europe";
  if (AMERICAS.includes(cc)) return "North America";
  if (cc === "AE") return "Middle East";
  return "Asia Pacific";
}

/** "Sat 19 Sept", which is how a person says a date out loud. */
function prettyDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

/**
 * Two airport codes, two dates, on the airline's own black.
 *
 * Return is the default and the control says so first, because a return is
 * what almost everybody buys — a booking form that opens on a one-way is one
 * that has never watched anybody use it.
 */
export function Search() {
  const query = useBooking((s) => s.query);
  const setQuery = useBooking((s) => s.setQuery);
  const setReturn = useBooking((s) => s.setReturn);
  const swapRoute = useBooking((s) => s.swapRoute);
  const search = useBooking((s) => s.search);
  const recent = useBooking((s) => s.recent);
  const [picking, setPicking] = useState<null | "from" | "to">(null);
  const [find, setFind] = useState("");
  const [dates, setDates] = useState(false);
  const cancelled = useBooking((s) => s.cancelled);
  const clearCancelled = useBooking((s) => s.clearCancelled);

  const now = useMinute();

  const from = AIRPORTS[query.fromIata];
  const to = AIRPORTS[query.toIata];
  const sameCity = query.fromIata === query.toIata;
  const isReturn = query.returnDate !== null;
  const shapeSeg = useRef<HTMLDivElement>(null);
  const shape = useThumb(shapeSeg, [isReturn]);
  const backwards =
    isReturn && query.returnDate !== null && query.returnDate < query.date;

  // Where this aeroplane can actually take you from here, and what the
  // cheapest way onto each one costs on the day being looked at. It is the
  // network, priced — not a picture of a city with a number invented under
  // it. A pair the airline does not fly simply is not in the list, which is
  // the same answer the search gives.
  const board = useMemo(() => {
    const offer = (toIata: string) => {
      const found = searchItineraries({ ...query, toIata, returnDate: null });
      if (!found.length) return null;
      const price = Math.min(
        ...found.flatMap((it) =>
          FARE_FAMILIES.map((f) => priceItinerary(it, "economy", f.id).total),
        ),
      );
      // The shortest way there, which is the other half of what a person is
      // choosing between when they read a list of cities.
      const minutes = Math.min(...found.map((it) => it.totalMin));
      const stops = Math.min(...found.map((it) => it.segments.length - 1));
      return { price, minutes, stops };
    };
    return CODES.filter((c) => c !== query.fromIata)
      .map((c) => ({ code: c, ...(offer(c) ?? { price: null }) }))
      .filter(
        (x): x is { code: string; price: number; minutes: number; stops: number } =>
          x.price !== null,
      )
      .sort((a, b) => a.price - b.price);
  }, [query.fromIata, query.date, query.pax]);

  // Grouped when the field is empty, flat when it is not — a search result is
  // a ranking, and chopping it into regions hides the best match under a
  // heading.
  const found = useMemo(() => {
    const q = find.trim().toLowerCase();
    const hit = (code: string) => {
      const a = AIRPORTS[code];
      return (
        code.toLowerCase().startsWith(q) ||
        a.city.en.toLowerCase().includes(q) ||
        a.country.en.toLowerCase().includes(q) ||
        a.name.en.toLowerCase().includes(q)
      );
    };
    if (q === "") {
      const by: Record<string, string[]> = {};
      for (const code of CODES) {
        const r = REGION(AIRPORTS[code].cc);
        (by[r] ??= []).push(code);
      }
      return REGIONS.filter((r) => by[r]?.length).map(
        (r) =>
          [r, by[r].sort((x, y) => AIRPORTS[x].city.en.localeCompare(AIRPORTS[y].city.en))] as const,
      );
    }
    const list = CODES.filter(hit).sort((x, y) => {
      // A code typed in full is the answer, not a candidate.
      const rank = (c: string) => (c.toLowerCase().startsWith(q) ? 0 : 1);
      return rank(x) - rank(y) || AIRPORTS[x].city.en.localeCompare(AIRPORTS[y].city.en);
    });
    return list.length ? [["Matches", list] as const] : [];
  }, [find]);

  return (
    <>
      <div className="bk-body">
        {/* Said once, on the way out, and then gone. A cancellation that
            leaves no trace is a cancellation nobody believes happened. */}
        {cancelled && (
          <button className="bk-notice" onClick={clearCancelled}>
            <b>Booking cancelled.</b> {money(cancelled.total)} is going back to
            your card
            {cancelled.fare === 0 && " — the taxes, which are always refunded"}.
          </button>
        )}

        {/* The paper itself carries the light at the two ends of the route,
            and the clocks under the codes are what explain it. */}
        <div className="bk-masthead" style={skyWash(from, to, now)}>
          <div className="bk-label">Where to</div>
          <div className="bk-route">
            <button
              className="bk-port"
              data-side="from"
              onClick={() => setPicking("from")}
            >
              <span className="bk-hero">{from.iata}</span>
              <span className="bk-port-city">{from.city.en}</span>
            </button>
            <button className="bk-swap" onClick={swapRoute} aria-label="Swap route">
              <Swap />
            </button>
            <button
              className="bk-port"
              data-side="to"
              onClick={() => setPicking("to")}
            >
              <span className="bk-hero">{to.iata}</span>
              <span className="bk-port-city">{to.city.en}</span>
            </button>
          </div>
        </div>

        <div className="bk-card">
          <div className="bk-seg" data-tight="true" ref={shapeSeg}>
            {shape && (
              <span
                className="bk-thumb"
                aria-hidden="true"
                style={{
                  transform: `translate(${shape.x}px, ${shape.y}px)`,
                  width: shape.w,
                  height: shape.h,
                }}
              />
            )}
            <button
              className="bk-seg-b"
              data-on={isReturn}
              onClick={() => setReturn(true)}
            >
              Return
            </button>
            <button
              className="bk-seg-b"
              data-on={!isReturn}
              onClick={() => setReturn(false)}
            >
              One way
            </button>
          </div>

          <div className="bk-stack">
            {/* Not two date inputs. A booking is a span between two days and
                the only question anybody actually asks of it is which days are
                cheap — so it opens a calendar with the fares on it. */}
            <button
              className="bk-field"
              data-press="true"
              onClick={() => setDates(true)}
            >
              <span className="bk-field-k">
                {isReturn ? "Departing · returning" : "Departing"}
              </span>
              <span className="bk-field-v">
                {prettyDate(query.date)}
                {isReturn && (
                  <>
                    <i> → </i>
                    {query.returnDate ? prettyDate(query.returnDate) : "Choose"}
                  </>
                )}
              </span>
            </button>
            <label className="bk-field">
              <span className="bk-field-k">Passengers</span>
              <select
                value={query.pax}
                onChange={(e) => setQuery({ pax: Number(e.target.value) })}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "adult" : "adults"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            className="bk-btn"
            onClick={search}
            disabled={sameCity || backwards}
          >
            {sameCity
              ? "Choose two cities"
              : backwards
                ? "The return cannot be before the departure"
                : "Search flights"}
          </button>
        </div>

        {/* What was looked for last, which is what somebody is most likely to
            want next. This replaced a card that told you the great-circle
            distance and the aircraft type before you had searched for
            anything — trivia invented to fill the space under a form, which
            no airline has ever put on a home screen. */}
        {/* The network, from where you are, priced. This is the one thing a
            home screen can put under a search form that is neither an
            advertisement nor invented: the aeroplanes exist, the fares are the
            ones the list will sell, and a route the airline does not fly is
            not on it. */}
        {board.length > 0 && (
          <div className="bk-board">
            <div className="bk-board-h">
              <span>Where we fly from {from.city.en}</span>
              <i>{prettyDate(query.date)}</i>
            </div>
            <div className="bk-board-rail">
              {board.map((b) => (
                <button
                  className="bk-dest"
                  key={b.code}
                  onClick={() => {
                    setQuery({ toIata: b.code });
                    search();
                  }}
                >
                  <span className="bk-dest-city">{AIRPORTS[b.code].city.en}</span>
                  <span className="bk-dest-code">
                    {b.code} · {hhmm(b.minutes)}
                    {b.stops > 0 && " · 1 stop"}
                  </span>
                  <span className="bk-dest-p">from {money(b.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {recent.length > 0 && (
          <div className="bk-recent">
            <div className="bk-card-h">Recent</div>
            {recent.map((r) => (
              <button
                key={`${r.fromIata}${r.toIata}`}
                className="bk-recent-row"
                onClick={() => {
                  setQuery(r);
                  search();
                }}
              >
                <span className="bk-recent-route">
                  <b>{r.fromIata}</b>
                  <i>→</i>
                  <b>{r.toIata}</b>
                </span>
                <span className="bk-recent-when">
                  {prettyDate(r.date)}
                  {r.returnDate && ` – ${prettyDate(r.returnDate)}`}
                  {r.pax > 1 && ` · ${r.pax} adults`}
                </span>
                <span className="bk-recent-go" aria-hidden="true">
                  <Go />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {dates && <DateSheet onClose={() => setDates(false)} />}

      {picking && (
        <div className="bk-sheet">
          <div className="bk-sheet-head">
            <span>{picking === "from" ? "Departing from" : "Arriving at"}</span>
            <button
              className="bk-bar-end"
              onClick={() => setPicking(null)}
              aria-label="Close"
            >
              <Close />
            </button>
          </div>

          {/* Twenty-eight cities is a list you search, not a list you scroll:
              a field first, the matches under it, and until something is typed
              the places grouped the way a person thinks of them. Every airline
              app worth the name does this — the field takes a city, a country
              or a three-letter code, because those are the three things people
              actually know. */}
          <div className="bk-find">
            <Magnifier />
            <input
              autoFocus
              value={find}
              placeholder="City, country or code"
              onChange={(e) => setFind(e.target.value)}
            />
            {find !== "" && (
              <button onClick={() => setFind("")} aria-label="Clear">
                <Close size={16} />
              </button>
            )}
          </div>

          <div className="bk-sheet-list">
            <div className="bk-sheet-inner">
              {found.length === 0 && (
                <p className="bk-empty">
                  Nothing matches “{find}”. STRATUM flies to {CODES.length}{" "}
                  cities; try a country, or the three letters on the tag.
                </p>
              )}
              {found.map(([region, codes]) => (
                <Fragment key={region}>
                  <div className="bk-find-h">{region}</div>
                  {codes.map((code) => {
                    const ap = AIRPORTS[code];
                    const on =
                      code ===
                      (picking === "from" ? query.fromIata : query.toIata);
                    return (
                      <button
                        key={code}
                        className="bk-port-row"
                        data-on={on}
                        onClick={() => {
                          setQuery(
                            picking === "from"
                              ? { fromIata: code }
                              : { toIata: code },
                          );
                          setPicking(null);
                          setFind("");
                        }}
                      >
                        <Plane />
                        <span className="bk-port-row-city">
                          {ap.city.en}
                          <i>
                            {ap.country.en} · {ap.name.en}
                          </i>
                        </span>
                        <span className="bk-port-row-code">{code}</span>
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
