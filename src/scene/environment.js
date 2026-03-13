import * as THREE from 'three';
import { loadMapTexture } from './mapTiles.js';
import { fetchAirportData, categorizeFlights } from '../data/airports.js';


const GROUND_SIZE = 160;
const GEO_SCALE = 40;

let groundMaterial = null;
let groundMesh = null;
let _cosLat = 1; // cos(userLat) — corrects E-W longitude scale
const hiResOverlays = [];

export function createEnvironment(scene) {
  // Horizon fog — fades map edges into sky for infinity/depth-of-field effect
  scene.fog = new THREE.FogExp2(new THREE.Color(0.008, 0.032, 0.068), 0.013);

  const ambient = new THREE.AmbientLight(0x3a5577, 0.7);
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
  skyDome.renderOrder = -100;
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

// Selection state
let selectedHighlight = null;
let _selectionAnimObjects = [];

// Cached animated objects — populated at load time, iterated in updatePulse
let _aptBeacons = [];
let _approachLightMeshes = [];
let _runwayEdgeLightMesh = null;
let _taxiwayLightMesh = null;
let _pulseRingRef = null;

export async function loadAirports(scene, userLat, userLon) {
  _userLat = userLat;
  _userLon = userLon;

  _aptBeacons = [];
  _approachLightMeshes = [];
  _runwayEdgeLightMesh = null;
  _taxiwayLightMesh = null;

  try {
    airportData = await fetchAirportData(userLat, userLon, 1.2);
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
  airportGroup.add(sprite);

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

  // Hit target for raycasting
  const hitGeo = new THREE.SphereGeometry(1.5, 6, 6);
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
  deselectAirport(scene);
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
