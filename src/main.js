import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createEnvironment, updatePulse, loadGroundMap, loadAirports, getAirportHitTargets, getAirportData, selectAirport, deselectAirport, categorizeFlights } from './scene/environment.js';
import { AircraftManager } from './scene/aircraft.js';
import { setUserLocation, getUserLocation, startPolling } from './data/opensky.js';
import { updateHUD, updateHUDTimer, updateHUDAirports, showSignalLost } from './ui/hud.js';
import { showDetail, closeDetail, refreshDetail, getSelectedAircraft } from './ui/detail.js';
import { spotAircraft, updateLiveData, onFollowStart, onFollowStop } from './ui/spotter.js';
import { initRadar, updateRadarBlips, drawRadar } from './ui/radar.js';

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

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
// Start high for cinematic intro
camera.position.set(0, 35, 0.1);
camera.lookAt(0, 0, 0);

// --- Controls ---
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0, 0);
controls.minDistance = 0.05;
controls.maxDistance = 60;
controls.maxPolarAngle = Math.PI * 0.85;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.3;
controls.enabled = false; // disabled during intro

// --- Cinematic intro ---
let introActive = true;
const introStart = performance.now();
const INTRO_DURATION = 3200; // ms
const introFrom = { x: 0, y: 35, z: 0.1, tx: 0, ty: 0, tz: 0 };
const introTo = { x: 8, y: 2, z: 12, tx: 0, ty: 1, tz: 0 };

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
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

// --- Camera fly-to ---
let flyTo = null;
let pendingFollow = null; // aircraft to follow after fly-to completes
const BASE_FOV = 50;
let cameraShake = 0; // decaying shake intensity
const speedLinesEl = document.getElementById('speed-lines');

function startFlyTo(targetPos, distance = 5) {
  const dir = new THREE.Vector3().subVectors(camera.position, targetPos);
  const travelDist = dir.length();
  dir.normalize();

  // Place camera at `distance` from target, keeping current viewing angle
  const camDir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  const endPos = new THREE.Vector3().copy(targetPos).addScaledVector(camDir, distance);

  // Arc height: lift camera during mid-flight for dramatic sweep
  const arcHeight = Math.min(travelDist * 0.3, 8);

  // Duration scales with distance so far targets don't feel rushed
  const duration = Math.max(800, Math.min(2000, travelDist * 80));

  // FOV punch scales with travel distance
  const fovPunch = Math.min(travelDist * 0.8, 18);

  controls.enabled = false; // prevent OrbitControls from fighting animation
  if (speedLinesEl) speedLinesEl.classList.add('active');

  flyTo = {
    startPos: camera.position.clone(),
    startTarget: controls.target.clone(),
    endTarget: targetPos.clone(),
    endPos: endPos,
    arcHeight,
    fovPunch,
    startTime: performance.now(),
    duration,
  };
}

function updateFlyTo() {
  if (!flyTo) return false;
  const raw = Math.min((performance.now() - flyTo.startTime) / flyTo.duration, 1);
  const t = easeOutExpo(raw);

  camera.position.lerpVectors(flyTo.startPos, flyTo.endPos, t);
  controls.target.lerpVectors(flyTo.startTarget, flyTo.endTarget, t);

  // Arc: raise camera during mid-flight (parabolic: peaks at t=0.5)
  const arc = flyTo.arcHeight * 4 * raw * (1 - raw);
  camera.position.y += arc;

  // FOV punch: widen during travel, snap back on arrival
  const fovCurve = 4 * raw * (1 - raw); // parabola peaking at 0.5
  camera.fov = BASE_FOV + flyTo.fovPunch * fovCurve;
  camera.updateProjectionMatrix();

  if (raw >= 1) {
    // Landing shake
    cameraShake = Math.min(flyTo.arcHeight * 0.04, 0.12);
    camera.fov = BASE_FOV;
    camera.updateProjectionMatrix();
    if (speedLinesEl) speedLinesEl.classList.remove('active');
    flyTo = null;
    controls.enabled = true;
    controls.update();
    // Activate pending follow after camera arrives
    if (pendingFollow) {
      startFollow(pendingFollow);
      pendingFollow = null;
    }
  }
  return true;
}

// --- Camera follow mode ---
let followTarget = null; // AircraftObject being followed
let followDistance = 3;
const followIndicator = document.getElementById('follow-indicator');
const followCallsignEl = document.getElementById('follow-callsign');

function startFollow(aircraftObj) {
  const wasFollowing = followTarget != null;
  followTarget = aircraftObj;
  flyTo = null;
  pendingFollow = null;
  controls.enabled = true;
  if (followIndicator) {
    const d = aircraftObj.getDisplayData();
    followCallsignEl.textContent = d.callsign || d.icao24;
    followIndicator.classList.remove('hidden');
  }
  followDistance = camera.position.distanceTo(aircraftObj.group.position);
  followDistance = Math.max(1.5, Math.min(followDistance, 6));
  if (!wasFollowing) onFollowStart();
}

// Fly to an aircraft, then start following it on arrival
function flyToThenFollow(aircraftObj) {
  // Stop current follow immediately so fly-to can take over camera
  if (followTarget) {
    followTarget = null;
    // Don't call onFollowStop — we're transferring, not stopping
  }
  pendingFollow = aircraftObj;
  startFlyTo(aircraftObj.group.position);
  // Show indicator immediately for responsiveness
  if (followIndicator) {
    const d = aircraftObj.getDisplayData();
    followCallsignEl.textContent = d.callsign || d.icao24;
    followIndicator.classList.remove('hidden');
  }
}

function stopFollow() {
  if (followTarget) onFollowStop();
  followTarget = null;
  pendingFollow = null;
  flyTo = null;
  controls.enabled = true;
  if (speedLinesEl) speedLinesEl.classList.remove('active');
  if (followIndicator) followIndicator.classList.add('hidden');
}

function updateFollow(delta) {
  if (!followTarget || followTarget.removed) {
    stopFollow();
    return;
  }
  const targetPos = followTarget.group.position;
  const dir = new THREE.Vector3().subVectors(camera.position, targetPos).normalize();
  const desiredPos = new THREE.Vector3().copy(targetPos).addScaledVector(dir, followDistance);

  // Framerate-independent smooth lerp
  const posSmooth = 1 - Math.pow(0.001, delta);  // ~0.08 at 60fps
  const tgtSmooth = 1 - Math.pow(0.0003, delta); // ~0.12 at 60fps
  camera.position.lerp(desiredPos, posSmooth);
  controls.target.lerp(targetPos, tgtSmooth);
  controls.update();
}

// --- Compass ---
const compassNeedle = document.getElementById('compass-needle');
const compassHeading = document.getElementById('compass-heading');
let cameraHeading = 0;

function updateCompass() {
  // Camera heading: angle of camera direction projected onto XZ plane
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
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

// --- Aircraft Manager ---
let aircraftManager = null;

// --- Idle auto-rotate ---
let lastInteractionTime = Date.now();
const IDLE_TIMEOUT = 30000;

function resetIdleTimer() {
  lastInteractionTime = Date.now();
  controls.autoRotate = false;
}

canvas.addEventListener('pointerdown', resetIdleTimer);
canvas.addEventListener('pointermove', (e) => {
  if (e.buttons > 0) resetIdleTimer();
  // Hover cursor — show pointer when over interactive objects
  if (aircraftManager) {
    const hx = (e.clientX / window.innerWidth) * 2 - 1;
    const hy = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera({ x: hx, y: hy }, camera);
    const hits = raycaster.intersectObjects(aircraftManager.raycasterTargets, false);
    const aptHits = getAirportHitTargets().length > 0 ? raycaster.intersectObjects(getAirportHitTargets(), false) : [];
    canvas.style.cursor = (hits.length > 0 || aptHits.length > 0) ? 'pointer' : '';
  }
});
canvas.addEventListener('wheel', (e) => {
  resetIdleTimer();
  // In follow mode, scroll adjusts follow distance instead of OrbitControls zoom
  if (followTarget) {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.005;
    followDistance = Math.max(0.8, Math.min(12, followDistance + zoomDelta));
  }
}, { passive: false });

// --- Raycasting for aircraft selection ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let selectedAirportState = null;

// Unified click handler — delays single-click to detect dblclick first
let clickTimer = null;
let clickedAircraft = null;

function handleAircraftSelect(ac) {
  const { lat, lon } = getUserLocation();
  showDetail(ac, lat, lon);
  spotAircraft(ac.getDisplayData(), lat, lon);
  if (followTarget || pendingFollow) {
    flyToThenFollow(ac);
  } else {
    startFlyTo(ac.group.position);
  }
  if (selectedAirportState) {
    deselectAirport(scene);
    aircraftManager.clearHighlight();
    selectedAirportState = null;
  }
}

function raycastAircraft(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  scene.updateMatrixWorld(true);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(aircraftManager.raycasterTargets, false);
  return hits.length > 0 ? aircraftManager.getByHitMesh(hits[0].object) : null;
}

canvas.addEventListener('click', (e) => {
  if (!aircraftManager) return;

  const ac = raycastAircraft(e);
  if (ac) {
    // Delay to see if dblclick follows
    clickedAircraft = ac;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      // Single click confirmed — fly to but don't follow
      handleAircraftSelect(clickedAircraft);
      clickedAircraft = null;
      clickTimer = null;
    }, 220);
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
  stopFollow();
  if (selectedAirportState) {
    deselectAirport(scene);
    aircraftManager.clearHighlight();
    selectedAirportState = null;
  }
});

// Double-click to follow/track aircraft
canvas.addEventListener('dblclick', (e) => {
  if (!aircraftManager) return;
  e.preventDefault();

  // Cancel pending single-click
  if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }

  const ac = clickedAircraft || raycastAircraft(e);
  clickedAircraft = null;
  if (ac) {
    const { lat, lon } = getUserLocation();
    showDetail(ac, lat, lon);
    spotAircraft(ac.getDisplayData(), lat, lon);
    flyToThenFollow(ac);
  }
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

    // Gamification: update radar + challenge system (passive, no XP)
    updateLiveData(dataList);
    updateRadarBlips(dataList, lat, lon, cameraHeading);
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
});

// --- HUD timer update ---
setInterval(updateHUDTimer, 1000);

// --- WASD camera movement ---
const keysDown = new Set();
const MOVE_BASE_SPEED = 10;
const MOVE_SPRINT_MULT = 2.5;
const MOVE_ACCEL = 6;     // ramp-up per second (0→1 in ~0.17s)
const MOVE_DECEL = 8;     // ramp-down per second
let moveVelocity = 0;     // 0–1 smooth factor
let shiftHeld = false;

document.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === 'INPUT') return;
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

function getWASDInput() {
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

  const move = new THREE.Vector3();
  if (keysDown.has('w')) move.add(forward);
  if (keysDown.has('s')) move.sub(forward);
  if (keysDown.has('d')) move.add(right);
  if (keysDown.has('a')) move.sub(right);
  if (keysDown.has('q')) move.y -= 1;
  if (keysDown.has('e')) move.y += 1;
  return move;
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
  if (flyTo) { flyTo = null; controls.enabled = true; if (speedLinesEl) speedLinesEl.classList.remove('active'); camera.fov = BASE_FOV; camera.updateProjectionMatrix(); } // cancel fly-to on manual movement

  const speed = MOVE_BASE_SPEED * (shiftHeld ? MOVE_SPRINT_MULT : 1);
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

  // Cinematic intro
  if (introActive) {
    updateIntro();
  } else if (flyTo) {
    // Fly-to takes priority (click-to-select, switching targets)
    updateFlyTo();
    resetIdleTimer();
  } else if (followTarget) {
    // Follow mode — smoothly track aircraft, WASD orbits around it
    updateFollowWASD(delta);
    updateFollow(delta);
    resetIdleTimer();
  } else {
    // WASD panning
    updateWASD(delta);
    // Idle auto-rotate with gentle altitude bob
    if (Date.now() - lastInteractionTime > IDLE_TIMEOUT) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3 + 0.1 * Math.sin(elapsed * 0.2);
    }
    controls.update();
  }

  // Camera shake decay (after fly-to landing)
  if (cameraShake > 0.001) {
    camera.position.x += (Math.random() - 0.5) * cameraShake;
    camera.position.y += (Math.random() - 0.5) * cameraShake * 0.5;
    cameraShake *= Math.pow(0.02, delta); // fast decay
  } else {
    cameraShake = 0;
  }

  // Subtle idle breathing — gentle camera sway when not interacting
  if (!introActive && !flyTo && !followTarget && moveVelocity === 0) {
    const breathX = Math.sin(elapsed * 0.15) * 0.003;
    const breathY = Math.cos(elapsed * 0.1) * 0.002;
    camera.position.x += breathX;
    camera.position.y += breathY;
  }

  // Animate scene elements
  updatePulse(scene, elapsed);

  // Compass
  updateCompass();

  // Radar
  drawRadar(elapsed);

  // Animate particles — slow drift upward, streak during fly-to
  const posArr = particles.geometry.attributes.position.array;
  const pSpeed = flyTo ? 8 : 1; // particles rush past during fly-to
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    posArr[i * 3 + 1] += particleSpeeds[i] * delta * pSpeed;
    if (posArr[i * 3 + 1] > 5) {
      posArr[i * 3 + 1] = 0;
      posArr[i * 3] = (Math.random() - 0.5) * 60;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;
  const baseOpacity = flyTo ? 0.2 : 0.08; // brighter particles during fly-to
  particleMat.opacity = baseOpacity + 0.06 * Math.sin(elapsed * 0.4);
  particleMat.size = flyTo ? 0.06 : 0.03; // larger during fly-to

  if (aircraftManager) {
    aircraftManager.animate(delta, elapsed);
  }

  renderer.render(scene, camera);
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
            spotAircraft(ac.getDisplayData(), lat, lon);
            startFlyTo(ac.group.position);
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
      // Exit follow mode
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

  // Init radar minimap — click a blip to select aircraft
  initRadar((icao24) => {
    if (!aircraftManager) return;
    const ac = aircraftManager.getByIcao(icao24);
    if (ac) {
      const { lat, lon } = getUserLocation();
      showDetail(ac, lat, lon);
      spotAircraft(ac.getDisplayData(), lat, lon);
      startFlyTo(ac.group.position);
    }
  });

  startPolling(handleData, handleError);
  initSearch();
  animate();
}

init();
