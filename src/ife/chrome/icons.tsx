// Line icons drawn here rather than pulled from a set: the IFE needs six
// glyphs, and six glyphs are cheaper to draw than a dependency is to carry
// into a 3D scene. Everything is stroked at 1.6 on a 24 grid so the whole rail
// has one weight.

type P = { size?: number };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
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

export const IconMap = ({ size = 24 }: P) => (
  <svg {...base(size)} aria-hidden="true">
    <path d="M21 5 13.5 12 21 19l-9-4-9 4 7.5-7L3 5l9 4z" />
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
