import { useMemo, useState, useRef } from "react";
import { useBooking } from "../store";
import { useThumb } from "../useThumb";
import { atAirport, dayAt, dayOffset, hhmm, money } from "../format";
import { AIRPORTS } from "../../flight-state/airports";
import {
  HUBS,
  boardingGroup,
  cabinName,
  carbonKg,
  changeFeeFor,
  disruptionFor,
  familiesFor,
  familyFor,
  familyName,
  fareFamily,
  onTimeRate,
  priceItinerary,
  routeKm,
  searchItineraries,
  serviceFor,
} from "../schedule";
import { milesFor, tierOf, zoneBumpFor } from "../member";
import {
  itDepartureUtc,
  itFrom,
  itKey,
  itStops,
  legArrivalUtc,
  legDepartureUtc,
  legFrom,
  legTo,
  legTotalMin,
} from "../leg";
import type { Itinerary } from "../types";
import { RouteLine } from "../RouteLine";
import { Close } from "../icons";
import { FareTerms } from "../FareTerms";

/** A leg already bought, read back as the journey it was bought as. */
function asItinerary(l: {
  segments: Array<{ option: Itinerary["segments"][number] }>;
  layoverMin: number[];
}): Itinerary {
  return {
    segments: l.segments.map((x) => x.option),
    layoverMin: l.layoverMin,
    totalMin: 0,
  };
}
import type { CabinClass } from "../../flight-state/types";

const CABINS: Array<[CabinClass, string]> = [
  ["economy", "Economy"],
  ["premium", "Premium"],
  ["business", "Business"],
  ["first", "First"],
];

/**
 * Times at full size, everything else small. A flight list is read by
 * departure time and nothing else — the fare only starts to matter once two
 * departures are both possible.
 *
 * On the way back it stops quoting whole fares and starts quoting differences.
 * That is Trip.com's idea and it is the right one: by then a trip total is
 * being built, and what a passenger is choosing between is not "is this flight
 * worth six hundred dollars" but "is the later one worth forty more than the
 * cheapest". The total is on the bar at the bottom, where a total belongs.
 */
export function Results() {
  const options = useBooking((s) => s.options);
  const query = useBooking((s) => s.query);
  const leg = useBooking((s) => s.leg);
  const legs = useBooking((s) => s.legs);
  const cabinClass = useBooking((s) => s.cabinClass);
  const setCabinClass = useBooking((s) => s.setCabinClass);
  const choose = useBooking((s) => s.choose);
  const setQuery = useBooking((s) => s.setQuery);
  const search = useBooking((s) => s.search);
  const chosenFamily = useBooking((s) => s.fareFamily);
  const setFareFamily = useBooking((s) => s.setFareFamily);
  const family = familyFor(cabinClass, chosenFamily);
  const rules = fareFamily(family);
  const changing = useBooking((s) => s.changing);
  const pendingChange = useBooking((s) => s.pendingChange);
  const confirmChange = useBooking((s) => s.confirmChange);
  const abandonChange = useBooking((s) => s.abandonChange);
  const pax = useBooking((s) => s.query.pax);
  const movedDay = useBooking((s) => s.movedDay);

  const back = leg === "back";
  const out = legs.out;
  const [open, setOpen] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  // How the list is ordered. Delta and American both put this on the flight
  // list and both default to the same thing: the clock. A list of departures
  // is read by departure time until somebody decides it is about money, and
  // then it is entirely about money.
  const [sort, setSort] = useState<"time" | "price" | "duration">("time");
  const cabinSeg = useRef<HTMLDivElement>(null);
  const cabinThumb = useThumb(cabinSeg, [cabinClass]);
  const dateRow = useRef<HTMLDivElement>(null);
  const dateThumb = useThumb(dateRow, [query.date, query.returnDate, back]);
  const [sorting, setSorting] = useState(false);
  const pickList = useRef<HTMLDivElement>(null);
  const pickThumb = useThumb(pickList, [sort, sorting]);
  const member = useBooking((s) => s.member);
  const tier = tierOf(member?.miles ?? 0);

  // What the cabin actually sells. Business is one fare, and calling it Flex
  // in front of somebody who has just paid for business is a leak from the
  // pricing model into the shop window.
  const sold = familiesFor(cabinClass).map(fareFamily);
  const priced = (it: Itinerary) => priceItinerary(it, cabinClass, family).total;
  /** The figure a list of flights is compared on: the cheapest way onto it. */
  const from = (it: Itinerary) =>
    Math.min(...sold.map((f) => priceItinerary(it, cabinClass, f.id).total));
  /** Whether every aeroplane on this journey carries the cabin. */
  const carries = (it: Itinerary) =>
    it.segments.every((sg) => sg.fares[cabinClass].seatsLeft > 0);
  const offered = options.filter(carries);
  const cheapest = offered.length ? Math.min(...offered.map(from)) : 0;
  const shown = [...options].sort((x, y) =>
    sort === "price"
      ? from(x) - from(y)
      : sort === "duration"
        ? x.totalMin - y.totalMin
        : Date.parse(itDepartureUtc(x)) - Date.parse(itDepartureUtc(y)),
  );
  const outPaid = out ? priced(asItinerary(out)) : 0;
  // Off the network there is no flight to read a date off, and the fallback
  // printed the query string: "Departing · 2026-09-20", an ISO date in front
  // of a passenger.
  const day = options[0]
    ? dayAt(itDepartureUtc(options[0]), itFrom(options[0]))
    : new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(new Date(`${query.date}T12:00:00Z`));

  // Two days either side of the one being looked at, priced — but never a day
  // that has already happened, and on the way back never one before the
  // outbound lands.
  const nearby = useMemo(() => {
    const d = 86400000;
    const fams = familiesFor(cabinClass).map(fareFamily);
    const shown = back ? (query.returnDate ?? query.date) : query.date;
    const chosen = new Date(`${shown}T12:00:00Z`).getTime();
    const floorIso = back && out ? legArrivalUtc(out).slice(0, 10) : todayIsoUtc();
    const floor = new Date(`${floorIso}T12:00:00Z`).getTime();
    const start = Math.max(floor, chosen - 2 * d);
    return [0, 1, 2, 3, 4].map((i) => {
      const at = start + i * d;
      const date = new Date(at).toISOString().slice(0, 10);
      const found = searchItineraries(
        back
          ? { ...query, fromIata: query.toIata, toIata: query.fromIata, date }
          : { ...query, date },
      );
      return {
        date,
        offset: Math.round((at - chosen) / d),
        price: found.length
          ? Math.min(
              ...found.flatMap((f) =>
                fams.map((x) => priceItinerary(f, cabinClass, x.id).total),
              ),
            )
          : null,
      };
    });
  }, [query, cabinClass, back, out]);

  const best = Math.min(...nearby.map((n) => n.price ?? Number.POSITIVE_INFINITY));
  // A strip of five dashes is not a price strip. On a pair the airline does
  // not fly there is no cheaper day to move to, so there is nothing to offer.
  const anyDay = nearby.some((n) => n.price !== null);

  return (
    <>
      <div className="bk-body">
        {/* Moving a booking that already exists. The list is the ordinary
            list; the banner is what says this is a change, and what it will
            cost to make. */}
        {changing && (
          <div className="bk-notice">
            <b>
              Changing the {changing === "out" ? "outbound" : "return"} flight.
            </b>{" "}
            {changeFeeFor(cabinClass, family) === 0
              ? "No change fee · fare difference only"
              : `${money(changeFeeFor(cabinClass, family) ?? 0)} change fee · plus fare difference`}
          </div>
        )}

        {/* What has already been chosen, kept in view while the other half is
            chosen. Without it the second list is a list of flights from a city
            you never said you were in. */}
        {back && out && (
          <div className="bk-leg-pin">
            <span className="bk-label">Departing</span>
            <span className="bk-leg-pin-p">{money(outPaid)}</span>
            <span className="bk-leg-pin-v">
              <b className="bk-mono">
                {atAirport(legDepartureUtc(out), legFrom(out))}
              </b>{" "}
              {legFrom(out).iata} → {legTo(out).iata} ·{" "}
              {dayAt(legDepartureUtc(out), legFrom(out))} ·{" "}
              {out.segments.map((x) => x.option.flightNo).join(" + ")}
            </span>
          </div>
        )}

        <div className="bk-seg" ref={cabinSeg}>
          {cabinThumb && (
            <span
              className="bk-thumb"
              aria-hidden="true"
              style={{
                transform: `translate(${cabinThumb.x}px, ${cabinThumb.y}px)`,
                width: cabinThumb.w,
                height: cabinThumb.h,
              }}
            />
          )}
          {CABINS.map(([value, label]) => (
            <button
              key={value}
              className="bk-seg-b"
              data-on={cabinClass === value}
              onClick={() => setCabinClass(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Price over time, five days of it. The bar is the point: a strip
            of numbers makes you compare five figures, a strip of bars makes
            you see which day is cheap before you have read anything. */}
        {/* Price over time, five days of it. The bar is the point: a strip of
            numbers makes you compare five figures, a strip of bars makes you
            see which day is cheap before you have read anything. */}
        {anyDay && (
        <div className="bk-dates" ref={dateRow}>
          {dateThumb && (
            <span
              className="bk-thumb"
              aria-hidden="true"
              style={{
                transform: `translate(${dateThumb.x}px, ${dateThumb.y}px)`,
                width: dateThumb.w,
                height: dateThumb.h,
              }}
            />
          )}
          {nearby.map((n) => {
            const at = new Date(`${n.date}T12:00:00Z`);
            return (
              <button
                key={n.date}
                className="bk-date"
                data-on={n.offset === 0}
                data-cheap={n.price !== null && n.price === best && n.offset !== 0}
                disabled={n.price === null}
                onClick={() => {
                  if (n.offset === 0) return;
                  if (back) {
                    setQuery({ returnDate: n.date });
                    useBooking.setState({
                      options: searchItineraries({
                        ...query,
                        fromIata: query.toIata,
                        toIata: query.fromIata,
                        date: n.date,
                      }),
                    });
                  } else {
                    setQuery({ date: n.date });
                    search();
                  }
                }}
              >
                <span className="bk-date-w">
                  {new Intl.DateTimeFormat("en-GB", {
                    weekday: "short",
                    timeZone: "UTC",
                  }).format(at)}
                </span>
                <span className="bk-date-d">{at.getUTCDate()}</span>
                <span className="bk-date-p">
                  {n.price === null ? "—" : money(n.price)}
                </span>
              </button>
            );
          })}
        </div>
        )}

        {/* The route, once, and nothing under it. The line that used to sit
            here — "Departing · 3 flights" — said which half of a return this
            is, which the bar at the foot already says in the same words, and
            counted a list that is right underneath it. */}
        <header className="bk-head">
          <h1>
            {back ? query.toIata : query.fromIata}
            <i>→</i>
            {back ? query.fromIata : query.toIata}
          </h1>
        </header>

        {movedDay && !back && (
          <div className="bk-notice">
            Nothing left to sell today — showing {day}.
          </div>
        )}

        {options.length === 0 && (
          <div className="bk-card">
            <p className="bk-empty">
              STRATUM does not fly {back ? query.toIata : query.fromIata} to{" "}
              {back ? query.fromIata : query.toIata}.
              <br />
              Every route it flies touches{" "}
              {HUBS.map((h) => AIRPORTS[h].city.en).join(" or ")}, and there is
              no sensible way round for this pair.
            </p>
          </div>
        )}

        {/* Ordered by the clock, unless you say otherwise. The control is a
            line rather than a row of tabs: it is read once a trip and it must
            not weigh as much as the cabin or the day. */}
        {options.length > 1 && (
          <button className="bk-sort" onClick={() => setSorting(true)}>
            <span>
              Sorted by{" "}
              <b>
                {sort === "price"
                  ? "price"
                  : sort === "duration"
                    ? "how long it takes"
                    : "departure time"}
              </b>
            </span>
            <i className="bk-chev" aria-hidden="true" />
          </button>
        )}

        <div className="bk-flights">
          {shown.map((it) => {
            const a = it.segments[0];
            const b = it.segments[it.segments.length - 1];
            const plus = dayOffset(a.departureUtc, a.from, b.arrivalUtc, b.to);
            const key = itKey(it);
            const shown = open === key;
            const low = from(it);
            const delta = low - cheapest;
            const stops = itStops(it);
            const seatsLeft = a.fares[cabinClass].seatsLeft;
            const km = it.segments.reduce(
              (n, sg) => n + routeKm(sg.from.iata, sg.to.iata),
              0,
            );
            // Nothing is ever late next Tuesday: disruption only exists inside
            // the last few hours. A journey is as disrupted as its worst
            // aeroplane.
            const ds = it.segments.map((sg) => disruptionFor(sg.flightNo, sg.departureUtc));
            const d =
              ds.find((x) => x.status === "cancelled") ??
              ds.find((x) => x.status === "delayed") ??
              ds[0];
            const dead = d.status === "cancelled";
            return (
              <article className="bk-flight-item" key={key} data-open={shown}>
                <div className="bk-flight" data-off={dead}>
                  {/* Two reference facts on the left, and on the right the
                      one thing that distinguishes this panel from the others.
                      It was a mint pill and an amber pill stacked above the
                      card saying "NONSTOP" — which the route line below
                      already draws — and "LOWEST FARE", which is worth saying
                      and is not worth a chip. */}
                  <div className="bk-flight-top">
                    <b className="bk-mono">
                      {it.segments.map((sg) => sg.flightNo).join(" + ")}
                      <i>
                        {a.aircraft}
                        {b.aircraft !== a.aircraft && ` · ${b.aircraft}`}
                      </i>
                    </b>
                    {low === cheapest && !back && <em>Lowest fare</em>}
                  </div>

                  <RouteLine
                    fromIata={a.from.iata}
                    from={a.from}
                    departureUtc={a.departureUtc}
                    toIata={b.to.iata}
                    to={b.to}
                    arrivalUtc={b.arrivalUtc}
                    duration={hhmm(it.totalMin)}
                    via={stops}
                    dayOffset={plus}
                    delayMin={d.status === "delayed" ? d.minutes : 0}
                  />

                  {stops.length > 0 && (
                    <div className="bk-flight-stop">
                      <b>{hhmm(it.layoverMin[0])}</b> on the ground in {stops[0]},
                      and a different aeroplane
                    </div>
                  )}

                  {d.status !== "onTime" && (
                    <span className="bk-flag" data-kind={d.status}>
                      {d.status === "cancelled"
                        ? `Cancelled · ${d.reason}`
                        : `Delayed ${hhmm(d.minutes)} · ${d.reason}`}
                    </span>
                  )}

                  {/* Scarcity, and only where it is true. The number is the
                      inventory the price is derived from, not a device. */}
                  {!dead && seatsLeft > 0 && seatsLeft <= 9 && (
                    <p className="bk-scarce">{seatsLeft} left at this price</p>
                  )}

                  {/* The one thing on the panel that is being sold, filled in
                      the cabin's own colour. */}
                  <button
                    className="bk-farebar"
                    data-cabin={cabinClass}
                    data-absent={!carries(it)}
                    disabled={dead || !carries(it)}
                    aria-expanded={shown}
                    onClick={() => {
                      setOpen(shown ? null : key);
                      setPage(0);
                    }}
                  >
                    {/* Closed, the bar is the offer. Open, the offer is on the
                        cards underneath it — so it stops quoting a price that
                        is already on the screen twice and becomes what it now
                        is: the heading of the thing it opened, and the way to
                        shut it. */}
                    <span className="bk-farebar-k">
                      <b>
                        {cabinName(cabinClass)}
                        {shown && " fares"}
                      </b>
                      {!shown && !carries(it) && <i>Not on this aircraft</i>}
                      {!shown && carries(it) && (
                        <i>
                          {back
                            ? delta === 0
                              ? "Adds nothing to the trip"
                              : "Adds to the trip"
                            : "One way from"}
                        </i>
                      )}
                    </span>
                    <span className="bk-farebar-p">
                      {!shown &&
                        (back
                          ? delta === 0
                            ? "included"
                            : `+${money(delta)}`
                          : money(low))}
                      <i className="bk-chev" data-open={shown} aria-hidden="true" />
                    </span>
                  </button>
                </div>

                {/* Opened: what the cabin sells on this aeroplane, one card at
                    a time, each ending in the button that buys it. A fare bar
                    printed above the flights made a passenger choose a bag
                    allowance before they had chosen a departure time, and then
                    read every row through that choice. */}
                {shown && (
                  <div className="bk-deal">
                    {/* Two facts about the aeroplane rather than one line of
                        prose with a middot in it: each is looked up on its
                        own, so each gets its own box. */}
                    {/* The two figures about the aeroplane, in the shape this
                        app already uses for reference figures — the label
                        above the number, as on the pass and the gate block —
                        rather than as a line of label-value pairs floating on
                        the tray. */}
                    <div className="bk-flight-meta">
                      <span data-kind={onTimeRate(a.flightNo) >= 80 ? "good" : undefined}>
                        <i>On time</i>
                        <b>{onTimeRate(a.flightNo)}%</b>
                      </span>
                      <span>
                        <i>Service</i>
                        <b data-word="true">
                          {serviceFor(a.departureUtc, a.from.iata, b.to.iata, it.totalMin)}
                        </b>
                      </span>
                      <span>
                        <i>Carbon</i>
                        <b>
                          {it.segments.reduce(
                            (n, sg) =>
                              n +
                              carbonKg(
                                routeKm(sg.from.iata, sg.to.iata),
                                sg.aircraft,
                                cabinClass,
                              ),
                            0,
                          )}
                          {" kg"}
                        </b>
                      </span>
                    </div>
                    <div
                      className="bk-rail"
                      data-cabin={cabinClass}
                      data-single={sold.length === 1}
                      onScroll={(e) => {
                        const el = e.currentTarget;
                        const card = el.firstElementChild as HTMLElement | null;
                        if (!card) return;
                        setPage(
                          Math.round(el.scrollLeft / (card.offsetWidth + 10)),
                        );
                      }}
                    >
                      {sold.map((f) => {
                        const total = priceItinerary(it, cabinClass, f.id).total;
                        return (
                          <div
                            className="bk-fare"
                            key={f.id}
                            data-rank={f.id}
                          >
                            {/* The head is the offer: what cabin, which fare,
                                what it costs. It was five grey terms first and
                                the price last, in the corner, next to a black
                                pill competing with it — a card that led with
                                what you do not get. */}
                            {/* The brand on its own band, the way Delta sells
                                a fare family: three cards that are three
                                products rather than three paragraphs. The
                                name was set on the white body beside the
                                price, so the only difference between the
                                cards was the words in them. */}
                            <div className="bk-fare-brand">
                              {familyName(cabinClass, f.id)}
                            </div>
                            <div className="bk-fare-h">
                              <b className="bk-fare-p">
                                {back
                                  ? total - cheapest === 0
                                    ? "included"
                                    : `+${money(total - cheapest)}`
                                  : money(total)}
                              </b>
                              <i>
                                {back ? "added to the trip" : "one way, per traveller"}
                              </i>
                            </div>

                            <div className="bk-fare-terms">
                              <FareTerms cabinClass={cabinClass} family={f.id} />
                            </div>

                            <div className="bk-fare-earn">
                              <span>
                                +{milesFor(km, cabinClass, f.id).toLocaleString("en-US")}{" "}
                                miles
                              </span>
                              <span>
                                Boards group{" "}
                                {boardingGroup(cabinClass, f.id, zoneBumpFor(tier))}
                              </span>
                            </div>

                            <button
                              className="bk-fare-sel"
                              onClick={() => {
                                setFareFamily(f.id);
                                choose(it);
                              }}
                            >
                              Select
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {options.length > 0 && (
          <p className="bk-note">Per passenger · taxes included</p>
        )}
      </div>

      {sorting && (
        <div className="bk-sheet">
          <div className="bk-sheet-head">
            <span>Sort these flights</span>
            <button
              className="bk-bar-end"
              onClick={() => setSorting(false)}
              aria-label="Close"
            >
              <Close />
            </button>
          </div>
          <div className="bk-sheet-list">
            <div className="bk-sheet-inner">
              <div className="bk-pick" ref={pickList}>
                {pickThumb && (
              <span
                className="bk-thumb"
                aria-hidden="true"
                style={{
                  transform: `translate(${pickThumb.x}px, ${pickThumb.y}px)`,
                  width: pickThumb.w,
                  height: pickThumb.h,
                }}
              />
            )}
                {(
                  [
                    ["time", "Departure time", "Earliest first"],
                    ["price", "Price", `Cheapest is ${money(cheapest)}`],
                    [
                      "duration",
                      "How long it takes",
                      `Quickest is ${hhmm(Math.min(...options.map((o) => o.totalMin)))}`,
                    ],
                  ] as Array<[typeof sort, string, string]>
                ).map(([id, name, sub]) => (
                  <button
                    key={id}
                    className="bk-pick-b"
                    data-on={sort === id}
                    onClick={() => {
                      setSort(id);
                      setSorting(false);
                      setOpen(null);
                    }}
                  >
                    <span className="bk-pick-k">
                      <b>{name}</b>
                      <i>{sub}</i>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingChange && (() => {
        const leg = legs[pendingChange.leg]!;
        const was = priced(asItinerary(leg)) * pax;
        const now = priced(pendingChange.it) * pax;
        const fee = changeFeeFor(cabinClass, family) ?? 0;
        const due = now - was + fee;
        return (
          <div className="bk-sheet">
            <div className="bk-sheet-head">
              <span>Change this flight?</span>
              <button
                className="bk-bar-end"
                onClick={abandonChange}
                aria-label="Close"
              >
                <Close />
              </button>
            </div>
            <div className="bk-sheet-list">
              <div className="bk-sheet-inner">
                <div className="bk-row" data-static="true">
                  <span className="bk-row-k">
                    From {leg.segments.map((x) => x.option.flightNo).join(" + ")} ·{" "}
                    {atAirport(legDepartureUtc(leg), legFrom(leg))}
                  </span>
                  <span className="bk-row-v">{money(was)}</span>
                </div>
                <div className="bk-row" data-static="true">
                  <span className="bk-row-k">
                    To {pendingChange.it.segments.map((x) => x.flightNo).join(" + ")} ·{" "}
                    {atAirport(
                      itDepartureUtc(pendingChange.it),
                      itFrom(pendingChange.it),
                    )}
                  </span>
                  <span className="bk-row-v">{money(now)}</span>
                </div>
                <div className="bk-row" data-static="true">
                  <span className="bk-row-k">Change fee · {rules.name}</span>
                  <span className="bk-row-v">{money(fee)}</span>
                </div>
              </div>
              <div className="bk-total">
                <span>{due >= 0 ? "To pay" : "Back to your card"}</span>
                <b>{money(Math.abs(due))}</b>
              </div>
              {/* A new aeroplane is a new cabin, so the seats cannot simply
                  come across — say so before it happens rather than after. */}
              <p className="bk-note">
                Seats chosen again · everything else stays
              </p>
              <button className="bk-btn" onClick={confirmChange}>
                {due > 0 ? `Pay ${money(due)} and change` : "Confirm the change"}
              </button>
            </div>
          </div>
        );
      })()}

      <div className="bk-act">
        <div className="bk-act-sum">
          <span className="bk-cap">
            {back ? "Flight 2 of 2 · returning" : query.returnDate ? "Flight 1 of 2 · departing" : "One way"}
          </span>
          <span className="bk-act-sum-v">
            {options.length
              ? back
                ? `Trip from ${money(outPaid + cheapest)}`
                : `from ${money(cheapest)}`
              : "No service"}
          </span>
        </div>
      </div>
    </>
  );
}

function todayIsoUtc() {
  return new Date().toISOString().slice(0, 10);
}
