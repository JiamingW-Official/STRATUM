import { useMemo, useState, useRef } from "react";
import { useBooking } from "./store";
import { useThumb } from "./useThumb";
import { Close } from "./icons";
import { money } from "./format";
import { AIRPORTS } from "../flight-state/airports";
import { HUBS, familyFor, priceOf, searchFlights } from "./schedule";

// A calendar with fares on it.
//
// The two date fields were `<input type="date">`, which is the most obviously
// unconsidered control a booking form can have: it renders as 09/19/2026 with
// a little grey glyph, it says nothing about what any day costs, and it cannot
// express the one thing a return booking is — a span between two days.
//
// What every airline puts here instead is a month grid with a price under each
// number, because the question is never "what is the date" but "which of these
// days is cheap enough". So the prices are real, computed from the same
// timetable the fare list reads, and the cheapest few in view are marked.
// Picking a departure hands you straight to picking the return, and the days
// between them are drawn as the span they are.

const MONTHS = 4;
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const DAY = 86400000;
/** Midday UTC, so a day is never nudged over a boundary by a time zone. */
const noon = (d: string) => new Date(`${d}T12:00:00Z`).getTime();

export function DateSheet({ onClose }: { onClose: () => void }) {
  const query = useBooking((s) => s.query);
  const setQuery = useBooking((s) => s.setQuery);
  const cabinClass = useBooking((s) => s.cabinClass);
  const chosenFamily = useBooking((s) => s.fareFamily);
  const family = familyFor(cabinClass, chosenFamily);
  const isReturn = query.returnDate !== null;

  // Which half is being chosen. Opening on the departure is right even when
  // both are already set: changing the outbound is the common edit, and a
  // picker that starts on the return makes you undo something to get there.
  const [mode, setMode] = useState<"depart" | "return">("depart");
  const modeRow = useRef<HTMLDivElement>(null);
  const modeThumb = useThumb(modeRow, [mode, isReturn]);

  const today = iso(Date.now());
  const start = noon(today);

  const days = useMemo(() => {
    const out: Array<{ date: string; t: number; price: number | null }> = [];
    const first = new Date(start);
    const end = new Date(
      Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + MONTHS, 1, 12),
    ).getTime();
    // On the way home the prices are the other direction's, and no day before
    // the outbound lands can be offered at all.
    const back = mode === "return";
    const floor = back && query.date ? noon(query.date) : start;
    for (let t = start; t < end; t += DAY) {
      const date = iso(t);
      if (t < floor) {
        out.push({ date, t, price: null });
        continue;
      }
      const flights = searchFlights(
        back
          ? { ...query, fromIata: query.toIata, toIata: query.fromIata, date }
          : { ...query, date },
      );
      out.push({
        date,
        t,
        price: flights.length
          ? Math.min(...flights.map((f) => priceOf(f, cabinClass, family).total))
          : null,
      });
    }
    return out;
  }, [start, mode, query, cabinClass, family]);

  const depart = query.date;
  const back = query.returnDate;

  /** The cheapest seat on one day, in one direction. Two lookups, so the bar
   *  at the bottom can add the trip up rather than describe it. */
  const priceOn = (date: string | null, inbound: boolean): number | null => {
    if (!date) return null;
    const found = searchFlights(
      inbound
        ? { ...query, fromIata: query.toIata, toIata: query.fromIata, date }
        : { ...query, date },
    );
    return found.length
      ? Math.min(...found.map((f) => priceOf(f, cabinClass, family).total))
      : null;
  };
  const outPrice = priceOn(depart, false);
  const backPrice = isReturn ? priceOn(back, true) : null;
  const nights =
    isReturn && back ? Math.round((noon(back) - noon(depart)) / DAY) : 0;

  const pick = (date: string) => {
    if (mode === "depart") {
      setQuery({
        date,
        // A return that is now before the departure is not a return.
        returnDate: isReturn && back && back < date ? date : back,
      });
      if (isReturn) setMode("return");
      else onClose();
      return;
    }
    // No closing on the way out of the return: with two dates chosen there is
    // a span to look at, and a calendar that shuts the moment the second one
    // is tapped is a calendar you have to reopen to check what you did.
    setQuery({ returnDate: date });
  };

  // One grid per month, each starting on the right weekday.
  const months: Array<{
    label: string;
    cheap: number;
    from: number;
    cells: Array<null | (typeof days)[number]>;
  }> = [];
  for (const d of days) {
    const date = new Date(d.t);
    const label = new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
    let m = months[months.length - 1];
    if (!m || m.label !== label) {
      // Monday-first, which is what the weekday row above says.
      const lead = (date.getUTCDay() + 6) % 7;
      m = {
        label,
        cheap: 0,
        from: 0,
        cells: Array.from({ length: lead }, () => null),
      };
      months.push(m);
    }
    m.cells.push(d);
  }

  // The cheapest few days in each month, not in the whole range. Four months
  // out the fares are lower everywhere, so a single threshold over the lot put
  // every green day off the bottom of the screen and marked nothing at all in
  // the month anybody was looking at. What a calendar is being asked is
  // "which of these days" — and "these" means the ones in view.
  for (const m of months) {
    const p = m.cells
      .map((c) => c?.price)
      .filter((x): x is number => typeof x === "number")
      .sort((a, b) => a - b);
    m.cheap = p.length ? p[Math.min(p.length - 1, Math.max(0, Math.ceil(p.length * 0.15) - 1))] : 0;
    m.from = p.length ? p[0] : 0;
  }

  return (
    <div className="bk-sheet">
      <div className="bk-sheet-head">
        <span>{mode === "depart" ? "Choose a departure" : "Choose a return"}</span>
        <button className="bk-bar-end" onClick={onClose} aria-label="Close">
          <Close />
        </button>
      </div>

      <div className="bk-cal">
        <div className="bk-cal-bar" ref={modeRow}>
          {modeThumb && (
              <span
                className="bk-thumb"
                aria-hidden="true"
                style={{
                  transform: `translate(${modeThumb.x}px, ${modeThumb.y}px)`,
                  width: modeThumb.w,
                  height: modeThumb.h,
                }}
              />
            )}
          <button
            className="bk-cal-tab"
            data-on={mode === "depart"}
            onClick={() => setMode("depart")}
          >
            <span className="bk-label">Departing</span>
            <b>{pretty(depart)}</b>
          </button>
          {isReturn && (
            <button
              className="bk-cal-tab"
              data-on={mode === "return"}
              onClick={() => setMode("return")}
            >
              <span className="bk-label">Returning</span>
              <b>{back ? pretty(back) : "Choose"}</b>
            </button>
          )}
        </div>

        <div className="bk-cal-week">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        {/* Every day grey and no reason given is a calendar that looks
            broken. It is not broken: the airline does not fly the pair. */}
        {months.every((m) => m.from === 0) && (
          <p className="bk-cal-none">
            STRATUM does not fly {query.fromIata} to {query.toIata}. Every
            route it flies touches{" "}
            {HUBS.map((h) => AIRPORTS[h].city.en).join(" or ")}.
          </p>
        )}

        <div className="bk-cal-scroll">
          {months.map((m) => (
            <section key={m.label} className="bk-cal-month">
              <h3>
                <span>{m.label}</span>
                {m.from > 0 && <b>from {money(m.from)}</b>}
              </h3>
              <div className="bk-cal-grid">
                {m.cells.map((c, i) =>
                  c === null ? (
                    <span key={`pad-${i}`} />
                  ) : (
                    <button
                      key={c.date}
                      className="bk-cal-day"
                      disabled={c.price === null}
                      data-on={c.date === depart || c.date === back}
                      data-edge={
                        isReturn && back && c.date === depart
                          ? "start"
                          : isReturn && back && c.date === back
                            ? "end"
                            : undefined
                      }
                      data-span={Boolean(
                        isReturn && back && c.date > depart && c.date < back,
                      )}
                      data-cheap={c.price !== null && c.price <= m.cheap}
                      data-today={c.date === today}
                      onClick={() => pick(c.date)}
                    >
                      <span className="bk-cal-n">{Number(c.date.slice(8))}</span>
                      <span className="bk-cal-p">
                        {c.price === null ? "" : money(c.price)}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </section>
          ))}
          <p className="bk-cal-key">Green · cheapest day of the month</p>
        </div>
      </div>

      {/* What has been chosen, added up. A return is a span and a sum, and a
          picker that shows neither makes you close it to find out what you
          did. */}
      {isReturn && (
        <div className="bk-act">
          <div className="bk-act-sum">
            <span className="bk-cap">
              {back
                ? `${pretty(depart)} → ${pretty(back)} · ${nights} night${nights === 1 ? "" : "s"}`
                : "Choose the day you come back"}
            </span>
            <span className="bk-act-sum-v">
              {outPrice !== null && backPrice !== null
                ? `from ${money(outPrice + backPrice)}`
                : ""}
            </span>
          </div>
          <button className="bk-btn" disabled={!back} onClick={onClose}>
            {back ? "Done" : "Choose a return"}
          </button>
        </div>
      )}
    </div>
  );
}

function pretty(date: string | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(noon(date)));
}
