import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { createEnvironment, updatePulse, loadGroundMap, loadAirports, clearGroundMap, clearAirports, getAirportHitTargets, getAirportData, selectAirport, deselectAirport, categorizeFlights } from './scene/environment.js';
import { AircraftManager } from './scene/aircraft.js';
import { setUserLocation, getUserLocation, startPolling, priorityTraceFetch } from './data/opensky.js';
import { updateHUD, updateHUDTimer, updateHUDAirports, updateHUDCity, showSignalLost } from './ui/hud.js';
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
renderer.setClearColor(0x09090c, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x09090c, 0.008);

// --- Post-processing ---
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, null);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5),
  0.65, 0.4, 0.82,
);
composer.addPass(bloomPass);
const colorGradePass = new ShaderPass(CinematicShader);
colorGradePass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
composer.addPass(colorGradePass);
composer.addPass(new OutputPass());

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
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
controls.maxPolarAngle = Math.PI / 2 - (20 * Math.PI / 180);
controls.autoRotate = false;
controls.autoRotateSpeed = 0.3;
controls.enabled = false;

// --- Cinematic intro ---
let introActive = true;
const introStart = performance.now();
const INTRO_DURATION = 3200;
const introFrom = { x: 0, y: 35, z: 0.1, tx: 0, ty: 0, tz: 0 };
const introTo = { x: 8, y: 9, z: 12, tx: 0, ty: 1, tz: 0 };

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

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
const FOLLOW_ZOOM_DIST = 7;
const FOLLOW_SMOOTH_TIME = 0.28;
const FOCUS_CAM_SMOOTH_TIME = 0.45;
const speedLinesEl = document.getElementById('speed-lines');

let followTarget = null;
let followVelocity = new THREE.Vector3();
let focusCamVelocity = new THREE.Vector3();
let focusGoalDir = null;
let focusZooming = false;

const followIndicator = document.getElementById('follow-indicator');
const followCallsignEl = document.getElementById('follow-callsign');

function flyToThenFollow(aircraftObj) {
  followTarget = aircraftObj;
  followVelocity.set(0, 0, 0);
  focusCamVelocity.set(0, 0, 0);
  focusZooming = true;
  controls.saveState();
  controls.reset();
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

const _fPrevTarget = new THREE.Vector3();
const _fTargetDelta = new THREE.Vector3();
const _fGoalCamPos = new THREE.Vector3();

function updateFollow(delta) {
  if (!followTarget || followTarget.removed) { stopFollow(); return; }
  const aircraftPos = followTarget.group.position;

  _fPrevTarget.copy(controls.target);
  smoothDampVec3(controls.target, aircraftPos, followVelocity, FOLLOW_SMOOTH_TIME, delta);
  _fTargetDelta.subVectors(controls.target, _fPrevTarget);

  if (focusZooming) {
    _fGoalCamPos.copy(aircraftPos).addScaledVector(focusGoalDir, FOLLOW_ZOOM_DIST);
    smoothDampVec3(camera.position, _fGoalCamPos, focusCamVelocity, FOCUS_CAM_SMOOTH_TIME, delta);
    if (focusCamVelocity.lengthSq() < 0.0004) {
      camera.position.copy(_fGoalCamPos);
      focusCamVelocity.set(0, 0, 0);
      focusZooming = false;
    }
  } else {
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
  cameraHeading = Math.atan2(_compassDir.x, _compassDir.z);
  const deg = ((-cameraHeading * 180 / Math.PI) + 360) % 360;
  if (compassNeedle) compassNeedle.setAttribute('transform', `rotate(${deg}, 30, 30)`);
  if (compassHeading) {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    compassHeading.textContent = `${Math.round(deg)}°`;
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
  color: 0xc4a058, size: 0.03, transparent: true, opacity: 0.1,
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
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 80 + Math.random() * 40;
  starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 5;
  starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  starSizes[i] = 0.3 + Math.random() * 0.7;
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
starGeo.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
const starMat = new THREE.PointsMaterial({
  color: 0xd0d8f0, size: 0.15, transparent: true, opacity: 0.4,
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

// --- Aircraft hover tooltip ---
const tooltipEl = document.getElementById('aircraft-tooltip');

function showAircraftTooltip(data, x, y) {
  if (!tooltipEl) return;
  const callsign = data.callsign || data.icao24 || '';
  const type = data.aircraftType || '';
  const alt = (data.altitude && data.altitude !== '--') ? data.altitude : '';

  let html = `<span class="ttp-cs">${callsign}</span>`;
  if (type) html += `<span class="ttp-sep">·</span><span class="ttp-type">${type}</span>`;
  if (alt) html += `<span class="ttp-sep">·</span><span class="ttp-alt">${alt}</span>`;
  tooltipEl.innerHTML = html;

  const margin = 14;
  let tx = x + margin;
  let ty = y - 40;
  if (tx + 200 > window.innerWidth) tx = x - margin - 200;
  if (ty < 8) ty = y + margin + 4;

  tooltipEl.style.transform = `translate(${tx}px, ${ty}px)`;
  tooltipEl.classList.remove('hidden');
}

function hideAircraftTooltip() {
  if (tooltipEl) tooltipEl.classList.add('hidden');
}

// --- Raycasting for hover + selection ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const _hoverPointer = new THREE.Vector2();
let _lastHoverTime = 0;

canvas.addEventListener('pointermove', (e) => {
  if (e.buttons > 0) resetIdleTimer();
  const now = performance.now();
  if (now - _lastHoverTime < 16) return;
  _lastHoverTime = now;

  if (!aircraftManager) { hideAircraftTooltip(); return; }

  _hoverPointer.set(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1,
  );
  raycaster.setFromCamera(_hoverPointer, camera);
  const hits = raycaster.intersectObjects(aircraftManager.raycasterTargets, false);
  const aptTargets = getAirportHitTargets();
  const aptHits = aptTargets.length > 0 ? raycaster.intersectObjects(aptTargets, false) : [];

  if (hits.length > 0) {
    canvas.style.cursor = 'pointer';
    const ac = aircraftManager.getByHitMesh(hits[0].object);
    if (ac) {
      showAircraftTooltip(ac.getDisplayData(), e.clientX, e.clientY);
    } else {
      hideAircraftTooltip();
    }
  } else if (aptHits.length > 0) {
    canvas.style.cursor = 'pointer';
    hideAircraftTooltip();
  } else {
    canvas.style.cursor = '';
    hideAircraftTooltip();
  }
});

canvas.addEventListener('wheel', () => {
  resetIdleTimer();
}, { passive: true });

let selectedAirportState = null;

function handleAircraftSelect(ac) {
  const { lat, lon } = getUserLocation();
  showDetail(ac, lat, lon);
  aircraftManager.selectAircraft(ac);
  flyToThenFollow(ac);
  nekoTrackAircraft(ac.getDisplayData());
  priorityTraceFetch(ac.data.icao24);
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
  if (dx * dx + dy * dy > 25) return;

  const ac = raycastAircraft(e);
  if (ac) { handleAircraftSelect(ac); return; }

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

  closeDetail();
  if (aircraftManager) aircraftManager.deselectAircraft();
  stopFollow();
  if (selectedAirportState) {
    deselectAirport(scene);
    aircraftManager.clearHighlight();
    selectedAirportState = null;
  }
});

canvas.addEventListener('dblclick', (e) => {
  if (!aircraftManager) return;
  e.preventDefault();
  const ac = raycastAircraft(e);
  if (ac) handleAircraftSelect(ac);
});

function handleAirportClick(airport) {
  const data = getAirportData();
  if (!data) return;

  if (selectedAirportState &&
      selectedAirportState.iata === airport.iata &&
      selectedAirportState.icao === airport.icao) {
    deselectAirport(scene);
    aircraftManager.clearHighlight();
    selectedAirportState = null;
    return;
  }

  selectedAirportState = airport;
  selectAirport(scene, airport);

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
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve({ lat: 40.7128, lon: -74.0060 }),
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
  if (consecutiveErrors >= 3) showSignalLost(true);
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
const MOVE_ACCEL = 9;
const MOVE_DECEL = 6;
let moveVelocity = 0;
let shiftHeld = false;

// --- Auto-tour mode ---
let autoTour = false;
let autoTourTimer = null;
const AUTO_TOUR_INTERVAL = 6000;

function startAutoTour() {
  autoTour = true;
  stopFollow();
  advanceTour();
}

function stopAutoTour() {
  autoTour = false;
  if (autoTourTimer) { clearTimeout(autoTourTimer); autoTourTimer = null; }
  if (followIndicator) followIndicator.classList.add('hidden');
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
  if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
    e.preventDefault();
    toggleHelp();
    return;
  }
  if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
    if (autoTour) { stopAutoTour(); } else { startAutoTour(); }
    return;
  }
  if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    openCityPicker();
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

  if (hasInput) {
    moveVelocity = Math.min(moveVelocity + MOVE_ACCEL * delta, 1);
  } else {
    moveVelocity = Math.max(moveVelocity - MOVE_DECEL * delta, 0);
    if (moveVelocity < 0.001) { moveVelocity = 0; return; }
  }

  resetIdleTimer();

  const heightScale = Math.max(0.2, Math.min(3.0, camera.position.y / 8));
  const speed = MOVE_BASE_SPEED * heightScale * (shiftHeld ? MOVE_SPRINT_MULT : 1);
  const factor = moveVelocity * moveVelocity * (3 - 2 * moveVelocity);
  if (hasInput) input.normalize();

  const move = input.multiplyScalar(speed * factor * delta);
  camera.position.add(move);
  controls.target.add(move);
}

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

  const horz = (keysDown.has('d') ? 1 : 0) - (keysDown.has('a') ? 1 : 0);
  if (horz !== 0) {
    const offset = new THREE.Vector3().subVectors(camera.position, targetPos);
    const angle = horz * orbitSpeed;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const nx = offset.x * cos - offset.z * sin;
    const nz = offset.x * sin + offset.z * cos;
    offset.x = nx; offset.z = nz;
    camera.position.copy(targetPos).add(offset);
  }

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
}

// --- Animation loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  colorGradePass.uniforms.time.value = elapsed;

  if (introActive) {
    updateIntro();
  } else if (followTarget) {
    if (getWASDInput().lengthSq() > 0) {
      stopFollow();
      closeDetail();
      if (aircraftManager) aircraftManager.deselectAircraft();
      updateWASD(delta);
    } else {
      updateFollow(delta);
      lastInteractionTime = Date.now();
    }
  } else {
    updateWASD(delta);
    if (Date.now() - lastInteractionTime > IDLE_TIMEOUT) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
    controls.update();
  }

  updatePulse(scene, elapsed);
  updateCompass();

  // Animate particles
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
  particleMat.opacity = 0.06 + 0.04 * Math.sin(elapsed * 0.4);

  starMat.opacity = 0.3 + 0.14 * Math.sin(elapsed * 0.3);

  if (aircraftManager) {
    aircraftManager.animate(delta, elapsed);
    aircraftManager.animateSelection(elapsed);
  }

  composer.render();
}

// --- City picker ---
// 400 airports total: 98 Americas · 118 Europe · 23 Middle East · 43 Africa · 98 Asia · 20 Pacific
const CITIES = [
  // ── Americas (23 original) ─────────────────────────────────────────────────
  { name: 'New York',        code: 'JFK', lat:  40.6413,  lon:  -73.7781, region: 'Americas' },
  { name: 'Los Angeles',     code: 'LAX', lat:  33.9425,  lon: -118.4081, region: 'Americas' },
  { name: 'Chicago',         code: 'ORD', lat:  41.9742,  lon:  -87.9073, region: 'Americas' },
  { name: 'Miami',           code: 'MIA', lat:  25.7959,  lon:  -80.2870, region: 'Americas' },
  { name: 'Dallas',          code: 'DFW', lat:  32.8998,  lon:  -97.0403, region: 'Americas' },
  { name: 'Atlanta',         code: 'ATL', lat:  33.6407,  lon:  -84.4277, region: 'Americas' },
  { name: 'San Francisco',   code: 'SFO', lat:  37.6213,  lon: -122.3790, region: 'Americas' },
  { name: 'Seattle',         code: 'SEA', lat:  47.4502,  lon: -122.3088, region: 'Americas' },
  { name: 'Denver',          code: 'DEN', lat:  39.8561,  lon: -104.6737, region: 'Americas' },
  { name: 'Boston',          code: 'BOS', lat:  42.3656,  lon:  -71.0096, region: 'Americas' },
  { name: 'Houston',         code: 'IAH', lat:  29.9902,  lon:  -95.3368, region: 'Americas' },
  { name: 'Toronto',         code: 'YYZ', lat:  43.6777,  lon:  -79.6248, region: 'Americas' },
  { name: 'Vancouver',       code: 'YVR', lat:  49.1947,  lon: -123.1792, region: 'Americas' },
  { name: 'Montreal',        code: 'YUL', lat:  45.4706,  lon:  -73.7408, region: 'Americas' },
  { name: 'Calgary',         code: 'YYC', lat:  51.1314,  lon: -114.0125, region: 'Americas' },
  { name: 'Mexico City',     code: 'MEX', lat:  19.4363,  lon:  -99.0721, region: 'Americas' },
  { name: 'Cancun',          code: 'CUN', lat:  21.0365,  lon:  -86.8771, region: 'Americas' },
  { name: 'São Paulo',       code: 'GRU', lat: -23.4356,  lon:  -46.4731, region: 'Americas' },
  { name: 'Rio de Janeiro',  code: 'GIG', lat: -22.8099,  lon:  -43.2505, region: 'Americas' },
  { name: 'Buenos Aires',    code: 'EZE', lat: -34.8222,  lon:  -58.5358, region: 'Americas' },
  { name: 'Bogotá',          code: 'BOG', lat:   4.7016,  lon:  -74.1469, region: 'Americas' },
  { name: 'Lima',            code: 'LIM', lat: -12.0219,  lon:  -77.1143, region: 'Americas' },
  { name: 'Santiago',        code: 'SCL', lat: -33.3930,  lon:  -70.7858, region: 'Americas' },

  // ── Europe (34 original) ───────────────────────────────────────────────────
  { name: 'London',          code: 'LHR', lat:  51.4775,  lon:   -0.4614, region: 'Europe' },
  { name: 'Paris',           code: 'CDG', lat:  49.0097,  lon:    2.5479, region: 'Europe' },
  { name: 'Frankfurt',       code: 'FRA', lat:  50.0379,  lon:    8.5622, region: 'Europe' },
  { name: 'Amsterdam',       code: 'AMS', lat:  52.3105,  lon:    4.7683, region: 'Europe' },
  { name: 'Istanbul',        code: 'IST', lat:  41.2608,  lon:   28.7418, region: 'Europe' },
  { name: 'Madrid',          code: 'MAD', lat:  40.4983,  lon:   -3.5676, region: 'Europe' },
  { name: 'Barcelona',       code: 'BCN', lat:  41.2971,  lon:    2.0785, region: 'Europe' },
  { name: 'Rome',            code: 'FCO', lat:  41.8003,  lon:   12.2389, region: 'Europe' },
  { name: 'Milan',           code: 'MXP', lat:  45.6306,  lon:    8.7281, region: 'Europe' },
  { name: 'Munich',          code: 'MUC', lat:  48.3537,  lon:   11.7750, region: 'Europe' },
  { name: 'Zurich',          code: 'ZRH', lat:  47.4647,  lon:    8.5492, region: 'Europe' },
  { name: 'Vienna',          code: 'VIE', lat:  48.1103,  lon:   16.5697, region: 'Europe' },
  { name: 'Brussels',        code: 'BRU', lat:  50.9014,  lon:    4.4844, region: 'Europe' },
  { name: 'Copenhagen',      code: 'CPH', lat:  55.6179,  lon:   12.6560, region: 'Europe' },
  { name: 'Stockholm',       code: 'ARN', lat:  59.6519,  lon:   17.9186, region: 'Europe' },
  { name: 'Oslo',            code: 'OSL', lat:  60.1939,  lon:   11.1004, region: 'Europe' },
  { name: 'Helsinki',        code: 'HEL', lat:  60.3172,  lon:   24.9633, region: 'Europe' },
  { name: 'Dublin',          code: 'DUB', lat:  53.4213,  lon:   -6.2701, region: 'Europe' },
  { name: 'Lisbon',          code: 'LIS', lat:  38.7742,  lon:   -9.1342, region: 'Europe' },
  { name: 'Athens',          code: 'ATH', lat:  37.9364,  lon:   23.9445, region: 'Europe' },
  { name: 'Warsaw',          code: 'WAW', lat:  52.1657,  lon:   20.9671, region: 'Europe' },
  { name: 'Prague',          code: 'PRG', lat:  50.1008,  lon:   14.2600, region: 'Europe' },
  { name: 'Budapest',        code: 'BUD', lat:  47.4369,  lon:   19.2556, region: 'Europe' },
  { name: 'Bucharest',       code: 'OTP', lat:  44.5722,  lon:   26.1022, region: 'Europe' },
  { name: 'Düsseldorf',      code: 'DUS', lat:  51.2895,  lon:    6.7668, region: 'Europe' },
  { name: 'Hamburg',         code: 'HAM', lat:  53.6304,  lon:    9.9882, region: 'Europe' },
  { name: 'Manchester',      code: 'MAN', lat:  53.3650,  lon:   -2.2729, region: 'Europe' },
  { name: 'Edinburgh',       code: 'EDI', lat:  55.9500,  lon:   -3.3725, region: 'Europe' },
  { name: 'Geneva',          code: 'GVA', lat:  46.2380,  lon:    6.1089, region: 'Europe' },
  { name: 'Nice',            code: 'NCE', lat:  43.6584,  lon:    7.2159, region: 'Europe' },
  { name: 'Reykjavik',       code: 'KEF', lat:  63.9850,  lon:  -22.6056, region: 'Europe' },
  { name: 'Belgrade',        code: 'BEG', lat:  44.8184,  lon:   20.3091, region: 'Europe' },
  { name: 'Sofia',           code: 'SOF', lat:  42.6967,  lon:   23.4114, region: 'Europe' },
  { name: 'Riga',            code: 'RIX', lat:  56.9236,  lon:   23.9711, region: 'Europe' },

  // ── Middle East (8 original) ───────────────────────────────────────────────
  { name: 'Dubai',           code: 'DXB', lat:  25.2532,  lon:   55.3657, region: 'Middle East' },
  { name: 'Abu Dhabi',       code: 'AUH', lat:  24.4330,  lon:   54.6511, region: 'Middle East' },
  { name: 'Doha',            code: 'DOH', lat:  25.2731,  lon:   51.6080, region: 'Middle East' },
  { name: 'Riyadh',          code: 'RUH', lat:  24.9576,  lon:   46.6988, region: 'Middle East' },
  { name: 'Kuwait City',     code: 'KWI', lat:  29.2267,  lon:   47.9689, region: 'Middle East' },
  { name: 'Muscat',          code: 'MCT', lat:  23.5933,  lon:   58.2844, region: 'Middle East' },
  { name: 'Tel Aviv',        code: 'TLV', lat:  32.0114,  lon:   34.8867, region: 'Middle East' },
  { name: 'Amman',           code: 'AMM', lat:  31.7226,  lon:   35.9932, region: 'Middle East' },

  // ── Africa (8 original) ────────────────────────────────────────────────────
  { name: 'Johannesburg',    code: 'JNB', lat: -26.1367,  lon:   28.2411, region: 'Africa' },
  { name: 'Cape Town',       code: 'CPT', lat: -33.9648,  lon:   18.6017, region: 'Africa' },
  { name: 'Cairo',           code: 'CAI', lat:  30.1219,  lon:   31.4056, region: 'Africa' },
  { name: 'Casablanca',      code: 'CMN', lat:  33.3675,  lon:   -7.5897, region: 'Africa' },
  { name: 'Nairobi',         code: 'NBO', lat:  -1.3192,  lon:   36.9275, region: 'Africa' },
  { name: 'Addis Ababa',     code: 'ADD', lat:   8.9779,  lon:   38.7993, region: 'Africa' },
  { name: 'Lagos',           code: 'LOS', lat:   6.5774,  lon:    3.3214, region: 'Africa' },
  { name: 'Tunis',           code: 'TUN', lat:  36.8510,  lon:   10.2272, region: 'Africa' },

  // ── Asia (22 original) ─────────────────────────────────────────────────────
  { name: 'Singapore',       code: 'SIN', lat:   1.3644,  lon:  103.9915, region: 'Asia' },
  { name: 'Hong Kong',       code: 'HKG', lat:  22.3080,  lon:  113.9185, region: 'Asia' },
  { name: 'Tokyo',           code: 'HND', lat:  35.5493,  lon:  139.7798, region: 'Asia' },
  { name: 'Seoul',           code: 'ICN', lat:  37.4602,  lon:  126.4407, region: 'Asia' },
  { name: 'Bangkok',         code: 'BKK', lat:  13.6811,  lon:  100.7472, region: 'Asia' },
  { name: 'Taipei',          code: 'TPE', lat:  25.0777,  lon:  121.2328, region: 'Asia' },
  { name: 'Kuala Lumpur',    code: 'KUL', lat:   2.7456,  lon:  101.7099, region: 'Asia' },
  { name: 'Manila',          code: 'MNL', lat:  14.5086,  lon:  121.0197, region: 'Asia' },
  { name: 'Jakarta',         code: 'CGK', lat:  -6.1275,  lon:  106.6558, region: 'Asia' },
  { name: 'Osaka',           code: 'KIX', lat:  34.4347,  lon:  135.2440, region: 'Asia' },
  { name: 'Fukuoka',         code: 'FUK', lat:  33.5858,  lon:  130.4511, region: 'Asia' },
  { name: 'Mumbai',          code: 'BOM', lat:  19.0896,  lon:   72.8656, region: 'Asia' },
  { name: 'Delhi',           code: 'DEL', lat:  28.5562,  lon:   77.1000, region: 'Asia' },
  { name: 'Bangalore',       code: 'BLR', lat:  13.1986,  lon:   77.7066, region: 'Asia' },
  { name: 'Kolkata',         code: 'CCU', lat:  22.6547,  lon:   88.4467, region: 'Asia' },
  { name: 'Chennai',         code: 'MAA', lat:  12.9900,  lon:   80.1693, region: 'Asia' },
  { name: 'Colombo',         code: 'CMB', lat:   7.1808,  lon:   79.8841, region: 'Asia' },
  { name: 'Karachi',         code: 'KHI', lat:  24.9065,  lon:   67.1608, region: 'Asia' },
  { name: 'Islamabad',       code: 'ISB', lat:  33.6169,  lon:   73.0993, region: 'Asia' },
  { name: 'Ho Chi Minh',     code: 'SGN', lat:  10.8188,  lon:  106.6520, region: 'Asia' },
  { name: 'Hanoi',           code: 'HAN', lat:  21.2212,  lon:  105.8072, region: 'Asia' },
  { name: 'Dhaka',           code: 'DAC', lat:  23.8433,  lon:   90.3978, region: 'Asia' },

  // ── Pacific (5 original) ───────────────────────────────────────────────────
  { name: 'Sydney',          code: 'SYD', lat: -33.9399,  lon:  151.1753, region: 'Pacific' },
  { name: 'Melbourne',       code: 'MEL', lat: -37.6733,  lon:  144.8430, region: 'Pacific' },
  { name: 'Brisbane',        code: 'BNE', lat: -27.3842,  lon:  153.1175, region: 'Pacific' },
  { name: 'Perth',           code: 'PER', lat: -31.9403,  lon:  115.9669, region: 'Pacific' },
  { name: 'Auckland',        code: 'AKL', lat: -37.0082,  lon:  174.7850, region: 'Pacific' },

  // ══ NEW ADDITIONS ══════════════════════════════════════════════════════════

  // ── Americas new (75) ──────────────────────────────────────────────────────
  // US domestic secondaries
  { name: 'Phoenix',         code: 'PHX', lat:  33.4373,  lon: -112.0078, region: 'Americas' },
  { name: 'Las Vegas',       code: 'LAS', lat:  36.0840,  lon: -115.1537, region: 'Americas' },
  { name: 'Minneapolis',     code: 'MSP', lat:  44.8848,  lon:  -93.2223, region: 'Americas' },
  { name: 'Detroit',         code: 'DTW', lat:  42.2124,  lon:  -83.3534, region: 'Americas' },
  { name: 'Philadelphia',    code: 'PHL', lat:  39.8719,  lon:  -75.2411, region: 'Americas' },
  { name: 'Washington DC',   code: 'IAD', lat:  38.9531,  lon:  -77.4565, region: 'Americas' },
  { name: 'Washington DCA',  code: 'DCA', lat:  38.8521,  lon:  -77.0377, region: 'Americas' },
  { name: 'Charlotte',       code: 'CLT', lat:  35.2140,  lon:  -80.9431, region: 'Americas' },
  { name: 'Orlando',         code: 'MCO', lat:  28.4294,  lon:  -81.3089, region: 'Americas' },
  { name: 'Tampa',           code: 'TPA', lat:  27.9755,  lon:  -82.5332, region: 'Americas' },
  { name: 'Portland',        code: 'PDX', lat:  45.5898,  lon: -122.5951, region: 'Americas' },
  { name: 'San Diego',       code: 'SAN', lat:  32.7338,  lon: -117.1933, region: 'Americas' },
  { name: 'Salt Lake City',  code: 'SLC', lat:  40.7884,  lon: -111.9778, region: 'Americas' },
  { name: 'Austin',          code: 'AUS', lat:  30.1975,  lon:  -97.6664, region: 'Americas' },
  { name: 'Kansas City',     code: 'MCI', lat:  39.2976,  lon:  -94.7139, region: 'Americas' },
  { name: 'St. Louis',       code: 'STL', lat:  38.7487,  lon:  -90.3700, region: 'Americas' },
  { name: 'Nashville',       code: 'BNA', lat:  36.1245,  lon:  -86.6782, region: 'Americas' },
  { name: 'Raleigh',         code: 'RDU', lat:  35.8776,  lon:  -78.7875, region: 'Americas' },
  { name: 'Pittsburgh',      code: 'PIT', lat:  40.4915,  lon:  -80.2329, region: 'Americas' },
  { name: 'New Orleans',     code: 'MSY', lat:  29.9934,  lon:  -90.2580, region: 'Americas' },
  { name: 'Honolulu',        code: 'HNL', lat:  21.3187,  lon: -157.9224, region: 'Americas' },
  { name: 'Anchorage',       code: 'ANC', lat:  61.1743,  lon: -149.9963, region: 'Americas' },
  // Canada
  { name: 'Edmonton',        code: 'YEG', lat:  53.3097,  lon: -113.5797, region: 'Americas' },
  { name: 'Ottawa',          code: 'YOW', lat:  45.3225,  lon:  -75.6692, region: 'Americas' },
  { name: 'Halifax',         code: 'YHZ', lat:  44.8808,  lon:  -63.5086, region: 'Americas' },
  { name: 'Winnipeg',        code: 'YWG', lat:  49.9100,  lon:  -97.2398, region: 'Americas' },
  // Mexico
  { name: 'Guadalajara',     code: 'GDL', lat:  20.5218,  lon: -103.3107, region: 'Americas' },
  { name: 'Monterrey',       code: 'MTY', lat:  25.7785,  lon: -100.1069, region: 'Americas' },
  { name: 'Tijuana',         code: 'TIJ', lat:  32.5411,  lon: -116.9700, region: 'Americas' },
  // Central America & Caribbean
  { name: 'Guatemala City',  code: 'GUA', lat:  14.5833,  lon:  -90.5275, region: 'Americas' },
  { name: 'San José',        code: 'SJO', lat:   9.9939,  lon:  -84.2088, region: 'Americas' },
  { name: 'Panama City',     code: 'PTY', lat:   9.0714,  lon:  -79.3835, region: 'Americas' },
  { name: 'San Juan',        code: 'SJU', lat:  18.4394,  lon:  -66.0018, region: 'Americas' },
  { name: 'Santo Domingo',   code: 'SDQ', lat:  18.4297,  lon:  -69.6689, region: 'Americas' },
  { name: 'Havana',          code: 'HAV', lat:  22.9892,  lon:  -82.4091, region: 'Americas' },
  { name: 'Kingston',        code: 'KIN', lat:  17.9357,  lon:  -76.7875, region: 'Americas' },
  { name: 'Montego Bay',     code: 'MBJ', lat:  18.5037,  lon:  -77.9134, region: 'Americas' },
  { name: 'Nassau',          code: 'NAS', lat:  25.0390,  lon:  -77.4662, region: 'Americas' },
  { name: 'Bridgetown',      code: 'BGI', lat:  13.0746,  lon:  -59.4925, region: 'Americas' },
  { name: 'Port of Spain',   code: 'POS', lat:  10.5954,  lon:  -61.3372, region: 'Americas' },
  { name: 'Willemstad',      code: 'CUR', lat:  12.1889,  lon:  -68.9598, region: 'Americas' },
  { name: 'Oranjestad',      code: 'AUA', lat:  12.5014,  lon:  -70.0152, region: 'Americas' },
  { name: 'Sint Maarten',    code: 'SXM', lat:  18.0410,  lon:  -63.1089, region: 'Americas' },
  { name: 'Belize City',     code: 'BZE', lat:  17.5391,  lon:  -88.3082, region: 'Americas' },
  { name: 'Managua',         code: 'MGA', lat:  12.1415,  lon:  -86.1682, region: 'Americas' },
  { name: 'San Salvador',    code: 'SAL', lat:  13.4409,  lon:  -89.0558, region: 'Americas' },
  { name: 'Tegucigalpa',     code: 'TGU', lat:  14.0608,  lon:  -87.2172, region: 'Americas' },
  { name: 'Martinique',      code: 'FDF', lat:  14.5910,  lon:  -61.0032, region: 'Americas' },
  { name: 'Guadeloupe',      code: 'PTP', lat:  16.2653,  lon:  -61.5318, region: 'Americas' },
  // South America
  { name: 'Quito',           code: 'UIO', lat:  -0.1292,  lon:  -78.3575, region: 'Americas' },
  { name: 'Guayaquil',       code: 'GYE', lat:  -2.1574,  lon:  -79.8836, region: 'Americas' },
  { name: 'Montevideo',      code: 'MVD', lat: -34.8384,  lon:  -56.0308, region: 'Americas' },
  { name: 'Asunción',        code: 'ASU', lat: -25.2399,  lon:  -57.5198, region: 'Americas' },
  { name: 'Brasília',        code: 'BSB', lat: -15.8711,  lon:  -47.9186, region: 'Americas' },
  { name: 'Fortaleza',       code: 'FOR', lat:  -3.7762,  lon:  -38.5326, region: 'Americas' },
  { name: 'Recife',          code: 'REC', lat:  -8.1265,  lon:  -34.9237, region: 'Americas' },
  { name: 'Porto Alegre',    code: 'POA', lat: -29.9944,  lon:  -51.1714, region: 'Americas' },
  { name: 'Medellín',        code: 'MDE', lat:   6.1645,  lon:  -75.4231, region: 'Americas' },
  { name: 'Cartagena',       code: 'CTG', lat:  10.4424,  lon:  -75.5130, region: 'Americas' },
  { name: 'Cali',            code: 'CLO', lat:   3.5432,  lon:  -76.3816, region: 'Americas' },
  { name: 'La Paz',          code: 'LPB', lat: -16.5133,  lon:  -68.1923, region: 'Americas' },
  { name: 'Santa Cruz',      code: 'VVI', lat: -17.6448,  lon:  -63.1354, region: 'Americas' },
  { name: 'Caracas',         code: 'CCS', lat:  10.6031,  lon:  -66.9913, region: 'Americas' },
  { name: 'Georgetown',      code: 'GEO', lat:   6.4986,  lon:  -58.2541, region: 'Americas' },
  { name: 'Paramaribo',      code: 'PBM', lat:   5.4528,  lon:  -55.1878, region: 'Americas' },
  { name: 'Cayenne',         code: 'CAY', lat:   4.8198,  lon:  -52.3605, region: 'Americas' },
  { name: 'Manaus',          code: 'MAO', lat:  -3.0386,  lon:  -60.0497, region: 'Americas' },
  { name: 'Belém',           code: 'BEL', lat:  -1.3792,  lon:  -48.4762, region: 'Americas' },
  { name: 'Salvador',        code: 'SSA', lat: -12.9086,  lon:  -38.3225, region: 'Americas' },
  { name: 'Córdoba',         code: 'COR', lat: -31.3236,  lon:  -64.2080, region: 'Americas' },
  { name: 'Mendoza',         code: 'MDZ', lat: -32.8317,  lon:  -68.7929, region: 'Americas' },
  { name: 'Arequipa',        code: 'AQP', lat: -16.3411,  lon:  -71.5830, region: 'Americas' },
  { name: 'Jacksonville',    code: 'JAX', lat:  30.4941,  lon:  -81.6879, region: 'Americas' },
  { name: 'San Antonio',     code: 'SAT', lat:  29.5337,  lon:  -98.4698, region: 'Americas' },
  { name: 'Indianapolis',    code: 'IND', lat:  39.7173,  lon:  -86.2944, region: 'Americas' },

  // ── Europe new (90) ───────────────────────────────────────────────────────
  // Germany secondaries
  { name: 'Berlin',          code: 'BER', lat:  52.3667,  lon:   13.5033, region: 'Europe' },
  { name: 'Stuttgart',       code: 'STR', lat:  48.6899,  lon:    9.2220, region: 'Europe' },
  { name: 'Cologne',         code: 'CGN', lat:  50.8659,  lon:    7.1427, region: 'Europe' },
  { name: 'Nuremberg',       code: 'NUE', lat:  49.4987,  lon:   11.0669, region: 'Europe' },
  { name: 'Hannover',        code: 'HAJ', lat:  52.4611,  lon:    9.6850, region: 'Europe' },
  { name: 'Bremen',          code: 'BRE', lat:  53.0475,  lon:    8.7867, region: 'Europe' },
  { name: 'Leipzig',         code: 'LEJ', lat:  51.4324,  lon:   12.2416, region: 'Europe' },
  { name: 'Dresden',         code: 'DRS', lat:  51.1328,  lon:   13.7672, region: 'Europe' },
  // UK regionaals
  { name: 'London Gatwick',  code: 'LGW', lat:  51.1537,  lon:   -0.1821, region: 'Europe' },
  { name: 'London Stansted', code: 'STN', lat:  51.8850,  lon:    0.2350, region: 'Europe' },
  { name: 'London Luton',    code: 'LTN', lat:  51.8747,  lon:   -0.3683, region: 'Europe' },
  { name: 'Birmingham',      code: 'BHX', lat:  52.4539,  lon:   -1.7480, region: 'Europe' },
  { name: 'Bristol',         code: 'BRS', lat:  51.3827,  lon:   -2.7191, region: 'Europe' },
  { name: 'Newcastle',       code: 'NCL', lat:  55.0375,  lon:   -1.6917, region: 'Europe' },
  { name: 'Belfast',         code: 'BFS', lat:  54.6575,  lon:   -6.2158, region: 'Europe' },
  { name: 'East Midlands',   code: 'EMA', lat:  52.8311,  lon:   -1.3281, region: 'Europe' },
  { name: 'Glasgow',         code: 'GLA', lat:  55.8719,  lon:   -4.4331, region: 'Europe' },
  // Scandinavia
  { name: 'Gothenburg',      code: 'GOT', lat:  57.6628,  lon:   12.2798, region: 'Europe' },
  { name: 'Bergen',          code: 'BGO', lat:  60.2934,  lon:    5.2181, region: 'Europe' },
  { name: 'Stavanger',       code: 'SVG', lat:  58.8768,  lon:    5.6378, region: 'Europe' },
  { name: 'Trondheim',       code: 'TRD', lat:  63.4578,  lon:   10.9239, region: 'Europe' },
  // Baltics
  { name: 'Tallinn',         code: 'TLL', lat:  59.4133,  lon:   24.8328, region: 'Europe' },
  { name: 'Vilnius',         code: 'VNO', lat:  54.6341,  lon:   25.2858, region: 'Europe' },
  { name: 'Kaunas',          code: 'KUN', lat:  54.9639,  lon:   24.0848, region: 'Europe' },
  // Poland
  { name: 'Wroclaw',         code: 'WRO', lat:  51.1027,  lon:   16.8858, region: 'Europe' },
  { name: 'Kraków',          code: 'KRK', lat:  50.0777,  lon:   19.7848, region: 'Europe' },
  { name: 'Gdansk',          code: 'GDN', lat:  54.3776,  lon:   18.4662, region: 'Europe' },
  { name: 'Poznan',          code: 'POZ', lat:  52.4210,  lon:   16.8263, region: 'Europe' },
  // Benelux/Low Countries
  { name: 'Eindhoven',       code: 'EIN', lat:  51.4501,  lon:    5.3745, region: 'Europe' },
  { name: 'Rotterdam',       code: 'RTM', lat:  51.9569,  lon:    4.4372, region: 'Europe' },
  { name: 'Luxembourg',      code: 'LUX', lat:  49.6233,  lon:    6.2044, region: 'Europe' },
  // Bratislava
  { name: 'Bratislava',      code: 'BTS', lat:  48.1702,  lon:   17.2127, region: 'Europe' },
  // Italy secondaries
  { name: 'Venice',          code: 'VCE', lat:  45.5053,  lon:   12.3519, region: 'Europe' },
  { name: 'Turin',           code: 'TRN', lat:  45.2008,  lon:    7.6497, region: 'Europe' },
  { name: 'Naples',          code: 'NAP', lat:  40.8860,  lon:   14.2908, region: 'Europe' },
  { name: 'Bologna',         code: 'BLQ', lat:  44.5354,  lon:   11.2887, region: 'Europe' },
  { name: 'Florence',        code: 'FLR', lat:  43.8100,  lon:   11.2051, region: 'Europe' },
  { name: 'Catania',         code: 'CTA', lat:  37.4668,  lon:   15.0664, region: 'Europe' },
  { name: 'Palermo',         code: 'PMO', lat:  38.1760,  lon:   13.0910, region: 'Europe' },
  { name: 'Bari',            code: 'BRI', lat:  41.1389,  lon:   16.7606, region: 'Europe' },
  // Spain/Portugal secondaries
  { name: 'Palma Mallorca',  code: 'PMI', lat:  39.5517,  lon:    2.7388, region: 'Europe' },
  { name: 'Seville',         code: 'SVQ', lat:  37.4180,  lon:   -5.8931, region: 'Europe' },
  { name: 'Valencia',        code: 'VLC', lat:  39.4893,  lon:   -0.4816, region: 'Europe' },
  { name: 'Málaga',          code: 'AGP', lat:  36.6749,  lon:   -4.4991, region: 'Europe' },
  { name: 'Tenerife South',  code: 'TFS', lat:  28.0445,  lon:  -16.5725, region: 'Europe' },
  { name: 'Las Palmas',      code: 'LPA', lat:  27.9319,  lon:  -15.3866, region: 'Europe' },
  { name: 'Porto',           code: 'OPO', lat:  41.2481,  lon:   -8.6814, region: 'Europe' },
  { name: 'Faro',            code: 'FAO', lat:  37.0144,  lon:   -7.9659, region: 'Europe' },
  // France secondaries
  { name: 'Lyon',            code: 'LYS', lat:  45.7256,  lon:    5.0811, region: 'Europe' },
  { name: 'Marseille',       code: 'MRS', lat:  43.4393,  lon:    5.2214, region: 'Europe' },
  { name: 'Toulouse',        code: 'TLS', lat:  43.6291,  lon:    1.3638, region: 'Europe' },
  { name: 'Bordeaux',        code: 'BOD', lat:  44.8283,  lon:   -0.7156, region: 'Europe' },
  { name: 'Nantes',          code: 'NTE', lat:  47.1532,  lon:   -1.6108, region: 'Europe' },
  // Greece/Cyprus/Malta
  { name: 'Thessaloniki',    code: 'SKG', lat:  40.5197,  lon:   22.9709, region: 'Europe' },
  { name: 'Heraklion',       code: 'HER', lat:  35.3397,  lon:   25.1803, region: 'Europe' },
  { name: 'Rhodes',          code: 'RHO', lat:  36.4054,  lon:   28.0862, region: 'Europe' },
  { name: 'Larnaca',         code: 'LCA', lat:  34.8751,  lon:   33.6249, region: 'Europe' },
  { name: 'Malta',           code: 'MLA', lat:  35.8574,  lon:   14.4775, region: 'Europe' },
  // Balkans
  { name: 'Tirana',          code: 'TIA', lat:  41.4147,  lon:   19.7206, region: 'Europe' },
  { name: 'Skopje',          code: 'SKP', lat:  41.9614,  lon:   21.6214, region: 'Europe' },
  { name: 'Sarajevo',        code: 'SJJ', lat:  43.8246,  lon:   18.3315, region: 'Europe' },
  { name: 'Zagreb',          code: 'ZAG', lat:  45.7429,  lon:   16.0688, region: 'Europe' },
  { name: 'Ljubljana',       code: 'LJU', lat:  46.2237,  lon:   14.4576, region: 'Europe' },
  { name: 'Podgorica',       code: 'TGD', lat:  42.3594,  lon:   19.2519, region: 'Europe' },
  // Caucasus
  { name: 'Tbilisi',         code: 'TBS', lat:  41.6692,  lon:   44.9547, region: 'Europe' },
  { name: 'Yerevan',         code: 'EVN', lat:  40.1473,  lon:   44.3959, region: 'Europe' },
  { name: 'Baku',            code: 'GYD', lat:  40.4675,  lon:   50.0467, region: 'Europe' },
  // Moldova/Belarus
  { name: 'Chisinau',        code: 'KIV', lat:  46.9277,  lon:   28.9310, region: 'Europe' },
  { name: 'Minsk',           code: 'MSQ', lat:  53.8825,  lon:   28.0307, region: 'Europe' },
  // Russia
  { name: 'Moscow SVO',      code: 'SVO', lat:  55.9726,  lon:   37.4146, region: 'Europe' },
  { name: 'Moscow DME',      code: 'DME', lat:  55.4088,  lon:   37.9063, region: 'Europe' },
  { name: 'St Petersburg',   code: 'LED', lat:  59.8003,  lon:   30.2625, region: 'Europe' },
  { name: 'Yekaterinburg',   code: 'SVX', lat:  56.8431,  lon:   60.8028, region: 'Europe' },
  { name: 'Novosibirsk',     code: 'OVB', lat:  54.9663,  lon:   82.9067, region: 'Europe' },
  { name: 'Ufa',             code: 'UFA', lat:  54.5575,  lon:   55.8744, region: 'Europe' },
  { name: 'Kazan',           code: 'KZN', lat:  55.6063,  lon:   49.2787, region: 'Europe' },
  { name: 'Sochi',           code: 'AER', lat:  43.4499,  lon:   39.9566, region: 'Europe' },
  { name: 'Nizhny Novgorod', code: 'GOJ', lat:  56.2301,  lon:   43.7840, region: 'Europe' },
  { name: 'Samara',          code: 'KUF', lat:  53.5050,  lon:   50.1642, region: 'Europe' },
  // Istanbul second airport
  { name: 'Istanbul SAW',    code: 'SAW', lat:  40.8985,  lon:   29.3092, region: 'Europe' },
  { name: 'Krasnoyarsk',     code: 'KJA', lat:  56.1730,  lon:   92.4933, region: 'Europe' },
  { name: 'Split',           code: 'SPU', lat:  43.5389,  lon:   16.2980, region: 'Europe' },
  { name: 'Dubrovnik',       code: 'DBV', lat:  42.5614,  lon:   18.2681, region: 'Europe' },
  { name: 'Pristina',        code: 'PRN', lat:  42.5728,  lon:   21.0358, region: 'Europe' },

  // ── Middle East new (15) ───────────────────────────────────────────────────
  { name: 'Bahrain',         code: 'BAH', lat:  26.2708,  lon:   50.6336, region: 'Middle East' },
  { name: 'Jeddah',          code: 'JED', lat:  21.6796,  lon:   39.1565, region: 'Middle East' },
  { name: 'Dammam',          code: 'DMM', lat:  26.4712,  lon:   49.7979, region: 'Middle East' },
  { name: 'Medina',          code: 'MED', lat:  24.5534,  lon:   39.7051, region: 'Middle East' },
  { name: 'Sharjah',         code: 'SHJ', lat:  25.3286,  lon:   55.5172, region: 'Middle East' },
  { name: 'Al Ain',          code: 'AAN', lat:  24.2617,  lon:   55.6092, region: 'Middle East' },
  { name: 'Fujairah',        code: 'FJR', lat:  25.1122,  lon:   56.3240, region: 'Middle East' },
  { name: 'Beirut',          code: 'BEY', lat:  33.8209,  lon:   35.4884, region: 'Middle East' },
  { name: 'Sharm el-Sheikh', code: 'SSH', lat:  27.9773,  lon:   34.3950, region: 'Middle East' },
  { name: 'Hurghada',        code: 'HRG', lat:  27.1783,  lon:   33.7994, region: 'Middle East' },
  { name: 'Luxor',           code: 'LXR', lat:  25.6710,  lon:   32.7066, region: 'Middle East' },
  { name: 'Erbil',           code: 'EBL', lat:  36.2376,  lon:   43.9632, region: 'Middle East' },
  { name: 'Muscat Salalah',  code: 'SLL', lat:  17.0387,  lon:   54.0913, region: 'Middle East' },
  { name: 'Tabuk',           code: 'TUU', lat:  28.3654,  lon:   36.6189, region: 'Middle East' },
  { name: 'Abha',            code: 'AHB', lat:  18.2404,  lon:   42.6566, region: 'Middle East' },

  // ── Africa new (35) ───────────────────────────────────────────────────────
  // North Africa
  { name: 'Algiers',         code: 'ALG', lat:  36.6910,  lon:    3.2154, region: 'Africa' },
  { name: 'Marrakech',       code: 'RAK', lat:  31.6069,  lon:   -8.0363, region: 'Africa' },
  { name: 'Agadir',          code: 'AGA', lat:  30.3250,  lon:   -9.4130, region: 'Africa' },
  { name: 'Fes',             code: 'FEZ', lat:  33.9273,  lon:   -4.9779, region: 'Africa' },
  // East Africa
  { name: 'Mombasa',         code: 'MBA', lat:  -4.0348,  lon:   39.5942, region: 'Africa' },
  { name: 'Entebbe',         code: 'EBB', lat:   0.0424,  lon:   32.4435, region: 'Africa' },
  { name: 'Kigali',          code: 'KGL', lat:  -1.9686,  lon:   30.1395, region: 'Africa' },
  { name: 'Dar es Salaam',   code: 'DAR', lat:  -6.8781,  lon:   39.2026, region: 'Africa' },
  { name: 'Djibouti',        code: 'JIB', lat:  11.5473,  lon:   43.1595, region: 'Africa' },
  // Southern Africa
  { name: 'Harare',          code: 'HRE', lat: -17.9318,  lon:   31.0928, region: 'Africa' },
  { name: 'Lusaka',          code: 'LUN', lat: -15.3308,  lon:   28.4526, region: 'Africa' },
  { name: 'Windhoek',        code: 'WDH', lat: -22.4799,  lon:   17.4709, region: 'Africa' },
  { name: 'Gaborone',        code: 'GBE', lat: -24.5552,  lon:   25.9182, region: 'Africa' },
  { name: 'Lilongwe',        code: 'LLW', lat: -13.7894,  lon:   33.7810, region: 'Africa' },
  { name: 'Maputo',          code: 'MPM', lat: -25.9208,  lon:   32.5726, region: 'Africa' },
  { name: 'Victoria Falls',  code: 'VFA', lat: -18.0959,  lon:   25.8390, region: 'Africa' },
  // Islands
  { name: 'Mauritius',       code: 'MRU', lat: -20.4302,  lon:   57.6836, region: 'Africa' },
  { name: 'Réunion',         code: 'RUN', lat: -20.8871,  lon:   55.5103, region: 'Africa' },
  { name: 'Seychelles',      code: 'SEZ', lat:  -4.6743,  lon:   55.5218, region: 'Africa' },
  { name: 'Antananarivo',    code: 'TNR', lat: -18.7969,  lon:   47.4788, region: 'Africa' },
  // West Africa
  { name: 'Accra',           code: 'ACC', lat:   5.6052,  lon:   -0.1668, region: 'Africa' },
  { name: 'Abidjan',         code: 'ABJ', lat:   5.2613,  lon:   -3.9262, region: 'Africa' },
  { name: 'Dakar',           code: 'DKR', lat:  14.6705,  lon:  -17.4902, region: 'Africa' },
  { name: 'Abuja',           code: 'ABV', lat:   9.0068,  lon:    7.2632, region: 'Africa' },
  { name: 'Monrovia',        code: 'ROB', lat:   6.2328,  lon:  -10.3623, region: 'Africa' },
  { name: 'Freetown',        code: 'FNA', lat:   8.6164,  lon:  -13.1950, region: 'Africa' },
  { name: 'Conakry',         code: 'CKY', lat:   9.5769,  lon:  -13.6120, region: 'Africa' },
  { name: 'Banjul',          code: 'BJL', lat:  13.3380,  lon:  -16.6522, region: 'Africa' },
  // Central Africa
  { name: 'Kinshasa',        code: 'FIH', lat:  -4.3858,  lon:   15.4446, region: 'Africa' },
  { name: 'Brazzaville',     code: 'BZV', lat:  -4.2517,  lon:   15.2531, region: 'Africa' },
  { name: 'Douala',          code: 'DLA', lat:   4.0061,  lon:    9.7195, region: 'Africa' },
  { name: 'Yaoundé',         code: 'NSI', lat:   3.7226,  lon:   11.5533, region: 'Africa' },
  { name: 'Libreville',      code: 'LBV', lat:   0.4586,  lon:    9.4122, region: 'Africa' },
  { name: 'Luanda',          code: 'LAD', lat:  -8.8583,  lon:   13.2312, region: 'Africa' },
  { name: 'Khartoum North',  code: 'KHN', lat:  15.5895,  lon:   32.5532, region: 'Africa' },

  // ── Asia new (70) ─────────────────────────────────────────────────────────
  // Japan
  { name: 'Tokyo Narita',    code: 'NRT', lat:  35.7653,  lon:  140.3856, region: 'Asia' },
  { name: 'Sapporo',         code: 'CTS', lat:  42.7752,  lon:  141.6922, region: 'Asia' },
  { name: 'Okinawa',         code: 'OKA', lat:  26.1958,  lon:  127.6461, region: 'Asia' },
  { name: 'Nagoya',          code: 'NGO', lat:  34.8583,  lon:  136.8050, region: 'Asia' },
  { name: 'Sendai',          code: 'SDJ', lat:  38.1397,  lon:  140.9170, region: 'Asia' },
  { name: 'Hiroshima',       code: 'HIJ', lat:  34.4361,  lon:  132.9194, region: 'Asia' },
  { name: 'Kagoshima',       code: 'KOJ', lat:  31.8034,  lon:  130.7194, region: 'Asia' },
  { name: 'Nagasaki',        code: 'NGS', lat:  32.9169,  lon:  129.9139, region: 'Asia' },
  { name: 'Kumamoto',        code: 'KMJ', lat:  32.8373,  lon:  130.8553, region: 'Asia' },
  { name: 'Takamatsu',       code: 'TAK', lat:  34.2144,  lon:  134.0155, region: 'Asia' },
  // Korea
  { name: 'Seoul Gimpo',     code: 'GMP', lat:  37.5583,  lon:  126.7906, region: 'Asia' },
  { name: 'Busan',           code: 'PUS', lat:  35.1795,  lon:  128.9382, region: 'Asia' },
  { name: 'Jeju',            code: 'CJU', lat:  33.5113,  lon:  126.4930, region: 'Asia' },
  // Southeast Asia — Thailand
  { name: 'Bangkok DMK',     code: 'DMK', lat:  13.9126,  lon:  100.6067, region: 'Asia' },
  { name: 'Chiang Mai',      code: 'CNX', lat:  18.7668,  lon:   98.9628, region: 'Asia' },
  { name: 'Phuket',          code: 'HKT', lat:   8.1132,  lon:   98.3161, region: 'Asia' },
  { name: 'Ko Samui',        code: 'USM', lat:   9.5478,  lon:  100.0630, region: 'Asia' },
  { name: 'Hat Yai',         code: 'HDY', lat:   6.9332,  lon:  100.3930, region: 'Asia' },
  // Malaysia
  { name: 'Kota Kinabalu',   code: 'BKI', lat:   5.9372,  lon:  116.0508, region: 'Asia' },
  { name: 'Kuching',         code: 'KCH', lat:   1.4847,  lon:  110.3469, region: 'Asia' },
  { name: 'Penang',          code: 'PEN', lat:   5.2972,  lon:  100.2769, region: 'Asia' },
  { name: 'Langkawi',        code: 'LGK', lat:   6.3297,  lon:   99.7286, region: 'Asia' },
  { name: 'Johor Bahru',     code: 'JHB', lat:   1.6413,  lon:  103.6698, region: 'Asia' },
  // Indonesia
  { name: 'Bali',            code: 'DPS', lat:  -8.7481,  lon:  115.1670, region: 'Asia' },
  { name: 'Surabaya',        code: 'SUB', lat:  -7.3798,  lon:  112.7869, region: 'Asia' },
  { name: 'Yogyakarta',      code: 'JOG', lat:  -7.7882,  lon:  110.4317, region: 'Asia' },
  { name: 'Makassar',        code: 'UPG', lat:  -5.0616,  lon:  119.5540, region: 'Asia' },
  { name: 'Medan',           code: 'KNO', lat:   3.6422,  lon:   98.8853, region: 'Asia' },
  { name: 'Balikpapan',      code: 'BPN', lat:   1.2683,  lon:  116.8944, region: 'Asia' },
  { name: 'Palembang',       code: 'PLM', lat:  -2.8983,  lon:  104.6999, region: 'Asia' },
  { name: 'Manado',          code: 'MDC', lat:   1.5495,  lon:  124.9260, region: 'Asia' },
  { name: 'Batam',           code: 'BTH', lat:   1.1213,  lon:  104.1192, region: 'Asia' },
  // Philippines
  { name: 'Cebu',            code: 'CEB', lat:  10.3075,  lon:  123.9789, region: 'Asia' },
  { name: 'Davao',           code: 'DVO', lat:   7.1255,  lon:  125.6458, region: 'Asia' },
  { name: 'Iloilo',          code: 'ILO', lat:  10.8330,  lon:  122.4936, region: 'Asia' },
  { name: 'Puerto Princesa', code: 'PPS', lat:   9.7421,  lon:  118.7590, region: 'Asia' },
  { name: 'Kalibo',          code: 'KLO', lat:  11.6795,  lon:  122.3759, region: 'Asia' },
  // Vietnam
  { name: 'Da Nang',         code: 'DAD', lat:  16.0439,  lon:  108.1992, region: 'Asia' },
  { name: 'Nha Trang',       code: 'CXR', lat:  11.9983,  lon:  109.2194, region: 'Asia' },
  { name: 'Hue',             code: 'HUI', lat:  16.4015,  lon:  107.7033, region: 'Asia' },
  { name: 'Can Tho',         code: 'VCA', lat:  10.0851,  lon:  105.7119, region: 'Asia' },
  { name: 'Phu Quoc',        code: 'PQC', lat:  10.2270,  lon:  103.9670, region: 'Asia' },
  // Myanmar/Laos/Cambodia
  { name: 'Yangon',          code: 'RGN', lat:  16.9073,  lon:   96.1332, region: 'Asia' },
  { name: 'Vientiane',       code: 'VTE', lat:  17.9883,  lon:  102.5633, region: 'Asia' },
  { name: 'Phnom Penh',      code: 'PNH', lat:  11.5466,  lon:  104.8440, region: 'Asia' },
  { name: 'Siem Reap',       code: 'REP', lat:  13.4107,  lon:  103.8127, region: 'Asia' },
  // South Asia — India
  { name: 'Hyderabad',       code: 'HYD', lat:  17.2313,  lon:   78.4298, region: 'Asia' },
  { name: 'Kochi',           code: 'COK', lat:   9.9952,  lon:   76.2699, region: 'Asia' },
  { name: 'Goa',             code: 'GOI', lat:  15.3808,  lon:   73.8314, region: 'Asia' },
  { name: 'Ahmedabad',       code: 'AMD', lat:  23.0772,  lon:   72.6347, region: 'Asia' },
  { name: 'Jaipur',          code: 'JAI', lat:  26.8242,  lon:   75.8122, region: 'Asia' },
  { name: 'Lucknow',         code: 'LKO', lat:  26.7606,  lon:   80.8893, region: 'Asia' },
  { name: 'Chandigarh',      code: 'IXC', lat:  30.6735,  lon:   76.7885, region: 'Asia' },
  { name: 'Guwahati',        code: 'GAU', lat:  26.1061,  lon:   91.5859, region: 'Asia' },
  { name: 'Bhubaneswar',     code: 'BBI', lat:  20.2444,  lon:   85.8178, region: 'Asia' },
  { name: 'Thiruvananthapuram', code: 'TRV', lat:   8.4821,  lon:   76.9201, region: 'Asia' },
  { name: 'Varanasi',        code: 'VNS', lat:  25.4524,  lon:   82.8593, region: 'Asia' },
  { name: 'Amritsar',        code: 'ATQ', lat:  31.7096,  lon:   74.7973, region: 'Asia' },
  // Nepal/Bhutan/Bangladesh
  { name: 'Kathmandu',       code: 'KTM', lat:  27.6966,  lon:   85.3591, region: 'Asia' },
  { name: 'Paro',            code: 'PBH', lat:  27.4033,  lon:   89.4242, region: 'Asia' },
  { name: 'Chittagong',      code: 'CGP', lat:  22.2496,  lon:   91.8133, region: 'Asia' },
  // Maldives
  { name: 'Malé',            code: 'MLE', lat:   4.1918,  lon:   73.5290, region: 'Asia' },
  // Central Asia
  { name: 'Almaty',          code: 'ALA', lat:  43.3521,  lon:   77.0405, region: 'Asia' },
  { name: 'Astana',          code: 'TSE', lat:  51.0222,  lon:   71.4669, region: 'Asia' },
  { name: 'Tashkent',        code: 'TAS', lat:  41.2579,  lon:   69.2812, region: 'Asia' },
  { name: 'Bishkek',         code: 'FRU', lat:  43.0612,  lon:   74.4776, region: 'Asia' },
  { name: 'Dushanbe',        code: 'DYU', lat:  38.5433,  lon:   68.7750, region: 'Asia' },
  { name: 'Ashgabat',        code: 'ASB', lat:  37.9868,  lon:   58.3610, region: 'Asia' },
  // Mongolia
  { name: 'Ulaanbaatar',     code: 'ULN', lat:  47.8431,  lon:  106.7664, region: 'Asia' },
  // Russia Far East
  { name: 'Vladivostok',     code: 'VVO', lat:  43.3990,  lon:  132.1478, region: 'Asia' },
  { name: 'Khabarovsk',      code: 'KHV', lat:  48.5280,  lon:  135.1883, region: 'Asia' },
  { name: 'Irkutsk',         code: 'IKT', lat:  52.2680,  lon:  104.3889, region: 'Asia' },
  { name: 'Yuzhno-Sakhalinsk', code: 'UUS', lat:  46.8887,  lon:  142.7183, region: 'Asia' },
  { name: 'Nagpur',          code: 'NAG', lat:  21.0922,  lon:   79.0472, region: 'Asia' },
  { name: 'Srinagar',        code: 'SXR', lat:  33.9871,  lon:   74.7742, region: 'Asia' },
  { name: 'Tiruchirappalli', code: 'TRZ', lat:  10.7654,  lon:   78.7097, region: 'Asia' },

  // ── Pacific new (15) ──────────────────────────────────────────────────────
  // Australia
  { name: 'Adelaide',        code: 'ADL', lat: -34.9450,  lon:  138.5308, region: 'Pacific' },
  { name: 'Canberra',        code: 'CBR', lat: -35.3069,  lon:  149.1950, region: 'Pacific' },
  { name: 'Cairns',          code: 'CNS', lat: -16.8858,  lon:  145.7551, region: 'Pacific' },
  { name: 'Gold Coast',      code: 'OOL', lat: -28.1644,  lon:  153.5047, region: 'Pacific' },
  { name: 'Darwin',          code: 'DRW', lat: -12.4147,  lon:  130.8765, region: 'Pacific' },
  { name: 'Hobart',          code: 'HBA', lat: -42.8361,  lon:  147.5078, region: 'Pacific' },
  { name: 'Townsville',      code: 'TSV', lat: -19.2525,  lon:  146.7653, region: 'Pacific' },
  { name: 'Alice Springs',   code: 'ASP', lat: -23.8067,  lon:  133.9022, region: 'Pacific' },
  // New Zealand
  { name: 'Christchurch',    code: 'CHC', lat: -43.4894,  lon:  172.5322, region: 'Pacific' },
  { name: 'Wellington',      code: 'WLG', lat: -41.3272,  lon:  174.8050, region: 'Pacific' },
  { name: 'Queenstown',      code: 'ZQN', lat: -45.0211,  lon:  168.7392, region: 'Pacific' },
  // Pacific Islands
  { name: 'Nadi',            code: 'NAN', lat: -17.7554,  lon:  177.4430, region: 'Pacific' },
  { name: 'Papeete',         code: 'PPT', lat: -17.5534,  lon: -149.6067, region: 'Pacific' },
  { name: 'Port Moresby',    code: 'POM', lat:  -9.4433,  lon:  147.2200, region: 'Pacific' },
  { name: 'Guam',            code: 'GUM', lat:  13.4834,  lon:  144.7961, region: 'Pacific' },
];

let activeCity = null;

const sceneTrans = document.getElementById('scene-transition');
const sceneTransCode = document.getElementById('scene-trans-code');
const sceneTransName = document.getElementById('scene-trans-name');

async function switchCity(city) {
  if (activeCity && activeCity.code === city.code) return;
  activeCity = city;

  // 1. Show city name and fade to black
  if (sceneTransCode) sceneTransCode.textContent = city.code;
  if (sceneTransName) sceneTransName.textContent = city.name;
  if (sceneTrans) {
    sceneTrans.style.transition = 'opacity 0.28s ease';
    sceneTrans.style.opacity = '1';
    sceneTrans.style.pointerEvents = 'all';
    sceneTrans.classList.add('loading');
  }

  // 2. Wait for screen to go dark
  await new Promise(r => setTimeout(r, 320));

  // 3. Clear old scene while screen is dark
  closeDetail();
  stopFollow();
  if (autoTour) stopAutoTour();
  if (selectedAirportState) {
    deselectAirport(scene);
    if (aircraftManager) aircraftManager.clearHighlight();
    selectedAirportState = null;
  }
  if (aircraftManager) aircraftManager.clearAll(scene);
  clearGroundMap(scene);
  clearAirports(scene);

  setUserLocation(city.lat, city.lon);
  if (aircraftManager) aircraftManager.updateUserLocation(city.lat, city.lon);
  updateHUDCity(city.name, city.code);
  updateHUDAirports(0);

  // Reset camera to cinematic angle
  controls.enabled = false;
  camera.position.set(8, 9, 12);
  controls.target.set(0, 1, 0);
  controls.update();
  controls.enabled = true;

  // 4. Load base map while screen is dark — then reveal
  await loadGroundMap(city.lat, city.lon);

  // 5. Fade back — new map is ready
  if (sceneTrans) {
    sceneTrans.classList.remove('loading');
    sceneTrans.style.transition = 'opacity 0.9s ease';
    sceneTrans.style.opacity = '0';
    sceneTrans.style.pointerEvents = '';
  }

  // 6. Load airports non-blocking after reveal
  loadAirports(scene, city.lat, city.lon).then(() => {
    const aptData = getAirportData();
    if (aptData) updateHUDAirports(aptData.airports.length);
  });
}

// ── Globe View ──────────────────────────────────────────────────────────────
class GlobeView {
  constructor(canvas, onSelect) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onSelect = onSelect;
    this.viewLon = 0; this.viewLat = 20;
    this._tLon = 0;   this._tLat = 20;
    this.activeRegion = 'All';
    this.searchQuery = '';
    this.selectedIdx = -1;
    this.hoveredIdx = -1;
    this._dragging = false;
    this._lastX = 0; this._lastY = 0;
    this._autoRotate = true;
    this._paused = true;
    this._raf = null;
    this.cx = 0; this.cy = 0; this.R = 0;
    this._bindEvents();
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cx = w / 2; this.cy = h / 2;
    this.R = Math.min(w, h) * 0.46;
  }

  _proj(lat, lon) {
    const D = Math.PI / 180;
    const phi = lat * D, phi0 = this.viewLat * D;
    const dl = (lon - this.viewLon) * D;
    const cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dl);
    return {
      x: this.cx + this.R * Math.cos(phi) * Math.sin(dl),
      y: this.cy - this.R * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dl)),
      visible: cosc >= 0,
      depth: cosc,
    };
  }

  _draw() {
    const ctx = this.ctx;
    const { cx, cy, R } = this;
    ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

    // Globe fill
    const fill = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, 0, cx, cy, R);
    fill.addColorStop(0, '#0e1f3a'); fill.addColorStop(0.7, '#060e1c'); fill.addColorStop(1, '#020509');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();

    // Clip to globe disk for grid + dots
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    this._drawGrid();
    this._drawDots();
    ctx.restore();

    // Border ring
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(196,160,88,0.2)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  _drawGrid() {
    const ctx = this.ctx;
    const draw = (pts, a) => {
      if (pts.length < 2) return;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(30,70,130,${a})`; ctx.lineWidth = 0.5; ctx.stroke();
    };
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = [];
      for (let lon = -180; lon <= 180; lon += 3) {
        const p = this._proj(lat, lon);
        if (p.visible) pts.push(p); else if (pts.length) { draw(pts, lat === 0 ? 0.55 : 0.25); pts.length = 0; }
      }
      draw(pts, lat === 0 ? 0.55 : 0.25);
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const pts = [];
      for (let lat = -88; lat <= 88; lat += 3) {
        const p = this._proj(lat, lon);
        if (p.visible) pts.push(p); else if (pts.length) { draw(pts, 0.2); pts.length = 0; }
      }
      draw(pts, 0.2);
    }
  }

  _drawDots() {
    const ctx = this.ctx;
    const q = this.searchQuery;
    // Two passes: dim first, then bright (so labels render on top)
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < CITIES.length; i++) {
        const c = CITIES[i];
        const p = this._proj(c.lat, c.lon);
        if (!p.visible) continue;
        const sel = i === this.selectedIdx;
        const hov = i === this.hoveredIdx;
        if (pass === 0 && (sel || hov)) continue;
        if (pass === 1 && !sel && !hov) continue;
        const matches = (this.activeRegion === 'All' || c.region === this.activeRegion) &&
          (!q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().startsWith(q));
        const d = Math.max(0.2, p.depth);
        if (sel) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 11);
          g.addColorStop(0, 'rgba(196,160,88,0.6)'); g.addColorStop(1, 'rgba(196,160,88,0)');
          ctx.beginPath(); ctx.arc(p.x, p.y, 11, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,215,80,${d})`; ctx.fill();
          this._label(ctx, p, `${c.code}  ${c.name}`, 'rgba(255,210,80,0.95)', true);
        } else if (hov) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
          g.addColorStop(0, 'rgba(90,180,255,0.55)'); g.addColorStop(1, 'rgba(90,180,255,0)');
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(150,220,255,${d})`; ctx.fill();
          this._label(ctx, p, `${c.code}  ${c.name}`, 'rgba(150,220,255,0.9)', false);
        } else if (matches) {
          ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196,160,88,${0.45 * d + 0.15})`; ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(30,50,80,${0.5 * d})`; ctx.fill();
        }
      }
    }
  }

  _label(ctx, p, text, color, bold) {
    ctx.font = `${bold ? '600' : '400'} 10px Inter,JetBrains Mono,monospace`;
    const tw = ctx.measureText(text).width;
    let lx = p.x + 9;
    if (lx + tw + 5 > this.cx + this.R) lx = p.x - tw - 11;
    const ly = p.y - 5;
    ctx.fillStyle = 'rgba(4,9,20,0.88)';
    ctx.fillRect(lx - 3, ly - 12, tw + 6, 16);
    ctx.fillStyle = color;
    ctx.fillText(text, lx, ly);
  }

  _bindEvents() {
    const c = this.canvas;
    c.addEventListener('mousedown', e => {
      this._dragging = true; this._autoRotate = false;
      this._lastX = e.clientX; this._lastY = e.clientY; e.preventDefault();
    });
    window.addEventListener('mousemove', e => { if (!this._paused) this._onMove(e); });
    window.addEventListener('mouseup', () => { this._dragging = false; });
    c.addEventListener('mouseleave', () => { if (!this._dragging) this.hoveredIdx = -1; });
    c.addEventListener('click', () => {
      if (this.hoveredIdx >= 0) { this.selectedIdx = this.hoveredIdx; this.onSelect(this.hoveredIdx); }
    });
    c.addEventListener('touchstart', e => {
      this._dragging = true; this._autoRotate = false;
      this._lastX = e.touches[0].clientX; this._lastY = e.touches[0].clientY;
    }, { passive: true });
    c.addEventListener('touchmove', e => {
      if (!this._dragging) return;
      const dx = e.touches[0].clientX - this._lastX;
      const dy = e.touches[0].clientY - this._lastY;
      this.viewLon -= dx * 0.5; this._tLon = this.viewLon;
      this.viewLat = Math.max(-85, Math.min(85, this.viewLat + dy * 0.3)); this._tLat = this.viewLat;
      this._lastX = e.touches[0].clientX; this._lastY = e.touches[0].clientY;
      e.preventDefault();
    }, { passive: false });
    c.addEventListener('touchend', () => { this._dragging = false; });
  }

  _onMove(e) {
    if (this._dragging) {
      const dx = e.clientX - this._lastX, dy = e.clientY - this._lastY;
      this.viewLon -= dx * 0.5; this._tLon = this.viewLon;
      this.viewLat = Math.max(-85, Math.min(85, this.viewLat + dy * 0.3)); this._tLat = this.viewLat;
      this._lastX = e.clientX; this._lastY = e.clientY;
      this.hoveredIdx = -1;
    } else {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const dx0 = mx - this.cx, dy0 = my - this.cy;
      if (dx0 * dx0 + dy0 * dy0 > this.R * this.R) { this.hoveredIdx = -1; return; }
      let best = -1, bestD = 14;
      for (let i = 0; i < CITIES.length; i++) {
        const p = this._proj(CITIES[i].lat, CITIES[i].lon);
        if (!p.visible) continue;
        const d = Math.hypot(p.x - mx, p.y - my);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (best !== this.hoveredIdx) {
        this.hoveredIdx = best;
        this.canvas.style.cursor = best >= 0 ? 'pointer' : 'grab';
      }
    }
  }

  _loop() {
    if (this._paused) return;
    this._raf = requestAnimationFrame(() => this._loop());
    if (this._autoRotate && !this._dragging) { this.viewLon += 0.05; this._tLon = this.viewLon; }
    if (!this._dragging) {
      this.viewLon += (this._tLon - this.viewLon) * 0.1;
      this.viewLat += (this._tLat - this.viewLat) * 0.1;
    }
    this._draw();
  }

  setFilter(region, query) {
    this.activeRegion = region;
    this.searchQuery = (query || '').toLowerCase();
  }

  flyTo(lat, lon) {
    this._autoRotate = false;
    this._tLat = lat;
    // Shortest arc in longitude
    let dl = ((lon - this.viewLon) % 360 + 540) % 360 - 180;
    this._tLon = this.viewLon + dl;
  }

  setSelected(idx) {
    this.selectedIdx = idx;
    if (idx >= 0) this.flyTo(CITIES[idx].lat, CITIES[idx].lon);
  }

  resume() {
    if (!this._paused) return;
    this._paused = false;
    this._resize();
    this._loop();
  }

  pause() {
    this._paused = true;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  }
}

let _globeView = null;

function initCityPicker() {
  const overlay = document.getElementById('city-overlay');
  const grid = document.getElementById('city-grid');
  const closeBtn = document.getElementById('city-overlay-close');
  const hudCityBtn = document.getElementById('hud-city-btn');
  if (!overlay || !grid) return;

  // ── Region metadata ────────────────────────────────────────────────────
  const REGION_CENTERS = {
    'Americas':    { lat: 12,  lon: -88 },
    'Europe':      { lat: 52,  lon: 12  },
    'Middle East': { lat: 26,  lon: 48  },
    'Africa':      { lat: 4,   lon: 22  },
    'Asia':        { lat: 22,  lon: 100 },
    'Pacific':     { lat: -28, lon: 148 },
  };
  const regionOrder = [];
  const regionCounts = {};
  for (const c of CITIES) {
    if (!regionCounts[c.region]) { regionCounts[c.region] = 0; regionOrder.push(c.region); }
    regionCounts[c.region]++;
  }

  // ── Globe ────────────────────────────────────────────────────────────────
  const globeCanvas = document.getElementById('city-globe-canvas');
  if (globeCanvas) {
    _globeView = new GlobeView(globeCanvas, (idx) => {
      selectCity(idx);
    });
  }

  // ── Search (always visible above grid) ──────────────────────────────────
  const searchWrap = document.createElement('div');
  searchWrap.className = 'city-search-wrap';
  searchWrap.innerHTML =
    `<input id="city-search-input" class="city-search-input" type="text"
       placeholder="Search city or IATA code..." autocomplete="off" spellcheck="false">`;
  grid.parentElement.insertBefore(searchWrap, grid);
  const searchInput = document.getElementById('city-search-input');

  // ── State ────────────────────────────────────────────────────────────────
  let viewState = 'regions';
  let searchQuery = '';
  let _selectedIdx = -1;

  function selectCity(idx) {
    _selectedIdx = idx;
    _globeView?.setSelected(idx);
    overlay.classList.add('hidden');
    _globeView?.pause();
    localStorage.setItem('stratum:city-picked', '1');
    if (hudCityBtn) hudCityBtn.classList.remove('nudge');
    switchCity(CITIES[idx]);
  }

  // ── Render: region cards ─────────────────────────────────────────────────
  function renderRegions() {
    viewState = 'regions';
    _globeView?.setFilter('All', '');
    grid.innerHTML =
      `<div class="city-region-cards">` +
      regionOrder.map(r =>
        `<button type="button" class="city-region-card" data-region="${r}">
           <span class="crc-name">${r}</span>
           <div class="crc-bottom">
             <span class="crc-count">${regionCounts[r]}</span>
             <span class="crc-unit">airports</span>
           </div>
         </button>`
      ).join('') +
      `</div>`;
    grid.querySelector('.city-region-cards').addEventListener('click', e => {
      const btn = e.target.closest('.city-region-card');
      if (!btn) return;
      const region = btn.dataset.region;
      const center = REGION_CENTERS[region];
      if (center) _globeView?.flyTo(center.lat, center.lon);
      renderList(region);
    });
  }

  // ── Render: airport list for a region ────────────────────────────────────
  function renderList(region) {
    viewState = 'list';
    _globeView?.setFilter(region, '');
    const airports = CITIES.map((c, i) => ({ c, i })).filter(({ c }) => c.region === region);
    grid.innerHTML =
      `<div class="city-list-header">
         <button type="button" class="city-back-btn" id="city-back-btn">‹ Regions</button>
         <span class="city-list-region-label">${region}</span>
       </div>
       <div class="city-list-items" id="city-list-items">
         ${airports.map(({ c, i }) =>
           `<div class="city-list-item${i === _selectedIdx ? ' active' : ''}" data-idx="${i}">
              <span class="cli-code">${c.code}</span>
              <span class="cli-name">${c.name}</span>
              <span class="cli-chevron">›</span>
            </div>`
         ).join('')}
       </div>`;
    document.getElementById('city-back-btn').addEventListener('click', () => {
      searchInput.value = ''; searchQuery = '';
      renderRegions();
    });
    bindListItems();
  }

  // ── Render: search results ────────────────────────────────────────────────
  function renderSearch(q) {
    viewState = 'search';
    _globeView?.setFilter('All', q);
    const matches = CITIES.map((c, i) => ({ c, i }))
      .filter(({ c }) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().startsWith(q));
    if (!matches.length) {
      grid.innerHTML = `<div class="city-no-results">No airports found</div>`;
      return;
    }
    grid.innerHTML =
      `<div class="city-list-items" id="city-list-items">
         ${matches.map(({ c, i }) =>
           `<div class="city-list-item${i === _selectedIdx ? ' active' : ''}" data-idx="${i}">
              <span class="cli-code">${c.code}</span>
              <span class="cli-name">${c.name}</span>
              <span class="cli-chevron">›</span>
            </div>`
         ).join('')}
       </div>`;
    bindListItems();
  }

  function bindListItems() {
    const el = document.getElementById('city-list-items');
    if (!el) return;
    el.addEventListener('mouseover', e => {
      const item = e.target.closest('.city-list-item');
      if (item && _globeView) _globeView.hoveredIdx = +item.dataset.idx;
    });
    el.addEventListener('mouseleave', () => { if (_globeView) _globeView.hoveredIdx = -1; });
    el.addEventListener('click', e => {
      const item = e.target.closest('.city-list-item');
      if (item) selectCity(+item.dataset.idx);
    });
  }

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase().trim();
    if (searchQuery) renderSearch(searchQuery);
    else if (viewState === 'search') renderRegions();
  });

  const closeOverlay = () => { overlay.classList.add('hidden'); _globeView?.pause(); };
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (viewState === 'list') { searchInput.value = ''; searchQuery = ''; renderRegions(); }
      else closeOverlay();
    }
  });
  if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });

  if (hudCityBtn) {
    hudCityBtn.addEventListener('click', () => openCityPicker());
    if (!localStorage.getItem('stratum:city-picked')) hudCityBtn.classList.add('nudge');
  }
  if (!localStorage.getItem('stratum:city-picked')) setTimeout(() => openCityPicker(), 1200);

  renderRegions();
}

function openCityPicker() {
  const overlay = document.getElementById('city-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  _globeView?.resume();
  setTimeout(() => {
    const s = document.getElementById('city-search-input');
    if (s) s.focus();
  }, 60);
}

// --- Search with keyboard navigation ---
function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  let debounceTimer = null;
  let selectedIndex = -1;

  function getResultItems() {
    return [...results.querySelectorAll('.search-result')];
  }

  function setSelection(idx, items) {
    items.forEach((el, i) => {
      el.classList.toggle('selected', i === idx);
      if (i === idx) el.scrollIntoView({ block: 'nearest' });
    });
    selectedIndex = idx;
  }

  function clearResults() {
    results.innerHTML = '';
    results.classList.remove('open');
    selectedIndex = -1;
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim().toUpperCase();
      selectedIndex = -1;
      if (q.length < 2 || !aircraftManager) {
        clearResults();
        return;
      }

      const matches = aircraftManager.search(q, 8);
      if (matches.length === 0) {
        results.innerHTML = '<div class="search-result"><span class="search-result-info">No results</span></div>';
        results.classList.add('open');
        return;
      }

      results.innerHTML = matches.map(ac => {
        const d = ac.getDisplayData();
        const cs = d.callsign || d.icao24;
        const info = [d.aircraftType, d.registration].filter(Boolean).join(' · ');
        return `<div class="search-result" role="option" data-icao="${d.icao24}">
          <span class="search-result-callsign">${cs}</span>
          <span class="search-result-info">${info || d.icao24}</span>
        </div>`;
      }).join('');
      results.classList.add('open');

      results.querySelectorAll('.search-result').forEach(el => {
        el.addEventListener('click', () => selectResult(el.dataset.icao));
      });
    }, 150);
  });

  function selectResult(icao) {
    const ac = aircraftManager.getByIcao(icao);
    if (ac) {
      const { lat, lon } = getUserLocation();
      showDetail(ac, lat, lon);
      aircraftManager.selectAircraft(ac);
      flyToThenFollow(ac);
      input.value = '';
      clearResults();
      input.blur();
    }
  }

  // Keyboard navigation inside search
  input.addEventListener('keydown', (e) => {
    const items = getResultItems();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelection(Math.min(selectedIndex + 1, items.length - 1), items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelection(Math.max(selectedIndex - 1, 0), items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        const icao = items[selectedIndex].dataset.icao;
        if (icao) selectResult(icao);
      }
    }
  });

  input.addEventListener('focus', () => input.select());
  input.addEventListener('blur', () => {
    setTimeout(() => clearResults(), 200);
  });

  // Global shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
    if (e.key === 'Escape') {
      const cityOverlay = document.getElementById('city-overlay');
      if (cityOverlay && !cityOverlay.classList.contains('hidden')) {
        cityOverlay.classList.add('hidden');
        return;
      }
      if (document.activeElement === input) {
        input.blur();
        input.value = '';
        clearResults();
      }
      if (autoTour) stopAutoTour();
      if (followTarget) stopFollow();
    }
  });
}

// --- Init ---
async function init() {
  // Default to JFK — no GPS needed; user picks their airspace via the city picker.
  const defaultCity = CITIES[0]; // New York / JFK
  activeCity = defaultCity;
  setUserLocation(defaultCity.lat, defaultCity.lon);
  updateHUDCity(defaultCity.name, defaultCity.code);
  updateHUD(0, defaultCity.lat, defaultCity.lon);

  aircraftManager = new AircraftManager(scene, defaultCity.lat, defaultCity.lon);

  // Load base map and airports for the default city.
  // The epoch guard in clearAirportCache() ensures any in-flight fetch here
  // is safely discarded if the user switches cities before it completes.
  loadGroundMap(defaultCity.lat, defaultCity.lon);
  loadAirports(scene, defaultCity.lat, defaultCity.lon).then(() => {
    const aptData = getAirportData();
    if (aptData) updateHUDAirports(aptData.airports.length);
  });

  startPolling(handleData, handleError);
  initSearch();
  initCityPicker();
  initNeko();
  animate();
}

init();
