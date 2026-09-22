import { useEffect, useState, useRef } from "react";
import { useBooking } from "../store";
import { useThumb } from "../useThumb";
import { ifeUrlFor } from "../bcbp";
import { atAirport, dayAt, money } from "../format";
import {
  EXTRA_BAG,
  baggageFor,
  cabinName,
  disruptionFor,
  familyFor,
  gateChangeFor,
} from "../schedule";
import { Qr } from "../QrCode";
import { Mark } from "../icons";
import { SkyRule } from "../Strata";
import { tierOf } from "../member";

/** Whole minutes to an instant, as a person would say them. */
function until(ms: number): string {
  const m = Math.round(ms / 60000);
  if (m <= 0) return "now";
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

/**
 * The pass, and the only screen here that is a document rather than a form.
 *
 * It is built the way a printed one is: an airline's band across the top, the
 * code in the middle of the paper, and the four things a gate agent reads
 * under a tear line. What the code carries is a link, and the link carries the
 * pass — the sixty characters under the code are the same characters a gate
 * reader would get, riding in the query string. So it scans two ways: a phone
 * camera opens the seat-back screen belonging to this seat, and anything that
 * knows Resolution 792 can still read the pass out of it.
 */
export function Boarding() {
  const passLeg = useBooking((s) => s.passLeg);
  const legs = useBooking((s) => s.legs);
  const passIndex = useBooking((s) => s.passIndex);
  const setPassIndex = useBooking((s) => s.setPassIndex);
  const passSeg = useBooking((s) => s.passSeg);
  const setPassSeg = useBooking((s) => s.setPassSeg);
  const current = legs[passLeg];
  const segs = current?.segments ?? [];
  const passes = segs[passSeg]?.passes ?? [];
  const segRow = useRef<HTMLDivElement>(null);
  const segThumb = useThumb(segRow, [passSeg, segs.length]);
  const whoRow = useRef<HTMLDivElement>(null);
  const whoThumb = useThumb(whoRow, [passIndex, passes.length]);
  const pass = passes[passIndex] ?? null;
  const selected = segs[passSeg]?.option ?? null;
  const hasReturn = Boolean(legs.back);
  const extraBags = useBooking((s) => s.extraBags);

  const cabinClass = useBooking((s) => s.cabinClass);
  const chosenFamily = useBooking((s) => s.fareFamily);
  const member = useBooking((s) => s.member);
  // The one thing a gate makes everybody do: hold the code up to a reader,
  // usually in sunlight, usually while somebody waits. Tapping it fills the
  // glass with it. That is a real action on a real boarding pass and it is
  // the only one this screen needs.
  const [full, setFull] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!pass || !selected) return null;

  const d = disruptionFor(pass.flightNo, pass.departureUtc, now);
  const slip = d.status === "delayed" ? d.minutes * 60000 : 0;
  const newGate = gateChangeFor(
    pass.flightNo,
    pass.departureUtc,
    pass.gate,
    now,
  );
  const gate = newGate ?? pass.gate;
  const boardsUtc = new Date(Date.parse(pass.boardingUtc) + slip).toISOString();
  const left = Date.parse(boardsUtc) - now;
  const boarding = left <= 0 && d.status !== "cancelled";
  // Which group is at the door. An aeroplane boards in order and about four
  // minutes apart, which is why "Boarding now" on its own is the one thing a
  // gate screen never says — you want to know whether it is your turn.
  const calling = Math.min(9, 1 + Math.floor(-left / (4 * 60000)));

  const origin = typeof window === "undefined" ? "" : window.location.origin;
  // What this seat is allowed to learn: the card it flies on, and the one row
  // of the destination's departure board that belongs to it.
  const onwardSeg = segs[passSeg + 1]?.option;
  const url = ifeUrlFor(pass, origin, extraBags, {
    tier: tierOf(member?.miles ?? 0),
    onward: onwardSeg
      ? {
          flightNo: onwardSeg.flightNo,
          toIata: onwardSeg.to.iata,
          departsUtc: onwardSeg.departureUtc,
        }
      : undefined,
  });

  return (
    <>
      <div className="bk-body">
        {/* The line a passenger reads twenty times between the lounge and the
            gate, at the top where it is read from. It is the same figure the
            island is carrying, because it is the same fact. */}
        <div className="bk-live" data-kind={d.status}>
          <span
            className="bk-live-dot"
            data-boarding={boarding}
            data-kind={d.status}
          />
          <span className="bk-live-k">
            {d.status === "cancelled"
              ? "Flight cancelled"
              : boarding
                ? calling >= pass.zone
                  ? `Group ${pass.zone} is boarding`
                  : `Group ${calling} is boarding`
                : `Boards in ${until(left)}`}
          </span>
          <span className="bk-live-v">
            Gate <b data-changed={Boolean(newGate)}>{gate}</b> ·{" "}
            {d.status === "cancelled"
              ? d.reason
              : d.status === "delayed"
                ? `Delayed ${until(d.minutes * 60000)}`
                : boarding
                  ? calling >= pass.zone
                    ? "Your turn"
                    : `You are group ${pass.zone}`
                  : "On time"}
          </span>
        </div>

        {/* Why, and what it means for the gate. The strip says what; a
            passenger standing in a terminal wants the rest. */}
        {(d.status !== "onTime" || newGate) && (
          <div
            className="bk-notice"
            data-tone={d.status === "cancelled" ? "warn" : undefined}
          >
            {d.status === "delayed" && (
              <span>
                <b>Boards {atAirport(boardsUtc, selected.from)}</b> · {d.reason}
                · seat and bags unchanged
              </span>
            )}
            {d.status === "cancelled" && (
              <span>
                <b>This flight is not operating.</b> {d.reason}. Speak to an
                agent — this pass will not be accepted at the gate.
              </span>
            )}
            {d.status === "onTime" && newGate && (
              <span>
                <b>Gate is now {newGate}</b> · the pass still prints the old
                one
              </span>
            )}
          </div>
        )}

        {/* One pass per traveller, and a way between them. A party of three
            at a gate is three codes, and the reader wants them one at a
            time. */}
        {/* A journey with a change is two passes, and the second one is what
            you are holding while you walk across the hub. */}
        {segs.length > 1 && (
          <div className="bk-pax" ref={segRow}>
            {segThumb && (
              <span
                className="bk-thumb"
                aria-hidden="true"
                style={{
                  transform: `translate(${segThumb.x}px, ${segThumb.y}px)`,
                  width: segThumb.w,
                  height: segThumb.h,
                }}
              />
            )}
            {segs.map((sg, i) => (
              <button
                key={i}
                className="bk-pax-b"
                data-on={i === passSeg}
                onClick={() => setPassSeg(i)}
              >
                <span className="bk-cap">
                  {sg.option.from.iata} → {sg.option.to.iata}
                </span>
                <b className="bk-mono">{sg.option.flightNo}</b>
              </button>
            ))}
          </div>
        )}

        {passes.length > 1 && (
          <div className="bk-pax" ref={whoRow}>
            {whoThumb && (
              <span
                className="bk-thumb"
                aria-hidden="true"
                style={{
                  transform: `translate(${whoThumb.x}px, ${whoThumb.y}px)`,
                  width: whoThumb.w,
                  height: whoThumb.h,
                }}
              />
            )}
            {passes.map((x, i) => (
              <button
                key={i}
                className="bk-pax-b"
                data-on={i === passIndex}
                onClick={() => setPassIndex(i)}
              >
                <span className="bk-cap">
                  {x.passenger.family} {x.passenger.given[0]}
                </span>
                <b className="bk-mono">{x.seat}</b>
              </button>
            ))}
          </div>
        )}

        {/* A pass for an aeroplane that is not going is not a pass. It stays
            on the screen because the booking is still real and the reference
            on it is what an agent will ask for — but it is struck through, so
            it is never held up at a gate. */}
        {/* One object, in the airline's own black.
 *
            It was a navy hat on a white card, which is a card with a header
            and not a pass. Every real one — Delta's, Emirates', Qantas' — is
            a single coloured thing with the code inset into it on white, and
            the reason is not taste: a pass is an object you hold up, and an
            object has one surface. */}
        <div className="bk-pass" data-void={d.status === "cancelled"}>
          {d.status === "cancelled" && (
            <div className="bk-void">Not valid for boarding</div>
          )}

          <div className="bk-pass-top">
            <span className="bk-pass-mark">
              <Mark size={20} />
            </span>
            <span className="bk-pass-no">
              <b className="bk-mono">{pass.flightNo}</b>
              <i>
                {hasReturn && (passLeg === "out" ? "Departing · " : "Returning · ")}
                {segs.length > 1 && `Flight ${passSeg + 1} of ${segs.length} · `}
                {dayAt(pass.departureUtc, selected.from)}
              </i>
            </span>
          </div>

          <div className="bk-pass-ports">
            <span className="bk-pass-port">
              <b>{pass.fromIata}</b>
              <i>{atAirport(pass.departureUtc, selected.from)}</i>
            </span>
            {/* The sky you cross, between the two codes: the light over the
                airport you leave at the hour you leave it, the light over
                the one you land at when you land. It was a hairline with an
                arrowhead on it, which told a passenger holding a pass for a
                flight into the dark exactly nothing. */}
            <span className="bk-pass-line">
              <SkyRule
                from={selected.from}
                to={selected.to}
                at={Date.parse(pass.departureUtc)}
                toAt={Date.parse(selected.arrivalUtc)}
              />
            </span>
            <span className="bk-pass-port" data-align="end">
              <b>{pass.toIata}</b>
              <i>{atAirport(selected.arrivalUtc, selected.to)}</i>
            </span>
          </div>

          <div className="bk-pass-name">
            <span>
              {pass.passenger.family} / {pass.passenger.given}
            </span>
            <span className="bk-pass-cabin">
              {cabinName(pass.cabinClass)}
            </span>
          </div>

          {/* The four a gate reads, across the pass in the order it reads
              them. */}
          <div className="bk-pass-facts">
            <div>
              <dt>Seat</dt>
              <dd>{pass.seat}</dd>
            </div>
            <div>
              <dt>Gate</dt>
              <dd data-changed={Boolean(newGate)}>{gate}</dd>
            </div>
            <div>
              <dt>Group</dt>
              <dd data-brass="true">{pass.zone}</dd>
            </div>
            <div>
              <dt>Boards</dt>
              <dd data-changed={slip > 0}>
                {atAirport(boardsUtc, selected.from)}
              </dd>
            </div>
          </div>

          {/* The code, inset on white: a reader wants paper-white behind it,
              and a black card with a white tile in it is what every airline
              settled on for exactly that reason. */}
          <div
            className="bk-plate"
            role="button"
            tabIndex={0}
            onClick={() => setFull(true)}
            onKeyDown={(e) => e.key === "Enter" && setFull(true)}
            aria-label="Show the code full screen"
          >
            <Qr text={url} title={`Boarding pass for seat ${pass.seat}`} />
          </div>

          {/* The sixty raw BCBP characters used to be printed under the
              code, at nine pixels, because that is the only size sixty
              characters fit at. They are the same sixty characters the code
              above already carries, nobody reads them, and they were the one
              thing on this screen that could not exist at a legible size —
              which is the argument against them, not for a smaller font. */}

          <div className="bk-pass-foot">
            <div>
              <dt>Terminal</dt>
              <dd>{pass.terminal}</dd>
            </div>
            <div>
              <dt>Seq</dt>
              <dd>{String(pass.sequence).padStart(4, "0")}</dd>
            </div>
            <div>
              <dt>Ref</dt>
              <dd>{pass.pnr}</dd>
            </div>
            <div data-wide="true">
              <dt>Bags</dt>
              <dd>
                {baggageFor(cabinClass, familyFor(cabinClass, chosenFamily))}
                {extraBags > 0 &&
                  ` · +${extraBags} paid, ${money(extraBags * EXTRA_BAG)}`}
              </dd>
            </div>
          </div>
        </div>

        <p className="bk-note">Tap the code to fill the screen</p>
      </div>

      {full && (
        <div
          className="bk-full"
          role="button"
          tabIndex={0}
          onClick={() => setFull(false)}
          onKeyDown={(e) => e.key === "Escape" && setFull(false)}
          aria-label="Hide the full screen code"
        >
          <Qr text={url} title={`Boarding pass for seat ${pass.seat}`} />
          <span className="bk-full-cap">
            {pass.flightNo} · {pass.seat} · gate {pass.gate}
          </span>
        </div>
      )}

      <div className="bk-act">
        <a className="bk-btn" href={url}>
          Open seat {pass.seat}
        </a>
      </div>
    </>
  );
}
