/**
 * The four marks the chrome is made of, drawn rather than typed.
 *
 * They were characters — ←, ✕, ⇄, › — set in whatever the interface font
 * happened to have at that codepoint, which is a different weight from every
 * other stroke on the screen and a different size in every browser. A chevron
 * beside a row of 12px type and a chevron in a 44px key were the same glyph at
 * two sizes with no way to make either of them right.
 *
 * One stroke width, one cap, one set of proportions, and they scale with the
 * type around them because the box is in ems.
 */
const BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function Back({ size = 20 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function Close({ size = 18 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Swap({ size = 18 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M4 9h13l-3.5-3.5M20 15H7l3.5 3.5" />
    </svg>
  );
}

/** The mark at the end of a row that opens something. */
export function Go({ size = 15 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M9.5 5 16 12l-6.5 7" />
    </svg>
  );
}

/**
 * The marks a fare is described with.
 *
 * They were two Unicode characters in a `::before` — ✓ and ✕ — which is the
 * same mistake the chrome made: a glyph from whatever font happened to have
 * that codepoint, at a weight nothing else on the screen shares. A tick that
 * means "included" is not typography, it is a mark, and it should be drawn
 * with the same pen as the chevrons.
 */
export function Tick({ size = 15 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2.4}>
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  );
}

export function Cross({ size = 15 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2.2}>
      <path d="M7 7l10 10M17 7 7 17" />
    </svg>
  );
}

/** A seat, from the side, the way a cabin plan draws one. */
export function Seat({ size = 15 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M7 4v9h8M7 17h11M7 13a3 3 0 0 0 3 3" />
      <path d="M18 13v7" />
    </svg>
  );
}

/** Something that must not travel. */
export function Restricted({ size = 15 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <circle cx="12" cy="12" r="8" />
      <path d="M6.5 6.5 17.5 17.5" />
    </svg>
  );
}

/**
 * The third answer.
 *
 * A fare term is included, missing, or available for money — and the third
 * one was a little amber capsule reading FEE, which is a chip in a column of
 * drawn marks. A plus is the mark for "you can add this", in the same pen and
 * the same 24-unit box as the tick and the cross.
 */
export function Plus({ size = 15 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2.2}>
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

/** A magnifier, for the one field in the app that searches something. */
export function Search({ size = 17 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

/** The aeroplane that marks a place you can fly to, as an airline's own list
 *  of cities marks them. */
export function Plane({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path
        d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-4.5z"
        fill="currentColor"
        strokeWidth={0}
      />
    </svg>
  );
}

/**
 * The airline's mark: the strata the airline is named after.
 *
 * Three bars, the ground longest and the air above it thinning out — a
 * horizon with the layers over it. The first attempt was a cabin window with
 * a sun in it, which at seventeen pixels in a title bar is a rounded
 * rectangle with a disc inside: the same shape as the person on the Club tab,
 * two rows down. A mark that can be mistaken for another glyph in the same
 * app is not a mark.
 */
export function Mark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="2" y="16.5" width="20" height="3" rx="1.5" fill="currentColor" />
      <rect
        x="2"
        y="10.5"
        width="13.5"
        height="3"
        rx="1.5"
        fill="currentColor"
        opacity="0.72"
      />
      <rect
        x="2"
        y="4.5"
        width="7"
        height="3"
        rx="1.5"
        fill="currentColor"
        opacity="0.44"
      />
    </svg>
  );
}

/** A checked bag, for the one row of this app that is about the hold. */
export function Bag({ size = 18 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <rect x="4" y="7" width="16" height="13" rx="2.5" />
      <path d="M9 7V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V7" />
    </svg>
  );
}

/** The code, drawn small enough to sit inside a key. */
export function Code({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M3 3h7v7H3zm2 2v3h3V5zM14 3h7v7h-7zm2 2v3h3V5zM3 14h7v7H3zm2 2v3h3v-3z" />
      <path d="M14 14h3v3h-3zM18 14h3v2h-3zM18 17h2v2h-2zM14 18h3v3h-3zM19 19h2v2h-2z" />
    </svg>
  );
}

/** Everything else. Three dots, which is what a row of tools calls the rest
 *  of itself when it has run out of room. */
export function More({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <circle cx="5" cy="12" r="1.9" />
      <circle cx="12" cy="12" r="1.9" />
      <circle cx="19" cy="12" r="1.9" />
    </svg>
  );
}

/** Coming down: the mark for the far end of a flight. A chevron on its own
 *  said "next", which on a row of tools about one flight means nothing. */
export function Land({ size = 20 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M3 21h18" />
      <path
        d="M4.6 15.5 3.2 11l2-.5 1.9 2 4.1-1.1-3.1-5.6 2.2-.6 5 5.1 4.3-1.1a1.6 1.6 0 0 1 .8 3.1z"
        fill="currentColor"
        strokeWidth={0}
      />
    </svg>
  );
}

/** A tray with a cup on it, for what is served on board. */
export function Meal({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M3 17.5h18" />
      <path d="M5 17.5a7 7 0 0 1 14 0" />
      <path d="M12 10.5V8.5" />
    </svg>
  );
}

/** A clock, for the one fact on an arrival screen that is not a number of
 *  minutes: what o'clock it is where you are landing. */
export function Clock({ size = 18 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

/** A terminal building, seen from the apron: a long shed with a tower. */
export function Terminal({ size = 18 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M3 20h18" />
      <path d="M5 20v-7.5a7 7 0 0 1 14 0V20" />
      <path d="M12 5.5V3" />
    </svg>
  );
}

/** The booklet a border wants. */
export function Passport({ size = 18 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M9.5 16.5h5" />
    </svg>
  );
}
