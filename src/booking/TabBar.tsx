import { useRef } from "react";
import { useThumb } from "./useThumb";
import { useBooking } from "./store";
import type { Step } from "./types";
import { todaysLeg } from "./screens/Today";
import { useMinute } from "./clock";

/**
 * Three places, floating.
 *
 * Not a bar welded across the bottom edge: a capsule lifted off it, with the
 * screen running underneath and through it. That is what the current iOS
 * does, and it is the right shape here for one concrete reason — the glass is
 * 844 tall with a fixed action bar already living at the bottom, and a second
 * opaque bar under the first would take a fifth of the screen and give the
 * navigation the same weight as the thing being done.
 */
const TABS: Array<[Step, string, string, boolean]> = [
  // A path each, drawn rather than fetched: four icons is not a font. The
  // last flag is whether the glyph is a filled shape or a stroked one.
  // A magnifier, because the tab is a search: two fields and a button that
  // looks for aeroplanes. A question mark in a ring is the mark every app on
  // the phone uses for help.
  ["search", "Book", "M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13M16 16l4 4", false],
  // The aeroplane, nose up, for the day you are on one.
  [
    "today",
    "Travel",
    "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-4.5z",
    true,
  ],
  ["booked", "Trips", "M3 7h18v13H3zM8 7V4h8v3", false],
  [
    "account",
    "Club",
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21a8 8 0 0 1 16 0",
    false,
  ],
];

/**
 * A pushed page keeps the tab it was pushed from.
 *
 * The trip is opened out of Trips and carries the tabs, the way a pushed
 * screen does on a phone. Without this no tab was the one you were on: the
 * capsule stayed dark where it had last been left, with a grey label sitting
 * on top of it, and the row stopped saying where you were.
 */
const PUSHED: Partial<Record<Step, Step>> = { trip: "booked" };

export function TabBar() {
  const step = useBooking((s) => s.step);
  const go = useBooking((s) => s.go);
  const pnr = useBooking((s) => s.pnr);
  const trip = useBooking((s) => s.trip);
  const openTrip = useBooking((s) => s.openTrip);
  const legs = useBooking((s) => s.legs);
  const hasTrip = Boolean(pnr || trip);

  /**
   * A fourth place, and only on the day.
   *
   * Every airline grows one — Delta's Today, American's day-of card — because
   * the day you fly is not the same task as the trip you booked, and burying
   * it two taps inside Trips is how somebody misses a gate. It appears at
   * check-in or a few hours out, and it goes again once the aeroplane has
   * landed and been forgotten about.
   */
  const today = Boolean(todaysLeg(legs, useMinute()));

  /**
   * The dark pill is one object that moves, not three that light up.
   *
   * Three backgrounds toggling is three things happening; a single indicator
   * sliding from one tab to the next is the thing a phone does, and it is the
   * difference between a set of buttons and a control. It is measured from
   * the button rather than guessed at, so it survives a label changing width.
   */
  const bar = useRef<HTMLElement>(null);
  const ind = useThumb(bar, [step, hasTrip, today]);

  return (
    <nav className="bk-tabs" aria-label="Sections" ref={bar} data-wide={today}>
      {ind && (
        <span
          className="bk-tab-ind"
          aria-hidden="true"
          style={{ transform: `translateX(${ind.x}px)`, width: ind.w }}
        />
      )}
      {TABS.filter(([to]) => to !== "today" || today).map(([to, label, d, solid]) => (
        <button
          key={to}
          className="bk-tab"
          data-on={(PUSHED[step] ?? step) === to}
          // Named as well as written: the word is drawn beside the glyph, but
          // a button whose accessible name comes from a decorative path is a
          // button a screen reader has to guess at.
          aria-label={label}
          // Trips with nothing in it is not a place to be sent to; the tab
          // says so by being unavailable rather than by opening an apology.
          disabled={to === "booked" && !hasTrip}
          onClick={() => {
            if (to === "booked" && !pnr && trip) return openTrip("out");
            go(to);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={d}
              fill={solid ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={solid ? 0 : 1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="bk-tab-l">{label}</span>
        </button>
      ))}
    </nav>
  );
}
