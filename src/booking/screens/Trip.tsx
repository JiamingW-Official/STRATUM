import { Fragment, useState } from "react";
import { useBooking } from "../store";
import { atAirport, clockShift, dayAt, dayOffset, hhmm, money } from "../format";
import { RouteLine } from "../RouteLine";
import { Close, Code, Go } from "../icons";
import { useMinute } from "../clock";
import { FareTerms } from "../FareTerms";
import { buildCabin, findSeat, surchargeFor } from "../cabin";
import { seatsIncludedFor, tierOf } from "../member";
import {
  changeFeeFor,
  checkInIsOpen,
  checkInOpensUtc,
  disruptionFor,
  familyFor,
  fareFamily,
  fareLabel,
  priceItinerary,
  refundOn,
} from "../schedule";
import {
  legArrivalUtc,
  legCheckedIn,
  legDepartureUtc,
  legFrom,
  legTo,
  legTotalMin,
} from "../leg";
import type { Itinerary, LegBooking } from "../types";

/** A journey is as disrupted as its worst aeroplane. */
const worstOf = (l: LegBooking) =>
  l.segments
    .map((sg) => disruptionFor(sg.option.flightNo, sg.option.departureUtc))
    .sort((x, y) =>
      x.status === "cancelled" ? -1 : y.status === "cancelled" ? 1 : 0,
    )[0];

const asItinerary = (l: LegBooking): Itinerary => ({
  segments: l.segments.map((x) => x.option),
  layoverMin: l.layoverMin,
  totalMin: 0,
});

/**
 * One trip, and everything that can still be done to it.
 *
 * This screen manages a booking. It is not the day of travel — that has its
 * own tab and its own four pages — and it is not the pass. It had drifted
 * into being all three: the card repeated the panel you tapped to get here,
 * word for word and bigger, and then printed the terminal, the gate, the
 * boarding time, the group and the gate-closing time, which are the same five
 * figures the Travel tab and the boarding pass already carry. Three copies of
 * a departure board is how they end up disagreeing.
 *
 * What is left is the booking: what it is, what each flight of it is, what is
 * yours on that flight, and the two or three things you can still change. The
 * gate and the group are not here because before check-in nobody knows them
 * and after it they are printed on the document this card opens.
 *
 * Every row does something. A list of seven rows where five open nothing is
 * how an app teaches people not to tap.
 */
export function Trip() {
  const pnr = useBooking((s) => s.pnr);
  const legs = useBooking((s) => s.legs);
  const cabinClass = useBooking((s) => s.cabinClass);
  const passengers = useBooking((s) => s.passengers);
  const setLeg = useBooking((s) => s.setLeg);
  const go = useBooking((s) => s.go);
  const chosenFamily = useBooking((s) => s.fareFamily);
  const pax = useBooking((s) => s.query.pax);
  const startChange = useBooking((s) => s.startChange);
  const cancelBooking = useBooking((s) => s.cancelBooking);
  const member = useBooking((s) => s.member);
  const [confirming, setConfirming] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const upgradeCabin = useBooking((s) => s.upgradeCabin);
  const now = useMinute();

  if (!pnr || !legs.out) return null;
  const booked = [legs.out, legs.back].filter(Boolean) as LegBooking[];

  // Not checked in and not yet gone. A leg that has departed is not pending
  // anything: the window closed when the door did.
  const pending = booked.find(
    (b) =>
      !legCheckedIn(b) &&
      now < Date.parse(legDepartureUtc(b)) &&
      // A cancelled aeroplane cannot be checked into, so the screen does not
      // offer it: the button would have led to a screen that refuses.
      worstOf(b).status !== "cancelled",
  );
  const open = pending ? checkInIsOpen(legDepartureUtc(pending)) : false;
  const opensUtc = pending ? checkInOpensUtc(legDepartureUtc(pending)) : null;

  const family = familyFor(cabinClass, chosenFamily);
  const rules = fareFamily(family);
  const fee = changeFeeFor(cabinClass, family);
  const fares =
    booked.reduce(
      (n, b) => n + priceItinerary(asItinerary(b), cabinClass, family).fare,
      0,
    ) * pax;
  const taxes =
    booked.reduce(
      (n, b) => n + priceItinerary(asItinerary(b), cabinClass, family).tax,
      0,
    ) * pax;
  const refund = refundOn(family, fares, taxes);
  // What was paid for seats, which a cancellation does not give back. The
  // sheet used to list a fare and a tax and stop there, so the one figure it
  // was silent about was the one somebody would notice missing.
  const seatsFree =
    rules.seatIncluded || seatsIncludedFor(tierOf(member?.miles ?? 0));
  const seatMoney = seatsFree
    ? 0
    : booked.reduce(
        (n, b) =>
          n +
          b.segments.reduce((m, sg) => {
            const map = buildCabin(sg.option.aircraft, sg.option.flightNo);
            return (
              m +
              sg.seats.reduce(
                (k, sv) => k + (sv ? (findSeat(map, sv)?.surcharge ?? 0) : 0),
                0,
              )
            );
          }, 0),
        0,
      );
  const anyCheckedIn = booked.some((b) => legCheckedIn(b));

  // What the front of the aeroplane would cost from here: the business fare
  // for the flights already bought, less what was paid for them. Airlines
  // sell this right up to the door and this one had no way to say yes.
  const inBusiness = booked.reduce(
    (n, b) => n + priceItinerary(asItinerary(b), "business", "flex").total,
    0,
  ) * pax;
  const upgrade = Math.max(0, inBusiness - (fares + taxes));
  const canUpgrade = cabinClass !== "business" && !anyCheckedIn && upgrade > 0;

  // The span of the whole trip, which neither card carries on its own. A
  // single flight does not get one: the card two centimetres below says the
  // day, and a line that repeats the line under it is a line to delete.
  const span =
    booked.length > 1
      ? `${dayAt(legDepartureUtc(booked[0]), legFrom(booked[0]))} – ${dayAt(
          legDepartureUtc(booked[1]),
          legFrom(booked[1]),
        )}`
      : null;

  return (
    <>
      <div className="bk-body">
        {/* The trip's own name. The bar above says which screen this is; this
            says which trip, and it is the only place the cities are written
            out in words — every card under it is about one aeroplane. */}
        <header className="bk-tripmast">
          <h1 className="bk-tripmast-t">
            {legFrom(booked[0]).city.en}
            <i aria-hidden="true">{booked.length > 1 ? "\u21c4" : "\u2192"}</i>
            {legTo(booked[0]).city.en}
          </h1>
          {span && <p className="bk-tripmast-d">{span}</p>}
          {/* The six characters an agent asks for, at the size they are read
              out at a desk. They were at the bottom of the screen under the
              money, which is the one place nobody looks while standing at
              one. */}
          <div className="bk-pnr">
            <span className="bk-label">Confirmation</span>
            <b className="bk-mono">{pnr}</b>
          </div>
        </header>

        {booked.map((b, i) => {
          const d = worstOf(b);
          const late = d.status === "delayed" ? d.minutes : 0;
          const checked = legCheckedIn(b);
          const gone = now >= Date.parse(legDepartureUtc(b));
          const which = i === 0 ? "out" : "back";
          return (
            <div className="bk-card" key={i}>
              <div className="bk-trip-head">
                <span className="bk-label">
                  {i === 0 ? "Departing" : "Returning"} ·{" "}
                  {dayAt(legDepartureUtc(b), legFrom(b))}
                </span>
                {/* Only when there is something to say. "On time" in a mint
                    capsule is a status light for the absence of a status. */}
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

              {/* Cancelled is the one status that needs a sentence, because
                  it needs a verb: go and speak to somebody. A delay is
                  already on the card twice — the lamp, and the clocks gone
                  amber with the old time struck through — and a paragraph
                  saying it a third time was what made the card a page. */}
              {d.status === "cancelled" && (
                <p className="bk-trip-why">{sentenceOf(d)}</p>
              )}

              {/* The flight itself, and the biggest thing on the card. The
                  two cities used to be written above it in twenty-two point
                  as well, which is the route line's own job done twice. */}
              <RouteLine
                fromIata={legFrom(b).iata}
                from={legFrom(b)}
                departureUtc={legDepartureUtc(b)}
                toIata={legTo(b).iata}
                to={legTo(b)}
                arrivalUtc={legArrivalUtc(b)}
                duration={hhmm(legTotalMin(b))}
                via={b.segments.slice(0, -1).map((sg) => sg.option.to.iata)}
                dayOffset={dayOffset(
                  legDepartureUtc(b),
                  legFrom(b),
                  legArrivalUtc(b),
                  legTo(b),
                )}
                delayMin={late}
                size="lead"
              />

              {/* What the clock does between the two ends, which is the
                  first thing a traveller works out and the last thing a
                  booking screen ever tells them. */}
              {(() => {
                // A figure, not a sentence. "+5h" is taken in at a glance;
                // "London is five hours ahead" has to be read.
                const shift = clockShift(legFrom(b), legTo(b), legDepartureUtc(b));
                return shift ? (
                  <p className="bk-leg-clock">
                    {legTo(b).iata} {shift > 0 ? "+" : "\u2212"}
                    {Math.abs(shift)}h
                  </p>
                ) : null;
              })()}

              {/* Three facts per aeroplane, the same size as each other. They
                  were one line of twelve-point with the flight number, the
                  type and the seat run together, and the seat — the one of
                  the three that is yours — fell onto a second line on its
                  own. Brass is what yours is drawn in everywhere else. */}
              {b.segments.map((sg, n) => (
                <Fragment key={sg.option.flightNo}>
                  <div className="bk-facts">
                    <div>
                      <dt>
                        {b.segments.length > 1 ? `Flight ${n + 1}` : "Flight"}
                      </dt>
                      <dd className="bk-mono">{sg.option.flightNo}</dd>
                    </div>
                    <div>
                      <dt>Aircraft</dt>
                      <dd>{sg.option.aircraft}</dd>
                    </div>
                    <div data-tint="own">
                      <dt>Seat</dt>
                      <dd className="bk-mono">
                        {sg.seats.filter(Boolean).join(" ") || "—"}
                      </dd>
                    </div>
                  </div>
                  {n < b.segments.length - 1 && (
                    <div className="bk-leg-wait">
                      {hhmm(b.layoverMin[n])} in {sg.option.to.iata} · change
                      aircraft
                    </div>
                  )}
                </Fragment>
              ))}

              {/* One line about where this flight has got to, in the same
                  place whatever the answer is. The card used to change shape
                  entirely between the two halves of its life: a five-cell
                  departure board after check-in, two action rows before it,
                  and nothing at all to say why the board was missing. */}
              {/* No paragraph about where the flight has got to. There were
                  three of them, one per state, and each was a sentence the
                  reader had to parse to find out which state they were in.
                  What they said now lives on the controls it governs: the
                  Seats row says it re-issues the pass, the Change row says it
                  is with an agent, and the bar at the foot says when check-in
                  opens. The one state with no control left is a flight that
                  has gone without you. */}
              {gone && !checked && (
                <p className="bk-panel-note">This flight has departed.</p>
              )}

              {/* What can still be done. The seat is yours until the door
                  closes, checked in or not — the pass is re-issued for the
                  new one. The flight itself is only changeable before
                  check-in. */}
              {!gone && (
                <div className="bk-panel-acts">
                  <button
                    className="bk-row"
                    data-go="true"
                    onClick={() => {
                      setLeg(which);
                      useBooking.setState({ segIndex: 0, paxIndex: 0 });
                      go("seats");
                    }}
                  >
                    <span className="bk-row-k">Move seat</span>
                    <span className="bk-row-v">
                      {seatsFree
                        ? "Included"
                        : `From ${money(surchargeFor("standard"))}`}
                      <Go size={13} />
                    </span>
                  </button>
                  {/* Stays on the card after check-in, disabled, saying
                      why. A row that vanishes leaves the reader wondering
                      whether it was ever there. */}
                  <button
                    className="bk-row"
                    data-go="true"
                    disabled={checked || fee === null}
                    onClick={() => startChange(which)}
                  >
                    <span className="bk-row-k">Change this flight</span>
                    {/* One figure, and "from" carries the fare difference the
                        sentence used to spell out: the fee is the floor, not
                        the price. */}
                    <span className="bk-row-v">
                      {checked
                        ? "At the airport"
                        : fee === null
                          ? `Not on ${rules.name}`
                          : fee === 0
                            ? "Fare difference"
                            : `From ${money(fee)}`}
                      <Go size={13} />
                    </span>
                  </button>
                </div>
              )}
              {checked ? (
                /* The pass is not one more button on a form — it is the
                   document the whole booking exists to produce. It is drawn
                   as the slot it comes out of: the foot of the card, full
                   width, in the airline's black. */
                <button
                  className="bk-passkey"
                  onClick={() => {
                    setLeg(which);
                    useBooking.setState({
                      passLeg: which,
                      passSeg: 0,
                      passIndex: 0,
                    });
                    go("boarding");
                  }}
                >
                  <Code size={17} />
                  <span>Boarding pass</span>
                  <Go />
                </button>
              ) : null}
            </div>
          );
        })}

        {/* What belongs to the booking rather than to one of its flights. */}
        <div className="bk-card" data-flush="true">
          <div className="bk-sec">Booking</div>
          <div className="bk-pad">
            <div className="bk-row" data-static="true">
              <span className="bk-row-k">Traveller</span>
              <span className="bk-row-v">
                {passengers.map((x) => `${x.family}/${x.given}`).join(" · ")}
              </span>
            </div>
            {/* A receipt, so one fact to a line. The fare used to be a grey
                clause under the total and the head count a word inside it;
                the travellers are named on the row above, which is the head
                count told properly. */}
            <div className="bk-row" data-static="true">
              <span className="bk-row-k">Fare</span>
              <span className="bk-row-v">{fareLabel(cabinClass, family)}</span>
            </div>
            <div className="bk-row" data-static="true">
              <span className="bk-row-k">Paid</span>
              <span className="bk-row-v">{money(fares + taxes)}</span>
            </div>
            {canUpgrade && (
              <button
                className="bk-row"
                data-go="true"
                onClick={() => setUpgrading(true)}
              >
                <span className="bk-row-k">Move to Business</span>
                <span className="bk-row-v bk-upsell">
                  +{money(upgrade)}
                  <Go size={13} />
                </span>
              </button>
            )}
            {/* What comes back, and the sheet behind it says out of what. */}
            <button
              className="bk-row"
              data-go="true"
              onClick={() => setConfirming(true)}
            >
              <span className="bk-row-k">Cancel the booking</span>
              <span className="bk-row-v">
                {money(refund.fare > 0 ? refund.total : refund.tax)} back
                <Go size={13} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {upgrading && (
        <div className="bk-sheet">
          <div className="bk-sheet-head">
            <span>Move to Business?</span>
            <button
              className="bk-bar-end"
              onClick={() => setUpgrading(false)}
              aria-label="Close"
            >
              <Close />
            </button>
          </div>
          <div className="bk-sheet-list">
            <div className="bk-sheet-inner">
              <div className="bk-fare-terms">
                <FareTerms cabinClass="business" family="flex" />
              </div>
            </div>
            <div className="bk-total">
              <span>To pay</span>
              <b>{money(upgrade)}</b>
            </div>
            <p className="bk-note">
              Seats chosen again in the new cabin · everything else stays
            </p>
            <button className="bk-btn" onClick={upgradeCabin}>
              Pay {money(upgrade)} and choose a seat
            </button>
          </div>
        </div>
      )}

      {confirming && (
        <div className="bk-sheet">
          <div className="bk-sheet-head">
            <span>Cancel this booking?</span>
            <button
              className="bk-bar-end"
              onClick={() => setConfirming(false)}
              aria-label="Close"
            >
              <Close />
            </button>
          </div>
          <div className="bk-sheet-list">
            <div className="bk-sheet-inner">
              <div className="bk-row" data-static="true">
                <span className="bk-row-k">Fare</span>
                <span className="bk-row-v">
                  {refund.fare > 0 ? money(refund.fare) : "Not refundable"}
                </span>
              </div>
              <div className="bk-row" data-static="true">
                <span className="bk-row-k">Taxes and charges</span>
                <span className="bk-row-v">{money(refund.tax)}</span>
              </div>
              {seatMoney > 0 && (
                <div className="bk-row" data-static="true">
                  <span className="bk-row-k">
                    Seats · {money(seatMoney)} paid
                  </span>
                  <span className="bk-row-v">Not returned</span>
                </div>
              )}
            </div>
            <div className="bk-total">
              <span>Back to your card</span>
              <b>{money(refund.total)}</b>
            </div>
            <button className="bk-btn" onClick={() => cancelBooking(refund)}>
              Cancel and refund {money(refund.total)}
            </button>
          </div>
        </div>
      )}

      {pending && (
        <div className="bk-act">
          <button
            className="bk-btn"
            disabled={!open}
            onClick={() => {
              setLeg(pending === legs.back ? "back" : "out");
              go("checkin");
            }}
          >
            {open
              ? `Check in · ${legFrom(pending).iata} → ${legTo(pending).iata}`
              : `${booked.length > 1 ? (pending === legs.back ? "Return check-in" : "Outbound check-in") : "Check-in opens"} · ${dayAt(opensUtc!, legFrom(pending))}, ${atAirport(opensUtc!, legFrom(pending))}`}
          </button>
        </div>
      )}
    </>
  );
}

/** Why, in a sentence — only for the one status that needs a verb. */
function sentenceOf(d: ReturnType<typeof worstOf>): string {
  if (d.status === "cancelled")
    return `Not operating — ${d.reason}. Speak to an agent before going to the airport.`;
  return "";
}
