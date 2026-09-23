import { useEffect, useState, useRef } from "react";
import { useBooking } from "../store";
import { useThumb } from "../useThumb";
import { Restricted } from "../icons";
import { Arc, skyAt } from "../Arc";
import { atAirport, dayAt, money } from "../format";
import {
  EXTRA_BAG,
  bagDropClosesUtc,
  baggageFor,
  cabinName,
  disruptionFor,
  familyFor,
  routeKm,
} from "../schedule";

// Two things happen here and an airline is not allowed to skip either: the
// border wants a passport, and the law wants somebody to have answered the
// dangerous goods question. Everything else that used to be on the way to a
// boarding pass has been taken off it.
//
// American Airlines opens this flow by naming the flight it is checking you in
// for, and then shows the seat you already hold before it asks for anything.
// This screen used to begin with an empty nationality select, which is an app
// asking for work before it has said what the work is for.

const NATIONALITIES = [
  "China",
  "United Kingdom",
  "United States",
  "Japan",
  "Singapore",
  "France",
];

const RESTRICTED = [
  "Lithium batteries over 100 Wh",
  "Aerosols and compressed gas",
  "Flammable liquids and solids",
  "Fireworks and flares",
  "Corrosives, oxidisers, toxins",
];

/** What somebody would say to you as you come through the door. */
function greeting(hour: number): string {
  if (hour < 5) return "Goodnight";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function CheckIn() {
  const leg = useBooking((s) => s.leg);
  const legs = useBooking((s) => s.legs);
  const current = legs[leg];
  const hasReturn = Boolean(legs.back);
  const selected = current?.segments[0].option ?? null;
  const last = current?.segments[current.segments.length - 1].option ?? null;
  const segments = current?.segments ?? [];
  const passengers = useBooking((s) => s.passengers);
  const setPassenger = useBooking((s) => s.setPassenger);
  const p = passengers[0];
  const checkIn = useBooking((s) => s.checkIn);
  const go = useBooking((s) => s.go);
  const cabinClass = useBooking((s) => s.cabinClass);
  const chosenFamily = useBooking((s) => s.fareFamily);
  const savedCard = useBooking((s) => s.savedCard);
  const extraBags = useBooking((s) => s.extraBags);
  const milesBags = useBooking((s) => s.milesBags);
  const member = useBooking((s) => s.member);
  const setExtraBags = useBooking((s) => s.setExtraBags);
  const forgetDocument = useBooking((s) => s.forgetPassport);
  const [declared, setDeclared] = useState<null | boolean>(null);
  const bagRow = useRef<HTMLDivElement>(null);
  const bagThumb = useThumb(bagRow, [extraBags]);
  const goodsRow = useRef<HTMLDivElement>(null);
  const goodsThumb = useThumb(goodsRow, [declared]);
  // The one moment in this app worth pausing on. Everything before it is a
  // form; this is where a person becomes somebody with a seat on an
  // aeroplane, and an app that answers it by replacing the screen has thrown
  // the moment away. The pause is not a fake loading bar — the work is
  // instant — it is the beat an airline's own app takes here, and it is the
  // difference between a state change and an event.
  const [issuing, setIssuing] = useState(false);
  useEffect(() => {
    if (!issuing) return;
    const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => checkIn(leg), quick ? 0 : 1500);
    return () => window.clearTimeout(id);
  }, [issuing, checkIn, leg]);
  // Filled in already on any visit after the first, which is the whole reason
  // the document is kept.
  const remembered = p.passportNo !== "" && p.passportExpiry !== "";

  if (!selected) return null;

  // An hour for a long flight, three quarters for a short one.
  const long = routeKm(selected.from.iata, last!.to.iata) >= 3200;

  /**
   * The three things that stop a check-in, and they are not the same thing.
   *
   * A cancelled aeroplane cannot be checked into at all. A passport that has
   * run out is a border problem and the airline will not board it. A passport
   * that runs out soon is a border problem in most countries and a warning
   * everywhere — the six-month rule is the one nobody knows about until they
   * are turned round at immigration.
   */
  const d = disruptionFor(selected.flightNo, selected.departureUtc);
  const landsAt = Date.parse(last!.arrivalUtc);
  const docUntil = p.passportExpiry ? Date.parse(`${p.passportExpiry}T12:00:00Z`) : null;
  const docExpired = docUntil !== null && docUntil < landsAt;
  const docThin =
    docUntil !== null && !docExpired && docUntil < landsAt + 182 * 86400000;

  // Bags go in the hold up to the moment the desk shuts, and not after it.
  const bagsShut = Date.now() >= Date.parse(bagDropClosesUtc(selected.departureUtc, long));

  // How long the aeroplane is up, which is what the line is coloured along.
  const blockMin = Math.round(
    (Date.parse(last!.arrivalUtc) - Date.parse(selected.departureUtc)) / 60000,
  );

  // What the sky does over the course of it: the line says it, and one line
  // of type says it in words for anybody not looking that closely.
  const skyStart = skyAt(selected.from.lon, Date.parse(selected.departureUtc));
  const skyEnd = skyAt(last!.to.lon, Date.parse(last!.arrivalUtc));

  // The local hour at the far end when the aeroplane gets there.
  const arriveHour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: last!.to.tz,
    }).format(new Date(last!.arrivalUtc)),
  );

  const missing: string[] = [];
  if (p.nationality === "") missing.push("nationality");
  if (p.passportNo.trim().length < 6) missing.push("passport number");
  if (p.passportExpiry === "") missing.push("passport expiry");
  if (declared !== false) missing.push("dangerous goods answer");
  if (docExpired) missing.push("a document that is still valid");

  return (
    <>
      <div className="bk-body">
        {/* Which flight this is, in the words a departure board uses, before a
            single field is asked for. */}
        <header className="bk-head">
          <h1>
            {selected.from.iata}
            <i>→</i>
            {last!.to.iata}
          </h1>
          <p>
            {hasReturn && (leg === "out" ? "Departing · " : "Returning · ")}
            {dayAt(selected.departureUtc, selected.from)} ·{" "}
            {segments.map((sg) => sg.option.flightNo).join(" + ")} ·{" "}
            {cabinName(cabinClass)}
          </p>
        </header>

        {d.status === "cancelled" && (
          <div className="bk-notice" data-tone="warn">
            <b>This flight is not operating.</b> {d.reason}. Nobody can be
            checked in for it — speak to an agent, and keep the booking
            reference to hand.
          </div>
        )}

        {/* Numbered, because this is the one screen in the app that is a
            procedure rather than a choice: four things have to be true before
            a pass can be issued, and an airline names them in order. */}
        <div className="bk-card">
          <div className="bk-step" data-done="true"><b>1</b><span>Who is flying</span></div>
          <div className="bk-row" data-static="true">
            <span className="bk-row-k">
              {p.family ? `${p.family} / ${p.given}` : "Traveller 1"}
              <span className="bk-row-sub">
                {passengers.length > 1
                  ? `${passengers.length} travellers on this booking`
                  : "As printed in the passport"}
              </span>
            </span>
            <span className="bk-row-v bk-mono">
              {segments
                .map((sg) => sg.seats.filter(Boolean).join(" · "))
                .join("  |  ")}
            </span>
          </div>
          <div className="bk-row" data-static="true">
            <span className="bk-row-k">Seat</span>
            <button className="bk-link" onClick={() => go("seats")}>
              Change on the map
            </button>
          </div>
        </div>

        <div className="bk-card">
          <div className="bk-step" data-done={missing.every((m) => !m.includes("passport") && m !== "nationality")}><b>2</b><span>Travel document</span></div>
          <div className="bk-stack">
            <label className="bk-field">
              <span className="bk-field-k">Nationality</span>
              <select
                value={p.nationality}
                onChange={(e) =>
                  setPassenger(0, { nationality: e.target.value })
                }
              >
                <option value="">Select</option>
                {NATIONALITIES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="bk-pair">
              <label className="bk-field" data-mono="true">
                <span className="bk-field-k">Passport no.</span>
                <input
                  value={p.passportNo}
                  placeholder="P4471902"
                  onChange={(e) =>
                    setPassenger(0, {
                      passportNo: e.target.value.toUpperCase(),
                    })
                  }
                />
              </label>
              <label className="bk-field">
                <span className="bk-field-k">Expires</span>
                <input
                  type="date"
                  value={p.passportExpiry}
                  onChange={(e) =>
                    setPassenger(0, { passportExpiry: e.target.value })
                  }
                />
              </label>
            </div>
          </div>
          {docExpired && (
            <div className="bk-notice" data-tone="warn">
              <b>Expires before you land.</b> It cannot be used for this
              flight.
            </div>
          )}
          {docThin && (
            <div className="bk-notice">
              <b>Under six months left on arrival.</b> Many countries refuse
              entry on it · you can still check in.
            </div>
          )}

          <div className="bk-docnote">
            <span className="bk-note">
              {remembered
                ? "Kept on this phone · one-tap check-in next time"
                : "Kept on this phone after check-in"}
              {" · cleared from Club"}
            </span>
            {remembered && (
              <button className="bk-link" onClick={forgetDocument}>
                Forget
              </button>
            )}
          </div>
        </div>

        <div className="bk-card">
          <div className="bk-step" data-done="true"><b>3</b><span>Bags</span></div>
          <div className="bk-row" data-static="true" data-stack="true">
            <span className="bk-row-k">Included in your fare</span>
            <span className="bk-row-v">
              {baggageFor(cabinClass, familyFor(cabinClass, chosenFamily), Boolean(member?.cardHolder))}
            </span>
          </div>
          <div className="bk-seg" ref={bagRow}>
            {bagThumb && (
              <span
                className="bk-thumb"
                aria-hidden="true"
                style={{
                  transform: `translate(${bagThumb.x}px, ${bagThumb.y}px)`,
                  width: bagThumb.w,
                  height: bagThumb.h,
                }}
              />
            )}
            {[0, 1, 2].map((n) => (
              <button
                key={n}
                className="bk-seg-b"
                data-on={extraBags === n}
                disabled={bagsShut && n > 0}
                onClick={() => setExtraBags(n)}
              >
                {n === 0 ? "No extra" : `+${n} bag${n > 1 ? "s" : ""}`}
                {n > 0 && (
                  <span className="bk-seg-sub">{money(n * EXTRA_BAG)}</span>
                )}
              </button>
            ))}
          </div>
          {/* The deadline that actually catches people out. It is an hour on
              a long flight and forty-five minutes on a short one, and it is
              nowhere on a screen that is otherwise all about bags. */}
          <p className="bk-note">
            {bagsShut ? "Bag drop closed at " : "Bag drop closes "}{" "}
            <b>
              {atAirport(
                bagDropClosesUtc(selected.departureUtc, long),
                selected.from,
              )}
            </b>{" "}
            at {selected.from.iata}.
            {bagsShut && " A bag can only go in the cabin from here."}
          </p>
          {extraBags > milesBags && (
            <p className="bk-note">
              {money((extraBags - milesBags) * EXTRA_BAG)} charged to{" "}
              {savedCard
                ? `${savedCard.brand} ending ${savedCard.last4}`
                : "the card on file"}
              {milesBags > 0 && ` · ${milesBags} on miles`}
            </p>
          )}
          {extraBags > 0 && extraBags <= milesBags && (
            <p className="bk-note">
              {milesBags} bag{milesBags > 1 ? "s" : ""} on miles · nothing charged
            </p>
          )}
        </div>

        <div className="bk-card">
          <div className="bk-step" data-done={declared === false}><b>4</b><span>Restricted items</span></div>
          <p className="bk-note" data-lead="true">
            None of these may travel, in the cabin or in the hold:
          </p>
          {/* Five things, as five things. A bulleted list of five phrases is
              read as a paragraph and answered without being read. */}
          <div className="bk-banned">
            {RESTRICTED.map((r) => (
              <span className="bk-banned-i" key={r}>
                <Restricted size={14} />
                {r}
              </span>
            ))}
          </div>
          <div className="bk-choice" ref={goodsRow}>
            {goodsThumb && (
              <span
                className="bk-thumb"
                aria-hidden="true"
                style={{
                  transform: `translate(${goodsThumb.x}px, ${goodsThumb.y}px)`,
                  width: goodsThumb.w,
                  height: goodsThumb.h,
                }}
              />
            )}
            <button
              className="bk-choice-b"
              data-on={declared === false}
              onClick={() => setDeclared(false)}
            >
              <span>I am not carrying any of these</span>
            </button>
            <button
              className="bk-choice-b"
              data-on={declared === true}
              onClick={() => setDeclared(true)}
            >
              <span>I am carrying one or more</span>
            </button>
          </div>
        </div>

        {declared === true && (
          <div className="bk-notice" data-tone="warn">
            <b>No pass can be issued.</b> Speak to an agent before the gate.
          </div>
        )}

        {/* A disabled button with no reason next to it is a dead end. Say what
            is still missing, in the order the cards above ask for it. */}
        {missing.length > 0 && (
          <p className="bk-note">Still needed · {missing.join(" · ")}</p>
        )}
      </div>

      <div className="bk-act">
        <button
          className="bk-btn"
          disabled={missing.length > 0 || issuing}
          onClick={() => setIssuing(true)}
        >
          {segments.length > 1 ? "Check in for both flights" : "Check in"}
        </button>
      </div>

      {issuing && (
        <div className="bk-issue" role="status" aria-live="polite">
          <Arc
            className="bk-issue-arc"
            from={selected.from}
            to={last!.to}
            width={300}
            height={120}
            animate
            departUtc={selected.departureUtc}
            minutes={blockMin}
          />
          <div className="bk-issue-said">
            <b>You are checked in</b>
            <span>
              {selected.from.iata} → {last!.to.iata} · seat{" "}
              {segments[0].seats.filter(Boolean).join(" · ")}
            </span>
            {/* The hour you land into, at the place you land in. It costs
                nothing to know and it is the first thing anybody says to you
                when you get there. */}
            <i>{greeting(arriveHour)} in {last!.to.city.en}</i>
            {skyStart !== skyEnd && (
              <em>
                {skyEnd === "night"
                  ? "You fly into the night"
                  : skyStart === "night"
                    ? "You come out of the dark on the other side"
                    : skyEnd === "twilight"
                      ? "You land as the light goes"
                      : "You land into the daylight"}
              </em>
            )}
          </div>
        </div>
      )}
    </>
  );
}
