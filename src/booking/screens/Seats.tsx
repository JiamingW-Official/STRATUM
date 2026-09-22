import { Fragment, useEffect, useMemo, useRef } from "react";
import { useBooking } from "../store";
import { useThumb } from "../useThumb";
import {
  areTogether,
  buildCabin,
  findSeat,
  findTogether,
  amenities,
  seatDetail,
  servicesFor,
  surchargeFor,
  type Band,
} from "../cabin";
import { money } from "../format";
import {
  cabinName,
  familyFor,
  fareFamily,
  fareLabel,
  priceOf,
  seatIncludedFor,
} from "../schedule";
import { seatsIncludedFor, tierOf } from "../member";
import type { SeatZone } from "../types";

/**
 * The key, and it answers the question the colours actually raise: which of
 * these costs what.
 *
 * It named four colours before — "Free · Extra legroom · Taken · Yours" —
 * which says nothing to somebody about to pay for a seat, and "Yours" names
 * the one seat on the map that already has your seat number written on it.
 * The zones come from the aeroplane rather than from a list here: an economy
 * cabin sells three prices, and a key that prints one of them while the map
 * charges another is worse than no key at all.
 */
const ZONE_LABEL: Record<SeatZone, string> = {
  first: "First",
  suite: "Business",
  premium: "Premium Economy",
  legroom: "Extra legroom",
  forward: "Front of the cabin",
  standard: "Standard",
};

const ZONE: Record<SeatZone, string> = {
  first: "First",
  suite: "Business",
  premium: "Premium cabin",
  legroom: "Extra legroom",
  forward: "Forward cabin",
  standard: "Standard",
};

/**
 * The cabin, drawn as a cabin, and the seat, described as a seat.
 *
 * Two things were wrong with the version this replaces. It was two white cards
 * stacked — a card for four legend chips and a card for the aeroplane — which
 * gave a row of swatches the same weight as the thing the screen is for. And
 * it would take money for a seat without ever saying how big it is, which is
 * asking to be paid for a letter on a grid: pitch is the difference between a
 * flight you can sleep on and one you cannot, and every booking engine worth
 * using puts it under your finger the moment you touch a seat.
 */
export function Seats() {
  const leg = useBooking((s) => s.leg);
  const legs = useBooking((s) => s.legs);
  const setLeg = useBooking((s) => s.setLeg);
  const segIndex = useBooking((s) => s.segIndex);
  const setSegIndex = useBooking((s) => s.setSegIndex);
  const cabinClass = useBooking((s) => s.cabinClass);
  const setSeat = useBooking((s) => s.setSeat);
  const pax = useBooking((s) => s.query.pax);
  const chosenFamily = useBooking((s) => s.fareFamily);
  const passengers = useBooking((s) => s.passengers);
  const paxIndex = useBooking((s) => s.paxIndex);
  const setPaxIndex = useBooking((s) => s.setPaxIndex);
  const sitTogether = useBooking((s) => s.sitTogether);
  const member = useBooking((s) => s.member);
  const pnr = useBooking((s) => s.pnr);
  const paxRow = useRef<HTMLDivElement>(null);
  const paxThumb = useThumb(paxRow, [paxIndex, passengers.length]);
  const go = useBooking((s) => s.go);

  const current = legs[leg];
  const seg = current?.segments[segIndex] ?? null;
  const selected = seg?.option ?? null;
  const seats = seg?.seats ?? [];
  const seat = seats[paxIndex] ?? null;
  const allSeated = seats.length > 0 && seats.every(Boolean);

  // Every aeroplane on the trip, in the order they are flown.
  const planes = [
    ...(legs.out?.segments ?? []).map((x, i) => ({ leg: "out" as const, i, seg: x })),
    ...(legs.back?.segments ?? []).map((x, i) => ({ leg: "back" as const, i, seg: x })),
  ];
  const here = planes.findIndex((x) => x.leg === leg && x.i === segIndex);
  const nextPlane = planes[here + 1];
  const everySeated = planes.every((x) => x.seg.seats.every(Boolean));

  // The map opens on the seat you hold. American's does; ours opened at row
  // one of a forty-row cabin and left you to find 21A yourself.
  const deck = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mine = deck.current?.querySelector<HTMLElement>('[data-mine="true"]');
    if (!mine) return;
    const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    mine.scrollIntoView({
      block: "center",
      behavior: quick ? "auto" : "smooth",
    });
  }, [seat, segIndex, leg]);

  const map = useMemo(
    () => (selected ? buildCabin(selected.aircraft, selected.flightNo) : null),
    [selected],
  );

  if (!selected || !map) return null;

  const rows = map.rows.filter((r) => r.cabinClass === cabinClass);
  const chosen = seat ? findSeat(map, seat) : null;
  const family = familyFor(cabinClass, chosenFamily);
  const seatsFree =
    seatIncludedFor(cabinClass, family) ||
    seatsIncludedFor(tierOf(member?.miles ?? 0));
  const { total: perPax } = priceOf(selected, cabinClass, family);
  const surcharge = seatsFree
    ? 0
    : seats.reduce((n, sv) => n + (sv ? (findSeat(map, sv)?.surcharge ?? 0) : 0), 0);
  const total = perPax * pax + surcharge;

  // Every row in one cabin has the same shape, so one row decides the grid for
  // all of them, and the column letters above it read off the same shape.
  const shape = rows[0]?.cells ?? [];
  const abreast = shape.filter(Boolean).length;
  const aisles = shape.length - abreast;
  const AISLE = 18;
  // The width inside the hull: the card is the page width less the gutter,
  // and the hull keeps sixteen either side for the wall.
  const AVAIL = 330;
  const suite = cabinClass === "business" || cabinClass === "first";
  const GAP = suite ? 9 : 3;
  const seatW = Math.max(
    22,
    Math.min(
      suite ? 58 : 36,
      Math.floor((AVAIL - aisles * AISLE - (shape.length - 1) * GAP) / abreast),
    ),
  );
  const seatH = suite ? 44 : 32;
  const template = shape.map((c) => `${c ? seatW : AISLE}px`).join(" ");

  // Where each block of seats starts and how wide it is, in grid columns, so a
  // galley spans the block it is behind rather than floating over the aisle.
  const spans: Array<[number, number]> = [];
  shape.forEach((c, i) => {
    if (!c) return;
    const last = spans[spans.length - 1];
    if (last && last[0] + last[1] === i) last[1] += 1;
    else spans.push([i, 1]);
  });
  const bands = servicesFor(selected.aircraft, cabinClass);
  const bandAt = (row: number) => bands.find((b) => b.at === row);
  const bandEnd = bands.find((b) => b.at === "end");
  const serviceBand = (b: Band, key: string) => (
    <div
      className="bk-band"
      key={key}
      style={{ gridTemplateColumns: template, gap: GAP }}
    >
      {b.parts.map((part, i) =>
        part ? (
          <span
            className="bk-band-b"
            key={i}
            data-kind={part}
            style={{ gridColumn: `${spans[i][0] + 1} / span ${spans[i][1]}` }}
          >
            {part === "wc" ? "WC" : "Galley"}
          </span>
        ) : null,
      )}
    </div>
  );

  // The prices this cabin actually sells, cheapest first — read off the deck
  // rather than listed by hand, so the key cannot drift from the map.
  const zonesHere = [
    ...new Set(rows.flatMap((r) => r.cells.filter(Boolean).map((c) => c!.zone))),
  ].sort((a, b) => surchargeFor(a) - surchargeFor(b));

  const split = passengers.length > 1 && allSeated && !areTogether(map, seats);
  const roomTogether =
    split && findTogether(map, cabinClass, passengers.length) !== null;
  const lastRow = rows[rows.length - 1]?.row ?? 0;
  const detail = chosen ? seatDetail(selected.aircraft, chosen, lastRow) : null;

  return (
    <>
      <div className="bk-body">
        {/* The aeroplane, said once, on the page rather than in a card. */}
        <header className="bk-head">
          <h1>
            {selected.from.iata}
            <i>→</i>
            {selected.to.iata}
          </h1>
          <p>
            {planes.length > 1 && `Flight ${here + 1} of ${planes.length} · `}
            {selected.flightNo} · {selected.aircraft} ·{" "}
            {cabinName(cabinClass)}
          </p>
        </header>

        {passengers.length > 1 && (
          <div className="bk-pax" ref={paxRow}>
            {paxThumb && (
              <span
                className="bk-thumb"
                aria-hidden="true"
                style={{
                  transform: `translate(${paxThumb.x}px, ${paxThumb.y}px)`,
                  width: paxThumb.w,
                  height: paxThumb.h,
                }}
              />
            )}
            {passengers.map((who, i) => (
              <button
                key={i}
                className="bk-pax-b"
                data-on={i === paxIndex}
                onClick={() => setPaxIndex(i)}
              >
                <span className="bk-cap">
                  {who.family || who.given
                    ? `${who.family}${who.given ? " " + who.given[0] : ""}`
                    : `Traveller ${i + 1}`}
                </span>
                <b className="bk-mono">{seats[i] ?? "—"}</b>
              </button>
            ))}
          </div>
        )}

        {split && (
          <div className="bk-notice" data-tone="warn">
            <b>You are not sitting together.</b>{" "}
            {roomTogether
              ? "There is a row with enough seats side by side."
              : "No row left on this flight has enough seats side by side."}
            {roomTogether && (
              <button className="bk-link" onClick={sitTogether}>
                Sit together
              </button>
            )}
          </div>
        )}

        {/* Four swatches on one line. They were in a card of their own, which
            gave a key the same weight as the aeroplane it is a key to. */}
        <div className="bk-legend">
          {zonesHere.map((zone) => (
            <span className="bk-legend-i" key={zone}>
              <span className="bk-chip" data-kind={zone} />
              {ZONE_LABEL[zone]}
              <b>
                {seatsFree || surchargeFor(zone) === 0
                  ? "included"
                  : money(surchargeFor(zone))}
              </b>
            </span>
          ))}
          <span className="bk-legend-i">
            <span className="bk-chip" data-kind="taken" />
            Taken
          </span>
        </div>

        <div className="bk-card" data-flush="true" data-sticky="true">
          {/* The letters, once, above the aeroplane — not repeated inside
              every seat of every row down a forty-row cabin. */}
          <div className="bk-cols" style={{ gridTemplateColumns: template }}>
            {shape.map((c, i) =>
              c ? <span key={c.column}>{c.column}</span> : <span key={`a${i}`} />,
            )}
          </div>

          <div className="bk-hull" data-suite={suite}>
            <div className="bk-service">
              <span className="bk-service-line" />
              {/* What is in front of the first row of this cabin. "Forward of
                  20" labelled the empty space with a row number, which is the
                  one thing in front of row 20 that is not there. */}
              <span>{suite ? "Flight deck ahead" : "Business cabin ahead"}</span>
              <span className="bk-service-line" />
            </div>

            <div className="bk-deck" data-suite={suite} ref={deck}>
              {rows.map((row) => (
                <Fragment key={row.row}>
                {bandAt(row.row) && serviceBand(bandAt(row.row)!, `b${row.row}`)}
                <div
                  className="bk-deck-row"
                  data-exit={row.exitRow}
                  data-wing={row.overWing}
                  data-wing-start={
                    row.overWing && !rows[rows.indexOf(row) - 1]?.overWing
                  }
                  style={{ gridTemplateColumns: template, gap: GAP }}
                >
                  {row.cells.map((cell, i) =>
                    cell ? (
                      <button
                        key={cell.seat}
                        className="bk-seat"
                        data-taken={cell.taken}
                        data-zone={cell.zone}
                        data-mine={cell.seat === seat}
                        data-party={seats.includes(cell.seat) && cell.seat !== seat}
                        disabled={cell.taken}
                        onClick={() => setSeat(cell.seat)}
                        aria-label={`Seat ${cell.seat}${cell.taken ? ", taken" : ""}`}
                        style={{ width: seatW, height: seatH }}
                      >
                        {cell.column}
                      </button>
                    ) : (
                      <span className="bk-aisle" key={`aisle-${i}`}>
                        {row.row}
                      </span>
                    ),
                  )}
                </div>
                </Fragment>
              ))}
              {bandEnd && serviceBand(bandEnd, "bend")}
            </div>

            <div className="bk-service">
              <span className="bk-service-line" />
              <span>Rear of cabin</span>
              <span className="bk-service-line" />
            </div>
          </div>
        </div>
      </div>

      {/* What the seat under your finger actually is. Pitch is the figure a
          passenger would pay for and the one the map would not say. */}
      {chosen && detail && (
        <div
          className="bk-seatcard"
          data-zone={chosen.zone}
          data-paid={!seatsFree && chosen.surcharge > 0}
        >
          <div className="bk-seatcard-no">
            <b>{chosen.seat}</b>
          </div>
          <dl className="bk-seatcard-facts">
            <div>
              <dt>Place</dt>
              <dd>{detail.place}</dd>
            </div>
            <div>
              <dt>Pitch</dt>
              <dd>{detail.pitch}</dd>
            </div>
            <div>
              <dt>Width</dt>
              <dd>{detail.width}</dd>
            </div>
            <div>
              <dt>Fee</dt>
              <dd>
                {seatsFree || chosen.surcharge === 0
                  ? "Included"
                  : money(chosen.surcharge)}
              </dd>
            </div>
          </dl>
          {/* What is fitted to it. A map that will take money for a seat and
              says nothing about what is at it is selling a letter on a grid —
              the same argument as the pitch, one step further on. */}
          <div className="bk-seatcard-fit">
            {(() => {
              const a = amenities(selected.aircraft, cabinClass);
              return (
                <>
                  {a.screen && <span>{a.screen}</span>}
                  <span>{a.power ? "Power" : "No power"}</span>
                  {a.wifi && <span>Wi-Fi</span>}
                </>
              );
            })()}
          </div>
          <div className="bk-seatcard-note">
            {ZONE[chosen.zone]}
            {detail.note && ` · ${detail.note}`}
          </div>
        </div>
      )}

      <div className="bk-act">
        <div className="bk-act-sum">
          {/* What the figure on the right is made of, in words rather than as
              an arithmetic expression: "$717 × 2 + $44 seats" is a sum being
              shown its working, and nobody checks it — what they want to know
              is whether the seats cost anything. */}
          <span className="bk-cap">
            {surcharge > 0
              ? `Fare ${money(perPax * pax)} · seats ${money(surcharge)}`
              : pax > 1
                ? `${money(perPax)} each · ${pax} travellers`
                : `${fareLabel(cabinClass, family)} · one way`}
          </span>
          <span className="bk-act-sum-v">{money(total)}</span>
        </div>
        {/* Buying, the aeroplanes are taken in order and the button walks
            you through them. On a trip that exists every aeroplane already
            has its seats, so the button saves what has been moved and goes
            back: somebody who opened the map from the day's Seat key to
            move one seat was being marched through the return flight before
            they were allowed to leave. The other aeroplane is the link
            underneath. */}
        {nextPlane && !pnr ? (
          <button
            className="bk-btn"
            disabled={!allSeated}
            onClick={() => {
              setLeg(nextPlane.leg);
              setSegIndex(nextPlane.i);
            }}
          >
            {allSeated
              ? `Next flight · ${nextPlane.seg.option.from.iata} → ${nextPlane.seg.option.to.iata}`
              : "Choose a seat for everyone"}
          </button>
        ) : (
          <button
            className="bk-btn"
            disabled={!everySeated}
            onClick={() => go(pnr ? "trip" : "review")}
          >
            {/* A booking that exists is not being bought again. Coming here
                from check-in to move a seat and being handed a "Review and
                pay" button is how an app takes the same money twice. */}
            {!everySeated
              ? "Choose a seat for everyone"
              : pnr
                ? "Save seats"
                : "Review and pay"}
          </button>
        )}
        {pnr && nextPlane && (
          <button
            className="bk-link"
            onClick={() => {
              setLeg(nextPlane.leg);
              setSegIndex(nextPlane.i);
            }}
          >
            Next flight · {nextPlane.seg.option.from.iata} →{" "}
            {nextPlane.seg.option.to.iata}
          </button>
        )}
        {planes.length > 1 && here > 0 && (
          <button
            className="bk-link"
            onClick={() => {
              const prev = planes[here - 1];
              setLeg(prev.leg);
              setSegIndex(prev.i);
            }}
          >
            Back to {prev(planes, here)}
          </button>
        )}
      </div>
    </>
  );
}

function prev(
  planes: Array<{ seg: { option: { from: { iata: string }; to: { iata: string } }; seats: Array<string | null> } }>,
  here: number,
): string {
  const p = planes[here - 1];
  return `${p.seg.option.from.iata} → ${p.seg.option.to.iata} · ${p.seg.seats
    .filter(Boolean)
    .join(" ")}`;
}
