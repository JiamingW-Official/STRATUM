/**
 * The cabin's own pictograms.
 *
 * One construction for the whole rail: stroked, one weight, one grid, one
 * size. The set before this mixed filled shapes with stroked ones and a pair
 * of type glyphs, and a mixed set cannot have a consistent weight — there is
 * no number that a filled house and a stroked speaker share. With a single
 * stroke the weight is literally one value, which is the only way "the same
 * size and thickness" is a thing you can check rather than a thing you judge.
 *
 * The weight is heavier than an icon library's default, because these are
 * read across a dark cabin at an angle rather than on a desk.
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

/* ── Rail ───────────────────────────────────────────────────────────────── */

export const IconHome = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M3.6 10.6 12 3.4l8.4 7.2" />
    <path d="M5.7 12.4v8h12.6v-8" />
    <path d="M9.9 20.4v-5.2h4.2v5.2" />
  </svg>
);

/**
 * The flight map, as the aircraft the map itself draws. The button and the
 * thing it opens are one mark, and it leaves the globe free to mean language.
 */
export const IconPlan = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M12 3.1c.7 0 1.2.6 1.25 1.35l.27 4.5 7.08 4.1v1.6l-7.08-1.9-.33 3.4 2.2 1.7v1.25L12 18.4l-3.37.9V18l2.2-1.7-.33-3.4-7.08 1.9v-1.6l7.08-4.1.27-4.5C10.8 3.7 11.3 3.1 12 3.1z" />
  </svg>
);

/** Language. A globe, which is what every system in the world uses for it —
 *  and the map button is an aircraft now, so nothing else is claiming one. */
export const IconLang = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <circle cx="12" cy="12" r="8.7" />
    <path d="M3.3 12h17.4" />
    <path d="M12 3.3c3 3.4 3 14 0 17.4-3-3.4-3-14 0-17.4z" />
  </svg>
);

export const IconVolume = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M4 9.3h3.3L11.8 5.2v13.6L7.3 14.7H4z" />
    <path d="M15 9.4a4 4 0 0 1 0 5.2" />
    <path d="M17.8 7a7.5 7.5 0 0 1 0 10" />
  </svg>
);

/**
 * The reading light: a bulb, the ordinary kind.
 *
 * It was a lamp shade with three rays leaving it, and at rail size that read
 * as a shower head — the rays and the shade together make a spray, not a
 * light. A bulb has one silhouette everybody already knows.
 */
export const IconLight = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M12 3.2a5.6 5.6 0 0 1 3.4 10.06c-.8.62-1.25 1.4-1.35 2.34h-4.1c-.1-.94-.55-1.72-1.35-2.34A5.6 5.6 0 0 1 12 3.2z" />
    <path d="M10 18.2h4M10.7 20.8h2.6" />
  </svg>
);

/** The attendant call: a figure with a raised arm. The arm is the meaning. */
export const IconCall = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <circle cx="9.8" cy="6.2" r="2.7" />
    <path d="M5.3 20.8v-4.4a4.5 4.5 0 0 1 9 0v4.4" />
    <path d="M13.6 13.4 19.2 6.6" />
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
