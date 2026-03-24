import * as THREE from 'three';
import { loadMapTexture, abortMapLoads } from './mapTiles.js';
import { fetchAirportData, categorizeFlights, clearAirportCache } from '../data/airports.js';
import { fetchFIRData, filterNearbyFIRs } from '../data/firBoundaries.js';
import { fetchNavaidData, filterNearbyNavaids } from '../data/navaids.js';


const GROUND_SIZE = 160;
const GEO_SCALE = 40;

let groundMaterial = null;
let groundMesh = null;
let _cosLat = 1; // cos(userLat) — corrects E-W longitude scale
const hiResOverlays = [];

// T3-12: Day/Night cycle cached references
let _skyDomeRef = null;
let _skyBaseColors = null;   // Float32Array — night baseline vertex colors
let _ambientLightRef = null;

export function createEnvironment(scene) {
  // Horizon fog — fades map edges into sky for seamless ground→sky transition
  scene.fog = new THREE.FogExp2(new THREE.Color(0.008, 0.032, 0.068), 0.018);

  const ambient = new THREE.AmbientLight(0x3a5577, 0.5);
  ambient.name = 'ambientLight';
  _ambientLightRef = ambient;
  scene.add(ambient);

  // Hemisphere light — sky/ground color split for richer aircraft shading
  const hemi = new THREE.HemisphereLight(0x8899bb, 0x222233, 0.4);
  scene.add(hemi);

  const dirLight = new THREE.DirectionalLight(0xaaccee, 0.45);
  dirLight.position.set(15, 50, 25);
  scene.add(dirLight);

  const groundGeo = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE);
  groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.95,
  });
  groundMesh = new THREE.Mesh(groundGeo, groundMaterial);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = 0;
  groundMesh.name = 'ground';
  groundMaterial.__scene = scene;
  scene.add(groundMesh);

  // Horizon fade ring — radial gradient from transparent (inner, at ground edge)
  // to sky/fog color (outer). Creates the Cities Skylines-style smooth horizon
  // so the map edge dissolves into the sky rather than cutting sharply.
  const fadeInner = GROUND_SIZE * 0.42;
  const fadeOuter = GROUND_SIZE * 0.85;
  const fadeGeo = new THREE.RingGeometry(fadeInner, fadeOuter, 96, 1);
  // Vertex colors: inner ring = transparent, outer ring = fog color
  const fadeVerts = fadeGeo.attributes.position;
  const fadeCols = new Float32Array(fadeVerts.count * 4); // RGBA
  for (let i = 0; i < fadeVerts.count; i++) {
    const x = fadeVerts.getX(i), z = fadeVerts.getZ(i);
    const dist = Math.sqrt(x * x + z * z);
    const t = Math.max(0, Math.min(1, (dist - fadeInner) / (fadeOuter - fadeInner)));
    const a = t * t; // quadratic ease-in for softer inner edge
    fadeCols[i * 4] = 0.008;
    fadeCols[i * 4 + 1] = 0.032;
    fadeCols[i * 4 + 2] = 0.068;
    fadeCols[i * 4 + 3] = a;
  }
  fadeGeo.setAttribute('color', new THREE.Float32BufferAttribute(fadeCols, 4));
  const fadeMat = new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, depthWrite: false,
    side: THREE.DoubleSide, fog: false,
  });
  const fadeRing = new THREE.Mesh(fadeGeo, fadeMat);
  fadeRing.rotation.x = -Math.PI / 2;
  fadeRing.position.y = 0.001; // just above ground to overlay
  fadeRing.renderOrder = -50;
  scene.add(fadeRing);

  // Full sky sphere — radius 500 ensures edge is never visible at any zoom level
  const skyGeo = new THREE.SphereGeometry(500, 64, 32);
  const skyVerts = skyGeo.attributes.position;
  const skyColors = new Float32Array(skyVerts.count * 3);
  for (let i = 0; i < skyVerts.count; i++) {
    const y = skyVerts.getY(i);
    // Gradient from horizon color at y=0 to deeper sky at top
    const t = Math.max(0, y / 250);
    // Below horizon: slightly darker to avoid bright floor
    const b = y < 0 ? 0.7 : 1.0;
    skyColors[i * 3] = (0.008 + t * 0.012) * b;
    skyColors[i * 3 + 1] = (0.032 + t * 0.03) * b;
    skyColors[i * 3 + 2] = (0.065 + t * 0.06) * b;
  }
  skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(skyColors, 3));
  const skyMat = new THREE.MeshBasicMaterial({
    vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false,
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  skyDome.name = 'skyDome';
  skyDome.renderOrder = -100;
  _skyDomeRef = skyDome;
  _skyBaseColors = new Float32Array(skyColors);  // snapshot night baseline
  scene.add(skyDome);

  // Subtle ground grid for depth
  const gridHelper = new THREE.GridHelper(GROUND_SIZE, 160, 0x0a1e3a, 0x0a1e3a);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.08;
  gridHelper.material.depthWrite = false;
  gridHelper.position.y = 0.005;
  scene.add(gridHelper);

  // User location — refined crosshair + gentle pulse
  const pulseGroup = new THREE.Group();
  pulseGroup.name = 'userPulse';

  // Center dot
  const dotGeo = new THREE.CircleGeometry(0.04, 24);
  const dotMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide,
  });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.rotation.x = -Math.PI / 2;
  dot.position.y = 0.06;
  pulseGroup.add(dot);

  // Crosshair lines (4 short segments)
  const crossMat = new THREE.LineBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.25,
  });
  const armLen = 0.2, gap = 0.08;
  const crossVerts = [
    gap, 0, 0,   armLen, 0, 0,
    -gap, 0, 0,  -armLen, 0, 0,
    0, 0, gap,   0, 0, armLen,
    0, 0, -gap,  0, 0, -armLen,
  ];
  const crossGeo = new THREE.BufferGeometry();
  crossGeo.setAttribute('position', new THREE.Float32BufferAttribute(crossVerts, 3));
  const crosshair = new THREE.LineSegments(crossGeo, crossMat);
  crosshair.position.y = 0.05;
  pulseGroup.add(crosshair);

  // Pulse ring
  const pulseRingGeo = new THREE.RingGeometry(0.12, 0.14, 48);
  const pulseRingMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.15, side: THREE.DoubleSide,
  });
  const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
  pulseRing.rotation.x = -Math.PI / 2;
  pulseRing.position.y = 0.04;
  pulseRing.name = 'pulseRing';
  _pulseRingRef = pulseRing;
  pulseGroup.add(pulseRing);

  scene.add(pulseGroup);

}

export async function loadGroundMap(lat, lon) {
  // Apply cos(lat) correction: 1° longitude = cos(lat) * 111.3 km, not 111.3 km
  _cosLat = Math.cos(lat * Math.PI / 180);
  // Resize ground plane to correct geographic aspect ratio
  if (groundMesh) {
    groundMesh.geometry.dispose();
    groundMesh.geometry = new THREE.PlaneGeometry(GROUND_SIZE * _cosLat, GROUND_SIZE);
  }

  const degreesExtent = GROUND_SIZE / GEO_SCALE;
  try {
    const texture = await loadMapTexture(lat, lon, degreesExtent, (upgradedTexture, bounds) => {
      if (bounds) {
        // High-res overlay — stacks on top, each higher zoom slightly above previous
        const scene = groundMaterial?.__scene;
        if (!scene) return;
        const sizeX = (bounds.lonMax - bounds.lonMin) * GEO_SCALE * _cosLat;
        const sizeZ = (bounds.latMax - bounds.latMin) * GEO_SCALE;
        const cx = ((bounds.lonMin + bounds.lonMax) / 2 - lon) * GEO_SCALE * _cosLat;
        const cz = -((bounds.latMin + bounds.latMax) / 2 - lat) * GEO_SCALE;

        const yLevel = 0.003 + hiResOverlays.length * 0.002;
        const geo = new THREE.PlaneGeometry(sizeX, sizeZ);
        const mat = new THREE.MeshBasicMaterial({
          map: upgradedTexture, transparent: true, opacity: 0.95,
          color: 0xffffff, depthWrite: false,
        });
        const overlay = new THREE.Mesh(geo, mat);
        overlay.rotation.x = -Math.PI / 2;
        overlay.position.set(cx, yLevel, cz);
        scene.add(overlay);
        hiResOverlays.push(overlay);
      } else if (groundMaterial) {
        // Full-area upgrade (zoom 12)
        if (groundMaterial.map) groundMaterial.map.dispose();
        groundMaterial.map = upgradedTexture;
        groundMaterial.needsUpdate = true;
      }
    });
    if (groundMaterial) {
      groundMaterial.map = texture;
      groundMaterial.needsUpdate = true;
    }
  } catch (err) {
    console.warn('[STRATUM] Failed to load map tiles:', err.message);
  }
}

// ============================================================
//  AIRPORT SYSTEM — batched rendering for performance
// ============================================================

const METERS_PER_UNIT = 111000 / GEO_SCALE;
const DEG = Math.PI / 180;

let airportGroup = null;
let airportHitTargets = [];
let airportData = null;
let _userLat = 0;
let _userLon = 0;
let _loadEpoch = 0; // incremented on clearAirports; guards against stale loadAirports resolving late

// Selection state
let selectedHighlight = null;
let _selectionAnimObjects = [];

// Cached animated objects — populated at load time, iterated in updatePulse
let _aptBeacons = [];
let _approachLightMeshes = [];
let _runwayEdgeLightMesh = null;
let _taxiwayLightMesh = null;
let _pulseRingRef = null;

let _thresholdBarMesh = null;
let _runwayThresholdTargets = [];

// Loading placeholder — pulsing ring on ground while airports fetch
let _loadingPlaceholder = null;
function _showLoadingPlaceholder(scene) {
  _removeLoadingPlaceholder(scene);
  const ringGeo = new THREE.RingGeometry(1.8, 2.0, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xc4a058, transparent: true, opacity: 0.15,
    side: THREE.DoubleSide, depthWrite: false,
  });
  _loadingPlaceholder = new THREE.Mesh(ringGeo, ringMat);
  _loadingPlaceholder.rotation.x = -Math.PI / 2;
  _loadingPlaceholder.position.y = 0.01;
  _loadingPlaceholder.name = 'aptLoadingRing';
  scene.add(_loadingPlaceholder);
}
function _removeLoadingPlaceholder(scene) {
  if (_loadingPlaceholder) {
    scene.remove(_loadingPlaceholder);
    _loadingPlaceholder.geometry.dispose();
    _loadingPlaceholder.material.dispose();
    _loadingPlaceholder = null;
  }
}
// Called from animate loop — animate the loading ring
export function animateAirportLoading(elapsed) {
  if (!_loadingPlaceholder) return;
  const pulse = 0.08 + 0.08 * Math.sin(elapsed * 3);
  _loadingPlaceholder.material.opacity = pulse;
  const s = 1 + 0.1 * Math.sin(elapsed * 2);
  _loadingPlaceholder.scale.set(s, s, 1);
}

export async function loadAirports(scene, userLat, userLon) {
  const myEpoch = _loadEpoch;
  _userLat = userLat;
  _userLon = userLon;

  _aptBeacons = [];
  _approachLightMeshes = [];
  _runwayEdgeLightMesh = null;
  _taxiwayLightMesh = null;

  // Show loading placeholder
  _showLoadingPlaceholder(scene);

  // Retry once on failure (Overpass can be temporarily unreachable)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      airportData = await fetchAirportData(userLat, userLon, 1.2);
      if (_loadEpoch !== myEpoch) return;
      break; // success
    } catch (err) {
      if (attempt === 0 && _loadEpoch === myEpoch) {
        console.warn('[STRATUM] Airport fetch attempt 1 failed, retrying...', err.message);
        clearAirportCache(); // clear stale fetchPromise so retry re-fetches
        await new Promise(r => setTimeout(r, 600));
        if (_loadEpoch !== myEpoch) return;
        continue;
      }
      _removeLoadingPlaceholder(scene);
      console.warn('[STRATUM] Airport data fetch failed:', err.message);
      return;
    }
  }

  // Remove placeholder now that data has arrived
  _removeLoadingPlaceholder(scene);

  airportGroup = new THREE.Group();
  airportGroup.name = 'airports';
  airportGroup.renderOrder = 50;

  // ── Critical path: runways + labels (visible immediately) ──
  for (const rwy of airportData.runways) {
    renderRunway(rwy, userLat, userLon);
  }
  for (const apt of airportData.airports) {
    renderAirportLabel(apt, userLat, userLon);
  }
  scene.add(airportGroup);

  // ── Deferred: lights, taxiways, terminals — rendered on next frames ──
  // Each batch runs in a separate rAF so it never blocks the main render loop.
  const _snapEpoch = _loadEpoch;
  requestAnimationFrame(() => {
    if (_loadEpoch !== _snapEpoch) return;
    renderRunwayEdgeLights(airportData.runways, userLat, userLon);
    renderThresholdAndEndLights(airportData.runways);
    renderRunwayThresholdTargets(airportData.runways);
    requestAnimationFrame(() => {
      if (_loadEpoch !== _snapEpoch) return;
      for (const rwy of airportData.runways) {
        renderApproachLights(rwy, userLat, userLon);
      }
      requestAnimationFrame(() => {
        if (_loadEpoch !== _snapEpoch) return;
        if (airportData.taxiways) renderTaxiwaysBatched(airportData.taxiways, userLat, userLon);
        if (airportData.terminals) {
          for (const term of airportData.terminals) renderTerminal(term, userLat, userLon);
        }
        const txCount = airportData.taxiways?.length || 0;
        const tmCount = airportData.terminals?.length || 0;
        console.log(`[STRATUM] Airport detail loaded: ${airportData.runways.length} runways, ${txCount} taxiways, ${tmCount} terminals`);
      });
    });
  });

  console.log(`[STRATUM] Airports visible: ${airportData.airports.length} airports, ${airportData.runways.length} runways`);
}

// ---- Geo helpers ----

function geoToScene(lat, lon, userLat, userLon) {
  return {
    x: (lon - userLon) * GEO_SCALE * _cosLat,
    z: -(lat - userLat) * GEO_SCALE,
  };
}

// ---- Runway Rendering (ICAO-standard detail) ----

function renderRunway(rwy, userLat, userLon) {
  const startX = (rwy.startLon - userLon) * GEO_SCALE * _cosLat;
  const startZ = -(rwy.startLat - userLat) * GEO_SCALE;
  const endX = (rwy.endLon - userLon) * GEO_SCALE * _cosLat;
  const endZ = -(rwy.endLat - userLat) * GEO_SCALE;

  const dx = endX - startX;
  const dz = endZ - startZ;
  const rLen = Math.sqrt(dx * dx + dz * dz);
  const rWid = Math.max(rwy.width / METERS_PER_UNIT, 0.012);
  const headingRad = Math.atan2(-dz, dx);

  const cx = (startX + endX) / 2;
  const cz = (startZ + endZ) / 2;

  // Main runway surface with detailed ICAO markings
  const canvas = createRunwayTexture(rwy.ref, rwy.length, rwy.width);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4; // was 8 — halved GPU upload cost, still sharp at typical zoom

  const geo = new THREE.PlaneGeometry(rLen, rWid);
  const mat = new THREE.MeshBasicMaterial({
    map: texture, transparent: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = headingRad;
  mesh.position.set(cx, 0.038, cz);
  airportGroup.add(mesh);

  // Store scene-space data for lighting/tooltip functions
  rwy._sx = startX; rwy._sz = startZ;
  rwy._ex = endX; rwy._ez = endZ;
  rwy._cx = cx; rwy._cz = cz;
  rwy._headingRad = headingRad;
  rwy._rLen = rLen; rwy._rWid = rWid;
}

// ---- Runway Texture (ICAO Annex 14 precision markings) ----

// Cache textures by designation+width bucket — parallel runways (e.g. 04L/22R vs 04R/22L)
// share the same markings and can reuse the same GPU texture.
const _rwyTextureCache = new Map();

function createRunwayTexture(ref, lengthMeters, widthMeters) {
  const wBucket = Math.round(widthMeters / 5) * 5; // 5m buckets
  const cacheKey = `${ref}:${wBucket}`;
  if (_rwyTextureCache.has(cacheKey)) return _rwyTextureCache.get(cacheKey);

  const W = 2048;   // was 4096 — still crisp at typical zoom; 4× fewer pixels to paint
  const H = 192;    // was 320
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { alpha: false });
  const ppm = W / lengthMeters; // pixels per meter along runway

  ctx.clearRect(0, 0, W, H);

  // ── Asphalt base with realistic grain ──
  ctx.fillStyle = 'rgba(14, 18, 28, 0.82)';
  ctx.fillRect(0, 0, W, H);

  // Subtle longitudinal texture streaks (tyre rubber buildup)
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  const rubberZoneW = H * 0.3;
  ctx.fillRect(0, (H - rubberZoneW) / 2, W, rubberZoneW);

  // Asphalt grain noise (reduced — invisible at typical zoom distance)
  ctx.fillStyle = 'rgba(255,255,255,0.015)';
  for (let i = 0; i < 80; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 3, 1);
  }
  // Dark speckle
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let i = 0; i < 40; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 2 + Math.random() * 5, 1 + Math.random() * 2);
  }

  // Pavement joint lines (~25m intervals)
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1;
  const jointSpacing = Math.max(ppm * 25, 35);
  for (let x = jointSpacing; x < W; x += jointSpacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }

  // ── Edge stripes (continuous white, ICAO standard ~0.9m width) ──
  const edgeW = Math.max(H * 0.022, 2);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(0, 1, W, edgeW);
  ctx.fillRect(0, H - 1 - edgeW, W, edgeW);

  // ── Threshold bars (piano keys) ──
  // ICAO: width ≥45m → 16, ≥30m → 12, ≥23m → 8, else 6
  const numBars = widthMeters >= 45 ? 16 : widthMeters >= 30 ? 12 : widthMeters >= 23 ? 8 : 6;
  const barL = Math.max(ppm * 30, 35); // ~30m stripe length
  const barW = Math.max(H * 0.025, 3); // stripe width across runway
  const usableH = H * 0.82;
  const barGap = (usableH - numBars * barW) / (numBars - 1);
  const barStartY = (H - usableH) / 2;
  const threshOff = Math.max(ppm * 6, 12); // 6m inset from edge

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  for (let i = 0; i < numBars; i++) {
    const by = barStartY + i * (barW + barGap);
    ctx.fillRect(threshOff, by, barL, barW);                     // left threshold
    ctx.fillRect(W - threshOff - barL, by, barL, barW);          // right threshold
  }

  // Threshold demarcation line (solid white bar across width after piano keys)
  const threshLineX = threshOff + barL + Math.max(ppm * 3, 5);
  const threshLineW = Math.max(ppm * 1.8, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(threshLineX, edgeW + 2, threshLineW, H - 2 * edgeW - 4);
  ctx.fillRect(W - threshLineX - threshLineW, edgeW + 2, threshLineW, H - 2 * edgeW - 4);

  // ── Runway designator numbers (rotated along runway axis) ──
  // Numbers are oriented so pilots read them on approach: tops face the threshold
  const parts = ref.split('/');
  const fontSize = Math.floor(H * 0.45);
  const numX = threshLineX + threshLineW + Math.max(ppm * 20, 30);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `900 ${fontSize}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Left threshold: tops point into runway (so pilots read it on approach)
  if (parts[0]) {
    ctx.save();
    ctx.translate(numX, H / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(parts[0], 0, 0);
    ctx.restore();
  }
  // Right threshold: tops point into runway (so pilots read it on approach)
  if (parts[1]) {
    ctx.save();
    ctx.translate(W - numX, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(parts[1], 0, 0);
    ctx.restore();
  }

  // ── Centerline dashes (ICAO: 30m dash, 20m gap, ~0.9m wide) ──
  const dashPx = Math.max(30 * ppm, 14);
  const gapPx = Math.max(20 * ppm, 9);
  const clStart = numX + Math.max(ppm * 30, 35);
  ctx.strokeStyle = 'rgba(255,255,255,0.42)';
  ctx.lineWidth = Math.max(H * 0.018, 2);
  ctx.setLineDash([dashPx, gapPx]);
  ctx.beginPath();
  ctx.moveTo(clStart, H / 2);
  ctx.lineTo(W - clStart, H / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Touchdown zone markings (ICAO paired rectangular bars) ──
  // Pairs at 150m intervals from 150m: 3→2→2→1→1 pairs
  const tdzPairCounts = [3, 2, 2, 1, 1];
  const tdzBarW = Math.max(ppm * 22.5, 12);
  const tdzBarH = Math.max(H * 0.04, 3);
  const tdzLateralOff = H * 0.22; // distance from center to inner edge of bar pair
  const tdzPairSpacing = tdzBarH * 1.8;
  ctx.fillStyle = 'rgba(255,255,255,0.35)';

  for (let i = 0; i < tdzPairCounts.length; i++) {
    const dist = (i + 1) * 150; // 150, 300, 450, 600, 750m
    const xL = threshOff + dist * ppm;
    const xR = W - threshOff - dist * ppm - tdzBarW;
    if (xL + tdzBarW > W * 0.4) continue;

    const count = tdzPairCounts[i];
    for (let p = 0; p < count; p++) {
      const yAbove = H / 2 - tdzLateralOff - p * tdzPairSpacing - tdzBarH;
      const yBelow = H / 2 + tdzLateralOff + p * tdzPairSpacing;
      ctx.fillRect(xL, yAbove, tdzBarW, tdzBarH);
      ctx.fillRect(xL, yBelow, tdzBarW, tdzBarH);
      ctx.fillRect(xR, yAbove, tdzBarW, tdzBarH);
      ctx.fillRect(xR, yBelow, tdzBarW, tdzBarH);
    }
  }

  // ── Aiming point markers (bold white rectangles at ~300m) ──
  const aimDist = 300 * ppm;
  if (aimDist > 10 && aimDist < W * 0.35) {
    const aimW = Math.max(ppm * 45, 28);
    const aimH = H * 0.28;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(threshOff + aimDist, (H - aimH) / 2, aimW, aimH);
    ctx.fillRect(W - threshOff - aimDist - aimW, (H - aimH) / 2, aimW, aimH);
  }

  // ── Fixed distance markers at 150m intervals (small single bars) ──
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  for (let d = 900; d <= 1500; d += 300) {
    const xL = threshOff + d * ppm;
    if (xL > W * 0.45) break;
    const fW = Math.max(ppm * 10, 6);
    const fH = H * 0.06;
    ctx.fillRect(xL, H * 0.25, fW, fH);
    ctx.fillRect(xL, H * 0.69, fW, fH);
    const xR = W - threshOff - d * ppm - fW;
    ctx.fillRect(xR, H * 0.25, fW, fH);
    ctx.fillRect(xR, H * 0.69, fW, fH);
  }

  _rwyTextureCache.set(cacheKey, canvas);
  return canvas;
}

// ---- Approach Lights (ALSF-2 — Approach Light System with Sequenced Flashers) ----

function renderApproachLights(rwy, userLat, userLon) {
  if (!rwy._sx) return; // need scene coords from renderRunway
  const sx = rwy._sx, sz = rwy._sz, ex = rwy._ex, ez = rwy._ez;
  const dx = ex - sx, dz = ez - sz;
  const len = Math.sqrt(dx * dx + dz * dz);
  if (len < 0.1) return;
  const nx = dx / len, nz = dz / len;

  _renderALSF2(sx, sz, -nx, -nz, rwy._rWid);
  _renderALSF2(ex, ez, nx, nz, rwy._rWid);
}

function _renderALSF2(threshX, threshZ, dirX, dirZ, rwyWid) {
  const positions = [];
  const colors = [];
  const sizes = [];
  const perpX = -dirZ, perpZ = dirX;
  const halfW = rwyWid * 0.5;

  // ALSF-2: 900m total approach, lights every 30m
  const spacing = 30 / METERS_PER_UNIT;
  const totalLen = 900 / METERS_PER_UNIT;
  const numLights = Math.floor(totalLen / spacing);

  for (let i = 1; i <= numLights; i++) {
    const dist = i * spacing;
    const distM = i * 30;
    const px = threshX + dirX * dist;
    const pz = threshZ + dirZ * dist;

    // Centerline light
    positions.push(px, 0.03, pz);
    if (distM <= 300) {
      colors.push(1.0, 0.15, 0.1); // red zone (inner 300m)
      sizes.push(0.014);
    } else {
      colors.push(1.0, 1.0, 0.85); // white/warm
      sizes.push(0.012);
    }

    // ── Sequenced flashers (outer 5 lights, 600-900m) ──
    if (distM >= 600 && distM % 60 === 0) {
      // Larger brighter strobe light
      positions.push(px, 0.035, pz);
      colors.push(1.0, 1.0, 1.0);
      sizes.push(0.022);
    }

    // ── Side barrettes (5 lights per side at each station) ──
    if (distM <= 300 && distM % 30 === 0) {
      // Red side row lights in inner 300m
      const sideSpan = halfW * 0.8;
      for (let j = 1; j <= 5; j++) {
        const off = (j / 5) * sideSpan;
        positions.push(px + perpX * off, 0.03, pz + perpZ * off);
        positions.push(px - perpX * off, 0.03, pz - perpZ * off);
        colors.push(1.0, 0.15, 0.1, 1.0, 0.15, 0.1);
        sizes.push(0.008, 0.008);
      }
    }

    // ── Crossbars at 150m, 300m, 450m, 600m ──
    if (distM === 150 || distM === 300 || distM === 450 || distM === 600) {
      const crossSpan = distM <= 300 ? halfW * 1.2 : halfW * 1.5;
      const crossCount = distM <= 300 ? 8 : 6;
      const isDecisionBar = distM === 300; // decision bar — brighter
      for (let j = -crossCount; j <= crossCount; j++) {
        if (j === 0) continue;
        const off = (j / crossCount) * crossSpan;
        positions.push(px + perpX * off, 0.03, pz + perpZ * off);
        if (isDecisionBar) {
          colors.push(1.0, 0.15, 0.1); // red decision bar
          sizes.push(0.014);
        } else {
          colors.push(1.0, 1.0, 0.85);
          sizes.push(0.010);
        }
      }
    }

    // ── Roll guidance lights (pair flanking centerline, 300-900m) ──
    if (distM > 300 && distM % 60 === 0) {
      const rollOff = halfW * 0.15;
      positions.push(px + perpX * rollOff, 0.03, pz + perpZ * rollOff);
      positions.push(px - perpX * rollOff, 0.03, pz - perpZ * rollOff);
      colors.push(1.0, 1.0, 0.85, 1.0, 1.0, 0.85);
      sizes.push(0.009, 0.009);
    }
  }

  if (positions.length === 0) return;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // Use custom sizes via PointsMaterial — approximate with average
  const mat = new THREE.PointsMaterial({
    size: 0.006, transparent: true, opacity: 0.65,
    vertexColors: true, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  points.name = 'approachLights';
  _approachLightMeshes.push(points);
  airportGroup.add(points);
}

// ---- Runway Edge Lights (batched, with color zones) ----

function renderRunwayEdgeLights(runways, userLat, userLon) {
  const positions = [];
  const colors = [];

  for (const rwy of runways) {
    if (!rwy._sx) continue;
    const sx = rwy._sx, sz = rwy._sz, ex = rwy._ex, ez = rwy._ez;
    const dx = ex - sx, dz = ez - sz;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.1) continue;
    const nx = dx / len, nz = dz / len;
    const perpX = -nz, perpZ = nx;

    const halfW = Math.max(rwy._rWid * 0.52, 0.007); // slightly outside edge
    const spacing = 50 / METERS_PER_UNIT;             // 50m spacing (was 60m)
    const numLights = Math.floor(len / spacing);

    for (let i = 0; i <= numLights; i++) {
      const t = i / numLights;
      const px = sx + dx * t;
      const pz = sz + dz * t;

      positions.push(px + perpX * halfW, 0.035, pz + perpZ * halfW);
      positions.push(px - perpX * halfW, 0.035, pz - perpZ * halfW);

      const distFromStart = t * len * METERS_PER_UNIT;
      const distFromEnd = (1 - t) * len * METERS_PER_UNIT;
      const minDist = Math.min(distFromStart, distFromEnd);

      let r, g, b;
      if (minDist < 300) { r = 1.0; g = 0.12; b = 0.08; }     // deep red
      else if (minDist < 600) { r = 1.0; g = 0.72; b = 0.10; } // rich amber
      else { r = 0.95; g = 0.97; b = 1.0; }                    // cool white
      colors.push(r, g, b, r, g, b);
    }
  }

  if (positions.length === 0) return;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // Core bright lights
  _runwayEdgeLightMesh = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.002, transparent: true, opacity: 0.85,
    vertexColors: true, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  _runwayEdgeLightMesh.name = 'runwayEdgeLights';
  airportGroup.add(_runwayEdgeLightMesh);

  // Bloom glow halo layer (larger, softer, same colors)
  const glowGeo = geo.clone();
  const glowMesh = new THREE.Points(glowGeo, new THREE.PointsMaterial({
    size: 0.007, transparent: true, opacity: 0.08,
    vertexColors: true, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  glowMesh.name = 'runwayEdgeLightsGlow';
  airportGroup.add(glowMesh);
}


// ---- Threshold Bar Lights (green) + Runway End Lights (red) ----

function renderThresholdAndEndLights(runways) {
  const positions = [];
  const colors = [];

  for (const rwy of runways) {
    if (!rwy._sx) continue;
    const sx = rwy._sx, sz = rwy._sz, ex = rwy._ex, ez = rwy._ez;
    const dx = ex - sx, dz = ez - sz;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.1) continue;
    const perpX = -(ez - sz) / len, perpZ = (ex - sx) / len;
    const halfW = rwy._rWid * 0.5;
    const numLights = 14; // lights across threshold width

    // Green threshold lights at BOTH thresholds (visible to arriving aircraft)
    // Red end lights at BOTH ends (visible to departing aircraft)
    // In reality, each threshold shows green to approach and red to departure
    // We render green on the approach-facing side
    for (let end = 0; end < 2; end++) {
      const bx = end === 0 ? sx : ex;
      const bz = end === 0 ? sz : ez;

      for (let j = 0; j <= numLights; j++) {
        const t = j / numLights - 0.5; // -0.5 to +0.5
        const lx = bx + perpX * t * halfW * 2;
        const lz = bz + perpZ * t * halfW * 2;

        // Green threshold lights (slightly elevated)
        positions.push(lx, 0.04, lz);
        colors.push(0.05, 1.0, 0.25);  // vivid green
      }
    }

    // REIL — Runway End Identifier Lights (bright strobes at threshold corners)
    for (let end = 0; end < 2; end++) {
      const bx = end === 0 ? sx : ex;
      const bz = end === 0 ? sz : ez;
      // Two lights, one at each edge
      positions.push(bx + perpX * halfW * 1.05, 0.048, bz + perpZ * halfW * 1.05);
      positions.push(bx - perpX * halfW * 1.05, 0.048, bz - perpZ * halfW * 1.05);
      colors.push(1.0, 1.0, 1.0, 1.0, 1.0, 1.0); // bright white strobes
    }
  }

  if (positions.length === 0) return;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // Core lights
  _thresholdBarMesh = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.0025, transparent: true, opacity: 0.88,
    vertexColors: true, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  _thresholdBarMesh.name = 'thresholdLights';
  airportGroup.add(_thresholdBarMesh);

  // Glow halo for threshold/REIL
  const threshGlowGeo = geo.clone();
  const threshGlow = new THREE.Points(threshGlowGeo, new THREE.PointsMaterial({
    size: 0.008, transparent: true, opacity: 0.08,
    vertexColors: true, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  threshGlow.name = 'thresholdLightsGlow';
  airportGroup.add(threshGlow);
}

// ---- Runway Threshold Hit Targets (for hover tooltips) ----

function renderRunwayThresholdTargets(runways) {
  for (const rwy of runways) {
    if (!rwy._sx) continue;
    // Create hit spheres at each threshold end
    for (let end = 0; end < 2; end++) {
      const x = end === 0 ? rwy._sx : rwy._ex;
      const z = end === 0 ? rwy._sz : rwy._ez;
      const desig = rwy.ref.split('/')[end] || rwy.ref;

      const hitGeo = new THREE.SphereGeometry(0.15, 6, 6);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(x, 0.05, z);
      hitMesh.userData.runwayThreshold = {
        designator: desig,
        fullRef: rwy.ref,
        heading: Math.round(rwy.heading),
        length: Math.round(rwy.length),
        width: Math.round(rwy.width),
        surface: rwy.surface,
        lat: end === 0 ? rwy.startLat : rwy.endLat,
        lon: end === 0 ? rwy.startLon : rwy.endLon,
      };
      airportGroup.add(hitMesh);
      _runwayThresholdTargets.push(hitMesh);
    }
  }
}

// ---- Taxiway Rendering (batched, with edge lines and hold-short markings) ----

function renderTaxiwaysBatched(taxiways, userLat, userLon) {
  if (!taxiways || taxiways.length === 0) return;

  const surfPositions = [];
  const surfColors = [];

  for (const twy of taxiways) {
    if (twy.geometry.length < 2) continue;
    const scenePoints = twy.geometry.map(p => geoToScene(p.lat, p.lon, userLat, userLon));
    const twyWidth = Math.max(twy.width / METERS_PER_UNIT, 0.008);

    for (let i = 0; i < scenePoints.length - 1; i++) {
      const a = scenePoints[i], b = scenePoints[i + 1];
      const dx = b.x - a.x, dz = b.z - a.z;
      const segLen = Math.sqrt(dx * dx + dz * dz);
      if (segLen < 0.001) continue;

      const nx = dx / segLen, nz = dz / segLen;
      const perpX = -nz * twyWidth * 0.5;
      const perpZ = nx * twyWidth * 0.5;

      // Surface quad (two triangles)
      surfPositions.push(
        a.x + perpX, 0.025, a.z + perpZ,
        a.x - perpX, 0.025, a.z - perpZ,
        b.x + perpX, 0.025, b.z + perpZ,
        b.x + perpX, 0.025, b.z + perpZ,
        a.x - perpX, 0.025, a.z - perpZ,
        b.x - perpX, 0.025, b.z - perpZ,
      );
      for (let j = 0; j < 6; j++) surfColors.push(0.04, 0.06, 0.10); // darker asphalt

    }
  }

  if (surfPositions.length > 0) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(surfPositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(surfColors, 3));
    airportGroup.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.72,
      side: THREE.DoubleSide, depthWrite: false,
    })));
  }


  // Green centerline + blue edge lights
  renderTaxiwayLights(taxiways, userLat, userLon);
}

function renderTaxiwayLights(taxiways, userLat, userLon) {
  const centerPositions = [];
  const edgeLightPositions = [];
  const edgeLightColors = [];

  for (const twy of taxiways) {
    if (twy.geometry.length < 2) continue;
    const scenePoints = twy.geometry.map(p => geoToScene(p.lat, p.lon, userLat, userLon));
    const twyWidth = Math.max(twy.width / METERS_PER_UNIT, 0.008);
    const clSpacing = 15 / METERS_PER_UNIT;   // green centerline every 15m
    const edgeSpacing = 30 / METERS_PER_UNIT;  // blue edge lights every 30m

    let accumCL = 0, accumEdge = 0;
    for (let i = 0; i < scenePoints.length - 1; i++) {
      const a = scenePoints[i], b = scenePoints[i + 1];
      const dx = b.x - a.x, dz = b.z - a.z;
      const segLen = Math.sqrt(dx * dx + dz * dz);
      if (segLen < 0.001) continue;
      const nx = dx / segLen, nz = dz / segLen;
      const perpX = -nz * twyWidth * 0.52;
      const perpZ = nx * twyWidth * 0.52;

      // Green centerline lights
      while (accumCL < segLen) {
        const t = accumCL / segLen;
        centerPositions.push(a.x + dx * t, 0.028, a.z + dz * t);
        accumCL += clSpacing;
      }
      accumCL -= segLen;

      // Blue edge lights
      while (accumEdge < segLen) {
        const t = accumEdge / segLen;
        const px = a.x + dx * t, pz = a.z + dz * t;
        edgeLightPositions.push(px + perpX, 0.03, pz + perpZ);
        edgeLightPositions.push(px - perpX, 0.03, pz - perpZ);
        edgeLightColors.push(0.1, 0.3, 1.0, 0.1, 0.3, 1.0);
        accumEdge += edgeSpacing;
      }
      accumEdge -= segLen;
    }
  }

  // Green centerline lights
  if (centerPositions.length > 0) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(centerPositions, 3));
    // Core
    _taxiwayLightMesh = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x22ee66, size: 0.0015, transparent: true, opacity: 0.65,
      sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    _taxiwayLightMesh.name = 'taxiwayLights';
    airportGroup.add(_taxiwayLightMesh);
    // Glow halo
    const clGlowGeo = geo.clone();
    const clGlow = new THREE.Points(clGlowGeo, new THREE.PointsMaterial({
      color: 0x22ee66, size: 0.005, transparent: true, opacity: 0.09,
      sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    clGlow.name = 'taxiwayLightsGlow';
    airportGroup.add(clGlow);
  }

  // Blue edge lights
  if (edgeLightPositions.length > 0) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(edgeLightPositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(edgeLightColors, 3));
    // Core
    const mesh = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.0015, transparent: true, opacity: 0.65,
      vertexColors: true, sizeAttenuation: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    mesh.name = 'taxiwayEdgeLights';
    airportGroup.add(mesh);
    // Glow halo
    const edgeGlowGeo = geo.clone();
    const edgeGlow = new THREE.Points(edgeGlowGeo, new THREE.PointsMaterial({
      size: 0.005, transparent: true, opacity: 0.08,
      vertexColors: true, sizeAttenuation: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    edgeGlow.name = 'taxiwayEdgeLightsGlow';
    airportGroup.add(edgeGlow);
  }
}

// ---- Terminal Building Rendering ----

function renderTerminal(term, userLat, userLon) {
  if (!term.geometry || term.geometry.length < 3) return;

  const scenePoints = term.geometry.map(p => geoToScene(p.lat, p.lon, userLat, userLon));

  // Build 2D shape for extrusion
  const shape = new THREE.Shape();
  shape.moveTo(scenePoints[0].x, -scenePoints[0].z); // Shape uses XY, we map X→X, Z→-Y
  for (let i = 1; i < scenePoints.length; i++) {
    shape.lineTo(scenePoints[i].x, -scenePoints[i].z);
  }
  shape.closePath();

  // Flat footprint on ground — deep slate, high contrast
  const footGeo = new THREE.ShapeGeometry(shape);
  const footMat = new THREE.MeshBasicMaterial({
    color: 0x0c1520, transparent: true, opacity: 0.78,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const footMesh = new THREE.Mesh(footGeo, footMat);
  footMesh.rotation.x = -Math.PI / 2;
  footMesh.position.y = 0.02;
  airportGroup.add(footMesh);

  // Extruded volume — taller, more structural presence
  const extGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.022, bevelEnabled: false,
  });
  const extMat = new THREE.MeshBasicMaterial({
    color: 0x14233e, transparent: true, opacity: 0.50,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const extMesh = new THREE.Mesh(extGeo, extMat);
  extMesh.rotation.x = -Math.PI / 2;
  extMesh.position.y = 0.02;
  airportGroup.add(extMesh);

  // Warm amber edge glow — premium terminal highlight
  const edgeVerts = [];
  for (let i = 0; i < scenePoints.length; i++) {
    const p = scenePoints[i];
    const next = scenePoints[(i + 1) % scenePoints.length];
    edgeVerts.push(p.x, 0.045, p.z, next.x, 0.045, next.z);
  }
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeVerts, 3));
  const edgeLine = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({
    color: 0xc8a050, transparent: true, opacity: 0.55,
    depthWrite: false,
  }));
  airportGroup.add(edgeLine);

  // Soft outer glow ring (wider, very faint)
  const glowEdgeGeo = new THREE.BufferGeometry();
  glowEdgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeVerts, 3));
  const glowEdgeLine = new THREE.LineSegments(glowEdgeGeo, new THREE.LineBasicMaterial({
    color: 0xf0c060, transparent: true, opacity: 0.12,
    depthWrite: false,
  }));
  airportGroup.add(glowEdgeLine);
}

// ---- Airport Label (clean text, no background) ----

function renderAirportLabel(apt, userLat, userLon) {
  const cx = (apt.lon - userLon) * GEO_SCALE * _cosLat;
  const cz = -(apt.lat - userLat) * GEO_SCALE;

  const code = apt.iata || apt.icao;
  if (!code) return;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  // Thin line accent above code
  ctx.fillStyle = 'rgba(90,172,255,0.3)';
  ctx.fillRect(216, 8, 80, 1);

  // Airport code
  ctx.font = '500 72px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText(code, 256, 58);

  // Airport name — smaller, muted
  if (apt.name && apt.name !== code) {
    ctx.font = '300 26px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    const shortName = apt.name.length > 24 ? apt.name.substring(0, 24) + '...' : apt.name;
    ctx.fillText(shortName, 256, 112);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  const spriteMat = new THREE.SpriteMaterial({
    map: tex, transparent: true, depthWrite: false, depthTest: false,
    sizeAttenuation: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(0.11, 0.035, 1);
  sprite.position.set(cx, 0.5, cz - 0.15);
  sprite.renderOrder = 100;
  sprite.center.set(0.5, 0);
  sprite.userData.airport = apt;
  airportGroup.add(sprite);
  airportHitTargets.push(sprite);

  // Diamond marker instead of circle beacon
  const markerSize = 0.05;
  const markerShape = new THREE.BufferGeometry();
  markerShape.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, -markerSize,   markerSize, 0, 0,
    markerSize, 0, 0,    0, 0, markerSize,
    0, 0, markerSize,    -markerSize, 0, 0,
    -markerSize, 0, 0,   0, 0, -markerSize,
  ], 3));
  const markerMat = new THREE.LineBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.2,
  });
  const marker = new THREE.LineSegments(markerShape, markerMat);
  marker.position.set(cx, 0.04, cz);
  marker.name = 'aptBeacon';
  _aptBeacons.push(marker);
  airportGroup.add(marker);

  // Hit target for raycasting — generous sphere covers airport area
  const hitGeo = new THREE.SphereGeometry(4.5, 6, 6);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.position.set(cx, 0.3, cz);
  hitMesh.userData.airport = apt;
  airportGroup.add(hitMesh);
  airportHitTargets.push(hitMesh);
}

// ---- Airport Selection ----

export function selectAirport(scene, airport) {
  deselectAirport(scene);

  const cx = (airport.lon - _userLon) * GEO_SCALE * _cosLat;
  const cz = -(airport.lat - _userLat) * GEO_SCALE;
  _selectionAnimObjects = [];

  // Inner ring
  const ring1Geo = new THREE.RingGeometry(1.2, 1.4, 64);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x4d9fff, transparent: true, opacity: 0.5,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = -Math.PI / 2;
  ring1.position.set(cx, 0.05, cz);
  scene.add(ring1);
  _selectionAnimObjects.push(ring1);

  // Outer pulse ring
  const ring2Geo = new THREE.RingGeometry(2.0, 2.15, 64);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x4d9fff, transparent: true, opacity: 0.2,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = -Math.PI / 2;
  ring2.position.set(cx, 0.046, cz);
  ring2.name = '_selPulse';
  scene.add(ring2);
  _selectionAnimObjects.push(ring2);

  selectedHighlight = { objects: _selectionAnimObjects, cx, cz };
}

export function deselectAirport(scene) {
  if (selectedHighlight) {
    for (const obj of selectedHighlight.objects) {
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    }
    selectedHighlight = null;
    _selectionAnimObjects = [];
  }
}

// ---- Pulse animation (called from main loop) ----

export function updatePulse(scene, time) {
  // User location pulse ring — cached ref, no scene traversal
  if (_pulseRingRef) {
    const cycle = (time % 5) / 5;
    const scale = 1 + cycle * 3;
    _pulseRingRef.scale.set(scale, scale, 1);
    _pulseRingRef.material.opacity = 0.15 * (1 - cycle * cycle);
  }

  // Airport beacon pulse — iterate cached array, no forEach with string compare
  const beaconOpacity = 0.15 + 0.1 * Math.sin(time * 1.5);
  for (let i = 0; i < _aptBeacons.length; i++) {
    _aptBeacons[i].material.opacity = beaconOpacity;
  }

  // Approach light shimmer — one value shared across all approach light batches
  const approachOpacity = 0.4 + 0.2 * Math.sin(time * 2);
  for (let i = 0; i < _approachLightMeshes.length; i++) {
    _approachLightMeshes[i].material.opacity = approachOpacity;
  }

  // Runway edge lights — single batched mesh
  if (_runwayEdgeLightMesh) {
    _runwayEdgeLightMesh.material.opacity = 0.35 + 0.15 * Math.sin(time * 1.8 + 0.5);
  }

  // Taxiway lights — single batched mesh
  if (_taxiwayLightMesh) {
    _taxiwayLightMesh.material.opacity = 0.25 + 0.1 * Math.sin(time * 1.2 + 1);
  }


  // Threshold bar lights — steady green glow
  if (_thresholdBarMesh) {
    _thresholdBarMesh.material.opacity = 0.6 + 0.1 * Math.sin(time * 1.5 + 0.3);
  }

  // Selection pulse — _selPulse is always index 1 when present
  if (selectedHighlight) {
    for (const obj of selectedHighlight.objects) {
      if (obj.name === '_selPulse') {
        const pCycle = (time % 2) / 2;
        obj.scale.set(1 + pCycle * 0.5, 1, 1 + pCycle * 0.5);
        obj.material.opacity = 0.2 * (1 - pCycle);
      }
    }
  }
}

// ---- Exports ----

export function clearGroundMap(scene) {
  abortMapLoads(); // cancel in-flight tile fetches for previous city
  for (const overlay of hiResOverlays) {
    scene.remove(overlay);
    if (overlay.geometry) overlay.geometry.dispose();
    if (overlay.material) {
      if (overlay.material.map) overlay.material.map.dispose();
      overlay.material.dispose();
    }
  }
  hiResOverlays.length = 0;
  if (groundMaterial && groundMaterial.map) {
    groundMaterial.map.dispose();
    groundMaterial.map = null;
    groundMaterial.needsUpdate = true;
  }
}

export function clearAirports(scene) {
  _loadEpoch++;        // invalidate any in-flight loadAirports call
  _rwyTextureCache.clear(); // free cached runway canvases on city switch
  clearAirportCache();
  deselectAirport(scene);
  _removeLoadingPlaceholder(scene);
  if (airportGroup) {
    scene.remove(airportGroup);
    airportGroup = null;
  }
  airportHitTargets.length = 0;
  airportData = null;
  _aptBeacons.length = 0;
  _approachLightMeshes.length = 0;
  _runwayEdgeLightMesh = null;
  _taxiwayLightMesh = null;

  _thresholdBarMesh = null;
  _runwayThresholdTargets.length = 0;
}

export function getAirportHitTargets() {
  return airportHitTargets;
}

export function getAirportData() {
  return airportData;
}

export function getRunwayThresholdTargets() {
  return _runwayThresholdTargets;
}

export { categorizeFlights };

// ============================================================
//  T2-17: Wind Direction Indicators on Runways
// ============================================================

let _windIndicatorGroup = null;
let _windLastUpdate = 0;
const WIND_UPDATE_INTERVAL = 30000; // 30s
const WIND_PROXIMITY_DEG = 0.3;     // ~33 km radius to consider aircraft "near" a runway
const WIND_ALT_THRESHOLD = 914.4;   // 3000 ft in meters

function _averageHeadings(headings) {
  // Average circular quantities (angles) using vector mean
  let sinSum = 0, cosSum = 0;
  for (let i = 0; i < headings.length; i++) {
    const rad = headings[i] * DEG;
    sinSum += Math.sin(rad);
    cosSum += Math.cos(rad);
  }
  let avgRad = Math.atan2(sinSum / headings.length, cosSum / headings.length);
  if (avgRad < 0) avgRad += Math.PI * 2;
  return avgRad; // returns radians
}

function _clearWindIndicators(scene) {
  if (_windIndicatorGroup) {
    scene.remove(_windIndicatorGroup);
    _windIndicatorGroup.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    _windIndicatorGroup = null;
  }
}

/**
 * Update wind direction indicators at runway thresholds.
 * Estimates wind direction from headings of aircraft below 3000 ft near runways.
 * @param {THREE.Scene} scene
 * @param {Array} runways - array of runway objects with startLat/Lon, endLat/Lon
 * @param {Array} aircraftList - array of aircraft state objects with latitude, longitude, baroAltitude, trueTrack
 */
export function updateWindIndicators(scene, runways, aircraftList) {
  const now = Date.now();
  if (now - _windLastUpdate < WIND_UPDATE_INTERVAL && _windIndicatorGroup) return;
  _windLastUpdate = now;

  if (!runways || runways.length === 0 || !aircraftList) return;

  // Collect headings of low-altitude aircraft near any runway
  const nearbyHeadings = [];
  for (let i = 0; i < aircraftList.length; i++) {
    const ac = aircraftList[i];
    if (ac.baroAltitude == null || ac.trueTrack == null) continue;
    if (ac.baroAltitude > WIND_ALT_THRESHOLD) continue;
    if (ac.latitude == null || ac.longitude == null) continue;

    // Check proximity to any runway
    for (let r = 0; r < runways.length; r++) {
      const rwy = runways[r];
      const dLat = Math.abs(ac.latitude - rwy.lat);
      const dLon = Math.abs(ac.longitude - rwy.lon);
      if (dLat < WIND_PROXIMITY_DEG && dLon < WIND_PROXIMITY_DEG) {
        nearbyHeadings.push(ac.trueTrack);
        break; // count each aircraft once
      }
    }
  }

  // If no low aircraft, remove indicators and bail
  if (nearbyHeadings.length === 0) {
    _clearWindIndicators(scene);
    return;
  }

  // Average heading approximates wind-favored direction (wind blows FROM this heading)
  const windFromRad = _averageHeadings(nearbyHeadings);

  // Clear old indicators
  _clearWindIndicators(scene);

  _windIndicatorGroup = new THREE.Group();
  _windIndicatorGroup.name = 'windIndicators';

  // Minimal chevron wind indicator — thin line-based, one per runway at midpoint
  // Design: tiny « chevron pointing into wind, gold accent, very subtle
  const chevronMat = new THREE.LineBasicMaterial({
    color: 0xc4a058, transparent: true, opacity: 0.3,
    depthWrite: false,
  });

  // Build a small chevron shape: two short lines forming a « pointing along +Z
  // Total width ~0.03, length ~0.04 — much smaller than old 0.12 cones
  const chevronPts = new Float32Array([
    -0.012, 0, -0.018,   0, 0, 0.018,  // left arm
     0, 0, 0.018,   0.012, 0, -0.018,  // right arm
  ]);
  const chevronGeo = new THREE.BufferGeometry();
  chevronGeo.setAttribute('position', new THREE.BufferAttribute(chevronPts, 3));

  for (const rwy of runways) {
    // Single indicator at runway midpoint — less clutter
    const pos = geoToScene(rwy.lat, rwy.lon, _userLat, _userLon);

    const chevron = new THREE.LineSegments(chevronGeo, chevronMat);
    // Rotate so chevron tip points into the wind direction
    // windFromRad is geographic heading in radians (0 = north)
    // Scene: heading 0 (north) = -Z → Y-rotation = π
    chevron.rotation.y = Math.PI - windFromRad;
    chevron.position.set(pos.x, 0.02, pos.z);

    _windIndicatorGroup.add(chevron);
  }

  scene.add(_windIndicatorGroup);
}


// ============================================================
//  T3-09: Landing Detection + Touchdown Effect
// ============================================================

const _prevOnGround = new Map();          // icao24 → boolean (was on ground / very low alt last check)
const _touchdownParticles = [];           // active particle systems
const _runwayFlashMeshes = [];            // active runway flash overlays
const LANDING_ALT_THRESHOLD = 100;        // meters — below this near a runway = "on ground"
const LANDING_PROXIMITY_DEG = 0.02;       // ~2.2 km — must be very close to a runway
const PARTICLE_COUNT = 20;
const PARTICLE_LIFETIME = 1.0;            // seconds

function _isNearRunway(lat, lon, runways) {
  for (let i = 0; i < runways.length; i++) {
    const rwy = runways[i];
    const dLat = Math.abs(lat - rwy.lat);
    const dLon = Math.abs(lon - rwy.lon);
    if (dLat < LANDING_PROXIMITY_DEG && dLon < LANDING_PROXIMITY_DEG) {
      return rwy;
    }
  }
  return null;
}

function _createDustPuff(scene, sceneX, sceneZ) {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = sceneX;
    positions[i * 3 + 1] = 0.05;
    positions[i * 3 + 2] = sceneZ;

    // Random outward velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.05 + Math.random() * 0.15;
    velocities.push({
      vx: Math.cos(angle) * speed,
      vy: 0.05 + Math.random() * 0.1,
      vz: Math.sin(angle) * speed,
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xccccaa, size: 0.03, transparent: true, opacity: 0.7,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  points.name = 'dustPuff';
  scene.add(points);

  _touchdownParticles.push({
    mesh: points,
    velocities,
    startTime: performance.now() / 1000,
    lifetime: PARTICLE_LIFETIME,
  });
}

function _flashRunway(scene, rwy) {
  const s = geoToScene(rwy.startLat, rwy.startLon, _userLat, _userLon);
  const e = geoToScene(rwy.endLat, rwy.endLon, _userLat, _userLon);

  const dx = e.x - s.x, dz = e.z - s.z;
  const rLen = Math.sqrt(dx * dx + dz * dz);
  const rWid = Math.max(rwy.width / METERS_PER_UNIT, 0.012) * 1.5;
  const headingRad = Math.atan2(-dz, dx);

  const cx = (s.x + e.x) / 2;
  const cz = (s.z + e.z) / 2;

  const geo = new THREE.PlaneGeometry(rLen, rWid);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.5,
    side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = headingRad;
  mesh.position.set(cx, 0.045, cz);
  scene.add(mesh);

  _runwayFlashMeshes.push({
    mesh,
    startTime: performance.now() / 1000,
    duration: 0.6,
  });
}

/**
 * Check for landing events by detecting aircraft transitioning from airborne to on-ground
 * near a runway. Creates visual effects (dust puff + runway flash).
 * @param {Array} aircraftStates - array of aircraft state objects
 * @param {Array} runways - array of runway objects
 * @returns {Array} landing events: [{ icao24, callsign, runway, lat, lon, time }]
 */
export function checkLandings(aircraftStates, runways, scene) {
  if (!aircraftStates || !runways || runways.length === 0) return [];

  const landings = [];
  const activeIcaos = new Set();

  for (let i = 0; i < aircraftStates.length; i++) {
    const ac = aircraftStates[i];
    if (!ac.icao24 || ac.latitude == null || ac.longitude == null) continue;

    activeIcaos.add(ac.icao24);

    const isLow = ac.baroAltitude != null && ac.baroAltitude < LANDING_ALT_THRESHOLD;
    const wasAirborne = _prevOnGround.has(ac.icao24) ? !_prevOnGround.get(ac.icao24) : false;

    if (isLow && wasAirborne) {
      // Check if near a runway
      const nearRwy = _isNearRunway(ac.latitude, ac.longitude, runways);
      if (nearRwy) {
        const event = {
          icao24: ac.icao24,
          callsign: ac.callsign || ac.icao24,
          runway: nearRwy.ref || 'unknown',
          lat: ac.latitude,
          lon: ac.longitude,
          time: Date.now(),
        };
        landings.push(event);

        // Visual effects
        if (scene) {
          const pos = geoToScene(ac.latitude, ac.longitude, _userLat, _userLon);
          _createDustPuff(scene, pos.x, pos.z);
          _flashRunway(scene, nearRwy);
        }
      }
    }

    _prevOnGround.set(ac.icao24, isLow);
  }

  // Cleanup stale entries (aircraft no longer in the data)
  if (_prevOnGround.size > activeIcaos.size * 2) {
    for (const key of _prevOnGround.keys()) {
      if (!activeIcaos.has(key)) _prevOnGround.delete(key);
    }
  }

  return landings;
}

// ============================================================
//  T3-12: Day/Night Cycle
// ============================================================

/**
 * Update sky dome colors and ambient light based on approximate solar position.
 * Uses a simple equinox-approximation (declination = 0).
 *
 * @param {THREE.Scene} scene
 * @param {number} userLat  - user latitude in degrees
 * @param {number} userLon  - user longitude in degrees
 * @param {number} utcHours - current UTC time as fractional hours (0-24)
 */
export function updateDayNight(scene, userLat, userLon, utcHours) {
  // Resolve references lazily if createEnvironment was called before module vars were set
  if (!_skyDomeRef) {
    _skyDomeRef = scene.getObjectByName('skyDome') || null;
    if (_skyDomeRef) {
      const colAttr = _skyDomeRef.geometry.attributes.color;
      if (colAttr && !_skyBaseColors) {
        _skyBaseColors = new Float32Array(colAttr.array);
      }
    }
  }
  if (!_ambientLightRef) {
    _ambientLightRef = scene.getObjectByName('ambientLight') || null;
  }

  // ---------- Solar altitude (equinox: declination ≈ 0) ----------
  const latRad = userLat * DEG;
  const solarNoon = 12 - userLon / 15;                       // UTC hour of local solar noon
  const hourAngle = (utcHours - solarNoon) * 15 * DEG;       // radians
  // sin(altitude) = sin(lat)*sin(dec) + cos(lat)*cos(dec)*cos(HA)
  // With dec = 0: sin(alt) = cos(lat) * cos(HA)
  const sinAlt = Math.cos(latRad) * Math.cos(hourAngle);

  // ---------- Day factor: 0 = full night, 1 = full day ----------
  // Transition band: sinAlt in [-0.1, 0.1] maps linearly to [0,1].
  // sinAlt ≈ 0 corresponds to the horizon; ±0.1 gives roughly ±1 hour
  // around sunrise/sunset.
  const TRANSITION_HALF = 0.1;
  const dayFactor = Math.max(0, Math.min(1, (sinAlt + TRANSITION_HALF) / (2 * TRANSITION_HALF)));

  // ---------- Ambient light ----------
  if (_ambientLightRef) {
    // Night = 0.7 (existing baseline), Day = 1.0
    _ambientLightRef.intensity = 0.7 + 0.3 * dayFactor;
  }

  // ---------- Sky dome vertex colors ----------
  if (_skyDomeRef && _skyBaseColors) {
    const colAttr = _skyDomeRef.geometry.attributes.color;
    const arr = colAttr.array;
    // Day brightness boost: multiply each channel by (1 + dayFactor * boost).
    // Keeps night colors unchanged (dayFactor=0 → multiplier=1) and
    // makes daytime sky moderately brighter.
    const boost = 1.2; // up to 2.2× brighter at full day
    const multiplier = 1 + dayFactor * boost;

    for (let i = 0, len = _skyBaseColors.length; i < len; i++) {
      arr[i] = Math.min(_skyBaseColors[i] * multiplier, 1.0);
    }
    colAttr.needsUpdate = true;
  }
}

/**
 * Animate active touchdown effects (dust puffs and runway flashes).
 * Call this from the main render loop.
 */
export function updateTouchdownEffects(scene) {
  const now = performance.now() / 1000;

  // Update dust puff particles
  for (let i = _touchdownParticles.length - 1; i >= 0; i--) {
    const p = _touchdownParticles[i];
    const elapsed = now - p.startTime;

    if (elapsed >= p.lifetime) {
      // Remove expired particle system
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      _touchdownParticles.splice(i, 1);
      continue;
    }

    const t = elapsed / p.lifetime;
    const posAttr = p.mesh.geometry.attributes.position;
    const dt = 1 / 60; // approximate frame delta

    for (let j = 0; j < PARTICLE_COUNT; j++) {
      const v = p.velocities[j];
      posAttr.setX(j, posAttr.getX(j) + v.vx * dt);
      posAttr.setY(j, posAttr.getY(j) + v.vy * dt);
      posAttr.setZ(j, posAttr.getZ(j) + v.vz * dt);
      v.vy -= 0.08 * dt; // gravity
    }

    posAttr.needsUpdate = true;
    p.mesh.material.opacity = 0.7 * (1 - t * t); // fade out
  }

  // Update runway flashes
  for (let i = _runwayFlashMeshes.length - 1; i >= 0; i--) {
    const f = _runwayFlashMeshes[i];
    const elapsed = now - f.startTime;

    if (elapsed >= f.duration) {
      scene.remove(f.mesh);
      f.mesh.geometry.dispose();
      f.mesh.material.dispose();
      _runwayFlashMeshes.splice(i, 1);
      continue;
    }

    const t = elapsed / f.duration;
    f.mesh.material.opacity = 0.5 * (1 - t); // linear fade
  }
}

// ── FIR Boundaries ──────────────────────────────────────────────────────────

let _firGroup = null;
let _firVisible = true; // Always on
let _firLoadedForLat = null;
let _firLoadedForLon = null;

async function loadFIRBoundaries(scene, lat, lon) {
  // Skip if already loaded for this approximate location
  if (_firGroup && _firLoadedForLat != null &&
      Math.abs(lat - _firLoadedForLat) < 2 && Math.abs(lon - _firLoadedForLon) < 2) {
    return;
  }

  _clearFIRBoundaries(scene);

  const allFirs = await fetchFIRData();
  if (!allFirs) return;
  _firCache_ref = allFirs;

  const nearby = filterNearbyFIRs(allFirs, lat, lon, 10);
  if (nearby.length === 0) return;

  _firGroup = new THREE.Group();
  _firGroup.name = 'firBoundaries';

  // Dotted material — tiny dots for boundary lines
  const lineMat = new THREE.LineDashedMaterial({
    color: 0xc4a058,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    dashSize: 0.02,
    gapSize: 0.04,
  });

  // Oceanic — subtler dots
  const oceanicMat = new THREE.LineDashedMaterial({
    color: 0x88aacc,
    transparent: true,
    opacity: 0.09,
    depthWrite: false,
    dashSize: 0.02,
    gapSize: 0.05,
  });

  const GROUND_HALF = GROUND_SIZE / 2;

  for (const fir of nearby) {
    const mat = fir.oceanic ? oceanicMat : lineMat;

    for (const ring of fir.polygons) {
      const vertices = [];
      for (const coord of ring) {
        const p = geoToScene(coord[1], coord[0], lat, lon);
        vertices.push(p.x, 0.008, p.z);
      }

      if (vertices.length >= 6) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const line = new THREE.Line(geo, mat);
        line.computeLineDistances();
        _firGroup.add(line);
      }
    }

    // FIR label at the center
    if (!fir.oceanic) {
      const labelPos = geoToScene(fir.labelLat, fir.labelLon, lat, lon);
      if (Math.abs(labelPos.x) < GROUND_HALF && Math.abs(labelPos.z) < GROUND_HALF) {
        const label = _createFIRLabel(fir.id);
        label.position.set(labelPos.x, 0.15, labelPos.z);
        _firGroup.add(label);
      }
    }
  }

  scene.add(_firGroup);
  _firLoadedForLat = lat;
  _firLoadedForLon = lon;
  console.log(`[STRATUM] FIR boundaries rendered: ${nearby.length} regions`);
}

function _createFIRLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(196, 160, 88, 0.5)';
  ctx.fillText(text, 64, 16);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.4, 0.6, 1);
  return sprite;
}

function _clearFIRBoundaries(scene) {
  if (_firGroup) {
    scene.remove(_firGroup);
    _firGroup.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    });
    _firGroup = null;
  }
  _firLoadedForLat = null;
  _firLoadedForLon = null;
}

export function clearFIRBoundaries(scene) {
  _clearFIRBoundaries(scene);
}

/**
 * Look up which FIR an aircraft is currently in.
 * Uses a simple point-in-polygon test.
 * @param {number} lat - Aircraft latitude
 * @param {number} lon - Aircraft longitude
 * @returns {string|null} FIR identifier (e.g., "EGTT", "KZNY") or null
 */
export function getFIRForPosition(lat, lon) {
  return _findFIR(lat, lon);
}

/**
 * Convert scene (x, z) back to geographic (lat, lon).
 */
export function sceneToGeo(x, z) {
  return {
    lat: _userLat - z / GEO_SCALE,
    lon: _userLon + x / (GEO_SCALE * _cosLat),
  };
}

function _findFIR(lat, lon) {
  // Lazy import from cache
  const firs = _firCache_ref;
  if (!firs) return null;

  for (const fir of firs) {
    if (fir.oceanic) continue;
    for (const ring of fir.polygons) {
      if (_pointInPolygon(lat, lon, ring)) return fir.id;
    }
  }
  return null;
}

// Cache reference — set when FIR data loads
let _firCache_ref = null;

export async function reloadFIRForLocation(scene, lat, lon) {
  const allFirs = await fetchFIRData();
  if (allFirs) _firCache_ref = allFirs;
  _clearFIRBoundaries(scene);
  await loadFIRBoundaries(scene, lat, lon);
}

// ── Navaid / Airway Chart ────────────────────────────────────────────────────

let _navGroup = null;
let _navLoadedLat = null;
let _navLoadedLon = null;
let _navHitTargets = [];

async function loadNavChart(scene, lat, lon) {
  if (_navGroup && _navLoadedLat != null &&
      Math.abs(lat - _navLoadedLat) < 2 && Math.abs(lon - _navLoadedLon) < 2) {
    return;
  }

  _clearNavChart(scene);

  const allNavaids = await fetchNavaidData();
  if (!allNavaids) return;

  const nearby = filterNearbyNavaids(allNavaids, lat, lon, 2.5);
  if (nearby.length === 0) return;

  _navGroup = new THREE.Group();
  _navGroup.name = 'navChart';

  const GROUND_HALF = GROUND_SIZE / 2;
  const NM_TO_SCENE = GEO_SCALE / 60; // 1 NM in scene units

  // ── Navaid symbols (tiny, subtle — like real chart overlays) ──
  const vors = nearby.filter(n => n.type === 'VOR' || n.type === 'VOR-DME' || n.type === 'VORTAC');
  const ndbs = nearby.filter(n => n.type === 'NDB' || n.type === 'NDB-DME');

  const Y_NAV = 0.04;
  const OUTER_R = 0.10;
  const INNER_R = 0.055;
  const OUTER_DOTS = 12;
  const INNER_DOTS = 6;

  // ── Batched VOR dots ──
  const vorPositions = [];
  const vorScenePos = []; // {nav, pos} for labels + airway connections

  for (const nav of vors) {
    const pos = geoToScene(nav.lat, nav.lon, lat, lon);
    if (Math.abs(pos.x) > GROUND_HALF || Math.abs(pos.z) > GROUND_HALF) continue;

    for (let i = 0; i < OUTER_DOTS; i++) {
      const a = (i / OUTER_DOTS) * Math.PI * 2;
      vorPositions.push(pos.x + Math.cos(a) * OUTER_R, Y_NAV, pos.z + Math.sin(a) * OUTER_R);
    }
    for (let i = 0; i < INNER_DOTS; i++) {
      const a = (i / INNER_DOTS) * Math.PI * 2;
      vorPositions.push(pos.x + Math.cos(a) * INNER_R, Y_NAV, pos.z + Math.sin(a) * INNER_R);
    }
    vorPositions.push(pos.x, Y_NAV, pos.z); // center

    vorScenePos.push({ nav, pos });
  }

  if (vorPositions.length > 0) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vorPositions, 3));
    _navGroup.add(new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.025, transparent: true, opacity: 0.75,
      depthWrite: false, sizeAttenuation: true,
    })));
  }

  // VOR labels
  for (const { nav, pos } of vorScenePos) {
    const freqStr = nav.freq > 0 ? nav.freq.toFixed(2) : '';
    const label = _createNavLabel(nav.ident, freqStr);
    label.scale.set(0.32, 0.055, 1);
    label.position.set(pos.x + 0.13, 0.052, pos.z);
    _navGroup.add(label);
  }

  // ── Batched NDB dots ──
  const NDB_R = 0.06;
  const NDB_DOTS = 6;
  const ndbPositions = [];
  const ndbScenePos = [];

  for (const nav of ndbs) {
    const pos = geoToScene(nav.lat, nav.lon, lat, lon);
    if (Math.abs(pos.x) > GROUND_HALF || Math.abs(pos.z) > GROUND_HALF) continue;

    for (let i = 0; i < NDB_DOTS; i++) {
      const a = (i / NDB_DOTS) * Math.PI * 2;
      ndbPositions.push(pos.x + Math.cos(a) * NDB_R, Y_NAV, pos.z + Math.sin(a) * NDB_R);
    }
    ndbScenePos.push({ nav, pos });
  }

  if (ndbPositions.length > 0) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(ndbPositions, 3));
    _navGroup.add(new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.022, transparent: true, opacity: 0.7,
      depthWrite: false, sizeAttenuation: true,
    })));
  }

  // NDB labels
  for (const { nav, pos } of ndbScenePos) {
    const freqStr = nav.freq > 0 ? nav.freq.toFixed(0) : '';
    const label = _createNavLabel(nav.ident, freqStr);
    label.scale.set(0.28, 0.048, 1);
    label.position.set(pos.x + 0.08, 0.052, pos.z);
    _navGroup.add(label);
  }

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 1: ILS/LOC Approach Corridors + DME Arcs
  //  Derived from real runway geometry — no fabricated data
  // ══════════════════════════════════════════════════════════════════
  if (airportData && airportData.runways) {
    const ILS_RANGE_SCENE = 10 * NM_TO_SCENE;
    const MARKER_NM = [1, 2, 3, 5, 7, 10];

    const ilsMat = new THREE.LineDashedMaterial({
      color: 0xffffff, transparent: true, opacity: 0.12,
      depthWrite: false, dashSize: 0.10, gapSize: 0.06,
    });
    const markerPositions = [];

    for (const rwy of airportData.runways) {
      if (!rwy.startLat || !rwy.endLat) continue;
      const s = geoToScene(rwy.startLat, rwy.startLon, lat, lon);
      const e = geoToScene(rwy.endLat, rwy.endLon, lat, lon);
      const dx = e.x - s.x, dz = e.z - s.z;
      const len = Math.sqrt(dx * dx + dz * dz);
      if (len < 0.05) continue;
      const nx = dx / len, nz = dz / len;
      const perpX = -nz, perpZ = nx;

      // Approach centerline from each threshold
      for (const [origin, dir] of [[s, -1], [e, 1]]) {
        const far = { x: origin.x + dir * nx * ILS_RANGE_SCENE, z: origin.z + dir * nz * ILS_RANGE_SCENE };
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute([
          origin.x, 0.032, origin.z, far.x, 0.032, far.z
        ], 3));
        const line = new THREE.Line(geo, ilsMat);
        line.computeLineDistances();
        _navGroup.add(line);

        // DME tick marks
        const tickHalf = 0.04;
        for (const nm of MARKER_NM) {
          const d = nm * NM_TO_SCENE;
          const mx = origin.x + dir * nx * d, mz = origin.z + dir * nz * d;
          markerPositions.push(
            mx - perpX * tickHalf, 0.032, mz - perpZ * tickHalf,
            mx + perpX * tickHalf, 0.032, mz + perpZ * tickHalf
          );
        }
      }
    }

    if (markerPositions.length > 0) {
      const mGeo = new THREE.BufferGeometry();
      mGeo.setAttribute('position', new THREE.Float32BufferAttribute(markerPositions, 3));
      _navGroup.add(new THREE.LineSegments(mGeo, new THREE.LineBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.14, depthWrite: false,
      })));
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 2: NM Distance Reference Rings
  // ══════════════════════════════════════════════════════════════════
  const RING_NM = [5, 10, 20];
  const RING_SEGMENTS = 96;
  const ringMat = new THREE.LineDashedMaterial({
    color: 0xffffff, transparent: true, opacity: 0.07,
    depthWrite: false, dashSize: 0.18, gapSize: 0.12,
  });

  for (const nm of RING_NM) {
    const r = nm * NM_TO_SCENE;
    const pts = [];
    for (let i = 0; i <= RING_SEGMENTS; i++) {
      const a = (i / RING_SEGMENTS) * Math.PI * 2;
      pts.push(Math.cos(a) * r, 0.022, Math.sin(a) * r);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const ring = new THREE.Line(geo, ringMat);
    ring.computeLineDistances();
    _navGroup.add(ring);
    // Ring distance label at 45° NE
    const lbl = _createNavLabel(`${nm}NM`, '');
    lbl.scale.set(0.11, 0.022, 1);
    lbl.position.set(Math.cos(Math.PI / 4) * r, 0.04, -Math.sin(Math.PI / 4) * r);
    _navGroup.add(lbl);
  }

  // Cardinal direction labels on outer ring (20 NM)
  const outerR = 20 * NM_TO_SCENE;
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    const lbl = _createNavLabel(['N', 'E', 'S', 'W'][i], '');
    lbl.scale.set(0.08, 0.022, 1);
    lbl.position.set(Math.sin(a) * outerR, 0.04, -Math.cos(a) * outerR);
    _navGroup.add(lbl);
  }

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 3: SID/STAR Approach Procedure Patterns
  //  Realistic base-turn and downwind legs derived from runway geometry
  //  Shows standard traffic patterns at each runway end
  // ══════════════════════════════════════════════════════════════════
  if (airportData && airportData.runways) {
    const patternPositions = [];    // LineSegments buffer
    const waypointDots = [];        // Points buffer for waypoint markers
    const Y_P = 0.030;

    // Standard distances in scene units
    const DOWNWIND_OFFSET = 1.5 * NM_TO_SCENE; // 1.5 NM lateral offset
    const FINAL_LEN = 5 * NM_TO_SCENE;         // 5 NM final approach
    const DOWNWIND_LEN = 4 * NM_TO_SCENE;      // 4 NM downwind leg

    for (const rwy of airportData.runways) {
      if (!rwy.startLat || !rwy.endLat) continue;
      const s = geoToScene(rwy.startLat, rwy.startLon, lat, lon);
      const e = geoToScene(rwy.endLat, rwy.endLon, lat, lon);
      const dx = e.x - s.x, dz = e.z - s.z;
      const len = Math.sqrt(dx * dx + dz * dz);
      if (len < 0.05) continue;
      const nx = dx / len, nz = dz / len;
      const px = -nz, pz = nx; // perpendicular (left side of approach)

      // Traffic pattern at start threshold (approach from runway direction)
      // Left-hand pattern: Final → Threshold → Upwind → Crosswind → Downwind → Base → Final
      const finalStart = { x: s.x - nx * FINAL_LEN, z: s.z - nz * FINAL_LEN };
      const upwindEnd = { x: s.x + nx * DOWNWIND_LEN * 0.3, z: s.z + nz * DOWNWIND_LEN * 0.3 };
      const crosswindEnd = { x: upwindEnd.x + px * DOWNWIND_OFFSET, z: upwindEnd.z + pz * DOWNWIND_OFFSET };
      const downwindStart = { x: crosswindEnd.x, z: crosswindEnd.z };
      const downwindEnd = { x: finalStart.x + px * DOWNWIND_OFFSET, z: finalStart.z + pz * DOWNWIND_OFFSET };
      const baseEnd = { x: finalStart.x, z: finalStart.z };

      // Pattern legs as segments
      patternPositions.push(
        // Final approach
        finalStart.x, Y_P, finalStart.z, s.x, Y_P, s.z,
        // Upwind
        s.x, Y_P, s.z, upwindEnd.x, Y_P, upwindEnd.z,
        // Crosswind
        upwindEnd.x, Y_P, upwindEnd.z, crosswindEnd.x, Y_P, crosswindEnd.z,
        // Downwind
        downwindStart.x, Y_P, downwindStart.z, downwindEnd.x, Y_P, downwindEnd.z,
        // Base turn
        downwindEnd.x, Y_P, downwindEnd.z, baseEnd.x, Y_P, baseEnd.z
      );

      // Waypoint dots at turn points
      waypointDots.push(
        finalStart.x, Y_P + 0.002, finalStart.z,
        upwindEnd.x, Y_P + 0.002, upwindEnd.z,
        crosswindEnd.x, Y_P + 0.002, crosswindEnd.z,
        downwindEnd.x, Y_P + 0.002, downwindEnd.z,
        baseEnd.x, Y_P + 0.002, baseEnd.z
      );
    }

    if (patternPositions.length > 0) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(patternPositions, 3));
      _navGroup.add(new THREE.LineSegments(geo, new THREE.LineDashedMaterial({
        color: 0xc4a058, transparent: true, opacity: 0.12,
        depthWrite: false, dashSize: 0.06, gapSize: 0.04,
      })));
      // Waypoint diamonds
      const wGeo = new THREE.BufferGeometry();
      wGeo.setAttribute('position', new THREE.Float32BufferAttribute(waypointDots, 3));
      _navGroup.add(new THREE.Points(wGeo, new THREE.PointsMaterial({
        color: 0xc4a058, size: 0.007, transparent: true, opacity: 0.35,
        depthWrite: false, sizeAttenuation: true,
      })));
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 4: En-Route Airway Network
  //  Connects nearby VORs with dashed airway segments + course labels
  //  Real navaid positions — only the connecting lines are inferred
  // ══════════════════════════════════════════════════════════════════
  if (vorScenePos.length >= 2) {
    const MAX_DIST_DEG = 1.8;
    const MIN_DIST_DEG = 0.15;
    const MAX_CONN = 3;
    const seen = new Set();
    const airwayPositions = [];
    const Y_A = 0.028;

    for (const a of vorScenePos) {
      const candidates = [];
      for (const b of vorScenePos) {
        if (a.nav.ident === b.nav.ident) continue;
        const dLat = a.nav.lat - b.nav.lat;
        const dLon = (a.nav.lon - b.nav.lon) * Math.cos(a.nav.lat * Math.PI / 180);
        const dist = Math.sqrt(dLat * dLat + dLon * dLon);
        if (dist >= MIN_DIST_DEG && dist <= MAX_DIST_DEG) {
          candidates.push({ b, dist });
        }
      }
      candidates.sort((x, y) => x.dist - y.dist);
      let count = 0;
      for (const c of candidates) {
        if (count >= MAX_CONN) break;
        const key = [a.nav.ident, c.b.nav.ident].sort().join('-');
        if (seen.has(key)) continue;
        seen.add(key);
        airwayPositions.push(a.pos.x, Y_A, a.pos.z, c.b.pos.x, Y_A, c.b.pos.z);

        // Midpoint course label
        const mx = (a.pos.x + c.b.pos.x) / 2;
        const mz = (a.pos.z + c.b.pos.z) / 2;
        const dLon = (c.b.nav.lon - a.nav.lon) * Math.cos(((a.nav.lat + c.b.nav.lat) / 2) * Math.PI / 180);
        const dLat = c.b.nav.lat - a.nav.lat;
        let hdg = Math.atan2(dLon, dLat) * 180 / Math.PI;
        if (hdg < 0) hdg += 360;
        const distNM = Math.round(c.dist * 60);
        const lbl = _createNavLabel(`${Math.round(hdg)}° ${distNM}`, '');
        lbl.scale.set(0.12, 0.022, 1);
        lbl.position.set(mx, 0.04, mz);
        _navGroup.add(lbl);
        count++;
      }
    }

    if (airwayPositions.length > 0) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(airwayPositions, 3));
      const line = new THREE.LineSegments(geo, new THREE.LineDashedMaterial({
        color: 0x7aadcc, transparent: true, opacity: 0.25,
        depthWrite: false, dashSize: 0.08, gapSize: 0.06,
      }));
      line.computeLineDistances();
      _navGroup.add(line);
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 5: Named Fixes & RNAV Waypoints
  //  Real CIFP waypoints (US airports) + procedurally generated
  //  fixes along approach corridors (all airports).
  //  Symbol: ▲ small triangle — ICAO standard for RNAV fix
  // ══════════════════════════════════════════════════════════════════
  const allFixes = new Map(); // name → { lat, lon, type }
  const Y_FIX = 0.042;
  const FIX_SIZE = 0.038; // triangle radius

  // 5a: Load real CIFP waypoints via dynamic import (non-blocking, US only)
  try {
    const { CIFP_APPROACHES } = await import('../data/cifpApproaches.js');
    for (const [icao, approaches] of Object.entries(CIFP_APPROACHES)) {
      for (const app of approaches) {
        const addWp = wp => {
          if (!wp.n || wp.n.startsWith('RW')) return; // skip runway thresholds
          if (Math.abs(wp.lat - lat) > 2.5 || Math.abs(wp.lon - lon) > 2.5) return;
          if (!allFixes.has(wp.n)) allFixes.set(wp.n, { lat: wp.lat, lon: wp.lon, type: wp.t || 'WP', icao });
        };
        if (app.waypoints) app.waypoints.forEach(addWp);
        if (app.missed) app.missed.forEach(addWp);
        if (app.transitions) app.transitions.forEach(tr => tr.forEach(addWp));
      }
    }
  } catch { /* CIFP not available — continue with procedural fixes */ }

  // 5b: Generate procedural fixes along approach corridors for ALL airports
  if (airportData && airportData.runways) {
    const FIX_DISTANCES_NM = [3, 5, 7, 10, 14]; // NM from threshold
    const FIX_LABELS = ['FF', 'AF', 'IF', 'IM', 'IA']; // FAF, approach fix, IF, intermediate, IAF
    for (const rwy of airportData.runways) {
      if (!rwy.startLat || !rwy.endLat) continue;
      const dx = rwy.endLon - rwy.startLon;
      const dy = rwy.endLat - rwy.startLat;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 0.001) continue;
      const nx = dx / len, ny = dy / len;
      const ref = (rwy.ref || '').replace(/\//g, '-').replace(/\s/g, '');

      // Fixes extending from each threshold along the approach path
      for (const [tLat, tLon, dir] of [[rwy.startLat, rwy.startLon, -1], [rwy.endLat, rwy.endLon, 1]]) {
        for (let i = 0; i < FIX_DISTANCES_NM.length; i++) {
          const dDeg = FIX_DISTANCES_NM[i] / 60; // NM to degrees
          const fLat = tLat + dir * ny * dDeg;
          const fLon = tLon + dir * nx * dDeg;
          if (Math.abs(fLat - lat) > 2.5 || Math.abs(fLon - lon) > 2.5) continue;
          // Generate unique fix name based on runway + distance
          const fixName = `${ref.slice(0, 3)}${FIX_LABELS[i]}`;
          if (!allFixes.has(fixName)) {
            allFixes.set(fixName, { lat: fLat, lon: fLon, type: i === 0 ? 'FAF' : i === 4 ? 'IAF' : 'WP' });
          }
        }
      }

      // Lateral offset fixes for base-turn / downwind waypoints
      const perpX = -ny, perpY = nx;
      const OFFSET_NM = 2.0;
      const offDeg = OFFSET_NM / 60;
      for (const [tLat, tLon, dir] of [[rwy.startLat, rwy.startLon, -1], [rwy.endLat, rwy.endLon, 1]]) {
        // Downwind abeam fix
        const dwLat = tLat + perpY * offDeg;
        const dwLon = tLon + perpX * offDeg;
        if (Math.abs(dwLat - lat) < 2.5 && Math.abs(dwLon - lon) < 2.5) {
          const dwName = `${ref.slice(0, 3)}DW`;
          if (!allFixes.has(dwName)) allFixes.set(dwName, { lat: dwLat, lon: dwLon, type: 'WP' });
        }
        // Base turn fix
        const btLat = tLat + dir * ny * (5 / 60) + perpY * offDeg;
        const btLon = tLon + dir * nx * (5 / 60) + perpX * offDeg;
        if (Math.abs(btLat - lat) < 2.5 && Math.abs(btLon - lon) < 2.5) {
          const btName = `${ref.slice(0, 3)}BT`;
          if (!allFixes.has(btName)) allFixes.set(btName, { lat: btLat, lon: btLon, type: 'WP' });
        }
      }
    }
  }

  // 5c: Generate airway intersection fixes along VOR-VOR segments
  if (vorScenePos.length >= 3) {
    const seen = new Set();
    for (let i = 0; i < vorScenePos.length; i++) {
      for (let j = i + 1; j < vorScenePos.length; j++) {
        const a = vorScenePos[i].nav, b = vorScenePos[j].nav;
        const dLat = Math.abs(a.lat - b.lat), dLon = Math.abs(a.lon - b.lon);
        const dist = Math.sqrt(dLat * dLat + dLon * dLon);
        if (dist < 0.3 || dist > 2.0) continue;
        const key = [a.ident, b.ident].sort().join('-');
        if (seen.has(key)) continue;
        seen.add(key);
        // Generate 1-2 intersection fixes along each airway
        const nFixes = dist > 1.2 ? 2 : 1;
        for (let k = 1; k <= nFixes; k++) {
          const t = k / (nFixes + 1);
          const iLat = a.lat + (b.lat - a.lat) * t;
          const iLon = a.lon + (b.lon - a.lon) * t;
          if (Math.abs(iLat - lat) > 2.5 || Math.abs(iLon - lon) > 2.5) continue;
          const intName = `${a.ident.slice(0, 2)}${b.ident.slice(0, 3)}`;
          if (!allFixes.has(intName)) {
            allFixes.set(intName, { lat: iLat, lon: iLon, type: 'INT' });
          }
        }
      }
    }
  }

  // 5d: Render all fixes as ▲ triangles with labels
  const fixTriPositions = [];
  const fixDotPositions = [];
  const fixScenePos = []; // for labels + future route building

  for (const [name, fix] of allFixes) {
    const pos = geoToScene(fix.lat, fix.lon, lat, lon);
    if (Math.abs(pos.x) > GROUND_HALF || Math.abs(pos.z) > GROUND_HALF) continue;

    const isCIFP = fix.icao != null; // real FAA fix vs procedural
    const s = isCIFP ? FIX_SIZE : FIX_SIZE * 0.7;
    const h = s * Math.sqrt(3) / 2;

    // Triangle vertices (pointing up)
    fixTriPositions.push(
      pos.x, Y_FIX, pos.z - h * 0.67,   pos.x - s / 2, Y_FIX, pos.z + h * 0.33,
      pos.x - s / 2, Y_FIX, pos.z + h * 0.33,   pos.x + s / 2, Y_FIX, pos.z + h * 0.33,
      pos.x + s / 2, Y_FIX, pos.z + h * 0.33,   pos.x, Y_FIX, pos.z - h * 0.67,
    );
    // Center dot for visibility at distance
    fixDotPositions.push(pos.x, Y_FIX + 0.001, pos.z);

    fixScenePos.push({ name, fix, pos });
  }

  if (fixTriPositions.length > 0) {
    // Triangle outlines — cyan for RNAV fixes
    const triGeo = new THREE.BufferGeometry();
    triGeo.setAttribute('position', new THREE.Float32BufferAttribute(fixTriPositions, 3));
    _navGroup.add(new THREE.LineSegments(triGeo, new THREE.LineBasicMaterial({
      color: 0x60d0d0, transparent: true, opacity: 0.6, depthWrite: false,
    })));
    // Center dots
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(fixDotPositions, 3));
    _navGroup.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({
      color: 0x60d0d0, size: 0.020, transparent: true, opacity: 0.75,
      depthWrite: false, sizeAttenuation: true,
    })));
  }

  // Fix labels — all fixes get labels now
  for (const { name, fix, pos } of fixScenePos) {
    const isCIFP = fix.icao != null;
    const isKey = fix.type === 'IAF' || fix.type === 'FAF' || fix.type === 'IF';
    const lbl = _createNavLabel(name, '');
    lbl.scale.set(0.26, 0.045, 1);
    lbl.position.set(pos.x + 0.055, Y_FIX + 0.012, pos.z);
    lbl.material.opacity = isCIFP ? 0.8 : isKey ? 0.7 : 0.5;
    _navGroup.add(lbl);
  }

  // ══════════════════════════════════════════════════════════════════
  // Chart Type 6: ASR Radar — removed (mispositioned, too large)

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 7: TACAN / DME Stations (distinct symbol)
  //  Small square with 'T' marker — separate from VOR rendering
  // ══════════════════════════════════════════════════════════════════
  const tacans = nearby.filter(n => n.type === 'TACAN' || n.type === 'DME');
  const tacanPositions = [];
  const tacanScenePos = [];

  for (const nav of tacans) {
    const pos = geoToScene(nav.lat, nav.lon, lat, lon);
    if (Math.abs(pos.x) > GROUND_HALF || Math.abs(pos.z) > GROUND_HALF) continue;
    const s = 0.045; // half-width
    // Square outline
    tacanPositions.push(
      pos.x - s, Y_NAV, pos.z - s,  pos.x + s, Y_NAV, pos.z - s,
      pos.x + s, Y_NAV, pos.z - s,  pos.x + s, Y_NAV, pos.z + s,
      pos.x + s, Y_NAV, pos.z + s,  pos.x - s, Y_NAV, pos.z + s,
      pos.x - s, Y_NAV, pos.z + s,  pos.x - s, Y_NAV, pos.z - s,
    );
    tacanScenePos.push({ nav, pos });
  }

  if (tacanPositions.length > 0) {
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position', new THREE.Float32BufferAttribute(tacanPositions, 3));
    _navGroup.add(new THREE.LineSegments(tGeo, new THREE.LineBasicMaterial({
      color: 0xd0a040, transparent: true, opacity: 0.55, depthWrite: false,
    })));
    for (const { nav, pos } of tacanScenePos) {
      const lbl = _createNavLabel(nav.ident, nav.freq > 0 ? nav.freq.toFixed(0) : '');
      lbl.scale.set(0.26, 0.045, 1);
      lbl.position.set(pos.x + 0.06, Y_NAV + 0.012, pos.z);
      _navGroup.add(lbl);
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 8: VOR Compass Roses
  //  36 radial tick marks every 10° — ICAO standard VOR depiction
  // ══════════════════════════════════════════════════════════════════
  {
    const rosePositions = [];
    const TICK_INNER = 0.11;   // just outside outer dot ring
    const TICK_OUTER_MAJ = 0.16; // major ticks (N/E/S/W + 30° marks)
    const TICK_OUTER_MIN = 0.135; // minor ticks (10° marks)
    const Y_R = 0.038;

    for (const { pos } of vorScenePos) {
      for (let d = 0; d < 360; d += 10) {
        const a = (d * Math.PI) / 180;
        const isMajor = d % 30 === 0;
        const outer = isMajor ? TICK_OUTER_MAJ : TICK_OUTER_MIN;
        rosePositions.push(
          pos.x + Math.sin(a) * TICK_INNER, Y_R, pos.z - Math.cos(a) * TICK_INNER,
          pos.x + Math.sin(a) * outer, Y_R, pos.z - Math.cos(a) * outer
        );
      }
    }
    if (rosePositions.length > 0) {
      const rGeo = new THREE.BufferGeometry();
      rGeo.setAttribute('position', new THREE.Float32BufferAttribute(rosePositions, 3));
      _navGroup.add(new THREE.LineSegments(rGeo, new THREE.LineBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.25, depthWrite: false,
      })));
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 9: Airway Designators (V/J routes)
  //  Replace generic heading labels with realistic airway names + MEA
  // ══════════════════════════════════════════════════════════════════
  if (vorScenePos.length >= 2) {
    const seen9 = new Set();
    let awIdx = 1;
    for (let i = 0; i < vorScenePos.length; i++) {
      for (let j = i + 1; j < vorScenePos.length; j++) {
        const a = vorScenePos[i], b = vorScenePos[j];
        const dLat = Math.abs(a.nav.lat - b.nav.lat);
        const dLon = Math.abs(a.nav.lon - b.nav.lon);
        const dist = Math.sqrt(dLat * dLat + dLon * dLon);
        if (dist < 0.15 || dist > 1.8) continue;
        const key = [a.nav.ident, b.nav.ident].sort().join('-');
        if (seen9.has(key)) continue;
        seen9.add(key);
        // Generate airway name: V-routes below ~18000ft, J-routes above
        const avgLat = (a.nav.lat + b.nav.lat) / 2;
        const isJet = Math.abs(avgLat) > 40; // heuristic: higher lat → jet routes more common
        const awName = (isJet ? 'J' : 'V') + awIdx;
        awIdx++;
        // MEA: estimate based on distance + latitude (terrain proxy)
        const distNM = Math.round(dist * 60);
        const baseMEA = Math.abs(avgLat) > 35 ? 8000 : 5000;
        const mea = Math.round((baseMEA + distNM * 40) / 100) * 100;
        const meaStr = mea >= 10000 ? (mea / 1000).toFixed(0) + ',' + String(mea % 1000).padStart(3, '0')
          : String(mea);

        const mx = (a.pos.x + b.pos.x) / 2;
        const mz = (a.pos.z + b.pos.z) / 2;
        // Airway designator label
        const awLbl = _createNavLabel(awName, '');
        awLbl.scale.set(0.18, 0.032, 1);
        awLbl.position.set(mx + 0.02, 0.048, mz - 0.02);
        awLbl.material.color = new THREE.Color(0x7aadcc);
        awLbl.material.opacity = 0.55;
        _navGroup.add(awLbl);
        // MEA label below
        const meaLbl = _createNavLabel(meaStr + 'ft', '');
        meaLbl.scale.set(0.14, 0.024, 1);
        meaLbl.position.set(mx + 0.02, 0.042, mz + 0.02);
        meaLbl.material.opacity = 0.35;
        _navGroup.add(meaLbl);
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Chart Type 10: MSA Circle — removed (too large, simulated data)

  // Find primary airport — closest to city center (used by Class B/C)
  const _primaryApt = airportData?.airports?.length > 0
    ? airportData.airports.reduce((best, apt) => {
        const d = Math.hypot(apt.lat - lat, apt.lon - lon);
        return (!best || d < best._d) ? { ...apt, _d: d } : best;
      }, null)
    : null;

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 11: Class B/C Airspace Depiction
  //  Concentric altitude-labeled shelves around primary airport
  // ══════════════════════════════════════════════════════════════════
  if (_primaryApt && airportData.runways && airportData.runways.length >= 2) {
    let cLat2 = 0, cLon2 = 0, rc2 = 0;
    const seenR2 = new Set();
    const _primaryRwys2 = airportData.runways.filter(r => {
      const dLat = r.lat - _primaryApt.lat;
      const dLon = (r.lon - _primaryApt.lon) * Math.cos(_primaryApt.lat * Math.PI / 180);
      return Math.hypot(dLat, dLon) * 111320 < 5000;
    });
    for (const rwy of (_primaryRwys2.length > 0 ? _primaryRwys2 : airportData.runways)) {
      if (!rwy.startLat || seenR2.has(rwy.ref)) continue;
      seenR2.add(rwy.ref);
      cLat2 += (rwy.startLat + rwy.endLat) / 2;
      cLon2 += (rwy.startLon + rwy.endLon) / 2;
      rc2++;
    }
    if (rc2 > 0) {
      cLat2 /= rc2; cLon2 /= rc2;
      const cp2 = geoToScene(cLat2, cLon2, lat, lon);
      const isClassB = _primaryRwys2.length >= 3; // 3+ runways at primary → Class B
      const shelves = isClassB
        ? [{ r: 7, floor: 'SFC', ceil: '100' }, { r: 10, floor: '20', ceil: '100' },
           { r: 15, floor: '30', ceil: '100' }, { r: 20, floor: '40', ceil: '100' }]
        : [{ r: 5, floor: 'SFC', ceil: '42' }, { r: 10, floor: '13', ceil: '42' }];
      const AS_Y = 0.018;
      const asPts = [];
      const classLabel = isClassB ? 'CLASS B' : 'CLASS C';

      for (const sh of shelves) {
        const r = sh.r * NM_TO_SCENE;
        const segsA = 64;
        for (let i = 0; i < segsA; i++) {
          const a1 = (i / segsA) * Math.PI * 2;
          const a2 = ((i + 1) / segsA) * Math.PI * 2;
          asPts.push(
            cp2.x + Math.cos(a1) * r, AS_Y, cp2.z + Math.sin(a1) * r,
            cp2.x + Math.cos(a2) * r, AS_Y, cp2.z + Math.sin(a2) * r
          );
        }
        // Altitude label at east side of each ring
        const altText = `${sh.floor}/${sh.ceil}`;
        const altLbl = _createNavLabel(altText, '');
        altLbl.scale.set(0.18, 0.030, 1);
        altLbl.position.set(cp2.x + r + 0.04, AS_Y + 0.01, cp2.z);
        altLbl.material.opacity = 0.40;
        altLbl.material.color = new THREE.Color(0x6090d0);
        _navGroup.add(altLbl);
      }

      if (asPts.length > 0) {
        const asGeo = new THREE.BufferGeometry();
        asGeo.setAttribute('position', new THREE.Float32BufferAttribute(asPts, 3));
        _navGroup.add(new THREE.LineSegments(asGeo, new THREE.LineDashedMaterial({
          color: 0x6090d0, transparent: true, opacity: 0.18,
          depthWrite: false, dashSize: 0.12, gapSize: 0.04,
        })));
      }

      // Class label
      const classLbl = _createNavLabel(classLabel, '');
      classLbl.scale.set(0.22, 0.038, 1);
      classLbl.position.set(cp2.x, AS_Y + 0.015, cp2.z - shelves[0].r * NM_TO_SCENE - 0.08);
      classLbl.material.color = new THREE.Color(0x6090d0);
      classLbl.material.opacity = 0.55;
      _navGroup.add(classLbl);
    }
  }

  // Chart Type 12: Holding Patterns — removed (too noisy at overview zoom)

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 13: Feeder Routes
  //  Dashed lines connecting IAF fixes to nearby VOR stations
  //  Standard chart element showing how to enter the approach
  // ══════════════════════════════════════════════════════════════════
  {
    const feederPts = [];
    const Y_FEED = 0.032;
    for (const { fix, pos } of fixScenePos) {
      if (fix.type !== 'IAF') continue;
      // Connect to nearest VOR
      let bestDist = Infinity, bestVor = null;
      for (const v of vorScenePos) {
        const dx = v.pos.x - pos.x, dz = v.pos.z - pos.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < bestDist && d > 0.2 && d < 15 * NM_TO_SCENE) {
          bestDist = d;
          bestVor = v;
        }
      }
      if (bestVor) {
        feederPts.push(bestVor.pos.x, Y_FEED, bestVor.pos.z, pos.x, Y_FEED, pos.z);
        // Course/distance label at midpoint
        const mx = (bestVor.pos.x + pos.x) / 2;
        const mz = (bestVor.pos.z + pos.z) / 2;
        const dLon = (fix.lon - bestVor.nav.lon) * Math.cos(((fix.lat + bestVor.nav.lat) / 2) * Math.PI / 180);
        const dLat = fix.lat - bestVor.nav.lat;
        let hdg = Math.atan2(dLon, dLat) * 180 / Math.PI;
        if (hdg < 0) hdg += 360;
        const distNM = Math.round(Math.sqrt(dLat * dLat + dLon * dLon) * 60);
        const fLbl = _createNavLabel(`${Math.round(hdg)}°/${distNM}`, '');
        fLbl.scale.set(0.16, 0.028, 1);
        fLbl.position.set(mx, Y_FEED + 0.01, mz);
        fLbl.material.opacity = 0.35;
        fLbl.material.color = new THREE.Color(0xa0a0ff);
        _navGroup.add(fLbl);
      }
    }
    if (feederPts.length > 0) {
      const fGeo = new THREE.BufferGeometry();
      fGeo.setAttribute('position', new THREE.Float32BufferAttribute(feederPts, 3));
      const fLine = new THREE.LineSegments(fGeo, new THREE.LineDashedMaterial({
        color: 0xa0a0ff, transparent: true, opacity: 0.20,
        depthWrite: false, dashSize: 0.15, gapSize: 0.08,
      }));
      fLine.computeLineDistances();
      _navGroup.add(fLine);
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  Chart Type 14: Magnetic Variation Annotation
  //  Shows local magnetic declination — essential chart information
  // ══════════════════════════════════════════════════════════════════
  {
    // Simplified WMM approximation for magnetic declination
    // Good enough for chart annotation purposes
    const magVar = _estimateMagVar(lat, lon);
    const varDir = magVar >= 0 ? 'E' : 'W';
    const varStr = `VAR ${Math.abs(magVar).toFixed(1)}° ${varDir}`;
    const varLbl = _createNavLabel(varStr, '');
    varLbl.scale.set(0.24, 0.040, 1);
    varLbl.position.set(-GROUND_HALF + 1, 0.05, GROUND_HALF - 0.5);
    varLbl.material.opacity = 0.30;
    _navGroup.add(varLbl);
  }

  // ══════════════════════════════════════════════════════════════════
  //  Invisible hit meshes for hover tooltips
  // ══════════════════════════════════════════════════════════════════
  _navHitTargets.length = 0;
  const hitGeo = new THREE.SphereGeometry(0.12, 6, 6);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });

  // VOR hit targets
  for (const { nav, pos } of vorScenePos) {
    const m = new THREE.Mesh(hitGeo, hitMat);
    m.position.set(pos.x, 0.05, pos.z);
    const vorDesc = nav.type === 'VORTAC'
      ? 'Combined VOR and TACAN station. Provides both civilian azimuth (VOR) and military distance/bearing (TACAN) from a single facility. Pilots tune one frequency to get bearing and DME distance simultaneously.'
      : nav.type === 'VOR-DME'
      ? 'VOR paired with Distance Measuring Equipment. Broadcasts a radial signal so pilots can determine their magnetic bearing FROM the station, while DME provides slant-range distance in nautical miles. The backbone of conventional airway navigation.'
      : 'VHF Omnidirectional Range — a ground-based beacon that broadcasts 360 radials like spokes of a wheel. Pilots tune the frequency and select a radial to fly TO or FROM the station. VORs define most conventional airways on aeronautical charts.';
    m.userData.navaid = {
      ident: nav.ident, name: nav.name, type: nav.type,
      freq: nav.freq > 0 ? nav.freq.toFixed(2) + ' MHz' : '',
      lat: nav.lat, lon: nav.lon,
      desc: vorDesc,
    };
    _navGroup.add(m);
    _navHitTargets.push(m);
  }

  // NDB hit targets
  for (const { nav, pos } of ndbScenePos) {
    const m = new THREE.Mesh(hitGeo, hitMat);
    m.position.set(pos.x, 0.05, pos.z);
    const ndbDesc = nav.type === 'NDB-DME'
      ? 'Non-directional Beacon with DME. An older low-frequency radio beacon — the aircraft\'s ADF (Automatic Direction Finder) points toward it. DME adds distance readout. Still used for some approaches and as compass locators near runways.'
      : 'Non-directional Beacon — one of the oldest navigation aids still in service. Broadcasts on low/medium frequency; the aircraft\'s ADF needle simply points toward the station. Less precise than VOR but effective over water and at low altitude. Being phased out in favor of GPS.';
    m.userData.navaid = {
      ident: nav.ident, name: nav.name, type: nav.type,
      freq: nav.freq > 0 ? nav.freq.toFixed(0) + ' kHz' : '',
      lat: nav.lat, lon: nav.lon,
      desc: ndbDesc,
    };
    _navGroup.add(m);
    _navHitTargets.push(m);
  }

  // Fix/waypoint hit targets
  for (const { name, fix, pos } of fixScenePos) {
    const m = new THREE.Mesh(hitGeo, hitMat);
    m.position.set(pos.x, 0.05, pos.z);
    let typeLabel, fixDesc;
    if (fix.type === 'FAF') {
      typeLabel = 'Final Approach Fix';
      fixDesc = 'The point where the aircraft begins its final descent to the runway. After crossing the FAF, the pilot follows a precise glidepath — typically 3° — down to the landing threshold. This is the last checkpoint before the runway comes into view.';
    } else if (fix.type === 'IAF') {
      typeLabel = 'Initial Approach Fix';
      fixDesc = 'The entry gate to an instrument approach procedure. ATC clears aircraft to this fix to begin the transition from the en-route phase to the approach sequence. From here, pilots follow a published path of altitude and heading changes toward the runway.';
    } else if (fix.type === 'IF') {
      typeLabel = 'Intermediate Fix';
      fixDesc = 'A waypoint between the initial and final approach fixes where the aircraft stabilizes its configuration — lowering gear, extending flaps, and aligning with the final approach course. This segment ensures safe deceleration and altitude positioning.';
    } else if (fix.type === 'INT') {
      typeLabel = 'Airway Intersection';
      fixDesc = 'Where two or more airways cross. Intersections are defined by the crossing of VOR radials or GPS coordinates. ATC uses them as reporting points and to separate traffic on converging routes. Named with five-letter identifiers.';
    } else {
      typeLabel = 'RNAV Waypoint';
      fixDesc = 'A GPS-defined point in space — no ground-based transmitter needed. RNAV (Area Navigation) waypoints allow curved, fuel-efficient routes instead of zigzagging between ground stations. Modern airliners navigate almost entirely via these waypoints.';
    }
    m.userData.navaid = {
      ident: name, name: typeLabel, type: fix.type || 'WP',
      freq: fix.icao ? `${fix.icao}` : '',
      lat: fix.lat, lon: fix.lon,
      desc: fixDesc + (fix.icao ? ` Part of ${fix.icao} procedure.` : ''),
    };
    _navGroup.add(m);
    _navHitTargets.push(m);
  }

  // TACAN hit targets
  for (const { nav, pos } of tacanScenePos) {
    const m = new THREE.Mesh(hitGeo, hitMat);
    m.position.set(pos.x, 0.05, pos.z);
    const tacanDesc = nav.type === 'TACAN'
      ? 'Tactical Air Navigation — a military UHF beacon that provides both bearing and distance to aircraft. Paired with VOR at VORTAC sites for civil/military shared use. Military aircraft use TACAN channels instead of VOR frequencies.'
      : 'Distance Measuring Equipment — a transponder that measures slant-range distance between the aircraft and the ground station in nautical miles. The aircraft sends interrogation pulses; the station replies after a fixed delay. Accuracy is typically within 0.5 nm.';
    m.userData.navaid = {
      ident: nav.ident, name: nav.name, type: nav.type,
      freq: nav.freq > 0 ? 'CH ' + nav.freq.toFixed(0) : '',
      lat: nav.lat, lon: nav.lon,
      desc: tacanDesc,
    };
    _navGroup.add(m);
    _navHitTargets.push(m);
  }

  // ── Label collision resolution ──
  // Collect all Sprite labels and push overlapping ones apart
  _resolveChartLabelOverlaps(_navGroup);

  scene.add(_navGroup);
  _navLoadedLat = lat;
  _navLoadedLon = lon;
  const fixCount = fixScenePos.length;
  const chartCount = (airportData?.runways?.length || 0) > 0 ? 7 : 2;
  console.log(`[STRATUM] Aero chart: ${vors.length} VOR, ${ndbs.length} NDB, ${fixCount} fixes, ${tacans.length} TACAN, ${chartCount} chart types`);
}

function _resolveChartLabelOverlaps(group) {
  const sprites = group.children.filter(c => c.isSprite);
  if (sprites.length < 2) return;

  // Build records with position + bounding extents in xz plane
  // Sprite scale.x = width, scale.y = height; on ground, x→x, y→screen vertical
  // Use a minimum spacing in z to avoid visual stacking from the camera angle
  const MIN_Z_GAP = 0.03;
  const labels = sprites.map(s => ({
    sprite: s,
    x: s.position.x,
    z: s.position.z,
    hw: s.scale.x * 0.5,  // half-width in scene x
    hh: Math.max(s.scale.y * 0.5, MIN_Z_GAP), // half-height → z spacing
  }));

  // Sort by x for sweep-line efficiency
  labels.sort((a, b) => a.x - b.x);

  // Two passes to stabilize positions
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        // Labels too far apart in x — no overlap possible
        if (labels[j].x - labels[i].x > labels[i].hw + labels[j].hw) break;

        const zDist = Math.abs(labels[i].z - labels[j].z);
        const minZ = labels[i].hh + labels[j].hh;

        if (zDist < minZ) {
          // Push j away from i in z direction
          const dir = labels[j].z >= labels[i].z ? 1 : -1;
          labels[j].z = labels[i].z + dir * minZ;
          labels[j].sprite.position.z = labels[j].z;
        }
      }
    }
  }
}

function _createNavLabel(ident, freq) {
  const canvas = document.createElement('canvas');
  const dpr = 4; // 4× for razor-sharp text at all zoom levels
  const logW = 120, logH = 20;
  canvas.width = logW * dpr;   // 480 px
  canvas.height = logH * dpr;  // 80 px
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.80)';
  const text = freq ? `${ident.toUpperCase()} ${freq}` : ident.toUpperCase();
  ctx.fillText(text, 1, logH / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.14, 0.025, 1);
  return sprite;
}

// Simplified magnetic declination estimate (WMM-like approximation)
function _estimateMagVar(lat, lon) {
  // Very rough model — captures major trends:
  // Americas: west declination, Europe/Asia: east declination
  // Poles: extreme values, equator: moderate
  const latRad = lat * Math.PI / 180;
  const lonRad = lon * Math.PI / 180;
  // Dominant dipole term + longitude correction
  return -11.5 * Math.sin(lonRad + 1.2) * Math.cos(latRad) + 3.5 * Math.sin(latRad);
}

function _clearNavChart(scene) {
  if (_navGroup) {
    scene.remove(_navGroup);
    _navGroup.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    });
    _navGroup = null;
  }
  _navHitTargets.length = 0;
  _navLoadedLat = null;
  _navLoadedLon = null;
}

export function getNavHitTargets() {
  return _navHitTargets;
}

export function clearNavChart(scene) {
  _clearNavChart(scene);
}

export async function reloadNavChart(scene, lat, lon) {
  _clearNavChart(scene);
  await loadNavChart(scene, lat, lon);
}



// ── S4: Fuel Range Ring ──
// Shows estimated remaining range as a ground circle around the selected aircraft
let _fuelRangeRing = null;

export function renderFuelRangeRing(scene, acLat, acLon, rangeNm, userLat, userLon) {
  clearFuelRangeRing(scene);
  if (rangeNm == null || rangeNm <= 0 || acLat == null) return;

  const cosLat = Math.cos(userLat * Math.PI / 180);
  const cx = (acLon - userLon) * GEO_SCALE * cosLat;
  const cz = -(acLat - userLat) * GEO_SCALE;

  // Convert nm to scene units
  const radiusScene = (rangeNm * 1.852 / 111) * GEO_SCALE;
  const thickness = 0.02;

  const geo = new THREE.RingGeometry(radiusScene - thickness, radiusScene + thickness, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xe8c36a, transparent: true, opacity: 0.06, side: THREE.DoubleSide,
  });
  _fuelRangeRing = new THREE.Mesh(geo, mat);
  _fuelRangeRing.rotation.x = -Math.PI / 2;
  _fuelRangeRing.position.set(cx, 0.006, cz);
  scene.add(_fuelRangeRing);
}

export function clearFuelRangeRing(scene) {
  if (_fuelRangeRing) {
    scene.remove(_fuelRangeRing);
    if (_fuelRangeRing.geometry) _fuelRangeRing.geometry.dispose();
    if (_fuelRangeRing.material) _fuelRangeRing.material.dispose();
    _fuelRangeRing = null;
  }
}

// ── Bulk Route Overlay ──────────────────────────────────────────────────────
// Renders great-circle route arcs for ALL aircraft with known origin + destination
let _routeOverlayGroup = null;

/**
 * Update the route overlay for all aircraft.
 * @param {THREE.Scene} scene
 * @param {Array<{originLat, originLon, destLat, destLon}>} routes
 * @param {number} userLat
 * @param {number} userLon
 */
export function updateRouteOverlay(scene, routes, userLat, userLon) {
  clearRouteOverlay(scene);
  if (!routes || routes.length === 0) return;

  _routeOverlayGroup = new THREE.Group();
  _routeOverlayGroup.name = 'routeOverlay';

  const cosLat = Math.cos(userLat * Math.PI / 180);
  const HALF = GROUND_SIZE / 2;
  const SEG = 48; // segments per arc
  const Y_ROUTE = 0.025;
  const allPositions = [];

  for (const r of routes) {
    const pts = [];
    let anyVisible = false;
    for (let i = 0; i <= SEG; i++) {
      const t = i / SEG;
      const la = r.originLat + (r.destLat - r.originLat) * t;
      const lo = r.originLon + (r.destLon - r.originLon) * t;
      const x = (lo - userLon) * GEO_SCALE * cosLat;
      const z = -(la - userLat) * GEO_SCALE;
      pts.push({ x, z });
      if (Math.abs(x) < HALF && Math.abs(z) < HALF) anyVisible = true;
    }
    if (!anyVisible) continue;

    // Push as line segments (p0-p1, p1-p2, p2-p3, ...)
    for (let i = 0; i < pts.length - 1; i++) {
      allPositions.push(
        pts[i].x, Y_ROUTE, pts[i].z,
        pts[i + 1].x, Y_ROUTE, pts[i + 1].z
      );
    }
  }

  if (allPositions.length > 0) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(allPositions, 3));
    _routeOverlayGroup.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
      color: 0xc4a058, transparent: true, opacity: 0.12, depthWrite: false,
    })));
  }

  scene.add(_routeOverlayGroup);
}

export function clearRouteOverlay(scene) {
  if (_routeOverlayGroup) {
    scene.remove(_routeOverlayGroup);
    _routeOverlayGroup.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    _routeOverlayGroup = null;
  }
}

// Simple ray-casting point-in-polygon for GeoJSON [lon, lat] rings
function _pointInPolygon(lat, lon, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}
