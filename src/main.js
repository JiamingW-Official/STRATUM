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
const CITIES = [
  { name: 'New York',    code: 'JFK', lat: 40.6413,  lon: -73.7781,  region: 'Americas' },
  { name: 'Los Angeles', code: 'LAX', lat: 33.9425,  lon: -118.4081, region: 'Americas' },
  { name: 'Chicago',     code: 'ORD', lat: 41.9742,  lon: -87.9073,  region: 'Americas' },
  { name: 'Miami',       code: 'MIA', lat: 25.7959,  lon: -80.2870,  region: 'Americas' },
  { name: 'London',      code: 'LHR', lat: 51.4775,  lon: -0.4614,   region: 'Europe' },
  { name: 'Paris',       code: 'CDG', lat: 49.0097,  lon: 2.5479,    region: 'Europe' },
  { name: 'Frankfurt',   code: 'FRA', lat: 50.0379,  lon: 8.5622,    region: 'Europe' },
  { name: 'Amsterdam',   code: 'AMS', lat: 52.3105,  lon: 4.7683,    region: 'Europe' },
  { name: 'Istanbul',    code: 'IST', lat: 41.2608,  lon: 28.7418,   region: 'Europe' },
  { name: 'Dubai',       code: 'DXB', lat: 25.2532,  lon: 55.3657,   region: 'Middle East' },
  { name: 'Singapore',   code: 'SIN', lat: 1.3644,   lon: 103.9915,  region: 'Asia' },
  { name: 'Hong Kong',   code: 'HKG', lat: 22.3080,  lon: 113.9185,  region: 'Asia' },
  { name: 'Tokyo',       code: 'HND', lat: 35.5493,  lon: 139.7798,  region: 'Asia' },
  { name: 'Seoul',       code: 'ICN', lat: 37.4602,  lon: 126.4407,  region: 'Asia' },
  { name: 'Beijing',     code: 'PEK', lat: 40.0799,  lon: 116.6031,  region: 'Asia' },
  { name: 'Sydney',      code: 'SYD', lat: -33.9399, lon: 151.1753,  region: 'Pacific' },
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

function initCityPicker() {
  const overlay = document.getElementById('city-overlay');
  const grid = document.getElementById('city-grid');
  const closeBtn = document.getElementById('city-overlay-close');
  const hudCityBtn = document.getElementById('hud-city-btn');
  if (!overlay || !grid) return;

  // Group cities by region maintaining insertion order
  const regionOrder = [];
  const regionMap = {};
  for (let i = 0; i < CITIES.length; i++) {
    const c = CITIES[i];
    if (!regionMap[c.region]) {
      regionMap[c.region] = [];
      regionOrder.push(c.region);
    }
    regionMap[c.region].push(i);
  }

  grid.innerHTML = regionOrder.map(region =>
    `<div class="city-region-block">
      <div class="city-region-label">${region}</div>
      <div class="city-region-row">
        ${regionMap[region].map(idx => {
          const c = CITIES[idx];
          return `<button type="button" class="city-card" data-idx="${idx}">
            <span class="city-card-code">${c.code}</span>
            <span class="city-card-name">${c.name}</span>
          </button>`;
        }).join('')}
      </div>
    </div>`
  ).join('');

  function markActive(idx) {
    grid.querySelectorAll('.city-card').forEach(c => c.classList.remove('active'));
    const active = grid.querySelector(`.city-card[data-idx="${idx}"]`);
    if (active) active.classList.add('active');
  }

  grid.querySelectorAll('.city-card').forEach(card => {
    card.addEventListener('click', () => {
      const city = CITIES[+card.dataset.idx];
      markActive(+card.dataset.idx);
      overlay.classList.add('hidden');
      localStorage.setItem('stratum:city-picked', '1');
      if (hudCityBtn) hudCityBtn.classList.remove('nudge');
      switchCity(city);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });

  // Keyboard navigation inside overlay
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.add('hidden');
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const cards = [...grid.querySelectorAll('.city-card')];
      const focused = document.activeElement;
      const idx = cards.indexOf(focused);
      if (idx === -1) { cards[0]?.focus(); return; }
      const next = e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? Math.min(idx + 1, cards.length - 1)
        : Math.max(idx - 1, 0);
      cards[next]?.focus();
      e.preventDefault();
    }
  });

  // Wire HUD city button
  if (hudCityBtn) {
    hudCityBtn.addEventListener('click', () => openCityPicker());
    // First-time nudge
    if (!localStorage.getItem('stratum:city-picked')) {
      hudCityBtn.classList.add('nudge');
    }
  }

  // Auto-open on first visit so users discover the city picker immediately
  if (!localStorage.getItem('stratum:city-picked')) {
    setTimeout(() => openCityPicker(), 1200);
  }
}

function openCityPicker() {
  const overlay = document.getElementById('city-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  // Focus first card for keyboard nav
  setTimeout(() => {
    const first = overlay.querySelector('.city-card');
    if (first) first.focus();
  }, 50);
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
  const location = await initLocation();
  setUserLocation(location.lat, location.lon);
  updateHUD(0, location.lat, location.lon);

  aircraftManager = new AircraftManager(scene, location.lat, location.lon);

  loadGroundMap(location.lat, location.lon);

  loadAirports(scene, location.lat, location.lon).then(() => {
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
