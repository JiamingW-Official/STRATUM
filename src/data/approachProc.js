/**
 * Synthetic IFR approach procedure generator.
 * Generates realistic approach charts (ILS, RNAV, LOC, VOR) from runway geometry.
 * No external data needed — standard ICAO procedure shapes derived from threshold + heading.
 */

const NM_TO_DEG = 1 / 60;
const DEG_TO_RAD = Math.PI / 180;

/**
 * Generate all IFR approach procedures for a set of runways.
 * @param {Array} runways  — from fetchAirportData().runways
 * @param {number} elev    — airport elevation in feet (0 if unknown)
 * @returns {Array<Approach>}
 */
export function generateApproaches(runways, elev = 0) {
  const approaches = [];
  if (!runways || runways.length === 0) return approaches;

  for (const rwy of runways) {
    if (!rwy.startLat || !rwy.endLat || !rwy.ref) continue;
    const refs = rwy.ref.split('/');
    if (refs.length < 2) continue;

    // Two thresholds per runway
    const thresholds = [
      { ref: refs[0].trim(), lat: rwy.startLat, lon: rwy.startLon, heading: rwy.heading },
      { ref: refs[1].trim(), lat: rwy.endLat, lon: rwy.endLon, heading: (rwy.heading + 180) % 360 },
    ];

    for (const thr of thresholds) {
      // ILS — precision, runways ≥ 1500m
      if (rwy.length >= 1500) {
        approaches.push(_genILS(thr, elev));
      }
      // RNAV GPS — all runways
      approaches.push(_genRNAV(thr, elev));
      // LOC only — runways ≥ 1800m
      if (rwy.length >= 1800) {
        approaches.push(_genLOC(thr, elev));
      }
    }
  }
  return approaches;
}

// ── Waypoint helper — places point at distance (NM) behind threshold on approach course ──
function _wp(thr, distNM, alt, name, fixType) {
  const backRad = ((thr.heading + 180) % 360) * DEG_TO_RAD;
  const cosLat = Math.cos(thr.lat * DEG_TO_RAD);
  return {
    name, fixType, alt,
    lat: thr.lat + (distNM * NM_TO_DEG) * Math.cos(backRad),
    lon: thr.lon + (distNM * NM_TO_DEG) * Math.sin(backRad) / cosLat,
  };
}

// Offset waypoint perpendicular to course (positive = right of approach course)
function _wpOffset(thr, distNM, offsetNM, alt, name, fixType) {
  const backRad = ((thr.heading + 180) % 360) * DEG_TO_RAD;
  const perpRad = backRad + Math.PI / 2; // right side
  const cosLat = Math.cos(thr.lat * DEG_TO_RAD);
  return {
    name, fixType, alt,
    lat: thr.lat + (distNM * NM_TO_DEG) * Math.cos(backRad) + (offsetNM * NM_TO_DEG) * Math.cos(perpRad),
    lon: thr.lon + ((distNM * NM_TO_DEG) * Math.sin(backRad) + (offsetNM * NM_TO_DEG) * Math.sin(perpRad)) / cosLat,
  };
}

function _genILS(thr, elev) {
  const r = thr.ref;
  return {
    type: 'ILS', runway: r,
    name: `ILS RWY ${r}`,
    course: thr.heading,
    glideslope: 3.0,
    waypoints: [
      _wp(thr, 18, elev + 5400, `I${r}A`, 'IAF'),
      _wp(thr, 10, elev + 3000, `I${r}I`, 'IF'),
      _wp(thr, 5, elev + 1800, `I${r}F`, 'FAF'),
      { name: `RW${r}`, fixType: 'MAP', alt: elev + 200, lat: thr.lat, lon: thr.lon },
    ],
    missed: [
      _wp(thr, -2, elev + 2000, `MA${r}`, 'MA'),
      _wp(thr, 10, elev + 4000, `I${r}A`, 'HOLD'),
    ],
    holdFix: 0, // index into waypoints for holding at IAF
    holdInbound: thr.heading, holdTurn: 'R',
  };
}

function _genRNAV(thr, elev) {
  const r = thr.ref;
  return {
    type: 'RNAV', runway: r,
    name: `RNAV (GPS) RWY ${r}`,
    course: thr.heading,
    glideslope: 3.0,
    waypoints: [
      _wpOffset(thr, 15, 5, elev + 5000, `R${r}A`, 'IAF'),   // offset IAF (T-bar left)
      _wpOffset(thr, 15, -5, elev + 5000, `R${r}B`, 'IAF'),  // offset IAF (T-bar right)
      _wp(thr, 15, elev + 5000, `R${r}C`, 'IAF'),             // straight-in IAF
      _wp(thr, 8, elev + 2600, `R${r}I`, 'IF'),
      _wp(thr, 5, elev + 1900, `R${r}F`, 'FAF'),
      { name: `RW${r}`, fixType: 'MAP', alt: elev + 250, lat: thr.lat, lon: thr.lon },
    ],
    missed: [
      _wp(thr, -2, elev + 2000, `MA${r}`, 'MA'),
      _wp(thr, 15, elev + 4000, `R${r}C`, 'HOLD'),
    ],
    holdFix: 2, // straight-in IAF
    holdInbound: thr.heading, holdTurn: 'R',
    tBar: true, // has T-shaped initial approach
  };
}

function _genLOC(thr, elev) {
  const r = thr.ref;
  return {
    type: 'LOC', runway: r,
    name: `LOC RWY ${r}`,
    course: thr.heading,
    waypoints: [
      _wp(thr, 18, elev + 5400, `L${r}A`, 'IAF'),
      _wp(thr, 10, elev + 3200, `L${r}I`, 'IF'),
      _wp(thr, 5, elev + 2000, `L${r}F`, 'FAF'),
      _wp(thr, 2, elev + 1200, `L${r}S`, 'STEPDOWN'),
      { name: `RW${r}`, fixType: 'MAP', alt: elev + 400, lat: thr.lat, lon: thr.lon },
    ],
    missed: [
      _wp(thr, -2, elev + 2000, `MA${r}`, 'MA'),
      _wp(thr, 18, elev + 4000, `L${r}A`, 'HOLD'),
    ],
    holdFix: 0,
    holdInbound: thr.heading, holdTurn: 'R',
  };
}

/**
 * Generate holding pattern points (racetrack oval) in lat/lon.
 * @returns {Array<{lat, lon}>} — ordered points forming the racetrack
 */
export function holdingPatternPoints(fixLat, fixLon, inboundHeading, turnDir = 'R', legNM = 3, radiusNM = 1.5) {
  const pts = [];
  const cosLat = Math.cos(fixLat * DEG_TO_RAD);
  const inRad = inboundHeading * DEG_TO_RAD;
  const sign = turnDir === 'R' ? 1 : -1;
  const perpRad = inRad + sign * Math.PI / 2;
  const outRad = inRad + Math.PI;

  // Turn center at the fix (first turn)
  const tc1Lat = fixLat + (radiusNM * NM_TO_DEG) * Math.cos(perpRad);
  const tc1Lon = fixLon + (radiusNM * NM_TO_DEG) * Math.sin(perpRad) / cosLat;

  // Outbound end (along outbound course from fix)
  const obEndLat = fixLat + (legNM * NM_TO_DEG) * Math.cos(outRad);
  const obEndLon = fixLon + (legNM * NM_TO_DEG) * Math.sin(outRad) / cosLat;

  // Turn center at outbound end (second turn)
  const tc2Lat = obEndLat + (radiusNM * NM_TO_DEG) * Math.cos(perpRad);
  const tc2Lon = obEndLon + (radiusNM * NM_TO_DEG) * Math.sin(perpRad) / cosLat;

  const ARC_STEPS = 16;

  // Arc 1: at fix (inbound → outbound)
  const startAngle1 = inRad - sign * Math.PI / 2;
  for (let i = 0; i <= ARC_STEPS; i++) {
    const a = startAngle1 + sign * Math.PI * (i / ARC_STEPS);
    pts.push({
      lat: tc1Lat + (radiusNM * NM_TO_DEG) * Math.cos(a),
      lon: tc1Lon + (radiusNM * NM_TO_DEG) * Math.sin(a) / cosLat,
    });
  }

  // Arc 2: at outbound end (outbound → inbound)
  const startAngle2 = outRad - sign * Math.PI / 2;
  for (let i = 0; i <= ARC_STEPS; i++) {
    const a = startAngle2 + sign * Math.PI * (i / ARC_STEPS);
    pts.push({
      lat: tc2Lat + (radiusNM * NM_TO_DEG) * Math.cos(a),
      lon: tc2Lon + (radiusNM * NM_TO_DEG) * Math.sin(a) / cosLat,
    });
  }

  // Close the loop
  pts.push(pts[0]);
  return pts;
}

/**
 * Detect which approach (if any) an aircraft is most likely flying.
 * @param {Object} ac       — aircraft data {latitude, longitude, heading, baroAltitude, verticalRate}
 * @param {Array} approaches — from generateApproaches()
 * @returns {{ approach, score }|null}
 */
export function detectApproach(ac, approaches) {
  if (!ac.latitude || !ac.longitude || !ac.heading) return null;
  const vs = ac.verticalRate || 0;
  if (vs > 1) return null; // climbing hard, not approaching
  const alt = ac.baroAltitude || 0;
  if (alt > 12000) return null; // too high for approach phase

  let best = null;
  let bestScore = 0;

  for (const app of approaches) {
    // Only match ILS / RNAV / LOC (not VOR for simplicity)
    const map = app.waypoints[app.waypoints.length - 1]; // MAP = threshold
    if (!map) continue;

    // Distance from aircraft to threshold (rough degrees → NM)
    const dLat = ac.latitude - map.lat;
    const dLon = (ac.longitude - map.lon) * Math.cos(map.lat * DEG_TO_RAD);
    const distNM = Math.sqrt(dLat * dLat + dLon * dLon) * 60;
    if (distNM > 25 || distNM < 0.5) continue;

    // Heading alignment with approach course (aircraft should be heading roughly on course)
    const headingDiff = Math.abs(((ac.heading - app.course) + 540) % 360 - 180);
    if (headingDiff > 40) continue;

    // Cross-track deviation from approach centerline
    const courseRad = app.course * DEG_TO_RAD;
    const crossTrackNM = Math.abs(dLat * Math.sin(courseRad) - dLon * Math.cos(courseRad)) * 60;
    if (crossTrackNM > 3) continue;

    // Score: heading alignment + lateral precision + descent + distance fit
    const headingScore = Math.max(0, (40 - headingDiff) / 40);
    const lateralScore = Math.max(0, (3 - crossTrackNM) / 3);
    const descentScore = vs < -0.5 ? 0.3 : (vs <= 0 ? 0.15 : 0);
    const distScore = distNM < 15 ? 0.2 : 0.1;

    // Bonus for ILS (most common precision approach)
    const typeBonus = app.type === 'ILS' ? 0.1 : 0;

    const score = headingScore * 0.35 + lateralScore * 0.25 + descentScore + distScore + typeBonus;
    if (score > bestScore) {
      bestScore = score;
      best = app;
    }
  }

  return bestScore > 0.35 ? { approach: best, score: bestScore } : null;
}
