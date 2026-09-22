import { useEffect, useMemo, useRef, useState } from "react";
import { useBooking } from "../store";
import { atAirport, clockShift, dayAt, hhmm } from "../format";
import { away, useMinute } from "../clock";
import {
  Bag,
  Clock,
  Code,
  Land,
  More,
  Passport,
  Plane,
  Restricted,
  Search,
  Seat,
  Swap,
  Terminal,
  Tick,
} from "../icons";
import {
  airportFacts,
  bagDropClosesUtc,
  baggageFor,
  boardsUtc,
  callingGroup,
  checkInIsOpen,
  checkedBagsFor,
  disruptionFor,
  familyFor,
  fareFamily,
  gateChangeFor,
  gateClosesUtc,
  serviceFor,
} from "../schedule";
import { hash } from "../hash";
import { buildCabin } from "../cabin";
import { SkyRule } from "../Strata";
import {
  legArrivalUtc,
  legCheckedIn,
  legDepartureUtc,
  legFrom,
  legTo,
} from "../leg";
import type { Airport } from "../../flight-state/types";
import type { FareFamily } from "../schedule";
import type { Leg, LegBooking, SegmentBooking } from "../types";

/**
 * Travel: the day, in the places it is actually spent.
 *
 * Before the airport, at the airport, on the aeroplane, and at the far end
 * are four different problems, and the answer to each of them is made of
 * different facts. On the sofa you want to know whether you have checked in
 * and when to leave; in the terminal you want the desk, the queue, the gate
 * and whose turn it is at the door; in the air you want when you land and
 * what is on the trolley; at the other end you want the carousel and what
 * o'clock it is. A screen that shows all four at once is a timetable, and a
 * timetable is what you read when you are planning. Nobody on the day is
 * planning.
 *
 * So the pages are those places, swiped between, and each one carries only
 * what is true in it — the gate is not on the sofa page because there is no
 * gate yet, and the bag desks are not in the air because you are past them.
 * It opens on the page the day is on and moves itself along as the day does,
 * unless you have gone to look at another one, in which case it leaves you
 * where you are.
 */

/** The window in which a flight is today's problem rather than next week's. */
const SOON_MS = 6 * 3600_000;
/** And the hour at which the answer stops being "leave" and starts being the
 *  building: four hours out is when people start moving. */
const AT_AIRPORT_MS = 4 * 3600_000;

/** The leg this tab is about, and whether there is one at all. */
export function todaysLeg(
  legs: { out: LegBooking | null; back: LegBooking | null },
  now: number,
): { leg: LegBooking; which: Leg } | null {
  const rows: Array<{ leg: LegBooking; which: Leg }> = [];
  if (legs.out) rows.push({ leg: legs.out, which: "out" });
  if (legs.back) rows.push({ leg: legs.back, which: "back" });
  // The one that has not landed yet. A leg stays today's for an hour after it
  // lands, which is roughly how long it takes to get off and find the bags.
  const live = rows.find(
    (r) => now < Date.parse(legArrivalUtc(r.leg)) + 3600_000,
  );
  if (!live) return null;
  const departs = Date.parse(legDepartureUtc(live.leg));
  const on = legCheckedIn(live.leg) || departs - now <= SOON_MS;
  return on ? live : null;
}

type Page =
  | { kind: "before" | "airport" | "arrival"; label: string }
  | { kind: "flight"; label: string; seg: SegmentBooking; i: number }
  | { kind: "change"; label: string; i: number };

export function Today() {
  const legs = useBooking((s) => s.legs);
  const go = useBooking((s) => s.go);
  const setLeg = useBooking((s) => s.setLeg);
  const chosenFamily = useBooking((s) => s.fareFamily);
  const extraBags = useBooking((s) => s.extraBags);
  const passengers = useBooking((s) => s.passengers);
  const now = useMinute();
  const todays = todaysLeg(legs, now);

  /**
   * The pages, and which one the day is on.
   *
   * Built before the early return, because the scroller below has to be told
   * where to open and hooks cannot be called after one.
   */
  const segs = todays?.leg.segments ?? [];
  const pages: Page[] = [];
  if (segs.length) {
    pages.push({ kind: "before", label: "Before you go" });
    pages.push({ kind: "airport", label: "At the airport" });
    segs.forEach((sg, i) => {
      pages.push({
        kind: "flight",
        label: `${sg.option.from.iata} – ${sg.option.to.iata}`,
        seg: sg,
        i,
      });
      if (i < segs.length - 1) {
        pages.push({ kind: "change", label: "Connection", i });
      }
    });
    pages.push({ kind: "arrival", label: "Arrival" });
  }

  // Where the day is. Each page ends when the next one begins, so exactly one
  // of them is live and it cannot be a page about a place already left.
  let livePage = 0;
  if (segs.length) {
    const first = Date.parse(segs[0].option.departureUtc);
    const last = Date.parse(segs[segs.length - 1].option.arrivalUtc);
    if (now >= last) {
      livePage = pages.length - 1;
    } else if (now >= first) {
      livePage = 1;
      segs.forEach((sg, i) => {
        const off = Date.parse(sg.option.departureUtc);
        const land = Date.parse(sg.option.arrivalUtc);
        const idx = 2 + i * 2;
        if (now >= off && now < land) livePage = idx;
        else if (now >= land && i < segs.length - 1) livePage = idx + 1;
      });
    } else if (now >= first - AT_AIRPORT_MS) {
      livePage = 1;
    }
  }

  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLSpanElement>(null);
  const [page, setPage] = useState(livePage);
  /** What the scroll handler has committed, without making the handler depend
   *  on a render to know it. */
  const at = useRef(livePage);
  at.current = page;
  /** The page the day was on when it last moved, so the screen can tell the
   *  difference between following along and being somewhere on purpose. */
  const wasLive = useRef(livePage);
  const opened = useRef(false);

  /**
   * Send the deck to a page, without the snapping engine fighting the trip.
   *
   * A mandatory snap container re-targets a smooth programmatic scroll while
   * it is still travelling — it keeps grabbing whichever page is nearest at
   * that instant — so tapping the far end of the row lurched from one page to
   * the next instead of running across them. Snapping is switched off for the
   * length of the journey and switched back on when the scroll lands, which
   * leaves it doing the only job it is for: catching a finger.
   */
  const send = (i: number, smooth: boolean) => {
    const el = track.current;
    if (!el) return;
    const left = i * el.clientWidth;
    if (!smooth) {
      el.scrollLeft = left;
      return;
    }
    // Nothing to travel: leave the snapping alone rather than switching it
    // off with no scroll coming to switch it back on.
    if (Math.abs(left - el.scrollLeft) < 1) return;
    el.style.scrollSnapType = "none";
    el.scrollTo({ left, behavior: "smooth" });
  };

  /**
   * The row of names follows the pages, frame by frame, off the scroll itself.
   *
   * It used to be four capsules that each turned their own background on and
   * off, which is four things happening; and the one that was turning on
   * swapped an inset shadow for an outset one, which cannot be interpolated,
   * so it arrived as a white flash. It is one raised thumb now, and its
   * position is read from how far the deck has been dragged — so it moves
   * with the finger rather than catching up after it.
   *
   * Nothing here goes through React. A page of the day is a large tree and
   * there are four to six of them alive at once; re-rendering the lot on every
   * frame of a drag is the judder. The only commit is when the deck stops.
   */
  useEffect(() => {
    const el = track.current;
    const b = bar.current;
    const thumb = ind.current;
    if (!el || !b || !thumb || !pages.length) return;

    let raf = 0;
    let last = -1;
    let idle = 0;
    const paint = () => {
      raf = 0;
      const w = el.clientWidth || 1;
      const sl = el.scrollLeft;
      const keys = Array.from(
        b.querySelectorAll<HTMLElement>(".bk-segbar-b"),
      );
      const t = Math.max(0, Math.min(keys.length - 1, sl / w));
      const i = Math.floor(t);
      const f = t - i;
      const a = keys[i];
      const c = keys[Math.min(i + 1, keys.length - 1)];
      if (a && c) {
        const x = a.offsetLeft + (c.offsetLeft - a.offsetLeft) * f;
        const wd = a.offsetWidth + (c.offsetWidth - a.offsetWidth) * f;
        thumb.style.transform = `translateX(${x}px)`;
        thumb.style.width = `${wd}px`;
        // The names are wider than the phone, so the row carries the thumb
        // along with it: a control that has scrolled its own selection off
        // the edge is a control that has lost its place.
        const want = x + wd / 2 - b.clientWidth / 2;
        b.scrollLeft = Math.max(
          0,
          Math.min(b.scrollWidth - b.clientWidth, want),
        );
        // The dark label turns light as the thumb passes its middle, which is
        // the one moment the swap is under the thumb and cannot be seen.
        const near = Math.round(t);
        keys.forEach((k, n) => {
          k.dataset.near = String(n === near);
        });
      }
      if (sl !== last) {
        last = sl;
        idle = 0;
        raf = requestAnimationFrame(paint);
        return;
      }
      // Two samples at the same offset is not the same as arrived: a smooth
      // scroll can be read twice inside one frame, and reading the same
      // number twice was committing a page in the middle of the journey — one
      // commit per page crossed, which is what re-rendering every page tree
      // four times looks like. It has arrived when it is sitting on a page,
      // or when it has not moved for long enough to have been let go of.
      const near = Math.min(Math.round(sl / w), pages.length - 1);
      idle += 1;
      if (Math.abs(sl - near * w) > 1.5 && idle < 10) {
        raf = requestAnimationFrame(paint);
        return;
      }
      // Snapping goes back on: it is switched off for the length of a
      // programmatic trip and this is the end of one.
      el.style.scrollSnapType = "";
      if (near !== at.current) setPage(near);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    paint();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pages.length]);

  useEffect(() => {
    if (!track.current || !pages.length) return;
    // Open on the page the day is on; after that, move along with it only
    // while the reader has not gone to look at something else.
    if (!opened.current) {
      opened.current = true;
      send(livePage, false);
      setPage(livePage);
    } else if (livePage !== wasLive.current && page === wasLive.current) {
      send(livePage, true);
      setPage(livePage);
    }
    wasLive.current = livePage;
  }, [livePage, pages.length, page]);

  const goTo = (i: number) => {
    setPage(i);
    send(i, true);
  };

  /**
   * The day runs out while you are still stood in it.
   *
   * This tab only exists while a flight does, and when the flight has landed
   * and been forgotten the tab goes with it — leaving a page with nothing on
   * it and the row's black capsule parked over a tab that is no longer there.
   * The booking is where the reader was before the day started, so that is
   * where the day hands them back to.
   */
  const over = !todays;
  useEffect(() => {
    if (over) go("booked");
  }, [over, go]);

  if (!todays) return null;
  const { leg: current, which } = todays;
  const from = legFrom(current);
  const to = legTo(current);
  const departUtc = legDepartureUtc(current);

  const checked = legCheckedIn(current);
  const cabinClass = segs[0].passes[0]?.cabinClass ?? "economy";
  const family = familyFor(cabinClass, chosenFamily);
  const tags = checkedBagsFor(cabinClass, family) + extraBags;
  const pass = segs[0].passes[0] ?? null;
  const d0 = disruptionFor(
    segs[0].option.flightNo,
    segs[0].option.departureUtc,
    now,
  );
  const passenger = `${passengers[0].family} / ${passengers[0].given}`;

  /**
   * What is happening, once, at the top.
   *
   * It was inside the first card of every page, which meant the largest type
   * on the screen was inside a box — and the header above it, the one place
   * with the airline's own voice, was saying the name of a city you had
   * already read on the ticket. The state belongs where the airline speaks;
   * the cards under it are the detail.
   */
  const first = segs[0].option;
  const firstOff = Date.parse(first.departureUtc);
  const lastLand = Date.parse(legArrivalUtc(current));
  const boardsAt = Date.parse(boardsUtc(first.departureUtc));
  const shutsAt = Date.parse(gateClosesUtc(first.departureUtc));
  const headline: { lead: string; sub: string } =
    d0.status === "cancelled"
      ? { lead: "This flight is cancelled", sub: d0.reason }
      : !checked
        ? {
            lead: "Check in to get your boarding pass",
            sub: `Boarding in ${away(boardsAt - now)}`,
          }
        : now >= lastLand
          ? {
              lead: `You have landed in ${to.city.en}`,
              sub: `Arrived ${atAirport(new Date(lastLand).toISOString(), to)} local time`,
            }
          : now >= firstOff
            ? {
                lead: "You are in the air",
                sub: `Landing in ${away(lastLand - now)}`,
              }
            : now >= shutsAt
              ? {
                  lead: "The gate is closing",
                  sub: `Doors at ${atAirport(new Date(shutsAt).toISOString(), from)}`,
                }
              : now >= boardsAt
                ? {
                    lead: pass
                      ? `Boarding has started, board with group ${pass.zone}`
                      : "Boarding has started",
                    sub: `Doors close in ${away(shutsAt - now)}`,
                  }
                : {
                    lead: "You are checked in",
                    // Not the countdown: the island is already saying that,
                    // in those words, an inch above. The clock time and the
                    // gate are the two things it has no room for.
                    sub: pass?.gate
                      ? `Boards ${atAirport(boardsUtc(first.departureUtc), from)} · gate ${pass.gate}`
                      : `Boards ${atAirport(boardsUtc(first.departureUtc), from)}`,
                  };

  const openPass = (segIndex = 0) => {
    setLeg(which);
    useBooking.setState({ passLeg: which, passSeg: segIndex, passIndex: 0 });
    go("boarding");
  };

  return (
    <>
      <div className="bk-body" data-day="true">
        {/* The airline speaking, once, at the top.
            It carried a photograph of the destination for a while — which is
            a lovely thing to open an app on and a licensed one: those are
            Wikimedia uploads, and naming the file is a condition of using it.
            A credit line is not negotiable, so the photograph had to go
            instead. What is left is the airline's own black with the light at
            the two ends of the flight along the foot of it, which is the same
            reading the pass makes and costs nobody a network request. */}
        <header className="bk-day-hero">
          <div className="bk-day-hero-txt">
            <span className="bk-label">Your trip to {to.city.en}</span>
            <h2>{headline.lead}</h2>
            <p>{headline.sub}</p>
          </div>
          <SkyRule
            from={from}
            to={to}
            at={firstOff}
            toAt={Date.parse(legArrivalUtc(current))}
          />
        </header>

        {/* The four places a day of flying is spent, named as places. Stuck to
            the top, because a control you have scrolled past is no control. */}
        <div className="bk-segwrap">
          <div className="bk-segbar" role="tablist" aria-label="Today" ref={bar}>
            {/* One thumb, driven by the deck underneath. Its place is written
                straight onto the element as the pages move, so it is not in
                the render and cannot lag a frame behind the finger. */}
            <span className="bk-segbar-ind" aria-hidden="true" ref={ind} />
            {pages.map((p, i) => (
              <button
                key={p.label + i}
                role="tab"
                aria-selected={page === i}
                className="bk-segbar-b"
                data-live={livePage === i}
                onClick={() => goTo(i)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* No onScroll here. Reading the offset through React meant every
            page of the day re-rendered on every frame of a drag, which is
            what the stutter was; the listener that reads it is native,
            passive and rAF-throttled, and it commits once, at the end. */}
        <div className="bk-swipe" ref={track}>
          {pages.map((p, i) =>
            p.kind === "before" ? (
              <BeforePage
                key="b"
                leg={current}
                now={now}
                checked={checked}
                family={family}
                tags={tags}
                passenger={passenger}
              />
            ) : p.kind === "airport" ? (
              <AirportPage
                key="a"
                seg={segs[0]}
                now={now}
                checked={checked}
                tags={tags}
              />
            ) : p.kind === "flight" ? (
              <FlightPage
                key={`f${i}`}
                seg={p.seg}
                last={p.i === segs.length - 1}
                now={now}
                family={family}
                tags={tags}
              />
            ) : p.kind === "change" ? (
              <ChangePage
                key={`c${i}`}
                inbound={segs[p.i]}
                outbound={segs[p.i + 1]}
                now={now}
                onNext={() => goTo(i + 1)}
              />
            ) : (
              <ArrivalPage
                key="z"
                leg={current}
                now={now}
                tags={tags}
                family={family}
              />
            ),
          )}
        </div>
      </div>

      {/* One row of keys, at the foot of the glass rather than inside the
          swipe track: the track is a horizontal scroller, and a sticky row
          inside one sticks to the bottom of a page rather than to the bottom
          of the screen. What the third key does depends on which page you
          are looking at; the last one is always the pass. */}
      {/* Three keys, three doors. There were four and three of them opened
          the same screen: Seat, Bags and Trip all went to the trip, which
          is one door with three names on it. Seat opens the map — after
          check-in as well, the pass is re-issued for the new seat — and
          Bags went nowhere the airport page does not already show. */}
      <div className="bk-tools" role="group" aria-label="Quick actions">
        <button
          onClick={() => {
            setLeg(which);
            useBooking.setState({ segIndex: 0, paxIndex: 0 });
            go("seats");
          }}
        >
          <Seat size={21} />
          Seat
        </button>
        <button onClick={() => go("trip")}>
          <More size={21} />
          Trip
        </button>
        {checked && pass ? (
          <button data-key="true" onClick={() => openPass(0)}>
            <Code size={21} />
            Pass
          </button>
        ) : (
          <button
            data-key="true"
            disabled={!checkInIsOpen(departUtc) || d0.status === "cancelled"}
            onClick={() => {
              setLeg(which);
              go("checkin");
            }}
          >
            <Tick size={21} />
            Check in
          </button>
        )}
      </div>
    </>
  );
}

/** On the sofa. No gate, no queue, no bag tracker — none of it exists yet. */
function BeforePage({
  leg,
  now,
  checked,
  family,
  tags,
  passenger,
}: {
  leg: LegBooking;
  now: number;
  checked: boolean;
  family: FareFamily;
  tags: number;
  passenger: string;
}) {
  const segs = leg.segments;
  const o = segs[0].option;
  const from = o.from;
  const to = legTo(leg);
  const d = disruptionFor(o.flightNo, o.departureUtc, now);
  const slip = d.status === "delayed" ? d.minutes * 60000 : 0;
  const off = Date.parse(o.departureUtc) + slip;
  const bagsShut = Date.parse(
    bagDropClosesUtc(o.departureUtc, o.blockMin > 360),
  );
  const air = airportFacts(o.flightNo, o.departureUtc, from.iata);
  // When to walk out of the door: bag drop, less the queue, less the journey
  // in. The one number this page exists to give.
  const leaveBy = bagsShut - (air.securityMin + 45) * 60000;
  const clock = (t: number) => atAirport(new Date(t).toISOString(), from);

  // Not the state — the header above has that. The one number this page is
  // for: the hour to walk out of the door.
  const head = d.status === "cancelled"
    ? "This flight is cancelled"
    : !checked
      ? checkInIsOpen(o.departureUtc)
        ? "Check in now"
        : "Check-in opens a day before"
      : now >= leaveBy
        ? "Time to leave"
        : `Leave at ${clock(leaveBy)}`;
  const tone = d.status === "cancelled"
    ? "bad"
    : !checked
      ? "do"
      : now >= leaveBy
        ? "urgent"
        : "done";

  return (
    <article className="bk-page">
      <div className="bk-page-in">
      <section className="bk-card">
        <div className="bk-card-row">
          <span className="bk-label">
            {o.flightNo} · {dayAt(o.departureUtc, from)}
          </span>
          {d.status === "onTime" ? (
            <span className="bk-ontime">On time</span>
          ) : (
            <span className="bk-flag" data-kind={d.status} title={d.reason}>
              {d.status === "cancelled" ? "Cancelled" : `+${hhmm(d.minutes)}`}
            </span>
          )}
        </div>
        <h2 className="bk-hap" data-tone={tone}>
          {head}
        </h2>
        <p className="bk-hap-sub">
          {d.status === "cancelled"
            ? d.reason
            : now >= leaveBy
              ? `Bag drop shuts in ${away(bagsShut - now)}`
              : `In ${away(leaveBy - now)} · about ${air.securityMin} minutes at security`}
        </p>

        <div className="bk-clocks">
          <div>
            <b className="bk-mono">{from.iata}</b>
            <i className="bk-mono">{clock(off)}</i>
            <span>{from.city.en}</span>
          </div>
          <div className="bk-clocks-mid">
            <span className="bk-clocks-line" />
            <Plane size={14} />
            <b>
              {hhmm(
                Math.round(
                  (Date.parse(legArrivalUtc(leg)) -
                    Date.parse(legDepartureUtc(leg))) /
                    60000,
                ),
              )}
            </b>
          </div>
          <div data-align="end">
            <b className="bk-mono">{to.iata}</b>
            <i className="bk-mono">{atAirport(legArrivalUtc(leg), to)}</i>
            <span>{to.city.en}</span>
          </div>
        </div>

        <dl className="bk-facts">
          <div>
            <dt>Bag drop</dt>
            <dd className="bk-mono">{clock(bagsShut)}</dd>
          </div>
          <div>
            <dt>Boarding</dt>
            <dd className="bk-mono">
              {clock(Date.parse(boardsUtc(o.departureUtc)) + slip)}
            </dd>
          </div>
          <div>
            <dt>Doors close</dt>
            <dd className="bk-mono">
              {clock(Date.parse(gateClosesUtc(o.departureUtc)) + slip)}
            </dd>
          </div>
        </dl>
      </section>

      {/* What to have with you, as things rather than as a table of them.
          A label column against a value column is a departure board, and a
          departure board is for facts that are all the same kind. These are
          four different kinds of thing, each one a sentence. */}
      <section className="bk-card" data-bare="true">
        <h3 className="bk-sect">Before you go</h3>
        <ul className="bk-notes">
          <li>
            <Terminal size={18} />
            <p>
              <b>Terminal {air.terminal}</b> at {from.name.en}
            </p>
          </li>
          <li>
            <Bag size={18} />
            <p>{baggageFor("economy", family)}</p>
          </li>
          <li data-lit={!checked}>
            <Passport size={18} />
            <p>
              {checked ? (
                <>
                  Passport <b>accepted</b> · {passenger}
                </>
              ) : (
                <>
                  A <b>passport</b> is needed to check in
                </>
              )}
            </p>
          </li>
        </ul>
      </section>

      </div>
    </article>
  );
}

/** In the building. The desk, the queue, the gate, and whose turn it is. */
function AirportPage({
  seg,
  now,
  checked,
  tags,
}: {
  seg: SegmentBooking;
  now: number;
  checked: boolean;
  tags: number;
}) {
  const o = seg.option;
  const from = o.from;
  const d = disruptionFor(o.flightNo, o.departureUtc, now);
  const slip = d.status === "delayed" ? d.minutes * 60000 : 0;
  const pass = seg.passes[0] ?? null;
  const bagsShut = Date.parse(
    bagDropClosesUtc(o.departureUtc, o.blockMin > 360),
  );
  const boards = Date.parse(boardsUtc(o.departureUtc)) + slip;
  const shuts = Date.parse(gateClosesUtc(o.departureUtc)) + slip;
  const off = Date.parse(o.departureUtc) + slip;
  const air = airportFacts(o.flightNo, o.departureUtc, from.iata);
  const moved = pass
    ? gateChangeFor(pass.flightNo, pass.departureUtc, pass.gate, now)
    : null;
  const gate = moved ?? pass?.gate ?? null;

  // Memoised: it walks the whole deck to build a few hundred seat objects,
  // and it was doing that on every tick of the clock for a number that only
  // moves when the aeroplane changes.
  const sold = useMemo(() => {
    const cabin = buildCabin(o.aircraft, o.flightNo);
    return (
      cabin.rows.flatMap((r) => r.cells).filter((c) => c && c.taken).length + 1
    );
  }, [o.aircraft, o.flightNo]);
  const filling = Math.max(
    0,
    Math.min(1, (now - boards) / Math.max(1, shuts - boards)),
  );
  const boarding = now >= boards && now < off;
  const clock = (t: number) => atAirport(new Date(t).toISOString(), from);

  const head = now >= off
    ? "The door is closed"
    : now >= shuts
      ? "The gate is closing"
      : boarding
        ? "Boarding has started"
        : now >= bagsShut
          ? "Go to the gate"
          : "Drop your bags";
  const tone = d.status === "cancelled"
    ? "bad"
    : now >= shuts && now < off
      ? "urgent"
      : boarding
        ? "go"
        : "do";

  return (
    <article className="bk-page">
      <div className="bk-page-in">
      <section className="bk-card">
        <div className="bk-card-row">
          <span className="bk-label">
            {o.flightNo} · {o.aircraft} · {dayAt(o.departureUtc, from)}
          </span>
          {moved && (
            <span className="bk-flag" data-kind="delayed">
              Gate changed
            </span>
          )}
        </div>
        <h2 className="bk-hap" data-tone={tone}>
          {d.status === "cancelled" ? "This flight is cancelled" : head}
        </h2>

        {boarding && pass ? (
          <>
            <p className="bk-call" data-mine={callingGroup(boards, now) >= pass.zone}>
              <b>Group {callingGroup(boards, now)}</b>
              {callingGroup(boards, now) >= pass.zone
                ? ` is at the door — you are ${pass.zone}, go now`
                : ` is boarding · you are group ${pass.zone}`}
            </p>
            <div className="bk-meter" data-kind="boarding">
              <span style={{ width: `${Math.round(filling * 100)}%` }} />
            </div>
            <p className="bk-hap-sub" data-count="true">
              {Math.round(sold * filling)}/{sold} boarded · doors {clock(shuts)}
            </p>
          </>
        ) : (
          <p className="bk-hap-sub">
            {now >= off
              ? `Pushed back at ${clock(off)}`
              : now >= bagsShut
                ? `Boards in ${away(boards - now)}`
                : `Bag drop closes in ${away(bagsShut - now)}`}
          </p>
        )}

        <dl className="bk-facts">
          <div data-lit={Boolean(moved)}>
            <dt>{moved ? "New gate" : "Gate"}</dt>
            <dd className="bk-mono">{gate ?? "—"}</dd>
          </div>
          <div data-tint="own">
            <dt>Seat</dt>
            <dd className="bk-mono">
              {seg.seats.filter(Boolean).join(" ") || "—"}
            </dd>
          </div>
          <div>
            <dt>Group</dt>
            <dd className="bk-mono">{pass ? pass.zone : "—"}</dd>
          </div>
        </dl>
      </section>

      {/* Four things that happen in an order, so the order is the drawing.
          Set as a label column against a value column they were a departure
          board, which is the wrong shape for a sequence: the question here is
          not "what are the numbers" but "where am I up to". */}
      <section className="bk-card" data-bare="true">
        <h3 className="bk-sect">Getting through {from.iata}</h3>
        <ol className="bk-queue">
          <li data-done={now >= bagsShut} data-now={now < bagsShut}>
            <span className="bk-queue-dot">
              <Bag size={14} />
            </span>
            <p>
              <b>Bag drop</b>
              <i>
                {now >= bagsShut ? "Closed" : `Desks ${air.desks}`}
              </i>
            </p>
            <em className="bk-mono">{clock(bagsShut)}</em>
          </li>
          <li data-done={now >= bagsShut}>
            <span className="bk-queue-dot">
              <Search size={14} />
            </span>
            <p>
              <b>Security</b>
              <i>About {air.securityMin} minutes at the moment</i>
            </p>
          </li>
          <li
            data-done={now >= boards}
            data-now={now >= bagsShut && now < boards}
          >
            <span className="bk-queue-dot">
              <Terminal size={14} />
            </span>
            <p>
              <b>{gate ? `Gate ${gate}` : "The gate"}</b>
              <i>
                {gate
                  ? `${air.walkMin} minutes' walk from security`
                  : "Goes up about an hour before"}
              </i>
            </p>
            <em className="bk-mono">
              {clock(boards - air.walkMin * 60000)}
            </em>
          </li>
          <li
            data-done={now >= shuts}
            data-now={now >= boards && now < shuts}
          >
            <span className="bk-queue-dot">
              <Plane size={14} />
            </span>
            <p>
              <b>Doors close</b>
              <i>Twenty minutes before the aeroplane moves</i>
            </p>
            <em className="bk-mono">{clock(shuts)}</em>
          </li>
        </ol>
      </section>

      {/* No "on the aeroplane" section. It was four chips — the type, which
          is in the label line; the seat and the group, which are in the tiles;
          and the meal, which belongs to the page about the flight. */}
      {checked && tags > 0 && (
        <BagCard
          tags={tags}
          stage={now >= off ? 2 : now >= bagsShut ? 1 : 0}
          to={o.to}
          by={clock(bagsShut)}
          flightNo={o.flightNo}
          passenger={seg.seats.filter(Boolean).join("")}
        />
      )}

      </div>
    </article>
  );
}

/** In the air. No gate, no desks, no queue: all of that is behind you. */
function FlightPage({
  seg,
  last,
  now,
  family,
  tags,
}: {
  seg: SegmentBooking;
  last: boolean;
  now: number;
  family: FareFamily;
  tags: number;
}) {
  const o = seg.option;
  const from = o.from;
  const to = o.to;
  const d = disruptionFor(o.flightNo, o.departureUtc, now);
  const slip = d.status === "delayed" ? d.minutes * 60000 : 0;
  const off = Date.parse(o.departureUtc) + slip;
  const lands = Date.parse(o.arrivalUtc) + slip;
  const flying = Math.max(0, Math.min(1, (now - off) / Math.max(1, lands - off)));
  const air = now >= off && now < lands;
  const clock = (t: number, ap: Airport) =>
    atAirport(new Date(t).toISOString(), ap);

  return (
    <article className="bk-page">
      <div className="bk-page-in">
      <section className="bk-card">
        <div className="bk-card-row">
          <span className="bk-label">
            {o.flightNo} · {o.aircraft}
          </span>
          {d.status !== "onTime" && (
            <span className="bk-flag" data-kind={d.status} title={d.reason}>
              {d.status === "cancelled" ? "Cancelled" : `+${hhmm(d.minutes)}`}
            </span>
          )}
        </div>
        {/* A length of time, never a clock time: the two clock times are
            printed underneath at twenty-six point, and the head used to say
            one of them again, sixty pixels above. */}
        <h2
          className="bk-hap"
          data-tone={now >= lands ? "done" : air ? "air" : "do"}
        >
          {now >= lands
            ? "Landed"
            : air
              ? `${away(lands - now)} to go`
              : `Takes off in ${away(off - now)}`}
        </h2>
        {air && (
          <div className="bk-meter" data-kind="boarding">
            <span style={{ width: `${Math.round(flying * 100)}%` }} />
          </div>
        )}

        {/* The flight itself, in the type an airport uses for it. */}
        <div className="bk-clocks">
          <div>
            <b className="bk-mono">{from.iata}</b>
            <i className="bk-mono">{clock(off, from)}</i>
            <span>{from.city.en}</span>
          </div>
          <div className="bk-clocks-mid">
            <span className="bk-clocks-line" />
            <Plane size={14} />
            <b>{hhmm(o.blockMin)}</b>
          </div>
          <div data-align="end">
            <b className="bk-mono">{to.iata}</b>
            <i className="bk-mono">{clock(lands, to)}</i>
            <span>{to.city.en}</span>
          </div>
        </div>

        {/* Three things the clocks row does not say. "Lands" was here, and
            it is the right-hand clock. */}
        <dl className="bk-facts">
          <div data-tint="own">
            <dt>Seat</dt>
            <dd className="bk-mono">
              {seg.seats.filter(Boolean).join(" ") || "—"}
            </dd>
          </div>
          <div>
            <dt>Served</dt>
            <dd>{serviceFor(o.departureUtc, from.iata, to.iata, o.blockMin)}</dd>
          </div>
          <div>
            <dt>There now</dt>
            <dd className="bk-mono">{clock(now, to)}</dd>
          </div>
        </dl>
      </section>

      </div>
    </article>
  );
}

/** The gap between two aeroplanes: the part nobody is relaxed about. */
function ChangePage({
  inbound,
  outbound,
  now,
  onNext,
}: {
  inbound: SegmentBooking;
  outbound: SegmentBooking;
  now: number;
  onNext: () => void;
}) {
  const at = inbound.option.to;
  const lands = Date.parse(inbound.option.arrivalUtc);
  const boards = Date.parse(boardsUtc(outbound.option.departureUtc));
  const shuts = Date.parse(gateClosesUtc(outbound.option.departureUtc));
  const off = Date.parse(outbound.option.departureUtc);
  const minutes = Math.round((off - lands) / 60000);
  const walk = 8 + ((hash(`${at.iata}|${outbound.option.flightNo}`) >>> 9) % 18);
  const tight = minutes - walk < 45;
  const clock = (t: number) => atAirport(new Date(t).toISOString(), at);

  return (
    <article className="bk-page">
      <div className="bk-page-in">
      <section className="bk-card">
        <div className="bk-label">
          Connection at {at.city.en} · {at.iata}
        </div>
        <h2 className="bk-hap" data-tone={tight ? "urgent" : "do"}>
          {hhmm(minutes)} on the ground
        </h2>
        <p className="bk-hap-sub">
          {now >= lands ? "Landed" : "Lands"} {clock(lands)} · next gate boards{" "}
          {clock(boards)}
        </p>

        <dl className="bk-facts">
          <div>
            <dt>Gate in</dt>
            <dd className="bk-mono">{inbound.passes[0]?.gate ?? "—"}</dd>
          </div>
          <div data-lit={tight}>
            <dt>Walk</dt>
            <dd className="bk-mono">{walk}m</dd>
          </div>
          <div>
            <dt>Gate out</dt>
            <dd className="bk-mono">{outbound.passes[0]?.gate ?? "—"}</dd>
          </div>
        </dl>

        <ul className="bk-notes">
          <li>
            <Terminal size={18} />
            <p>
              Boards <b>{clock(boards)}</b>, doors close{" "}
              <b>{clock(shuts)}</b>
            </p>
          </li>
          <li>
            <Bag size={18} />
            <p>
              Bags go <b>straight through</b> — nothing to collect
            </p>
          </li>
          <li data-lit={tight}>
            <Clock size={18} />
            <p>
              {tight ? (
                <>
                  <b>Tight.</b> {walk} minutes of walking out of {hhmm(minutes)}
                </>
              ) : (
                <>
                  <b>There is room.</b> {walk} minutes of walking out of{" "}
                  {hhmm(minutes)}
                </>
              )}
            </p>
          </li>
        </ul>
      </section>

      <button className="bk-btn" onClick={onNext}>
        {outbound.option.from.iata} → {outbound.option.to.iata}
      </button>
      </div>
    </article>
  );
}

/** The far end: the clock there, the terminal, and where the bags come out. */
function ArrivalPage({
  leg,
  now,
  tags,
  family,
}: {
  leg: LegBooking;
  now: number;
  tags: number;
  family: FareFamily;
}) {
  const from = legFrom(leg);
  const to = legTo(leg);
  const arriveUtc = legArrivalUtc(leg);
  const lands = Date.parse(arriveUtc);
  const h = hash(`${to.iata}|${arriveUtc}`);
  const belt = (h % 8) + 1;
  const terminal = ((h >>> 5) % 4) + 1;
  const shift = clockShift(from, to, arriveUtc);

  return (
    <article className="bk-page">
      <div className="bk-page-in">
      <section className="bk-card">
        <div className="bk-label">
          {to.name.en} · {to.iata}
        </div>
        <h2 className="bk-hap" data-tone={now >= lands ? "done" : "do"}>
          {now >= lands
            ? `Carousel ${belt}, terminal ${terminal}`
            : `Lands ${atAirport(arriveUtc, to)}`}
        </h2>
        {/* The belt first: at the far end it is the only number anybody is
            looking for, and the first tile is the one drawn large. */}
        <dl className="bk-facts">
          <div data-tint="cool">
            <dt>Carousel</dt>
            <dd className="bk-mono">{belt}</dd>
          </div>
          <div>
            <dt>Terminal</dt>
            <dd className="bk-mono">{terminal}</dd>
          </div>
          <div>
            <dt>Time there</dt>
            <dd className="bk-mono">
              {atAirport(new Date(now).toISOString(), to)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bk-card" data-bare="true">
        <h3 className="bk-sect">Getting off</h3>
        <ul className="bk-notes">
          <li>
            <Clock size={18} />
            <p>
              {shift === 0 ? (
                <>
                  The <b>same time</b> as {from.city.en}
                </>
              ) : (
                <>
                  <b>
                    {Math.abs(shift)} hour{Math.abs(shift) === 1 ? "" : "s"}{" "}
                    {shift > 0 ? "ahead of" : "behind"}
                  </b>{" "}
                  {from.city.en}
                </>
              )}
            </p>
          </li>
          {tags === 0 && (
            <li>
              <Bag size={18} />
              <p>
                <b>Nothing in the hold</b> — straight out
              </p>
            </li>
          )}
          <li>
            <Passport size={18} />
            <p>
              <b>Passport control</b> before the belts
            </p>
          </li>
        </ul>
      </section>
      </div>
    </article>
  );
}

/**
 * Where the bags are.
 *
 * It was a drawing of the paper tag — airline code, seven-digit serial,
 * destination, item count — which is what is printed on the thing tied to the
 * handle and almost none of what anybody opens this card to find out. The tag
 * number matters exactly once, when a bag has not arrived, so it is a caption
 * now; the state is the card.
 */
function BagCard({
  tags,
  stage,
  to,
  by,
  flightNo,
  passenger,
}: {
  tags: number;
  stage: number;
  to: Airport;
  by: string;
  flightNo: string;
  passenger: string;
}) {
  const tagNo = String(hash(`${flightNo}|${passenger}`) % 10_000_000)
    .padStart(7, "0")
    .replace(/(\d{3})(\d{4})/, "$1 $2");
  const said: Array<[string, string]> = [
    ["Not dropped yet", `Drop by ${by}`],
    ["With the airline", `${tags} checked through to ${to.iata}`],
    ["Loaded", `On board to ${to.iata}`],
    ["At the belt", `${to.name.en} · carousel`],
  ];
  const [head, sub] = said[Math.min(stage, said.length - 1)];

  return (
    <section className="bk-card" data-bare="true">
      <div className="bk-card-row">
        <h3 className="bk-sect">
          {tags} bag{tags > 1 ? "s" : ""} in the hold
        </h3>
        <span className="bk-tagno bk-mono">Tag {tagNo}</span>
      </div>

      {/* The state, and only the state. Under it was a two-step bar with
          "Dropped 07:30 · Loaded 08:30" — the third place on the page that
          bag drop closes at 07:30, and a bar with two segments is not a
          drawing of anything. */}
      <div className="bk-bagstate">
        <span className="bk-bagstate-i" data-at={stage}>
          <Bag size={22} />
        </span>
        <p>
          <b>{head}</b>
          <i>{sub}</i>
        </p>
      </div>
    </section>
  );
}
