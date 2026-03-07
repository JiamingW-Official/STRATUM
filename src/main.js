import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createEnvironment, updatePulse, loadGroundMap } from './scene/environment.js';
import { AircraftManager } from './scene/aircraft.js';
import { setUserLocation, getUserLocation, startPolling } from './data/opensky.js';
import { updateHUD, updateHUDTimer, showSignalLost } from './ui/hud.js';
import { showDetail, closeDetail, refreshDetail, getSelectedAircraft } from './ui/detail.js';
import { initMinimap, updateMinimapAircraft } from './ui/minimap.js';

// --- Scene setup ---
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x020408, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020408, 0.004);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(30, 15, 50);
camera.lookAt(0, 5, 0);

// --- Controls ---
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 5, 0);
controls.minDistance = 10;
controls.maxDistance = 200;
controls.maxPolarAngle = Math.PI * 0.85;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.3;

// --- Environment ---
createEnvironment(scene);

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
});
canvas.addEventListener('wheel', resetIdleTimer);

// --- Raycasting for aircraft selection ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

canvas.addEventListener('click', (e) => {
  if (!aircraftManager) return;

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(aircraftManager.raycasterTargets);

  if (intersects.length > 0) {
    const ac = aircraftManager.getByHitMesh(intersects[0].object);
    if (ac) {
      const { lat, lon } = getUserLocation();
      showDetail(ac, lat, lon);
    }
  } else {
    closeDetail();
  }
});

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
    updateMinimapAircraft(dataList);
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

// --- Animation loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // Idle auto-rotate check
  if (Date.now() - lastInteractionTime > IDLE_TIMEOUT) {
    controls.autoRotate = true;
  }

  controls.update();

  // Animate scene elements
  updatePulse(scene, elapsed);

  if (aircraftManager) {
    aircraftManager.animate(delta, elapsed);
  }

  renderer.render(scene, camera);
}

// --- Init ---
async function init() {
  const location = await initLocation();
  setUserLocation(location.lat, location.lon);
  updateHUD(0, location.lat, location.lon);

  aircraftManager = new AircraftManager(scene, location.lat, location.lon);

  initMinimap(location.lat, location.lon);

  // Load map tiles onto ground plane (async, non-blocking)
  loadGroundMap(location.lat, location.lon);

  startPolling(handleData, handleError);
  animate();
}

init();
