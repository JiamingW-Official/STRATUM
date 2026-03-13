import * as THREE from 'three';
import { loadMapTexture } from './mapTiles.js';
import { fetchAirportData, categorizeFlights, clearAirportCache } from '../data/airports.js';
import { fetchFIRData, filterNearbyFIRs } from '../data/firBoundaries.js';


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
  // Horizon fog — fades map edges into sky for infinity/depth-of-field effect
  scene.fog = new THREE.FogExp2(new THREE.Color(0.008, 0.032, 0.068), 0.013);

  const ambient = new THREE.AmbientLight(0x3a5577, 0.7);
  ambient.name = 'ambientLight';
  _ambientLightRef = ambient;
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0x99bbdd, 0.35);
  dirLight.position.set(20, 60, 30);
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


  // Gradient sky dome
  const skyGeo = new THREE.SphereGeometry(185, 64, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const skyVerts = skyGeo.attributes.position;
  const skyColors = new Float32Array(skyVerts.count * 3);
  for (let i = 0; i < skyVerts.count; i++) {
    const y = skyVerts.getY(i);
    const t = Math.max(0, y / 95);
    skyColors[i * 3] = 0.008 + t * 0.012;
    skyColors[i * 3 + 1] = 0.035 + t * 0.03;
    skyColors[i * 3 + 2] = 0.07 + t * 0.06;
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

  try {
    airportData = await fetchAirportData(userLat, userLon, 1.2);
    // If clearAirports() was called while we were fetching, discard stale result
    if (_loadEpoch !== myEpoch) return;

    // Remove placeholder now that data has arrived
    _removeLoadingPlaceholder(scene);

    airportGroup = new THREE.Group();
    airportGroup.name = 'airports';
    airportGroup.renderOrder = 50;

    // Terminals first (lowest layer)
    if (airportData.terminals) {
      for (const term of airportData.terminals) {
        renderTerminal(term, userLat, userLon);
      }
    }

    // Taxiways
    if (airportData.taxiways) {
      renderTaxiwaysBatched(airportData.taxiways, userLat, userLon);
    }

    // Runways + approach lights
    for (const rwy of airportData.runways) {
      renderRunway(rwy, userLat, userLon);
      renderApproachLights(rwy, userLat, userLon);
    }

    // Runway edge lights (batched for all runways)
    renderRunwayEdgeLights(airportData.runways, userLat, userLon);

    for (const apt of airportData.airports) {
      renderAirportLabel(apt, userLat, userLon);
    }

    scene.add(airportGroup);
    const txCount = airportData.taxiways?.length || 0;
    const tmCount = airportData.terminals?.length || 0;
    console.log(`[STRATUM] Loaded ${airportData.airports.length} airports, ${airportData.runways.length} runways, ${txCount} taxiways, ${tmCount} terminals`);
  } catch (err) {
    _removeLoadingPlaceholder(scene);
    console.warn('[STRATUM] Airport data fetch failed:', err.message);
  }
}

// ---- Geo helpers ----

function geoToScene(lat, lon, userLat, userLon) {
  return {
    x: (lon - userLon) * GEO_SCALE * _cosLat,
    z: -(lat - userLat) * GEO_SCALE,
  };
}

// ---- Runway Rendering ----

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

  // Main runway surface
  const canvas = createRunwayTexture(rwy.ref, rwy.length, rwy.width);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;

  const geo = new THREE.PlaneGeometry(rLen, rWid);
  const mat = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 0.85,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = headingRad;
  mesh.position.set(cx, 0.038, cz);
  airportGroup.add(mesh);
}

// ---- Runway Texture (realistic markings) ----

function createRunwayTexture(ref, lengthMeters, widthMeters) {
  const W = 2048;
  const H = 160;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const ppm = W / lengthMeters;

  ctx.clearRect(0, 0, W, H);

  // Asphalt base — slightly noisy for realism
  ctx.fillStyle = 'rgba(18, 24, 36, 0.75)';
  ctx.fillRect(0, 0, W, H);

  // Subtle asphalt texture noise
  ctx.fillStyle = 'rgba(255,255,255,0.015)';
  for (let i = 0; i < 200; i++) {
    const nx = Math.random() * W;
    const ny = Math.random() * H;
    ctx.fillRect(nx, ny, 2 + Math.random() * 4, 1);
  }

  // White edge lines (continuous, per spec)
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  const edgeW = Math.max(H * 0.025, 2);
  ctx.fillRect(0, 2, W, edgeW);
  ctx.fillRect(0, H - 2 - edgeW, W, edgeW);

  // Threshold stripes (piano keys) — variable bar count based on runway width
  const numBars = widthMeters >= 45 ? 12 : widthMeters >= 30 ? 8 : 6;
  const barW = Math.max(ppm * 1.5, 5);
  const barH = H * 0.06;
  const barGap = (H * 0.7) / numBars;
  const barStartY = (H - numBars * barGap) / 2;
  const thresholdDepth = Math.max(ppm * 12, 30); // ~12m from edge

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let i = 0; i < numBars; i++) {
    const by = barStartY + i * barGap;
    // Left threshold
    ctx.fillRect(thresholdDepth, by, barW * 8, barH);
    // Right threshold
    ctx.fillRect(W - thresholdDepth - barW * 8, by, barW * 8, barH);
  }

  // Runway designator numbers — positioned after threshold stripes
  const parts = ref.split('/');
  const fontSize = Math.floor(H * 0.55);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  const numOffset = thresholdDepth + barW * 10;
  if (parts[0]) ctx.fillText(parts[0], numOffset, H / 2);
  if (parts[1]) {
    ctx.save();
    ctx.translate(W - numOffset, H / 2);
    ctx.rotate(Math.PI);
    ctx.fillText(parts[1], 0, 0);
    ctx.restore();
  }

  // Centerline dashes — standard 30m dash, 20m gap
  const dashPx = Math.max(30 * ppm, 12);
  const gapPx = Math.max(20 * ppm, 8);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = Math.max(H * 0.02, 2);
  ctx.setLineDash([dashPx, gapPx]);
  ctx.beginPath();
  ctx.moveTo(W * 0.14, H / 2);
  ctx.lineTo(W * 0.86, H / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Touchdown zone markings (pairs of rectangular blocks)
  const tdzStart = 300 * ppm;
  const tdzSpacing = 150 * ppm;
  const tdzW = Math.max(22 * ppm, 14);
  const tdzH = H * 0.10;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let i = 0; i < 3; i++) {
    const xOff = tdzStart + i * tdzSpacing;
    if (xOff + tdzW > W * 0.4) break;
    // Top pair
    ctx.fillRect(xOff, H * 0.20, tdzW, tdzH);
    ctx.fillRect(xOff, H * 0.70, tdzW, tdzH);
    // Mirror at other end
    const xM = W - xOff - tdzW;
    ctx.fillRect(xM, H * 0.20, tdzW, tdzH);
    ctx.fillRect(xM, H * 0.70, tdzW, tdzH);
  }

  // Aiming point markers (fixed distance markings — bold rectangles)
  const aimDist = Math.max(300 * ppm, 60);
  if (aimDist < W * 0.35) {
    const aimW = Math.min(45 * ppm, 55);
    const aimH = H * 0.30;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(aimDist, (H - aimH) / 2, aimW, aimH);
    ctx.fillRect(W - aimDist - aimW, (H - aimH) / 2, aimW, aimH);
  }

  return canvas;
}

// ---- Approach Lights (ALSF-2 style) ----

function renderApproachLights(rwy, userLat, userLon) {
  const s = geoToScene(rwy.startLat, rwy.startLon, userLat, userLon);
  const e = geoToScene(rwy.endLat, rwy.endLon, userLat, userLon);

  // Direction vectors: outward from each threshold
  const dx = e.x - s.x;
  const dz = e.z - s.z;
  const len = Math.sqrt(dx * dx + dz * dz);
  if (len < 0.1) return;
  const nx = dx / len, nz = dz / len; // unit vector start→end

  // Generate approach lights from both ends
  _renderApproachLightRow(s.x, s.z, -nx, -nz, len);
  _renderApproachLightRow(e.x, e.z, nx, nz, len);
}

function _renderApproachLightRow(threshX, threshZ, dirX, dirZ, rwyLen) {
  // ALSF-2: centerline lights every ~30m for 900m, crossbars at 300m and 150m
  const approachLen = 900 / METERS_PER_UNIT; // ~900m in scene units
  const lightSpacing = 30 / METERS_PER_UNIT;
  const numLights = Math.floor(approachLen / lightSpacing);

  const positions = [];
  const colors = [];

  // Perpendicular direction for crossbars
  const perpX = -dirZ, perpZ = dirX;

  for (let i = 1; i <= numLights; i++) {
    const dist = i * lightSpacing;
    const px = threshX + dirX * dist;
    const pz = threshZ + dirZ * dist;

    // Centerline light
    positions.push(px, 0.03, pz);
    const distM = dist * METERS_PER_UNIT;
    if (distM < 300) {
      colors.push(1.0, 0.2, 0.2); // red close to threshold
    } else {
      colors.push(1.0, 1.0, 0.85); // white/warm further out
    }

    // Crossbars at ~150m and ~300m from threshold
    if (Math.abs(distM - 150) < 20 || Math.abs(distM - 300) < 20) {
      const crossWidth = 27 / METERS_PER_UNIT; // ~27m real ALSF-2 crossbar span
      const crossSteps = 4;
      for (let j = -crossSteps; j <= crossSteps; j++) {
        if (j === 0) continue;
        const cx = px + perpX * j * (crossWidth / crossSteps);
        const cz = pz + perpZ * j * (crossWidth / crossSteps);
        positions.push(cx, 0.03, cz);
        colors.push(1.0, 1.0, 0.85);
      }
    }
  }

  if (positions.length === 0) return;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.012, transparent: true, opacity: 0.6,
    vertexColors: true, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  points.name = 'approachLights';
  _approachLightMeshes.push(points);
  airportGroup.add(points);
}

// ---- Runway Edge Lights (batched) ----

function renderRunwayEdgeLights(runways, userLat, userLon) {
  const positions = [];
  const colors = [];

  for (const rwy of runways) {
    const s = geoToScene(rwy.startLat, rwy.startLon, userLat, userLon);
    const e = geoToScene(rwy.endLat, rwy.endLon, userLat, userLon);

    const dx = e.x - s.x, dz = e.z - s.z;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.1) continue;
    const nx = dx / len, nz = dz / len;
    const perpX = -nz, perpZ = nx;

    const halfW = Math.max((rwy.width / METERS_PER_UNIT) * 0.5, 0.006);
    const spacing = 60 / METERS_PER_UNIT; // lights every ~60m
    const numLights = Math.floor(len / spacing);

    for (let i = 0; i <= numLights; i++) {
      const t = i / numLights;
      const px = s.x + dx * t;
      const pz = s.z + dz * t;

      // Both edges
      positions.push(px + perpX * halfW, 0.035, pz + perpZ * halfW);
      positions.push(px - perpX * halfW, 0.035, pz - perpZ * halfW);

      // Edge color: white along most, yellow last 600m, red last 300m from each end
      const distFromStart = t * len * METERS_PER_UNIT;
      const distFromEnd = (1 - t) * len * METERS_PER_UNIT;
      const minDist = Math.min(distFromStart, distFromEnd);

      let r, g, b;
      if (minDist < 300) {
        r = 1.0; g = 0.15; b = 0.1; // red
      } else if (minDist < 600) {
        r = 1.0; g = 0.8; b = 0.2; // amber/yellow
      } else {
        r = 0.9; g = 0.95; b = 1.0; // white
      }
      colors.push(r, g, b, r, g, b);
    }
  }

  if (positions.length === 0) return;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.008, transparent: true, opacity: 0.5,
    vertexColors: true, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  points.name = 'runwayEdgeLights';
  _runwayEdgeLightMesh = points;
  airportGroup.add(points);
}

// ---- Taxiway Rendering (batched) ----

function renderTaxiwaysBatched(taxiways, userLat, userLon) {
  if (!taxiways || taxiways.length === 0) return;

  const allPositions = [];
  const allColors = [];

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

      // Two triangles forming a quad strip
      allPositions.push(
        a.x + perpX, 0.025, a.z + perpZ,
        a.x - perpX, 0.025, a.z - perpZ,
        b.x + perpX, 0.025, b.z + perpZ,
        b.x + perpX, 0.025, b.z + perpZ,
        a.x - perpX, 0.025, a.z - perpZ,
        b.x - perpX, 0.025, b.z - perpZ,
      );
      // Taxiway color — dark blue-gray
      for (let j = 0; j < 6; j++) {
        allColors.push(0.08, 0.12, 0.18);
      }
    }
  }

  if (allPositions.length === 0) return;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(allPositions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(allColors, 3));

  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.55,
    side: THREE.DoubleSide, depthWrite: false,
  });

  const mesh = new THREE.Mesh(geo, mat);
  airportGroup.add(mesh);

  // Taxiway centerline lights (green)
  renderTaxiwayCenterlineLights(taxiways, userLat, userLon);
}

function renderTaxiwayCenterlineLights(taxiways, userLat, userLon) {
  const positions = [];

  for (const twy of taxiways) {
    if (twy.geometry.length < 2) continue;
    const scenePoints = twy.geometry.map(p => geoToScene(p.lat, p.lon, userLat, userLon));
    const spacing = 30 / METERS_PER_UNIT;

    let accumDist = 0;
    for (let i = 0; i < scenePoints.length - 1; i++) {
      const a = scenePoints[i], b = scenePoints[i + 1];
      const dx = b.x - a.x, dz = b.z - a.z;
      const segLen = Math.sqrt(dx * dx + dz * dz);
      if (segLen < 0.001) continue;

      while (accumDist < segLen) {
        const t = accumDist / segLen;
        positions.push(a.x + dx * t, 0.028, a.z + dz * t);
        accumDist += spacing;
      }
      accumDist -= segLen;
    }
  }

  if (positions.length === 0) return;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x22cc66, size: 0.006, transparent: true, opacity: 0.35,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  points.name = 'taxiwayLights';
  _taxiwayLightMesh = points;
  airportGroup.add(points);
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

  // Flat footprint on ground
  const footGeo = new THREE.ShapeGeometry(shape);
  const footMat = new THREE.MeshBasicMaterial({
    color: 0x1a2840, transparent: true, opacity: 0.6,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const footMesh = new THREE.Mesh(footGeo, footMat);
  footMesh.rotation.x = -Math.PI / 2;
  footMesh.position.y = 0.02;
  airportGroup.add(footMesh);

  // Extruded volume — subtle height
  const extGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.04, bevelEnabled: false,
  });
  const extMat = new THREE.MeshBasicMaterial({
    color: 0x1e3050, transparent: true, opacity: 0.35,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const extMesh = new THREE.Mesh(extGeo, extMat);
  extMesh.rotation.x = -Math.PI / 2;
  extMesh.position.y = 0.02;
  airportGroup.add(extMesh);

  // Glowing edge outline for visibility
  const edgeVerts = [];
  for (let i = 0; i < scenePoints.length; i++) {
    const p = scenePoints[i];
    const next = scenePoints[(i + 1) % scenePoints.length];
    edgeVerts.push(p.x, 0.065, p.z, next.x, 0.065, next.z);
  }
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeVerts, 3));
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x5588aa, transparent: true, opacity: 0.2,
    depthWrite: false,
  });
  const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
  airportGroup.add(edgeLine);
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
  const hitGeo = new THREE.SphereGeometry(3.0, 6, 6);
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
}

export function getAirportHitTargets() {
  return airportHitTargets;
}

export function getAirportData() {
  return airportData;
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
        // Clip to ground bounds
        if (Math.abs(p.x) > GROUND_HALF * 1.2 || Math.abs(p.z) > GROUND_HALF * 1.2) {
          // If we have accumulated vertices, flush them as a segment
          if (vertices.length >= 6) {
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            const line = new THREE.Line(geo, mat);
            line.computeLineDistances();
            _firGroup.add(line);
          }
          vertices.length = 0;
          continue;
        }
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
