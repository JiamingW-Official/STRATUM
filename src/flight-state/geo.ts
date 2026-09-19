// Great-circle helpers. These live beside the state rather than in the bench
// because every surface that draws a route needs them — the strip, the moving
// map, and later the cabin windows.

const R_EARTH_KM = 6371;
export const rad = (d: number) => (d * Math.PI) / 180;
export const deg = (r: number) => (r * 180) / Math.PI;

export type LatLon = { lat: number; lon: number };

export function greatCircleKm(a: LatLon, b: LatLon): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Point at fraction f along the great circle from a to b (spherical slerp). */
export function interpolate(a: LatLon, b: LatLon, f: number): LatLon {
  const p1 = rad(a.lat),
    l1 = rad(a.lon),
    p2 = rad(b.lat),
    l2 = rad(b.lon);
  const hav =
    Math.sin((p2 - p1) / 2) ** 2 +
    Math.cos(p1) * Math.cos(p2) * Math.sin((l2 - l1) / 2) ** 2;
  const d = 2 * Math.asin(Math.min(1, Math.sqrt(hav)));
  if (d === 0) return { lat: a.lat, lon: a.lon };
  const A = Math.sin((1 - f) * d) / Math.sin(d);
  const B = Math.sin(f * d) / Math.sin(d);
  const x = A * Math.cos(p1) * Math.cos(l1) + B * Math.cos(p2) * Math.cos(l2);
  const y = A * Math.cos(p1) * Math.sin(l1) + B * Math.cos(p2) * Math.sin(l2);
  const z = A * Math.sin(p1) + B * Math.sin(p2);
  return {
    lat: deg(Math.atan2(z, Math.hypot(x, y))),
    lon: deg(Math.atan2(y, x)),
  };
}

/** Initial bearing from a to b, degrees true. */
export function bearing(a: LatLon, b: LatLon): number {
  const p1 = rad(a.lat),
    p2 = rad(b.lat),
    dl = rad(b.lon - a.lon);
  const y = Math.sin(dl) * Math.cos(p2);
  const x =
    Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** How far along the route a point lies, 0 at origin and 1 at destination. */
/**
 * The point `km` along a great circle from `a`, on the given bearing.
 *
 * Used to ask the map which way the aircraft is pointing *on the screen*:
 * project here and project one of these, and the angle between the two is
 * the direction of travel as drawn, whatever the projection has done to it.
 */
export function alongBearing(a: LatLon, bearingDeg: number, km: number): LatLon {
  const R = 6371;
  const d = km / R;
  const br = rad(bearingDeg);
  const la = rad(a.lat);
  const lo = rad(a.lon);
  const lat = Math.asin(
    Math.sin(la) * Math.cos(d) + Math.cos(la) * Math.sin(d) * Math.cos(br),
  );
  const lon =
    lo +
    Math.atan2(
      Math.sin(br) * Math.sin(d) * Math.cos(la),
      Math.cos(d) - Math.sin(la) * Math.sin(lat),
    );
  return { lat: deg(lat), lon: ((deg(lon) + 540) % 360) - 180 };
}

export function progressAlong(from: LatLon, to: LatLon, p: LatLon): number {
  const total = greatCircleKm(from, to);
  if (total === 0) return 0;
  return Math.min(1, Math.max(0, greatCircleKm(from, p) / total));
}

/** Samples a great circle as a polyline, for map geometry. */
export function arc(a: LatLon, b: LatLon, steps = 96): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const { lat, lon } = interpolate(a, b, i / steps);
    out.push([lon, lat]);
  }
  return out;
}
