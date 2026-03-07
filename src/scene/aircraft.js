import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { getTrack, getTrackVersion } from '../data/opensky.js';

const METERS_TO_FEET = 3.28084;
const MS_TO_KMH = 3.6;
const DEG_TO_RAD = Math.PI / 180;

const GEO_SCALE = 20;
const METERS_PER_UNIT = 111000 / GEO_SCALE;
const ALT_SCALE = 0.35; // compress vertical axis

const COLOR_CRUISE = new THREE.Color(0xffffff);
const COLOR_CLIMB = new THREE.Color(0xff9d4d);
const COLOR_DESCEND = new THREE.Color(0x4db8ff);
const COLOR_TRAIL = new THREE.Color(0x7eb8ff);

const VS_THRESHOLD = 1.5;

// Trail config — 20 min
const TRAIL_SAMPLE_INTERVAL = 0.2;      // 5Hz live sampling
const TRAIL_MAX_POINTS = 6000;          // 20 min at 5Hz
const SYNTHETIC_TRAIL_SECONDS = 60;     // short stub — real trail grows from live data
const SYNTHETIC_TRAIL_STEP = 0.3;
const TRAIL_REBUILD_INTERVAL = 0.5;     // rebuild geometry 2x/sec
const TRACK_REFRESH_INTERVAL = 120;     // re-check track API every 2 min

// --- Cached geometry / textures ---

let aircraftGeo = null;
let glowTex = null;

let resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  resolution.set(window.innerWidth, window.innerHeight);
});

function getAircraftGeometry() {
  if (aircraftGeo) return aircraftGeo;

  try {
    // Fuselage — tapered cylinder along +X
    const fuselage = new THREE.CylinderGeometry(0.05, 0.08, 1.1, 8);
    fuselage.rotateZ(Math.PI / 2);

    // Nose cone
    const nose = new THREE.ConeGeometry(0.05, 0.3, 8);
    nose.rotateZ(-Math.PI / 2);
    nose.translate(0.7, 0, 0);

    // Wings — swept back
    const wings = new THREE.BoxGeometry(0.35, 0.012, 0.95);
    const wp = wings.attributes.position;
    for (let i = 0; i < wp.count; i++) {
      const z = wp.getZ(i);
      wp.setX(i, wp.getX(i) - Math.abs(z) * 0.3);
    }
    wp.needsUpdate = true;
    wings.translate(-0.02, 0, 0);

    // Engine nacelles
    const eng1 = new THREE.CylinderGeometry(0.025, 0.02, 0.14, 6);
    eng1.rotateZ(Math.PI / 2);
    eng1.translate(0.02, -0.04, 0.22);
    const eng2 = new THREE.CylinderGeometry(0.025, 0.02, 0.14, 6);
    eng2.rotateZ(Math.PI / 2);
    eng2.translate(0.02, -0.04, -0.22);

    // Vertical stabilizer
    const vStab = new THREE.BoxGeometry(0.22, 0.22, 0.012);
    vStab.translate(-0.48, 0.12, 0);

    // Horizontal stabilizer — swept
    const hStab = new THREE.BoxGeometry(0.14, 0.01, 0.38);
    const hp = hStab.attributes.position;
    for (let i = 0; i < hp.count; i++) {
      const z = hp.getZ(i);
      hp.setX(i, hp.getX(i) - Math.abs(z) * 0.25);
    }
    hp.needsUpdate = true;
    hStab.translate(-0.48, 0.04, 0);

    const merged = mergeGeometries([fuselage, nose, wings, eng1, eng2, vStab, hStab]);
    if (merged) {
      aircraftGeo = merged;
      return aircraftGeo;
    }
  } catch (err) {
    console.warn('[STRATUM] mergeGeometries failed, using fallback:', err);
  }

  // Fallback — simple shape if merge fails
  aircraftGeo = new THREE.ConeGeometry(0.15, 1.0, 6);
  aircraftGeo.rotateZ(-Math.PI / 2);
  return aircraftGeo;
}

function getGlowTexture() {
  if (glowTex) return glowTex;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.12)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  glowTex = new THREE.CanvasTexture(canvas);
  return glowTex;
}

function getAircraftColor(verticalRate) {
  if (verticalRate == null) return COLOR_CRUISE;
  if (verticalRate > VS_THRESHOLD) return COLOR_CLIMB;
  if (verticalRate < -VS_THRESHOLD) return COLOR_DESCEND;
  return COLOR_CRUISE;
}

function getStatusLabel(verticalRate) {
  if (verticalRate == null) return 'CRUISE';
  if (verticalRate > VS_THRESHOLD) return 'CLIMBING';
  if (verticalRate < -VS_THRESHOLD) return 'DESCENDING';
  return 'CRUISE';
}

/**
 * Catmull-Rom spline interpolation between waypoints for smooth curves.
 */
function catmullRomInterpolate(points, segmentsPerSpan) {
  if (points.length < 2) return points;
  const result = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    for (let s = 0; s < segmentsPerSpan; s++) {
      const t = s / segmentsPerSpan;
      const t2 = t * t;
      const t3 = t2 * t;

      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      const z = 0.5 * (
        (2 * p1.z) +
        (-p0.z + p2.z) * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3
      );
      result.push(new THREE.Vector3(x, y, z));
    }
  }
  result.push(points[points.length - 1].clone());
  return result;
}

function extrapolatePosition(pos, velocity, heading, verticalRate, dt) {
  if (velocity == null || heading == null) return pos.clone();
  const headRad = heading * DEG_TO_RAD;
  const speedUnits = velocity / METERS_PER_UNIT;
  const dx = Math.sin(headRad) * speedUnits * dt;
  const dz = -Math.cos(headRad) * speedUnits * dt;
  const dy = ((verticalRate || 0) * METERS_TO_FEET) / 1000 * ALT_SCALE * dt;
  return new THREE.Vector3(pos.x + dx, pos.y + dy, pos.z + dz);
}

export function dataToScenePos(data, userLat, userLon) {
  const x = (data.longitude - userLon) * GEO_SCALE;
  const z = -(data.latitude - userLat) * GEO_SCALE;
  const y = (data.baroAltitude * METERS_TO_FEET) / 1000 * ALT_SCALE;
  return new THREE.Vector3(x, y, z);
}

function waypointToScenePos(wp, userLat, userLon) {
  const x = (wp.longitude - userLon) * GEO_SCALE;
  const z = -(wp.latitude - userLat) * GEO_SCALE;
  const y = wp.baroAltitude != null ? (wp.baroAltitude * METERS_TO_FEET) / 1000 * ALT_SCALE : 0;
  return new THREE.Vector3(x, y, z);
}

// --- Aircraft Manager ---

export class AircraftManager {
  constructor(scene, userLat, userLon) {
    this.scene = scene;
    this.userLat = userLat;
    this.userLon = userLon;
    this.aircraft = new Map();
    this.raycasterTargets = [];
  }

  updateUserLocation(lat, lon) {
    this.userLat = lat;
    this.userLon = lon;
  }

  update(dataList) {
    const currentIds = new Set();

    for (const data of dataList) {
      currentIds.add(data.icao24);
      const targetPos = dataToScenePos(data, this.userLat, this.userLon);

      if (this.aircraft.has(data.icao24)) {
        const ac = this.aircraft.get(data.icao24);
        ac.setTarget(targetPos, data);
      } else {
        try {
          const ac = new AircraftObject(data, targetPos, this.scene, this.userLat, this.userLon);
          this.aircraft.set(data.icao24, ac);
          this.raycasterTargets.push(ac.hitMesh);
        } catch (err) {
          console.error('[STRATUM] Failed to create aircraft:', data.icao24, err);
        }
      }
    }

    for (const [id, ac] of this.aircraft) {
      if (!currentIds.has(id)) {
        ac.startFadeOut();
      }
    }

    for (const [id, ac] of this.aircraft) {
      if (ac.removed) {
        ac.dispose(this.scene);
        this.aircraft.delete(id);
        const idx = this.raycasterTargets.indexOf(ac.hitMesh);
        if (idx !== -1) this.raycasterTargets.splice(idx, 1);
      }
    }
  }

  animate(delta, elapsed) {
    for (const ac of this.aircraft.values()) {
      ac.animate(delta, elapsed);
    }
  }

  getByHitMesh(mesh) {
    for (const ac of this.aircraft.values()) {
      if (ac.hitMesh === mesh) return ac;
    }
    return null;
  }

  getCount() {
    let count = 0;
    for (const ac of this.aircraft.values()) {
      if (!ac.fadingOut) count++;
    }
    return count;
  }
}

// --- Aircraft Object ---

class AircraftObject {
  constructor(data, position, scene, userLat, userLon) {
    this.data = data;
    this.scene = scene;
    this.userLat = userLat;
    this.userLon = userLon;
    this.lastApiPos = position.clone();
    this.lastApiTime = performance.now() / 1000;
    this.fadingIn = true;
    this.fadingOut = false;
    this.removed = false;
    this.fadeProgress = 0;
    this.trailPositions = [];
    this.lastTrailSampleTime = 0;
    this.masterOpacity = 0;
    this.hasRealTrack = false;
    this._appliedTrackVersion = 0;
    this._lastTrackCheckTime = 0;
    this._liveStartIndex = 0;

    this.group = new THREE.Group();
    this.group.position.copy(position);

    const color = getAircraftColor(data.verticalRate);

    // Realistic aircraft mesh
    this.bodyMat = new THREE.MeshPhongMaterial({
      color, emissive: color, emissiveIntensity: 0.5,
      transparent: true, opacity: 0,
    });
    this.bodyMesh = new THREE.Mesh(getAircraftGeometry(), this.bodyMat);
    this.bodyMesh.scale.set(1.0, 1.0, 1.0);
    this.group.add(this.bodyMesh);

    // Circular glow (no more square artifact)
    this.glowMat = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color, transparent: true, opacity: 0, depthWrite: false,
    });
    this.glow = new THREE.Sprite(this.glowMat);
    this.glow.scale.set(3, 3, 1);
    this.group.add(this.glow);

    this.labelSprite = this._createLabelSprite(data.callsign || data.icao24);
    this.labelSprite.position.set(0, 1.8, 0);
    this.group.add(this.labelSprite);

    const hitGeo = new THREE.SphereGeometry(1.5, 8, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitMesh = new THREE.Mesh(hitGeo, hitMat);
    this.hitMesh.userData.icao24 = data.icao24;
    this.group.add(this.hitMesh);

    if (data.trueTrack != null) {
      this.group.rotation.y = -data.trueTrack * DEG_TO_RAD;
    }

    this.trailLine = null;
    this._trailDirty = false;
    this._lastTrailRebuildTime = 0;
    this.trailLineMat = new LineMaterial({
      color: 0xffffff, linewidth: 2.5, vertexColors: true,
      transparent: true, opacity: 0, depthWrite: false,
      resolution: resolution,
    });

    this.dropGeometry = new THREE.BufferGeometry();
    this.dropMaterial = new THREE.LineDashedMaterial({
      color: 0x4d9fff, transparent: true, opacity: 0,
      dashSize: 0.5, gapSize: 0.5,
    });
    this.dropLine = new THREE.LineSegments(this.dropGeometry, this.dropMaterial);
    this.updateDropLine(position);
    scene.add(this.dropLine);
    scene.add(this.group);

    this._initTrail(position, data);
    this.rebuildTrail();
  }

  _initTrail(position, data) {
    const track = getTrack(data.icao24);
    if (track && track.length > 1) {
      this._applyRealTrack(track);
      this._appliedTrackVersion = getTrackVersion(data.icao24) || Date.now();
    } else {
      // Short synthetic stub — real trail grows from live data
      this._synthesizeBackTrail(position, data);
    }
    this._liveStartIndex = this.trailPositions.length;
  }

  /**
   * Apply real track waypoints from the OpenSky tracks API.
   * Shows the full available flight path with spline interpolation.
   */
  _applyRealTrack(waypoints) {
    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - 1200; // last 20 minutes

    let rawPoints;
    const recent = waypoints.filter((wp) => wp.time >= cutoff);
    if (recent.length < 2) {
      rawPoints = waypoints.slice(-200);
    } else {
      rawPoints = recent;
    }

    const scenePoints = rawPoints.map((wp) => waypointToScenePos(wp, this.userLat, this.userLon));

    // Catmull-Rom spline: 15 segments per span for smooth curves
    const interpolated = scenePoints.length >= 2
      ? catmullRomInterpolate(scenePoints, 15)
      : scenePoints;

    for (const p of interpolated) {
      this.trailPositions.push(p);
    }

    this.hasRealTrack = true;
  }

  _synthesizeBackTrail(currentPos, data) {
    if (data.velocity == null || data.trueTrack == null) {
      this.trailPositions.push(currentPos.clone());
      return;
    }

    for (let t = SYNTHETIC_TRAIL_SECONDS; t >= 0; t -= SYNTHETIC_TRAIL_STEP) {
      this.trailPositions.push(
        extrapolatePosition(currentPos, data.velocity, data.trueTrack, data.verticalRate || 0, -t)
      );
    }
    this.trailPositions.push(currentPos.clone());
  }

  _createLabelSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 28px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text || '----', 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture, transparent: true, opacity: 0,
      depthWrite: false, sizeAttenuation: true,
    });
    this._labelMat = mat;
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(5, 1.25, 1);
    return sprite;
  }

  setTarget(pos, data) {
    this.lastApiPos.copy(pos);
    this.lastApiTime = performance.now() / 1000;
    this.data = data;

    const color = getAircraftColor(data.verticalRate);
    this.bodyMat.color.copy(color);
    this.bodyMat.emissive.copy(color);
    this.glowMat.color.copy(color);
  }

  _getExtrapolatedTarget() {
    const now = performance.now() / 1000;
    const dt = now - this.lastApiTime;
    return extrapolatePosition(
      this.lastApiPos, this.data.velocity, this.data.trueTrack,
      this.data.verticalRate, dt
    );
  }

  /**
   * Check for new/updated track data from the API.
   * Replaces backfill with real data; preserves accumulated live samples.
   */
  _checkForTrackUpdate(elapsed) {
    if (elapsed - this._lastTrackCheckTime < TRACK_REFRESH_INTERVAL) return;
    this._lastTrackCheckTime = elapsed;

    const version = getTrackVersion(this.data.icao24);
    if (!version || version <= this._appliedTrackVersion) return;

    const track = getTrack(this.data.icao24);
    if (!track || track.length < 2) return;

    // Preserve live-sampled positions
    const liveSamples = this.trailPositions.slice(this._liveStartIndex);

    this.trailPositions = [];
    this._applyRealTrack(track);
    this._appliedTrackVersion = version;

    const newLiveStart = this.trailPositions.length;
    for (const p of liveSamples) {
      this.trailPositions.push(p);
    }
    this._liveStartIndex = newLiveStart;

    if (this.trailPositions.length > TRAIL_MAX_POINTS) {
      const excess = this.trailPositions.length - TRAIL_MAX_POINTS;
      this.trailPositions.splice(0, excess);
      this._liveStartIndex = Math.max(0, this._liveStartIndex - excess);
    }

    this._trailDirty = true;
  }

  sampleTrailPoint(pos) {
    this.trailPositions.push(pos.clone());
    if (this.trailPositions.length > TRAIL_MAX_POINTS) {
      const excess = this.trailPositions.length - TRAIL_MAX_POINTS;
      this.trailPositions.splice(0, excess);
      this._liveStartIndex = Math.max(0, this._liveStartIndex - excess);
    }
    this._trailDirty = true;
  }

  rebuildTrail() {
    const n = this.trailPositions.length;
    if (n < 2) return;

    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);

    for (let i = 0; i < n; i++) {
      const p = this.trailPositions[i];
      const i3 = i * 3;
      positions[i3] = p.x;
      positions[i3 + 1] = p.y;
      positions[i3 + 2] = p.z;

      const t = i / (n - 1);
      colors[i3] = COLOR_TRAIL.r * t;
      colors[i3 + 1] = COLOR_TRAIL.g * t;
      colors[i3 + 2] = COLOR_TRAIL.b * t;
    }

    if (this.trailLine) {
      this.scene.remove(this.trailLine);
      this.trailLine.geometry.dispose();
    }

    const geo = new LineGeometry();
    geo.setPositions(positions);
    geo.setColors(colors);

    this.trailLine = new Line2(geo, this.trailLineMat);
    this.trailLine.computeLineDistances();
    this.scene.add(this.trailLine);
  }

  updateDropLine(pos) {
    const positions = new Float32Array([pos.x, pos.y, pos.z, pos.x, 0, pos.z]);
    this.dropGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.dropLine.computeLineDistances();
  }

  startFadeOut() {
    if (this.fadingOut) return;
    this.fadingOut = true;
    this.fadeProgress = 1;
  }

  animate(delta, elapsed) {
    if (this.fadingIn) {
      this.fadeProgress = Math.min(this.fadeProgress + delta * 0.5, 1);
      if (this.fadeProgress >= 1) this.fadingIn = false;
    }

    if (this.fadingOut) {
      this.fadeProgress = Math.max(this.fadeProgress - delta * 0.33, 0);
      if (this.fadeProgress <= 0) { this.removed = true; return; }
    }

    this.masterOpacity = this.fadeProgress;
    this.bodyMat.opacity = this.masterOpacity;
    this.glowMat.opacity = this.masterOpacity * 0.25;
    this._labelMat.opacity = this.masterOpacity * 0.7;
    this.trailLineMat.opacity = this.masterOpacity * 0.9;
    this.dropMaterial.opacity = this.masterOpacity * 0.2;

    // Dead-reckoning
    const predictedTarget = this._getExtrapolatedTarget();
    this.group.position.lerp(predictedTarget, Math.min(delta * 3, 1));

    // Heading
    if (this.data.trueTrack != null) {
      const targetRotY = -this.data.trueTrack * DEG_TO_RAD;
      let diff = targetRotY - this.group.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.group.rotation.y += diff * delta * 2;
    }

    // Periodically check for updated track data
    this._checkForTrackUpdate(elapsed);

    // Sample live trail
    if (elapsed - this.lastTrailSampleTime >= TRAIL_SAMPLE_INTERVAL) {
      this.lastTrailSampleTime = elapsed;
      this.sampleTrailPoint(this.group.position);
    }

    // Rebuild trail geometry at throttled rate
    if (this._trailDirty && elapsed - this._lastTrailRebuildTime >= TRAIL_REBUILD_INTERVAL) {
      this._lastTrailRebuildTime = elapsed;
      this._trailDirty = false;
      this.rebuildTrail();
    }

    this.updateDropLine(this.group.position);
  }

  dispose(scene) {
    scene.remove(this.group);
    if (this.trailLine) {
      scene.remove(this.trailLine);
      this.trailLine.geometry.dispose();
    }
    this.trailLineMat.dispose();
    scene.remove(this.dropLine);
    this.dropGeometry.dispose();
    this.dropMaterial.dispose();
    this.bodyMat.dispose();
    this.glowMat.dispose();
    if (this._labelMat) {
      if (this._labelMat.map) this._labelMat.map.dispose();
      this._labelMat.dispose();
    }
  }

  getDisplayData() {
    const altFt = this.data.baroAltitude != null
      ? Math.round(this.data.baroAltitude * METERS_TO_FEET) : null;
    const speedKmh = this.data.velocity != null
      ? Math.round(this.data.velocity * MS_TO_KMH) : null;
    const vsFtMin = this.data.verticalRate != null
      ? Math.round(this.data.verticalRate * METERS_TO_FEET * 60) : null;
    const heading = this.data.trueTrack != null
      ? Math.round(this.data.trueTrack) : null;

    return {
      callsign: this.data.callsign || this.data.icao24,
      icao24: this.data.icao24,
      originCountry: this.data.originCountry || '--',
      altitude: altFt != null ? `${altFt.toLocaleString()} ft` : '--',
      speed: speedKmh != null ? `${speedKmh} km/h` : '--',
      heading: heading != null ? `${String(heading).padStart(3, '0')}  ${headingToCardinal(heading)}` : '--',
      verticalSpeed: vsFtMin != null ? `${vsFtMin > 0 ? '+' : ''}${vsFtMin} ft/min` : '--',
      status: getStatusLabel(this.data.verticalRate),
      latitude: this.data.latitude,
      longitude: this.data.longitude,
    };
  }
}

function headingToCardinal(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
