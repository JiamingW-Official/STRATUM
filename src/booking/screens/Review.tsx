import { Fragment, useState } from "react";
import { useBooking } from "../store";
import { buildCabin, findSeat } from "../cabin";
import { clockShift, dayAt, money } from "../format";
import { brandOf } from "../profile";
import {
  familyFor,
  fareFamily,
  fareLabel,
  priceItinerary,
  routeKm,
} from "../schedule";
import { milesFor, seatsIncludedFor, tierOf } from "../member";
import {
  legArrivalUtc,
  legDepartureUtc,
  legFrom,
  legSeats,
  legStops,
  legTo,
  legTotalMin,
} from "../leg";
import type { Itinerary, LegBooking } from "../types";
import { RouteLine } from "../RouteLine";
import { FareTerms } from "../FareTerms";
import { Tick } from "../icons";
import { dayOffset, hhmm } from "../format";

/** A leg already chosen, read back as the journey it was chosen as. */
const asItinerary = (l: LegBooking): Itinerary => ({
  segments: l.segments.map((x) => x.option),
  layoverMin: l.layoverMin,
  totalMin: 0,
});

/**
 * Who is flying and how it is paid for, on one screen.
 *
 * These used to be two, which is two forms for what a passenger thinks of as
 * one act: buying the seat. The passport questions that were here have gone to
 * check-in, where an airline actually needs them.
 *
 * With a return there are two of everything to price, and the two are not the
 * same price: each leg pays the tax of the country it leaves from, which is
 * why a trip out of New York and back from London is dearer coming home. That
 * is a real fact about flying and the breakdown shows it rather than averaging
 * it away.
 */
export function Review() {
  const legs = useBooking((s) => s.legs);
  const cabinClass = useBooking((s) => s.cabinClass);
  const passengers = useBooking((s) => s.passengers);
  const setPassenger = useBooking((s) => s.setPassenger);
  const pax = useBooking((s) => s.query.pax);
  const chosenFamily = useBooking((s) => s.fareFamily);
  const savedCard = useBooking((s) => s.savedCard);
  const member = useBooking((s) => s.member);
  const useSaved = useBooking((s) => s.useSaved);
  const setUseSaved = useBooking((s) => s.setUseSaved);
  const card = useBooking((s) => s.card);
  const setCard = useBooking((s) => s.setCard);
  const remember = useBooking((s) => s.remember);
  const setRemember = useBooking((s) => s.setRemember);
  const forgetSavedCard = useBooking((s) => s.forgetSavedCard);
  const pay = useBooking((s) => s.pay);

  // A remembered name is shown, not re-asked. It can still be changed, which
  // is a link rather than two boxes sitting open for the nine times out of ten
  // nobody needs them.
  const named = passengers.every((x) => x.family && x.given);
  const [editingName, setEditingName] = useState(!named);

  if (!legs.out) return null;

  const family = familyFor(cabinClass, chosenFamily);
  const rules = fareFamily(family);
  const tier = tierOf(member?.miles ?? 0);
  // Gold and above stop paying for a seat. It is the benefit people notice,
  // and it has to be applied where the money is added up rather than only
  // described on a card somewhere.
  const seatsFree = rules.seatIncluded || seatsIncludedFor(tier);
  const booked = [legs.out, legs.back].filter(Boolean) as LegBooking[];

  const priceFor = (b: LegBooking) => priceItinerary(asItinerary(b), cabinClass, family);
  const seatFee = (b: LegBooking) => {
    if (seatsFree) return 0;
    return b.segments.reduce((n, sg) => {
      const map = buildCabin(sg.option.aircraft, sg.option.flightNo);
      return (
        n + sg.seats.reduce((m, x) => m + (x ? (findSeat(map, x)?.surcharge ?? 0) : 0), 0)
      );
    }, 0);
  };
  const fares = booked.reduce((n, b) => n + priceFor(b).fare, 0) * pax;
  const taxes = booked.reduce((n, b) => n + priceFor(b).tax, 0) * pax;
  const seats = booked.reduce((n, b) => n + seatFee(b), 0);
  const total = fares + taxes + seats;

  const digits = card.number.replace(/\D/g, "");
  const nameOk = passengers.every(
    (x) => x.family.trim() !== "" && x.given.trim() !== "",
  );
  const cardOk = useSaved
    ? card.cvv.length >= 3
    : digits.length >= 12 && /^\d\d\/\d\d$/.test(card.expiry) && card.cvv.length >= 3;

  /* The fields a new card needs, and the one decision that goes with them.
     They are written once and placed either inside the option they belong to
     or on their own when there is no option to belong to. */
  const FIELDS = (
    <>
      <label className="bk-field" data-mono="true">
        <span className="bk-field-k">Card number</span>
        <input
          inputMode="numeric"
          value={card.number}
          placeholder="4242 4242 4242 4242"
          onChange={(e) =>
            setCard({
              number: e.target.value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(.{4})/g, "$1 ")
                .trim(),
            })
          }
        />
      </label>
      <div className="bk-pair">
        <label className="bk-field" data-mono="true">
          <span className="bk-field-k">Expiry</span>
          <input
            inputMode="numeric"
            value={card.expiry}
            placeholder="MM/YY"
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, "").slice(0, 4);
              setCard({
                expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d,
              });
            }}
          />
        </label>
        <label className="bk-field" data-mono="true">
          <span className="bk-field-k">Security code</span>
          <input
            inputMode="numeric"
            value={card.cvv}
            placeholder="000"
            onChange={(e) =>
              setCard({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
            }
          />
        </label>
      </div>
      <button
        className="bk-check"
        data-on={remember}
        onClick={() => setRemember(!remember)}
      >
        <span className="bk-box">✓</span>
        <span>
          Remember this card · last four digits and expiry only
        </span>
      </button>
    </>
  );

  return (
    <>
      <div className="bk-body">
        <div className="bk-notice">
          STRATUM is not an airline. Nothing here is charged.

        </div>

        {/* Two legs, each with its own rail and its own date heading. A
            return read as one undifferentiated block of figures was the
            fastest way to lose which flight was which. */}
        {/* The trip in a card of its own, with a band across the top the way
            an airline's review screen bands its flights. It used to sit
            directly on the page under a grey caption, which put the thing
            being bought on a lower surface than the form that pays for it. */}
        <div className="bk-card" data-flush="true">
          {/* No heading. It is the first card on a screen called Review and
              pay, and what is in it is two airport codes and a clock — a
              band across the top saying FLIGHTS is a caption on a thing that
              cannot be mistaken for anything else. */}
          <div className="bk-pad">
          {booked.map((b, i) => (
            <div
              className="bk-leg"
              key={i}
              data-leg={i === 0 ? "out" : "back"}
            >
              <div className="bk-leg-head">
                <span>{i === 0 ? "Departing" : "Returning"}</span>
                <span>{dayAt(legDepartureUtc(b), legFrom(b))}</span>
              </div>
              <RouteLine
                fromIata={legFrom(b).iata}
                from={legFrom(b)}
                departureUtc={legDepartureUtc(b)}
                toIata={legTo(b).iata}
                to={legTo(b)}
                arrivalUtc={legArrivalUtc(b)}
                duration={hhmm(legTotalMin(b))}
                via={legStops(b)}
                dayOffset={dayOffset(
                  legDepartureUtc(b),
                  legFrom(b),
                  legArrivalUtc(b),
                  legTo(b),
                )}
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

              {/* Each aeroplane on its own line when there are two. A change
                  is the part of a journey a passenger worries about, and
                  folding it into one row is how it gets missed. */}
              {b.segments.map((sg, n) => (
                <Fragment key={sg.option.flightNo}>
                  {/* Four columns, not four facts joined by middots: which
                      aeroplane of the journey, the hop, what is flying it, and
                      the seat — each in the same place on every line so the
                      eye can go straight down one of them. */}
                  {/* The hop number only when there is more than one hop. A
                      grey "1" against a single flight numbers a list of one. */}
                  <div
                    className="bk-leg-meta"
                    data-numbered={b.segments.length > 1}
                  >
                    {b.segments.length > 1 && (
                      <span className="bk-leg-hop">{n + 1}</span>
                    )}
                    {/* And the pair only when there is more than one hop.
                        On a nonstop it is the same two codes as the clock
                        line directly above, said again in grey. */}
                    {b.segments.length > 1 && (
                      <span className="bk-leg-seg">
                        {sg.option.from.iata} → {sg.option.to.iata}
                      </span>
                    )}
                    <span className="bk-leg-plane">
                      {sg.option.flightNo} · {sg.option.aircraft}
                    </span>
                    <span className="bk-leg-seat bk-mono">
                      {sg.seats.filter(Boolean).join(" ")}
                    </span>
                  </div>
                  {n < b.segments.length - 1 && (
                    <div className="bk-leg-wait">
                      <b>
                        {Math.floor(b.layoverMin[n] / 60)}h{" "}
                        {String(b.layoverMin[n] % 60).padStart(2, "0")}m
                      </b>{" "}
                      on the ground in {sg.option.to.iata}, and a different
                      aeroplane
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          ))}
          </div>

          {/* The fare, named where a fare belongs: on the flights it applies
              to, in the words it was compared in on the list. It used to be a
              black pill floating on a grey band above a two-by-two grid of
              white boxes — four facts of very unequal weight made into four
              identical objects, three of them absences drawn as features. */}
          <div className="bk-fare-foot">
            <div className="bk-fare-foot-h">
              <span>Fare</span>
              <b>
                {fareLabel(cabinClass, family)}
              </b>
            </div>
            <FareTerms cabinClass={cabinClass} family={family} />
          </div>
        </div>

        <div className="bk-card">
          <div className="bk-card-h">Traveller</div>
          {editingName ? (
            <div className="bk-stack">
              {passengers.map((x, i) => (
                <div key={i}>
                  {passengers.length > 1 && (
                    <div className="bk-paxlabel">
                      Traveller {i + 1}
                    </div>
                  )}
                  <div className="bk-pair">
                    <label className="bk-field">
                      <span className="bk-field-k">Family name</span>
                      <input
                        value={x.family}
                        autoComplete={i === 0 ? "family-name" : "off"}
                        placeholder="LARSSON"
                        onChange={(e) =>
                          setPassenger(i, { family: e.target.value.toUpperCase() })
                        }
                      />
                    </label>
                    <label className="bk-field">
                      <span className="bk-field-k">Given names</span>
                      <input
                        value={x.given}
                        autoComplete={i === 0 ? "given-name" : "off"}
                        placeholder="MAJ"
                        onChange={(e) =>
                          setPassenger(i, { given: e.target.value.toUpperCase() })
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bk-row" data-static="true">
              <span>
                {passengers.map((x) => `${x.family} / ${x.given}`).join(" · ")}
                <span className="bk-row-sub">
                  As printed in the passport
                </span>
              </span>
              <button className="bk-link" onClick={() => setEditingName(true)}>
                Change
              </button>
            </div>
          )}
        </div>

        <div className="bk-card">
          <div className="bk-card-h">Payment</div>
          {/* The card, and the fields that belong to it, in one object.
              A radio in an amber box with the security code floating under
              both options left the one field on the screen attached to
              nothing — and a radio group needs something to choose between,
              which with no card saved it does not have. */}
          {savedCard ? (
            <div className="bk-pick">
              <button
                className="bk-pick-b"
                data-on={useSaved}
                onClick={() => setUseSaved(true)}
              >
                <span className="bk-pick-k">
                  <b>
                    {savedCard.brand} ending {savedCard.last4}
                  </b>
                  <i>Expires {savedCard.expiry}</i>
                </span>
                {useSaved && <Tick size={17} />}
              </button>
              {useSaved && (
                <div className="bk-pick-body">
                  <label className="bk-field" data-mono="true" data-narrow="true">
                    <span className="bk-field-k">Security code</span>
                    <input
                      inputMode="numeric"
                      value={card.cvv}
                      placeholder="000"
                      onChange={(e) =>
                        setCard({
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                        })
                      }
                    />
                  </label>
                  <p className="bk-note">Asked every time · never kept</p>
                  <button
                    className="bk-link"
                    data-quiet="true"
                    onClick={forgetSavedCard}
                  >
                    Forget this card
                  </button>
                </div>
              )}

              <button
                className="bk-pick-b"
                data-on={!useSaved}
                onClick={() => setUseSaved(false)}
              >
                <span className="bk-pick-k">
                  <b>Use another card</b>
                  <i>{digits ? brandOf(digits) : "Visa, Mastercard or Amex"}</i>
                </span>
                {!useSaved && <Tick size={17} />}
              </button>
              {!useSaved && <div className="bk-pick-body">{FIELDS}</div>}
            </div>
          ) : (
            <>
              <div className="bk-payhead">
                <span>Credit or debit card</span>
                <span className="bk-brand">
                  {digits ? brandOf(digits).toUpperCase() : "CARD"}
                </span>
              </div>
              <div className="bk-stack">{FIELDS}</div>
            </>
          )}
        </div>

        <div className="bk-card" data-flush="true">
          <div className="bk-sec">Price</div>
          <div className="bk-pad">
          {/* A receipt, not seven rows of the same size. What a leg costs is
              one figure and the tax on it is a component of that figure, not a
              peer of it — printing them in the same ink at the same weight is
              what makes a price list unreadable at a glance. */}
          <div className="bk-bill">
            {booked.map((b, i) => {
              const { fare, tax } = priceFor(b);
              return (
                <Fragment key={i}>
                  <div className="bk-bill-row">
                    <span className="bk-bill-k">
                      {i === 0 ? "Departing" : "Returning"}
                      <i>
                        {legFrom(b).iata} → {legTo(b).iata} ·{" "}
                        {fareLabel(cabinClass, family)}
                        {pax > 1 && ` · ${pax} travellers`}
                      </i>
                    </span>
                    <b>{money(fare * pax)}</b>
                  </div>
                  <div className="bk-bill-row" data-sub="true">
                    <span className="bk-bill-k">
                      Taxes and charges · {legFrom(b).iata}
                      {legStops(b).length > 0 && ` + ${legStops(b)[0]}`}
                    </span>
                    <b>{money(tax * pax)}</b>
                  </div>
                </Fragment>
              );
            })}
            <div className="bk-bill-row">
              <span className="bk-bill-k">
                Seats
                <i>
                  {booked
                    .map((b) => legSeats(b).filter(Boolean).join(", "))
                    .join(" · ")}
                  {seatsFree &&
                    (rules.seatIncluded
                      ? " · included in Flex"
                      : ` · included at ${tier}`)}
                </i>
              </span>
              <b>{seats === 0 ? "Included" : money(seats)}</b>
            </div>
          </div>

          <div className="bk-total">
            <span>Total</span>
            <b>{money(total)}</b>
          </div>

          {/* Miles are not money and do not belong in the column of it. */}
          <div className="bk-earnbar">
            <span>
              {(
                milesFor(
                  booked.reduce(
                    (n, b) =>
                      n +
                      b.segments.reduce(
                        (m, sg) =>
                          m + routeKm(sg.option.from.iata, sg.option.to.iata),
                        0,
                      ),
                    0,
                  ),
                  cabinClass,
                  family,
                ) * pax
              ).toLocaleString("en-US")}{" "}
              miles
            </span>
            <i>{member ? `on ${member.number}` : "on a new card"}</i>
          </div>
          </div>
        </div>
      </div>

      <div className="bk-act">
        <button className="bk-btn" disabled={!nameOk || !cardOk} onClick={pay}>
          Pay {money(total)}
        </button>
      </div>
    </>
  );
}
