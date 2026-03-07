import * as THREE from 'three';
import { loadMapTexture } from './mapTiles.js';
import { fetchAirportData, categorizeFlights } from '../data/airports.js';

export const ALT_LEVELS = [
  { ft: 10000, y: 0.6, label: '10,000 ft', color: 0x4a3a1a },
  { ft: 18000, y: 1.08, label: '18,000 ft', color: 0x1a3a6b },
  { ft: 35000, y: 2.1, label: '35,000 ft', color: 0x1a3a6b },
  { ft: 40000, y: 2.4, label: '40,000 ft', color: 0x0a1a3b },
];

const GROUND_SIZE = 80;
const GEO_SCALE = 40;

let groundMaterial = null;
const hiResOverlays = [];

export function createEnvironment(scene) {
  const ambient = new THREE.AmbientLight(0x3a5577, 0.7);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0x99bbdd, 0.35);
  dirLight.position.set(20, 60, 30);
  scene.add(dirLight);

  const groundGeo = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE);
  groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.95,
  });
  const ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.name = 'ground';
  groundMaterial.__scene = scene;
  scene.add(ground);

  // Subtle vignette ring around map edge for depth
  const vignetteGeo = new THREE.RingGeometry(GROUND_SIZE * 0.38, GROUND_SIZE * 0.52, 64);
  const vignetteMat = new THREE.MeshBasicMaterial({
    color: 0x020a14, transparent: true, opacity: 0.6,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const vignette = new THREE.Mesh(vignetteGeo, vignetteMat);
  vignette.rotation.x = -Math.PI / 2;
  vignette.position.y = 0.01;
  scene.add(vignette);

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
  pulseGroup.add(pulseRing);

  scene.add(pulseGroup);

  ALT_LEVELS.forEach((level) => {
    const planeGeo = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE);
    const planeMat = new THREE.MeshBasicMaterial({
      color: level.color, transparent: true, opacity: 0.03,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = level.y;
    scene.add(plane);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    ctx.font = '24px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillText(level.label, 8, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture, transparent: true, depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(12, 2.5, 1);
    sprite.position.set(-GROUND_SIZE / 2 + 8, level.y + 0.5, -GROUND_SIZE / 2 + 4);
    scene.add(sprite);
  });
}

export async function loadGroundMap(lat, lon) {
  const degreesExtent = GROUND_SIZE / GEO_SCALE;
  try {
    const texture = await loadMapTexture(lat, lon, degreesExtent, (upgradedTexture, bounds) => {
      if (bounds) {
        // High-res overlay — stacks on top, each higher zoom slightly above previous
        const scene = groundMaterial?.__scene;
        if (!scene) return;
        const sizeX = (bounds.lonMax - bounds.lonMin) * GEO_SCALE;
        const sizeZ = (bounds.latMax - bounds.latMin) * GEO_SCALE;
        const cx = ((bounds.lonMin + bounds.lonMax) / 2 - lon) * GEO_SCALE;
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

export async function loadAirports(scene, userLat, userLon) {
  _userLat = userLat;
  _userLon = userLon;

  try {
    airportData = await fetchAirportData(userLat, userLon, 1.2);
    airportGroup = new THREE.Group();
    airportGroup.name = 'airports';
    airportGroup.renderOrder = 50;

    for (const rwy of airportData.runways) {
      renderRunway(rwy, userLat, userLon);
    }

    for (const apt of airportData.airports) {
      renderAirportLabel(apt, userLat, userLon);
    }

    scene.add(airportGroup);
    console.log(`[STRATUM] Loaded ${airportData.airports.length} airports, ${airportData.runways.length} runways`);
  } catch (err) {
    console.warn('[STRATUM] Airport data fetch failed:', err.message);
  }
}

// ---- Runway Rendering ----

function renderRunway(rwy, userLat, userLon) {
  // Compute from projected start/end coordinates to match map projection
  const startX = (rwy.startLon - userLon) * GEO_SCALE;
  const startZ = -(rwy.startLat - userLat) * GEO_SCALE;
  const endX = (rwy.endLon - userLon) * GEO_SCALE;
  const endZ = -(rwy.endLat - userLat) * GEO_SCALE;

  const dx = endX - startX;
  const dz = endZ - startZ;
  const rLen = Math.sqrt(dx * dx + dz * dz);
  const rWid = Math.max((rwy.width / METERS_PER_UNIT) * 4, 0.08);
  const headingRad = Math.atan2(-dz, dx);

  const cx = (startX + endX) / 2;
  const cz = (startZ + endZ) / 2;

  // Main runway surface
  const canvas = createRunwayTexture(rwy.ref, rwy.length);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;

  const geo = new THREE.PlaneGeometry(rLen, rWid);
  const mat = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 0.8,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = headingRad;
  mesh.position.set(cx, 0.038, cz);
  airportGroup.add(mesh);
}

// ---- Runway Texture (2K — fast, sharp) ----

function createRunwayTexture(ref, lengthMeters) {
  const W = 2048;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const ppm = W / lengthMeters;

  // Transparent base — only markings render
  ctx.clearRect(0, 0, W, H);

  // Subtle asphalt strip
  ctx.fillStyle = 'rgba(20, 28, 40, 0.7)';
  ctx.fillRect(0, 0, W, H);

  // Edge lines
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(0, 4, W, 2);
  ctx.fillRect(0, H - 6, W, 2);

  // Threshold bars (10 bars at each end)
  const barW = 6;
  const barGap = 5;
  const barH = H * 0.45;
  const barY = (H - barH) / 2;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 10; i++) {
    ctx.fillRect(20 + i * (barW + barGap), barY, barW, barH);
    ctx.fillRect(W - 20 - (i + 1) * (barW + barGap), barY, barW, barH);
  }

  // Runway designator numbers
  const parts = ref.split('/');
  const fontSize = Math.floor(H * 0.45);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (parts[0]) ctx.fillText(parts[0], W * 0.09, H / 2);
  if (parts[1]) {
    ctx.save();
    ctx.translate(W * 0.91, H / 2);
    ctx.rotate(Math.PI);
    ctx.fillText(parts[1], 0, 0);
    ctx.restore();
  }

  // Centerline dashes
  const dashPx = Math.max(30 * ppm, 15);
  const gapPx = Math.max(20 * ppm, 10);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  ctx.setLineDash([dashPx, gapPx]);
  ctx.beginPath();
  ctx.moveTo(W * 0.15, H / 2);
  ctx.lineTo(W * 0.85, H / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Touchdown zone markings
  const tdzStart = 300 * ppm;
  const tdzSpacing = 150 * ppm;
  const tdzW = Math.max(22 * ppm, 16);
  const tdzH = H * 0.14;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let i = 0; i < 3; i++) {
    const xOff = tdzStart + i * tdzSpacing;
    if (xOff + tdzW > W * 0.4) break;
    ctx.fillRect(xOff, H * 0.22, tdzW, tdzH);
    ctx.fillRect(xOff, H * 0.64, tdzW, tdzH);
    const xM = W - xOff - tdzW;
    ctx.fillRect(xM, H * 0.22, tdzW, tdzH);
    ctx.fillRect(xM, H * 0.64, tdzW, tdzH);
  }

  // Aiming points
  const aimDist = 300 * ppm;
  if (aimDist > 40 && aimDist < W * 0.35) {
    const aimW = Math.min(45 * ppm, 60);
    const aimH = H * 0.28;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(aimDist, (H - aimH) / 2, aimW, aimH);
    ctx.fillRect(W - aimDist - aimW, (H - aimH) / 2, aimW, aimH);
  }

  return canvas;
}

// ---- Airport Label (clean text, no background) ----

function renderAirportLabel(apt, userLat, userLon) {
  const cx = (apt.lon - userLon) * GEO_SCALE;
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

  const cx = (airport.lon - _userLon) * GEO_SCALE;
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
  const pulseRing = scene.getObjectByName('pulseRing');
  if (pulseRing) {
    const cycle = (time % 5) / 5;
    const scale = 1 + cycle * 3;
    pulseRing.scale.set(scale, scale, 1);
    pulseRing.material.opacity = 0.15 * (1 - cycle * cycle);
  }

  // Airport beacon pulse
  if (airportGroup) {
    airportGroup.children.forEach(child => {
      if (child.name === 'aptBeacon') {
        child.material.opacity = 0.15 + 0.1 * Math.sin(time * 1.5);
      }
    });
  }

  // Selection pulse
  if (selectedHighlight) {
    for (const obj of selectedHighlight.objects) {
      if (obj.name === '_selPulse') {
        const pCycle = (time % 2) / 2;
        const pScale = 1 + pCycle * 0.5;
        obj.scale.set(pScale, 1, pScale);
        obj.material.opacity = 0.2 * (1 - pCycle);
      }
    }
  }
}

// ---- Exports ----

export function getAirportHitTargets() {
  return airportHitTargets;
}

export function getAirportData() {
  return airportData;
}

export { categorizeFlights };
