import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { createEnvironment, updatePulse, loadGroundMap, loadAirports, getAirportHitTargets, getAirportData, selectAirport, deselectAirport, categorizeFlights } from './scene/environment.js';
import { AircraftManager } from './scene/aircraft.js';
import { setUserLocation, getUserLocation, startPolling } from './data/opensky.js';
import { updateHUD, updateHUDTimer, updateHUDAirports, showSignalLost } from './ui/hud.js';
import { showDetail, closeDetail, refreshDetail, getSelectedAircraft } from './ui/detail.js';
import { initNeko, nekoTrackAircraft } from './ui/neko.js';

// --- Cinematic post-processing shader ---
const CinematicShader = {
  name: 'CinematicShader',
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2() },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;

      // Chromatic aberration — subtle lens effect at edges
      float d = distance(uv, vec2(0.5));
      float ca = d * d * 0.002;
      vec3 color;
      color.r = texture2D(tDiffuse, vec2(uv.x + ca, uv.y)).r;
      color.g = texture2D(tDiffuse, uv).g;
      color.b = texture2D(tDiffuse, vec2(uv.x - ca, uv.y)).b;

      // Color grading — teal shadows, warm highlights
      float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color.r += (1.0 - lum) * -0.012 + lum * 0.015;
      color.g += (1.0 - lum) * 0.018 + lum * 0.003;
      color.b += (1.0 - lum) * 0.035 + lum * -0.015;

      // Contrast — deepen blacks, gentle lift
      color = max(color - 0.004, 0.0);
      color = pow(color, vec3(0.97));

      // Saturation boost
      color = mix(vec3(lum), color, 1.15);

      // Vignette
      float vig = smoothstep(0.7, 0.2, d);
      color *= mix(0.55, 1.0, vig);

      // Film grain
      float grain = hash(uv * resolution + fract(time * 43.7) * 1000.0);
      color += (grain - 0.5) * 0.025;

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `,
};

// --- Scene setup ---
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x020a14, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020a14, 0.008);

// --- Post-processing (bloom) ---
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, null); // camera set later
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5), // half-res for performance
  0.65,  // strength
  0.4,   // radius
  0.82,  // threshold
);
composer.addPass(bloomPass);
const colorGradePass = new ShaderPass(CinematicShader);
colorGradePass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
composer.addPass(colorGradePass);
composer.addPass(new OutputPass());

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
// Start high for cinematic intro
camera.position.set(0, 35, 0.1);
camera.lookAt(0, 0, 0);
renderPass.camera = camera;

// --- Controls ---
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.09;
controls.target.set(0, 0, 0);
controls.minDistance = 0.05;
controls.maxDistance = 60;
controls.maxPolarAngle = Math.PI / 2 - (20 * Math.PI / 180); // 20° above horizontal, prevents seeing under map
controls.autoRotate = false;
controls.autoRotateSpeed = 0.3;
controls.enabled = false; // disabled during intro

// --- Cinematic intro ---
let introActive = true;
const introStart = performance.now();
const INTRO_DURATION = 3200; // ms
const introFrom = { x: 0, y: 35, z: 0.1, tx: 0, ty: 0, tz: 0 };
const introTo = { x: 8, y: 9, z: 12, tx: 0, ty: 1, tz: 0 }; // ~60° polar angle

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Unity-style SmoothDamp for a single axis — tracks velocity for natural spring feel
function smoothDamp(current, target, vel, smoothTime, dt) {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (vel + omega * change) * dt;
  const newVel = (vel - omega * temp) * exp;
  const output = target + (change + temp) * exp;
  return { value: output, vel: newVel };
}

// Vector3 SmoothDamp — mutates both current and velVec in place, no allocation
function smoothDampVec3(current, target, velVec, smoothTime, dt) {
  const rx = smoothDamp(current.x, target.x, velVec.x, smoothTime, dt);
  const ry = smoothDamp(current.y, target.y, velVec.y, smoothTime, dt);
  const rz = smoothDamp(current.z, target.z, velVec.z, smoothTime, dt);
  velVec.set(rx.vel, ry.vel, rz.vel);
  current.set(rx.value, ry.value, rz.value);
}

function updateIntro() {
  const elapsed = performance.now() - introStart;
  const t = easeOutExpo(Math.min(elapsed / INTRO_DURATION, 1));

  camera.position.set(
    introFrom.x + (introTo.x - introFrom.x) * t,
    introFrom.y + (introTo.y - introFrom.y) * t,
    introFrom.z + (introTo.z - introFrom.z) * t,
  );
  controls.target.set(
    introFrom.tx + (introTo.tx - introFrom.tx) * t,
    introFrom.ty + (introTo.ty - introFrom.ty) * t,
    introFrom.tz + (introTo.tz - introFrom.tz) * t,
  );
  controls.update();

  if (elapsed >= INTRO_DURATION) {
    introActive = false;
    controls.enabled = true;
  }
}

// --- Camera follow mode ---
// OrbitControls is NEVER disabled — no toggle = no stutter.
// Two springs run every frame:
//   1. controls.target → aircraft position (always, keeps orbit pivot on aircraft)
//   2. camera.position → zoom goal (phase 1 only, until camera arrives)
// After zoom arrives, camera translates rigidly with the orbit target.

const FOLLOW_ZOOM_DIST = 7;   // fixed zoom distance when focusing
const FOLLOW_SMOOTH_TIME = 0.28;  // spring settle time for orbit target
const FOCUS_CAM_SMOOTH_TIME = 0.45; // spring settle time for camera zoom (slightly slower = cinematic)
const speedLinesEl = document.getElementById('speed-lines');

let followTarget = null;
let followVelocity = new THREE.Vector3();    // spring vel: controls.target → aircraft
let focusCamVelocity = new THREE.Vector3();  // spring vel: camera → zoom position
let focusGoalDir = null;   // approach direction (aircraft→camera), fixed at click time
let focusZooming = false;  // true while camera is still zooming in

const followIndicator = document.getElementById('follow-indicator');
const followCallsignEl = document.getElementById('follow-callsign');

function flyToThenFollow(aircraftObj) {
  followTarget = aircraftObj;
  followVelocity.set(0, 0, 0);
  focusCamVelocity.set(0, 0, 0);
  focusZooming = true;
  // Flush any residual OrbitControls damping so it doesn't fight the spring
  controls.saveState();
  controls.reset();
  // Fixed direction: from aircraft toward camera at the moment of click
  focusGoalDir = new THREE.Vector3()
    .subVectors(camera.position, aircraftObj.group.position)
    .normalize();
  if (followIndicator) {
    const d = aircraftObj.getDisplayData();
    followCallsignEl.textContent = d.callsign || d.icao24;
    followIndicator.classList.remove('hidden');
  }
}

function stopFollow() {
  followTarget = null;
  focusZooming = false;
  if (followIndicator) followIndicator.classList.add('hidden');
}

// Pre-allocated scratch vectors — zero GC pressure in the hot path
const _fPrevTarget = new THREE.Vector3();
const _fTargetDelta = new THREE.Vector3();
const _fGoalCamPos = new THREE.Vector3();

function updateFollow(delta) {
  if (!followTarget || followTarget.removed) { stopFollow(); return; }
  const aircraftPos = followTarget.group.position;

  // Spring 1: orbit target smoothly chases aircraft
  _fPrevTarget.copy(controls.target);
  smoothDampVec3(controls.target, aircraftPos, followVelocity, FOLLOW_SMOOTH_TIME, delta);
  _fTargetDelta.subVectors(controls.target, _fPrevTarget);

  if (focusZooming) {
    // Spring 2: camera zooms toward fixed-distance goal along approach direction
    _fGoalCamPos.copy(aircraftPos).addScaledVector(focusGoalDir, FOLLOW_ZOOM_DIST);
    smoothDampVec3(camera.position, _fGoalCamPos, focusCamVelocity, FOCUS_CAM_SMOOTH_TIME, delta);
    // Switch to rigid-follow once settled — snap exactly to avoid sub-pixel drift
    if (focusCamVelocity.lengthSq() < 0.0004) {
      camera.position.copy(_fGoalCamPos);
      focusCamVelocity.set(0, 0, 0);
      focusZooming = false;
    }
  } else {
    // Rigid follow: translate camera with target delta — angle and distance stay fixed
    camera.position.add(_fTargetDelta);
  }

  controls.update();
}

// --- Compass ---
const compassNeedle = document.getElementById('compass-needle');
const compassHeading = document.getElementById('compass-heading');
let cameraHeading = 0;

const _compassDir = new THREE.Vector3();

function updateCompass() {
  camera.getWorldDirection(_compassDir);
  const dir = _compassDir;
  cameraHeading = Math.atan2(dir.x, dir.z);
  const deg = ((-cameraHeading * 180 / Math.PI) + 360) % 360;

  if (compassNeedle) {
    compassNeedle.setAttribute('transform', `rotate(${deg}, 30, 30)`);
  }
  if (compassHeading) {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    compassHeading.textContent = `${Math.round(deg)}° ${dirs[Math.round(deg / 45) % 8]}`;
  }
}

// --- Environment ---
createEnvironment(scene);

// --- Ambient particles ---
const PARTICLE_COUNT = 400;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
const particleSpeeds = new Float32Array(PARTICLE_COUNT);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 60;
  particlePositions[i * 3 + 1] = Math.random() * 5;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  particleSpeeds[i] = 0.02 + Math.random() * 0.06;
}
particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0x5aacff, size: 0.03, transparent: true, opacity: 0.15,
  depthWrite: false, sizeAttenuation: true,
});
const particles = new THREE.Points(particleGeo, particleMat);
particles.renderOrder = 2000;
scene.add(particles);

// --- Starfield ---
const STAR_COUNT = 1200;
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(STAR_COUNT * 3);
const starSizes = new Float32Array(STAR_COUNT);
for (let i = 0; i < STAR_COUNT; i++) {
  // Distribute on a sphere shell at far distance
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 80 + Math.random() * 40;
  starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 5; // only above horizon
  starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  starSizes[i] = 0.3 + Math.random() * 0.7;
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
starGeo.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
const starMat = new THREE.PointsMaterial({
  color: 0xc8d8ff, size: 0.15, transparent: true, opacity: 0.4,
  depthWrite: false, sizeAttenuation: true, fog: false,
});
const stars = new THREE.Points(starGeo, starMat);
stars.renderOrder = -1;
scene.add(stars);

// --- Aircraft Manager ---
let aircraftManager = null;

// --- Idle auto-rotate ---
let lastInteractionTime = Date.now();
const IDLE_TIMEOUT = 30000;

function resetIdleTimer() {
  lastInteractionTime = Date.now();
  controls.autoRotate = false;
  if (autoTour) stopAutoTour();
}

let pointerDownX = 0;
let pointerDownY = 0;
canvas.addEventListener('pointerdown', (e) => {
  resetIdleTimer();
  pointerDownX = e.clientX;
  pointerDownY = e.clientY;
});
const _hoverPointer = new THREE.Vector2();
let _lastHoverTime = 0;
canvas.addEventListener('pointermove', (e) => {
  if (e.buttons > 0) resetIdleTimer();
  // Throttle hover raycasting to once per frame (~16ms)
  const now = performance.now();
  if (now - _lastHoverTime < 16) return;
  _lastHoverTime = now;
  if (aircraftManager) {
    _hoverPointer.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    );
    raycaster.setFromCamera(_hoverPointer, camera);
    const hits = raycaster.intersectObjects(aircraftManager.raycasterTargets, false);
    const aptTargets = getAirportHitTargets();
    const aptHits = aptTargets.length > 0 ? raycaster.intersectObjects(aptTargets, false) : [];
    canvas.style.cursor = (hits.length > 0 || aptHits.length > 0) ? 'pointer' : '';
  }
});
canvas.addEventListener('wheel', () => {
  resetIdleTimer();
}, { passive: true });

// --- Raycasting for aircraft selection ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let selectedAirportState = null;



function handleAircraftSelect(ac) {
  const { lat, lon } = getUserLocation();
  showDetail(ac, lat, lon);
  aircraftManager.selectAircraft(ac);
  flyToThenFollow(ac);
  nekoTrackAircraft(ac.getDisplayData());
  if (selectedAirportState) {
    deselectAirport(scene);
    aircraftManager.clearHighlight();
    selectedAirportState = null;
  }
}

function raycastAircraft(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(aircraftManager.raycasterTargets, false);
  if (hits.length === 0) return null;
  // Prefer an aircraft different from the currently followed one,
  // so that clicking on a distant aircraft while following another works correctly.
  for (const hit of hits) {
    const ac = aircraftManager.getByHitMesh(hit.object);
    if (ac && ac !== followTarget) return ac;
  }
  return aircraftManager.getByHitMesh(hits[0].object);
}

canvas.addEventListener('click', (e) => {
  if (!aircraftManager) return;
  const dx = e.clientX - pointerDownX;
  const dy = e.clientY - pointerDownY;
  if (dx * dx + dy * dy > 25) return; // drag — skip selection

  const ac = raycastAircraft(e);
  if (ac) {
    handleAircraftSelect(ac);
    return;
  }

  // Check airports
  const aptTargets = getAirportHitTargets();
  if (aptTargets.length > 0) {
    const aptIntersects = raycaster.intersectObjects(aptTargets);
    if (aptIntersects.length > 0) {
      const airport = aptIntersects[0].object.userData.airport;
      if (airport) {
        closeDetail();
        handleAirportClick(airport);
        return;
      }
    }
  }

  // Click on empty space — deselect everything
  closeDetail();
  if (aircraftManager) aircraftManager.deselectAircraft();
  stopFollow();
  if (selectedAirportState) {
    deselectAirport(scene);
    aircraftManager.clearHighlight();
    selectedAirportState = null;
  }
});

// Double-click also selects (same as single click now)
canvas.addEventListener('dblclick', (e) => {
  if (!aircraftManager) return;
  e.preventDefault();
  const ac = raycastAircraft(e);
  if (ac) handleAircraftSelect(ac);
});

function handleAirportClick(airport) {
  const data = getAirportData();
  if (!data) return;

  // Toggle: click same airport again to deselect
  if (selectedAirportState && selectedAirportState.iata === airport.iata && selectedAirportState.icao === airport.icao) {
    deselectAirport(scene);
    aircraftManager.clearHighlight();
    selectedAirportState = null;
    return;
  }

  selectedAirportState = airport;
  selectAirport(scene, airport);

  // Categorize flights arriving/departing this airport
  const { arrivals, departures } = categorizeFlights(lastRawData, airport, data.runways);
  const highlightSet = new Set([
    ...arrivals.map(ac => ac.icao24),
    ...departures.map(ac => ac.icao24),
  ]);

  if (highlightSet.size > 0) {
    aircraftManager.setHighlight(highlightSet);
  } else {
    aircraftManager.clearHighlight();
  }

  const code = airport.iata || airport.icao;
  console.log(`[STRATUM] ${code}: ${arrivals.length} arrivals, ${departures.length} departures`);
}

// --- Geolocation ---
function initLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 40.7128, lon: -74.0060 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        // Denied or error — default to NYC
        resolve({ lat: 40.7128, lon: -74.0060 });
      },
      { timeout: 8000 }
    );
  });
}

// --- Data handling ---
let lastRawData = [];

function handleData(dataList) {
  console.log('[STRATUM] Received', dataList.length, 'aircraft');
  showSignalLost(false);
  lastRawData = dataList;
  if (aircraftManager) {
    aircraftManager.update(dataList);
    const { lat, lon } = getUserLocation();
    updateHUD(aircraftManager.getCount(), lat, lon);
    refreshDetail(aircraftManager, lat, lon);

  }
}

function handleError(err, consecutiveErrors) {
  console.warn('[STRATUM] Data error:', err.message, `(${consecutiveErrors} consecutive)`);
  if (consecutiveErrors >= 3) {
    showSignalLost(true);
  }
}

// --- Window resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.resolution.set(window.innerWidth * 0.5, window.innerHeight * 0.5);
  colorGradePass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});

// --- HUD timer update ---
setInterval(updateHUDTimer, 1000);

// --- WASD camera movement ---
const keysDown = new Set();
const MOVE_BASE_SPEED = 10;
const MOVE_SPRINT_MULT = 2.5;
const MOVE_ACCEL = 9;     // ramp-up per second (0→1 in ~0.11s)
const MOVE_DECEL = 6;     // ramp-down per second (slower coast-out = natural feel)
let moveVelocity = 0;     // 0–1 smooth factor
let shiftHeld = false;

// --- Auto-tour mode (T key) ---
let autoTour = false;
let autoTourTimer = null;
const AUTO_TOUR_INTERVAL = 6000; // 6s per aircraft
const tourIndicator = document.getElementById('follow-indicator');
const tourCallsignEl = document.getElementById('follow-callsign');

function startAutoTour() {
  autoTour = true;
  stopFollow();
  advanceTour();
}

function stopAutoTour() {
  autoTour = false;
  if (autoTourTimer) { clearTimeout(autoTourTimer); autoTourTimer = null; }
  if (tourIndicator) tourIndicator.classList.add('hidden');
}

function advanceTour() {
  if (!autoTour || !aircraftManager) return;
  const all = [...aircraftManager.aircraft.values()].filter(ac => !ac.fadingOut);
  if (all.length === 0) { stopAutoTour(); return; }
  const ac = all[Math.floor(Math.random() * all.length)];
  const { lat, lon } = getUserLocation();
  showDetail(ac, lat, lon);
  aircraftManager.selectAircraft(ac);
  flyToThenFollow(ac);
  autoTourTimer = setTimeout(advanceTour, AUTO_TOUR_INTERVAL);
}

// --- Help overlay ---
const helpOverlay = document.getElementById('help-overlay');
function toggleHelp() {
  if (helpOverlay) helpOverlay.classList.toggle('hidden');
}
if (helpOverlay) {
  helpOverlay.addEventListener('click', (e) => {
    if (e.target === helpOverlay) toggleHelp();
  });
}

document.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === 'INPUT') return;
  // ? key toggles help overlay
  if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
    e.preventDefault();
    toggleHelp();
    return;
  }
  // T key toggles auto-tour
  if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
    if (autoTour) { stopAutoTour(); } else { startAutoTour(); }
    return;
  }
  const k = e.key.toLowerCase();
  if ('wasdqe'.includes(k)) keysDown.add(k);
  if (e.key === 'Shift') shiftHeld = true;
});
document.addEventListener('keyup', (e) => {
  keysDown.delete(e.key.toLowerCase());
  if (e.key === 'Shift') shiftHeld = false;
});
// Clear keys on window blur to prevent stuck keys
window.addEventListener('blur', () => { keysDown.clear(); shiftHeld = false; });

const _wForward = new THREE.Vector3();
const _wRight = new THREE.Vector3();
const _wMove = new THREE.Vector3();

function getWASDInput() {
  camera.getWorldDirection(_wForward);
  _wForward.y = 0;
  _wForward.normalize();
  _wRight.crossVectors(_wForward, camera.up).normalize();
  _wMove.set(0, 0, 0);
  if (keysDown.has('w')) _wMove.add(_wForward);
  if (keysDown.has('s')) _wMove.sub(_wForward);
  if (keysDown.has('d')) _wMove.add(_wRight);
  if (keysDown.has('a')) _wMove.sub(_wRight);
  if (keysDown.has('q')) _wMove.y -= 1;
  if (keysDown.has('e')) _wMove.y += 1;
  return _wMove;
}

function updateWASD(delta) {
  const input = getWASDInput();
  const hasInput = input.lengthSq() > 0;

  // Smooth acceleration / deceleration
  if (hasInput) {
    moveVelocity = Math.min(moveVelocity + MOVE_ACCEL * delta, 1);
  } else {
    moveVelocity = Math.max(moveVelocity - MOVE_DECEL * delta, 0);
    if (moveVelocity < 0.001) { moveVelocity = 0; return; }
  }

  resetIdleTimer();

  // Speed scales with camera height for consistent feel at all altitudes
  const heightScale = Math.max(0.2, Math.min(3.0, camera.position.y / 8));
  const speed = MOVE_BASE_SPEED * heightScale * (shiftHeld ? MOVE_SPRINT_MULT : 1);
  // Ease curve for natural feel
  const factor = moveVelocity * moveVelocity * (3 - 2 * moveVelocity); // smoothstep
  if (hasInput) input.normalize();

  const move = input.multiplyScalar(speed * factor * delta);
  camera.position.add(move);
  controls.target.add(move);
}

// Follow-mode orbit: WASD rotates camera around the followed aircraft
function updateFollowWASD(delta) {
  const input = getWASDInput();
  const hasInput = input.lengthSq() > 0;

  if (hasInput) {
    moveVelocity = Math.min(moveVelocity + MOVE_ACCEL * delta, 1);
  } else {
    moveVelocity = Math.max(moveVelocity - MOVE_DECEL * delta, 0);
    if (moveVelocity < 0.001) { moveVelocity = 0; return; }
  }

  if (!followTarget) return;
  const factor = moveVelocity * moveVelocity * (3 - 2 * moveVelocity);
  const orbitSpeed = 2.0 * factor * delta * (shiftHeld ? 2.0 : 1.0);
  const targetPos = followTarget.group.position;

  // Horizontal orbit (A/D) — rotate camera around target on XZ plane
  const horz = (keysDown.has('d') ? 1 : 0) - (keysDown.has('a') ? 1 : 0);
  if (horz !== 0) {
    const offset = new THREE.Vector3().subVectors(camera.position, targetPos);
    const angle = horz * orbitSpeed;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const nx = offset.x * cos - offset.z * sin;
    const nz = offset.x * sin + offset.z * cos;
    offset.x = nx;
    offset.z = nz;
    camera.position.copy(targetPos).add(offset);
  }

  // Vertical orbit (W/S) — adjust elevation angle
  const vert = (keysDown.has('w') ? 1 : 0) - (keysDown.has('s') ? 1 : 0);
  if (vert !== 0) {
    const offset = new THREE.Vector3().subVectors(camera.position, targetPos);
    const r = offset.length();
    const currentAngle = Math.asin(offset.y / r);
    const newAngle = Math.max(-0.3, Math.min(Math.PI * 0.45, currentAngle + vert * orbitSpeed));
    const rXZ = r * Math.cos(newAngle);
    const dirXZ = new THREE.Vector2(offset.x, offset.z).normalize();
    offset.x = dirXZ.x * rXZ;
    offset.y = r * Math.sin(newAngle);
    offset.z = dirXZ.y * rXZ;
    camera.position.copy(targetPos).add(offset);
  }

  // Zoom (Q/E) — change follow distance
  const zoom = (keysDown.has('e') ? 1 : 0) - (keysDown.has('q') ? 1 : 0);
  if (zoom !== 0) {
    followDistance = Math.max(0.8, Math.min(12, followDistance + zoom * orbitSpeed * 3));
  }
}

// --- Animation loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  colorGradePass.uniforms.time.value = elapsed;

  // Cinematic intro
  if (introActive) {
    updateIntro();
  } else if (followTarget) {
    // If the user presses WASD, exit follow mode and switch to free navigation
    if (getWASDInput().lengthSq() > 0) {
      stopFollow();
      closeDetail();
      if (aircraftManager) aircraftManager.deselectAircraft();
      updateWASD(delta);
    } else {
      // Follow mode — smoothly slide orbit target to aircraft, angle unchanged
      updateFollow(delta);
      lastInteractionTime = Date.now();
    }
  } else {
    // WASD panning
    updateWASD(delta);
    // Idle auto-rotate with gentle altitude bob
    if (Date.now() - lastInteractionTime > IDLE_TIMEOUT) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
    controls.update();
  }

  // Animate scene elements
  updatePulse(scene, elapsed);

  // Compass
  updateCompass();

  // Animate particles — slow drift upward
  const posArr = particles.geometry.attributes.position.array;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    posArr[i * 3 + 1] += particleSpeeds[i] * delta;
    if (posArr[i * 3 + 1] > 5) {
      posArr[i * 3 + 1] = 0;
      posArr[i * 3] = (Math.random() - 0.5) * 60;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;
  particleMat.opacity = 0.08 + 0.06 * Math.sin(elapsed * 0.4);
  particleMat.size = 0.03;

  // Star twinkling
  starMat.opacity = 0.3 + 0.15 * Math.sin(elapsed * 0.3);

  if (aircraftManager) {
    aircraftManager.animate(delta, elapsed);
    aircraftManager.animateSelection(elapsed);
  }

  composer.render();
}

// --- Search ---
function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  let debounceTimer = null;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim().toUpperCase();
      if (q.length < 2 || !aircraftManager) {
        results.innerHTML = '';
        results.classList.remove('open');
        return;
      }

      const matches = aircraftManager.search(q, 6);
      if (matches.length === 0) {
        results.innerHTML = '<div class="search-result"><span class="search-result-info">No results</span></div>';
        results.classList.add('open');
        return;
      }

      results.innerHTML = matches.map(ac => {
        const d = ac.getDisplayData();
        const cs = d.callsign || d.icao24;
        const info = [d.aircraftType, d.registration].filter(Boolean).join(' / ');
        const route = (d.origin && d.destination) ? `${d.origin}\u2192${d.destination}` : '';
        return `<div class="search-result" data-icao="${d.icao24}">
          <span><span class="search-result-callsign">${cs}</span>${route ? `<span class="search-result-route">${route}</span>` : ''}</span>
          <span class="search-result-info">${info || d.icao24}</span>
        </div>`;
      }).join('');
      results.classList.add('open');

      results.querySelectorAll('.search-result').forEach(el => {
        el.addEventListener('click', () => {
          const icao = el.dataset.icao;
          const ac = aircraftManager.getByIcao(icao);
          if (ac) {
            const { lat, lon } = getUserLocation();
            showDetail(ac, lat, lon);
            aircraftManager.selectAircraft(ac);
            flyToThenFollow(ac);
            input.value = '';
            results.innerHTML = '';
            results.classList.remove('open');
          }
        });
      });
    }, 150);
  });

  input.addEventListener('focus', () => input.select());
  input.addEventListener('blur', () => {
    setTimeout(() => {
      results.classList.remove('open');
    }, 200);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
    if (e.key === 'Escape') {
      if (document.activeElement === input) {
        input.blur();
        input.value = '';
        results.innerHTML = '';
        results.classList.remove('open');
      }
      // Exit follow mode / auto-tour
      if (autoTour) stopAutoTour();
      if (followTarget) {
        stopFollow();
      }
    }
  });
}

// --- Init ---
async function init() {
  const location = await initLocation();
  setUserLocation(location.lat, location.lon);
  updateHUD(0, location.lat, location.lon);

  aircraftManager = new AircraftManager(scene, location.lat, location.lon);

  // Load map tiles onto ground plane (async, non-blocking)
  loadGroundMap(location.lat, location.lon);

  // Load real airport/runway data from OpenStreetMap (async)
  loadAirports(scene, location.lat, location.lon).then(() => {
    const aptData = getAirportData();
    if (aptData) updateHUDAirports(aptData.airports.length);
  });

  startPolling(handleData, handleError);
  initSearch();
  initNeko();
  animate();
}

init();
