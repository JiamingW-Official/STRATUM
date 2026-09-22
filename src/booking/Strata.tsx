import { useId } from "react";
import { skyAt } from "./Arc";
import type { Sky } from "./Arc";
import type { Airport } from "../flight-state/types";

/**
 * The light at the two ends of a route.
 *
 * It says what the codes cannot: the near end is the sky over the airport you
 * leave from, the far end is the sky over the one you are going to, in the
 * same three states the route line uses — night, the edges of the day,
 * daylight — read off the solar hour rather than off a time of day somebody
 * decided looked nice. Fly New York to London in the afternoon and it goes
 * pale to dark, because that is the flight.
 *
 * It has been drawn two wrong ways already, and both failures were the same
 * failure. First as three stepped bars in the proportions of the airline's
 * mark, which above a form reads as a skeleton loader and between two airport
 * codes reads as railway track. Then as one line along the top edge of the
 * card, which is the coloured strip every template puts there and no airline
 * has ever put anywhere.
 *
 * So on the home screen it is not a shape at all. It is what the card is made
 * of: the paper itself carries the light, at a weight you would not name
 * unless the two ends differed, and the two clocks under the codes are what
 * explain it. Nothing has been added to the screen. Between two codes on the
 * pass, where there was a hairline already, it stays a hairline — with a
 * colour.
 *
 * The colours are the app's own: the airline's black for night, brass for the
 * edges, the sky view's blue for daylight. Nothing new enters the palette to
 * draw a picture of the sky.
 */
const PAPER: Record<Sky, [string, number]> = {
  /* Each with the weight it needs to land in the same place: near-black at a
     sixth is already a grey you can see, and the pale blue at a sixth is not
     there at all. Matching the numbers would be matching the wrong thing. */
  night: ["30, 36, 47", 0.3],
  twilight: ["201, 164, 92", 0.38],
  day: ["147, 190, 212", 0.5],
};

/** On the airline's own black the three swap ends: night is the one that has
 *  to be lifted off the surface, daylight the one already there. */
const DARK: Record<Sky, string> = {
  night: "#5b6786",
  twilight: "#c9a45c",
  day: "#f4f0e7",
};

/**
 * The card's own surface, as a background.
 *
 * Returned rather than rendered, because the point is that there is no extra
 * element: the caller puts this on the thing it already had.
 */
export function skyWash(
  from: Airport,
  to: Airport,
  at: number,
  toAt?: number,
): { backgroundImage: string } {
  const [a, aw] = PAPER[skyAt(from.lon, at)];
  const [b, bw] = PAPER[skyAt(to.lon, toAt ?? at)];
  // Across the card at a slight angle, because a flat horizontal wash on a
  // rectangle is a band again and the eye finds its edges.
  return {
    backgroundImage: `linear-gradient(103deg, rgba(${a}, ${aw}) 0%, rgba(${a}, ${aw * 0.45}) 38%, rgba(${b}, ${bw * 0.45}) 62%, rgba(${b}, ${bw}) 100%)`,
  };
}

/**
 * The two sky colours themselves, for a caller that draws its own line.
 *
 * The trip screen runs the route down the page rather than across it, which
 * is a CSS gradient on a rail and not an SVG, and it needs the two ends
 * rather than a drawing of them.
 */
export function skyStops(
  from: Airport,
  to: Airport,
  at: number,
  toAt: number,
  tone: "paper" | "dark" = "paper",
): [string, string] {
  if (tone === "dark") {
    return [DARK[skyAt(from.lon, at)], DARK[skyAt(to.lon, toAt)]];
  }
  const [a, aw] = PAPER[skyAt(from.lon, at)];
  const [b, bw] = PAPER[skyAt(to.lon, toAt)];
  // Opaque here: a rail two pixels wide has nothing behind it to tint, so the
  // weights that made the card's wash work would leave it almost invisible.
  return [`rgba(${a}, ${Math.min(1, aw * 2.6)})`, `rgba(${b}, ${Math.min(1, bw * 2.6)})`];
}

/** And the hairline between two codes on the pass, which was already there. */
export function SkyRule({
  from,
  to,
  at,
  toAt,
}: {
  from: Airport;
  to: Airport;
  /** The moment the door shuts. */
  at: number;
  /** And the moment it opens again, which is the other end of the line. */
  toAt: number;
}) {
  const id = useId().replace(/:/g, "");
  return (
    /* No viewBox: laid out as a percentage of the real width and drawn at a
       real pixel height, rather than in a coordinate space that would have to
       be squashed to fit and would take the drawing with it. */
    <svg className="bk-skyrule" width="100%" height="2" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={DARK[skyAt(from.lon, at)]} />
          <stop offset="1" stopColor={DARK[skyAt(to.lon, toAt)]} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100%" height="2" fill={`url(#${id})`} />
    </svg>
  );
}
