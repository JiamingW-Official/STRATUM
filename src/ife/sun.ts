/**
 * Where the sun is, and therefore where it is night.
 *
 * Every seat-back moving map draws the day/night line, and it is the one thing
 * on a moving map that is not about the aircraft at all — it is the reason the
 * window shade beside you is down. It belongs here for the same reason the
 * weather does: it is real, it is checkable, and it is not about us.
 *
 * The algorithm is the low-precision solar position from the Astronomical
 * Almanac, which is good to about 0.01° of declination — a kilometre or so on
 * the ground, against a terminator that is itself a 40 km-wide smear of
 * twilight. Good enough to be true, and small enough to run every minute
 * without a dependency.
 *
 * Nothing here is measured, and nothing here pretends to be: this is a shading
 * computed from the clock, not a track drawn from what a receiver heard.
 */

const RAD = Math.PI / 180;

/** The point on the earth the sun is directly over, right now. */
export function subsolarPoint(at: Date): { lat: number; lon: number } {
  // Days since J2000.0.
  const n = at.getTime() / 86_400_000 + 2440587.5 - 2451545.0;
  const meanLon = (280.46 + 0.9856474 * n) % 360;
  const meanAnom = ((357.528 + 0.9856003 * n) % 360) * RAD;
  // Ecliptic longitude: the mean longitude plus the equation of the centre.
  const ecl =
    (meanLon + 1.915 * Math.sin(meanAnom) + 0.02 * Math.sin(2 * meanAnom)) *
    RAD;
  const obliquity = (23.439 - 0.0000004 * n) * RAD;
  const dec = Math.asin(Math.sin(obliquity) * Math.sin(ecl));
  const ra = Math.atan2(Math.cos(obliquity) * Math.sin(ecl), Math.cos(ecl));
  // Greenwich mean sidereal time, in hours. The subsolar longitude is the
  // sun's right ascension measured from Greenwich rather than from the
  // equinox, which is what turns an astronomical position into a place.
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24;
  const lon = ((((ra / RAD - gmst * 15) % 360) + 540) % 360) - 180;
  return { lat: dec / RAD, lon };
}

/**
 * The terminator: the great circle 90° from the subsolar point, as one
 * latitude per longitude, with the pole that is in darkness.
 *
 * At an equinox the circle passes through both poles and latitude-per-
 * longitude degenerates, which the arctangent handles by going to ±90 — and
 * what comes out of it still divides the planet exactly where the light does.
 */
function terminator(at: Date, stepDeg: number) {
  const sun = subsolarPoint(at);
  const dec = sun.lat * RAD;
  const pts: Array<[number, number]> = [];
  for (let lon = -180; lon <= 180; lon += stepDeg) {
    pts.push([
      lon,
      Math.atan(-Math.cos((lon - sun.lon) * RAD) / Math.tan(dec)) / RAD,
    ]);
  }
  return { pts, pole: dec > 0 ? -90 : 90 };
}

/** The line itself, for drawing the edge of the night. */
export function terminatorLine(
  at: Date,
  stepDeg = 0.5,
): Array<[number, number]> {
  return terminator(at, stepDeg).pts;
}

/**
 * The dark side of the earth, as one polygon ring.
 *
 * The obvious ring is the terminator plus two edges closing it around the dark
 * pole, and on a flat map that is the right one. On a globe it is not: the
 * edge from (180, pole) to (-180, pole) is a single segment spanning the whole
 * planet, and a straight line between two points 360° of longitude apart is a
 * chord straight through it. That chord is what drew a hard diagonal across
 * the earth where no terminator was.
 *
 * So the closure walks the pole a degree at a time. Every edge in the ring is
 * then short enough to lie on the surface — and the fill stays one polygon,
 * which a strip of separate quads (the other obvious fix) does not: at 0.6
 * opacity every seam between them showed as a stripe.
 *
 * Half a degree along the terminator itself, not two: at the zoom a passenger
 * reaches when they want to know what is under the wing, two degrees of
 * longitude is three hundred pixels and the edge of the night is visibly a
 * polygon.
 */
export function nightRing(at: Date, stepDeg = 0.5): Array<[number, number]> {
  const { pts, pole } = terminator(at, stepDeg);
  const ring: Array<[number, number]> = [...pts];
  for (let lon = 180; lon >= -180; lon -= 1) ring.push([lon, pole]);
  ring.push(pts[0]);
  return ring;
}
