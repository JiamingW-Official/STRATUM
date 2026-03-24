import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
// GLTFLoader is lazy-loaded on first model request to reduce critical-path JS
import { getTrack, getTrackVersion, getRoute, getHexDetail } from '../data/opensky.js';
import { getAircraftSpecs } from '../data/aircraftDb.js';
import { getAircraftMeta, queueHexLookup } from '../data/hexdb.js';
import { triggerInference, getInferredRoute, detectHoldingPattern } from '../data/routeInfer.js';

const METERS_TO_FEET = 3.28084;
const MS_TO_KMH = 3.6;
const DEG_TO_RAD = Math.PI / 180;

const GEO_SCALE = 40;
const METERS_PER_UNIT = 111000 / GEO_SCALE;
const ALT_SCALE = 0.06; // compress vertical axis

const COLOR_CRUISE = new THREE.Color(0xffffff);
const COLOR_CLIMB = new THREE.Color(0xff9d4d);
const COLOR_DESCEND = new THREE.Color(0x4db8ff);

// Speed-based trail colors (m/s thresholds) — smooth gradient, aviation-inspired
// Taxi/slow → approach → cruise → fast cruise → overspeed
const SPEED_STOPS = [
  { speed: 0,   color: new THREE.Color(0x4a7fff) },  // calm blue — ground/slow
  { speed: 80,  color: new THREE.Color(0x44ddbb) },  // teal — approach ~155 kts
  { speed: 140, color: new THREE.Color(0x66eea0) },  // soft green — climb ~270 kts
  { speed: 200, color: new THREE.Color(0xeedd55) },  // warm gold — cruise ~390 kts
  { speed: 260, color: new THREE.Color(0xee8833) },  // deep orange — fast cruise ~505 kts
  { speed: 310, color: new THREE.Color(0xdd4455) },  // muted red — overspeed ~600 kts
];

const VS_THRESHOLD = 1.5;

// Trail config — 30 min
const TRAIL_SAMPLE_INTERVAL = 0.125;    // 8Hz live sampling — smoother curves between 2s polls
const TRAIL_MAX_POINTS = 14400;         // 30 min at 8Hz
const SYNTHETIC_TRAIL_SECONDS = 120;    // 2 min stub while waiting for real track
const SYNTHETIC_TRAIL_STEP = 0.5;
const TRAIL_REBUILD_INTERVAL = 0.5;     // rebuild geometry every 0.5s for responsive trail updates
const TRACK_REFRESH_INTERVAL = 45;      // re-check track API every 45s for followed/selected aircraft
const TRACK_INITIAL_CHECK_INTERVAL = 0.2; // check every 200ms until track arrives
const LABEL_UPDATE_INTERVAL = 3;        // refresh info label every 3s

// T2-11: Speed-based trail width (m/s → linewidth) — thin, precise lines
function getSpeedLineWidth(speed) {
  if (speed == null || speed < 30) return 0.6;
  if (speed < 80)  return 0.6 + (speed - 30) / (80 - 30) * 0.3;   // 0.6 → 0.9
  if (speed < 200) return 0.9 + (speed - 80) / (200 - 80) * 0.5;  // 0.9 → 1.4
  if (speed < 260) return 1.4 + (speed - 200) / (260 - 200) * 0.3; // 1.4 → 1.7
  return 1.7;
}

// T2-19: Contrail constants
const CONTRAIL_ALT_THRESHOLD = 9144; // FL300 in meters
const CONTRAIL_MAX_PARTICLES = 50;
const CONTRAIL_LIFETIME = 8.0; // seconds

// Aircraft shadow projection — sun-aware ground shadows
let _sunAzimuth = 0;   // radians, 0 = north, clockwise
let _sunElevation = 0;  // radians, 0 = horizon, π/2 = zenith
let _sunDayFactor = 0;  // 0 = night, 1 = full day
let _shadowTex = null;
let _shadowMat = null;
let _shadowGeo = null;

export function setSunState(azimuth, elevation, dayFactor) {
  _sunAzimuth = azimuth;
  _sunElevation = elevation;
  _sunDayFactor = dayFactor;
}

function _getSharedShadowGeo() {
  if (!_shadowGeo) _shadowGeo = new THREE.PlaneGeometry(1, 1);
  return _shadowGeo;
}

function _getSharedShadowMat() {
  if (_shadowMat) return _shadowMat;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const r = size / 2;
  const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, 'rgba(0,0,0,0.35)');
  grad.addColorStop(0.6, 'rgba(0,0,0,0.15)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  _shadowTex = new THREE.CanvasTexture(canvas);
  _shadowMat = new THREE.MeshBasicMaterial({
    map: _shadowTex, transparent: true, opacity: 0,
    depthWrite: false, side: THREE.DoubleSide,
  });
  return _shadowMat;
}

// --- Cached geometry / textures ---

const geoCache = {};
let glowTex = null;

let resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  resolution.set(window.innerWidth, window.innerHeight);
});

// Aircraft type classification
const TYPE_REGIONAL = 'regional';    // CRJ, ERJ, E-jets, ATR, Dash 8
const TYPE_NARROW = 'narrow';        // A320, B737, A321, B757
const TYPE_WIDE_TWIN = 'wideTwin';   // A330, A350, B777, B787
const TYPE_WIDE_QUAD = 'wideQuad';   // A380, B747
const TYPE_BIZJET = 'bizjet';        // Gulfstream, Learjet, Citation, Global
const TYPE_PROP = 'prop';            // small propeller aircraft

const REGIONAL_TYPES = new Set(['CRJ2','CRJ7','CRJ9','CRJX','E135','E145','E170','E75L','E75S','E190','E195','E290','E295','AT43','AT45','AT72','AT76','DH8A','DH8B','DH8C','DH8D','SF34']);
const NARROW_TYPES = new Set(['A318','A319','A320','A20N','A321','A21N','B731','B732','B733','B734','B735','B736','B737','B738','B739','B38M','B39M','BCS1','BCS3','B752','B753','MD80','MD81','MD82','MD83','MD87','MD88','MD90','B712','C919']);
const WIDE_TWIN_TYPES = new Set(['A332','A333','A338','A339','A359','A35K','B762','B763','B764','B772','B773','B77L','B77W','B788','B789','B78X']);
const WIDE_QUAD_TYPES = new Set(['A380','A388','B741','B742','B743','B744','B748']);
const BIZJET_TYPES = new Set(['GLF4','GLF5','GLF6','GL5T','GL7T','GLEX','C510','C525','C525','C550','C560','C56X','C680','C68A','C700','LJ35','LJ45','LJ60','LJ75','CL30','CL35','CL60','FA50','FA7X','FA8X','F900','F2TH','E35L','E50P','E545','E55P','H25B','H25C','ASTR','G150','G200','G280','GALX','PC12','PC24','PRM1']);

function classifyAircraftType(typeCode) {
  if (!typeCode) return TYPE_NARROW;
  const t = typeCode.toUpperCase();
  if (REGIONAL_TYPES.has(t)) return TYPE_REGIONAL;
  if (NARROW_TYPES.has(t)) return TYPE_NARROW;
  if (WIDE_TWIN_TYPES.has(t)) return TYPE_WIDE_TWIN;
  if (WIDE_QUAD_TYPES.has(t)) return TYPE_WIDE_QUAD;
  if (BIZJET_TYPES.has(t)) return TYPE_BIZJET;
  // Heuristics for unknown types
  if (t.startsWith('P') || t.startsWith('C1') || t.startsWith('C2') || t.startsWith('SR2') || t.startsWith('DA')) return TYPE_PROP;
  return TYPE_NARROW;
}

// --- GLB Model Loading System ---

const MODEL_SCALE = 0.25;
let _gltfLoaderInstance = null;
async function _getGLTFLoader() {
  if (!_gltfLoaderInstance) {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    _gltfLoaderInstance = new GLTFLoader();
  }
  return _gltfLoaderInstance;
}

// Map aircraft categories to GLB file paths
const MODEL_FILES = {
  [TYPE_NARROW]:    '/airplane_model/Airplane_Model_B737.glb',    // B737 for narrowbody
  [TYPE_WIDE_TWIN]: '/airplane_model/Airplane_Model_B777.glb',    // B777 for wide twin
  [TYPE_WIDE_QUAD]: '/airplane_model/Airplane_Model_A340.glb',    // A340 for quad engine
  [TYPE_REGIONAL]:  '/airplane_model/Airplane_Model_Regional_CRJ.glb',
  [TYPE_BIZJET]:    '/airplane_model/Airplane_Model_Regional_CRJ.glb', // CRJ as stand-in
  [TYPE_PROP]:      '/airplane_model/Airplane_Model_Regional_CRJ.glb',
};

// Specific type code overrides — more accurate model selection
const TYPE_CODE_MODEL_OVERRIDE = {
  'A318': '/airplane_model/Airplane_Model_A320.glb',
  'A319': '/airplane_model/Airplane_Model_A320.glb',
  'A320': '/airplane_model/Airplane_Model_A320.glb',
  'A20N': '/airplane_model/Airplane_Model_A320.glb',
  'A321': '/airplane_model/Airplane_Model_A320.glb',
  'A21N': '/airplane_model/Airplane_Model_A320.glb',
  'BCS1': '/airplane_model/Airplane_Model_A320.glb',
  'BCS3': '/airplane_model/Airplane_Model_A320.glb',
  'A332': '/airplane_model/Airplane_Model_A330.glb',
  'A333': '/airplane_model/Airplane_Model_A330.glb',
  'A338': '/airplane_model/Airplane_Model_A330.glb',
  'A339': '/airplane_model/Airplane_Model_A330.glb',
  'A359': '/airplane_model/Airplane_Model_A350.glb',
  'A35K': '/airplane_model/Airplane_Model_A350.glb',
  'A380': '/airplane_model/Airplane_Model_A340.glb',
  'A388': '/airplane_model/Airplane_Model_A340.glb',
  'B741': '/airplane_model/Airplane_Model_A340.glb',
  'B742': '/airplane_model/Airplane_Model_A340.glb',
  'B743': '/airplane_model/Airplane_Model_A340.glb',
  'B744': '/airplane_model/Airplane_Model_A340.glb',
  'B748': '/airplane_model/Airplane_Model_A340.glb',
  'B772': '/airplane_model/Airplane_Model_B777.glb',
  'B773': '/airplane_model/Airplane_Model_B777.glb',
  'B77L': '/airplane_model/Airplane_Model_B777.glb',
  'B77W': '/airplane_model/Airplane_Model_B777.glb',
  'B788': '/airplane_model/Airplane_Model_A350.glb',
  'B789': '/airplane_model/Airplane_Model_A350.glb',
  'B78X': '/airplane_model/Airplane_Model_A350.glb',
};

// Cache loaded scenes per file path
const _modelCache = {};       // path → Promise<THREE.Group>
const _modelSceneCache = {};  // path → resolved THREE.Group (template)
// Per-model geometry dimensions (measured from GLB bounding box after rotation)
const _modelDimensions = {};  // path → { halfSpan, tailX, wingY }

function getModelPath(typeCode) {
  if (typeCode) {
    const t = typeCode.toUpperCase();
    if (TYPE_CODE_MODEL_OVERRIDE[t]) return TYPE_CODE_MODEL_OVERRIDE[t];
  }
  const category = classifyAircraftType(typeCode);
  return MODEL_FILES[category] || MODEL_FILES[TYPE_NARROW];
}

function loadModel(path) {
  if (_modelCache[path]) return _modelCache[path];

  _modelCache[path] = _getGLTFLoader().then(loader => new Promise((resolve) => {
    loader.load(
      path,
      (gltf) => {
        const scene = gltf.scene;
        // Normalize model: compute bounding box, center and scale to unit size
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = MODEL_SCALE / maxDim;
        scene.scale.set(scale, scale, scale);

        // Center the model
        const center = new THREE.Vector3();
        box.getCenter(center);
        scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Rotate +90° around Y then flip 180° → nose points +X
        const container = new THREE.Group();
        container.add(scene);
        container.rotation.y = -Math.PI / 2;

        _modelSceneCache[path] = container;
        // Measure rotated bounding box for precise nav light placement
        container.updateMatrixWorld(true);
        const rotBox = new THREE.Box3().setFromObject(container);
        const rotSize = rotBox.getSize(new THREE.Vector3());
        _modelDimensions[path] = {
          halfSpan: rotSize.z / 2,                       // wingtip ±Z from center
          tailX: rotBox.min.x,                           // tail end (negative X)
          wingY: rotBox.min.y + rotSize.y * 0.45,        // wing height (slightly below center)
        };
        console.log(`[STRATUM] Model loaded: ${path} (${rotSize.x.toFixed(3)}×${rotSize.y.toFixed(3)}×${rotSize.z.toFixed(3)}, halfSpan=${_modelDimensions[path].halfSpan.toFixed(3)})`);
        resolve(scene);
      },
      undefined,
      (err) => {
        console.warn(`[STRATUM] Model load failed: ${path}`, err);
        resolve(null);
      }
    );
  }));

  return _modelCache[path];
}

// Pre-load all unique model files
const _uniqueModelPaths = new Set(Object.values(MODEL_FILES));
for (const path of Object.values(TYPE_CODE_MODEL_OVERRIDE)) {
  _uniqueModelPaths.add(path);
}
for (const path of _uniqueModelPaths) {
  loadModel(path);
}

function cloneModelForAircraft(typeCode) {
  const path = getModelPath(typeCode);
  const template = _modelSceneCache[path];
  if (!template) return null;

  const clone = template.clone();
  // Deep clone materials so each aircraft can have its own color/opacity
  clone.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone();
      child.material.transparent = true;
      child.material.opacity = 0;
      // Pre-init emissive to avoid per-frame allocation check in _setModelColor
      if (!child.material.emissive) child.material.emissive = new THREE.Color();
    }
  });
  return clone;
}

// Fallback: tiny cone geometry for models that haven't loaded yet
function getFallbackGeometry() {
  if (!geoCache._fallback) {
    const fb = new THREE.ConeGeometry(0.015, 0.1, 8);
    fb.rotateZ(-Math.PI / 2);
    geoCache._fallback = fb;
  }
  return geoCache._fallback;
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

const _tmpColorA = new THREE.Color();
const _tmpColorB = new THREE.Color();

function getSpeedColor(speed) {
  if (speed == null) speed = 0;
  const stops = SPEED_STOPS;
  if (speed <= stops[0].speed) return _tmpColorA.copy(stops[0].color);
  if (speed >= stops[stops.length - 1].speed) return _tmpColorA.copy(stops[stops.length - 1].color);
  for (let i = 0; i < stops.length - 1; i++) {
    if (speed <= stops[i + 1].speed) {
      const t = (speed - stops[i].speed) / (stops[i + 1].speed - stops[i].speed);
      return _tmpColorA.copy(stops[i].color).lerp(stops[i + 1].color, t);
    }
  }
  return _tmpColorA.copy(stops[stops.length - 1].color);
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

function extrapolatePosition(pos, velocity, heading, verticalRate, dt, out, headingRate) {
  if (velocity == null || heading == null) { out.copy(pos); return out; }
  const speedUnits = velocity / METERS_PER_UNIT;
  // If aircraft is turning, extrapolate along the arc using average heading
  const avgHeading = (headingRate && Math.abs(headingRate) > 0.3)
    ? heading + headingRate * dt * 0.5
    : heading;
  const headRad = avgHeading * DEG_TO_RAD;
  out.set(
    pos.x + Math.sin(headRad) * speedUnits * dt,
    pos.y + ((verticalRate || 0) * METERS_TO_FEET) / 1000 * ALT_SCALE * dt,
    pos.z - Math.cos(headRad) * speedUnits * dt,
  );
  return out;
}

const _tmpScenePos = new THREE.Vector3();
// Prefer geometric (GPS) altitude for 3D positioning — it's the true position.
// Barometric altitude drifts with pressure; geometric is WGS84-referenced.
// Fallback to barometric when geometric unavailable (older transponders).
function bestAlt(data) {
  return (data.geoAltitude != null ? data.geoAltitude : data.baroAltitude) || 0;
}

export function dataToScenePos(data, userLat, userLon) {
  const cosLat = Math.cos(userLat * DEG_TO_RAD);
  const x = (data.longitude - userLon) * GEO_SCALE * cosLat;
  const z = -(data.latitude - userLat) * GEO_SCALE;
  const y = (bestAlt(data) * METERS_TO_FEET) / 1000 * ALT_SCALE;
  return _tmpScenePos.set(x, y, z);
}

const _tmpWaypointPos = new THREE.Vector3();
function waypointToScenePos(wp, userLat, userLon) {
  const cosLat = Math.cos(userLat * DEG_TO_RAD);
  const x = (wp.longitude - userLon) * GEO_SCALE * cosLat;
  const z = -(wp.latitude - userLat) * GEO_SCALE;
  const y = wp.baroAltitude != null ? (wp.baroAltitude * METERS_TO_FEET) / 1000 * ALT_SCALE : 0;
  return _tmpWaypointPos.set(x, y, z);
}

// --- Shared geometries / materials (one instance, many aircraft) ---
let _sharedHitGeo = null;
function getSharedHitGeometry() {
  if (!_sharedHitGeo) _sharedHitGeo = new THREE.SphereGeometry(2.0, 8, 8);
  return _sharedHitGeo;
}

let _sharedHitMat = null;
function getSharedHitMaterial() {
  if (!_sharedHitMat) _sharedHitMat = new THREE.MeshBasicMaterial({ visible: false });
  return _sharedHitMat;
}

// --- Aircraft Manager ---

export class AircraftManager {
  constructor(scene, userLat, userLon) {
    this.scene = scene;
    this.userLat = userLat;
    this.userLon = userLon;
    this.aircraft = new Map();
    this.raycasterTargets = [];
    this._highlightSet = null;
    this._filterSet = null;    // null = no filter (all pass), Set = only these icao24s pass
    this._lastLabelCullTime = 0; // T2-13: throttle label culling
    this._activeCount = 0; // cached count — avoids O(n) in getCount()
    this._viewW = window.innerWidth;
    this._viewH = window.innerHeight;
    this._onResize = () => { this._viewW = window.innerWidth; this._viewH = window.innerHeight; };
    window.addEventListener('resize', this._onResize);
    this.trailOpacityMult = parseFloat(localStorage.getItem('stratum:trailOpacity') || '1.0'); // T1-11
  }

  // T1-11: Trail opacity presets (0.2, 0.4, 0.6, 0.8, 1.0)
  setTrailOpacity(level) {
    this.trailOpacityMult = level;
    localStorage.setItem('stratum:trailOpacity', String(level));
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

      // S1: Unusual attitude detection
      const vsFpm = data.verticalRate != null ? Math.abs(data.verticalRate * METERS_TO_FEET * 60) : 0;
      const gsKts = data.velocity != null ? data.velocity * 1.94384 : 999;
      const altFt = data.baroAltitude != null ? data.baroAltitude * METERS_TO_FEET : 0;
      data._unusualAttitude = null;
      if (vsFpm > 6000) data._unusualAttitude = 'EMERGENCY DESCENT';
      else if (altFt > 10000 && gsKts < 100 && gsKts > 0) data._unusualAttitude = 'LOW SPEED';
      // Check rapid heading change (>90° in recent updates)
      if (this.aircraft.has(data.icao24)) {
        const ac = this.aircraft.get(data.icao24);
        if (ac.data.trueTrack != null && data.trueTrack != null) {
          let hdgDelta = Math.abs(data.trueTrack - ac.data.trueTrack);
          if (hdgDelta > 180) hdgDelta = 360 - hdgDelta;
          if (hdgDelta > 90) data._unusualAttitude = 'SHARP TURN';
        }
        ac.setTarget(targetPos, data);
      } else {
        try {
          const ac = new AircraftObject(data, targetPos, this.scene, this.userLat, this.userLon);
          this.aircraft.set(data.icao24, ac);
          this.raycasterTargets.push(ac.hitMesh);
          this.raycasterTargets.push(ac.labelSprite);
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

    let activeCount = 0;
    for (const [id, ac] of this.aircraft) {
      if (ac.removed) {
        ac.dispose(this.scene);
        this.aircraft.delete(id);
        const idx = this.raycasterTargets.indexOf(ac.hitMesh);
        if (idx !== -1) this.raycasterTargets.splice(idx, 1);
        const spriteIdx = this.raycasterTargets.indexOf(ac.labelSprite);
        if (spriteIdx !== -1) this.raycasterTargets.splice(spriteIdx, 1);
      } else if (!ac.fadingOut) {
        activeCount++;
      }
    }
    this._activeCount = activeCount;
  }

  animate(delta, elapsed, camera) {
    for (const ac of this.aircraft.values()) {
      ac._trailOpacityMult = this.trailOpacityMult; // T1-11
      ac.animate(delta, elapsed, this._highlightSet, this._filterSet);
    }
    // T2-13: Smart label density culling — every ~0.5s
    if (camera && elapsed - this._lastLabelCullTime >= 0.5) {
      this._lastLabelCullTime = elapsed;
      this.cullOverlappingLabels(camera);
    }
  }

  // T2-13: Hide labels that overlap nearer aircraft labels in screen space
  cullOverlappingLabels(camera) {
    const entries = [];
    const _projVec = this._cullProjVec || (this._cullProjVec = new THREE.Vector3());
    const w = this._viewW, h = this._viewH;
    for (const ac of this.aircraft.values()) {
      if (ac.fadingOut || ac.removed) continue;
      if (!ac.labelSprite) continue;
      _projVec.setFromMatrixPosition(ac.group.matrixWorld);
      const dist = _projVec.distanceTo(camera.position);
      _projVec.project(camera);
      if (_projVec.z > 1) { ac.labelSprite.visible = false; continue; }
      const sx = (_projVec.x * 0.5 + 0.5) * w;
      const sy = (-_projVec.y * 0.5 + 0.5) * h;
      // Frustum cull — skip labels clearly off-screen
      if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
        ac.labelSprite.visible = false; continue;
      }
      entries.push({ ac, sx, sy, dist });
    }
    entries.sort((a, b) => a.dist - b.dist);
    const MAX_VISIBLE = 60; // cap visible labels to bound O(n²)
    const occupied = [];
    const MIN_DIST_SQ = 30 * 30;
    for (const e of entries) {
      if (occupied.length >= MAX_VISIBLE) { e.ac.labelSprite.visible = false; continue; }
      let blocked = false;
      for (let i = 0, len = occupied.length; i < len; i++) {
        const dx = e.sx - occupied[i].sx;
        const dy = e.sy - occupied[i].sy;
        if (dx * dx + dy * dy < MIN_DIST_SQ) { blocked = true; break; }
      }
      if (blocked) {
        e.ac.labelSprite.visible = false;
      } else {
        e.ac.labelSprite.visible = true;
        occupied.push(e);
      }
    }
  }

  setHighlight(icao24Set) {
    this._highlightSet = icao24Set;
  }

  clearHighlight() {
    this._highlightSet = null;
  }

  setFilter(icao24Set) {
    this._filterSet = icao24Set;
  }

  clearFilter() {
    this._filterSet = null;
  }

  clearAll(scene) {
    for (const ac of this.aircraft.values()) {
      ac.dispose(scene);
    }
    this.aircraft.clear();
    this.raycasterTargets.length = 0;
    this._highlightSet = null;
    this._filterSet = null;
    this._selectedAc = null;
  }

  getByHitMesh(mesh) {
    for (const ac of this.aircraft.values()) {
      if (ac.hitMesh === mesh || ac.labelSprite === mesh) return ac;
    }
    return null;
  }

  getCount() {
    // Use cached count — updated in update() which runs every poll
    return this._activeCount;
  }

  getByIcao(icao24) {
    return this.aircraft.get(icao24) || null;
  }

  // --- Selection ring ---
  selectAircraft(ac) {
    this.deselectAircraft();
    if (!ac) return;
    this._selectedAc = ac;
    // Glowing ring that follows the aircraft
    const ringGeo = new THREE.RingGeometry(0.18, 0.22, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x5aacff, transparent: true, opacity: 0.7,
      side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this._selRing = new THREE.Mesh(ringGeo, ringMat);
    this._selRing.rotation.x = -Math.PI / 2;
    ac.group.add(this._selRing);
    this._selRingMat = ringMat;

    // Heading prediction line — dashed line extending forward
    this._createPredictionLine(ac);
  }

  _createPredictionLine(ac) {
    this._removePredictionLine();
    const data = ac.data;
    if (data.trueTrack == null || data.velocity == null) return;

    // Predict 60s ahead, converted to scene units
    const dist = (data.velocity * 60) / METERS_PER_UNIT;
    const clampedDist = Math.min(dist, 12); // cap visual length
    if (clampedDist < 0.3) return;

    const segments = 24;
    const positions = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      positions.push(t * clampedDist, 0, 0); // local space, +X is forward (matches model orientation)
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.LineDashedMaterial({
      color: 0x5aacff, transparent: true, opacity: 0.3,
      dashSize: 0.15, gapSize: 0.1,
      depthWrite: false, fog: false,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    ac.group.add(line);
    this._predLine = line;
    this._predLineMat = mat;
  }

  _removePredictionLine() {
    if (this._predLine && this._selectedAc) {
      this._selectedAc.group.remove(this._predLine);
      this._predLine.geometry.dispose();
      this._predLineMat.dispose();
    }
    this._predLine = null;
    this._predLineMat = null;
  }

  deselectAircraft() {
    this._removePredictionLine();
    if (this._selRing && this._selectedAc) {
      this._selectedAc.group.remove(this._selRing);
      this._selRing.geometry.dispose();
      this._selRingMat.dispose();
    }
    this._selRing = null;
    this._selRingMat = null;
    this._selectedAc = null;
  }

  animateSelection(elapsed) {
    if (this._selRing && this._selRingMat) {
      const pulse = 0.5 + 0.4 * Math.sin(elapsed * 3);
      this._selRingMat.opacity = pulse;
      const s = 1 + 0.15 * Math.sin(elapsed * 2);
      this._selRing.scale.set(s, s, 1);
    }
    // Animate prediction line — gentle pulse and update length if speed changed
    if (this._predLineMat) {
      this._predLineMat.opacity = 0.15 + 0.15 * Math.sin(elapsed * 2);
    }
    // Rebuild prediction line periodically (speed/heading changes)
    if (this._selectedAc && elapsed - (this._lastPredRebuild || 0) > 5) {
      this._lastPredRebuild = elapsed;
      this._createPredictionLine(this._selectedAc);
    }
  }

  search(query, limit = 20) {
    const q = query.toUpperCase();
    const scored = [];
    // Support route search like "LAX-JFK" or "LAX JFK"
    const routeParts = q.split(/[-\s>→]+/).filter(p => p.length >= 2);
    const isRouteQuery = routeParts.length === 2 && routeParts[0].length <= 4 && routeParts[1].length <= 4;

    for (const ac of this.aircraft.values()) {
      if (ac.fadingOut) continue;
      const d = ac.data;
      const cs = (d.callsign || '').toUpperCase();
      const reg = (d.registration || '').toUpperCase();
      const type = (d.aircraftType || '').toUpperCase();
      const icao = (d.icao24 || '').toUpperCase();
      const route = getRoute(d.callsign);
      const origin = (d.origin || (route && route.origin) || '').toUpperCase();
      const dest = (d.destination || (route && route.destination) || '').toUpperCase();
      const airline = (route && route.airline || d.operator || '').toUpperCase();

      let score = 0;

      // Route search: "LAX-JFK" matches flights from LAX to JFK
      if (isRouteQuery) {
        const [rOrig, rDest] = routeParts;
        if (origin.includes(rOrig) && dest.includes(rDest)) score = 100;
        else if (origin.includes(rDest) && dest.includes(rOrig)) score = 90;
        else if (origin.includes(rOrig) || dest.includes(rDest)) score = 40;
        else if (origin.includes(rDest) || dest.includes(rOrig)) score = 35;
      }

      // Exact match scores highest
      if (cs === q) score = Math.max(score, 200);
      else if (reg === q) score = Math.max(score, 190);
      else if (icao === q) score = Math.max(score, 180);
      // Prefix match
      else if (cs.startsWith(q)) score = Math.max(score, 150);
      else if (reg.startsWith(q)) score = Math.max(score, 140);
      // Contains match
      else if (cs.includes(q)) score = Math.max(score, 100);
      else if (reg.includes(q)) score = Math.max(score, 90);
      else if (type.includes(q)) score = Math.max(score, 80);
      else if (icao.includes(q)) score = Math.max(score, 70);
      // Search by origin/destination/airline
      else if (origin === q || dest === q) score = Math.max(score, 85);
      else if (origin.includes(q) || dest.includes(q)) score = Math.max(score, 60);
      else if (airline.includes(q)) score = Math.max(score, 55);

      if (score > 0) {
        scored.push({ ac, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.ac);
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
    this._extrapolatedPos = new THREE.Vector3();
    this._headingRate = 0;       // deg/s turn rate for curved extrapolation
    this._prevHeading = null;
    this.fadingIn = true;
    this.fadingOut = false;
    this.removed = false;
    this.fadeProgress = 0;
    this._createdAt = Date.now();
    this.trailPositions = [];
    this.lastTrailSampleTime = 0;
    this.masterOpacity = 0;
    this.hasRealTrack = false;
    this._appliedTrackVersion = 0;
    this._lastTrackCheckTime = 0;
    this._liveStartIndex = 0;
    this._gaps = [];

    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.group.renderOrder = 1000;

    const color = getSpeedColor(data.velocity);

    // GLB model (or fallback)
    this._modelGroup = null;
    this._useGLB = false;
    this._modelMeshes = []; // cached mesh list — avoids traverse every frame

    const glbClone = cloneModelForAircraft(data.aircraftType);
    if (glbClone) {
      this._modelGroup = glbClone;
      this._useGLB = true;
      this.group.add(glbClone);
      glbClone.traverse(c => { if (c.isMesh) this._modelMeshes.push(c); });
      this._setModelColor(color);
    } else {
      // Fallback: small procedural cone until GLB loads
      this.bodyMat = new THREE.MeshPhongMaterial({
        color, emissive: color, emissiveIntensity: 0.85,
        transparent: true, opacity: 0,
      });
      this.bodyMesh = new THREE.Mesh(getFallbackGeometry(), this.bodyMat);
      this.group.add(this.bodyMesh);

      // Try async load → swap from cached container (includes rotation)
      const modelPath = getModelPath(data.aircraftType);
      loadModel(modelPath).then(() => {
        const cachedContainer = _modelSceneCache[modelPath];
        if (cachedContainer && !this.removed) {
          const clone = cachedContainer.clone();
          clone.traverse((child) => {
            if (child.isMesh) {
              child.material = child.material.clone();
              child.material.transparent = true;
              child.material.opacity = this.masterOpacity;
            }
          });
          this.group.remove(this.bodyMesh);
          this._modelGroup = clone;
          this._useGLB = true;
          this._modelMeshes = [];
          clone.traverse(c => { if (c.isMesh) this._modelMeshes.push(c); });
          this.group.add(clone);
          this._lastColorR = -1; // force color update
          this._setModelColor(getSpeedColor(this.data.velocity));
        }
      });
    }

    this.labelSprite = this._createInfoLabel(data);
    this.labelSprite.position.set(0, 0.18, 0);
    this.group.add(this.labelSprite);

    this.hitMesh = new THREE.Mesh(getSharedHitGeometry(), getSharedHitMaterial());
    this.hitMesh.userData.icao24 = data.icao24;
    this.group.add(this.hitMesh);

    // ── Navigation lights + strobes ──
    // Use actual GLB bounding-box dimensions so lights sit precisely at each model's wingtips
    const navGlowTex = getGlowTexture();
    const modelPath = getModelPath(data.aircraftType);
    const dims = _modelDimensions[modelPath];
    const halfSpan = dims ? dims.halfSpan : MODEL_SCALE * 0.4;
    const tailX    = dims ? dims.tailX * 0.9 : -MODEL_SCALE * 0.4;
    const wingY    = dims ? dims.wingY : 0.005;
    this._navLights = [];

    // Port (red) — left wingtip (+Z)
    const portLight = new THREE.Sprite(new THREE.SpriteMaterial({
      map: navGlowTex, color: 0xff2233, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    portLight.scale.set(0.045, 0.045, 1);
    portLight.position.set(0, wingY, halfSpan);
    this.group.add(portLight);
    this._navLights.push(portLight);

    // Starboard (green) — right wingtip (-Z)
    const starboardLight = new THREE.Sprite(new THREE.SpriteMaterial({
      map: navGlowTex, color: 0x22ff44, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    starboardLight.scale.set(0.045, 0.045, 1);
    starboardLight.position.set(0, wingY, -halfSpan);
    this.group.add(starboardLight);
    this._navLights.push(starboardLight);

    // Tail strobe (white) — at actual tail position from model bounds
    const tailStrobe = new THREE.Sprite(new THREE.SpriteMaterial({
      map: navGlowTex, color: 0xffffff, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    tailStrobe.scale.set(0.035, 0.035, 1);
    tailStrobe.position.set(tailX, 0.01, 0);
    this.group.add(tailStrobe);
    this._navLights.push(tailStrobe);
    this._tailStrobe = tailStrobe;

    // Wingtip strobes (white, high-intensity anti-collision)
    // Co-located with nav lights; flash pattern differs by manufacturer
    const _mkStrobeMat = () => new THREE.SpriteMaterial({
      map: navGlowTex, color: 0xffffff, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const portStrobe = new THREE.Sprite(_mkStrobeMat());
    portStrobe.scale.set(0.06, 0.06, 1);
    portStrobe.position.set(0, wingY, halfSpan);
    this.group.add(portStrobe);
    const stbdStrobe = new THREE.Sprite(_mkStrobeMat());
    stbdStrobe.scale.set(0.06, 0.06, 1);
    stbdStrobe.position.set(0, wingY, -halfSpan);
    this.group.add(stbdStrobe);
    this._wingStrobes = [portStrobe, stbdStrobe];

    // Manufacturer for strobe pattern — Boeing: single flash, Airbus: double flash
    const _specs = getAircraftSpecs(data.aircraftType);
    this._isAirbus = _specs ? _specs.mfr === 'Airbus' : false;

    // Body glow sprite — subtle halo around aircraft body, colored by speed
    this._bodyGlowMat = new THREE.SpriteMaterial({
      map: navGlowTex,
      color: new THREE.Color(color.r, color.g, color.b),
      transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this._bodyGlow = new THREE.Sprite(this._bodyGlowMat);
    this._bodyGlow.scale.set(0.25, 0.25, 1);
    this._bodyGlow.position.set(0, 0.01, 0);
    this.group.add(this._bodyGlow);

    if (data.trueTrack != null) {
      this.group.rotation.y = -Math.PI / 2 - data.trueTrack * DEG_TO_RAD;
    }

    this.trailLine = null;
    this._trailDirty = false;
    this._lastTrailRebuildTime = 0;
    this.trailLineMat = new LineMaterial({
      color: 0xffffff, linewidth: 1.5, vertexColors: true,
      transparent: true, opacity: 0,
      depthWrite: false, depthTest: false,
      alphaToCoverage: true,
      resolution: resolution,
    });

    this._dropPosArray = new Float32Array(6);
    this.dropGeometry = new THREE.BufferGeometry();
    this.dropGeometry.setAttribute('position', new THREE.BufferAttribute(this._dropPosArray, 3));
    this.dropMaterial = new THREE.LineDashedMaterial({
      color: 0x3a6a9f, transparent: true, opacity: 0,
      dashSize: 0.15, gapSize: 0.25,
      depthTest: false, depthWrite: false,
    });
    this.dropLine = new THREE.LineSegments(this.dropGeometry, this.dropMaterial);
    this.dropLine.renderOrder = 998;
    this.dropLine.computeLineDistances();

    // Gap line — dashed gray for ADS-B signal gaps
    this._gapLine = null;
    this.updateDropLine(position);
    scene.add(this.dropLine);
    scene.add(this.group);

    this._initTrail(position, data);
    this.rebuildTrail();

    // T2-19: Contrail particle system (initialized lazily when above FL300)
    this._contrailPoints = null;  // Points mesh
    this._contrailGeo = null;
    this._contrailMat = null;
    this._contrailParticles = []; // { age, worldPos }
    this._contrailActive = false;

    // Aircraft shadow on ground — shared geometry, cloned material for per-instance opacity
    this._shadowMat = _getSharedShadowMat().clone();
    this._shadow = new THREE.Mesh(_getSharedShadowGeo(), this._shadowMat);
    this._shadow.rotation.x = -Math.PI / 2;
    this._shadow.renderOrder = 5;
    this._shadow.visible = false;
    scene.add(this._shadow);

    // Queue hexdb metadata lookup for operator/type info
    queueHexLookup(data.icao24);
  }

  _initTrail(position, data) {
    const track = getTrack(data.icao24);
    if (track && track.length > 1) {
      this._applyRealTrack(track);
      this._appliedTrackVersion = getTrackVersion(data.icao24) || Date.now();
    } else {
      // No trail until real track data arrives — synthetic trails look fake
      this.trailPositions.push({ pos: position.clone(), speed: data.velocity });
    }
    this._liveStartIndex = this.trailPositions.length;
  }

  /**
   * Apply real track waypoints from the OpenSky tracks API.
   * Shows the full available flight path with spline interpolation.
   */
  _applyRealTrack(waypoints) {
    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - 1800; // last 30 minutes

    let rawPoints;
    const recent = waypoints.filter((wp) => wp.time >= cutoff);
    if (recent.length < 2) {
      rawPoints = waypoints.slice(-400);
    } else {
      rawPoints = recent;
    }

    // Compute real speed from lat/lon distance and time delta (m/s)
    // Also detect signal gaps (>30s between points)
    const GAP_THRESHOLD = 30; // seconds
    const withSpeed = [];
    for (let i = 0; i < rawPoints.length; i++) {
      const wp = rawPoints[i];
      let speed = null;
      let isGapStart = false;
      if (i > 0) {
        const prev = rawPoints[i - 1];
        const dt = wp.time - prev.time;
        if (dt > GAP_THRESHOLD) {
          isGapStart = true;
        }
        if (dt > 0) {
          const dlat = (wp.latitude - prev.latitude) * 111000;
          const dlon = (wp.longitude - prev.longitude) * 111000 * Math.cos(wp.latitude * DEG_TO_RAD);
          const dist = Math.sqrt(dlat * dlat + dlon * dlon);
          speed = dist / dt;
        }
      }
      withSpeed.push({ pos: waypointToScenePos(wp, this.userLat, this.userLon).clone(), speed, isGapStart });
    }

    // Split into segments at gap boundaries, interpolate each separately
    const segments = [[]];
    for (const p of withSpeed) {
      if (p.isGapStart && segments[segments.length - 1].length > 0) {
        segments.push([]);
      }
      segments[segments.length - 1].push(p);
    }

    // Store gap connections (last point of prev segment → first point of next segment)
    this._gaps = [];
    for (let s = 1; s < segments.length; s++) {
      const prevSeg = segments[s - 1];
      const nextSeg = segments[s];
      if (prevSeg.length > 0 && nextSeg.length > 0) {
        this._gaps.push({
          from: prevSeg[prevSeg.length - 1].pos.clone(),
          to: nextSeg[0].pos.clone(),
        });
      }
    }

    // Catmull-Rom spline per segment — curves pass through actual GPS waypoints (realistic)
    // 4 subdivisions per span gives smooth curves without over-inflating point count
    const CR_SEGS = 4;
    for (const seg of segments) {
      if (seg.length < 2) {
        for (const p of seg) this.trailPositions.push(p);
        continue;
      }
      const n = seg.length;
      for (let i = 0; i < n - 1; i++) {
        const p0 = seg[Math.max(i - 1, 0)].pos;
        const p1 = seg[i].pos;
        const p2 = seg[i + 1].pos;
        const p3 = seg[Math.min(i + 2, n - 1)].pos;
        const s1 = seg[i].speed;
        const s2 = seg[i + 1].speed;
        for (let s = 0; s < CR_SEGS; s++) {
          const t = s / CR_SEGS;
          const t2 = t * t, t3 = t2 * t;
          const x = 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3);
          const y = 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3);
          const z = 0.5 * ((2*p1.z) + (-p0.z+p2.z)*t + (2*p0.z-5*p1.z+4*p2.z-p3.z)*t2 + (-p0.z+3*p1.z-3*p2.z+p3.z)*t3);
          const spd = s1 != null && s2 != null ? s1*(1-t)+s2*t : (s1 || s2);
          this.trailPositions.push({ pos: new THREE.Vector3(x, y, z), speed: spd });
        }
      }
      this.trailPositions.push(seg[n - 1]);
    }

    this.hasRealTrack = true;
  }

  _synthesizeBackTrail(currentPos, data) {
    if (data.velocity == null || data.trueTrack == null) {
      this.trailPositions.push({ pos: currentPos.clone(), speed: data.velocity });
      return;
    }

    const _tmpOut = new THREE.Vector3();
    for (let t = SYNTHETIC_TRAIL_SECONDS; t >= 0; t -= SYNTHETIC_TRAIL_STEP) {
      extrapolatePosition(currentPos, data.velocity, data.trueTrack, data.verticalRate || 0, -t, _tmpOut);
      this.trailPositions.push({
        pos: _tmpOut.clone(),
        speed: data.velocity,
      });
    }
    this.trailPositions.push({ pos: currentPos.clone(), speed: data.velocity });
  }

  _createInfoLabel(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    this._labelCanvas = canvas;
    this._labelCtx = canvas.getContext('2d');
    this._labelDirty = false;
    this._lastLabelUpdate = 0;
    this._drawInfoLabel(data);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
    const mat = new THREE.SpriteMaterial({
      map: texture, transparent: true, opacity: 0,
      depthWrite: false, sizeAttenuation: true,
    });
    this._labelMat = mat;
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.2, 0.55, 1);
    return sprite;
  }

  _drawInfoLabel(data) {
    const ctx = this._labelCtx;
    const w = this._labelCanvas.width;
    const h = this._labelCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const altM = bestAlt(data);
    const altFt = altM ? Math.round(altM * METERS_TO_FEET) : null;
    const speedKts = data.velocity != null ? Math.round(data.velocity * 1.94384) : null;
    const hdg = data.trueTrack != null ? Math.round(data.trueTrack) : null;
    const vsFtMin = data.verticalRate != null ? Math.round(data.verticalRate * METERS_TO_FEET * 60) : null;

    // Line 1: Callsign + Registration + Type
    ctx.font = 'bold 44px JetBrains Mono, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    let line1 = data.callsign || data.icao24;
    if (data.registration && data.registration !== line1) line1 += ` ${data.registration}`;
    if (data.aircraftType) line1 += ` ${data.aircraftType}`;
    ctx.fillText(line1, 16, 52);

    // Line 2: Route (if available) + Alt + Speed + Heading
    ctx.font = '38px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(180,210,255,0.9)';
    let line2 = '';
    const route = getRoute(data.callsign);
    const labelOrigin = data.origin || (route && route.origin) || null;
    const labelDest = data.destination || (route && route.destination) || null;
    if (labelOrigin || labelDest) {
      line2 += `${labelOrigin || '?'}\u2192${labelDest || '?'} `;
    }
    if (altFt != null) {
      line2 += altFt >= 18000 ? `FL${String(Math.round(altFt / 100)).padStart(3, '0')}` : `${altFt.toLocaleString()}ft`;
    }
    if (speedKts != null) line2 += ` ${speedKts}kt`;
    if (hdg != null) line2 += ` ${String(hdg).padStart(3, '0')}\u00b0`;
    ctx.fillText(line2, 16, 112);

    // Line 3: Vertical speed (colored by direction)
    if (vsFtMin != null && Math.abs(vsFtMin) > 100) {
      ctx.font = '38px JetBrains Mono, monospace';
      const arrow = vsFtMin > 0 ? '\u2191' : '\u2193';
      ctx.fillStyle = vsFtMin > 0 ? '#ff9d4d' : '#4db8ff';
      ctx.fillText(`${arrow}${Math.abs(vsFtMin).toLocaleString()} fpm`, 16, 168);
    }
  }

  _refreshInfoLabel() {
    this._drawInfoLabel(this.data);
    this._labelMat.map.needsUpdate = true;
    this._labelDirty = false;
  }

  _setModelOpacity(opacity) {
    if (this._useGLB && this._modelMeshes.length > 0) {
      for (const m of this._modelMeshes) m.material.opacity = opacity;
    } else if (this.bodyMat) {
      this.bodyMat.opacity = opacity;
    }
  }

  _setModelColor(color) {
    // Skip if color hasn't changed
    if (this._lastColorR === color.r && this._lastColorG === color.g && this._lastColorB === color.b) return;
    this._lastColorR = color.r;
    this._lastColorG = color.g;
    this._lastColorB = color.b;

    if (this._useGLB && this._modelMeshes.length > 0) {
      for (const m of this._modelMeshes) {
        if (!m.material.emissive) m.material.emissive = new THREE.Color();
        m.material.emissive.copy(color);
        m.material.emissiveIntensity = 0.85;
        m.material.color.copy(color);
      }
    } else if (this.bodyMat) {
      this.bodyMat.color.copy(color);
      this.bodyMat.emissive.copy(color);
    }
  }

  setTarget(pos, data) {
    // EMA altitude smoothing — reduces jitter from ADS-B altitude quantization
    if (this._smoothY == null) {
      this._smoothY = pos.y;
    } else {
      this._smoothY += 0.35 * (pos.y - this._smoothY);
    }
    pos.y = this._smoothY;

    const now = performance.now() / 1000;

    // Detect if position actually changed — Worker SWR cache often re-serves
    // identical positions. Resetting lastApiTime with unchanged position causes
    // the extrapolation anchor to jump forward, snapping the aircraft backward.
    const dx = pos.x - this.lastApiPos.x;
    const dz = pos.z - this.lastApiPos.z;
    const dy = pos.y - this.lastApiPos.y;
    const posChanged = (dx * dx + dz * dz + dy * dy) > 0.000001;

    if (posChanged) {
      // Track heading rate for curved extrapolation during turns
      if (data.trueTrack != null && this._prevHeading != null) {
        let dh = data.trueTrack - this._prevHeading;
        if (dh > 180) dh -= 360;
        if (dh < -180) dh += 360;
        const dt = now - this.lastApiTime;
        if (dt > 0.3 && dt < 15) {
          this._headingRate = dh / dt;
        }
      }
      this._prevHeading = data.trueTrack;

      this.lastApiPos.copy(pos);
      // Offset by data age so extrapolation starts from the true measurement time
      const dataAge = data.seenPos || 0;
      this.lastApiTime = now - dataAge;
    }

    // Always update flight data — velocity/heading/type can change even with same position
    this.data = data;
    this._setModelColor(getSpeedColor(data.velocity));
    this._labelDirty = true;
  }

  _getExtrapolatedTarget() {
    const now = performance.now() / 1000;
    // Cap extrapolation to 2.5s — beyond that, hold position rather than overshoot.
    // With 2s polls and ~1-2s data age, actual dt is usually 0-1s of true prediction.
    const dt = Math.min(now - this.lastApiTime, 2.5);
    return extrapolatePosition(
      this.lastApiPos, this.data.velocity, this.data.trueTrack,
      this.data.verticalRate, dt, this._extrapolatedPos, this._headingRate
    );
  }

  /**
   * Check for new/updated track data from the API.
   * Replaces backfill with real data; preserves accumulated live samples.
   */
  _checkForTrackUpdate(elapsed) {
    const interval = this.hasRealTrack ? TRACK_REFRESH_INTERVAL : TRACK_INITIAL_CHECK_INTERVAL;
    if (elapsed - this._lastTrackCheckTime < interval) return;
    this._lastTrackCheckTime = elapsed;

    const version = getTrackVersion(this.data.icao24);
    if (!version || version <= this._appliedTrackVersion) return;

    const track = getTrack(this.data.icao24);
    if (!track || track.length < 2) return;

    // Discard old live samples — real track covers recent history.
    // Live samples from before the track arrived often create seam zigzags.
    this.trailPositions = [];
    this._applyRealTrack(track);
    this._appliedTrackVersion = version;

    const newLiveStart = this.trailPositions.length;
    const liveSamples = []; // intentionally empty — fresh live sampling starts from here
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

  sampleTrailPoint(pos, speed) {
    this.trailPositions.push({ pos: pos.clone(), speed: speed });
    if (this.trailPositions.length > TRAIL_MAX_POINTS) {
      const excess = this.trailPositions.length - TRAIL_MAX_POINTS;
      this.trailPositions.splice(0, excess);
      this._liveStartIndex = Math.max(0, this._liveStartIndex - excess);
    }
    this._trailDirty = true;
  }

  rebuildTrail() {
    const raw = this.trailPositions;
    if (raw.length < 2) return;

    // Don't render trail until we have real track data or enough live samples (~2s)
    if (!this.hasRealTrack && raw.length < 8) {
      if (this.trailLine) this.trailLine.visible = false;
      return;
    }
    if (this.trailLine) this.trailLine.visible = true;

    // Subsample dense data to manageable key points
    let keyPoints;
    if (raw.length > 800) {
      keyPoints = [];
      const step = Math.max(Math.floor(raw.length / 600), 1);
      for (let i = 0; i < raw.length - 1; i += step) {
        keyPoints.push(raw[i]);
      }
      keyPoints.push(raw[raw.length - 1]);
    } else {
      keyPoints = raw;
    }

    // Moving-average smoothing — flat arrays, no Vector3 allocation
    const kn = keyPoints.length;
    let srcX = new Float64Array(kn);
    let srcY = new Float64Array(kn);
    let srcZ = new Float64Array(kn);
    let srcS = new Float64Array(kn);
    // Extract to flat arrays first
    for (let i = 0; i < kn; i++) {
      srcX[i] = keyPoints[i].pos.x; srcY[i] = keyPoints[i].pos.y;
      srcZ[i] = keyPoints[i].pos.z; srcS[i] = keyPoints[i].speed || 0;
    }
    const R = this.hasRealTrack ? 1 : 3;
    const smX = new Float64Array(kn), smY = new Float64Array(kn);
    const smZ = new Float64Array(kn), smS = new Float64Array(kn);
    for (let i = 0; i < kn; i++) {
      let sx = 0, sy = 0, sz = 0, ss = 0, cnt = 0;
      const lo = Math.max(0, i - R), hi = Math.min(kn - 1, i + R);
      for (let j = lo; j <= hi; j++) {
        sx += srcX[j]; sy += srcY[j]; sz += srcZ[j]; ss += srcS[j]; cnt++;
      }
      smX[i] = sx / cnt; smY[i] = sy / cnt; smZ[i] = sz / cnt; smS[i] = ss / cnt;
    }
    // Keep endpoints exact
    smX[0] = srcX[0]; smY[0] = srcY[0]; smZ[0] = srcZ[0]; smS[0] = srcS[0];
    smX[kn-1] = srcX[kn-1]; smY[kn-1] = srcY[kn-1]; smZ[kn-1] = srcZ[kn-1]; smS[kn-1] = srcS[kn-1];
    srcX = smX; srcY = smY; srcZ = smZ; srcS = smS;
    const chaikinPasses = this.hasRealTrack ? 1 : 3;
    for (let pass = 0; pass < chaikinPasses; pass++) {
      const n = srcX.length;
      if (n < 3 || n > 4000) break;
      const dstLen = (n - 1) * 2 + 2;
      const dstX = new Float64Array(dstLen);
      const dstY = new Float64Array(dstLen);
      const dstZ = new Float64Array(dstLen);
      const dstS = new Float64Array(dstLen);
      dstX[0] = srcX[0]; dstY[0] = srcY[0]; dstZ[0] = srcZ[0]; dstS[0] = srcS[0];
      for (let i = 0; i < n - 1; i++) {
        const s = (srcS[i] + srcS[i + 1]) / 2;
        const d = i * 2 + 1;
        dstX[d]   = srcX[i]*0.75 + srcX[i+1]*0.25; dstY[d]   = srcY[i]*0.75 + srcY[i+1]*0.25;
        dstZ[d]   = srcZ[i]*0.75 + srcZ[i+1]*0.25; dstS[d]   = s;
        dstX[d+1] = srcX[i]*0.25 + srcX[i+1]*0.75; dstY[d+1] = srcY[i]*0.25 + srcY[i+1]*0.75;
        dstZ[d+1] = srcZ[i]*0.25 + srcZ[i+1]*0.75; dstS[d+1] = s;
      }
      const last = dstLen - 1;
      dstX[last] = srcX[n-1]; dstY[last] = srcY[n-1]; dstZ[last] = srcZ[n-1]; dstS[last] = srcS[n-1];
      srcX = dstX; srcY = dstY; srcZ = dstZ; srcS = dstS;
    }
    // Build positions/colors directly from flat arrays — no intermediate objects
    const n = srcX.length;
    const smoothRadius = Math.max(Math.floor(n * 0.06), 3);
    const smoothedSpeed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let sum = 0, count = 0;
      const lo = Math.max(0, i - smoothRadius), hi = Math.min(n - 1, i + smoothRadius);
      for (let j = lo; j <= hi; j++) {
        sum += srcS[j]; count++;
      }
      smoothedSpeed[i] = count > 0 ? sum / count : 0;
    }

    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);

    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      positions[i3] = srcX[i];
      positions[i3 + 1] = srcY[i];
      positions[i3 + 2] = srcZ[i];

      const t = i / (n - 1);
      const fade = 0.05 + 0.95 * (t * t * (3 - 2 * t));
      const sc = getSpeedColor(smoothedSpeed[i]);
      colors[i3] = sc.r * fade;
      colors[i3 + 1] = sc.g * fade;
      colors[i3 + 2] = sc.b * fade;
    }

    if (this.trailLine) {
      this.scene.remove(this.trailLine);
      this.trailLine.geometry.dispose();
    }

    const geo = new LineGeometry();
    geo.setPositions(positions);
    geo.setColors(colors);

    // T2-11: Speed-based trail width — use current ground speed
    this.trailLineMat.linewidth = getSpeedLineWidth(this.data.velocity);

    this.trailLine = new Line2(geo, this.trailLineMat);
    this.trailLine.computeLineDistances();
    this.trailLine.renderOrder = 999;
    this.trailLine.frustumCulled = false;
    this.scene.add(this.trailLine);

    // Render gap lines (dashed gray) for ADS-B signal interruptions
    this._rebuildGapLines();
  }

  _rebuildGapLines() {
    if (this._gapLine) {
      this.scene.remove(this._gapLine);
      this._gapLine.geometry.dispose();
      this._gapLine.material.dispose();
      this._gapLine = null;
    }

    if (!this._gaps || this._gaps.length === 0) return;

    const verts = [];
    for (const gap of this._gaps) {
      verts.push(gap.from.x, gap.from.y, gap.from.z);
      verts.push(gap.to.x, gap.to.y, gap.to.z);
    }

    const gapGeo = new THREE.BufferGeometry();
    gapGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    const gapMat = new THREE.LineDashedMaterial({
      color: 0x667788, transparent: true, opacity: 0.3,
      dashSize: 0.15, gapSize: 0.2,
      depthTest: false, depthWrite: false,
    });
    this._gapLine = new THREE.LineSegments(gapGeo, gapMat);
    this._gapLine.computeLineDistances();
    this._gapLine.renderOrder = 998;
    this._gapLine.frustumCulled = false;
    this.scene.add(this._gapLine);
  }

  updateDropLine(pos) {
    // Reuse pre-allocated buffer — no GC pressure per frame
    const arr = this._dropPosArray;
    arr[0] = pos.x; arr[1] = pos.y; arr[2] = pos.z;
    arr[3] = pos.x; arr[4] = 0;     arr[5] = pos.z;
    this.dropGeometry.getAttribute('position').needsUpdate = true;
  }

  // T2-19: Contrail particle system for high-altitude aircraft
  _initContrail() {
    if (this._contrailGeo) return; // already initialized
    this._contrailGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(CONTRAIL_MAX_PARTICLES * 3);
    const opacities = new Float32Array(CONTRAIL_MAX_PARTICLES);
    this._contrailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._contrailGeo.setAttribute('alpha', new THREE.BufferAttribute(opacities, 1));
    this._contrailMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    this._contrailPoints = new THREE.Points(this._contrailGeo, this._contrailMat);
    this._contrailPoints.frustumCulled = false;
    this._contrailPoints.renderOrder = 997;
    this.scene.add(this._contrailPoints);
    this._contrailActive = true;
  }

  _updateContrail(delta) {
    const alt = this.data.baroAltitude;
    const aboveFL300 = alt != null && alt > CONTRAIL_ALT_THRESHOLD;

    if (!aboveFL300) {
      // Below FL300 — age out existing particles but don't spawn new ones
      if (!this._contrailActive) return;
      if (this._contrailParticles.length === 0) {
        this._disposeContrail();
        return;
      }
    } else if (!this._contrailActive) {
      this._initContrail();
    }

    if (!this._contrailGeo) return;

    // Spawn a new particle at the aircraft's current world position (behind it)
    if (aboveFL300 && this._contrailParticles.length < CONTRAIL_MAX_PARTICLES) {
      this._contrailParticles.push({
        age: 0,
        x: this.group.position.x,
        y: this.group.position.y,
        z: this.group.position.z,
      });
    }

    // Age and remove expired particles
    const posAttr = this._contrailGeo.getAttribute('position');
    const alphaAttr = this._contrailGeo.getAttribute('alpha');
    let writeIdx = 0;
    for (let i = 0; i < this._contrailParticles.length; i++) {
      const p = this._contrailParticles[i];
      p.age += delta;
      if (p.age >= CONTRAIL_LIFETIME) continue;
      this._contrailParticles[writeIdx] = p;
      const i3 = writeIdx * 3;
      posAttr.array[i3] = p.x;
      posAttr.array[i3 + 1] = p.y;
      posAttr.array[i3 + 2] = p.z;
      // Fade out over lifetime
      alphaAttr.array[writeIdx] = 1.0 - (p.age / CONTRAIL_LIFETIME);
      writeIdx++;
    }
    this._contrailParticles.length = writeIdx;

    // Zero out unused slots
    for (let i = writeIdx; i < CONTRAIL_MAX_PARTICLES; i++) {
      const i3 = i * 3;
      posAttr.array[i3] = 0; posAttr.array[i3 + 1] = 0; posAttr.array[i3 + 2] = 0;
      alphaAttr.array[i] = 0;
    }

    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
    this._contrailGeo.setDrawRange(0, writeIdx);
    this._contrailMat.opacity = this.masterOpacity * 0.6;
  }

  _updateShadow() {
    if (!this._shadow) return;
    const pos = this.group.position;
    const altY = pos.y;

    // No shadow if night, very low altitude, or faded out
    if (_sunDayFactor < 0.05 || altY < 0.02 || this.masterOpacity < 0.1) {
      this._shadow.visible = false;
      return;
    }

    this._shadow.visible = true;

    // Shadow offset: higher sun = closer; lower = further (capped)
    const tanElev = Math.tan(Math.max(_sunElevation, 0.05));
    const cappedDist = Math.min(altY / tanElev, 2.0);
    this._shadow.position.set(
      pos.x + Math.sin(_sunAzimuth) * cappedDist,
      0.005,
      pos.z + Math.cos(_sunAzimuth) * cappedDist
    );

    // Scale: bigger for higher aircraft
    const size = Math.min(0.06 + altY * 0.05, 0.4) * (this._useGLB ? 1.0 : 0.7);
    this._shadow.scale.set(size, size, 1);

    // Opacity: stronger at midday, weaker near horizon
    const elevFactor = Math.min(_sunElevation / 0.5, 1.0);
    this._shadowMat.opacity = _sunDayFactor * elevFactor * this.masterOpacity * 0.5;
  }

  _disposeContrail() {
    if (this._contrailPoints) {
      this.scene.remove(this._contrailPoints);
    }
    if (this._contrailGeo) this._contrailGeo.dispose();
    if (this._contrailMat) this._contrailMat.dispose();
    this._contrailPoints = null;
    this._contrailGeo = null;
    this._contrailMat = null;
    this._contrailParticles = [];
    this._contrailActive = false;
  }

  startFadeOut() {
    if (this.fadingOut) return;
    this.fadingOut = true;
    this.fadeProgress = 1;
  }

  animate(delta, elapsed, highlightSet, filterSet) {
    if (this.fadingIn) {
      this.fadeProgress = Math.min(this.fadeProgress + delta * 1.2, 1);
      if (this.fadeProgress >= 1) this.fadingIn = false;
    }

    if (this.fadingOut) {
      this.fadeProgress = Math.max(this.fadeProgress - delta * 0.6, 0);
      if (this.fadeProgress <= 0) { this.removed = true; return; }
    }

    // Filter opacity — smooth transition to dimmed state
    const filterTarget = (filterSet && !filterSet.has(this.data.icao24)) ? 0.06 : 1;
    if (this._filterOpacity === undefined) this._filterOpacity = 1;
    this._filterOpacity += (filterTarget - this._filterOpacity) * Math.min(delta * 4, 0.5);
    if (Math.abs(this._filterOpacity - filterTarget) < 0.005) this._filterOpacity = filterTarget;

    // Highlight dims non-highlighted to 8%
    const highlightMul = (highlightSet && !highlightSet.has(this.data.icao24)) ? 0.08 : 1;

    // Combine: fade × min(filter, highlight)
    const newOpacity = this.fadeProgress * Math.min(this._filterOpacity, highlightMul);

    // Only update opacity-dependent materials when masterOpacity actually changed
    const opacityChanged = newOpacity !== this.masterOpacity;
    this.masterOpacity = newOpacity;

    if (opacityChanged) {
      this._setModelOpacity(this.masterOpacity);
      this._labelMat.opacity = this.masterOpacity * 0.75;
      this.trailLineMat.opacity = this.masterOpacity * 0.85 * (this._trailOpacityMult || 1.0);
      this.dropMaterial.opacity = this.masterOpacity * 0.15;
      if (this._gapLine) this._gapLine.material.opacity = this.masterOpacity * 0.3;
      for (const nl of this._navLights) nl.material.opacity = this.masterOpacity * 0.8;
      if (this._bodyGlow) this._bodyGlowMat.opacity = this.masterOpacity * 0.3;
    }

    // Anti-collision strobes — Boeing: single flash, Airbus: double flash
    // Phase offset per aircraft so they don't all flash in sync
    if (this._tailStrobe) {
      const strobePhase = (elapsed * 1.2 + this.data.icao24.charCodeAt(0) * 0.1) % 1;
      let on;
      if (this._isAirbus) {
        // Airbus double flash: 50ms on, 100ms off, 50ms on, 800ms off
        on = strobePhase < 0.05 || (strobePhase > 0.15 && strobePhase < 0.20);
      } else {
        // Boeing / others: single flash: 60ms on, 940ms off
        on = strobePhase < 0.06;
      }
      const sOp = on ? this.masterOpacity : 0;
      this._tailStrobe.material.opacity = sOp;
      if (this._wingStrobes) {
        for (const s of this._wingStrobes) s.material.opacity = sOp;
      }
    }

    // Sync model + glow color to current speed
    const speedCol = getSpeedColor(this.data.velocity);
    this._setModelColor(speedCol);
    if (this._bodyGlow) this._bodyGlowMat.color.copy(speedCol);

    // Dead-reckoning — smooth lerp balances responsiveness with no snap-back.
    // With seen_pos-corrected API time, the extrapolation target is accurate
    // and corrections between polls are small (< 0.5 units).
    const predictedTarget = this._getExtrapolatedTarget();
    this.group.position.lerp(predictedTarget, Math.min(delta * 4, 0.35));

    // Heading — model nose is +X, north is -Z → offset by π/2
    if (this.data.trueTrack != null) {
      const targetRotY = -Math.PI / 2 - this.data.trueTrack * DEG_TO_RAD;
      let diff = targetRotY - this.group.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) < 0.005) {
        this.group.rotation.y = targetRotY;
      } else {
        this.group.rotation.y += diff * Math.min(delta * 3.5, 0.3);
      }
    }

    // Periodically check for updated track data
    this._checkForTrackUpdate(elapsed);

    // Sample live trail
    if (elapsed - this.lastTrailSampleTime >= TRAIL_SAMPLE_INTERVAL) {
      this.lastTrailSampleTime = elapsed;
      this.sampleTrailPoint(this.group.position, this.data.velocity);
    }

    // Rebuild trail geometry at throttled rate
    if (this._trailDirty && elapsed - this._lastTrailRebuildTime >= TRAIL_REBUILD_INTERVAL) {
      this._lastTrailRebuildTime = elapsed;
      this._trailDirty = false;
      this.rebuildTrail();
    }

    // Refresh info label periodically
    if (this._labelDirty && elapsed - this._lastLabelUpdate >= LABEL_UPDATE_INTERVAL) {
      this._lastLabelUpdate = elapsed;
      this._refreshInfoLabel();
    }

    this.updateDropLine(this.group.position);

    // T2-19: Contrail particles
    this._updateContrail(delta);

    // Shadow projection on ground
    this._updateShadow();
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
    if (this._gapLine) {
      scene.remove(this._gapLine);
      this._gapLine.geometry.dispose();
      this._gapLine.material.dispose();
    }
    if (this._useGLB && this._modelGroup) {
      this._modelGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
          if (child.geometry) child.geometry.dispose();
        }
      });
    } else if (this.bodyMat) {
      this.bodyMat.dispose();
    }
    if (this._labelMat) {
      if (this._labelMat.map) this._labelMat.map.dispose();
      this._labelMat.dispose();
    }
    for (const nl of this._navLights) {
      nl.material.dispose();
    }
    if (this._wingStrobes) {
      for (const s of this._wingStrobes) s.material.dispose();
    }
    if (this._bodyGlowMat) this._bodyGlowMat.dispose();
    // T2-19: Clean up contrail particles
    this._disposeContrail();
    // Shadow cleanup — geometry is shared, only dispose cloned material
    if (this._shadow) {
      scene.remove(this._shadow);
      this._shadowMat.dispose();
      this._shadow = null;
    }
  }

  getDisplayData() {
    const altFt = this.data.baroAltitude != null
      ? Math.round(this.data.baroAltitude * METERS_TO_FEET) : null;
    const geoAltFt = this.data.geoAltitude != null
      ? Math.round(this.data.geoAltitude * METERS_TO_FEET) : null;
    const speedKmh = this.data.velocity != null
      ? Math.round(this.data.velocity * MS_TO_KMH) : null;
    const vsFtMin = this.data.verticalRate != null
      ? Math.round(this.data.verticalRate * METERS_TO_FEET * 60) : null;
    const heading = this.data.trueTrack != null
      ? Math.round(this.data.trueTrack) : null;

    const specs = getAircraftSpecs(this.data.aircraftType);
    const trackedMin = Math.floor((Date.now() - this._createdAt) / 60000);
    const meta = getAircraftMeta(this.data.icao24);

    // Hex detail enrichment (from adsb.fi hex lookup on click)
    const hexDetail = getHexDetail(this.data.icao24);

    // Aircraft age from API year field or hexdb
    const year = this.data.year || null;
    let age = null;
    if (year) {
      age = new Date().getFullYear() - year;
    }

    // Operator: prefer API data, then hex detail, then hexdb
    const operator = this.data.operator || (hexDetail && hexDetail.operator) || (meta && meta.operator) || null;

    // Route: prefer API oa/da, then route cache (adsbdb), then local inference
    const route = getRoute(this.data.callsign);
    let origin = this.data.origin || (route && route.origin) || null;
    let destination = this.data.destination || (route && route.destination) || null;
    let originCity = (route && route.originCity) || null;
    let destCity   = (route && route.destCity)   || null;
    let routeEstimated = false;
    // Airline name from adsbdb route lookup
    const routeAirline = (route && route.airline) || null;

    // Fallback: local trajectory-based inference (no external API)
    if (!origin || !destination) {
      const inferred = getInferredRoute(this.data.icao24, this.data.callsign);
      if (inferred) {
        if (!origin && inferred.origin) {
          origin = inferred.origin;
          routeEstimated = true;
          // Try to resolve city name from local lookup
          if (!originCity && typeof window._findCityByCode === 'function') {
            const c = window._findCityByCode(origin);
            if (c) originCity = c.name;
          }
        }
        if (!destination && inferred.destination) {
          destination = inferred.destination;
          routeEstimated = true;
          if (!destCity && typeof window._findCityByCode === 'function') {
            const c = window._findCityByCode(destination);
            if (c) destCity = c.name;
          }
        }
      }
    }

    // If city names are still null, resolve synchronously from local CITIES lookup.
    // This covers API-provided routes (oa/da) where routeCache exists but city names
    // weren't available in getAirportCity's static table.
    if (origin && !originCity) originCity = window._findCityByCode?.(origin)?.name ?? null;
    if (destination && !destCity) destCity = window._findCityByCode?.(destination)?.name ?? null;

    // Ground speed in knots (from API)
    const gsKts = this.data.groundSpeed != null ? Math.round(this.data.groundSpeed) : null;

    // IAS / TAS from API — fallback to hex detail, then compute from GS + altitude
    let rawIas = this.data.ias != null ? this.data.ias : (hexDetail?.ias ?? null);
    let rawTas = this.data.tas != null ? this.data.tas : (hexDetail?.tas ?? null);
    let rawMach = this.data.mach != null ? this.data.mach : (hexDetail?.mach ?? null);

    // Compute TAS/IAS/Mach from ground speed + altitude when API data is missing
    if (rawTas == null && gsKts != null && gsKts > 50 && altFt != null && altFt > 1000) {
      // TAS ≈ GS (ignoring wind — best available approximation)
      rawTas = gsKts;
      // Mach = TAS / speed_of_sound; speed_of_sound varies with temperature
      // Below tropopause (36089 ft): T = 288.15 - 1.98·h/1000 (K)
      // Above: T = 216.65 K (constant in stratosphere)
      const tempK = altFt < 36089
        ? 288.15 - 0.00198 * altFt
        : 216.65;
      const speedOfSound = 661.5 * Math.sqrt(tempK / 288.15); // kts
      if (rawMach == null) rawMach = gsKts / speedOfSound;
      // IAS ≈ TAS × √σ where σ = density ratio
      if (rawIas == null) {
        const sigma = altFt < 36089
          ? Math.pow(1 - altFt / 145442, 4.256)
          : 0.2971 * Math.exp(-(altFt - 36089) / 20806);
        rawIas = gsKts * Math.sqrt(sigma);
      }
    }

    const ias = rawIas != null ? Math.round(rawIas) : null;
    const tas = rawTas != null ? Math.round(rawTas) : null;
    const mach = rawMach != null ? Number(rawMach).toFixed(3) : null;

    // Squawk code
    const squawk = this.data.squawk || (hexDetail?.squawk) || null;

    // Signal strength (RSSI)
    const rawRssi = this.data.rssi != null ? this.data.rssi : (hexDetail?.rssi ?? null);
    const rssi = rawRssi != null ? Number(rawRssi).toFixed(1) : null;

    // Navigation altitude (autopilot selected altitude) — hex detail is in feet directly
    const navAltRaw = this.data.navAltitude != null ? this.data.navAltitude * METERS_TO_FEET
                    : (hexDetail?.navAltitude != null ? hexDetail.navAltitude : null);
    const navAlt = navAltRaw != null ? Math.round(navAltRaw) : null;
    const navHdg = this.data.navHeading != null ? Math.round(this.data.navHeading)
                 : (hexDetail?.navHeading != null ? Math.round(hexDetail.navHeading) : null);

    // Emergency status
    const emergency = this.data.emergency || null;

    // Wake turbulence category — derive from aircraft type specs
    let wakeCat = null;
    if (specs) {
      if (specs.pax >= 400 || specs.name === 'A380-800') wakeCat = 'SUPER';
      else if (specs.pax >= 200 || (specs.range >= 5000 && specs.pax >= 100)) wakeCat = 'HEAVY';
      else if (specs.pax >= 50) wakeCat = 'MEDIUM';
      else wakeCat = 'LIGHT';
    } else if (this.data.category) {
      // ADS-B category: A1=Light, A2=Small, A3=Large, A4=HighVortex, A5=Heavy, A6=HighPerf
      const cat = this.data.category;
      if (cat === 'A5' || cat === 'A6') wakeCat = 'HEAVY';
      else if (cat === 'A3' || cat === 'A4') wakeCat = 'MEDIUM';
      else if (cat === 'A1' || cat === 'A2') wakeCat = 'LIGHT';
    }

    // Flight phase — detailed derivation
    let flightPhase = 'EN ROUTE';
    if (this.data.onGround) {
      flightPhase = 'ON GROUND';
    } else if (altFt != null && vsFtMin != null) {
      if (altFt < 500) flightPhase = vsFtMin < -200 ? 'LANDING' : 'TAKEOFF';
      else if (altFt < 3000 && vsFtMin > 300) flightPhase = 'INITIAL CLIMB';
      else if (altFt < 10000 && vsFtMin > 200) flightPhase = 'CLIMB';
      else if (altFt < 10000 && vsFtMin < -300) flightPhase = 'APPROACH';
      else if (altFt >= 10000 && vsFtMin > 200) flightPhase = 'CLIMB';
      else if (altFt >= 10000 && vsFtMin < -200) flightPhase = 'DESCENT';
      else flightPhase = 'CRUISE';
    }

    // Distance to destination and origin (if we have coords and airport codes)
    let distToDest = null;
    let originDist = null;
    if (this.data.latitude != null && this.data.longitude != null) {
      if (destination) {
        const destApt = typeof window._findCityByCode === 'function' ? window._findCityByCode(destination) : null;
        if (destApt) {
          distToDest = Math.round(haversineDistance(
            this.data.latitude, this.data.longitude, destApt.lat, destApt.lon
          ));
        }
      }
      if (origin) {
        const origApt = typeof window._findCityByCode === 'function' ? window._findCityByCode(origin) : null;
        if (origApt) {
          originDist = Math.round(haversineDistance(
            this.data.latitude, this.data.longitude, origApt.lat, origApt.lon
          ));
        }
      }
    }

    // ── P1: Wind Component Calculator ──
    // Headwind = TAS - GS (positive = headwind, negative = tailwind)
    // Crosswind = GS × sin(track - heading)
    let headwind = null, crosswind = null;
    if (tas != null && gsKts != null && heading != null && this.data.trueTrack != null) {
      headwind = Math.round(tas - gsKts);
      const drift = (this.data.trueTrack - heading) * DEG_TO_RAD;
      crosswind = Math.round(gsKts * Math.sin(drift));
    }

    // ── P2: Top of Descent Calculator ──
    // Standard 3:1 descent ratio → TOD distance (nm) = altToLose / 1000 * 3
    let todNm = null, todMin = null;
    if (flightPhase === 'CRUISE' && destination && altFt != null && altFt > 10000 && distToDest != null) {
      const destApt = typeof window._findCityByCode === 'function' ? window._findCityByCode(destination) : null;
      const fieldElev = destApt?.elevation || 0; // feet
      const altToLose = altFt - fieldElev;
      if (altToLose > 0) {
        todNm = Math.round(altToLose / 1000 * 3);
        const distToDestNm = distToDest * 0.53996; // km → nm
        const todRemaining = Math.max(0, distToDestNm - todNm);
        if (gsKts > 50) todMin = Math.round(todRemaining / gsKts * 60);
        if (todRemaining <= 0) todNm = 0; // past TOD
      }
    }

    // ── P3: Altitude Deviation Monitor (VNAV) ──
    // Compare actual altitude vs autopilot selected altitude (navAltitude)
    let altDeviation = null;
    if (altFt != null && navAlt != null) {
      altDeviation = altFt - navAlt;
    }

    // ── P4: RVSM Compliance Check ──
    // FL290-FL410: eastbound (0-179°) = odd thousands, westbound (180-359°) = even thousands
    let rvsm = null;
    if (altFt != null && altFt >= 29000 && altFt <= 41000 && heading != null) {
      const fl = Math.round(altFt / 100);
      const flThousand = Math.round(altFt / 1000);
      const isEast = heading >= 0 && heading < 180;
      const isOdd = flThousand % 2 === 1;
      // Eastbound should be odd (FL290/310/330...), westbound even (FL300/320/340...)
      const compliant = isEast ? isOdd : !isOdd;
      // Allow ±200ft tolerance for transition
      const nearLevel = Math.abs(altFt - flThousand * 1000) < 200;
      rvsm = nearLevel ? (compliant ? 'OK' : 'NON-STD') : null;
    }

    // ── P5: Flight Efficiency Score ──
    let routeEfficiency = null;
    if (origin && destination && this.data.latitude != null) {
      const origApt = typeof window._findCityByCode === 'function' ? window._findCityByCode(origin) : null;
      const destApt = typeof window._findCityByCode === 'function' ? window._findCityByCode(destination) : null;
      if (origApt && destApt) {
        const gcDist = haversineDistance(origApt.lat, origApt.lon, destApt.lat, destApt.lon);
        if (gcDist > 50) { // only meaningful for >50km routes
          const track = getTrack(this.data.icao24);
          if (track && track.length > 5) {
            let actualDist = 0;
            for (let i = 1; i < track.length; i++) {
              actualDist += haversineDistance(
                track[i-1].latitude, track[i-1].longitude,
                track[i].latitude, track[i].longitude
              );
            }
            // Add distance from last track point to current position
            const lastWp = track[track.length - 1];
            actualDist += haversineDistance(lastWp.latitude, lastWp.longitude, this.data.latitude, this.data.longitude);
            // Add distance from origin to first track point
            actualDist += haversineDistance(origApt.lat, origApt.lon, track[0].latitude, track[0].longitude);
            if (actualDist > 0) {
              routeEfficiency = Math.min(100, Math.round(gcDist / actualDist * 100));
            }
          }
        }
      }
    }

    return {
      callsign: this.data.callsign || this.data.icao24,
      icao24: this.data.icao24,
      originCountry: this.data.originCountry || '--',
      aircraftType: this.data.aircraftType || null,
      registration: this.data.registration || null,
      origin,
      destination,
      originCity,
      destCity,
      altitude: altFt != null ? `${altFt.toLocaleString()} ft` : '--',
      speed: speedKmh != null ? `${speedKmh} km/h` : '--',
      heading: heading != null ? `${String(heading).padStart(3, '0')}° ${headingToCardinal(heading)}` : '--',
      verticalSpeed: vsFtMin != null ? `${vsFtMin > 0 ? '+' : ''}${vsFtMin} ft/min` : '--',
      status: getStatusLabel(this.data.verticalRate),
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      // Enhanced data
      specs,
      trackedTime: trackedMin < 1 ? 'Just now' : trackedMin < 60 ? `${trackedMin}m` : `${Math.floor(trackedMin / 60)}h ${trackedMin % 60}m`,
      operator,
      year,
      age,
      typeDesc: this.data.typeDesc || (meta && meta.typeName) || null,
      _rawAlt: this.data.baroAltitude,
      _rawGeoAlt: this.data.geoAltitude,
      _bestAltFt: geoAltFt != null ? geoAltFt : altFt,
      _rawSpd: this.data.velocity,
      // New detailed fields
      geoAltFt,
      gsKts,
      ias,
      tas,
      mach,
      squawk,
      rssi,
      navAlt,
      navHdg,
      emergency,
      wakeCat,
      flightPhase,
      distToDest,
      _originDist: originDist,
      onGround: this.data.onGround,
      category: this.data.category,
      routeEstimated,
      routeConfidence: route?.confidence || (routeEstimated ? 'INFERRED' : null),
      routeSource: route?.source || (routeEstimated ? 'inferred' : null),
      routeAirline,
      // Professional aviation fields
      headwind,
      crosswind,
      todNm,
      todMin,
      altDeviation,
      rvsm,
      routeEfficiency,
      unusualAttitude: this.data._unusualAttitude || null,
      isHolding: detectHoldingPattern(getTrack(this.data.icao24)),
    };
  }

  /**
   * Return altitude history from track waypoints.
   * Uses barometric altitude consistently (traces only have reliable baro).
   * Each entry: { time (ms), alt (feet), vs (ft/min or null) }
   */
  getAltitudeHistory() {
    const track = getTrack(this.data.icao24);
    const entries = [];

    if (track && track.length > 0) {
      for (let i = 0; i < track.length; i++) {
        const wp = track[i];
        if (wp.baroAltitude == null) continue;
        const altFt = Math.round(wp.baroAltitude * METERS_TO_FEET);
        // Compute vertical rate and ground speed from consecutive waypoints
        let vs = null;
        let gsKts = null;
        if (i > 0) {
          const prev = track[i - 1];
          const dt = wp.time - prev.time;
          if (prev.baroAltitude != null && dt > 0) {
            vs = Math.round((wp.baroAltitude - prev.baroAltitude) * METERS_TO_FEET / dt * 60);
          }
          // Compute ground speed from distance between waypoints
          if (dt > 0 && prev.latitude != null && prev.longitude != null && wp.latitude != null && wp.longitude != null) {
            const distKm = haversineDistance(prev.latitude, prev.longitude, wp.latitude, wp.longitude);
            gsKts = Math.round(distKm / dt * 3600 * 0.539957); // km/s → kts
          }
        }
        // Compute IAS/Mach from GS + altitude (same formulas as getDisplayData)
        let ias = null, mach = null;
        if (gsKts != null && gsKts > 50 && altFt > 1000) {
          const tempK = altFt < 36089 ? 288.15 - 0.00198 * altFt : 216.65;
          const sos = 661.5 * Math.sqrt(tempK / 288.15);
          mach = parseFloat((gsKts / sos).toFixed(3));
          const sigma = altFt < 36089
            ? Math.pow(1 - altFt / 145442, 4.256)
            : 0.2971 * Math.exp(-(altFt - 36089) / 20806);
          ias = Math.round(gsKts * Math.sqrt(sigma));
        }
        entries.push({ time: wp.time * 1000, alt: altFt, vs, gsKts, ias, mach });
      }
    }

    return entries;
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

// ── T3-01: Great Circle Route Arc ──
export function createRouteArc(scene, originLat, originLon, destLat, destLon, userLat, userLon) {
  const points = [];
  const segments = 80;
  const cosLat = Math.cos(userLat * DEG_TO_RAD);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Great circle interpolation (spherical lerp simplified)
    const lat = originLat + (destLat - originLat) * t;
    const lon = originLon + (destLon - originLon) * t;
    const x = (lon - userLon) * GEO_SCALE * cosLat;
    const z = -(lat - userLat) * GEO_SCALE;
    points.push(x, 0.05, z); // slightly above ground
  }

  const geo = new LineGeometry();
  geo.setPositions(points);
  const mat = new LineMaterial({
    color: 0xc4a058,
    linewidth: 1.5,
    transparent: true,
    opacity: 0.3,
    dashSize: 0.3,
    gapSize: 0.15,
    dashed: true,
    resolution,
    depthWrite: false,
  });
  mat.defines.USE_DASH = '';
  const line = new Line2(geo, mat);
  line.computeLineDistances();
  line.name = 'routeArc';
  scene.add(line);
  return line;
}

export function removeRouteArc(scene) {
  const arc = scene.getObjectByName('routeArc');
  if (arc) {
    scene.remove(arc);
    arc.geometry.dispose();
    arc.material.dispose();
  }
}

// ── T3-10: TCAS-style traffic display ──
export function getTCASTraffic(followAc, allAircraft, maxRange = 15) {
  if (!followAc || !followAc.data.latitude) return [];
  const result = [];
  const myAlt = followAc.data.baroAltitude || 0;
  const myLat = followAc.data.latitude;
  const myLon = followAc.data.longitude;

  for (const [, ac] of allAircraft) {
    if (ac === followAc || ac.fadingOut) continue;
    if (ac.data.latitude == null) continue;
    const dist = haversineDistance(myLat, myLon, ac.data.latitude, ac.data.longitude);
    if (dist > maxRange) continue;

    const altDiff = ((ac.data.baroAltitude || 0) - myAlt) * METERS_TO_FEET;
    const relBearing = Math.atan2(
      (ac.data.longitude - myLon) * Math.cos(myLat * DEG_TO_RAD),
      ac.data.latitude - myLat
    ) * (180 / Math.PI);

    let threat = 'green';
    if (Math.abs(altDiff) < 300 && dist < 3) threat = 'red';
    else if (Math.abs(altDiff) < 1000 && dist < 8) threat = 'yellow';

    // A1: Separation status per ICAO standards
    const distNm = dist * 0.53996; // km → nm
    const myAltFt = myAlt * METERS_TO_FEET;
    // Radar separation: 3nm lateral + 1000ft vertical
    // En-route (above FL290): 5nm lateral + 1000ft vertical (RVSM)
    const reqLateral = myAltFt > 29000 ? 5 : 3;
    const reqVertical = 1000;
    let separation = 'STANDARD';
    if (distNm < reqLateral && Math.abs(altDiff) < reqVertical) separation = 'VIOLATION';
    else if (distNm < reqLateral * 1.5 && Math.abs(altDiff) < reqVertical * 1.5) separation = 'REDUCED';

    // S2: Conflict Prediction — Closest Point of Approach (CPA)
    // Linear extrapolation at 60/120/180s using velocity vectors
    let cpaDist = null, cpaTime = null, cpaAltDiff = null;
    const myVel = followAc.data.velocity;
    const myTrack = followAc.data.trueTrack;
    const acVel = ac.data.velocity;
    const acTrack = ac.data.trueTrack;
    const myVr = followAc.data.verticalRate || 0;
    const acVr = ac.data.verticalRate || 0;
    if (myVel != null && myTrack != null && acVel != null && acTrack != null) {
      // Velocity components in km/s (velocity is m/s, track is degrees)
      const myVx = myVel * Math.sin(myTrack * DEG_TO_RAD) / 1000;
      const myVz = myVel * Math.cos(myTrack * DEG_TO_RAD) / 1000;
      const acVx = acVel * Math.sin(acTrack * DEG_TO_RAD) / 1000;
      const acVz = acVel * Math.cos(acTrack * DEG_TO_RAD) / 1000;
      // Relative position (km) and velocity (km/s)
      const cosLat = Math.cos(myLat * DEG_TO_RAD);
      const dx = (ac.data.longitude - myLon) * 111.32 * cosLat;
      const dz = (ac.data.latitude - myLat) * 111.32;
      const dvx = acVx - myVx;
      const dvz = acVz - myVz;
      // CPA time: t = -(dx·dvx + dz·dvz) / (dvx² + dvz²)
      const denom = dvx * dvx + dvz * dvz;
      if (denom > 1e-10) {
        const t = -(dx * dvx + dz * dvz) / denom;
        const tClamped = Math.max(0, Math.min(t, 180)); // cap at 3min
        const cpx = dx + dvx * tClamped;
        const cpz = dz + dvz * tClamped;
        cpaDist = Math.round(Math.sqrt(cpx * cpx + cpz * cpz) * 0.53996 * 10) / 10; // km → nm
        cpaTime = Math.round(tClamped);
        cpaAltDiff = Math.round(altDiff + (acVr - myVr) * METERS_TO_FEET * 60 * tClamped / 3600);
      }
    }

    result.push({
      icao24: ac.data.icao24,
      callsign: ac.data.callsign,
      dist: Math.round(dist * 10) / 10,
      distNm: Math.round(distNm * 10) / 10,
      altDiff: Math.round(altDiff),
      bearing: relBearing,
      threat,
      separation,
      cpaDist,
      cpaTime,
      cpaAltDiff,
    });
  }

  return result.sort((a, b) => a.dist - b.dist).slice(0, 20);
}

// ── T2-02: Aircraft type classification export ──
export { classifyAircraftType, TYPE_REGIONAL, TYPE_NARROW, TYPE_WIDE_TWIN, TYPE_WIDE_QUAD, TYPE_BIZJET, TYPE_PROP };
