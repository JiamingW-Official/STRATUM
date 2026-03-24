#!/usr/bin/env node
/**
 * parse-cifp.mjs — Parses FAA CIFP (ARINC 424) data into compact approach JSON.
 * Downloads the current cycle from FAA, extracts ILS approach procedures with
 * real waypoint coordinates, and outputs a JS module for the STRATUM app.
 *
 * Usage: node scripts/parse-cifp.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const CIFP_FILE = '/tmp/cifp/FAACIFP18';
const OUTPUT = 'src/data/cifpApproaches.js';

// ── Step 1: Parse DMS coordinates ──
function parseDMS(str) {
  if (!str || str.length < 9) return null;
  const sign = (str[0] === 'N' || str[0] === 'E') ? 1 : -1;
  const isLon = str[0] === 'E' || str[0] === 'W';
  const digits = str.slice(1);
  let deg, min, sec;
  if (isLon) {
    deg = parseInt(digits.slice(0, 3));
    min = parseInt(digits.slice(3, 5));
    sec = parseInt(digits.slice(5, 7)) + parseInt(digits.slice(7, 9)) / 100;
  } else {
    deg = parseInt(digits.slice(0, 2));
    min = parseInt(digits.slice(2, 4));
    sec = parseInt(digits.slice(4, 6)) + parseInt(digits.slice(6, 8)) / 100;
  }
  return Math.round(sign * (deg + min / 60 + sec / 3600) * 1e6) / 1e6;
}

// ── Step 2: Build coordinate lookup tables ──
function buildFixLookup(lines) {
  const fixes = {}; // key: "ICAO:FIX" or "AIRPORT:FIX" → {lat, lon}

  for (const line of lines) {
    if (line.length < 132) continue;
    const recType = line.slice(0, 5); // SUSAP, SUSAD, SUSAE, etc.

    // Terminal waypoints: SUSAP [ARPT][RGN]C[FIX_ID]...
    // Coordinates at cols 33-41 (lat), 42-51 (lon) — 0-indexed: 32-40, 41-50
    if (recType === 'SUSAP' && line[12] === 'C') {
      const airport = line.slice(6, 10).trim();
      const fixId = line.slice(13, 18).trim();
      const latStr = line.slice(32, 41);
      const lonStr = line.slice(41, 51);
      if (latStr[0] === 'N' || latStr[0] === 'S') {
        const lat = parseDMS(latStr);
        const lon = parseDMS(lonStr);
        if (lat !== null && lon !== null) {
          fixes[`${airport}:${fixId}`] = { lat, lon };
        }
      }
    }

    // Runway waypoints: SUSAP [ARPT][RGN]G[RW_ID]...
    // Coordinates at cols 33-41 (lat), 42-51 (lon)
    if (recType === 'SUSAP' && line[12] === 'G') {
      const airport = line.slice(6, 10).trim();
      const fixId = line.slice(13, 18).trim();
      const latStr = line.slice(32, 41);
      const lonStr = line.slice(41, 51);
      if (latStr[0] === 'N' || latStr[0] === 'S') {
        const lat = parseDMS(latStr);
        const lon = parseDMS(lonStr);
        if (lat !== null && lon !== null) {
          fixes[`${airport}:${fixId}`] = { lat, lon };
        }
      }
    }

    // Airport-specific navaids: SUSAD [ARPT][RGN] [NAV_ID]...
    // Coordinates vary — for ILS components, coords at cols 56-64 (lat), 65-74 (lon)
    if (recType === 'SUSAD') {
      const airport = line.slice(6, 10).trim();
      const navId = line.slice(13, 17).trim();
      // Try airport-specific navaid coords at standard VOR/DME/NDB position: 33-41, 42-51
      let latStr = line.slice(32, 41);
      let lonStr = line.slice(41, 51);
      if (latStr[0] === 'N' || latStr[0] === 'S') {
        const lat = parseDMS(latStr);
        const lon = parseDMS(lonStr);
        if (lat !== null && lon !== null) {
          fixes[`${airport}:${navId}`] = { lat, lon };
          if (!fixes[`*:${navId}`]) fixes[`*:${navId}`] = { lat, lon };
        }
      }
      // Also check ILS localizer position at cols 56-64, 65-74
      latStr = line.slice(55, 64);
      lonStr = line.slice(64, 74);
      if (latStr[0] === 'N' || latStr[0] === 'S') {
        const lat = parseDMS(latStr);
        const lon = parseDMS(lonStr);
        if (lat !== null && lon !== null) {
          if (!fixes[`${airport}:${navId}`]) fixes[`${airport}:${navId}`] = { lat, lon };
          if (!fixes[`*:${navId}`]) fixes[`*:${navId}`] = { lat, lon };
        }
      }
    }

    // Enroute waypoints: SUSAEA...
    if (line.slice(0, 6) === 'SUSAEA') {
      const fixId = line.slice(13, 18).trim();
      const latStr = line.slice(32, 41);
      const lonStr = line.slice(41, 51);
      if (latStr[0] === 'N' || latStr[0] === 'S') {
        const lat = parseDMS(latStr);
        const lon = parseDMS(lonStr);
        if (lat !== null && lon !== null) {
          if (!fixes[`*:${fixId}`]) fixes[`*:${fixId}`] = { lat, lon };
        }
      }
    }

    // Standalone VOR/DME/NDB: SUSAD with blank airport
    if (recType === 'SUSAD' && line.slice(6, 10).trim() === '') {
      const navId = line.slice(13, 17).trim();
      const latStr = line.slice(32, 41);
      const lonStr = line.slice(41, 51);
      if (latStr[0] === 'N' || latStr[0] === 'S') {
        const lat = parseDMS(latStr);
        const lon = parseDMS(lonStr);
        if (lat !== null && lon !== null) {
          if (!fixes[`*:${navId}`]) fixes[`*:${navId}`] = { lat, lon };
        }
      }
    }
  }

  console.log(`Built fix lookup: ${Object.keys(fixes).length} entries`);
  return fixes;
}

// ── Step 3: Resolve fix coordinates ──
function resolveFix(fixes, airport, fixId) {
  // Try airport-specific first, then global
  return fixes[`${airport}:${fixId}`] || fixes[`*:${fixId}`] || null;
}

// ── Step 4: Parse approach records ──
function parseApproaches(lines, fixes) {
  const approaches = {}; // airport → [approach, ...]

  // Collect all approach records grouped by airport + procedure + transition
  const rawRecords = [];
  for (const line of lines) {
    if (line.length < 132) continue;
    if (line.slice(0, 5) !== 'SUSAP') continue;
    if (line[12] !== 'F') continue;

    const airport = line.slice(6, 10).trim();
    const procId = line.slice(13, 19).trim();
    const routeType = line[13]; // I=ILS, R=RNAV, L=LOC (first char of proc ID)
    const routeQualifier = line[19]; // I=initial/final, A=approach transition, etc.
    const transition = line.slice(20, 25).trim();
    const seqNum = parseInt(line.slice(26, 29));
    const fixId = line.slice(29, 34).trim();
    const fixICAO = line.slice(34, 36).trim();
    const fixSection = line[36];
    const fixSubsect = line[37];
    const continuation = line[38];
    const wpDesc = line.slice(39, 43);
    const pathTerm = line.slice(47, 49).trim();
    const course = line.slice(70, 74).trim();
    const altDesc = line[82];
    const alt1Str = line.slice(84, 89).trim();
    const alt2Str = line.slice(89, 94).trim();
    const vertAngle = line.slice(102, 106).trim();

    // Skip continuation records (used for notes, not waypoints)
    if (continuation !== '0' && continuation !== ' ' && continuation !== '') continue;

    // Only interested in ILS (I), RNAV (R), LOC (L) for now
    if (!['I', 'R', 'L'].includes(routeType)) continue;

    // Parse altitude
    let alt = 0;
    if (alt1Str) alt = parseInt(alt1Str) || 0;

    // Parse course (tenths of degree)
    let courseDeg = 0;
    if (course) courseDeg = (parseInt(course) || 0) / 10;

    // Parse glideslope from vertical angle (e.g., -300 = -3.00 degrees)
    let gs = 0;
    if (vertAngle) gs = Math.abs(parseInt(vertAngle) || 0) / 100;

    // Determine fix type from waypoint description code
    let fixType = null;
    // wpDesc positions (0-indexed within the 4 chars):
    // [0]: Route type (A=arrival, D=departure, E=either)
    // [1]: (various)
    // [2]: I=IAF, F=FAF, M=MAP (in the description code)
    // [3]: (various)
    if (wpDesc[2] === 'I') fixType = 'IAF';
    else if (wpDesc[2] === 'F') fixType = 'FAF';
    else if (wpDesc[1] === 'M' || wpDesc[2] === 'M') fixType = 'MAP';
    else if (wpDesc[3] === 'M') fixType = 'MAP';
    // Check for missed approach legs
    if (wpDesc[0] === 'M' || (wpDesc[1] === ' ' && wpDesc[2] === 'M')) fixType = 'MA';
    // Check missed approach in position 2 explicitly
    if (wpDesc.includes('M') && seqNum > 30) fixType = 'MA';

    // Re-check: wpDesc format is 4 chars with specific meanings
    // Position 1 (0-indexed 0): blank or overlay indicator
    // Position 2 (0-indexed 1): Y=flyover, blank=flyby, B=both
    // Position 3 (0-indexed 2): type: A=final approach, B=IAF+MAP, E=end of missed, I=IAF, M=MAP, C=IAF+FAF, F=FAF
    // Position 4 (0-indexed 3): various
    // But the desc codes I see are like "E  I", "E  F", "GY M"
    // Actually from the data: position 0 is NOT blank... let me re-examine

    // Looking at actual data:
    // AROKE: "E  I" → pos 3 (0-idx) = I → IAF ✓
    // KRSTL: "E  F" → pos 3 = F → FAF? But it's the IF...
    // RW04L: "GY M" → pos 3 = M → no, pos 2 = ' ', pos 1 = 'Y'...
    // Let me re-read: the 4-char field is at cols 40-43 (1-indexed), 39-42 (0-indexed)

    // Actually, re-examining the spec:
    // Waypoint description code: 4 characters
    // Char 1 (col 40): Airport/heliport, Essential/off-airway, runway, NAR waypoint
    // Char 2 (col 41): Flyover/flyby
    // Char 3 (col 42): IAF/IF/FAF/MAP etc.
    // Char 4 (col 43): Transition fix, etc.

    // Reset and re-parse based on actual column 42 (0-indexed)
    fixType = null;
    const descChar3 = wpDesc[2]; // This is column 42
    const descChar4 = wpDesc[3]; // Column 43

    if (descChar3 === 'I') fixType = 'IAF';
    else if (descChar3 === 'F') fixType = 'FAF';
    else if (descChar3 === 'A') fixType = 'FAF'; // Final approach course fix
    else if (descChar3 === 'M') fixType = 'MAP';

    // Also: 'B' = IAF and Missed Approach Point, 'C' = IAF and FAF
    if (descChar3 === 'B') fixType = 'IAF';
    if (descChar3 === 'C') fixType = 'IAF'; // IAF+FAF combo

    rawRecords.push({
      airport, procId, routeType, transition, seqNum,
      fixId, fixSection, fixSubsect, wpDesc,
      pathTerm, courseDeg, alt, gs, fixType,
    });
  }

  // Group records by airport + procedure + route type + transition
  const grouped = {};
  for (const rec of rawRecords) {
    const procKey = `${rec.airport}:${rec.procId}:${rec.routeType}`;
    if (!grouped[procKey]) grouped[procKey] = {};
    const transKey = rec.transition || '_MAIN_';
    if (!grouped[procKey][transKey]) grouped[procKey][transKey] = [];
    grouped[procKey][transKey].push(rec);
  }

  // Helper: extract waypoints from a list of records
  function extractWaypoints(records, trackCourse) {
    records.sort((a, b) => a.seqNum - b.seqNum);
    const wps = [];
    const missed = [];
    let inMissed = false;
    let course = 0, gs = 3.0;

    for (const rec of records) {
      if (!rec.fixId) {
        // Missed approach legs without a fix (CA = climb to altitude, VA = heading to altitude)
        if (rec.pathTerm === 'CA' || rec.pathTerm === 'VA' || rec.pathTerm === 'FM' || rec.pathTerm === 'VM') inMissed = true;
        continue;
      }
      const coord = resolveFix(fixes, records[0].airport, rec.fixId);
      if (!coord) continue;

      // MAP detection — check wpDesc positions AND runway fix name
      const isMAP = rec.wpDesc[2] === 'M' || rec.wpDesc[1] === 'M'
        || (rec.fixId.startsWith('RW') && rec.fixId.length <= 5 && rec.wpDesc[2] !== 'I' && rec.wpDesc[2] !== 'F');

      if (isMAP && !inMissed) {
        wps.push({ n: rec.fixId, t: 'MAP', lat: coord.lat, lon: coord.lon, alt: rec.alt });
        inMissed = true;
        continue;
      }
      if (inMissed) {
        missed.push({ n: rec.fixId, t: 'MA', lat: coord.lat, lon: coord.lon, alt: rec.alt });
        continue;
      }
      const t = rec.fixType || 'WP';
      if (rec.courseDeg > 0) course = rec.courseDeg;
      if (rec.gs > 0) gs = rec.gs;
      wps.push({ n: rec.fixId, t, lat: coord.lat, lon: coord.lon, alt: rec.alt });
    }

    // ── Post-processing: fix leaked missed approach ──
    // If any RWxx fix is NOT the last waypoint, split there
    for (let i = 0; i < wps.length - 1; i++) {
      if (wps[i].n.startsWith('RW') && wps[i].n.length <= 5) {
        wps[i].t = 'MAP';
        const leaked = wps.splice(i + 1);
        for (const w of leaked) missed.unshift({ n: w.n, t: 'MA', lat: w.lat, lon: w.lon, alt: w.alt });
        break;
      }
    }

    // ── Deduplicate consecutive waypoints ──
    const dedup = (arr) => {
      if (arr.length <= 1) return arr;
      const out = [arr[0]];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].n !== arr[i-1].n || Math.abs(arr[i].lat - arr[i-1].lat) > 0.0001) {
          out.push(arr[i]);
        }
      }
      return out;
    };

    return { wps: dedup(wps), missed: dedup(missed), course, gs };
  }

  // Process each approach
  for (const [procKey, transitions] of Object.entries(grouped)) {
    // Must have a main final approach segment ('I' or '_MAIN_')
    const mainRecords = transitions['I'] || transitions['_MAIN_'];
    if (!mainRecords || mainRecords.length === 0) continue;

    const airport = mainRecords[0].airport;
    const routeType = mainRecords[0].routeType;
    const procId = mainRecords[0].procId;

    let runway = procId.slice(1).trim();
    if (/\d{2}[LRC]?[YZ]$/.test(runway)) runway = runway.slice(0, -1);

    // Extract main final approach segment
    const main = extractWaypoints(mainRecords, true);
    if (main.wps.length < 2) continue;

    // Fix up MAP/FAF/IAF labels
    const lastWp = main.wps[main.wps.length - 1];
    // Last waypoint should always be MAP (runway threshold or equivalent)
    if (lastWp.t !== 'MAP') {
      // For CF* fixes (ILS localizer check points), rename to RWxx
      if (lastWp.n.startsWith('CF') && runway) lastWp.n = 'RW' + runway;
      lastWp.t = 'MAP';
    }
    if (!main.wps.some(w => w.t === 'FAF') && main.wps.length >= 3) {
      const mapIdx = main.wps.findIndex(w => w.t === 'MAP');
      if (mapIdx > 0) main.wps[mapIdx - 1].t = 'FAF';
    }
    if (!main.wps.some(w => w.t === 'IAF') && main.wps.length >= 2) {
      main.wps[0].t = 'IAF';
    }

    const typeMap = { I: 'ILS', R: 'RNAV', L: 'LOC' };
    const type = typeMap[routeType] || routeType;

    const approach = {
      type, runway,
      name: `${type} RWY ${runway}`,
      course: main.course,
      glideslope: main.gs,
      waypoints: main.wps,
    };

    // Deduplicate missed approach waypoints
    if (main.missed.length > 0) {
      const seen = new Set();
      approach.missed = main.missed.filter(wp => {
        if (seen.has(wp.n)) return false;
        seen.add(wp.n); return true;
      });
    }

    // Extract named transitions (feeder routes from different directions)
    const trans = [];
    for (const [tKey, tRecords] of Object.entries(transitions)) {
      if (tKey === 'I' || tKey === '_MAIN_') continue; // skip final approach segment
      const t = extractWaypoints(tRecords, false);
      if (t.wps.length < 1) continue;
      // Mark first waypoint as IAF if not already
      if (!t.wps.some(w => w.t === 'IAF')) t.wps[0].t = 'IAF';
      // Ensure transition connects to main path — append main[0] if disconnected
      const lastT = t.wps[t.wps.length - 1];
      const firstM = main.wps[0];
      if (lastT.n !== firstM.n && (Math.abs(lastT.lat - firstM.lat) > 0.001 || Math.abs(lastT.lon - firstM.lon) > 0.001)) {
        t.wps.push({ ...firstM, t: 'WP' });
      }
      if (t.wps.length >= 2) trans.push(t.wps);
    }
    if (trans.length > 0) approach.transitions = trans;

    if (!approaches[airport]) approaches[airport] = [];
    // Deduplicate Cat II/III variants
    const existing = approaches[airport].find(a => a.runway === runway && a.type === type);
    if (existing) continue;
    approaches[airport].push(approach);
  }

  return approaches;
}

// ── Main ──
console.log('Reading CIFP file...');
const raw = readFileSync(CIFP_FILE, 'utf8');
const lines = raw.split('\n');
console.log(`Read ${lines.length} lines`);

console.log('Building fix coordinate lookup...');
const fixes = buildFixLookup(lines);

console.log('Parsing approach procedures...');
const approaches = parseApproaches(lines, fixes);

const airportCount = Object.keys(approaches).length;
const approachCount = Object.values(approaches).reduce((s, a) => s + a.length, 0);
console.log(`Parsed ${approachCount} approaches for ${airportCount} airports`);

// ── Output compact JS module ──
// Only include airports that have ILS approaches (most useful)
const ilsOnly = {};
let ilsCount = 0;
for (const [apt, apps] of Object.entries(approaches)) {
  const ils = apps.filter(a => a.type === 'ILS');
  if (ils.length > 0) {
    ilsOnly[apt] = ils;
    ilsCount += ils.length;
  }
}

console.log(`ILS-only: ${ilsCount} approaches for ${Object.keys(ilsOnly).length} airports`);

// Compact: round coordinates to 6 decimal places
const roundWps = (wps) => { for (const wp of wps) { wp.lat = Math.round(wp.lat * 1e6) / 1e6; wp.lon = Math.round(wp.lon * 1e6) / 1e6; } };
for (const apps of Object.values(ilsOnly)) {
  for (const app of apps) {
    roundWps(app.waypoints);
    if (app.missed) roundWps(app.missed);
    if (app.transitions) for (const t of app.transitions) roundWps(t);
  }
}

const json = JSON.stringify(ilsOnly);
const js = `// Auto-generated from FAA CIFP data — do not edit manually\n// Source: FAA CIFP Cycle 2603 (effective 19 Mar 2026)\n// Contains real ILS approach procedures for US airports\nexport const CIFP_APPROACHES = ${json};\n`;

writeFileSync(OUTPUT, js);
const sizeMB = (Buffer.byteLength(js) / 1024 / 1024).toFixed(2);
console.log(`Written to ${OUTPUT} (${sizeMB} MB)`);

// Also output RNAV approaches for airports without ILS
const rnavFallback = {};
let rnavCount = 0;
for (const [apt, apps] of Object.entries(approaches)) {
  if (ilsOnly[apt]) continue; // already has ILS
  const rnav = apps.filter(a => a.type === 'RNAV');
  if (rnav.length > 0) {
    rnavFallback[apt] = rnav;
    rnavCount += rnav.length;
  }
}
console.log(`RNAV fallback: ${rnavCount} approaches for ${Object.keys(rnavFallback).length} airports (not included in output — ILS only)`);
console.log('Done!');
