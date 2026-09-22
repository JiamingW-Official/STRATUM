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
  // One ink weight, not one number.
  //
  // 2.1 in a 24 grid is proportional: 3.3px of ink at a menu row's 38, and
  // 10.3px on a card at 118. That was right while 118 was the largest this
  // set was ever drawn. At 180, next to a photographed reel and a cast
  // clef, the same number draws a 15.8px slab — the glyph grew and its ink
  // grew with it, so it reads heavier rather than larger. Above 140 the
  // stroke is pinned to the 11px the 118 icons already had, and the only
  // thing that gets bigger is the drawing.
  strokeWidth: size >= 140 ? (11 * 24) / size : 2.1,
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

/**
 * Cabin sound: moving air.
 *
 * It was a window with the volume key's arcs coming off it, and beside the
 * volume key that is what it looked like — a speaker with the cone filed off.
 * Two marks in one row that both say "sound" leave you reading the labels,
 * which is the one thing a placard is for avoiding.
 *
 * So it says the sound instead of saying sound. The loudest thing in a cabin
 * above ten thousand feet is air going past the skin at eight miles a minute,
 * and three bars leaning into the wind is that and nothing else. Unequal
 * lengths and off-square on purpose: three level bars of one length is the
 * hamburger in the strip above.
 */
export const IconCabin = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <g transform="rotate(-6 12 12)">
      <rect x="3.6" y="6.1" width="14.4" height="2.3" rx="1.15" />
      <rect x="2.4" y="10.85" width="19.2" height="2.3" rx="1.15" />
      <rect x="6.2" y="15.6" width="10.6" height="2.3" rx="1.15" />
    </g>
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

/**
 * Dining: a tray with a cover on it.
 *
 * Not a knife and fork. Cutlery crossed on a panel is the mark for a
 * restaurant, and what comes down this aisle is a tray — the cloche is the
 * one shape that says "this arrives at your seat" rather than "you go to
 * it", and it is what is actually on the trolley.
 */
export const IconDining = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M12 3.4a1.2 1.2 0 0 1 1.2 1.2v.55a7.1 7.1 0 0 1 5.9 6.99H4.9a7.1 7.1 0 0 1 5.9-6.99V4.6A1.2 1.2 0 0 1 12 3.4z" />
    <path d="M2.6 13.4h18.8v2.1H2.6zM5.3 17.6h13.4v2.1H5.3z" />
  </svg>
);

/** Seat to seat. Two overlapping placards, which is the one mark for a
 *  message that has never needed explaining. */
export const IconChat = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M3.2 4.4h12.4v9.2H7.4L3.2 16.9z" />
    <path d="M17.4 7.6h3.4v8.6h-2.9l-3.1 2.6v-2.6h-4.2V13h6.8z" />
  </svg>
);

/** Put the screen out. The one control on the drawer that is not a place. */
export const IconPower = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M12 2.6v8.2" />
    <path d="M6.5 5.4a8 8 0 1 0 11 0" />
  </svg>
);

/* ── Transport ───────────────────────────────────────────────────────────
   The four shapes every player has used since a tape deck had buttons on it.
   Solid: a transport control is something you hit, not something you read. */

/** Out of order. The two crossing paths everybody reads as shuffle. */
export const IconShuffle = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M3 7.2h3.6l3.2 4M14.2 16.8h2.6M3 16.8h3.6l7.6-9.6h2.6" />
    <path d="m18.4 4.6 2.6 2.6-2.6 2.6M18.4 14.2l2.6 2.6-2.6 2.6" />
  </svg>
);

/** Again. One turn of the loop, with a 1 in it when it is one track. */
export const IconRepeat = ({ size = 24, one = false }: P & { one?: boolean }) => (
  <svg {...line(size)}>
    <path d="M7.4 5.6h9.2a3.6 3.6 0 0 1 3.6 3.6v1.4" />
    <path d="m4.2 5.6 3.2-2.6M4.2 5.6l3.2 2.6" />
    <path d="M16.6 18.4H7.4a3.6 3.6 0 0 1-3.6-3.6v-1.4" />
    <path d="m19.8 18.4-3.2-2.6M19.8 18.4l-3.2 2.6" />
    {one && <path d="M11.4 14.4v-4.2l-1.2.9" strokeWidth="1.8" />}
  </svg>
);

export const IconPlay = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M7.4 4.6 19.2 12 7.4 19.4z" />
  </svg>
);

export const IconPause = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M6.8 4.8h3.6v14.4H6.8zM13.6 4.8h3.6v14.4h-3.6z" />
  </svg>
);

export const IconPrev = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M5.6 5h2.6v14H5.6zM19.4 5v14L9.2 12z" />
  </svg>
);

export const IconNext = ({ size = 24 }: P) => (
  <svg {...fill(size)}>
    <path d="M15.8 5h2.6v14h-2.6zM4.6 5l10.2 7-10.2 7z" />
  </svg>
);

/* ── Map controls ─────────────────────────────────────────────────────────
   Line marks, not solid ones: these sit on top of a raster basemap, where a
   filled glyph loses its shape against a coastline. */

/** Open it, or shut it. One chevron, turned. */
export const IconChevron = ({ size = 24, flip = false }: P & { flip?: boolean }) => (
  <svg {...line(size)} style={{ transform: flip ? "rotate(180deg)" : undefined }}>
    <path d="M14.4 5.4 7.8 12l6.6 6.6" />
  </svg>
);

export const IconPlus = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M12 4.5v15M4.5 12h15" />
  </svg>
);

export const IconMinus = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M4.5 12h15" />
  </svg>
);

/** Put the aircraft in the middle and keep it there. */
export const IconTarget = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <circle cx="12" cy="12" r="6.4" />
    <path d="M12 1.8v3.4M12 18.8v3.4M1.8 12h3.4M18.8 12h3.4" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

/** The whole planet. A lit limb and a terminator, which is the one thing that
 *  tells a sphere from a circle — and it is what the globe view actually puts
 *  on the glass. Deliberately not the wire globe: that mark is language's. */
export const IconPlanet = ({ size = 24 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <circle cx="12" cy="13.2" r="8.1" fill="currentColor" />
    {/* The atmosphere, outside the limb. Not latitude lines and not a wire
        frame: the language placard in the rail is the wire globe, and two
        globes on one screen that mean different things have to look
        different. This one is the planet as this view actually draws it —
        a lit sphere with air around it. */}
    <path
      d="M2.1 14.4A10.6 10.6 0 0 1 21.9 14.4"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.55"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

/** Looking forward from the aircraft: a horizon with the ground running away
 *  under it. The one mark in the set that is a picture of a view. */
export const IconForward = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M2.6 9.4h18.8" />
    <path d="M9.4 21.4 11.2 9.4" />
    <path d="M14.6 21.4 12.8 9.4" />
    <path d="M4.6 15.4h14.8" />
  </svg>
);

/** The whole flight in the frame: a great circle between two airports. */
export const IconRoute = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M3.6 17.4C7 8.6 14 5.2 20.4 6.6" />
    <circle cx="3.6" cy="17.4" r="2.1" fill="currentColor" stroke="none" />
    <circle cx="20.4" cy="6.6" r="2.1" />
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

/* ── Weather ────────────────────────────────────────────────────────────── */

/**
 * The sky at the other end, drawn.
 *
 * One glyph per band of the WMO code the same way `conditionKey` collapses
 * them, so the picture and the words underneath it can never disagree: both
 * are switched by the same number. Stroked rather than solid — these sit
 * beside a reading, and a solid disc at this size reads as a button.
 */
export const IconWeather = ({ code, size = 24 }: P & { code: number }) => {
  const sun = (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5" />
    </>
  );
  // One cloud, in one place, so every cloudy state is the same cloud.
  const cloud = (
    <path d="M7.4 18.4a3.9 3.9 0 0 1-.3-7.8 5.2 5.2 0 0 1 10-1.2 3.6 3.6 0 0 1-.6 7.2z" />
  );
  const drops = (d: string) => <path d={d} strokeLinecap="round" />;

  return (
    <svg {...line(size)}>
      {code === 0 && sun}
      {code > 0 && code <= 2 && (
        <>
          <circle cx="9" cy="8.6" r="3.2" />
          <path d="M9 2.6v1.4M3 8.6h1.4M4.8 4.4l1 1M13.2 4.4l-1 1" />
          {cloud}
        </>
      )}
      {code === 3 && cloud}
      {code > 3 && code <= 48 && (
        <path d="M3.4 8.6h17.2M3.4 12.4h17.2M5.4 16.2h13.2M7.4 20h9.2" strokeLinecap="round" />
      )}
      {code > 48 && code <= 57 && (
        <>
          {cloud}
          {drops("M9.4 20.4v1.2M14.6 20.4v1.2")}
        </>
      )}
      {code > 57 && code <= 67 && (
        <>
          {cloud}
          {drops("M8.8 19.9l-.8 2.1M12 19.9l-.8 2.1M15.2 19.9l-.8 2.1")}
        </>
      )}
      {code > 67 && code <= 77 && (
        <>
          {cloud}
          {drops("M9 21h.01M12 21.4h.01M15 21h.01M9 21l.01 0M12 21.4l.01 0M15 21l.01 0")}
          <path d="M8.2 20.4h1.6M11.2 20.8h1.6M14.2 20.4h1.6M9 19.6v1.6M12 20v1.6M15 19.6v1.6" strokeLinecap="round" />
        </>
      )}
      {code > 77 && code <= 82 && (
        <>
          {cloud}
          {drops("M8.8 19.9l-1.2 2.4M13 19.9l-1.2 2.4")}
          <path d="M16.6 19.4l-.9 1.8" strokeLinecap="round" />
        </>
      )}
      {code > 82 && code <= 86 && (
        <>
          {cloud}
          <path d="M8.6 20.6h1.8M12.1 21h1.8M9.5 19.7v1.8M13 20.1v1.8" strokeLinecap="round" />
        </>
      )}
      {code > 86 && (
        <>
          {cloud}
          <path d="M12.8 18.6l-3 3.4h3l-1.2 2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
};

/** The trolley's contents, as one bag with a handle. */
export const IconBag = ({ size = 24 }: P) => (
  <svg {...line(size)}>
    <path d="M4.6 8.4h14.8l-1.1 12.1a1.6 1.6 0 0 1-1.6 1.5H7.3a1.6 1.6 0 0 1-1.6-1.5z" />
    <path d="M8.9 10.6V6.9a3.1 3.1 0 0 1 6.2 0v3.7" />
  </svg>
);
