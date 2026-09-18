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
  const ra = Math.atan2(
    Math.cos(obliquity) * Math.sin(ecl),
    Math.cos(ecl),
  );
  // Greenwich mean sidereal time, in hours. The subsolar longitude is the
  // sun's right ascension measured from Greenwich rather than from the
  // equinox, which is what turns an astronomical position into a place.
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24;
  const lon = (((ra / RAD - gmst * 15) % 360) + 540) % 360 - 180;
  return { lat: dec / RAD, lon };
}

/**
 * The dark side of the earth, as one polygon ring.
 *
 * The terminator is the great circle 90° from the subsolar point, so at every
 * longitude it has exactly one latitude, and night is the cap on the far side
 * of it from the sun. The night half is the one that gets drawn because it is
 * the one that changes the map: the basemap is already the colour of a lit
 * world, and this puts the shadow on it.
 *
 * At an equinox the circle passes through both poles and latitude-per-
 * longitude degenerates, which the arctangent handles by going to ±90 — and
 * the ring that comes out of it still covers exactly the dark longitudes.
 *
 * Half a degree between points, not two: at the zoom a passenger reaches when
 * they want to know what is under the wing, two degrees of longitude is three
 * hundred pixels and the edge of the night is visibly a polygon.
 */
export function nightRing(at: Date, stepDeg = 0.5): Array<[number, number]> {
  const sun = subsolarPoint(at);
  const dec = sun.lat * RAD;
  const ring: Array<[number, number]> = [];
  for (let lon = -180; lon <= 180; lon += stepDeg) {
    const lat =
      Math.atan(-Math.cos((lon - sun.lon) * RAD) / Math.tan(dec)) / RAD;
    ring.push([lon, lat]);
  }
  // Close the ring around the pole the sun is not over, which is the one in
  // permanent darkness at this time of year.
  const pole = dec > 0 ? -90 : 90;
  ring.push([180, pole], [-180, pole], ring[0]);
  return ring;
}
