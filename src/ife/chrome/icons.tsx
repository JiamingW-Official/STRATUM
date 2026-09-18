/**
 * The cabin's own pictograms.
 *
 * One construction for the whole rail, and it is solid: filled shapes on one
 * grid at one size, with no strokes anywhere in the set. That is what keeps
 * the weight consistent — a set that mixes fills with strokes has no single
 * number describing how heavy it is, which was the fault in the version
 * before the last one. Going solid keeps that property and reads harder
 * across a dark cabin, which is what the placards above a seat do.
 *
 * Where a filled shape would lose its meaning — a globe is only a globe
 * because of its meridians — the detail is punched out of the solid with
 * evenodd rather than drawn on top of it. That is how a stencil works, and it
 * means the mark has one colour and no hairlines to thin out at size.
 *
 * Content icons, further down, stay stroked: they sit at 96px inside a card,
 * where a placard weight shouts.
 */
type P = { size?: number };

const line = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  // One weight for the whole set. Heavier than an icon library's default,
  // because a cabin is dark and a seat-back screen is at arm's length.
  strokeWidth: 2.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
});

/* ── Rail: solid ────────────────────────────────────────────────────────── */

const fill = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true as const,
});

export const IconHome = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path
      d="M12 2.9 2.3 11.2l1.5 1.7 1.2-1v9.2h5.3v-5.7h3.4v5.7h5.3v-9.2l1.2 1 1.5-1.7z"
      fillRule="evenodd"
    />
  </svg>
);

/**
 * The flight map, as the aircraft the map itself draws, seen from above. The
 * button and the thing it opens are one mark, which leaves the globe free to
 * mean language.
 */
export const IconPlan = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M12 2.5c.78 0 1.36.64 1.42 1.48l.3 4.86 7.88 4.56v2.04l-7.88-2.14-.36 3.82 2.44 1.9v1.52L12 19.6l-3.8 1.04v-1.52l2.44-1.9-.36-3.82L2.4 15.54V13.5l7.88-4.56.3-4.86C10.64 3.14 11.22 2.5 12 2.5z" />
  </svg>
);

/**
 * Language: a globe. An ordinary one.
 *
 * Three attempts to make this solid failed in three different ways — a lens
 * built from smooth curves that even-odd filled as a positive shape, then the
 * same again, then straight bands that punched cleanly and read as a gridded
 * ball rather than a world. The lesson is that a globe is a line drawing: it
 * is only a globe because of the curve of its equator and the curve of one
 * meridian, and a fill cannot carry a curve that thin. So this one is drawn,
 * at the same weight as the content icons, and it is the one mark in the rail
 * that is not solid — because being legible beats being consistent with a
 * rule that was mine and not the passenger's.
 */
export const IconLang = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <ellipse cx="12" cy="12" rx="4.1" ry="9" />
  </svg>
);

export const IconVolume = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M3.6 8.9h3.4L11.9 4.6v14.8L7 15.1H3.6a.9.9 0 0 1-.9-.9V9.8a.9.9 0 0 1 .9-.9z" />
    <path d="M14.3 8.2a5.6 5.6 0 0 1 0 7.6l1.5 1.5a7.7 7.7 0 0 0 0-10.6z" />
    <path d="M17.7 4.6a10.6 10.6 0 0 1 0 14.8l1.5 1.5a12.7 12.7 0 0 0 0-17.8z" />
  </svg>
);

/** The reading light: a bulb, the ordinary kind, and nothing else. */
export const IconLight = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M12 2.6a6 6 0 0 0-3.7 10.72c.78.6 1.2 1.3 1.32 2.18h4.76c.12-.88.54-1.58 1.32-2.18A6 6 0 0 0 12 2.6z" />
    <path d="M9.5 17.2h5v1.9h-5zM10.3 20.4h3.4v1.5h-3.4z" />
  </svg>
);

/** The attendant call: the figure. It had a raised arm, which was a second
 *  idea in a mark that only needs one. */
export const IconCall = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <circle cx="12" cy="6.3" r="3.1" />
    <path d="M5.9 21.4v-4.9a6.1 6.1 0 0 1 12.2 0v4.9z" />
  </svg>
);

/** The index. Three bars, which is the one icon nobody has ever had to learn. */
export const IconMenu = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M3.4 5.4h17.2v2.1H3.4zM3.4 10.9h17.2V13H3.4zM3.4 16.4h17.2v2.1H3.4z" />
  </svg>
);

export const IconBack = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M15 5 8 12l7 7" />
  </svg>
);

/* ── Content icons, at card size ───────────────────────────────────────── */

/** Flight map, on a card. The same aircraft as the rail's, so one mark means
 *  one thing wherever it appears — and the globe is language's alone. */
export const IconMap = IconPlan;

export const IconGauge = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M4 17a8 8 0 1 1 16 0" />
    <path d="m12 17 4.2-5" />
    <circle cx="12" cy="17" r="1.1" />
  </svg>
);

export const IconMusic = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M9 17.5V6.2l10-1.7v11" />
    <circle cx="6.6" cy="17.6" r="2.4" />
    <circle cx="16.6" cy="15.6" r="2.4" />
  </svg>
);

export const IconFilm = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3 8.6h2.6M3 12h2.6M3 15.4h2.6M18.4 8.6H21M18.4 12H21M18.4 15.4H21" />
    <path d="M8.2 5v14M15.8 5v14" />
  </svg>
);

export const IconGames = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 5.4l-.5 2.4A2.6 2.6 0 0 1 16 16.6L15 15H9l-1 1.6a2.6 2.6 0 0 1-4.4-.8l-.5-2.4A4.5 4.5 0 0 1 7.5 8z" />
    <path d="M7.4 10.6v2.2M6.3 11.7h2.2" />
    <circle cx="15.6" cy="11.3" r=".9" />
    <circle cx="17.4" cy="13" r=".9" />
  </svg>
);

/** The sky view: an aircraft seen from below with the ring of a receiver's
 *  reach around it. */
export const IconSky = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M12 3.6 12.8 9l5.4 3v1.4l-5.4-1.5-.3 3.4 2 1.4v1l-2.5-.8-2.5.8v-1l2-1.4-.3-3.4L5.8 13.4V12l5.4-3z" />
    <path d="M3.4 18.6c2.4 1.5 5.4 2.3 8.6 2.3s6.2-.8 8.6-2.3" strokeDasharray="3 3" />
  </svg>
);
