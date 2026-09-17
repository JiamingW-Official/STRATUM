// Line icons drawn here rather than pulled from a set: the IFE needs six
// glyphs, and six glyphs are cheaper to draw than a dependency is to carry
// into a 3D scene. Everything is stroked at 1.6 on a 24 grid so the whole rail
// has one weight.

type P = { size?: number };

// One weight for the whole set, set here rather than per icon.
//
// 1.6 was drawn for a 24px rail and carried, unchanged, onto 62px cards, where
// a hairline at four times the size stops reading as a drawn line and starts
// reading as a cheap one. 1.9 on the same grid holds at both ends: the stroke
// is in viewBox units, so it scales with the glyph and stays a line rather
// than becoming a bar.
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconBack = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M15 5 8 12l7 7" />
  </svg>
);

export const IconHome = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M4 10.5 12 4l8 6.5V20H4z" />
  </svg>
);

/** Flight map: a globe with its meridian and equator. The first drawing was a
 *  swept aircraft seen from above, which at icon size collapsed into an ✕ and
 *  said nothing about a map. */
export const IconMap = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <circle cx="12" cy="12" r="8.6" />
    <path d="M3.4 12h17.2" />
    <path d="M12 3.4c2.9 3.3 2.9 13.9 0 17.2-2.9-3.3-2.9-13.9 0-17.2z" />
  </svg>
);

/** Reading light. A bulb, not a shade: the first draft drew a cone over a
 *  stem and every reading of it at rail size was "up arrow". */
export const IconLight = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M9.3 14.6a4.6 4.6 0 1 1 5.4 0c-.7.5-1 1.2-1.1 2h-3.2c-.1-.8-.4-1.5-1.1-2z" />
    <path d="M10.4 18.8h3.2" />
  </svg>
);

export const IconVolume = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
    <path d="M16 9.5a4 4 0 0 1 0 5" />
  </svg>
);

/** Call attendant: the cabin-crew silhouette every seat-back uses. */
export const IconCall = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <circle cx="12" cy="6.2" r="2.4" />
    <path d="M7 20v-4.5a5 5 0 0 1 10 0V20" />
  </svg>
);

/** Flight information: an instrument dial, not a lower-case "i". */
export const IconGauge = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M4 17a8 8 0 1 1 16 0" />
    <path d="m12 17 4.2-5" />
    <circle cx="12" cy="17" r="1.1" />
  </svg>
);

export const IconMusic = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M9 17.5V6.2l10-1.7v11" />
    <circle cx="6.6" cy="17.6" r="2.4" />
    <circle cx="16.6" cy="15.6" r="2.4" />
  </svg>
);

/** Movies: a strip of film with its sprockets. The first drawing was a gate
 *  with two verticals and a horizontal, which at rail size read as a window. */
export const IconFilm = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3 8.6h2.6M3 12h2.6M3 15.4h2.6M18.4 8.6H21M18.4 12H21M18.4 15.4H21" />
    <path d="M8.2 5v14M15.8 5v14" />
  </svg>
);

export const IconGames = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 5.4l-.5 2.4A2.6 2.6 0 0 1 16 16.6L15 15H9l-1 1.6a2.6 2.6 0 0 1-4.4-.8l-.5-2.4A4.5 4.5 0 0 1 7.5 8z" />
    <path d="M7.4 10.6v2.2M6.3 11.7h2.2" />
    <circle cx="15.6" cy="11.3" r=".9" />
    <circle cx="17.4" cy="13" r=".9" />
  </svg>
);

/** The sky view: an aircraft seen from below with the ring of a receiver's
 *  reach around it. */
export const IconSky = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M12 3.6 12.8 9l5.4 3v1.4l-5.4-1.5-.3 3.4 2 1.4v1l-2.5-.8-2.5.8v-1l2-1.4-.3-3.4L5.8 13.4V12l5.4-3z" />
    <path d="M3.4 18.6c2.4 1.5 5.4 2.3 8.6 2.3s6.2-.8 8.6-2.3" strokeDasharray="3 3" />
  </svg>
);
