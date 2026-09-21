import * as THREE from "three";
import { CITIES } from "./data/cities.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { initSchool, toggleSkyLegend, toggleSchool, schoolKey } from "./ui/school.js";
import { setViewCamera } from "./scene/mapTiles.js";
// Postprocessing is lazy-loaded after first render to keep critical-path JS small
import {
  createEnvironment,
  updatePulse,
  updateAirportLightFalloff,
  loadGroundMap,
  loadAirports,
  clearGroundMap,
  clearAirports,
  getAirportHitTargets,
  getAirportData,
  selectAirport,
  deselectAirport,
  categorizeFlights,
  updateWindIndicators,
  checkLandings,
  updateTouchdownEffects,
  updateDayNight,
  animateAirportLoading,
  clearFIRBoundaries,
  reloadFIRForLocation,
  sceneToGeo,
  getFIRForPosition,
  clearNavChart,
  reloadNavChart,
  renderFuelRangeRing,
  clearFuelRangeRing,
  getRunwayThresholdTargets,
  getChartFixes,
  getNavHitTargets,
  updateRouteOverlay,
  clearRouteOverlay,
  updateCoverageShadow,
  setCoverageShadowVisible,
  updateChartDetail,
  setFogDensityLocked,
} from "./scene/environment.js";
import {
  AircraftManager,
  createRouteArc,
  removeRouteArc,
  classifyAircraftType,
  getTCASTraffic,
  setSunState,
  haversineDistance,
  toggleGhostMode,
  refreshGhostNames,
  isGhostMode,
} from "./scene/aircraft.js";
import {
  setUserLocation,
  getUserLocation,
  startPolling,
  restartPolling,
  enrichAircraft,
  getRoute,
} from "./data/opensky.js";
import { prefetchAirportData } from "./data/airports.js";
import {
  updateHUD,
  updateHUDTimer,
  updateHUDAirports,
  updateHUDCity,
  setLocalTimezone,
  showSignalLost,
  updateHUDSky,
} from "./ui/hud.js";
import { initATC, setATCAirport, armATCAutoplay } from "./ui/atc.js";
import {
  showDetail,
  closeDetail,
  refreshDetail,
  startDetailRotor,
  getSelectedAircraft,
  showDetailLoading,
  reseedChartData,
  offerNaming,
  setCommonsPlace,
  onNamed,
} from "./ui/detail.js";
import { ghostRecord, ghostContact, refreshIndex, nameFor, myNames, myNameCount, indexSize, sinceWords } from "./ui/commons.js";
import { toggleAmbience, updateAmbience, initAmbience } from "./ui/ambience.js";
// Cockpit HUD — lazy-loaded, only needed when user presses V in follow mode
let _cockpitMod = null;
async function _getCockpit() {
  if (!_cockpitMod) _cockpitMod = await import("./ui/cockpit.js");
  return _cockpitMod;
}
// Data modules lazy-loaded — not needed for first render
let _airlineDbMod = null;
import("./data/airlineDb.js").then((m) => {
  _airlineDbMod = m;
});
function _getAirlineName(code) {
  return _airlineDbMod ? _airlineDbMod.getAirlineName(code) : "";
}

let _triggerInference = null;
import("./data/routeInfer.js").then(({ initRouteInfer, triggerInference }) => {
  _triggerInference = triggerInference;
  window._initRouteInfer = () =>
    initRouteInfer(window._CITIES, window._AIRPORT_DATA);
  window.dispatchEvent(new Event("routeInferReady"));
});

// citiesExtra lazy-loaded — extra globe density, not needed on first render
import("./data/citiesExtra.js").then(({ CITIES_EXTRA }) => {
  if (!CITIES_EXTRA?.length) return;
  const existing = new Set(CITIES.map((c) => c.code));
  for (const c of CITIES_EXTRA) {
    if (!existing.has(c.code)) {
      CITIES.push(c);
      existing.add(c.code);
    }
  }
  window._CITIES = CITIES;
});
import { initAirportCities } from "./data/airportCities.js";
import {
  fetchWeather,
  weatherDescription,
  windDirToCardinal,
  formatVisibility,
  weatherIcon,
  flightCategory,
  computeDensityAltitude,
  estimateTurbulence,
} from "./data/weather.js";
// Radio lazy-loaded — only needed when user first opens it
let _radioMod = null;
async function _getRadio() {
  if (!_radioMod) _radioMod = await import("./ui/radio.js");
  return _radioMod;
}

// --- Cinematic post-processing shader ---
const CinematicShader = {
  name: "CinematicShader",
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2() },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
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

      // Vignette — darken edges
      float vig = smoothstep(0.7, 0.2, d);
      color *= mix(0.55, 1.0, vig);

      // Horizon fog vignette — fade to sky/fog color at screen edges
      // Uses rectangular distance (max of x,y offset) for sharp corner fog
      vec2 edgeDist = abs(uv - 0.5) * 2.0; // 0 at center, 1 at edge
      float edgeMax = max(edgeDist.x, edgeDist.y);
      float fogMask = smoothstep(0.55, 1.0, edgeMax);
      vec3 fogColor = vec3(0.008, 0.032, 0.068);
      color = mix(color, fogColor, fogMask * fogMask);

      // Film grain
      float grain = hash(uv * resolution + fract(time * 43.7) * 1000.0);
      color += (grain - 0.5) * 0.025;

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `,
};

// --- Scene setup ---
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Exposed for measurement: the render resolution is the single biggest lever
// on a scene with a post chain, and it can only be compared honestly by
// changing it inside one session rather than across reloads.
window._renderer = renderer;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x09090c, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x09090c, 0.008);

// --- Post-processing (lazy-loaded after first render) ---
let composer = null;
let bloomPass = null;
let colorGradePass = null;

async function _initPostProcessing() {
  const [
    { EffectComposer },
    { RenderPass },
    { UnrealBloomPass },
    { OutputPass },
    { ShaderPass },
  ] = await Promise.all([
    import("three/addons/postprocessing/EffectComposer.js"),
    import("three/addons/postprocessing/RenderPass.js"),
    import("three/addons/postprocessing/UnrealBloomPass.js"),
    import("three/addons/postprocessing/OutputPass.js"),
    import("three/addons/postprocessing/ShaderPass.js"),
  ]);
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth * 0.4, window.innerHeight * 0.4),
    0.55,
    0.35,
    0.85,
  );
  composer.addPass(bloomPass);
  colorGradePass = new ShaderPass(CinematicShader);
  colorGradePass.uniforms.resolution.value.set(
    window.innerWidth,
    window.innerHeight,
  );
  composer.addPass(colorGradePass);
  composer.addPass(new OutputPass());
  composer.setSize(window.innerWidth, window.innerHeight);
}
_initPostProcessing();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.set(0, 35, 0.1);
camera.lookAt(0, 0, 0);

// --- Controls ---
const controls = new OrbitControls(camera, canvas);
setViewCamera(camera);
controls.enableDamping = true;
controls.dampingFactor = 0.09;
controls.target.set(0, 0, 0);
controls.minDistance = 0.05;
// 60 let the airspace shrink to a smudge with nothing readable in it, and with
// no lower polar bound you could also rise to a flat overhead plan view, which
// throws away the one thing a 3D map has: altitude you can see. 40 keeps the
// whole ring in frame at its widest, and 24 degrees off vertical keeps the sky
// a volume rather than a diagram. The opening descent starts inside 40 on
// purpose -- OrbitControls.update() clamps distance even while disabled, so a
// start beyond this would be yanked in on the first frame.
controls.maxDistance = 40;
controls.minPolarAngle = (24 * Math.PI) / 180;
controls.maxPolarAngle = Math.PI / 2 - (20 * Math.PI) / 180;
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
const speedLinesEl = document.getElementById("speed-lines");

let followTarget = null;
let followVelocity = new THREE.Vector3();
let focusCamVelocity = new THREE.Vector3();
let focusGoalDir = null;
let focusZooming = false;

const followIndicator = document.getElementById("follow-indicator");
// TCAS traffic is on demand: it opens while the tracking pill or the panel
// itself is hovered, and closes a beat after the pointer leaves both.
let _tcasCloseTimer = null;
function _tcasOpen() {
  clearTimeout(_tcasCloseTimer);
  if (_tcasEl) _tcasEl.classList.add("is-open");
}
function _tcasScheduleClose() {
  clearTimeout(_tcasCloseTimer);
  _tcasCloseTimer = setTimeout(() => _tcasEl?.classList.remove("is-open"), 250);
}
if (followIndicator) {
  followIndicator.addEventListener("mouseenter", _tcasOpen);
  followIndicator.addEventListener("mouseleave", _tcasScheduleClose);
}
const followCallsignEl = document.getElementById("follow-callsign");

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
    _syncFollowPill();
    followIndicator.classList.remove("hidden");
  }
}

// The pill names what the camera follows. While the ghost layer is on and the
// aircraft asked not to be shown, it says so instead of the name.
function _syncFollowPill() {
  if (!followIndicator || !followTarget) return;
  const d = followTarget.getDisplayData();
  const withheld = isGhostMode() && followTarget.data && followTarget.data.masked;
  const given = withheld ? nameFor(followTarget.data.icao24) : null;
  followCallsignEl.textContent = withheld
    ? (given ? given.toUpperCase() : "UNSEEN")
    : (d.callsign || d.icao24);
}

function stopFollow() {
  followTarget = null;
  focusZooming = false;
  if (followIndicator) followIndicator.classList.add("hidden");
  // Hide cockpit HUD when follow ends
  if (_cockpitMod) _cockpitMod.hideCockpitHUD();
}

const _fPrevTarget = new THREE.Vector3();
const _fTargetDelta = new THREE.Vector3();
const _fGoalCamPos = new THREE.Vector3();

function updateFollow(delta) {
  if (!followTarget || followTarget.removed) {
    stopFollow();
    return;
  }
  const aircraftPos = followTarget.group.position;

  _fPrevTarget.copy(controls.target);
  smoothDampVec3(
    controls.target,
    aircraftPos,
    followVelocity,
    FOLLOW_SMOOTH_TIME,
    delta,
  );
  _fTargetDelta.subVectors(controls.target, _fPrevTarget);

  if (focusZooming) {
    _fGoalCamPos
      .copy(aircraftPos)
      .addScaledVector(focusGoalDir, FOLLOW_ZOOM_DIST);
    smoothDampVec3(
      camera.position,
      _fGoalCamPos,
      focusCamVelocity,
      FOCUS_CAM_SMOOTH_TIME,
      delta,
    );
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
let cameraHeading = 0;
const _compassDir = new THREE.Vector3();

let _lastCompassUpdate = 0;
function updateCompass(elapsed) {
  // Throttle to ~10 Hz — compass doesn't need 60fps updates
  if (elapsed - _lastCompassUpdate < 0.1) return;
  _lastCompassUpdate = elapsed;
  camera.getWorldDirection(_compassDir);
  cameraHeading = Math.atan2(_compassDir.x, _compassDir.z);
  const deg = ((-cameraHeading * 180) / Math.PI + 360) % 360;
  const rounded = Math.round(deg);
  // Skip DOM writes if heading unchanged
  if (rounded === _lastCompassDeg) return;
  _lastCompassDeg = rounded;
  // Hidden touch: compass glows subtly when facing north (±15°)
  const compassEl = document.querySelector(".compass");
  if (compassEl) {
    const nearNorth = rounded <= 15 || rounded >= 345;
    compassEl.style.opacity = nearNorth ? "0.85" : "";
    compassEl.style.filter = nearNorth
      ? "drop-shadow(0 0 8px rgba(196, 160, 88, 0.3))"
      : "";
  }
}

// --- Environment ---
createEnvironment(scene);

// --- Ambient particles ---
const PARTICLE_COUNT = 200;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
const particleSpeeds = new Float32Array(PARTICLE_COUNT);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 60;
  particlePositions[i * 3 + 1] = Math.random() * 5;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  particleSpeeds[i] = 0.02 + Math.random() * 0.06;
}
particleGeo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(particlePositions, 3),
);
const particleMat = new THREE.PointsMaterial({
  color: 0xc4a058,
  size: 0.03,
  transparent: true,
  opacity: 0.1,
  depthWrite: false,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particleGeo, particleMat);
particles.renderOrder = 2000;
scene.add(particles);

// --- Starfield ---
const STAR_COUNT = 600;
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
starGeo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starPositions, 3),
);
starGeo.setAttribute("size", new THREE.Float32BufferAttribute(starSizes, 1));
const starMat = new THREE.PointsMaterial({
  color: 0xd0d8f0,
  size: 0.15,
  transparent: true,
  opacity: 0.4,
  depthWrite: false,
  sizeAttenuation: true,
  fog: false,
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
}

let pointerDownX = 0;
let pointerDownY = 0;
canvas.addEventListener(
  "pointerdown",
  (e) => {
    resetIdleTimer();
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
  },
  { passive: true },
);

// --- Aircraft hover tooltip ---
const tooltipEl = document.getElementById("aircraft-tooltip");

function showAircraftTooltip(data, x, y) {
  if (!tooltipEl) return;
  const callsign = data.callsign || data.icao24 || "";
  const type = data.aircraftType || "";
  const alt = data.altitude && data.altitude !== "--" ? data.altitude : "";
  // T1-12: Airline name from callsign prefix
  const airlineMatch = callsign.match(/^([A-Z]{2,3})\d/);
  const airlineName =
    data.routeAirline ||
    data.operator ||
    (airlineMatch ? _getAirlineName(airlineMatch[1]) : "");

  let html = `<span class="ttp-cs">${callsign}</span>`;
  if (airlineName)
    html += `<span class="ttp-sep">·</span><span class="ttp-type">${airlineName}</span>`;
  else if (type)
    html += `<span class="ttp-sep">·</span><span class="ttp-type">${type}</span>`;
  if (alt)
    html += `<span class="ttp-sep">·</span><span class="ttp-alt">${alt}</span>`;
  tooltipEl.innerHTML = html;

  const margin = 14;
  let tx = x + margin;
  let ty = y - 40;
  const vw = window.innerWidth,
    vh = window.innerHeight;
  if (tx + 220 > vw) tx = x - margin - 220;
  if (tx < 4) tx = 4;
  if (ty < 8) ty = y + margin + 4;
  if (ty + 60 > vh) ty = vh - 64;

  tooltipEl.style.transform = `translate(${tx}px, ${ty}px)`;
  tooltipEl.classList.remove("hidden");
}

function hideAircraftTooltip() {
  if (tooltipEl) tooltipEl.classList.add("hidden");
}

// --- Raycasting for hover + selection ---
const raycaster = new THREE.Raycaster();
const _aptCentre = new THREE.Vector3(); // scratch for airport hit-distance measurement
const pointer = new THREE.Vector2();
const _hoverPointer = new THREE.Vector2();
let _lastHoverTime = 0;

// UI panels that should block aircraft hover tooltips
const _uiPanelSelectors =
  ".detail-panel:not(.hidden), #hud, .search-bar, .help-panel:not(.hidden), .city-overlay:not(.hidden), .filter-panel:not(.hidden), .radio-panel:not(.hidden), .airline-deep.show, .fab-toolbar";
canvas.addEventListener("pointermove", (e) => {
  if (e.buttons > 0) resetIdleTimer();
  const now = performance.now();
  if (now - _lastHoverTime < 32) return;
  _lastHoverTime = now;

  // Hide tooltip when mouse is over any UI panel
  const elUnder = document.elementFromPoint(e.clientX, e.clientY);
  if (elUnder && elUnder !== canvas && elUnder.closest(_uiPanelSelectors)) {
    hideAircraftTooltip();
    canvas.style.cursor = "";
    return;
  }

  if (!aircraftManager) {
    hideAircraftTooltip();
    return;
  }

  _hoverPointer.set(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1,
  );
  raycaster.setFromCamera(_hoverPointer, camera);
  const hits = raycaster.intersectObjects(
    aircraftManager.raycasterTargets,
    false,
  );
  const aptTargets = getAirportHitTargets();
  const aptHits =
    aptTargets.length > 0 ? raycaster.intersectObjects(aptTargets, false) : [];

  if (hits.length > 0) {
    canvas.style.cursor = "pointer";
    _hideNavaidTooltip();
    const ac = aircraftManager.getByHitMesh(hits[0].object);
    if (ac) {
      showAircraftTooltip(ac.getDisplayData(), e.clientX, e.clientY);
    } else {
      hideAircraftTooltip();
    }
  } else if (aptHits.length > 0) {
    canvas.style.cursor = "pointer";
    hideAircraftTooltip();
    _hideRunwayTooltip();
    _hideNavaidTooltip();
  } else {
    // Check runway threshold targets
    const rwyTargets = getRunwayThresholdTargets();
    const rwyHits =
      rwyTargets.length > 0
        ? raycaster.intersectObjects(rwyTargets, false)
        : [];
    if (rwyHits.length > 0 && rwyHits[0].object.userData.runwayThreshold) {
      canvas.style.cursor = "pointer";
      hideAircraftTooltip();
      _hideNavaidTooltip();
      _showRunwayTooltip(
        rwyHits[0].object.userData.runwayThreshold,
        e.clientX,
        e.clientY,
      );
    } else {
      // Check navaid hit targets
      const navTargets = getNavHitTargets();
      const navHits =
        navTargets.length > 0
          ? raycaster.intersectObjects(navTargets, false)
          : [];
      if (navHits.length > 0 && navHits[0].object.userData.navaid) {
        canvas.style.cursor = "pointer";
        hideAircraftTooltip();
        _hideRunwayTooltip();
        _showNavaidTooltip(
          navHits[0].object.userData.navaid,
          e.clientX,
          e.clientY,
        );
      } else {
        canvas.style.cursor = "";
        hideAircraftTooltip();
        _hideRunwayTooltip();
        _hideNavaidTooltip();
        // FIR hover: raycast to ground and look up FIR
        _checkFIRHover();
      }
    }
  }
});

// ── Navaid Tooltip ──
const _navTooltip = document.getElementById("nav-tooltip");
let _navTooltipVisible = false;

function _showNavaidTooltip(info, mx, my) {
  if (!_navTooltip) return;
  let html = `<div><span class="nav-tooltip-ident">${info.ident}</span><span class="nav-tooltip-type">${info.type}</span></div>`;
  if (info.name) html += `<div class="nav-tooltip-name">${info.name}</div>`;
  const rows = [];
  if (info.freq) rows.push(["FREQ", info.freq]);
  rows.push(["POS", `${info.lat.toFixed(4)}, ${info.lon.toFixed(4)}`]);
  for (const [label, val] of rows) {
    html += `<div class="nav-tooltip-row"><span class="nav-tooltip-label">${label}</span><span class="nav-tooltip-val">${val}</span></div>`;
  }
  if (info.desc) html += `<div class="nav-tooltip-desc">${info.desc}</div>`;
  _navTooltip.innerHTML = html;
  _navTooltip.style.left = mx + 16 + "px";
  _navTooltip.style.top = my - 10 + "px";
  _navTooltip.classList.remove("hidden");
  _navTooltipVisible = true;
}

function _hideNavaidTooltip() {
  if (!_navTooltipVisible || !_navTooltip) return;
  _navTooltip.classList.add("hidden");
  _navTooltipVisible = false;
}

// ── Runway Threshold Tooltip ──
const _rwyTooltip = document.getElementById("rwy-tooltip");
let _rwyTooltipVisible = false;

function _showRunwayTooltip(info, mx, my) {
  if (!_rwyTooltip) return;
  const lengthFt = Math.round(info.length * 3.28084);
  const widthFt = Math.round(info.width * 3.28084);
  const hdg = String(info.heading).padStart(3, "0") + "\u00B0";
  const surfaceLabel = (info.surface || "unknown").replace(/_/g, " ");

  _rwyTooltip.innerHTML = `
    <div class="rwy-tooltip-desig">RWY ${info.designator}<small>${info.fullRef}</small></div>
    <div class="rwy-tooltip-row"><span class="rwy-tooltip-label">Heading</span><span class="rwy-tooltip-val">${hdg}</span></div>
    <div class="rwy-tooltip-row"><span class="rwy-tooltip-label">Length</span><span class="rwy-tooltip-val">${info.length.toLocaleString()}m / ${lengthFt.toLocaleString()}ft</span></div>
    <div class="rwy-tooltip-row"><span class="rwy-tooltip-label">Width</span><span class="rwy-tooltip-val">${info.width}m / ${widthFt}ft</span></div>
    <div class="rwy-tooltip-row"><span class="rwy-tooltip-label">Position</span><span class="rwy-tooltip-val">${info.lat.toFixed(4)}, ${info.lon.toFixed(4)}</span></div>
    <span class="rwy-tooltip-surface">${surfaceLabel}</span>
    <div class="rwy-tooltip-legend">threshold <i class="l-g"></i> · edge <i class="l-w"></i> last 600m <i class="l-y"></i> · end <i class="l-r"></i> · taxiway <i class="l-b"></i> · PAPI <i class="l-w"></i><i class="l-r"></i></div>
  `;
  _rwyTooltip.style.left = mx + 16 + "px";
  _rwyTooltip.style.top = my - 10 + "px";
  _rwyTooltip.classList.remove("hidden");
  _rwyTooltipVisible = true;
}

function _hideRunwayTooltip() {
  if (!_rwyTooltipVisible || !_rwyTooltip) return;
  _rwyTooltip.classList.add("hidden");
  _rwyTooltipVisible = false;
}

// FIR hover widget — fixed position, shows code + full name
const _firGroundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _firRayTarget = new THREE.Vector3();
let _firWidgetTimer = 0;
let _lastFIRId = "";

const FIR_NAMES = {
  // North America
  CZEG: "Edmonton FIR",
  CZUL: "Montreal FIR",
  CZWG: "Winnipeg FIR",
  CZVR: "Vancouver FIR",
  CZYZ: "Toronto FIR",
  CZQM: "Moncton FIR",
  CZZV: "Gander Domestic",
  CZQX: "Gander Oceanic",
  "CZQO-GOTA": "Gander Oceanic Transition",
  CZQO: "Gander Oceanic",
  KZAB: "Albuquerque ARTCC",
  KZBW: "Boston ARTCC",
  KZDC: "Washington ARTCC",
  KZDV: "Denver ARTCC",
  KZFW: "Fort Worth ARTCC",
  KZHU: "Houston ARTCC",
  KZID: "Indianapolis ARTCC",
  KZJX: "Jacksonville ARTCC",
  KZKC: "Kansas City ARTCC",
  KZLA: "Los Angeles ARTCC",
  KZMA: "Miami ARTCC",
  KZME: "Memphis ARTCC",
  KZMP: "Minneapolis ARTCC",
  KZNY: "New York ARTCC",
  KZOA: "Oakland ARTCC",
  KZOB: "Cleveland ARTCC",
  KZSE: "Seattle ARTCC",
  KZTL: "Atlanta ARTCC",
  KZAU: "Chicago ARTCC",
  KZLC: "Salt Lake ARTCC",
  MMFR: "Mexico FIR",
  MMTY: "Monterrey FIR",
  MMEX: "Mexico City FIR",
  MMZT: "Mazatlan FIR",
  MMMR: "Merida FIR",
  TJZS: "San Juan FIR",
  PHZH: "Honolulu FIR",
  PAZA: "Anchorage FIR",
  // Europe — UK/Ireland
  EGTT: "London FIR",
  EGPX: "Scottish FIR",
  EGTM: "London Mil",
  EGTL: "London Mil Low",
  EGVV: "London Mil Upper",
  "EGTT-N": "London North",
  "EGTT-W": "London West",
  "EGTT-S": "London South",
  "EGTT-C": "London Central",
  "EGTT-SC": "London South Central",
  "EGPX-E": "Scottish East",
  "EGPX-D": "Scottish Deconfliction",
  "EGPX-W": "Scottish West",
  "EGPX-WD": "Scottish West Deconfliction",
  "EGPX-R": "Scottish Radar",
  EICK: "Shannon FIR",
  EISN: "Shannon Oceanic",
  // Europe — Nordics
  EFIN: "Finland FIR",
  EKDK: "Copenhagen FIR",
  EKAC: "Copenhagen ACC",
  EKVG: "Faroe FIR",
  EETT: "Tallinn FIR",
  BIRD: "Reykjavik FIR",
  "BIRD-E": "Reykjavik East",
  "BIRD-N": "Reykjavik North",
  "BIRD-S": "Reykjavik South",
  "BIRD-W": "Reykjavik West",
  ENOR: "Norway FIR",
  ENOS: "Stavanger FIR",
  ESAA: "Sweden FIR",
  // Europe — Western
  LFPG: "Paris FIR",
  LFRR: "Brest FIR",
  LFEE: "Reims FIR",
  LFBB: "Bordeaux FIR",
  LFMA: "Marseille FIR",
  LFIR: "Paris UIR",
  LFBD: "Bordeaux Approach",
  "LFPG-N": "Paris North",
  "LFPG-S": "Paris South",
  "LFPG-E": "Paris East",
  "LFPG-W": "Paris West",
  EBBU: "Brussels FIR",
  EHAA: "Amsterdam FIR",
  EHAM: "Amsterdam ACC",
  ELLX: "Luxembourg FIR",
  LSAS: "Switzerland FIR",
  LOVV: "Vienna FIR",
  // Europe — Central/Southern
  EDWW: "Bremen FIR",
  EDGG: "Langen FIR",
  EDMM: "Munich FIR",
  "EDWW-A": "Bremen Sector A",
  "EDWW-B": "Bremen Sector B",
  "EDGG-P": "Langen Paderborn",
  "EDGG-R": "Langen Rhein",
  "EDGG-K": "Langen Koblenz",
  "EDGG-D": "Langen Dusseldorf",
  "EDGG-G": "Langen Giessen",
  "EDGG-B": "Langen Baden",
  "EDMM-G": "Munich Sector G",
  "EDMM-Z": "Munich Sector Z",
  "EDMM-R": "Munich Sector R",
  LKAA: "Prague FIR",
  LKPR: "Prague ACC",
  LHCC: "Budapest FIR",
  LYBE: "Belgrade FIR",
  LJLA: "Ljubljana FIR",
  LQNM: "Sarajevo FIR",
  LIRF: "Rome FIR",
  LIRN: "Naples FIR",
  LIRR: "Rome ACC",
  LIRS: "Rome Sector S",
  LPPC: "Lisbon FIR",
  LECM: "Madrid FIR",
  LECB: "Barcelona FIR",
  GCCC: "Canary FIR",
  LGGG: "Athens FIR",
  LBSR: "Sofia FIR",
  LRBB: "Bucharest FIR",
  // Europe — Turkey
  LTAC: "Ankara FIR",
  LTBB: "Istanbul FIR",
  LTCC: "Erzurum FIR",
  LTAV: "Ankara ACC",
  // Europe — Eastern
  LUUU: "Chisinau FIR",
  UKBV: "Kyiv FIR",
  UKDV: "Dnipro FIR",
  UKLV: "Lviv FIR",
  UKOV: "Odesa FIR",
  EPWW: "Warsaw FIR",
  UMGG: "Minsk FIR",
  UUWW: "Moscow FIR",
  URRR: "Rostov FIR",
  UWKK: "Samara FIR",
  USSF: "Yekaterinburg FIR",
  USDD: "Tyumen FIR",
  UNAA: "Novosibirsk FIR",
  UNMM: "Krasnoyarsk FIR",
  UHCC: "Khabarovsk FIR",
  UHKK: "Magadan FIR",
  UJDA: "Yakutsk FIR",
  // Africa
  DAAA: "Algiers FIR",
  DTTC: "Tunis FIR",
  DGAC: "Accra FIR",
  DIII: "Abidjan FIR",
  DNKK: "Kano FIR",
  DRRR: "Niamey FIR",
  GOOO: "Dakar FIR",
  FAJA: "Johannesburg FIR",
  HKNA: "Nairobi FIR",
  HTDC: "Dar es Salaam FIR",
  HSSS: "Khartoum FIR",
  HECC: "Cairo FIR",
  HLLL: "Tripoli FIR",
  FCCC: "Brazzaville FIR",
  FZZA: "Kinshasa FIR",
  // Middle East
  OIIX: "Tehran FIR",
  OJAC: "Amman FIR",
  OKAC: "Kuwait FIR",
  OLBA: "Beirut FIR",
  ORBB: "Baghdad FIR",
  OSTT: "Damascus FIR",
  OTBD: "Doha FIR",
  OMAE: "Emirates FIR",
  OEJD: "Jeddah FIR",
  OERK: "Riyadh FIR",
  OYSC: "Sanaa FIR",
  OOMM: "Muscat FIR",
  // Asia — South/Southeast
  VABF: "Mumbai FIR",
  VECF: "Kolkata FIR",
  VIDF: "Delhi FIR",
  VOMF: "Chennai FIR",
  VYYF: "Yangon FIR",
  VTBB: "Bangkok FIR",
  VDPP: "Phnom Penh FIR",
  VLVT: "Vientiane FIR",
  VVHM: "Ho Chi Minh FIR",
  VVHN: "Hanoi FIR",
  WMKK: "Kuala Lumpur FIR",
  WSJC: "Singapore FIR",
  WIIF: "Jakarta FIR",
  RPHI: "Manila FIR",
  // Asia — East
  VHHH: "Hong Kong FIR",
  ZGZU: "Guangzhou FIR",
  ZPKM: "Kunming FIR",
  ZLHW: "Lanzhou FIR",
  ZBPE: "Beijing FIR",
  ZSHA: "Shanghai FIR",
  ZWUQ: "Urumqi FIR",
  ZHWH: "Wuhan FIR",
  ZSPD: "Shanghai Pudong",
  RKRR: "Incheon FIR",
  RJJJ: "Fukuoka FIR",
  RJTG: "Tokyo FIR",
  // Oceania
  AGGG: "Honiara FIR",
  ANAU: "Nauru FIR",
  AYPM: "Port Moresby FIR",
  NZZO: "Auckland Oceanic",
  NZZC: "New Zealand FIR",
  YMMM: "Melbourne FIR",
  YBBB: "Brisbane FIR",
  // South America
  SBCW: "Curitiba FIR",
  SBRE: "Recife FIR",
  SBAZ: "Amazonica FIR",
  SBBS: "Brasilia FIR",
  SCEL: "Santiago FIR",
  SGFA: "Asuncion FIR",
  SUEO: "Montevideo FIR",
  SAEF: "Buenos Aires FIR",
  SACF: "Cordoba FIR",
  SAMF: "Mendoza FIR",
  SPIM: "Lima FIR",
  SKED: "Bogota FIR",
  SVZM: "Maiquetia FIR",
  SEQM: "Quito FIR",
  // Caribbean
  MKJK: "Kingston FIR",
  MUFH: "Havana FIR",
  MDCS: "Santo Domingo FIR",
  TTZP: "Piarco FIR",
  // Oceanic
  BGGL: "Greenland FIR",
  LPPO: "Santa Maria Oceanic",
  NATL: "North Atlantic",
};

function _getFIRName(id) {
  if (FIR_NAMES[id]) return FIR_NAMES[id];
  // Try base code (strip sector suffix like -N, -E, etc.)
  const base = id.replace(/-.*$/, "");
  if (FIR_NAMES[base]) return FIR_NAMES[base];
  return "Flight Information Region";
}

function _checkFIRHover() {
  raycaster.ray.intersectPlane(_firGroundPlane, _firRayTarget);
  if (!_firRayTarget) return;
  const geo = sceneToGeo(_firRayTarget.x, _firRayTarget.z);
  const firId = getFIRForPosition(geo.lat, geo.lon);
  if (!firId || firId === _lastFIRId) return;
  _lastFIRId = firId;
  _showFIRWidget(firId);
}

function _showFIRWidget(firId) {
  let el = document.getElementById("fir-hover");
  if (!el) {
    el = document.createElement("div");
    el.id = "fir-hover";
    el.className = "fir-hover-widget";
    document.body.appendChild(el);
  }
  el.innerHTML = `<span class="fir-code">${firId}</span><span class="fir-name">${_getFIRName(firId)}</span>`;
  el.classList.remove("fade-out");
  el.style.opacity = "1";
  clearTimeout(_firWidgetTimer);
  _firWidgetTimer = setTimeout(() => {
    el.classList.add("fade-out");
    _lastFIRId = "";
  }, 5000);
}

canvas.addEventListener(
  "wheel",
  () => {
    resetIdleTimer();
  },
  { passive: true },
);

let selectedAirportState = null;

function handleAircraftSelect(ac) {
  _clearHoldingOval(); // A-3: clear previous holding oval
  const { lat, lon } = getUserLocation();
  if (_triggerInference) _triggerInference(ac.data.icao24, ac.data.callsign);
  // A-3: detect holding pattern from trail
  const isHolding = _detectHoldingFromTrail(ac.trailPositions);
  ac.data.isHolding = isHolding;
  if (isHolding) _renderHoldingOval(ac);
  showDetail(ac, lat, lon);
  _recordContact(ac);
  // T3-13: Add to flight history
  addToHistory(ac.getDisplayData());
  aircraftManager.selectAircraft(ac);
  flyToThenFollow(ac);
  // Draw route arc immediately if origin/destination already known (pre-seeded from ADS-B feed)
  removeRouteArc(scene);
  const _d0 = ac.getDisplayData();
  if (_d0.origin && _d0.destination) {
    const _o0 = window._findCityByCode?.(_d0.origin);
    const _x0 = window._findCityByCode?.(_d0.destination);
    if (_o0 && _x0)
      createRouteArc(scene, _o0.lat, _o0.lon, _x0.lat, _x0.lon, lat, lon);
  }

  // Worker-powered parallel enrichment: trace + route + hex detail in ONE round-trip
  showDetailLoading(true);
  enrichAircraft(ac.data.icao24, ac.data.callsign).then(() => {
    showDetailLoading(false);
    reseedChartData(); // Immediately load trace data into speed/alt charts
    refreshDetail(aircraftManager, lat, lon);
    // T3-01: Redraw route arc with enriched data (may have updated origin/dest)
    const d = ac.getDisplayData();
    if (d.origin && d.destination) {
      const origApt =
        typeof window._findCityByCode === "function"
          ? window._findCityByCode(d.origin)
          : null;
      const destApt =
        typeof window._findCityByCode === "function"
          ? window._findCityByCode(d.destination)
          : null;
      if (origApt && destApt) {
        removeRouteArc(scene);
        createRouteArc(
          scene,
          origApt.lat,
          origApt.lon,
          destApt.lat,
          destApt.lon,
          lat,
          lon,
        );
      }
    }
  });
  if (selectedAirportState) {
    deselectAirport(scene);
    aircraftManager.clearFilter();
    aircraftManager.clearHighlight();
    hideAirportWidget();
    selectedAirportState = null;
  }
}

function raycastAircraft(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(
    aircraftManager.raycasterTargets,
    false,
  );
  if (hits.length === 0) return null;
  for (const hit of hits) {
    const ac = aircraftManager.getByHitMesh(hit.object);
    if (ac && ac !== followTarget) return ac;
  }
  return aircraftManager.getByHitMesh(hits[0].object);
}

let _clickTimer = null;
let _dblClickGuard = false;

canvas.addEventListener("click", (e) => {
  if (!aircraftManager) return;
  const dx = e.clientX - pointerDownX;
  const dy = e.clientY - pointerDownY;
  if (dx * dx + dy * dy > 100) return;
  if (_dblClickGuard) return;

  // Cache event data — the event won't survive the timeout
  const cx = e.clientX,
    cy = e.clientY,
    shift = e.shiftKey;

  // Delay single-click to avoid conflict with dblclick
  clearTimeout(_clickTimer);
  _clickTimer = setTimeout(() => {
    if (_dblClickGuard || !aircraftManager) return;

    pointer.x = (cx / window.innerWidth) * 2 - 1;
    pointer.y = -(cy / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    // Check both aircraft and airport hits, pick the best one
    const hits = raycaster.intersectObjects(
      aircraftManager.raycasterTargets,
      false,
    );
    const aptTargets = getAirportHitTargets();
    const aptIntersects =
      aptTargets.length > 0 ? raycaster.intersectObjects(aptTargets) : [];

    let ac = null,
      acDist = Infinity;
    if (hits.length > 0) {
      for (const hit of hits) {
        const a = aircraftManager.getByHitMesh(hit.object);
        if (a && a !== followTarget) {
          ac = a;
          acDist = hit.distance;
          break;
        }
      }
      if (!ac && hits[0]) {
        ac = aircraftManager.getByHitMesh(hits[0].object);
        acDist = hits[0].distance;
      }
    }

    let airport = null,
      aptDist = Infinity;
    if (aptIntersects.length > 0 && aptIntersects[0].object.userData.airport) {
      airport = aptIntersects[0].object.userData.airport;
      // Measure to the marker's centre, not to where the ray entered its hit
      // volume. That volume is a 4.5-unit sphere — roughly 12km across the ground
      // and far above cruise altitude — so any aircraft near the field is inside
      // it, and the sphere's near surface always reported closer than the aircraft.
      aptDist = aptIntersects[0].object
        .getWorldPosition(_aptCentre)
        .distanceTo(raycaster.ray.origin);
    }

    // Both hit: the aircraft is a 0.5-unit target the pointer is genuinely over,
    // the airport is a broad catch-all, so the airport only wins when it is clearly
    // in front rather than merely enclosing the aircraft.
    if (ac && airport) {
      if (aptDist < acDist * 0.8) {
        closeDetail();
        handleAirportClick(airport);
        return;
      }
      if (shift) {
        toggleComparison(ac);
        return;
      }
      handleAircraftSelect(ac);
      return;
    }

    if (ac) {
      if (shift) {
        toggleComparison(ac);
        return;
      }
      handleAircraftSelect(ac);
      return;
    }

    if (airport) {
      closeDetail();
      handleAirportClick(airport);
      return;
    }

    closeDetail();
    if (aircraftManager) aircraftManager.deselectAircraft();
    stopFollow();
    removeRouteArc(scene);
    if (selectedAirportState) {
      deselectAirport(scene);
      aircraftManager.clearFilter();
      aircraftManager.clearHighlight();
      hideAirportWidget();
      selectedAirportState = null;
    }
  }, 220);
});

// T1-06: Double-click — select aircraft or reset camera on empty space
canvas.addEventListener("dblclick", (e) => {
  if (!aircraftManager) return;
  e.preventDefault();
  clearTimeout(_clickTimer);
  _dblClickGuard = true;
  setTimeout(() => {
    _dblClickGuard = false;
  }, 300);

  const ac = raycastAircraft(e);
  if (ac) {
    handleAircraftSelect(ac);
    return;
  }
  // Reset camera to default cinematic position
  stopFollow();
  closeDetail();
  aircraftManager.deselectAircraft();
  const resetTarget = { x: 0, y: 1, z: 0 };
  const resetCam = { x: 8, y: 9, z: 12 };
  const startT = { ...controls.target };
  const startC = { ...camera.position };
  let progress = 0;
  function animateReset() {
    progress += 0.025;
    const t = easeOutExpo(Math.min(progress, 1));
    camera.position.set(
      startC.x + (resetCam.x - startC.x) * t,
      startC.y + (resetCam.y - startC.y) * t,
      startC.z + (resetCam.z - startC.z) * t,
    );
    controls.target.set(
      startT.x + (resetTarget.x - startT.x) * t,
      startT.y + (resetTarget.y - startT.y) * t,
      startT.z + (resetTarget.z - startT.z) * t,
    );
    controls.update();
    if (progress < 1) requestAnimationFrame(animateReset);
  }
  animateReset();
});

// T1-15: Right-click deselect
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (!aircraftManager) return;
  closeDetail();
  aircraftManager.deselectAircraft();
  stopFollow();
  if (selectedAirportState) {
    deselectAirport(scene);
    aircraftManager.clearFilter();
    aircraftManager.clearHighlight();
    hideAirportWidget();
    selectedAirportState = null;
  }
});

// Cached airport widget element refs — queried once, reused on every selection
const _aw = {};
function _awEl(id) {
  return _aw[id] || (_aw[id] = document.getElementById(id));
}

function showAirportWidget(airport, arrivals, departures) {
  const w = _awEl("airport-widget");
  if (!w) return;
  const code = airport.iata || airport.icao || "---";
  _awEl("aw-iata").textContent = code;
  _awEl("aw-icao").textContent = airport.icao || "";
  _awEl("aw-name").textContent = airport.name || code;
  _awEl("aw-arrivals").textContent = arrivals.length;
  _awEl("aw-departures").textContent = departures.length;

  // Lookup rich data from AIRPORT_DATA
  const meta = typeof AIRPORT_DATA !== "undefined" ? AIRPORT_DATA[code] : null;
  _awEl("aw-elev").textContent =
    meta?.elev != null ? `${meta.elev.toLocaleString()} ft` : "--";
  _awEl("aw-rwys").textContent = meta?.rwys ?? "--";

  // Extended airport widget data
  const awHub = _awEl("aw-hub");
  if (awHub) awHub.textContent = meta?.hub || "--";
  const awPax = _awEl("aw-pax");
  if (awPax) awPax.textContent = meta?.pax != null ? `${meta.pax}M` : "--";

  const lat = airport.lat,
    lon = airport.lon;
  if (lat != null && lon != null) {
    const la = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
    const lo = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
    _awEl("aw-coord").textContent = `${la}  ${lo}`;
  } else {
    _awEl("aw-coord").textContent = "--";
  }

  // Tower frequency (approximate from airport data if available)
  _awEl("aw-freq").textContent = meta?.icao
    ? `${meta.icao} TWR`
    : `${code} INFO`;

  const factEl = _awEl("aw-fact");
  if (factEl) {
    if (meta?.fact) {
      factEl.textContent = meta.fact;
      factEl.classList.remove("hidden");
    } else factEl.classList.add("hidden");
  }

  // The city blurb ("a vertical metropolis of Broadway theaters...") is travel
  // copy, and it rendered truncated mid-sentence. It still belongs in the picker,
  // where you are choosing where to go; over the live map it is filler. The
  // aviation fact above it stays.
  _awEl("aw-desc")?.classList.add("hidden");

  // B-4: Arrival Sequencing Queue — sorted by distance to airport, with ETA
  let flightListEl = document.getElementById("aw-flight-list");
  if (!flightListEl) {
    flightListEl = document.createElement("div");
    flightListEl.id = "aw-flight-list";
    flightListEl.className = "aw-flight-list";
    w.appendChild(flightListEl);
  }
  const aptLat = airport.lat,
    aptLon = airport.lon;
  // Sort arrivals by distance to airport (closest = #1)
  const arrWithDist = arrivals
    .map((ac) => {
      const distKm =
        aptLat != null && ac.data?.latitude != null
          ? haversineDistance(
              ac.data.latitude,
              ac.data.longitude,
              aptLat,
              aptLon,
            )
          : Infinity;
      const distNm = distKm < Infinity ? Math.round(distKm * 0.539957) : null;
      const gsKts =
        ac.data?.velocity != null
          ? Math.round(ac.data.velocity * 1.94384)
          : null;
      const etaMin =
        distNm != null && gsKts != null && gsKts > 30
          ? Math.round((distNm / gsKts) * 60)
          : null;
      return { ac, distNm, etaMin, tag: "arr" };
    })
    .sort((a, b) => (a.distNm ?? Infinity) - (b.distNm ?? Infinity));

  const depItems = departures.map((ac) => ({
    ac,
    distNm: null,
    etaMin: null,
    tag: "dep",
  }));
  const allItems = [...arrWithDist, ...depItems].slice(0, 20);

  // Every row carried an ARR or DEP tag, but the list is already sorted with all
  // arrivals first, so twenty rows repeated two words. Two headers say it once,
  // and the list gains the name it never had.
  const _row = (item, i) => {
    const cs = item.ac.callsign || item.ac.icao24;
    const rank = item.tag === "arr" ? `#${i + 1} ` : "";
    const dist = item.distNm != null ? ` · ${item.distNm}nm` : "";
    const eta = item.etaMin != null ? ` · ${item.etaMin}min` : "";
    return `<div class="aw-flight-item" data-icao="${item.ac.icao24}"><span>${rank}${cs}</span><span class="aw-flight-meta">${(dist + eta).replace(/^ · /, "")}</span></div>`;
  };
  const _arr = allItems.filter((it) => it.tag === "arr");
  const _dep = allItems.filter((it) => it.tag === "dep");
  flightListEl.innerHTML =
    (_arr.length
      ? `<div class="aw-flight-head">↓ Arriving</div>${_arr.map(_row).join("")}`
      : "") +
    (_dep.length
      ? `<div class="aw-flight-head">↑ Departing</div>${_dep.map(_row).join("")}`
      : "");

  // ATC spacing education note
  let seqEduEl = document.getElementById("aw-seq-edu");
  if (!seqEduEl) {
    seqEduEl = document.createElement("div");
    seqEduEl.id = "aw-seq-edu";
    seqEduEl.className = "aw-seq-edu";
    flightListEl.insertAdjacentElement("afterend", seqEduEl);
  }
  if (arrivals.length >= 2) {
    seqEduEl.textContent =
      "ATC spacing: heavy/heavy 6nm · heavy/medium 5nm · medium/light 4nm (wake turbulence)";
    seqEduEl.style.display = "";
  } else {
    seqEduEl.style.display = "none";
  }

  flightListEl.querySelectorAll(".aw-flight-item").forEach((el) => {
    el.addEventListener("click", () => {
      if (!aircraftManager) return;
      const ac = aircraftManager.aircraft.get(el.dataset.icao);
      if (ac && !ac.fadingOut) handleAircraftSelect(ac);
    });
  });

  // ── Wind Advisor ──
  _renderWindAdvisor(airport, w);

  w.classList.remove("hidden");
}

// ── Runway Wind Advisor ──
// Shows headwind/crosswind analysis for each runway strip at the selected airport.
function _renderWindAdvisor(airport, container) {
  let el = document.getElementById("aw-wind-advisor");
  if (!el) {
    el = document.createElement("div");
    el.id = "aw-wind-advisor";
    el.style.cssText =
      "margin-top:10px;padding:10px 16px 14px;border-top:1px solid rgba(255,255,255,0.04)";
    container.appendChild(el);
  }

  const wx = window._cachedWeather;
  if (!wx || wx.windSpeed == null || wx.windDir == null) {
    el.innerHTML = "";
    return;
  }

  const data = getAirportData();
  const aptRunways = (data?.runways || []).filter((r) => {
    const rlat = r.lat ?? (r.startLat + r.endLat) / 2;
    const rlon = r.lon ?? (r.startLon + r.endLon) / 2;
    return Math.hypot(rlat - airport.lat, rlon - airport.lon) < 0.05;
  });
  if (!aptRunways.length) {
    el.innerHTML = "";
    return;
  }

  const windSpd = wx.windSpeed; // already in kt (converted in weather.js)
  const windDir = wx.windDir;
  const windCard = windDirToCardinal(windDir);

  // For each runway strip: pick the better of the two directions
  const seen = new Set();
  const strips = aptRunways
    .map((rwy) => {
      const refs = (rwy.ref || "")
        .split("/")
        .map((s) => s.trim())
        .filter(Boolean);
      const hdg1 = rwy.heading || 0;
      const ang1 = ((windDir - hdg1 + 540) % 360) - 180; // [-180, 180]
      const hw1 = windSpd * Math.cos((ang1 * Math.PI) / 180);
      const xw = Math.abs(windSpd * Math.sin((ang1 * Math.PI) / 180));
      const hdg2 = (hdg1 + 180) % 360;
      return hw1 >= 0
        ? {
            ref: refs[0] || String(Math.round(hdg1 / 10)).padStart(2, "0"),
            headwind: hw1,
            crosswind: xw,
          }
        : {
            ref:
              refs[1] ||
              refs[0] ||
              String(Math.round(hdg2 / 10)).padStart(2, "0"),
            headwind: -hw1,
            crosswind: xw,
          };
    })
    .filter((s) => {
      if (seen.has(s.ref)) return false;
      seen.add(s.ref);
      return true;
    });

  strips.sort((a, b) => b.headwind - a.headwind);
  const best = strips[0];

  const rows = strips
    .map((s, i) => {
      const isBest = i === 0 && s.headwind > 1;
      const hwColor =
        s.headwind >= 5
          ? "rgba(90,200,90,0.9)"
          : s.headwind >= 0
            ? "rgba(200,200,90,0.8)"
            : "rgba(200,90,90,0.7)";
      const xwColor =
        s.crosswind < 10
          ? "rgba(255,255,255,0.5)"
          : s.crosswind < 20
            ? "rgba(200,180,90,0.8)"
            : "rgba(220,90,90,0.8)";
      const mark = isBest
        ? '<span class="aw-wind-mark aw-wind-mark--ok">✓</span>'
        : '<span class="aw-wind-mark">·</span>';
      const hwLabel = `${Math.round(Math.abs(s.headwind))}kt HW`;
      return `<div class="aw-wind-row">
      <span class="aw-wind-cell aw-wind-cell--mark">${mark}</span>
      <span class="aw-wind-cell aw-wind-cell--ref">${s.ref}</span>
      <span class="aw-wind-cell aw-wind-cell--hw" style="color:${hwColor}">${hwLabel}</span>
      <span class="aw-wind-cell" style="color:${xwColor}">${Math.round(s.crosswind)}kt XW</span>
    </div>`;
    })
    .join("");

  const edu =
    best.crosswind > 20
      ? "High crosswind — pilots apply crosswind correction technique"
      : best.headwind < 2
        ? "Light winds — any runway usable; ATC optimizes traffic flow"
        : `RWY ${best.ref} preferred — headwind reduces ground roll & improves control`;

  // Wind direction compass (mini SVG arrow)
  const rad = ((windDir - 90) * Math.PI) / 180;
  const ax = (12 + Math.cos(rad) * 8).toFixed(1),
    ay = (12 + Math.sin(rad) * 8).toFixed(1);
  const bx = (12 - Math.cos(rad) * 8).toFixed(1),
    by = (12 - Math.sin(rad) * 8).toFixed(1);

  el.innerHTML = `
    <div class="aw-wind-title">Wind advisor</div>
    <div class="aw-wind-head">
      <svg viewBox="0 0 24 24" width="22" height="22" style="flex-shrink:0">
        <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="0.8"/>
        <line x1="${bx}" y1="${by}" x2="${ax}" y2="${ay}" stroke="rgba(90,160,255,0.75)" stroke-width="2" stroke-linecap="round"/>
        <circle cx="${ax}" cy="${ay}" r="2.5" fill="rgba(90,160,255,0.9)"/>
      </svg>
      <div>
        <div class="aw-wind-val">${Math.round(windDir)}° ${windCard} · ${Math.round(windSpd)}kt</div>
        <div class="aw-wind-sub">surface wind</div>
      </div>
    </div>
    ${rows}
    <div class="aw-wind-edu">${edu}</div>
  `;
}

function hideAirportWidget() {
  const w = document.getElementById("airport-widget");
  if (w) w.classList.add("hidden");
}

document.getElementById("aw-close")?.addEventListener("click", () => {
  hideAirportWidget();
  if (selectedAirportState) {
    deselectAirport(scene);
    aircraftManager?.clearFilter();
    aircraftManager?.clearHighlight();
    selectedAirportState = null;
  }
});

/** Build the set of aircraft related to an airport (for filtering) */
function _buildAirportRelatedSet(aptCodes, airport) {
  const relatedSet = new Set();
  if (!aircraftManager) return relatedSet;
  // Route data match: origin or destination = this airport
  for (const [, ac] of aircraftManager.aircraft) {
    const rc = ac.getRouteCodes();
    const orig = (rc.origin || "").toUpperCase();
    const dest = (rc.destination || "").toUpperCase();
    if (aptCodes.has(orig) || aptCodes.has(dest)) {
      relatedSet.add(ac.data.icao24);
    }
  }
  // Geometry: only aircraft < 5km (on this airport's runways/taxiways)
  for (const ac of lastRawData) {
    if (ac.latitude == null || ac.longitude == null) continue;
    if (
      haversineDistance(ac.latitude, ac.longitude, airport.lat, airport.lon) < 5
    ) {
      relatedSet.add(ac.icao24);
    }
  }
  return relatedSet;
}

function handleAirportClick(airport) {
  if (!aircraftManager) return;
  const data = getAirportData();
  if (!data) return;

  if (
    selectedAirportState &&
    selectedAirportState.iata === airport.iata &&
    selectedAirportState.icao === airport.icao
  ) {
    deselectAirport(scene);
    aircraftManager.clearFilter();
    aircraftManager.clearHighlight();
    hideAirportWidget();
    selectedAirportState = null;
    if (filterState.active && window._filterPanelRender) {
      filterState.isolate = false;
      filterState.airportMode = "ALL";
      window._filterPanelRender();
      applyFilters(lastRawData);
    }
    return;
  }

  selectedAirportState = airport;
  selectAirport(scene, airport);

  const aptCodes = new Set(
    [airport.iata, airport.icao].filter(Boolean).map((c) => c.toUpperCase()),
  );
  const relatedSet = _buildAirportRelatedSet(aptCodes, airport);

  const code = airport.iata || airport.icao;
  console.log(
    `[STRATUM] Airport filter: ${code} → ${relatedSet.size} related of ${aircraftManager.aircraft.size} total`,
  );

  // Filter: hide all unrelated aircraft
  aircraftManager.setFilter(relatedSet);
  if (relatedSet.size > 0) {
    aircraftManager.setHighlight(relatedSet);
  } else {
    aircraftManager.clearHighlight();
  }

  const { arrivals, departures } = categorizeFlights(
    lastRawData,
    airport,
    data.runways,
  );
  console.log(
    `[STRATUM] ${code}: ${arrivals.length} arrivals, ${departures.length} departures`,
  );
  showAirportWidget(airport, arrivals, departures);

  // Re-render filter panel if open
  if (filterState.active && window._filterPanelRender) {
    window._filterPanelRender();
    applyFilters(lastRawData);
  }
}

// --- Geolocation ---
function initLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 40.7128, lon: -74.006 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve({ lat: 40.7128, lon: -74.006 }),
      { timeout: 8000 },
    );
  });
}

// ── I1: Fleet Mix Statistics (data only — rendered inside Spotter Collection) ──
let _lastAirlineStats = {};
let _lastFleetMix = {
  NB: 0,
  WB: 0,
  RJ: 0,
  BJ: 0,
  total: 0,
  phases: {},
  altBuckets: {},
};

function updateFleetStats(dataList) {
  const airlines = {};
  const types = { NB: 0, WB: 0, RJ: 0, BJ: 0 };
  const phases = { GND: 0, CLB: 0, CRZ: 0, DES: 0 };
  const altBuckets = {};

  for (const ac of dataList) {
    if (ac.callsign) {
      const m = ac.callsign.match(/^([A-Z]{2,3})\d/);
      if (m) airlines[m[1]] = (airlines[m[1]] || 0) + 1;
    }
    const cat = classifyAircraftType(ac.aircraftType);
    if (cat === "narrow") types.NB++;
    else if (cat === "wideTwin" || cat === "wideQuad") types.WB++;
    else if (cat === "regional") types.RJ++;
    else if (cat === "bizjet") types.BJ++;

    const altFt = ac.baroAltitude != null ? ac.baroAltitude * 3.28084 : null;
    const vs = ac.verticalRate;
    if (ac.onGround) phases.GND++;
    else if (vs != null && vs > 1.5) phases.CLB++;
    else if (vs != null && vs < -1.5) phases.DES++;
    else phases.CRZ++;

    if (altFt != null && !ac.onGround) {
      const bucket = Math.floor(altFt / 5000) * 5;
      altBuckets[bucket] = (altBuckets[bucket] || 0) + 1;
    }
  }
  _lastAirlineStats = airlines;
  _lastFleetMix = { ...types, total: dataList.length, phases, altBuckets };
}

// --- Data handling ---
let lastRawData = [];

// The sky as people: seats by type where the type is known, a category-based
// guess where it is not (light aircraft carry a handful, airliners ~150), and
// the count of aircraft that asked not to be seen (LADD / PIA).
document.body.classList.toggle("ghost-mode", isGhostMode());
// The cue was hard-coded to SHOW in the markup while the layer defaults to on,
// so the tile opened saying the opposite of what was true and the first press
// looked like it had done nothing.
{
  const _cue = document.getElementById("hud-hero-cue");
  _cue?.classList.toggle("is-shown", isGhostMode());
}

let _ghostHintShown = false;
function _maybeShowGhostHint() {
  if (_ghostHintShown || !isGhostMode()) return;
  _ghostHintShown = true;
  let seen = false;
  try { seen = localStorage.getItem("stratum:ghost-hint") === "1"; } catch {}
  if (seen) return;
  const el = document.getElementById("ghost-hint");
  if (!el) return;
  el.classList.remove("hidden");
  requestAnimationFrame(() => el.classList.add("is-visible"));
  setTimeout(() => {
    el.classList.remove("is-visible");
    setTimeout(() => el.classList.add("hidden"), 400);
    try { localStorage.setItem("stratum:ghost-hint", "1"); } catch {}
  }, 14000); // data lands ~2s in, often under the boot splash — leave time to read it
}

// The ghost layer is reached from the number that names it. Pressing V and
// clicking "N asked not to be seen" do the same thing.
function _toggleGhostLayer() {
  const on = toggleGhostMode();
  document.body.classList.toggle("ghost-mode", on);
  // The tile said nothing about being pressable and nothing about which way it
  // was currently set, so pressing it looked like it had done nothing.
  const cue = document.getElementById("hud-hero-cue");
  cue?.classList.toggle("is-shown", on);
  cue?.setAttribute("title", on ? "Hide them" : "Show them");
  setCoverageShadowVisible(on);
  const btn = document.getElementById("hud-sky-unseen-btn");
  if (btn) btn.title = on ? "Hide them — V" : "Show them — V";
  // The open panel withholds or reveals with the layer, now, not at the next
  // poll: pressing V should be the thing that changes what you can read.
  if (aircraftManager) {
    const { lat, lon } = getUserLocation();
    refreshDetail(aircraftManager, lat, lon);
    _syncFollowPill();
  }
  _renderContacts();
  return on;
}
document.getElementById("hud-sky-unseen-btn")?.addEventListener("click", _toggleGhostLayer);
// A name just landed: the pill and the ticker are carrying the old word.
onNamed(() => { _syncFollowPill(); _tickerAt = 0; _renderMine(); });

// ── The visibility index, read back ─────────────────────────────────────────
// The Worker's warm pass counts, for every airspace it visits, how many
// aircraft asked not to be shown. Read here, that count becomes a comparison:
// this sky's share against the sky where the share is most different, named.
// The point is not the number but that it differs -- LADD and PIA are FAA
// programmes, so an American sky can hide what a European one cannot.
let _visIndex = null;
let _visFetchedAt = 0;
setTimeout(() => _loadVisibility(), 0);
let _lastSky = { total: 0, unseen: 0 };
async function _loadVisibility() {
  if (Date.now() - _visFetchedAt < 300000) return;
  _visFetchedAt = Date.now();
  try {
    const r = await fetch("/api/visibility", { signal: AbortSignal.timeout(8000) });
    _visIndex = r.ok ? await r.json() : null;
  } catch { _visIndex = null; }
  _renderVisibilityCmp();
  _bootThesisFromIndex();
  if (typeof _onVisibilityIndex === "function") _onVisibilityIndex();
}
let _onVisibilityIndex = null;
// The index, read for one place: the nearest measured sky within 0.6 degrees,
// if it has three samples and three hundred aircraft behind it.
function _visShareFor(lat, lon) {
  const cells = _visIndex?.cells ? Object.values(_visIndex.cells) : [];
  let best = null, bd = 0.6;
  for (const c of cells) {
    if (c.samples < 3 || c.total < 300) continue;
    const d = Math.abs(c.lat - lat) + Math.abs(c.lon - lon);
    if (d < bd) { bd = d; best = c; }
  }
  return best ? { share: best.masked / best.total, total: best.total } : null;
}
// The claim on the boot screen, with the index's own numbers when it has them:
// American skies against European ones, each as a sum over its measured cells.
function _bootThesisFromIndex() {
  const el = document.getElementById("boot-thesis");
  if (!el || !_visIndex?.cells) return;
  let us = [0, 0], eu = [0, 0];
  for (const c of Object.values(_visIndex.cells)) {
    if (c.samples < 3 || c.total < 300) continue;
    if (c.lon < -60 && c.lat > 24) { us[0] += c.masked; us[1] += c.total; }
    else if (c.lon >= -12 && c.lon <= 45 && c.lat > 34) { eu[0] += c.masked; eu[1] += c.total; }
  }
  if (us[1] < 2000 || eu[1] < 1000) return;
  const one = (m, t) => { const r = Math.round(t / Math.max(1, m)); return r >= 100 ? "almost none" : `about one in ${r}`; };
  el.innerHTML = `Every aircraft here says how it was heard. Some asked not to be.<br>In American skies, ${one(us[0], us[1])}. In European skies, ${one(eu[0], eu[1])}.`;
}

// Per-city share, computed once per index load.
let _visShareCache = null, _visShareCacheAt = 0;
function _visShareCached(i) {
  if (!_visShareCache || _visShareCacheAt !== _visFetchedAt) {
    _visShareCache = CITIES.map((c) => _visShareFor(c.lat, c.lon));
    _visShareCacheAt = _visFetchedAt;
  }
  return _visShareCache[i];
}

function _nearestCity(lat, lon) {
  let best = null, bd = Infinity;
  for (const c of CITIES) {
    const d = Math.abs(c.lat - lat) + Math.abs(c.lon - lon);
    if (d < bd) { bd = d; best = c; }
  }
  return best && bd < 0.6 ? best : null;
}
function _nearestCityName(lat, lon) {
  const c = _nearestCity(lat, lon);
  return c ? c.name.replace(/\s+[A-Z]{3}$/, "") : null;
}

// ── The zero is a door ──────────────────────────────────────────────────────
// The comparison line has always known where the masked aircraft are; it was
// the one piece of writing on the page that named a place with a working game
// in it and then left you standing in a sky with none. Most airspaces read 0%
// most of the time, which means the tile that carries the project's argument
// spends most of its life displaying a zero and nothing to do about it.
//
// So when the sky it names is more masked than this one, the line becomes the
// way there. Not a new feature bolted beside it -- the same sentence, now
// pressable, because the sentence was already the invitation.
let _cmpCity = null;
let _cameFor = null; // { code, pct, at } — what you were told before you left
const _CAME_MS = 120000;
function _renderVisibilityCmp() {
  const el = document.getElementById("hud-sky-cmp");
  if (!el) return;
  const cells = _visIndex?.cells ? Object.values(_visIndex.cells) : [];
  const here = getUserLocation();
  const eligible = cells.filter((c) => c.samples >= 3 && c.total >= 300);
  if (!eligible.length || !_lastSky.total) { el.textContent = ""; return; }
  const share = _lastSky.unseen / _lastSky.total;
  // The comparison: the eligible sky farthest from this share, on the other
  // side of an ocean where possible, so the contrast is between jurisdictions
  // and not between two neighbouring fields.
  let cmp = null, gap = -1;
  for (const c of eligible) {
    if (Math.abs(c.lat - here.lat) < 0.6 && Math.abs(c.lon - here.lon) < 0.6) continue;
    const s = c.masked / c.total;
    const far = Math.abs(c.lon - here.lon) > 40 ? 1 : 0.35;
    const g = Math.abs(s - share) * far;
    if (g > gap) { gap = g; cmp = c; }
  }
  const city = cmp ? _nearestCity(cmp.lat, cmp.lon) : null;
  const name = city ? city.name.replace(/\s+[A-Z]{3}$/, "") : null;
  if (!cmp || !name || gap < 0.03) {
    el.textContent = ""; el.classList.remove("is-door"); _cmpCity = null;
    el.removeAttribute("role"); el.removeAttribute("tabindex"); el.removeAttribute("title");
    return;
  }
  const pct = (x) => `${Math.round(x * 100)}%`;
  const cmpShare = cmp.masked / cmp.total;
  const text = `${pct(share)} here · ${pct(cmpShare)} over ${name}`;
  // A door only where there is more to see than here. When the other sky is
  // the emptier one the sentence is still worth reading — that is the
  // comparison doing its job — but there is nothing on the far side to go to.
  const isDoor = cmpShare > share + 0.02 && city.code !== activeCity?.code;
  _cmpCity = isDoor ? { city, pct: Math.round(cmpShare * 100) } : null;
  el.classList.toggle("is-door", isDoor);
  if (isDoor) {
    // The arrow sits inside the sentence rather than beside it: as a separate
    // flex item it took the width the last word needed and the place name
    // ellipsed away, which is the one word the line exists to say. It is tied
    // to that word with nowrap for the same reason — left to itself it wrapped
    // onto a line of its own and read as a stray control.
    el.innerHTML = `${pct(share)} here · ${pct(cmpShare)} over ` +
      `<span class="hud-door-end">${name}` +
      `<span class="hud-act hud-act--sm hud-door-act" aria-hidden="true">` +
      `<svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2.5 L7.6 6 L4 9.5"/></svg></span></span>`;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.title = `Go to ${name}`;
  } else {
    el.textContent = text;
    el.removeAttribute("role"); el.removeAttribute("tabindex"); el.removeAttribute("title");
  }
}

// The line is inside the hero button, so its press has to stop there: the
// tile's own job is to reveal the unseen, and travelling is not that.
(() => {
  const go = (e) => {
    if (!_cmpCity) return;
    e.stopPropagation();
    e.preventDefault();
    _cameFor = { code: _cmpCity.city.code, pct: _cmpCity.pct, at: Date.now() };
    switchCity(_cmpCity.city);
  };
  document.getElementById("hud-sky-cmp")?.addEventListener("click", go);
  document.getElementById("hud-sky-cmp")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") go(e);
  });
})();

// What you were promised, against what is actually overhead. A share measured
// over weeks says nothing about this minute, and saying so is more honest than
// quietly hoping the sky obliges.
function _renderCameFor() {
  const el = document.getElementById("hud-sky-came");
  if (!el) return;
  if (!_cameFor || Date.now() - _cameFor.at > _CAME_MS || activeCity?.code !== _cameFor.code) {
    if (_cameFor && (Date.now() - _cameFor.at > _CAME_MS)) _cameFor = null;
    el.classList.add("hidden"); el.textContent = "";
    return;
  }
  const n = _lastSky.unseen;
  el.classList.remove("hidden");
  el.textContent = n > 0
    ? `came for the ${_cameFor.pct}% · ${n} up now`
    : `came for the ${_cameFor.pct}% · none up this minute`;
  el.classList.toggle("is-empty", n === 0);
}

// ── Contacts ────────────────────────────────────────────────────────────────
// The layer becomes a task. A ringed aircraft can be located, heard and typed
// but never named; clicking one logs a contact, the way a scope operator logs
// a return. The count sits under the unseen line: "3 of 12 contacted", and
// when they are all found, "all 12 contacted · none named". The rules of the
// game are the argument.
const _contacts = new Set();
let _blipCtx = null;
function _blip() {
  try {
    _blipCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    const c = _blipCtx, t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(1240, t); o.frequency.exponentialRampToValueAtTime(880, t + 0.09);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.12);
  } catch {}
}
function _recordContact(ac) {
  if (!ac?.data?.masked || !isGhostMode()) return;
  const id = ac.data.icao24;
  if (_contacts.has(id)) return;
  _contacts.add(id);
  ac.contactPulse?.();
  _blip();
  _renderContacts();
  // The contact joins the commons. If the airframe already has a name this
  // records one more listener; if it has none, the dossier offers the three
  // words its address allows and the choice is written for everybody.
  ghostRecord(id).then((rec) => {
    if (rec && rec.named) ghostContact(id).then(() => { offerNaming(id); refreshGhostNames(); });
    else offerNaming(id);
    _renderContacts();
  });
}
// ── The return ──────────────────────────────────────────────────────────────
// Naming an aircraft was a one-way gesture: you gave it a word and never heard
// from it again, so there was nothing to come back for. But these are real
// airframes flying real routes, and the one you named last week flies over
// again. That reunion is the only thing in this project that could not be
// designed -- it has to be waited for -- and it was going unsaid.
//
// Said on the line that already tracks your relationship to the unseen, for
// twelve seconds, while the aircraft's own ring pulses so you can find it.
// Once per airframe per session: a greeting repeated is a notification.
const _greeted = new Set();
let _reunion = null;

// ── While you were away ─────────────────────────────────────────────────────
// The commons is shared, and the only evidence of that from inside a single
// visit is a number in the ticker that never visibly moves. Between visits it
// does. Holding the size at the last visit costs one integer and turns coming
// back into news: other people were here, and the sky has more names in it
// than it did. Said once, in the same slot the reunions use, before them.
const COMMONS_SEEN_KEY = "stratum:commons-seen";
let _awayChecked = false;
function _checkWhileAway() {
  if (_awayChecked) return;
  const now = indexSize();
  if (!now) return;          // index has not loaded yet; try again next poll
  _awayChecked = true;
  let before = null;
  try {
    const raw = localStorage.getItem(COMMONS_SEEN_KEY);
    before = raw === null ? null : Number(raw);
    localStorage.setItem(COMMONS_SEEN_KEY, String(now));
  } catch { return; }
  // Nothing to say on a first visit: there is no "away" to have been in.
  if (before === null || !(now > before)) return;
  const n = now - before;
  _reunion = {
    text: `${n} aircraft ${n === 1 ? "was" : "were"} named while you were away`,
    until: Date.now() + 12000,
  };
  _renderContacts();
}

function _checkReturns() {
  if (!aircraftManager || !isGhostMode()) return;
  // Wait for the slot. Several of your aircraft can be overhead at once, and
  // greeting them a poll apart made each one overwrite the last before anyone
  // could read it. They queue instead, twelve seconds each.
  if (_reunion && Date.now() < _reunion.until) return;
  const mine = myNames();
  for (const ac of aircraftManager.aircraft.values()) {
    const hex = ac.data?.icao24;
    if (!ac.data?.masked || !hex || _greeted.has(hex)) continue;
    const rec = mine[hex];
    if (!rec) continue;
    _greeted.add(hex);
    _reunion = { name: rec.n, at: rec.at, until: Date.now() + 12000 };
    ac.contactPulse?.();
    _renderContacts();
    break; // one reunion at a time; the rest keep until the next poll
  }
}

// ── Your own record, and the sky filtered down to it ─────────────────────────
// Naming was accumulating somewhere no one could see: the names are in local
// storage and on the map, but nothing ever said how many were yours. The count
// sits in the unseen tile, because it is a part of that number, and pressing
// it is the only mechanic this needed -- the sky drops to the airframes you
// named and that are up right now. It is the difference between a list of
// things you did and a place you can go and look at them.
let _mineOnly = false;
function _renderMine() {
  const el = document.getElementById("hud-mine");
  const txt = document.getElementById("hud-mine-text");
  if (!el || !txt) return;
  const mine = myNames();
  const total = myNameCount();
  if (!total) { el.classList.add("hidden"); return; }
  el.classList.remove("hidden");
  const up = aircraftManager
    ? [...aircraftManager.aircraft.values()].filter((a) => mine[a.data.icao24]).length
    : 0;
  // "2 of 5 yours" while some are overhead, "5 yours" when none are, because
  // a zero in the middle of a sentence reads as a fault rather than as quiet.
  txt.textContent = up ? `${up} of ${total} yours` : `${total} yours`;
  el.classList.toggle("is-on", _mineOnly);
  el.classList.toggle("is-empty", up === 0);
}
function _toggleMineOnly() {
  if (!aircraftManager) return;
  const mine = myNames();
  const present = [...aircraftManager.aircraft.values()]
    .filter((a) => mine[a.data.icao24])
    .map((a) => a.data.icao24);
  // Nothing of yours is up: say so rather than emptying the sky, which would
  // look like the filter broke.
  if (!_mineOnly && present.length === 0) {
    const t = document.getElementById("toast");
    if (t) {
      t.textContent = "None of the ones you named are overhead";
      t.classList.remove("hidden");
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.add("hidden"), 2600);
    }
    return;
  }
  _mineOnly = !_mineOnly;
  if (_mineOnly) aircraftManager.setFilter(new Set(present));
  else aircraftManager.clearFilter();
  _renderMine();
}
document.getElementById("hud-mine")?.addEventListener("click", (e) => {
  e.stopPropagation();   // the tile itself toggles the ghost layer
  _toggleMineOnly();
});
document.getElementById("hud-mine")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); _toggleMineOnly(); }
});

function _renderContacts() {
  const el = document.getElementById("hud-sky-contacts");
  if (!el) return;
  if (_reunion) {
    if (Date.now() < _reunion.until) {
      // One line, measured rather than guessed: the slot is 238px and "... is
      // back · you named it 3 days ago" renders at 240, so it wrapped and shoved
      // the tower button and the weather row down for twelve seconds before
      // pulling them back. Without the pronoun the worst case -- the longest
      // adjective and noun the word lists can produce, with the longest elapsed
      // phrase -- measures 234. The pronoun is the part that can go: this line
      // only ever appears for a name you gave. "is back" is the register, too;
      // a reunion, not a notification.
      el.textContent = _reunion.text
        || `${_reunion.name.toUpperCase()} is back · named ${sinceWords(_reunion.at)}`;
      el.classList.add("is-reunion");
      return;
    }
    _reunion = null;
    el.classList.remove("is-reunion");
  }
  const total = _lastSky.unseen;
  if (!isGhostMode() || !total) { el.textContent = ""; return; }
  const seenNow = aircraftManager ? [...aircraftManager.aircraft.values()].filter((a) => a.data.masked && _contacts.has(a.data.icao24)).length : 0;
  // The hero above already states the total, so this line carries progress
  // only. It used to repeat the number directly under itself.
  el.textContent = seenNow >= total
    ? `all contacted · none named`
    // "click a ring" is the on-ramp, and it only belongs in front of someone
    // who has not been up it. Once you have named something the tile already
    // carries your record a line below, and repeating the invitation there
    // pushed the top row 35px taller than the bottom one for no new meaning.
    : seenNow ? `${seenNow} of ${total} contacted`
    // The first-visit line was an instruction with a preamble in front of it:
    // "none contacted yet" repeats a zero the tile is already showing, and the
    // middot was holding the two halves of one short sentence apart. What is
    // left is the gesture.
    : myNameCount() ? `` : `press any ring`;
}

// The first thing after the boot screen is a descent: the camera starts high
// and far and settles onto the airport over four seconds, so the sky is
// arrived at as a place rather than switched on as a picture. One time only;
// any input from the visitor ends it at once.
let _introDone = false;
let _introRunning = false;
// The descent is the piece's opening: the sky is arrived at as a place rather
// than switched on as a picture. That is worth four seconds from someone
// meeting it, and it is a toll on someone who left ten minutes ago and came
// back -- and the toll is paid on every single entry, because the flag that
// suppressed a repeat lived in module scope and died with the page.
//
// So it plays on a real arrival and not on a return. Six hours, because by
// then you have been away long enough that landing here again is an arrival;
// under it, you know where you are and want the sky, not the overture.
const ARRIVAL_KEY = "stratum:arrived";
const ARRIVAL_GAP = 6 * 60 * 60 * 1000;
function _isReturning() {
  try {
    const last = Number(localStorage.getItem(ARRIVAL_KEY) || 0);
    localStorage.setItem(ARRIVAL_KEY, String(Date.now()));
    return last > 0 && Date.now() - last < ARRIVAL_GAP;
  } catch { return false; }
}

function _introDescent() {
  if (_introDone || !camera || !controls) return;
  _introDone = true;
  if (_isReturning()) {
    camera.position.set(8, 9, 12);
    controls.target.set(0, 1, 0);
    controls.update();
    return;
  }
  _introRunning = true;
  // The descent owns the camera: it ends on the cinematic framing every
  // airspace load uses, and that load's own reset stands aside while it runs,
  // whichever of the two happens first.
  const end = new THREE.Vector3(8, 9, 12);
  const start = end.clone().multiplyScalar(2.2);
  start.y = end.y * 2.6;   // |start| ~= 39.4, inside controls.maxDistance
  controls.target.set(0, 1, 0);
  camera.position.copy(start);
  controls.enabled = false;
  const t0 = performance.now();
  const D = 4200;
  let cancelled = false;
  const cancel = () => { cancelled = true; };
  window.addEventListener("pointerdown", cancel, { once: true });
  window.addEventListener("wheel", cancel, { once: true, passive: true });
  window.addEventListener("keydown", cancel, { once: true });
  const step = () => {
    const u = Math.min(1, (performance.now() - t0) / D);
    const e = 1 - Math.pow(1 - u, 3);
    if (!cancelled) camera.position.lerpVectors(start, end, e);
    controls.update();
    if (u < 1 && !cancelled) requestAnimationFrame(step);
    else { camera.position.copy(end); controls.enabled = true; controls.update(); _introRunning = false; }
  };
  requestAnimationFrame(step);
}

// ── Ticker ────────────────────────────────────────────────────────────────
// A quote board reads: name, value, change. An aircraft reads the same way --
// callsign, flight level, and the rate it is leaving that level at -- so the
// sky can be carried along the bottom of the screen in the grammar a trading
// floor already taught everyone. Rebuilt from live data every twenty seconds;
// the strip itself never stops, because the sky does not.
let _tickerAt = 0;
const esc = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function _buildTicker() {
  const track = document.getElementById("ticker-track");
  if (!track || !aircraftManager) return;
  const list = [...aircraftManager.aircraft.values()]
    .filter((a) => a.data.callsign && a.data.baroAltitude != null)
    .sort((a, b) => (b.data.baroAltitude || 0) - (a.data.baroAltitude || 0))
    .slice(0, 26);
  const items = [];
  for (const a of list) {
    const d = a.data;
    const ft = Math.round(d.baroAltitude * 3.28084);
    const lvl = ft >= 18000 ? `FL${String(Math.round(ft / 100)).padStart(3, "0")}` : `${ft.toLocaleString()}ft`;
    const vs = d.verticalRate != null ? Math.round(d.verticalRate * 3.28084 * 60) : 0;
    const cls = vs > 100 ? "tk-up" : vs < -100 ? "tk-dn" : "tk-flat";
    const mark = vs > 100 ? "\u25b2" : vs < -100 ? "\u25bc" : "\u2500";
    const chg = Math.abs(vs) > 100 ? `${mark} ${Math.abs(vs).toLocaleString()}` : mark;
    const sym = isGhostMode() && d.masked ? (nameFor(d.icao24) || "UNSEEN").toUpperCase() : d.callsign;
    // A row was a callsign, a level and a trend, which is three facts about
    // where an aircraft is and none about what it is or where it is going.
    // The badge is the type for an ordinary aircraft and the programme that
    // withholds its name for a ringed one -- so the one row you cannot fully
    // read says why, in the same slot the others use for their model.
    const badge = d.masked
      ? (d.maskReason === "PIA" ? "PIA" : "LADD")
      : (d.aircraftType || "").toUpperCase().slice(0, 4);
    const kts = d.velocity != null ? Math.round(d.velocity * 1.94384) : null;
    // The route lives in its own cache keyed on callsign, not on the aircraft
    // record: reading d.destination got null for the whole flock and the
    // arrow never appeared once.
    const rt = d.callsign ? getRoute(d.callsign) : null;
    const dest = rt?.destination ? String(rt.destination).toUpperCase().slice(0, 4) : null;
    items.push(
      `<span class="tk">` +
        `<span class="tk-sym">${esc(sym)}</span>` +
        (badge ? `<span class="tk-tag${d.masked ? " tk-tag--masked" : ""}">${esc(badge)}</span>` : "") +
        `<span class="tk-val">${lvl}</span>` +
        `<span class="tk-chg ${cls}">${chg}</span>` +
        (kts ? `<span class="tk-sub">${kts}kt</span>` : "") +
        (dest ? `<span class="tk-dest">→ ${esc(dest)}</span>` : "") +
      `</span>`,
    );
  }
  if (_lastSky.total) {
    items.push(`<span class="tk"><span class="tk-sym">UNSEEN</span><span class="tk-val">${Math.round((_lastSky.unseen / _lastSky.total) * 100)}%</span><span class="tk-chg tk-flat">of this sky</span></span>`);
  }
  // How big the commons is. Without it a visitor has no way to tell whether
  // they are the fifth person here or the fifty thousandth, and the naming
  // reads as a private toy rather than a shared record.
  const named = indexSize();
  if (named) {
    items.push(`<span class="tk"><span class="tk-sym">NAMED</span><span class="tk-val">${named.toLocaleString()}</span><span class="tk-chg tk-flat">by listeners</span></span>`);
  }
  items.push('<span class="tk tk-note">live ADS-B via volunteer receivers &nbsp;·&nbsp; audio LiveATC &nbsp;·&nbsp; map Esri</span>');
  if (!items.length) return;
  // Doubled, so the same strip can scroll into itself without a seam.
  track.innerHTML = items.join("") + items.join("");
  track._half = 0;
}
function _animateTicker(dtMs) {
  const track = document.getElementById("ticker-track");
  if (!track || !track.children.length) return;
  if (!track._half) track._half = track.scrollWidth / 2;
  track._x = ((track._x || 0) - dtMs * 0.045) % -track._half;
  track.style.transform = `translateX(${track._x}px)`;
}

function _skyStats(list) {
  let people = 0, unseen = 0;
  const cities = new Set();
  for (const d of list) {
    if (d.seats) people += d.seats;
    else if (d.category === "A1" || d.category === "A2") people += 4;
    else if (d.category === "A3" || d.category === "A4" || d.category === "A5") people += 150;
    else people += 2;
    const dest = d.destination || getRoute(d.callsign)?.destination;
    if (dest) cities.add(dest);
    if (d.masked) unseen++;
  }
  _lastSky = { total: list.length, unseen };
  return { people: Math.round(people), cities: cities.size, unseen };
}

function handleData(dataList) {
  console.log("[STRATUM] Received", dataList.length, "aircraft");
  showSignalLost(false);
  lastRawData = dataList;
  // Mark aircraft as arrived on first non-empty data
  if (dataList.length > 0) { _onAircraftArrived(); _maybeShowGhostHint(); }
  if (aircraftManager) {
    aircraftManager.update(dataList);
    const { lat, lon } = getUserLocation();
    const count = aircraftManager.getCount();
    updateHUD(count, lat, lon);
    updateHUDSky(_skyStats(dataList));
    if (Date.now() - _tickerAt > 20000) { _tickerAt = Date.now(); _buildTicker(); }
    refreshIndex().then((changed) => { if (changed) refreshGhostNames(); });
    _checkWhileAway();
    _checkReturns();
    _renderVisibilityCmp();
    _renderCameFor();
    _renderContacts();
    _renderMine();
    _loadVisibility();
    updateCoverageShadow(dataList, lat, lon);
    // Throttle detail refresh to 1Hz — data arrives at 4-10Hz but UI update > 1Hz is wasted
    const _now = Date.now();
    if (_now - _lastDetailRefreshAt >= 900) {
      _lastDetailRefreshAt = _now;
      refreshDetail(aircraftManager, lat, lon);
    }

    // Re-evaluate airport filter with fresh data
    if (selectedAirportState) {
      const _aptCodes = new Set(
        [selectedAirportState.iata, selectedAirportState.icao]
          .filter(Boolean)
          .map((c) => c.toUpperCase()),
      );
      const _relSet = _buildAirportRelatedSet(_aptCodes, selectedAirportState);
      aircraftManager.setFilter(_relSet);
      aircraftManager.setHighlight(_relSet);
    }

    // Hidden: milestone celebration when aircraft count hits round numbers
    if (count >= 50 && !_milestones.has(50)) {
      _milestones.add(50);
      _showMilestone("50 aircraft in range");
    }
    if (count >= 100 && !_milestones.has(100)) {
      _milestones.add(100);
      _showMilestone("100 aircraft tracked");
    }
    if (count >= 200 && !_milestones.has(200)) {
      _milestones.add(200);
      _showMilestone("200 aircraft — busy sky");
    }
    if (count >= 300 && !_milestones.has(300)) {
      _milestones.add(300);
      _showMilestone("300 aircraft — crowded airspace");
    }

    // T2-14: Track session stats
    if (count > sessionStats.peak) sessionStats.peak = count;
    for (const ac of dataList) {
      if (ac.icao24) sessionStats.seen.add(ac.icao24);
      if (ac.aircraftType) sessionStats.types.add(ac.aircraftType);
      if (ac.callsign) {
        const m = ac.callsign.match(/^([A-Z]{2,3})\d/);
        if (m) sessionStats.airlines.add(m[1]);
      }
      // E-2: fastest / highest / type counts
      const gsKts = ac.velocity ? Math.round(ac.velocity * 1.94384) : 0;
      if (gsKts > sessionStats.fastest.gsKts) {
        sessionStats.fastest = {
          callsign: ac.callsign || ac.icao24 || "",
          gsKts,
          type: ac.aircraftType || "",
        };
      }
      const altFt = ac.baroAltitude ? Math.round(ac.baroAltitude * 3.28084) : 0;
      if (altFt > sessionStats.highest.altFt) {
        sessionStats.highest = {
          callsign: ac.callsign || ac.icao24 || "",
          altFt,
        };
      }
      if (ac.aircraftType) {
        const t = ac.aircraftType.toUpperCase();
        sessionStats.typeCounts[t] = (sessionStats.typeCounts[t] || 0) + 1;
      }
      // T3-07: Spotter book
      if (ac.aircraftType) {
        const t = ac.aircraftType.toUpperCase();
        if (SPOTTER_TYPES.some((s) => s.code === t)) {
          spotterBook[t] = (spotterBook[t] || 0) + 1;
          saveSpotterBook();
        }
      }
    }

    // T2-15: Check emergency squawks
    checkEmergencySquawks();
    // S3: Track emergency events timeline
    trackEmergencyEvents();
    // A3: FIR entry/exit tracking
    trackFIRTransitions();

    // T2-17: Wind direction indicators on runways
    const aptData = getAirportData();
    if (aptData && aptData.runways) {
      updateWindIndicators(scene, aptData.runways, dataList);
    }

    // T3-09: Landing detection
    if (aptData && aptData.runways) {
      checkLandings(dataList, aptData.runways, scene);
    }

    // Unified filter — build filterSet for smooth opacity dimming
    applyFilters(dataList);

    // I1: Fleet mix statistics (data for spotter overlay)
    updateFleetStats(dataList);

    // D-1: Refresh vertical profile canvas if open
    _maybeRefreshVertProfile();
  }
}

function handleError(err, consecutiveErrors) {
  console.warn(
    "[STRATUM] Data error:",
    err.message,
    `(${consecutiveErrors} consecutive)`,
  );
  // A failed poll is logged and nothing more -- once data has arrived. The
  // HUD's own "Ns ago" decides when a silence has gone on long enough to say
  // so, from one clock.
  //
  // Before the first aircraft ever lands, there is no clock to read and the
  // pill sits on "Awaiting aircraft data…" forever, which describes a wait and
  // not a failure. Someone whose dev server or network is down reads that for
  // several minutes before suspecting anything is wrong. After three failed
  // polls, say which half is broken.
  if (!_aircraftArrived && consecutiveErrors >= 3) {
    _setLoadStatus("No reply from any aircraft feed — retrying");
  }
}

// --- Window resize ---
// Debounced resize — avoids multiple expensive GPU operations during drag-resize
let _resizeTimer = null;
window.addEventListener("resize", () => {
  if (_resizeTimer) cancelAnimationFrame(_resizeTimer);
  _resizeTimer = requestAnimationFrame(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (composer) composer.setSize(window.innerWidth, window.innerHeight);
    if (bloomPass)
      bloomPass.resolution.set(
        window.innerWidth * 0.5,
        window.innerHeight * 0.5,
      );
    if (colorGradePass)
      colorGradePass.uniforms.resolution.value.set(
        window.innerWidth,
        window.innerHeight,
      );
    _resizeTimer = null;
  });
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

// --- Feature state ---
let screenshotMode = false;
let bloomLevel = 1; // 0=subtle(0.35), 1=normal(0.65), 2=cinematic(1.2)
const BLOOM_PRESETS = [0.3, 0.55, 1.0];
const BLOOM_LABELS = ["SUBTLE", "NORMAL", "CINEMATIC"];
let distanceRingsVisible = false;
let distanceRingsGroup = null;

// ── Unified filter state ──
const filterState = {
  altPreset: "ALL", // GND | TERMINAL | TRANS | HIGH | ALL
  airportMode: "ALL", // ALL | ARR | DEP
  isolate: false, // true = only show filtered set, mute rest
  active: false, // is the panel open?
};
const ALT_PRESETS = {
  ALL: { min: 0, max: 99999, label: "ALL" },
  GND: { min: 0, max: 1500, label: "GND" },
  TERMINAL: { min: 0, max: 10000, label: "<FL100" },
  TRANS: { min: 10000, max: 24000, label: "TRANS" },
  HIGH: { min: 24000, max: 60000, label: "HIGH" },
};

// Session statistics (T2-14)
const sessionStart = Date.now();
let _lastDetailRefreshAt = 0; // throttle refreshDetail to 1Hz
const sessionStats = {
  seen: new Set(),
  types: new Set(),
  airlines: new Set(),
  peak: 0,
  cities: new Set(),
  // E-2 extensions
  fastest: { callsign: "", gsKts: 0, type: "" },
  highest: { callsign: "", altFt: 0 },
  typeCounts: {},
};

// Hidden: milestone celebrations
const _milestones = new Set();
function _showMilestone(text) {
  const lbl =
    document.getElementById("bloom-label") || document.createElement("div");
  if (!lbl.id) {
    lbl.id = "bloom-label";
    lbl.className = "bloom-label";
    document.body.appendChild(lbl);
  }
  lbl.textContent = text;
  lbl.classList.remove("hidden");
  clearTimeout(lbl._timer);
  lbl._timer = setTimeout(() => lbl.classList.add("hidden"), 3000);
}

// Flight history (T3-13)
const flightHistory = [];

// Spotter book (T3-07)
const spotterBook = JSON.parse(localStorage.getItem("stratum:spotter") || "{}");
function saveSpotterBook() {
  localStorage.setItem("stratum:spotter", JSON.stringify(spotterBook));
}

// Favorites (T2-07)
const favorites = new Set(
  JSON.parse(localStorage.getItem("stratum:favorites") || "[]"),
);
function saveFavorites() {
  localStorage.setItem("stratum:favorites", JSON.stringify([...favorites]));
}

// ── D-1: Vertical Profile Cross-Section ──
let _vertProfileVisible = false;
function _toggleVerticalProfile() {
  _vertProfileVisible = !_vertProfileVisible;
  let panel = document.getElementById("vert-profile-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "vert-profile-panel";
    panel.className = "vert-profile-panel";
    panel.innerHTML = `
      <div class="vert-profile-header">
        <div class="vert-profile-header-left">
          <span class="vert-profile-title">VERTICAL PROFILE</span>
          <span class="vert-profile-key">X</span>
        </div>
        <button class="vert-profile-close" id="vert-profile-close" title="Close">✕</button>
      </div>
      <canvas id="vert-profile-canvas" class="vert-profile-canvas" width="1120" height="340" style="width:100%;height:170px"></canvas>
      <div class="vert-profile-legend">
        <span class="vp-dot" style="background:#5aacff"></span>CLB
        <span class="vp-dot" style="background:#44dd88"></span>CRZ
        <span class="vp-dot" style="background:#e8836a"></span>DSC
        <span class="vp-dot" style="background:rgba(255,255,255,0.25)"></span>GND
        <span class="vert-profile-legend-spacer"></span>
        <span class="vp-legend-note">FL180 pressurized · FL100 visual floor · 200nm radius</span>
      </div>`;
    document
      .getElementById("vert-profile-close")
      ?.addEventListener("click", () => {
        _vertProfileVisible = false;
        panel.style.display = "none";
      });
    document.body.appendChild(panel);
  }
  panel.style.display = _vertProfileVisible ? "block" : "none";
  if (_vertProfileVisible) _drawVerticalProfile();
}

function _drawVerticalProfile() {
  const canvas = document.getElementById("vert-profile-canvas");
  if (!canvas || !aircraftManager) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width,
    H = canvas.height;
  const PAD = { l: 72, r: 20, t: 16, b: 44 };
  const plotW = W - PAD.l - PAD.r,
    plotH = H - PAD.t - PAD.b;
  const MAX_NM = 200,
    MAX_ALT = 45000;

  ctx.clearRect(0, 0, W, H);

  const { lat: uLat, lon: uLon } = getUserLocation();

  // FL reference lines
  [
    { fl: 0 },
    { fl: 100 },
    { fl: 180, gold: true },
    { fl: 280 },
    { fl: 410 },
  ].forEach(({ fl, gold }) => {
    const y = PAD.t + plotH - ((fl * 100) / MAX_ALT) * plotH;
    ctx.strokeStyle = gold ? "rgba(196,160,88,0.28)" : "rgba(255,255,255,0.06)";
    ctx.lineWidth = gold ? 1.5 : 1;
    if (!gold) ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(PAD.l, y);
    ctx.lineTo(PAD.l + plotW, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = gold ? "rgba(196,160,88,0.65)" : "rgba(255,255,255,0.25)";
    ctx.font = `${gold ? "bold " : ""}22px "JetBrains Mono",monospace`;
    ctx.textAlign = "right";
    ctx.fillText(fl > 0 ? `FL${fl}` : "GND", PAD.l - 6, y + 8);
  });

  // Distance tick marks
  [50, 100, 150, 200].forEach((nm) => {
    const x = PAD.l + (nm / MAX_NM) * plotW;
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 8]);
    ctx.beginPath();
    ctx.moveTo(x, PAD.t);
    ctx.lineTo(x, PAD.t + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
    // tick
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(x, PAD.t + plotH);
    ctx.lineTo(x, PAD.t + plotH + 6);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.font = '20px "JetBrains Mono",monospace';
    ctx.textAlign = "center";
    ctx.fillText(`${nm}nm`, x, PAD.t + plotH + 30);
  });

  // User position vertical line
  ctx.strokeStyle = "rgba(196,160,88,0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD.l, PAD.t);
  ctx.lineTo(PAD.l, PAD.t + plotH);
  ctx.stroke();
  ctx.fillStyle = "rgba(196,160,88,0.45)";
  ctx.font = '18px "JetBrains Mono",monospace';
  ctx.textAlign = "center";
  ctx.fillText("YOU", PAD.l, PAD.t + plotH + 30);

  // Plot aircraft dots
  for (const [, ac] of aircraftManager.aircraft) {
    if (ac.fadingOut || ac.data.latitude == null) continue;
    const distKm = haversineDistance(
      uLat,
      uLon,
      ac.data.latitude,
      ac.data.longitude,
    );
    const distNm = distKm * 0.539957;
    if (distNm > MAX_NM) continue;
    const altFt =
      ac.data.baroAltitude != null
        ? ac.data.baroAltitude * 3.28084
        : ac.data.geoAltitude != null
          ? ac.data.geoAltitude * 3.28084
          : 0;
    const x = PAD.l + (distNm / MAX_NM) * plotW;
    const y = PAD.t + plotH - Math.min(1, altFt / MAX_ALT) * plotH;
    const phase = ac.getDisplayData().flightPhase;
    const color =
      phase === "CLIMB" || phase === "INITIAL CLIMB"
        ? "#5aacff"
        : phase === "CRUISE" || phase === "EN ROUTE"
          ? "#44dd88"
          : phase === "DESCENT" || phase === "APPROACH"
            ? "#e8836a"
            : "rgba(255,255,255,0.22)";
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Refresh profile if visible (call from main data loop)
function _maybeRefreshVertProfile() {
  if (_vertProfileVisible) _drawVerticalProfile();
}

// ── A-3: Holding Pattern Detector & 3D Oval ──
let _holdingOvalObj = null;

function _detectHoldingFromTrail(trail) {
  if (!trail || trail.length < 12) return false;
  const pts = trail.slice(-60); // last 60 trail points
  // Geographic spread check: must fit within ~10 scene units (≈15nm)
  let minX = Infinity,
    maxX = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;
  for (const { pos } of pts) {
    if (pos.x < minX) minX = pos.x;
    if (pos.x > maxX) maxX = pos.x;
    if (pos.z < minZ) minZ = pos.z;
    if (pos.z > maxZ) maxZ = pos.z;
  }
  if (maxX - minX > 12 || maxZ - minZ > 12) return false;
  // Cumulative heading change ≥ 2π (one full rotation)
  let totalTurn = 0;
  for (let i = 2; i < pts.length; i++) {
    const dx = pts[i].pos.x - pts[i - 1].pos.x,
      dz = pts[i].pos.z - pts[i - 1].pos.z;
    const px = pts[i - 1].pos.x - pts[i - 2].pos.x,
      pz = pts[i - 1].pos.z - pts[i - 2].pos.z;
    if (dx * dx + dz * dz < 0.0001 || px * px + pz * pz < 0.0001) continue;
    let delta = Math.atan2(dz, dx) - Math.atan2(pz, px);
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    totalTurn += Math.abs(delta);
  }
  return totalTurn >= 2 * Math.PI;
}

function _renderHoldingOval(ac) {
  _clearHoldingOval();
  const trail = ac.trailPositions;
  if (!trail || trail.length < 4) return;

  // Compute centroid and radii from recent trail
  const pts = trail.slice(-60);
  let cx = 0,
    cy = 0,
    cz = 0;
  for (const { pos } of pts) {
    cx += pos.x;
    cy += pos.y;
    cz += pos.z;
  }
  cx /= pts.length;
  cy /= pts.length;
  cz /= pts.length;

  let rx = 0,
    rz = 0;
  for (const { pos } of pts) {
    rx = Math.max(rx, Math.abs(pos.x - cx));
    rz = Math.max(rz, Math.abs(pos.z - cz));
  }
  // Minimum visible size
  rx = Math.max(rx, 1.5);
  rz = Math.max(rz, 1.5);

  const curve = new THREE.EllipseCurve(0, 0, rx, rz, 0, 2 * Math.PI, false, 0);
  const points2D = curve.getPoints(60);
  const verts = points2D.map((p) => new THREE.Vector3(p.x, 0, p.y));
  verts.push(verts[0]); // close loop

  const geo = new THREE.BufferGeometry().setFromPoints(verts);
  const mat = new THREE.LineDashedMaterial({
    color: 0xffffaa,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    dashSize: 0.18,
    gapSize: 0.09,
  });
  const oval = new THREE.Line(geo, mat);
  oval.computeLineDistances();
  oval.position.set(cx, cy + 0.05, cz);
  oval.name = "holdingOval";
  scene.add(oval);
  _holdingOvalObj = oval;
}

function _clearHoldingOval() {
  if (_holdingOvalObj) {
    scene.remove(_holdingOvalObj);
    _holdingOvalObj.geometry.dispose();
    _holdingOvalObj.material.dispose();
    _holdingOvalObj = null;
  }
}

// --- Help panel (slide-in) ---
const helpPanel = document.getElementById("help-panel");
function toggleHelp() {
  if (helpPanel) helpPanel.classList.toggle("hidden");
}
document.getElementById("help-close")?.addEventListener("click", toggleHelp);
// The dim behind the guide is the panel's own ::before, so a click that lands
// on the panel and not on one of its tiles is a click outside it.
helpPanel?.addEventListener("click", (e) => {
  if (e.target === helpPanel) helpPanel.classList.add("hidden");
});

// Radio toggle button — stays lit when music is playing in background
const _radioToggleBtn = document.getElementById("radio-toggle-btn");
function _syncRadioBtn() {
  if (!_radioToggleBtn) return;
  if (_radioMod)
    _radioToggleBtn.classList.toggle(
      "active",
      _radioMod.isRadioPlaying() || _radioMod.isRadioVisible(),
    );
}
if (_radioToggleBtn) {
  _radioToggleBtn.addEventListener("click", () => {
    _getRadio().then((r) => {
      r.toggleRadio();
      _syncRadioBtn();
    });
  });
}

document.addEventListener("keydown", (e) => {
  // An open lesson takes 1-3, the arrows, Enter and Escape before anything else.
  if (schoolKey(e)) { e.preventDefault(); return; }
  if (document.activeElement.tagName === "INPUT") return;
  if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
    e.preventDefault();
    toggleHelp();
    return;
  }
  // Block shortcuts while any overlay or help panel is open
  const hasOverlay = document.querySelector(".overlay-backdrop:not(.hidden)");
  const helpOpen = helpPanel && !helpPanel.classList.contains("hidden");
  const cityOpen = !document
    .getElementById("city-overlay")
    ?.classList.contains("hidden");
  if (hasOverlay || helpOpen || cityOpen) return;

  const k = e.key.toLowerCase();
  if (e.ctrlKey || e.metaKey) {
    /* skip custom shortcuts when modifier held */
  } else if (k === "c") {
    e.preventDefault();
    openCityPicker();
    return;
  } else if (k === "m") {
    e.preventDefault();
    const on = toggleAmbience();
    const t = document.getElementById("toast");
    if (t) {
      t.textContent = on ? "Ambience on" : "Ambience off";
      t.classList.remove("hidden");
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.add("hidden"), 2000);
    }
    return;
  }

  // T1-07: Next/prev aircraft with [ and ]
  else if (e.key === "[" || e.key === "]") {
    if (!aircraftManager) return;
    const all = [...aircraftManager.aircraft.values()].filter(
      (ac) => !ac.fadingOut,
    );
    if (all.length === 0) return;
    // Sort by distance from the airport, not from the camera: the camera is
    // flying toward whatever was just selected, so a camera-relative order
    // changed under every press and the far aircraft were never reached.
    all.sort((a, b) => a.group.position.lengthSq() - b.group.position.lengthSq());
    const currentIdx = followTarget ? all.indexOf(followTarget) : -1;
    let nextIdx;
    if (e.key === "]") nextIdx = (currentIdx + 1) % all.length;
    else nextIdx = (currentIdx - 1 + all.length) % all.length;
    const ac = all[nextIdx];
    const { lat, lon } = getUserLocation();
    handleAircraftSelect(ac);
    return;
  }

  // T2-06: Screenshot mode
  else if (k === "p") {
    screenshotMode = !screenshotMode;
    document.body.classList.toggle("screenshot-mode", screenshotMode);
    const hint = document.getElementById("screenshot-hint");
    if (hint) hint.classList.toggle("hidden", !screenshotMode);
    return;
  }

  // T2-09: Bloom intensity toggle
  else if (k === "b") {
    bloomLevel = (bloomLevel + 1) % 3;
    if (bloomPass) bloomPass.strength = BLOOM_PRESETS[bloomLevel];
    // Show brief label
    let lbl = document.getElementById("bloom-label");
    if (!lbl) {
      lbl = document.createElement("div");
      lbl.id = "bloom-label";
      lbl.className = "bloom-label";
      document.body.appendChild(lbl);
    }
    lbl.textContent = `BLOOM: ${BLOOM_LABELS[bloomLevel]}`;
    lbl.classList.remove("hidden");
    clearTimeout(lbl._timer);
    lbl._timer = setTimeout(() => lbl.classList.add("hidden"), 1500);
    return;
  }

  // I = unified Info panel (session + spotter)
  else if (k === "i") {
    toggleInfoPanel();
    return;
  }

  // V = ghost layer: draw aircraft by how they are seen; masked ones lose their identity
  else if (k === "v" && !e.ctrlKey && !e.metaKey) {
    _toggleGhostLayer();
    return;
  }
  else if (k === "k" && !e.ctrlKey && !e.metaKey) { toggleSkyLegend(); return; }
  else if (k === "t" && !e.ctrlKey && !e.metaKey) { toggleSchool(); return; }

  // T2-18: Distance rings toggle
  else if (k === "g") {
    distanceRingsVisible = !distanceRingsVisible;
    toggleDistanceRings();
    return;
  }

  // T3-13: Flight history log
  else if (k === "h") {
    toggleHistoryOverlay();
    return;
  }

  // T3-11: Airport notes (N key)
  else if (k === "n") {
    if (selectedAirportState) {
      const code = selectedAirportState.iata || selectedAirportState.icao;
      if (code) showAirportNotes(code);
    } else if (activeCity) {
      showAirportNotes(activeCity.code);
    }
    return;
  }

  // Radio (R key)
  else if (k === "r") {
    _getRadio().then((r) => {
      r.toggleRadio();
      _syncRadioBtn();
    });
    return;
  }

  // Session replay (V key) — or cockpit HUD when following an aircraft
  else if (k === "v") {
    if (followTarget) {
      // V in follow mode = toggle cockpit HUD
      _getCockpit().then((m) => {
        m.toggleCockpitHUD(followTarget);
      });
    } else {
      _toggleSessionReplay();
    }
    return;
  }

  // T1-11: Trail opacity presets (1-5)
  else if (e.key >= "1" && e.key <= "5") {
    if (aircraftManager) {
      const level = parseInt(e.key) * 0.2; // 0.2, 0.4, 0.6, 0.8, 1.0
      aircraftManager.setTrailOpacity(level);
      const lbl =
        document.getElementById("bloom-label") || document.createElement("div");
      if (!lbl.id) {
        lbl.id = "bloom-label";
        lbl.className = "bloom-label";
        document.body.appendChild(lbl);
      }
      lbl.textContent = `TRAIL: ${Math.round(level * 100)}%`;
      lbl.classList.remove("hidden");
      clearTimeout(lbl._timer);
      lbl._timer = setTimeout(() => lbl.classList.add("hidden"), 1500);
    }
    return;
  }

  // T3-15: Share view link
  else if (k === "l") {
    shareViewLink();
    return;
  }

  // D-1: Vertical Profile Cross-Section (X key)
  else if (k === "x") {
    e.preventDefault();
    _toggleVerticalProfile();
    return;
  }

  if ("wasdqe".includes(k)) keysDown.add(k);
  if (e.key === "Shift") shiftHeld = true;

  // Hidden: Konami code → cinematic mode (↑↑↓↓←→←→BA)
  _konamiBuffer.push(e.key);
  if (_konamiBuffer.length > 10) _konamiBuffer.shift();
  if (
    _konamiBuffer.join(",") ===
    "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a"
  ) {
    _konamiBuffer.length = 0;
    _cinematicMode = !_cinematicMode;
    if (bloomPass)
      bloomPass.strength = _cinematicMode ? 1.1 : BLOOM_PRESETS[bloomLevel];
    renderer.toneMappingExposure = _cinematicMode ? 1.8 : 1.4;
    // The day/night pass owns the density otherwise; say so while this mode
    // holds it, or the next tick two seconds later takes it back.
    setFogDensityLocked(_cinematicMode);
    scene.fog.density = _cinematicMode ? 0.01 : 0.017;
    const lbl =
      document.getElementById("bloom-label") || document.createElement("div");
    if (!lbl.id) {
      lbl.id = "bloom-label";
      lbl.className = "bloom-label";
      document.body.appendChild(lbl);
    }
    lbl.textContent = _cinematicMode ? "CINEMATIC MODE" : "STANDARD MODE";
    lbl.classList.remove("hidden");
    clearTimeout(lbl._timer);
    lbl._timer = setTimeout(() => lbl.classList.add("hidden"), 2500);
  }
});
const _konamiBuffer = [];
let _cinematicMode = false;

document.addEventListener("keyup", (e) => {
  keysDown.delete(e.key.toLowerCase());
  if (e.key === "Shift") shiftHeld = false;
});
window.addEventListener("blur", () => {
  keysDown.clear();
  shiftHeld = false;
});

const _wForward = new THREE.Vector3();
const _wRight = new THREE.Vector3();
const _wMove = new THREE.Vector3();

function getWASDInput() {
  // Skip camera matrix work when no movement keys are pressed
  if (keysDown.size === 0) {
    _wMove.set(0, 0, 0);
    return _wMove;
  }
  camera.getWorldDirection(_wForward);
  _wForward.y = 0;
  _wForward.normalize();
  _wRight.crossVectors(_wForward, camera.up).normalize();
  _wMove.set(0, 0, 0);
  if (keysDown.has("w")) _wMove.add(_wForward);
  if (keysDown.has("s")) _wMove.sub(_wForward);
  if (keysDown.has("d")) _wMove.add(_wRight);
  if (keysDown.has("a")) _wMove.sub(_wRight);
  if (keysDown.has("q")) _wMove.y -= 1;
  if (keysDown.has("e")) _wMove.y += 1;
  return _wMove;
}

function updateWASD(delta) {
  const input = getWASDInput();
  const hasInput = input.lengthSq() > 0;

  if (hasInput) {
    moveVelocity = Math.min(moveVelocity + MOVE_ACCEL * delta, 1);
  } else {
    moveVelocity = Math.max(moveVelocity - MOVE_DECEL * delta, 0);
    if (moveVelocity < 0.001) {
      moveVelocity = 0;
      return;
    }
  }

  resetIdleTimer();

  const heightScale = Math.max(0.2, Math.min(3.0, camera.position.y / 8));
  const speed =
    MOVE_BASE_SPEED * heightScale * (shiftHeld ? MOVE_SPRINT_MULT : 1);
  const factor = moveVelocity * moveVelocity * (3 - 2 * moveVelocity);

  // Hidden: speed lines activate during sprint movement
  if (speedLinesEl) {
    speedLinesEl.classList.toggle("active", shiftHeld && factor > 0.5);
  }
  if (hasInput) input.normalize();

  const move = input.multiplyScalar(speed * factor * delta);
  camera.position.add(move);
  controls.target.add(move);

  // Clamp camera to 60% of ground extent (40% margin on each side)
  const LIMIT = 48; // GROUND_SIZE(160) * 0.5 * 0.6
  camera.position.x = Math.max(-LIMIT, Math.min(LIMIT, camera.position.x));
  camera.position.z = Math.max(-LIMIT, Math.min(LIMIT, camera.position.z));
  controls.target.x = Math.max(-LIMIT, Math.min(LIMIT, controls.target.x));
  controls.target.z = Math.max(-LIMIT, Math.min(LIMIT, controls.target.z));
}

const _fwOrbitOff = new THREE.Vector3();
function updateFollowWASD(delta) {
  const input = getWASDInput();
  const hasInput = input.lengthSq() > 0;

  if (hasInput) {
    moveVelocity = Math.min(moveVelocity + MOVE_ACCEL * delta, 1);
  } else {
    moveVelocity = Math.max(moveVelocity - MOVE_DECEL * delta, 0);
    if (moveVelocity < 0.001) {
      moveVelocity = 0;
      return;
    }
  }

  if (!followTarget) return;
  const factor = moveVelocity * moveVelocity * (3 - 2 * moveVelocity);
  const orbitSpeed = 2.0 * factor * delta * (shiftHeld ? 2.0 : 1.0);
  const targetPos = followTarget.group.position;

  const horz = (keysDown.has("d") ? 1 : 0) - (keysDown.has("a") ? 1 : 0);
  if (horz !== 0) {
    _fwOrbitOff.subVectors(camera.position, targetPos);
    const angle = horz * orbitSpeed;
    const cos = Math.cos(angle),
      sin = Math.sin(angle);
    const nx = _fwOrbitOff.x * cos - _fwOrbitOff.z * sin;
    const nz = _fwOrbitOff.x * sin + _fwOrbitOff.z * cos;
    _fwOrbitOff.x = nx;
    _fwOrbitOff.z = nz;
    camera.position.copy(targetPos).add(_fwOrbitOff);
  }

  const vert = (keysDown.has("w") ? 1 : 0) - (keysDown.has("s") ? 1 : 0);
  if (vert !== 0) {
    _fwOrbitOff.subVectors(camera.position, targetPos);
    const r = _fwOrbitOff.length();
    const currentAngle = Math.asin(_fwOrbitOff.y / r);
    const newAngle = Math.max(
      -0.3,
      Math.min(Math.PI * 0.45, currentAngle + vert * orbitSpeed),
    );
    const rXZ = r * Math.cos(newAngle);
    const dirLen =
      Math.sqrt(
        _fwOrbitOff.x * _fwOrbitOff.x + _fwOrbitOff.z * _fwOrbitOff.z,
      ) || 1;
    _fwOrbitOff.x = (_fwOrbitOff.x / dirLen) * rXZ;
    _fwOrbitOff.y = r * Math.sin(newAngle);
    _fwOrbitOff.z = (_fwOrbitOff.z / dirLen) * rXZ;
    camera.position.copy(targetPos).add(_fwOrbitOff);
  }
}

// ── Unified Info panel (Spotter + Session) ──
function toggleInfoPanel() {
  let overlay = document.getElementById("info-overlay");
  if (overlay) {
    overlay.classList.toggle("hidden");
    if (!overlay.classList.contains("hidden")) renderInfoPanel();
    return;
  }
  overlay = document.createElement("div");
  overlay.id = "info-overlay";
  overlay.className = "overlay-backdrop";
  overlay.innerHTML = `<div class="overlay-panel overlay-panel-lg">
    <div class="overlay-header">
      <span class="overlay-title">SPOTTER COLLECTION</span>
      <button type="button" class="detail-close overlay-close-btn" aria-label="Close">&times;</button>
    </div>
    <div id="info-summary" class="spotter-summary"></div>
    <div id="info-fleet" class="spotter-fleet-section"></div>
    <div id="info-airlines" class="spotter-airline-section"></div>
    <div id="info-spotter-grid" class="spotter-grid"></div>
    <div class="info-session-section">
      <div class="overlay-section-header">SESSION</div>
      <div class="stats-grid info-session-grid">
        <div class="stats-cell"><div class="stats-label">TIME</div><div class="stats-value" id="info-time">--</div></div>
        <div class="stats-cell"><div class="stats-label">SEEN</div><div class="stats-value" id="info-seen">0</div></div>
        <div class="stats-cell"><div class="stats-label">TYPES</div><div class="stats-value" id="info-types">0</div></div>
        <div class="stats-cell"><div class="stats-label">AIRLINES</div><div class="stats-value" id="info-airlines">0</div></div>
        <div class="stats-cell"><div class="stats-label">PEAK</div><div class="stats-value" id="info-peak">0</div></div>
        <div class="stats-cell"><div class="stats-label">AIRPORTS</div><div class="stats-value" id="info-cities">0</div></div>
      </div>
    </div>
    <div id="info-highlights" class="info-highlights-section"></div>
    <div class="overlay-footer"><span class="overlay-hint">I to toggle · click outside to close</span></div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.add("hidden");
  });
  overlay
    .querySelector(".overlay-close-btn")
    ?.addEventListener("click", () => overlay.classList.add("hidden"));
  renderInfoPanel();
}

function renderInfoPanel() {
  // Session stats
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
  const el = (id) => document.getElementById(id);
  if (el("info-time")) el("info-time").textContent = timeStr;
  if (el("info-seen")) el("info-seen").textContent = sessionStats.seen.size;
  if (el("info-types")) el("info-types").textContent = sessionStats.types.size;
  if (el("info-airlines"))
    el("info-airlines").textContent = sessionStats.airlines.size;
  if (el("info-peak")) el("info-peak").textContent = sessionStats.peak;
  if (el("info-cities"))
    el("info-cities").textContent = sessionStats.cities.size;

  // Spotter grid
  const grid = document.getElementById("info-spotter-grid");
  const summary = document.getElementById("info-summary");
  const airlinesEl = document.getElementById("info-airlines");
  if (!grid) return;
  const spotted = SPOTTER_TYPES.filter((t) => spotterBook[t.code]);
  if (summary)
    summary.textContent = `${spotted.length} / ${SPOTTER_TYPES.length} types spotted`;

  // Fleet mix
  const fleetEl = document.getElementById("info-fleet");
  if (fleetEl && _lastFleetMix.total > 0) {
    const fm = _lastFleetMix;
    const bar = (label, count, color) => {
      const pct = Math.round((count / (fm.total || 1)) * 100);
      return `<div class="fleet-bar-row"><span class="fleet-bar-count" style="color:${color}">${count}</span><div class="fleet-bar-track"><div class="fleet-bar-fill" style="width:${pct}%;background:${color}"></div></div><span class="fleet-bar-label">${label}</span></div>`;
    };
    const p = fm.phases;
    const bucketKeys = Object.keys(fm.altBuckets)
      .map(Number)
      .sort((a, b) => a - b);
    const maxB = Math.max(...Object.values(fm.altBuckets), 1);
    const altHtml =
      bucketKeys.length > 0
        ? `<div class="fleet-alt-section"><div class="fleet-alt-bars">${bucketKeys
            .map((k) => {
              const pct = Math.round((fm.altBuckets[k] / maxB) * 100);
              const color =
                k >= 30 ? "#5aacff" : k >= 15 ? "#44dd88" : "#ee8833";
              return `<div class="fleet-alt-bar" title="FL${k}0-${k + 5}0: ${fm.altBuckets[k]}" style="height:${pct}%;background:${color}"></div>`;
            })
            .join(
              "",
            )}</div><div class="fleet-alt-labels"><span>${bucketKeys[0]}k</span><span>${bucketKeys[bucketKeys.length - 1] + 5}k</span></div></div>`
        : "";

    fleetEl.innerHTML = `<div class="spotter-airline-title">FLEET MIX · ${fm.total} AIRCRAFT</div>
      <div class="fleet-bars">${bar("NARROW", fm.NB, "#5aacff")}${bar("WIDE", fm.WB, "#ee8833")}${bar("REGIONAL", fm.RJ, "#44dd88")}${bar("BIZJET", fm.BJ, "#cc88ff")}</div>
      <div class="fleet-phase-row"><span style="color:#6ec87a">CLB ${p.CLB}</span><span style="color:rgba(196,160,88,0.8)">CRZ ${p.CRZ}</span><span style="color:#e8836a">DES ${p.DES}</span><span style="color:rgba(255,255,255,0.4)">GND ${p.GND}</span></div>
      ${altHtml}`;
    fleetEl.style.display = "";
  } else if (fleetEl) {
    fleetEl.style.display = "none";
  }

  // Airlines
  if (airlinesEl) {
    const sortedAirlines = Object.entries(_lastAirlineStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    if (sortedAirlines.length > 0) {
      airlinesEl.innerHTML = `<div class="spotter-airline-title">TOP AIRLINES</div>
        <div class="spotter-airline-grid">${sortedAirlines
          .map(([code, cnt]) => {
            const name = _getAirlineName(code);
            return `<div class="spotter-airline-item"><span class="spotter-airline-name">${name || code}</span><span class="spotter-airline-cnt">${cnt}</span></div>`;
          })
          .join("")}</div>`;
      airlinesEl.style.display = "";
    } else {
      airlinesEl.style.display = "none";
    }
  }

  grid.innerHTML = SPOTTER_TYPES.map((t) => {
    const count = spotterBook[t.code] || 0;
    const cls = count > 0 ? "spotted" : "unspotted";
    return `<div class="spotter-card ${cls}">
      <span class="spotter-card-type">${t.code}</span>
      <span class="spotter-card-name">${t.name}</span>
      ${count > 0 ? `<span class="spotter-card-count">×${count}</span>` : ""}
    </div>`;
  }).join("");

  // ── E-2: Session Highlights ──
  const hlEl = document.getElementById("info-highlights");
  if (hlEl) {
    const { fastest, highest, typeCounts } = sessionStats;
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    // CO₂ estimate: avg 1500km flight, 0.090 kg CO₂/seat-km, 180 seats (educational)
    const co2Tonnes = (
      (sessionStats.seen.size * 1500 * 0.09 * 180) /
      1000
    ).toFixed(0);
    const fastStr =
      fastest.gsKts > 0
        ? `<div class="hl-row"><span class="hl-label">FASTEST</span><span class="hl-val">${fastest.callsign}</span><span class="hl-sub">${fastest.type ? fastest.type + " · " : ""}${fastest.gsKts} kt</span></div>`
        : "";
    const highStr =
      highest.altFt > 0
        ? `<div class="hl-row"><span class="hl-label">HIGHEST</span><span class="hl-val">${highest.callsign}</span><span class="hl-sub">FL${Math.round(highest.altFt / 100)}</span></div>`
        : "";
    const typeStr = topType
      ? `<div class="hl-row"><span class="hl-label">TOP TYPE</span><span class="hl-val">${topType[0]}</span><span class="hl-sub">×${topType[1]}</span></div>`
      : "";
    const co2Str =
      sessionStats.seen.size > 0
        ? `<div class="hl-co2"><span class="hl-co2-val">~${co2Tonnes}t CO₂</span><span class="hl-co2-note">fleet estimate · ICAO CORSIA targets carbon-neutral growth from 2027</span></div>`
        : "";
    hlEl.innerHTML =
      fastStr || highStr || typeStr
        ? `<div class="overlay-section-header">HIGHLIGHTS</div><div class="hl-rows">${fastStr}${highStr}${typeStr}${co2Str}</div>`
        : "";
  }
}

// ── T2-15: Emergency alert banner ──
let emergencyDismissed = new Set();
function checkEmergencySquawks() {
  if (!aircraftManager) return;
  for (const [, ac] of aircraftManager.aircraft) {
    if (ac.fadingOut) continue;
    const sq = ac.data.squawk;
    if (sq === "7700" && !emergencyDismissed.has(ac.data.icao24)) {
      const banner = document.getElementById("emergency-banner");
      const textEl = document.getElementById("emergency-text");
      if (banner && textEl) {
        const cs = ac.data.callsign || ac.data.icao24;
        textEl.textContent = `SQUAWK 7700 — ${cs} EMERGENCY`;
        banner.classList.remove("hidden");
        banner._icao = ac.data.icao24;
      }
      return;
    }
  }
}

// Dismiss emergency banner
document.getElementById("emergency-dismiss")?.addEventListener("click", () => {
  const banner = document.getElementById("emergency-banner");
  if (banner) {
    if (banner._icao) emergencyDismissed.add(banner._icao);
    banner.classList.add("hidden");
  }
});

// ── A3: FIR Entry/Exit Logger ──
const _aircraftFIR = new Map(); // icao24 → last known FIR id

function trackFIRTransitions() {
  if (!aircraftManager) return;

  for (const [, ac] of aircraftManager.aircraft) {
    if (ac.fadingOut || ac.data.latitude == null) continue;
    const icao = ac.data.icao24;
    const currentFIR = getFIRForPosition(ac.data.latitude, ac.data.longitude);
    if (currentFIR) {
      _aircraftFIR.set(icao, currentFIR);
    }
  }

  // Clean up stale entries
  for (const icao of _aircraftFIR.keys()) {
    if (!aircraftManager.aircraft.has(icao)) {
      _aircraftFIR.delete(icao);
    }
  }
}

// ── S3: Emergency Event Timeline ──
const _emergencyEvents = new Map(); // icao24 → event object
let _emergencyTimelineEl = null;

function trackEmergencyEvents() {
  if (!aircraftManager) return;
  const now = Date.now();

  for (const [, ac] of aircraftManager.aircraft) {
    if (ac.fadingOut) continue;
    const sq = ac.data.squawk;
    const icao = ac.data.icao24;
    const isEmergency =
      sq === "7500" ||
      sq === "7600" ||
      sq === "7700" ||
      ac.data.emergency === "general";

    if (isEmergency && !_emergencyEvents.has(icao)) {
      // New emergency detected
      _emergencyEvents.set(icao, {
        icao,
        callsign: ac.data.callsign || icao,
        squawk: sq,
        type: ac.data.aircraftType || "--",
        detectedAt: now,
        altitude:
          ac.data.baroAltitude != null
            ? Math.round(ac.data.baroAltitude * 3.28084)
            : null,
        lat: ac.data.latitude,
        lon: ac.data.longitude,
        resolved: false,
        resolvedAt: null,
      });
    } else if (
      !isEmergency &&
      _emergencyEvents.has(icao) &&
      !_emergencyEvents.get(icao).resolved
    ) {
      // Emergency resolved
      const evt = _emergencyEvents.get(icao);
      evt.resolved = true;
      evt.resolvedAt = now;
    }

    // Update altitude for active emergencies
    if (_emergencyEvents.has(icao) && !_emergencyEvents.get(icao).resolved) {
      const evt = _emergencyEvents.get(icao);
      evt.altitude =
        ac.data.baroAltitude != null
          ? Math.round(ac.data.baroAltitude * 3.28084)
          : evt.altitude;
      evt.lat = ac.data.latitude || evt.lat;
      evt.lon = ac.data.longitude || evt.lon;
    }
  }

  // Remove events older than 30 min that are resolved
  for (const [icao, evt] of _emergencyEvents) {
    if (evt.resolved && evt.resolvedAt && now - evt.resolvedAt > 1800000) {
      _emergencyEvents.delete(icao);
    }
  }

  renderEmergencyTimeline();
}

function renderEmergencyTimeline() {
  if (_emergencyEvents.size === 0) {
    if (_emergencyTimelineEl) _emergencyTimelineEl.style.display = "none";
    return;
  }

  if (!_emergencyTimelineEl) {
    _emergencyTimelineEl = document.createElement("div");
    _emergencyTimelineEl.id = "emergency-timeline";
    _emergencyTimelineEl.className = "stratum-widget emergency-timeline-widget";
    document.body.appendChild(_emergencyTimelineEl);
    // Position below HUD
    const hud = document.getElementById("hud");
    if (hud) {
      const hudRect = hud.getBoundingClientRect();
      _emergencyTimelineEl.style.top = `${hudRect.bottom + 10}px`;
    } else {
      _emergencyTimelineEl.style.top = "200px";
    }
  }

  _emergencyTimelineEl.style.display = "";
  const sqLabels = { 7500: "HIJACK", 7600: "COMM FAIL", 7700: "EMERGENCY" };
  let html =
    '<div class="widget-label" style="color:rgba(232,68,68,0.7)">EMERGENCY EVENTS</div>';

  for (const [, evt] of _emergencyEvents) {
    const elapsed = Math.round((Date.now() - evt.detectedAt) / 60000);
    const sqLabel = sqLabels[evt.squawk] || "ALERT";
    const altStr =
      evt.altitude != null ? `FL${Math.round(evt.altitude / 100)}` : "--";
    const statusCls = evt.resolved
      ? "emergency-status--resolved"
      : "emergency-status--active";
    const statusText = evt.resolved ? "RESOLVED" : "ACTIVE";
    html += `<div class="emergency-event">
      <div class="emergency-event-header">
        <span class="emergency-squawk">${evt.squawk} ${sqLabel}</span>
        <span class="emergency-status ${statusCls}">${statusText}</span>
      </div>
      <div class="emergency-detail">
        ${evt.callsign} · ${evt.type} · ${altStr} · ${elapsed}min ago
      </div>
    </div>`;
  }

  _emergencyTimelineEl.innerHTML = html;
}

// ── T2-18: Distance rings ──
function toggleDistanceRings() {
  if (distanceRingsGroup) {
    scene.remove(distanceRingsGroup);
    distanceRingsGroup.traverse((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
    distanceRingsGroup = null;
  }
  if (!distanceRingsVisible) return;

  distanceRingsGroup = new THREE.Group();
  const GEO_SCALE = 40;
  const nmRadii = [10, 25, 50]; // nautical miles
  for (const nm of nmRadii) {
    const kmRadius = nm * 1.852;
    const sceneRadius = (kmRadius / 111) * GEO_SCALE;
    const ringGeo = new THREE.RingGeometry(
      sceneRadius - 0.02,
      sceneRadius + 0.02,
      64,
    );
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc4a058,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    distanceRingsGroup.add(ring);
  }
  scene.add(distanceRingsGroup);
}

// ── T3-13: Flight history log ──
function addToHistory(d) {
  const entry = {
    time: new Date().toISOString().substr(11, 5),
    callsign: d.callsign || d.icao24,
    type: d.aircraftType || "",
    route: d.origin && d.destination ? `${d.origin}→${d.destination}` : "",
    altitude: d.altitude,
    icao24: d.icao24,
  };
  // Avoid duplicates within 30s
  if (flightHistory.length > 0 && flightHistory[0].icao24 === entry.icao24)
    return;
  flightHistory.unshift(entry);
  if (flightHistory.length > 100) flightHistory.length = 100;
}

function toggleHistoryOverlay() {
  let overlay = document.getElementById("history-overlay");
  if (overlay) {
    overlay.classList.toggle("hidden");
    return;
  }

  overlay = document.createElement("div");
  overlay.id = "history-overlay";
  overlay.className = "overlay-backdrop";
  overlay.innerHTML = `<div class="overlay-panel overlay-panel-wide">
    <div class="overlay-header">
      <span class="overlay-title">FLIGHT HISTORY</span>
      <button type="button" class="detail-close overlay-close-btn" aria-label="Close">&times;</button>
    </div>
    <div id="history-list" class="history-list"></div>
    <div class="overlay-footer"><span class="overlay-hint">H to toggle · click outside to close</span></div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.add("hidden");
  });
  overlay
    .querySelector(".overlay-close-btn")
    ?.addEventListener("click", () => overlay.classList.add("hidden"));
  renderHistoryList();
}

function renderHistoryList() {
  const list = document.getElementById("history-list");
  if (!list) return;
  if (flightHistory.length === 0) {
    list.innerHTML =
      '<div class="overlay-hint" style="text-align:center;padding:20px">No flights tracked yet</div>';
    return;
  }
  list.innerHTML = flightHistory
    .map(
      (h) => `<div class="history-item" data-icao="${h.icao24}">
    <span class="history-time">${h.time}Z</span>
    <span class="history-cs">${h.callsign}</span>
    <span class="history-type">${h.type}</span>
    <span class="history-route">${h.route}</span>
  </div>`,
    )
    .join("");
  list.querySelectorAll(".history-item").forEach((el) => {
    el.addEventListener("click", () => {
      if (!aircraftManager) return;
      const ac = aircraftManager.aircraft.get(el.dataset.icao);
      if (ac && !ac.fadingOut) {
        handleAircraftSelect(ac);
        document.getElementById("history-overlay")?.classList.add("hidden");
      }
    });
  });
}

// ── T3-07: Spotter collection book ──
const SPOTTER_TYPES = [
  { code: "A320", name: "Airbus A320" },
  { code: "A321", name: "Airbus A321" },
  { code: "A330", name: "Airbus A330" },
  { code: "A350", name: "Airbus A350" },
  { code: "A380", name: "Airbus A380" },
  { code: "B737", name: "Boeing 737" },
  { code: "B738", name: "Boeing 737-800" },
  { code: "B739", name: "Boeing 737-900" },
  { code: "B38M", name: "Boeing 737 MAX 8" },
  { code: "B39M", name: "Boeing 737 MAX 9" },
  { code: "B752", name: "Boeing 757" },
  { code: "B763", name: "Boeing 767" },
  { code: "B772", name: "Boeing 777-200" },
  { code: "B77W", name: "Boeing 777-300ER" },
  { code: "B788", name: "Boeing 787-8" },
  { code: "B789", name: "Boeing 787-9" },
  { code: "B78X", name: "Boeing 787-10" },
  { code: "B744", name: "Boeing 747" },
  { code: "E190", name: "Embraer E190" },
  { code: "E75L", name: "Embraer E175" },
  { code: "CRJ9", name: "CRJ-900" },
  { code: "CRJ7", name: "CRJ-700" },
  { code: "DH8D", name: "Dash 8 Q400" },
  { code: "AT76", name: "ATR 72" },
  { code: "A20N", name: "A320neo" },
  { code: "A21N", name: "A321neo" },
  { code: "BCS3", name: "Airbus A220-300" },
  { code: "BCS1", name: "Airbus A220-100" },
  { code: "GLF6", name: "Gulfstream G650" },
  { code: "C68A", name: "Citation Latitude" },
];

// (toggleSpotterBook / renderSpotterGrid merged into toggleInfoPanel above)

// ── T3-15: Shareable view links ──
function shareViewLink() {
  const p = camera.position;
  const t = controls.target;
  const city = activeCity?.code || "";
  const params = new URLSearchParams({
    cx: p.x.toFixed(1),
    cy: p.y.toFixed(1),
    cz: p.z.toFixed(1),
    tx: t.x.toFixed(1),
    ty: t.y.toFixed(1),
    tz: t.z.toFixed(1),
    city,
  });
  const url = `${window.location.origin}${window.location.pathname}?${params}`;
  navigator.clipboard.writeText(url).then(() => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = "View link copied to clipboard";
      toast.classList.remove("hidden");
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => toast.classList.add("hidden"), 2500);
    }
  });
}

function restoreViewFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("cx")) {
    const cx = parseFloat(params.get("cx")),
      cy = parseFloat(params.get("cy")),
      cz = parseFloat(params.get("cz"));
    const tx = parseFloat(params.get("tx")),
      ty = parseFloat(params.get("ty")),
      tz = parseFloat(params.get("tz"));
    if (!isNaN(cx)) {
      camera.position.set(cx, cy, cz);
      controls.target.set(tx, ty, tz);
      introActive = false;
      controls.enabled = true;
    }
  }
  return params.get("city") || null;
}

// ── T3-10: TCAS traffic display ──
let _tcasEl = null;
let _lastTCASUpdate = 0;
let _lastFuelRingUpdate = 0;
let _lastTCASHash = "";
function updateTCASDisplay(followAc, allAircraft, elapsed) {
  // Throttle to ~2 Hz — TCAS doesn't need 60fps updates
  if (elapsed - _lastTCASUpdate < 0.5) return;
  _lastTCASUpdate = elapsed;
  const threats = getTCASTraffic(followAc, allAircraft);
  if (threats.length === 0) {
    hideTCASDisplay();
    return;
  }
  if (!_tcasEl) {
    _tcasEl = document.createElement("div");
    _tcasEl.id = "tcas-display";
    _tcasEl.className = "stratum-widget tcas-widget";
    document.body.appendChild(_tcasEl);
    _tcasEl.addEventListener("mouseenter", _tcasOpen);
    _tcasEl.addEventListener("mouseleave", _tcasScheduleClose);
  }
  _tcasEl.style.display = "";
  const top5 = threats.slice(0, 5);
  // Skip innerHTML rebuild if data unchanged
  const hash = top5
    .map(
      (t) =>
        `${t.icao24}${t.dist}${t.altDiff}${t.threat}${t.separation}${t.cpaDist}${t.cpaTime}`,
    )
    .join("|");
  if (hash === _lastTCASHash) return;
  _lastTCASHash = hash;
  // A1: Count separation violations/reduced
  const violations = threats.filter((t) => t.separation === "VIOLATION").length;
  const reduced = threats.filter((t) => t.separation === "REDUCED").length;
  let sepLabel = '<span style="color:#44dd88">SEP OK</span>';
  if (violations > 0)
    sepLabel = `<span style="color:#ff4444">SEP LOSS ×${violations}</span>`;
  else if (reduced > 0)
    sepLabel = `<span style="color:#ffcc00">SEP REDUCED ×${reduced}</span>`;
  _tcasEl.innerHTML =
    `<div class="widget-label">TCAS TRAFFIC · ${sepLabel}</div>` +
    top5
      .map((t) => {
        const color =
          t.threat === "red"
            ? "#ff4444"
            : t.threat === "yellow"
              ? "#ffcc00"
              : "#44dd88";
        const arrow = t.altDiff > 100 ? "▲" : t.altDiff < -100 ? "▼" : "—";
        const sepIcon =
          t.separation === "VIOLATION"
            ? " ⚠"
            : t.separation === "REDUCED"
              ? " !"
              : "";
        // S2: CPA prediction
        const cpa =
          t.cpaDist != null && t.cpaTime > 0
            ? ` CPA ${t.cpaDist}nm/${t.cpaTime}s`
            : "";
        return `<div style="color:${color};margin:2px 0">◆ ${(t.callsign || t.icao24).padEnd(8)} ${t.distNm}nm ${arrow}${Math.abs(t.altDiff)}ft${sepIcon}${cpa}</div>`;
      })
      .join("");
}
function hideTCASDisplay() {
  if (_tcasEl) {
    _tcasEl.style.display = "none";
    _tcasEl.classList.remove("is-open");
  }
}

// ── T3-02: Weather panel (integrated into HUD) ──
let _wxExpanded = false;

// ── The weather tile cycles its readings ──
// More is measured than fits: pressure, visibility, cloud, turbulence, density
// altitude. Rather than pick one and bury the rest behind the expander, the
// third line turns over slowly. Slowly, and with a reserved height and a
// cross-fade rather than a slide, because a line that moves or resizes in a
// quiet panel is the thing this project already removed once from the clock.
// It holds while the cursor is on the tile, so a reading you are looking at
// cannot leave mid-sentence.
const _WX_ROTATION = [
  ["wind", "hud-wx-wind"],
  ["QNH", "hud-wx-pressure"],
  ["VIS", "hud-wx-vis"],
  ["CLOUD", "hud-wx-cloud"],
  ["TURB", "hud-wx-turb"],
];
let _wxRotIdx = 0;
let _wxRotHold = false;
function _startWxRotation() {
  const out = document.getElementById("hud-wx-rot");
  const tile = document.getElementById("hud-weather");
  if (!out || !tile) return;
  tile.addEventListener("pointerenter", () => { _wxRotHold = true; });
  tile.addEventListener("pointerleave", () => { _wxRotHold = false; });
  const step = () => {
    if (_wxRotHold || _wxExpanded) return;
    // Skip anything the feed has not filled, so the line never shows a dash.
    for (let n = 0; n < _WX_ROTATION.length; n++) {
      _wxRotIdx = (_wxRotIdx + 1) % _WX_ROTATION.length;
      const [label, id] = _WX_ROTATION[_wxRotIdx];
      const v = document.getElementById(id)?.textContent?.trim();
      if (v && v !== "--" && v !== "") {
        out.style.opacity = "0";
        setTimeout(() => {
          out.textContent = label === "wind" ? v : `${label} ${v}`;
          out.style.opacity = "1";
        }, 260);
        return;
      }
    }
  };
  setInterval(step, 5200);
  step();
}

// Anything that is not the weather closes the weather. An expanded forecast is
// 450px of panel sitting on top of four tiles that are the reason the panel is
// there, so it should not need its own dismissal: pressing another tile, or
// the map, or anywhere else, means you are done with it. Capture phase, so the
// tile it came from is folded before that tile's own handler runs and the two
// do not fight over the same press.
function _collapseWeather() {
  if (!_wxExpanded) return;
  _wxExpanded = false;
  document.getElementById("hud-wx-detail")?.classList.remove("open");
}
document.addEventListener(
  "pointerdown",
  (e) => {
    if (!_wxExpanded) return;
    if (e.target.closest && e.target.closest("#hud-weather")) return;
    _collapseWeather();
  },
  true,
);

function initWeatherPanel() {
  // The whole tile opens it, not just the temperature row. A widget that
  // responds on one line of itself reads as broken everywhere else.
  const toggle = document.getElementById("hud-weather");
  if (toggle) {
    toggle.addEventListener("click", (e) => {
      // The detail is inside the tile, so a press on a control in there must
      // not fold the thing it is being used on.
      if (e.target.closest("#hud-wx-detail")) return;
      _wxExpanded = !_wxExpanded;
      const detail = document.getElementById("hud-wx-detail");
      if (detail) detail.classList.toggle("open", _wxExpanded);
      // Re-draw chart after expand — panel was display:none so clientWidth was 0
      if (_wxExpanded && window._cachedWeather?.hourly?.length > 0) {
        requestAnimationFrame(() =>
          _drawHourlyChart(window._cachedWeather.hourly),
        );
      }
    });
  }
}

async function updateWeatherWidget() {
  const { lat, lon } = getUserLocation();
  const data = await fetchWeather(lat, lon);
  if (!data) return;
  window._cachedWeather = data;

  // Pass timezone info to HUD clock for UTC/Local cycling
  setLocalTimezone(data.utcOffsetSeconds, data.timezoneAbbr);

  const desc = weatherDescription(data.weatherCode);
  const windDir = windDirToCardinal(data.windDir);
  const vis = formatVisibility(data.visibility);
  const cat = flightCategory(data.visibility, data.cloudCover);

  // Current conditions — main line
  const set = (id, val) => {
    const e = document.getElementById(id);
    if (e) e.textContent = val;
  };
  document.getElementById("hud-weather")?.classList.remove("is-empty");
  set("hud-wx-icon", weatherIcon(data.weatherCode));
  set("hud-wx-temp", `${Math.round(data.temp)}°`);
  set("hud-wx-desc", desc);
  // Today's range, which is the line the reference widget carries under the
  // condition and the one thing a temperature on its own never tells you:
  // whether 17 is on the way up or on the way down.
  const rangeEl = document.getElementById("hud-wx-range");
  if (data.daily && data.daily.length && data.daily[0].tempMax != null) {
    const lo = Math.round(data.daily[0].tempMin);
    const hi = Math.round(data.daily[0].tempMax);
    set("hud-wx-lo", `${lo}°`);
    set("hud-wx-hi", `${hi}°`);
    // This is today's row, shown alone, so it fills its track and the numbers
    // at the ends are its own — put today on the week's scale here and the
    // 17° and 24° printed beside it would read as the week's ends instead.
    // The seven-day list below is where the week's scale belongs, because
    // seven rows sharing one make it legible; one row cannot.
    //
    // What the bar carries instead is the same grade every row down there
    // carries: coloured from the temperature of its own low to the
    // temperature of its own high, so a cold day looks cold before it is
    // read.
    const seg = document.getElementById("hud-wx-seg");
    if (seg) {
      seg.style.left = "0";
      seg.style.width = "100%";
      seg.style.background = `linear-gradient(90deg, ${_tempHue(lo)}, ${_tempHue(hi)})`;
    }
    const dot = document.getElementById("hud-wx-dot");
    if (dot) {
      // Positioned inside today's segment, so it can never sit outside the
      // part of the bar that is today. A flat day would divide by zero.
      const span = Math.max(1, hi - lo);
      const at = Math.max(0, Math.min(1, (data.temp - lo) / span));
      dot.style.left = `${at * 100}%`;
    }
    rangeEl?.classList.remove("hidden");
  } else {
    rangeEl?.classList.add("hidden");
  }
  // Show gusts in compact line when notably higher: "SSW 15G20kt"
  const hasGusts =
    data.windGusts != null &&
    data.windGusts >= data.windSpeed * 1.2 &&
    data.windGusts >= 10;
  const windCompact = hasGusts
    ? `${windDir} ${Math.round(data.windSpeed)}G${Math.round(data.windGusts)}kt`
    : `${windDir} ${Math.round(data.windSpeed)}kt`;
  set("hud-wx-wind", windCompact);
  const catEl = document.getElementById("hud-wx-cat");
  if (catEl) {
    catEl.textContent = cat.label;
    catEl.style.color = cat.color;
    catEl.dataset.cat = cat.label;
  }

  // Detail grid values — color-coded by severity
  // setColor resets inline color to '' (CSS default) when col is null/undefined
  const setColor = (id, txt, col) => {
    const e = document.getElementById(id);
    if (e) {
      e.textContent = txt;
      e.style.color = col || "";
    }
  };

  // Temperature: blue=cold, white=moderate, orange=hot
  const tempC = Math.round(data.temp);
  const tempColor = tempC <= 0 ? "#5aacff" : tempC >= 32 ? "#ee8833" : null;
  setColor("hud-wx-temp", `${tempC}°`, tempColor);
  set("hud-wx-feels", `${Math.round(data.feelsLike)}°`);
  set(
    "hud-wx-dew",
    data.dewpoint != null ? `${Math.round(data.dewpoint)}°` : "--",
  );

  // Humidity: green<70, yellow 70-85, orange >85, red >95
  const humColor =
    data.humidity >= 95
      ? "#b05048"
      : data.humidity >= 85
        ? "#ee8833"
        : data.humidity >= 70
          ? "#e8c36a"
          : null;
  setColor("hud-wx-humidity", `${data.humidity}%`, humColor);

  set("hud-wx-pressure", `${Math.round(data.pressure)} hPa`);

  // VIS: color matches flight category
  const visKm = data.visibility / 1000;
  const visColor =
    visKm >= 8
      ? "#52a86c"
      : visKm >= 5
        ? "#5aacff"
        : visKm >= 1.6
          ? "#ee8833"
          : "#cc44cc";
  setColor("hud-wx-vis", vis, visColor);

  // CLOUD: green=clear, neutral=scattered, amber=overcast
  const cloudColor =
    data.cloudCover < 25
      ? "#52a86c"
      : data.cloudCover < 65
        ? null
        : "rgba(200,170,100,0.9)";
  setColor("hud-wx-cloud", `${data.cloudCover}%`, cloudColor);

  // GUSTS: colored by strength
  if (data.windGusts != null) {
    const gColor =
      data.windGusts < 15
        ? null
        : data.windGusts < 25
          ? "#e8c36a"
          : data.windGusts < 35
            ? "#ee8833"
            : "#ff5555";
    setColor("hud-wx-gusts", `${Math.round(data.windGusts)}kt`, gColor);
  } else {
    set("hud-wx-gusts", "--");
  }

  // Density altitude
  const dalt = computeDensityAltitude(data.pressure, data.temp);
  if (dalt != null) {
    const daColor =
      dalt < 0
        ? "#52a86c"
        : dalt < 1500
          ? null
          : dalt < 3500
            ? "#e8c36a"
            : "#ee8833";
    setColor("hud-wx-dalt", `${dalt > 0 ? "+" : ""}${dalt}ft`, daColor);
  } else {
    set("hud-wx-dalt", "--");
  }

  // Turbulence estimate
  const turb = estimateTurbulence(data);
  const turbEl = document.getElementById("hud-wx-turb");
  if (turbEl && turb) {
    turbEl.textContent = turb.label;
    turbEl.style.color = turb.color;
  }

  // Wind rose
  _drawWindRose(data.windDir, data.windSpeed, data.windGusts);
  const roseSpdEl = document.getElementById("hud-wx-rose-spd");
  if (roseSpdEl)
    roseSpdEl.textContent = `${Math.round(data.windDir)}° / ${Math.round(data.windSpeed)}kt`;

  // Pressure trend
  const tendEl = document.getElementById("hud-wx-ptend");
  if (tendEl && data.pressure != null) {
    const tend = _trackPressure(data.pressure);
    if (tend != null) {
      if (tend > 1.0) {
        tendEl.textContent = "▲";
        tendEl.style.color = "#52a86c";
      } else if (tend > 0.3) {
        tendEl.textContent = "↑";
        tendEl.style.color = "rgba(240,236,226,0.5)";
      } else if (tend < -1.0) {
        tendEl.textContent = "▼";
        tendEl.style.color = "#b05048";
      } else if (tend < -0.3) {
        tendEl.textContent = "↓";
        tendEl.style.color = "rgba(240,236,226,0.5)";
      } else {
        tendEl.textContent = "→";
        tendEl.style.color = "rgba(240,236,226,0.35)";
      }
    }
  }

  // Sunrise / sunset + daylight progress bar
  if (data.daily && data.daily.length > 0 && data.daily[0].sunrise) {
    const fmtTime = (iso) => {
      const d = new Date(iso);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    const srEl = document.getElementById("hud-wx-sunrise");
    const ssEl = document.getElementById("hud-wx-sunset");
    if (srEl)
      srEl.innerHTML = `<span class="hud-wx-sun-icon">&#9788;</span> ${fmtTime(data.daily[0].sunrise)}`;
    if (ssEl)
      ssEl.innerHTML = `<span class="hud-wx-sun-icon">&#9790;</span> ${fmtTime(data.daily[0].sunset)}`;

    // Daylight progress bar (fills left→right from sunrise to sunset, dot = now)
    const srT = new Date(data.daily[0].sunrise).getTime();
    const ssT = new Date(data.daily[0].sunset).getTime();
    const now = Date.now();
    const pct = Math.max(0, Math.min(100, ((now - srT) / (ssT - srT)) * 100));
    const isDay = now >= srT && now <= ssT;
    const sunRow = document.querySelector(".hud-wx-sun-row");
    if (sunRow) {
      let bar = sunRow.querySelector(".hud-wx-daybar");
      if (!bar) {
        bar = document.createElement("div");
        bar.className = "hud-wx-daybar";
        sunRow.appendChild(bar);
      }
      bar.innerHTML = isDay
        ? `<div class="hud-wx-daybar-fill" style="width:${pct.toFixed(1)}%"></div><div class="hud-wx-daybar-dot" style="left:${pct.toFixed(1)}%"></div>`
        : `<div class="hud-wx-daybar-fill" style="width:${now < srT ? "0" : "100"}%"></div>`;
      // The reference ends every module with one plain line saying what its
      // numbers mean — "Low for the rest of the day." Two clock times say when
      // the sun does things and never say the thing a pilot actually wants
      // from them, which is how much of it is left.
      let note = sunRow.querySelector(".hud-wx-sun-note");
      if (!note) {
        note = document.createElement("div");
        note.className = "hud-wx-sun-note";
        sunRow.appendChild(note);
      }
      const span = (ms) => {
        const m = Math.max(0, Math.round(ms / 60000));
        const h = Math.floor(m / 60);
        return h ? `${h}h ${m % 60}m` : `${m}m`;
      };
      note.textContent = isDay
        ? `${span(ssT - now)} of daylight left`
        : now < srT
          ? `sunrise in ${span(srT - now)}`
          : `night · sunrise in ${span(srT + 86400000 - now)}`;
    }
  }

  // 24h hourly trend canvas
  if (data.hourly && data.hourly.length > 0) {
    _drawHourlyChart(data.hourly);
  }

  // 7-day daily forecast
  if (data.daily && data.daily.length > 0) {
    _renderDailyForecast(data.daily, data.temp);
  }
}

// ── Wind Rose (canvas) ────────────────────────────────────────────────────────
function _drawWindRose(windDir, windSpeedKt, windGustsKt) {
  const canvas = document.getElementById("hud-wx-rose");
  if (!canvas) return;
  const SIZE = 52;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = SIZE * dpr;
  canvas.height = SIZE * dpr;
  canvas.style.width = SIZE + "px";
  canvas.style.height = SIZE + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const cx = SIZE / 2,
    cy = SIZE / 2,
    R = 22;

  // Background
  ctx.fillStyle = "rgba(4,6,16,0.65)";
  ctx.beginPath();
  ctx.arc(cx, cy, R + 3, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring
  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring (calm zone)
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.35, 0, Math.PI * 2);
  ctx.stroke();

  // Cardinal labels
  const MONO = "'JetBrains Mono',monospace";
  ctx.font = `700 5.5px ${MONO}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lblR = R - 5;
  ctx.fillStyle = "rgba(196,160,88,0.80)";
  ctx.fillText("N", cx, cy - lblR);
  ctx.fillStyle = "rgba(240,236,226,0.28)";
  ctx.fillText("S", cx, cy + lblR);
  ctx.fillText("E", cx + lblR, cy);
  ctx.fillText("W", cx - lblR, cy);

  if (windDir == null || windSpeedKt == null) return;

  // Wind arrow: FROM windDir toward center
  // Meteorological convention: 270° wind blows from W, arrow tip points toward E
  const fromRad = ((windDir - 90) * Math.PI) / 180;
  const toRad = fromRad + Math.PI;
  const arrowR = R - 8;
  const tipX = cx + Math.cos(toRad) * arrowR;
  const tipY = cy + Math.sin(toRad) * arrowR;
  const tailX = cx + Math.cos(fromRad) * arrowR;
  const tailY = cy + Math.sin(fromRad) * arrowR;

  // Shaft
  ctx.strokeStyle = "rgba(106,173,204,0.90)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  // Arrowhead
  const ang = Math.atan2(tipY - tailY, tipX - tailX);
  const hLen = 5,
    hAng = Math.PI / 5;
  ctx.fillStyle = "rgba(106,173,204,0.90)";
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(
    tipX - hLen * Math.cos(ang - hAng),
    tipY - hLen * Math.sin(ang - hAng),
  );
  ctx.lineTo(
    tipX - hLen * Math.cos(ang + hAng),
    tipY - hLen * Math.sin(ang + hAng),
  );
  ctx.closePath();
  ctx.fill();

  // Gust ring — outer semi-transparent arc proportional to gusts
  if (windGustsKt != null && windGustsKt > windSpeedKt) {
    const gustR = R - 2;
    ctx.strokeStyle = "rgba(232,144,90,0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, gustR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Center dot
  ctx.fillStyle = "rgba(106,173,204,0.85)";
  ctx.beginPath();
  ctx.arc(cx, cy, 2, 0, Math.PI * 2);
  ctx.fill();
}

// ── Pressure Trend Tracker ────────────────────────────────────────────────────
const _wxPressHistory = [];
function _trackPressure(hPa) {
  const now = Date.now();
  _wxPressHistory.push({ ts: now, hPa });
  while (_wxPressHistory.length > 8) _wxPressHistory.shift();
  if (_wxPressHistory.length < 2) return null;
  const oldest = _wxPressHistory[0];
  const hoursDiff = (now - oldest.ts) / 3_600_000;
  if (hoursDiff < 0.02) return null; // need at least ~1 min of data
  return (hPa - oldest.hPa) / hoursDiff; // hPa/hr
}

// ── Hourly Chart ──────────────────────────────────────────────────────────────
function _drawHourlyChart(hourly) {
  const canvas = document.getElementById("hud-wx-hourly-chart");
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 280;
  const h = canvas.clientHeight || 60;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const temps = hourly.map((e) => e.temp);
  const winds = hourly.map((e) => e.wind || 0);
  const precips = hourly.map((e) => e.precip || 0);
  const tMin = Math.min(...temps) - 1;
  const tMax = Math.max(...temps) + 1;
  const tRange = tMax - tMin || 1;
  const pMax = Math.max(...precips, 0.5);
  const wMax = Math.max(...winds, 10);

  const padTop = 13,
    padBot = 12,
    padL = 2,
    padR = 2;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;

  const xAt = (i) => padL + (i / (hourly.length - 1)) * plotW;
  const yAtTemp = (t) => padTop + plotH - ((t - tMin) / tRange) * plotH;

  // Precipitation bars
  ctx.fillStyle = "rgba(90,172,255,0.18)";
  for (let i = 0; i < hourly.length; i++) {
    if (precips[i] <= 0) continue;
    const bh = (precips[i] / pMax) * plotH * 0.55;
    const bw = Math.max(plotW / hourly.length - 1, 2);
    ctx.fillRect(xAt(i) - bw / 2, padTop + plotH - bh, bw, bh);
  }

  // Wind speed line (subtle, lower portion)
  ctx.beginPath();
  ctx.strokeStyle = "rgba(106,173,204,0.28)";
  ctx.lineWidth = 1;
  ctx.lineJoin = "round";
  for (let i = 0; i < hourly.length; i++) {
    const wy = padTop + plotH - (winds[i] / wMax) * (plotH * 0.4);
    if (i === 0) ctx.moveTo(xAt(i), wy);
    else ctx.lineTo(xAt(i), wy);
  }
  ctx.stroke();

  // Temperature area + line
  ctx.beginPath();
  ctx.strokeStyle = "rgba(232,195,106,0.75)";
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";
  for (let i = 0; i < hourly.length; i++) {
    const y = yAtTemp(temps[i]);
    if (i === 0) ctx.moveTo(xAt(i), y);
    else ctx.lineTo(xAt(i), y);
  }
  ctx.stroke();

  // Temperature gradient fill
  ctx.beginPath();
  for (let i = 0; i < hourly.length; i++) {
    const y = yAtTemp(temps[i]);
    if (i === 0) ctx.moveTo(xAt(i), y);
    else ctx.lineTo(xAt(i), y);
  }
  ctx.lineTo(xAt(hourly.length - 1), padTop + plotH);
  ctx.lineTo(padL, padTop + plotH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
  grad.addColorStop(0, "rgba(232,195,106,0.14)");
  grad.addColorStop(1, "rgba(232,195,106,0)");
  ctx.fillStyle = grad;
  ctx.fill();

  // Current time marker
  const nowHour = new Date().getHours();
  const nowIdx = hourly.findIndex((e) => e.hour === nowHour);
  if (nowIdx >= 0) {
    const nx = xAt(nowIdx);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 0.75;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(nx, padTop);
    ctx.lineTo(nx, padTop + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Dots + labels every 4h
  ctx.textAlign = "center";
  for (let i = 0; i < hourly.length; i++) {
    if (i % 4 !== 0 && i !== hourly.length - 1) continue;
    const x = xAt(i),
      y = yAtTemp(temps[i]);

    // Dot
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(232,195,106,0.85)";
    ctx.fill();

    // Temp label
    ctx.font = `7px monospace`;
    ctx.fillStyle = "rgba(255,255,255,0.60)";
    ctx.fillText(`${temps[i]}°`, x, y - 4);

    // Hour label
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillText(String(hourly[i].hour).padStart(2, "0"), x, h - 1);
  }

  // Rain label if significant
  ctx.font = `6px monospace`;
  for (let i = 0; i < hourly.length; i++) {
    if (precips[i] < 0.5 || i % 3 !== 0) continue;
    const bTop = padTop + plotH - (precips[i] / pMax) * plotH * 0.55;
    ctx.fillStyle = "rgba(90,172,255,0.65)";
    ctx.fillText(`${precips[i].toFixed(1)}`, xAt(i), bTop - 2);
  }
}

function _renderDailyForecast(daily, nowTemp) {
  const el = document.getElementById("hud-wx-daily");
  if (!el) return;

  const allMin = Math.min(...daily.map((d) => d.tempMin));
  const allMax = Math.max(...daily.map((d) => d.tempMax));
  const range = allMax - allMin || 1;
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  el.innerHTML = daily
    .map((d, i) => {
      const dt = new Date(d.date + "T00:00:00");
      const name = i === 0 ? "NOW" : dayNames[dt.getDay()];
      const icon = weatherIcon(d.code);
      const left = ((d.tempMin - allMin) / range) * 100;
      const width = ((d.tempMax - d.tempMin) / range) * 100;

      // Precipitation: always show prob bar; show mm if ≥1mm, else prob% if ≥5
      const prob = d.precipProb || 0;
      const precipLabel =
        d.precip >= 1
          ? `${Math.round(d.precip)}mm`
          : prob >= 5
            ? `${prob}%`
            : "";
      // Rain bar opacity scales with probability
      const rainOpacity = Math.min(0.8, 0.15 + prob * 0.006);
      const rainBar =
        prob > 0
          ? `<div class="hud-wx-day-rain-bar" style="width:${prob}%;opacity:${rainOpacity.toFixed(2)}"></div>`
          : "";

      // Temp color: blue for cold, orange for hot
      const hiC = d.tempMax;
      const hiColor =
        hiC <= 0 ? "color:#5aacff" : hiC >= 32 ? "color:#ee8833" : "";

      // Every row's bar was the same blue, so seven days of weather looked
      // like seven identical days at different offsets. Each bar is graded
      // between the colour of its own low and the colour of its own high now,
      // which is what makes a list of days readable without reading it: a
      // cold week is a blue column and a hot one is an amber one.
      const grade = `background:linear-gradient(90deg, ${_tempHue(d.tempMin)}, ${_tempHue(d.tempMax)})`;
      // Today also carries where the temperature is right now, on the same
      // scale and with the same needle as the tile above.
      const nowMark =
        i === 0 && nowTemp != null && d.tempMax > d.tempMin
          ? `<i class="hud-wx-day-now" style="left:${(Math.max(0, Math.min(1, (nowTemp - d.tempMin) / (d.tempMax - d.tempMin))) * 100).toFixed(1)}%"></i>`
          : "";

      return `<div class="hud-wx-day${i === 0 ? " hud-wx-day-today" : ""}">
      <span class="hud-wx-day-name">${name}</span>
      <span class="hud-wx-day-icon">${icon}</span>
      <span class="hud-wx-day-lo">${d.tempMin}°</span>
      <div class="hud-wx-day-bar-track">
        <div class="hud-wx-day-bar-fill" style="left:${left}%;width:${Math.max(width, 4)}%;${grade}">${nowMark}</div>
      </div>
      <span class="hud-wx-day-hi" style="${hiColor}">${d.tempMax}°</span>
      <div class="hud-wx-day-rain">${rainBar}<span class="hud-wx-day-rain-lbl">${precipLabel}</span></div>
    </div>`;
    })
    .join("");
}

// ── Unified filter panel ──
// The one temperature ramp this page uses. Anchored on the two colours the
// rest of the interface already means things with — the cold blue of an
// inferred track and the amber of an instrument — so a warm day and a lit
// readout are the same family rather than two palettes.
function _tempHue(c) {
  // Blue at the cold end, orange through the middle, red at the top. The
  // first version bridged blue to amber through a grey-green that read as
  // neither, which is what happens when a ramp is built by mixing its ends
  // rather than by naming the colours it is meant to pass through.
  const stops = [
    [-10, [56, 108, 188]],
    [0, [74, 150, 214]],
    [10, [126, 178, 206]],
    [18, [206, 176, 124]],
    [24, [230, 152, 70]],
    [32, [226, 96, 58]],
    [40, [198, 52, 48]],
  ];
  const t = Math.max(stops[0][0], Math.min(stops[stops.length - 1][0], c));
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i];
    const [b, cb] = stops[i + 1];
    if (t <= b) {
      const k = (t - a) / (b - a || 1);
      const mix = ca.map((v, j) => Math.round(v + (cb[j] - v) * k));
      return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
    }
  }
  return "rgb(198, 52, 48)";
}

function applyFilters(dataList) {
  if (!aircraftManager) return;
  const hasAltFilter = filterState.altPreset !== "ALL";
  const hasAptFilter = filterState.isolate && selectedAirportState;

  if (!hasAltFilter && !hasAptFilter) {
    aircraftManager.clearFilter();
    filterState.shown = filterState.total = aircraftManager.aircraft.size;
    window._filterPanelCount?.();
    return;
  }

  const preset = ALT_PRESETS[filterState.altPreset];
  let aptSet = null;

  if (hasAptFilter && selectedAirportState) {
    const aptData = getAirportData();
    const { arrivals, departures } = categorizeFlights(
      dataList || lastRawData,
      selectedAirportState,
      aptData?.runways,
    );
    if (filterState.airportMode === "ARR") {
      aptSet = new Set(arrivals.map((a) => a.icao24));
    } else if (filterState.airportMode === "DEP") {
      aptSet = new Set(departures.map((a) => a.icao24));
    } else {
      aptSet = new Set([
        ...arrivals.map((a) => a.icao24),
        ...departures.map((a) => a.icao24),
      ]);
    }
  }

  const passSet = new Set();
  for (const [icao, ac] of aircraftManager.aircraft) {
    if (ac.fadingOut) continue;
    let pass = true;

    // Altitude filter
    if (hasAltFilter) {
      const altM = ac.data.baroAltitude;
      const altFt = altM != null ? altM * 3.28084 : null;
      if (altFt != null && (altFt < preset.min || altFt > preset.max))
        pass = false;
    }

    // Airport isolate filter
    if (hasAptFilter && aptSet && !aptSet.has(icao)) pass = false;

    // Selected/followed aircraft always pass
    const sel = getSelectedAircraft();
    if (sel && sel.data.icao24 === icao) pass = true;

    if (pass) passSet.add(icao);
  }

  aircraftManager.setFilter(passSet);
  filterState.shown = passSet.size;
  filterState.total = aircraftManager.aircraft.size;
  window._filterPanelCount?.();
}

function initFilterPanel() {
  const panel = document.createElement("div");
  panel.className = "filter-panel hidden";
  panel.id = "filter-panel";
  document.body.appendChild(panel);

  // The count is the only thing in here that changes on its own, so it gets
  // its own writer: re-rendering the whole bar every poll would fight the
  // segmented control's hover and focus.
  function renderCount() {
    const el = panel.querySelector("#filter-count");
    if (!el) return;
    const total = filterState.total ?? 0;
    const shown = filterState.shown ?? total;
    el.textContent = shown === total ? `${total} shown` : `${shown} of ${total}`;
    el.classList.toggle("is-filtered", shown !== total);
  }
  window._filterPanelCount = renderCount;

  function closeFilters() {
    filterState.active = false;
    panel.classList.remove("visible");
    panel.classList.add("hidden");
    filterState.altPreset = "ALL";
    filterState.isolate = false;
    filterState.airportMode = "ALL";
    aircraftManager?.clearFilter();
  }

  function render() {
    const hasAirport = !!selectedAirportState;
    const code = hasAirport
      ? selectedAirportState.iata || selectedAirportState.icao || ""
      : "";

    panel.innerHTML = `
      <div class="filter-group">
        <span class="filter-group-label">ALTITUDE</span>
        <div class="filter-seg" id="filter-alt-row">
          ${Object.keys(ALT_PRESETS)
            .map(
              (k) => `
            <button class="filter-seg-btn${filterState.altPreset === k ? " active" : ""}" data-alt="${k}">${ALT_PRESETS[k].label.replace(/</g, "&lt;")}</button>
          `,
            )
            .join("")}
        </div>
      </div>
      ${
        hasAirport
          ? `
      <div class="filter-group">
        <span class="filter-group-label">${code}</span>
        <div class="filter-seg">
          ${["ALL", "ARR", "DEP"]
            .map(
              (m) => `
            <button class="filter-seg-btn${filterState.airportMode === m ? " active" : ""}" data-apt="${m}">${m}</button>
          `,
            )
            .join("")}
        </div>
        <button class="filter-seg-btn filter-isolate${filterState.isolate ? " active" : ""}" data-isolate="1">ISOLATE</button>
      </div>`
          : ""
      }
      <div class="filter-tail">
        <span class="filter-count" id="filter-count"></span>
        <button type="button" class="hud-act filter-close" data-close="1" aria-label="Close filters">
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>
        </button>
      </div>
    `;
    renderCount();

    // Altitude preset buttons
    panel.querySelectorAll("[data-alt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterState.altPreset = btn.dataset.alt;
        render();
        applyFilters(lastRawData);
      });
    });

    // Airport mode buttons
    panel.querySelectorAll("[data-apt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterState.airportMode = btn.dataset.apt;
        render();
        applyFilters(lastRawData);
        // Update highlight set to match mode
        if (selectedAirportState) {
          const aptData = getAirportData();
          const { arrivals, departures } = categorizeFlights(
            lastRawData,
            selectedAirportState,
            aptData?.runways,
          );
          let set;
          if (filterState.airportMode === "ARR")
            set = new Set(arrivals.map((a) => a.icao24));
          else if (filterState.airportMode === "DEP")
            set = new Set(departures.map((a) => a.icao24));
          else
            set = new Set([
              ...arrivals.map((a) => a.icao24),
              ...departures.map((a) => a.icao24),
            ]);
          if (set.size > 0) aircraftManager.setHighlight(set);
        }
      });
    });

    panel.querySelector("[data-close]")?.addEventListener("click", () => {
      closeFilters();
    });

    // Isolate toggle
    const isoBtn = panel.querySelector("[data-isolate]");
    if (isoBtn) {
      isoBtn.addEventListener("click", () => {
        filterState.isolate = !filterState.isolate;
        render();
        applyFilters(lastRawData);
      });
    }
  }

  // Toggle with F key
  document.addEventListener("keydown", (e) => {
    if (
      document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA"
    )
      return;
    if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey) {
      filterState.active = !filterState.active;
      panel.classList.toggle("hidden", !filterState.active);
      if (filterState.active) {
        render();
        requestAnimationFrame(() => panel.classList.add("visible"));
      } else {
        panel.classList.remove("visible");
        // Reset filters when closing
        filterState.altPreset = "ALL";
        filterState.isolate = false;
        filterState.airportMode = "ALL";
        aircraftManager?.clearFilter();
      }
    }
  });

  // Expose render for external triggers (airport selection changes)
  window._filterPanelRender = render;
}

// ── T3-14: Mobile touch controls ──
function initMobileTouch() {
  if (!("ontouchstart" in window)) return;
  let lastTap = 0;
  canvas.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        // Double-tap to follow
        e.preventDefault();
        const touch = e.changedTouches[0];
        pointer.x = (touch.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        if (aircraftManager) {
          const hits = raycaster.intersectObjects(
            aircraftManager.raycasterTargets,
            false,
          );
          if (hits.length > 0) {
            const ac = aircraftManager.getByHitMesh(hits[0].object);
            if (ac) handleAircraftSelect(ac);
          }
        }
      }
      lastTap = now;
    },
    { passive: false },
  );

  // Swipe-close detail panel
  let touchStartY = 0;
  const detailPanel = document.getElementById("detail-panel");
  if (detailPanel) {
    detailPanel.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true },
    );
    detailPanel.addEventListener(
      "touchend",
      (e) => {
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (dy > 80) {
          closeDetail();
          stopFollow();
        }
      },
      { passive: true },
    );
  }
}

// ── T3-11: Airport notes system ──
function showAirportNotes(code) {
  let overlay = document.getElementById("airport-notes-overlay");
  if (overlay) {
    // Update code label and textarea for potentially different airport
    overlay.querySelector(".overlay-title").textContent = `${code} NOTES`;
    const ta = document.getElementById("airport-note-text");
    if (ta) ta.value = localStorage.getItem(`stratum:note:${code}`) || "";
    overlay.classList.toggle("hidden");
    overlay._code = code;
    return;
  }
  overlay = document.createElement("div");
  overlay.id = "airport-notes-overlay";
  overlay.className = "overlay-backdrop";
  overlay._code = code;
  const saved = localStorage.getItem(`stratum:note:${code}`) || "";
  overlay.innerHTML = `<div class="overlay-panel notes-panel">
    <div class="overlay-header">
      <span class="overlay-title">${code} NOTES</span>
      <button type="button" class="detail-close overlay-close-btn" aria-label="Close">&times;</button>
    </div>
    <textarea id="airport-note-text" class="notes-textarea" placeholder="Add notes about this airport...">${saved}</textarea>
    <div class="notes-actions">
      <button id="airport-note-save" class="notes-btn notes-btn-primary">SAVE</button>
      <button id="airport-note-close" class="notes-btn notes-btn-secondary">CLOSE</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  document.getElementById("airport-note-save").addEventListener("click", () => {
    const text = document.getElementById("airport-note-text").value;
    const c = overlay._code;
    if (text.trim()) localStorage.setItem(`stratum:note:${c}`, text);
    else localStorage.removeItem(`stratum:note:${c}`);
    overlay.classList.add("hidden");
  });
  overlay
    .querySelector(".overlay-close-btn")
    .addEventListener("click", () => overlay.classList.add("hidden"));
  document
    .getElementById("airport-note-close")
    .addEventListener("click", () => overlay.classList.add("hidden"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.add("hidden");
  });
}

// ── T3-04: Multi-aircraft comparison ──
const comparisonSet = [];
function toggleComparison(ac) {
  const idx = comparisonSet.findIndex((c) => c.data.icao24 === ac.data.icao24);
  if (idx >= 0) {
    comparisonSet.splice(idx, 1);
  } else if (comparisonSet.length < 3) {
    comparisonSet.push(ac);
  }
  renderComparisonPanel();
}
function renderComparisonPanel() {
  let panel = document.getElementById("compare-panel");
  if (comparisonSet.length === 0) {
    if (panel) panel.classList.add("hidden");
    return;
  }
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "compare-panel";
    panel.className = "stratum-widget compare-widget";
    document.body.appendChild(panel);
  }
  panel.classList.remove("hidden");
  panel.innerHTML = comparisonSet
    .map((ac) => {
      const d = ac.getDisplayData();
      const altFt = d._rawAlt != null ? Math.round(d._rawAlt * 3.28084) : null;
      const alt = altFt
        ? altFt >= 18000
          ? `FL${Math.round(altFt / 100)}`
          : `${altFt.toLocaleString()} ft`
        : "--";
      const spd = d.gsKts != null ? `${d.gsKts} kts` : "--";
      return `<div class="compare-col">
      <div class="compare-callsign">${d.callsign || d.icao24}</div>
      <div>${d.aircraftType || "--"}</div>
      <div>ALT: ${alt}</div>
      <div>GS: ${spd}</div>
      <div>HDG: ${d.heading || "--"}</div>
      <div>${d.origin || ""}→${d.destination || ""}</div>
    </div>`;
    })
    .join("");
}

// ── T3-05: Trail replay animation ──
let _replayActive = false;
let _replayGhost = null;
function startTrailReplay(ac) {
  if (_replayActive || !ac) return;
  const trail = ac.trailPositions;
  if (!trail || trail.length < 6) return;
  _replayActive = true;
  let idx = 0;
  const ghostGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0xc4a058,
    transparent: true,
    opacity: 0.7,
  });
  _replayGhost = new THREE.Mesh(ghostGeo, ghostMat);
  scene.add(_replayGhost);
  const step = () => {
    if (!_replayActive || idx >= trail.length - 3) {
      stopTrailReplay();
      return;
    }
    _replayGhost.position.set(trail[idx], trail[idx + 1], trail[idx + 2]);
    idx += 3; // advance one point
    requestAnimationFrame(step);
  };
  step();
}
function stopTrailReplay() {
  _replayActive = false;
  if (_replayGhost) {
    scene.remove(_replayGhost);
    _replayGhost.geometry.dispose();
    _replayGhost.material.dispose();
    _replayGhost = null;
  }
}

// ── Session Replay ──
// Records all aircraft positions every 5s, replays at high speed with ghost dots
const _sessionSnapshots = []; // [{time, positions:[{x,y,z},...]}]
let _sessionReplayOn = false;
let _sessionReplayIdx = 0;
let _sessionReplayMesh = null;
let _sessionReplayTimer = null;
let _replaySliderHandler = null;
let _replayCloseHandler = null;
const SESSION_SNAPSHOT_INTERVAL = 5.0;
const SESSION_MAX_GHOSTS = 400;
const SESSION_MAX_SNAPSHOTS = 720; // ~1 hour at 5s intervals
let _lastSnapshotTime = 0;

function _recordSessionSnapshot(elapsed) {
  if (elapsed - _lastSnapshotTime < SESSION_SNAPSHOT_INTERVAL) return;
  _lastSnapshotTime = elapsed;
  if (!aircraftManager || aircraftManager.aircraft.size === 0) return;
  const positions = [];
  for (const ac of aircraftManager.aircraft.values()) {
    if (ac.fadingOut || ac.masterOpacity < 0.3) continue;
    const p = ac.group.position;
    positions.push(p.x, p.y, p.z);
  }
  if (positions.length > 0) {
    _sessionSnapshots.push({
      time: Date.now(),
      positions: new Float32Array(positions),
    });
    // Cap at max to prevent unbounded memory growth
    if (_sessionSnapshots.length > SESSION_MAX_SNAPSHOTS)
      _sessionSnapshots.shift();
  }
}

function _toggleSessionReplay() {
  if (_sessionReplayOn) {
    _stopSessionReplay();
    return;
  }
  if (_sessionSnapshots.length < 24) return; // need ~2 min of data (24 × 5s)
  _sessionReplayOn = true;
  _sessionReplayIdx = 0;

  // Create ghost point mesh
  const geo = new THREE.BufferGeometry();
  const posAttr = new Float32Array(SESSION_MAX_GHOSTS * 3);
  geo.setAttribute("position", new THREE.BufferAttribute(posAttr, 3));
  geo.setDrawRange(0, 0);
  _sessionReplayMesh = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0xc4a058,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  _sessionReplayMesh.renderOrder = 1001;
  scene.add(_sessionReplayMesh);

  // Show replay UI
  let bar = document.getElementById("session-replay-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "session-replay-bar";
    bar.style.cssText =
      "position:fixed;bottom:40px;left:50%;transform:translateX(-50%);z-index:2000;display:flex;align-items:center;gap:10px;padding:8px 16px;background:rgba(10,12,18,0.85);border:1px solid rgba(196,160,88,0.15);border-radius:8px;font-family:var(--font-mono);font-size:11px;color:rgba(238,233,220,0.7);backdrop-filter:blur(8px)";
    document.body.appendChild(bar);
  }
  const totalDur = Math.round(
    (_sessionSnapshots[_sessionSnapshots.length - 1].time -
      _sessionSnapshots[0].time) /
      1000,
  );
  const durMin = Math.floor(totalDur / 60);
  const durSec = totalDur % 60;
  const durStr =
    durMin > 0 ? `${durMin}m${String(durSec).padStart(2, "0")}s` : `${durSec}s`;
  bar.innerHTML = `<span style="color:rgba(196,160,88,0.5);letter-spacing:1px;font-size:8px">REPLAY</span>
    <input type="range" id="session-replay-slider" min="0" max="${_sessionSnapshots.length - 1}" value="0" style="width:min(400px,50vw);accent-color:#c4a058">
    <span id="session-replay-time" style="min-width:80px">-- / ${durStr}</span>
    <button id="session-replay-close" style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:14px">&times;</button>`;
  bar.classList.remove("hidden");
  const closeBtn = document.getElementById("session-replay-close");
  const slider = document.getElementById("session-replay-slider");
  _replayCloseHandler = _stopSessionReplay;
  _replaySliderHandler = () => {
    _sessionReplayIdx = parseInt(slider.value);
    _renderReplayFrame();
  };
  closeBtn.addEventListener("click", _replayCloseHandler);
  slider.addEventListener("input", _replaySliderHandler);

  // Auto-play at ~25x speed (200ms per 5s snapshot)
  _sessionReplayTimer = setInterval(() => {
    if (_sessionReplayIdx >= _sessionSnapshots.length - 1) {
      _sessionReplayIdx = 0;
    } else {
      _sessionReplayIdx++;
    }
    slider.value = _sessionReplayIdx;
    _renderReplayFrame();
  }, 200);
}

function _renderReplayFrame() {
  if (!_sessionReplayMesh || !_sessionSnapshots[_sessionReplayIdx]) return;
  const snap = _sessionSnapshots[_sessionReplayIdx];
  const posAttr = _sessionReplayMesh.geometry.getAttribute("position");
  const count = Math.min(snap.positions.length / 3, SESSION_MAX_GHOSTS);
  posAttr.array.set(snap.positions.subarray(0, count * 3));
  posAttr.needsUpdate = true;
  _sessionReplayMesh.geometry.setDrawRange(0, count);
  // Update time label — show clock time + elapsed
  const timeEl = document.getElementById("session-replay-time");
  if (timeEl && _sessionSnapshots.length > 0) {
    const d = new Date(snap.time);
    const clock = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    const elapsedSec = Math.round(
      (snap.time - _sessionSnapshots[0].time) / 1000,
    );
    const eM = Math.floor(elapsedSec / 60);
    const eS = elapsedSec % 60;
    timeEl.textContent = `${clock} (${eM}:${String(eS).padStart(2, "0")})`;
  }
}

function _stopSessionReplay() {
  _sessionReplayOn = false;
  if (_sessionReplayTimer) {
    clearInterval(_sessionReplayTimer);
    _sessionReplayTimer = null;
  }
  if (_sessionReplayMesh) {
    scene.remove(_sessionReplayMesh);
    _sessionReplayMesh.geometry.dispose();
    _sessionReplayMesh.material.dispose();
    _sessionReplayMesh = null;
  }
  // Remove listeners and DOM element
  const bar = document.getElementById("session-replay-bar");
  if (bar) {
    const slider = document.getElementById("session-replay-slider");
    const closeBtn = document.getElementById("session-replay-close");
    if (slider && _replaySliderHandler)
      slider.removeEventListener("input", _replaySliderHandler);
    if (closeBtn && _replayCloseHandler)
      closeBtn.removeEventListener("click", _replayCloseHandler);
    bar.remove();
  }
  _replaySliderHandler = null;
  _replayCloseHandler = null;
}

// --- Route overlay ---
let _lastRouteOverlayUpdate = 0;

function _rebuildRouteOverlay() {
  if (!aircraftManager) {
    clearRouteOverlay(scene);
    return;
  }
  const { lat, lon } = getUserLocation();
  const routes = [];
  const seen = new Set();
  for (const [, ac] of aircraftManager.aircraft) {
    if (ac.fadingOut) continue;
    const origin = ac.data.origin;
    const dest = ac.data.destination;
    if (!origin || !dest) continue;
    const key = origin + "-" + dest;
    if (seen.has(key)) continue;
    seen.add(key);
    const origApt =
      typeof window._findCityByCode === "function"
        ? window._findCityByCode(origin)
        : null;
    const destApt =
      typeof window._findCityByCode === "function"
        ? window._findCityByCode(dest)
        : null;
    if (origApt && destApt) {
      routes.push({
        originLat: origApt.lat,
        originLon: origApt.lon,
        destLat: destApt.lat,
        destLon: destApt.lon,
      });
    }
  }
  updateRouteOverlay(scene, routes, lat, lon);
}

// --- Animation loop ---
const clock = new THREE.Timer();
let _elapsed = 0;
let _lastDayNightTime = 0;
let _lastCompassDeg = -1;
let _lastAtmosphereUpdate = 0;
let _atmosphereFrame = 0;

function animate() {
  requestAnimationFrame(animate);
  clock.update();
  const delta = clock.getDelta();
  _elapsed += delta;
  if (colorGradePass) colorGradePass.uniforms.time.value = _elapsed;

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
    // Clamp orbit panning to map bounds (40% margin)
    const _LIM = 48;
    controls.target.x = Math.max(-_LIM, Math.min(_LIM, controls.target.x));
    controls.target.z = Math.max(-_LIM, Math.min(_LIM, controls.target.z));
    camera.position.x = Math.max(-_LIM, Math.min(_LIM, camera.position.x));
    camera.position.z = Math.max(-_LIM, Math.min(_LIM, camera.position.z));
  }

  updateAirportLightFalloff(camera);
  updateChartDetail(camera);
  updateAmbience(camera, _elapsed);
  _animateTicker(delta * 1000);
  updatePulse(scene, _elapsed);
  animateAirportLoading(_elapsed);
  updateCompass(_elapsed);

  // T3-12: Day/night cycle (update every ~2s)
  if (_elapsed - _lastDayNightTime >= 2.0) {
    _lastDayNightTime = _elapsed;
    const { lat, lon } = getUserLocation();
    const now = new Date();
    const utcH = now.getUTCHours() + now.getUTCMinutes() / 60;
    updateDayNight(scene, lat, lon, utcH);
    // Compute sun position for aircraft shadow projection
    const latRad = (lat * Math.PI) / 180;
    const solarNoon = 12 - lon / 15;
    const hourAngle = ((utcH - solarNoon) * 15 * Math.PI) / 180;
    const sinAlt = Math.cos(latRad) * Math.cos(hourAngle);
    const sunElev = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
    // Sun azimuth (simplified: hour angle maps to azimuth)
    const cosAlt = Math.cos(sunElev) || 0.001;
    const sinAz = Math.sin(hourAngle) / cosAlt;
    const sunAz = Math.atan2(
      sinAz,
      (Math.cos(hourAngle) * Math.sin(latRad)) / cosAlt,
    );
    const dayF = Math.max(0, Math.min(1, (sinAlt + 0.1) / 0.2));
    setSunState(sunAz, sunElev, dayF);
  }

  // Animate particles + stars — throttle GPU uploads to every 3rd frame
  _atmosphereFrame = (_atmosphereFrame || 0) + 1;
  if (_atmosphereFrame % 3 === 0) {
    const posArr = particles.geometry.attributes.position.array;
    const dt3 = delta * 3; // compensate for 3-frame skip
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArr[i * 3 + 1] += particleSpeeds[i] * dt3;
      if (posArr[i * 3 + 1] > 5) {
        posArr[i * 3 + 1] = 0;
        posArr[i * 3] = (Math.random() - 0.5) * 60;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 60;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }
  if (_elapsed - _lastAtmosphereUpdate >= 0.3) {
    _lastAtmosphereUpdate = _elapsed;
    particleMat.opacity = 0.06 + 0.04 * Math.sin(_elapsed * 0.4);
    starMat.opacity = 0.3 + 0.14 * Math.sin(_elapsed * 0.3);

    // Star twinkling — subtle per-star size oscillation
    const sizeArr = stars.geometry.attributes.size.array;
    for (let i = 0; i < STAR_COUNT; i++) {
      const phase = i * 1.618 + _elapsed * (0.3 + (i % 7) * 0.08);
      sizeArr[i] = (0.15 + Math.sin(phase) * 0.07) * (0.5 + starSizes[i] * 0.7);
    }
    stars.geometry.attributes.size.needsUpdate = true;
  }

  if (aircraftManager) {
    aircraftManager.animate(delta, _elapsed, camera);
    aircraftManager.animateSelection(_elapsed);
    _recordSessionSnapshot(_elapsed);

    // Route overlay — rebuild every 5 seconds
    if (_elapsed - _lastRouteOverlayUpdate > 5) {
      _lastRouteOverlayUpdate = _elapsed;
      _rebuildRouteOverlay();
    }
  }

  // T3-09: Animate touchdown effects (dust puffs, runway flashes)
  updateTouchdownEffects(scene);

  // T3-10: TCAS traffic display in follow mode
  if (followTarget && aircraftManager && !followTarget.removed) {
    updateTCASDisplay(followTarget, aircraftManager.aircraft, _elapsed);
    // S4: Fuel range ring — update every 2s
    if (_elapsed - _lastFuelRingUpdate > 2) {
      _lastFuelRingUpdate = _elapsed;
      const fd = followTarget.getDisplayData();
      if (
        fd.specs &&
        fd.specs.range &&
        fd._originDist != null &&
        fd.distToDest != null
      ) {
        const flownNm = fd._originDist * 0.539957;
        const remainingRangeNm = Math.max(0, fd.specs.range - flownNm);
        const { lat, lon } = getUserLocation();
        renderFuelRangeRing(
          scene,
          fd.latitude,
          fd.longitude,
          remainingRangeNm,
          lat,
          lon,
        );
      } else {
        clearFuelRangeRing(scene);
      }
    }
  } else {
    hideTCASDisplay();
    clearFuelRangeRing(scene);
  }

  if (composer) composer.render();
  else renderer.render(scene, camera);
}

// --- City picker ---
// 400 airports total: 98 Americas · 118 Europe · 23 Middle East · 43 Africa · 98 Asia · 20 Pacific

// Build lookup index for aircraft.js to find destination coordinates
const _cityByCode = {};
for (const c of CITIES) _cityByCode[c.code] = c;
window._findCityByCode = (code) => _cityByCode[code] || null;
window._CITIES = CITIES;
window._getAirportData = (code) =>
  typeof AIRPORT_DATA !== "undefined" ? AIRPORT_DATA[code] : null;

let activeCity = null;

const sceneTrans = document.getElementById("scene-transition");
const sceneTransCode = document.getElementById("scene-trans-code");
const sceneTransName = document.getElementById("scene-trans-name");

async function switchCity(city) {
  if (activeCity && activeCity.code === city.code) return;
  activeCity = city;
  sessionStats.cities.add(city.code);

  // 1. Show city name and fade to black
  if (sceneTransCode) sceneTransCode.textContent = city.code;
  if (sceneTransName) sceneTransName.textContent = city.name;
  if (sceneTrans) {
    sceneTrans.style.transition = "opacity 0.2s ease";
    sceneTrans.style.opacity = "1";
    sceneTrans.style.pointerEvents = "all";
    sceneTrans.classList.add("loading");
  }

  // 2. Wait for screen to go dark
  await new Promise((r) => setTimeout(r, 200));

  // 3. Clear old scene while screen is dark
  closeDetail();
  stopFollow();
  if (selectedAirportState) {
    deselectAirport(scene);
    if (aircraftManager) {
      aircraftManager.clearFilter();
      aircraftManager.clearHighlight();
    }
    hideAirportWidget();
    selectedAirportState = null;
  }
  if (aircraftManager) aircraftManager.clearAll(scene);
  clearGroundMap(scene);
  clearAirports(scene);
  clearFIRBoundaries(scene);
  clearNavChart(scene);

  setUserLocation(city.lat, city.lon);
  restartPolling(); // Immediately re-poll with new city coordinates
  if (aircraftManager) aircraftManager.updateUserLocation(city.lat, city.lon);
  updateHUDCity(city.name, city.code);
  setCommonsPlace(city.name);
  setATCAirport(AIRPORT_DATA[city.code]?.icao || null);
  updateHUDAirports(0);

  // Reset camera to cinematic angle -- unless the boot descent is already
  // on its way there.
  if (!_introRunning) {
    controls.enabled = false;
    camera.position.set(8, 9, 12);
    controls.target.set(0, 1, 0);
    controls.update();
    controls.enabled = true;
  }

  // 4. Load ground map + airports + FIR in parallel; nav chart after airports
  const mapP = loadGroundMap(city.lat, city.lon);
  const aptP = loadAirports(scene, city.lat, city.lon).then(() => {
    const aptData = getAirportData();
    if (aptData) updateHUDAirports(aptData.airports.length);
  });
  reloadFIRForLocation(scene, city.lat, city.lon);
  // Nav chart needs airportData for ILS corridors — wait for airports
  aptP.then(() => reloadNavChart(scene, city.lat, city.lon));
  // Wait for map, then give airports up to 2s more before revealing
  await mapP;
  if (sceneTransName)
    sceneTransName.textContent = `${city.name}  ·  Loading airports...`;
  await Promise.race([aptP, new Promise((r) => setTimeout(r, 2000))]);

  // 5. Fade back — map ready, airports loaded or timed out (will appear when ready)
  if (sceneTransName) sceneTransName.textContent = city.name;
  if (sceneTrans) {
    sceneTrans.classList.remove("loading");
    sceneTrans.style.transition = "opacity 0.9s ease";
    sceneTrans.style.opacity = "0";
    sceneTrans.style.pointerEvents = "";
  }

  // T3-02: Refresh weather for new city
  updateWeatherWidget();

  // Reset loading state for new city
  _aptLoadDone = false;
  _aircraftArrived = false;
  _setLoadStatus("Loading airports…");

  // Re-wire airport done callback for the new city
  aptP.then(() => {
    if (activeCity.code !== city.code) return; // city changed again
    _onAptLoaded();
  });

  // Check low-coverage zone after data has had time to arrive
  setTimeout(() => {
    if (activeCity.code === city.code) _checkLowCoverage(city);
  }, 12000);
}

// ── Globe helpers ────────────────────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371,
    t = Math.PI / 180;
  const dLat = (lat2 - lat1) * t,
    dLon = (lon2 - lon1) * t;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * t) * Math.cos(lat2 * t) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function greatCirclePts(lat1, lon1, lat2, lon2, n = 48) {
  const t = Math.PI / 180,
    toDeg = (r) => (r * 180) / Math.PI;
  const φ1 = lat1 * t,
    λ1 = lon1 * t,
    φ2 = lat2 * t,
    λ2 = lon2 * t;
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
      ),
    );
  if (d < 0.0001) return [];
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const A = Math.sin((1 - f) * d) / Math.sin(d),
      B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    pts.push({
      lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
      lon: toDeg(Math.atan2(y, x)),
    });
  }
  return pts;
}

// ── Hub tier sets (shared by GlobeView + city picker) ───────────────────────
const _computeDotSizesSet_MEGA = new Set([
  "ATL",
  "DFW",
  "DEN",
  "ORD",
  "LAX",
  "JFK",
  "SFO",
  "SEA",
  "LAS",
  "MCO",
  "CLT",
  "MIA",
  "EWR",
  "BOS",
  "MSP",
  "DTW",
  "IAH",
  "PHX",
  "IAD",
  "PHL",
  "DCA",
  "LHR",
  "CDG",
  "FRA",
  "AMS",
  "MAD",
  "FCO",
  "BCN",
  "MUC",
  "ZRH",
  "VIE",
  "IST",
  "DME",
  "DXB",
  "DOH",
  "RUH",
  "SIN",
  "PEK",
  "PVG",
  "HND",
  "NRT",
  "ICN",
  "BKK",
  "HKG",
  "KUL",
  "CAN",
  "CTU",
  "SZX",
  "DEL",
  "BOM",
  "SYD",
  "MEL",
  "GRU",
  "MEX",
]);
const _computeDotSizesSet_MAJOR = new Set([
  "PDX",
  "SAN",
  "SLC",
  "TPA",
  "RDU",
  "BWI",
  "MCI",
  "OAK",
  "MSY",
  "AUS",
  "SMF",
  "SJC",
  "CLE",
  "CMH",
  "OGG",
  "FLL",
  "MDW",
  "HNL",
  "STL",
  "BNA",
  "RSW",
  "ORY",
  "MXP",
  "LGW",
  "ARN",
  "CPH",
  "HEL",
  "OSL",
  "DUB",
  "LIS",
  "BRU",
  "PRG",
  "BUD",
  "WAW",
  "ATH",
  "AUH",
  "SVO",
  "LED",
  "CAI",
  "CMN",
  "JNB",
  "CPT",
  "NBO",
  "ADD",
  "LOS",
  "ACC",
  "DAR",
  "CGK",
  "MNL",
  "TPE",
  "KUL",
  "CCU",
  "KHI",
  "LHE",
  "AKL",
  "PER",
  "ADL",
  "BNE",
  "GRU",
  "GIG",
  "EZE",
  "SCL",
  "LIM",
  "BOG",
]);

// ── Globe View ──────────────────────────────────────────────────────────────
class GlobeView {
  constructor(canvas, onSelect) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onSelect = onSelect;
    this.onHover = () => {};
    this.focusedIdx = -1;
    this._pulsePhase = 0;
    this._nearbyIdxs = [];
    this.viewLon = 0;
    this.viewLat = 20;
    this._tLon = 0;
    this._tLat = 20;
    this.activeRegion = "All";
    this.searchQuery = "";
    this.selectedIdx = -1;
    this.hoveredIdx = -1;
    this._dragging = false;
    this._lastX = 0;
    this._lastY = 0;
    this._autoRotate = true;
    this._paused = true;
    this._raf = null;
    this.cx = 0;
    this.cy = 0;
    this.R = 0;
    this._baseR = 0;
    this._zoom = 1.25;
    this._targetZoom = 1.25;
    this._landRings = null;
    this._landGrid = null;
    this._coastGrid = null;
    this._landW = 0;
    this._landH = 0;
    this._landOC = null;
    this._landCacheLon = NaN;
    this._landCacheLat = NaN;
    this._landCacheR = NaN;
    this._dotSizes = null;
    this._unseenMode = false;
    this._sinLat = null;
    this._cosLat = null;
    this._sinLon = null;
    this._cosLon = null;
    this._bindEvents();
    this._fetchLand();
    this._computeDotSizes();
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cx = w / 2;
    this.cy = h / 2;
    this._baseR = Math.min(w, h) * 0.48;
    this.R = this._baseR * this._zoom;
  }

  _proj(lat, lon) {
    const D = Math.PI / 180;
    const phi = lat * D,
      phi0 = this.viewLat * D;
    const dl = (lon - this.viewLon) * D;
    const cosc =
      Math.sin(phi0) * Math.sin(phi) +
      Math.cos(phi0) * Math.cos(phi) * Math.cos(dl);
    return {
      x: this.cx + this.R * Math.cos(phi) * Math.sin(dl),
      y:
        this.cy -
        this.R *
          (Math.cos(phi0) * Math.sin(phi) -
            Math.sin(phi0) * Math.cos(phi) * Math.cos(dl)),
      visible: cosc >= 0,
      depth: cosc,
    };
  }

  _draw() {
    const ctx = this.ctx;
    const { cx, cy, R } = this;
    ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

    // ── Atmosphere ──
    // One flat blue ring at 4% was a halo, not air. Air has a thickness and a
    // colour that changes through it: the outermost reach is the cold violet
    // of the edge of the atmosphere, the band hard against the limb is the
    // pale warm one you see from orbit, and between them it is the sky's own
    // blue. Three stops instead of one, and reaching further out, so the globe
    // sits in something rather than being cut out of the panel.
    const glow = ctx.createRadialGradient(cx, cy, R * 0.86, cx, cy, R * 1.3);
    glow.addColorStop(0, "rgba(120,150,190,0)");
    glow.addColorStop(0.28, "rgba(186,196,208,0.10)");
    glow.addColorStop(0.5, "rgba(96,136,190,0.075)");
    glow.addColorStop(0.78, "rgba(70,92,150,0.03)");
    glow.addColorStop(1, "rgba(60,76,130,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Globe ocean fill — deep blue gradient with subtle light source
    const fill = ctx.createRadialGradient(
      cx - R * 0.3,
      cy - R * 0.3,
      0,
      cx,
      cy,
      R,
    );
    // The ocean was four blues, each darker than the last, which is a ball of
    // one colour with a shadow on it. Deep water seen through air is not blue
    // all the way down: it is a cool slate where the light lands, it loses its
    // blue as it turns away, and at the limb it goes to the near-black of a
    // planet's edge with a little of the atmosphere's warmth caught in it.
    fill.addColorStop(0, "#16293f");
    fill.addColorStop(0.35, "#101f31");
    fill.addColorStop(0.68, "#0a1420");
    fill.addColorStop(0.9, "#080e15");
    fill.addColorStop(1, "#0a0c0f");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();

    // Clip to globe disk
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    this._drawLand();
    // _drawGrid() drew the equator, the tropics and every fifteenth meridian
    // as rows of small blue squares. On the whole globe it read as a graticule;
    // zoomed in it read as litter over the ocean, and it was the last thing on
    // this canvas competing with the airports for attention. Filled land tells
    // you where you are without it.
    if (this.focusedIdx >= 0) this._drawArcs();
    this._drawDots();
    this._drawAircraftDots();
    if (this.focusedIdx >= 0) this._drawPulse(ctx);
    ctx.restore();

    // Specular highlight on top-left
    const spec = ctx.createRadialGradient(
      cx - R * 0.35,
      cy - R * 0.35,
      0,
      cx - R * 0.35,
      cy - R * 0.35,
      R * 0.5,
    );
    spec.addColorStop(0, "rgba(214,226,238,0.055)");
    spec.addColorStop(0.55, "rgba(150,180,215,0.02)");
    spec.addColorStop(1, "rgba(150,180,215,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = spec;
    ctx.fill();

    // Thin subtle edge — no heavy ring frame
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(196,160,88,0.08)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  _drawArcs() {
    if (this._nearbyIdxs.length === 0) return;
    const ctx = this.ctx;
    const src = CITIES[this.focusedIdx];
    for (let ni = 0; ni < this._nearbyIdxs.length; ni++) {
      const dst = CITIES[this._nearbyIdxs[ni]];
      const pts = greatCirclePts(src.lat, src.lon, dst.lat, dst.lon, 60);
      const projected = pts.map(({ lat, lon }) => this._proj(lat, lon));
      const baseAlpha =
        ni === 0 ? 0.35 : ni === 1 ? 0.22 : ni === 2 ? 0.14 : 0.08;

      // Draw arc segments that taper from center outward
      for (let k = 0; k < projected.length - 1; k++) {
        const a = projected[k],
          b = projected[k + 1];
        if (!a.visible || !b.visible) continue;
        const t = k / projected.length;
        const taper = Math.sin(t * Math.PI);
        const alpha = baseAlpha * taper * Math.min(a.depth, b.depth);
        if (alpha < 0.01) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(196,160,88,${alpha})`;
        ctx.lineWidth = ni === 0 ? 1.2 : 0.7;
        ctx.stroke();
      }

      // Small dot at destination
      const dp = this._proj(dst.lat, dst.lon);
      if (dp.visible) {
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,160,88,${baseAlpha * 1.5 * dp.depth})`;
        ctx.fill();
      }
    }
  }

  _drawPulse(ctx) {
    this._pulsePhase += 0.035;
    const c = CITIES[this.focusedIdx];
    const p = this._proj(c.lat, c.lon);
    if (!p.visible) return;
    const t = this._pulsePhase;

    // Expanding rings (2 staggered)
    for (let k = 0; k < 2; k++) {
      const phase = (t * 1.5 + k * Math.PI) % (Math.PI * 2);
      const progress = phase / (Math.PI * 2);
      const r = 4 + progress * 18;
      const alpha = (1 - progress) * 0.4;
      if (alpha < 0.02) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(196,160,88,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Crosshair lines
    const ch = 6;
    const cAlpha = 0.3 + Math.sin(t * 2) * 0.1;
    ctx.strokeStyle = `rgba(196,160,88,${cAlpha})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(p.x - ch, p.y);
    ctx.lineTo(p.x - 3, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x + 3, p.y);
    ctx.lineTo(p.x + ch, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - ch);
    ctx.lineTo(p.x, p.y - 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + 3);
    ctx.lineTo(p.x, p.y + ch);
    ctx.stroke();

    // Inner dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,215,80,0.9)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,240,200,0.95)";
    ctx.fill();
  }

  _drawDots() {
    const ctx = this.ctx;
    const q = this.searchQuery;
    const zoom = this._zoom || 1;
    // Pre-project all cities once (avoid duplicating per pass)
    const projected = new Array(CITIES.length);
    for (let i = 0; i < CITIES.length; i++) {
      projected[i] = this._proj(CITIES[i].lat, CITIES[i].lon);
    }
    // Three passes: 0=unmatched dim, 1=matched airports, 2=selected/hovered (always on top)
    for (let pass = 0; pass < 3; pass++) {
      this._unseenLabels = [];
    for (let i = 0; i < CITIES.length; i++) {
        const p = projected[i];
        if (!p.visible) continue;
        const c = CITIES[i];
        const sel = i === this.selectedIdx;
        const hov = i === this.hoveredIdx;
        if (pass < 2 && (sel || hov)) continue;
        if (pass === 2 && !sel && !hov) continue;
        const matches =
          (this.activeRegion === "All" || c.region === this.activeRegion) &&
          (!q ||
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().startsWith(q));
        if (pass === 0 && matches) continue;
        if (pass === 1 && !matches) continue;
        const d = Math.max(0.2, p.depth);
        if (sel) {
          // Wide atmosphere bloom
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 18);
          g.addColorStop(0, `rgba(255,215,80,${0.55 * d})`);
          g.addColorStop(0.4, `rgba(196,160,88,${0.22 * d})`);
          g.addColorStop(1, "rgba(196,160,88,0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
          // Core dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,225,100,${d})`;
          ctx.fill();
          // Bright inner pin
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,248,210,${d})`;
          ctx.fill();
          // Outer ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,235,140,${0.55 * d})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          this._label(
            ctx,
            p,
            `${c.code}  ${c.name}`,
            "rgba(255,215,80,0.95)",
            true,
          );
        } else if (hov) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
          g.addColorStop(0, `rgba(100,200,255,${0.5 * d})`);
          g.addColorStop(1, "rgba(80,160,255,0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160,230,255,${d})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(120,200,255,${0.45 * d})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          this._label(
            ctx,
            p,
            `${c.code}  ${c.name}`,
            "rgba(160,230,255,0.92)",
            false,
          );
        } else if (matches) {
          const tier = this._dotSizes ? this._dotSizes[i] : 0;
          if (this._unseenMode) {
            if (!this._unseenLabels) this._unseenLabels = [];
            // The thesis as a picture: every measured sky a dot, size by how
            // many aircraft stood behind the measurement, colour by the share
            // that asked not to be seen -- cool where almost none did, warm
            // where one in seven did. Skies not yet measured stay faint, so
            // "no data" is never drawn as "no one hides here".
            const v = this._unseenByCity ? this._unseenByCity[i] : null;
            if (!v) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, 1.1 + zoom * 0.1, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(150,160,180,${0.22 * d})`;
              ctx.fill();
            } else {
              const t = Math.min(1, v.share / 0.15);
              const r = Math.round(120 + 135 * t), g = Math.round(150 + 50 * t), b = Math.round(190 - 110 * t);
              const coreR = 1.8 + zoom * 0.25 + Math.log10(Math.max(10, v.total)) * 0.9;
              ctx.beginPath();
              ctx.arc(p.x, p.y, coreR + 4, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${r},${g},${b},${0.10 * d})`;
              ctx.fill();
              ctx.beginPath();
              ctx.arc(p.x, p.y, coreR, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${r},${g},${b},${0.85 * d + 0.1})`;
              ctx.fill();
              // One label per patch of screen: the West Coast and the New York
              // fields sit a few pixels apart at this zoom, and a stack of
              // overlapping percentages says less than one.
              const placed = this._unseenLabels;
              let clear = true;
              for (const q of placed) { if (Math.abs(q.x - p.x) < 34 && Math.abs(q.y - p.y) < 14) { clear = false; break; } }
              if (clear) {
                placed.push({ x: p.x, y: p.y });
                this._label(ctx, p, `${c.code}  ${Math.round(v.share * 100)}%`, `rgba(${r},${g},${b},0.95)`, false);
              }
            }
          } else if (tier === 2) {
            // MEGA HUB — wide atmosphere bloom + bright core + outer ring
            const coreR = 2.4 + zoom * 0.3;
            // Wide soft bloom
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR + 7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,195,50,${0.08 * d})`;
            ctx.fill();
            // Mid bloom ring
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR + 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,210,80,${0.14 * d})`;
            ctx.fill();
            // Core
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,225,110,${0.88 * d + 0.12})`;
            ctx.fill();
            // Bright pin center
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,248,200,${0.7 * d})`;
            ctx.fill();
            // Outer stroke ring
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR + 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,235,160,${0.5 * d})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
            if (zoom > 0.7) {
              this._label(
                ctx,
                p,
                c.code,
                `rgba(255,225,120,${0.75 * d})`,
                false,
              );
            }
          } else if (tier === 1) {
            // MAJOR — core + mid glow + ring
            const coreR = 1.7 + zoom * 0.22;
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR + 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(210,175,90,${0.1 * d})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(225,198,115,${0.7 * d + 0.15})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,235,175,${0.55 * d})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, coreR + 1.2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(220,200,130,${0.35 * d})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            if (zoom > 0.9) {
              this._label(
                ctx,
                p,
                c.code,
                `rgba(225,200,130,${0.6 * d})`,
                false,
              );
            }
          } else {
            // REGIONAL — dot with soft halo.
            //
            // Squares, not circles. This branch holds the great majority of
            // 1,623 airports and was drawing three separate arc paths each,
            // which measured 3,213 arc() calls a frame and put the rotation at
            // a 32ms ninetieth percentile -- visible judder. coreR here is
            // about 1.4px, and at that size a filled rect and a filled circle
            // are the same handful of pixels; the halo is a second rect at 12%
            // alpha, which is what the old outer arc amounted to anyway. The
            // stroked ring is gone: a 0.45px stroke on a 1.4px dot is not a
            // ring, it is a slightly softer edge, and it cost a third of the
            // paths in this branch on its own.
            //
            // The two tiers above keep their arcs. They are large, few, and
            // the bloom is the thing that makes a hub read as a hub.
            const coreR = 1.2 + zoom * 0.18;
            const hw = coreR + 1.4;
            ctx.fillStyle = `rgba(200,175,110,${0.12 * d})`;
            ctx.fillRect(p.x - hw, p.y - hw, hw * 2, hw * 2);
            ctx.fillStyle = `rgba(210,185,120,${0.6 * d + 0.12})`;
            ctx.fillRect(p.x - coreR, p.y - coreR, coreR * 2, coreR * 2);
            if (zoom > 1.8) {
              this._label(
                ctx,
                p,
                c.code,
                `rgba(210,190,140,${0.45 * d})`,
                false,
              );
            }
          }
        } else {
          // Unmatched — denser star-field: brighter, larger dots
          const hash = (i * 7 + 3) % 4;
          const r = hash === 0 ? 0.6 : hash === 1 ? 0.8 : 1.0;
          const a = hash === 0 ? 0.22 * d + 0.06 : 0.35 * d + 0.08;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(70,100,150,${a})`;
          ctx.fill();
        }
      }
    }
  }

  // T3-08: Live aircraft dots on globe
  _drawAircraftDots() {
    if (!lastRawData || lastRawData.length === 0) return;
    const ctx = this.ctx;
    for (let i = 0; i < lastRawData.length; i++) {
      const ac = lastRawData[i];
      if (ac.latitude == null || ac.longitude == null) continue;
      const p = this._proj(ac.latitude, ac.longitude);
      if (!p.visible) continue;
      const d = Math.max(0.25, p.depth);
      // Soft halo
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(60,210,170,${0.18 * d})`;
      ctx.fill();
      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(80,225,185,${0.65 * d})`;
      ctx.fill();
    }
  }

  _label(ctx, p, text, color, bold) {
    ctx.font = `${bold ? "600" : "400"} 9px Inter,system-ui,sans-serif`;
    const tw = ctx.measureText(text).width;
    let lx = p.x + 10;
    if (lx + tw + 10 > this.cx + this.R) lx = p.x - tw - 14;
    const ly = p.y - 4;
    // Frosted glass background
    const pad = 4;
    const rr = 3;
    const bx = lx - pad,
      by = ly - 12,
      bw = tw + pad * 2 + 2,
      bh = 16;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bx, by, bw, bh, rr);
    } else {
      ctx.rect(bx, by, bw, bh);
    }
    ctx.fillStyle = "rgba(6,12,24,0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(196,160,88,0.15)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    // Text
    ctx.fillStyle = color;
    ctx.fillText(text, lx, ly);
  }

  async _fetchLand() {
    try {
      let res;
      try {
        res = await fetch("/api/atlas", { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error("Worker atlas failed");
      } catch {
        res = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json",
        );
      }
      const topo = await res.json();
      this._landRings = this._decodeTopo(topo);
      // Precompute bounding boxes for ring-skip optimization
      for (const ring of this._landRings) {
        let minLat = 90,
          maxLat = -90,
          minLon = 180,
          maxLon = -180;
        for (const { lat, lon } of ring) {
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
        }
        ring._bb = [minLat, maxLat, minLon, maxLon];
      }
      // 0.5° resolution grid: 720 cols x 342 rows
      const W = 720,
        H = 342;
      const grid = new Uint8Array(W * H);
      const coast = new Uint8Array(W * H);
      // Sample a hair off the half-degree lattice.
      //
      // Ray casting is undefined when the ray passes exactly through a
      // polygon vertex, and land-110m's coordinates are quantised, so a great
      // many vertices share one exact latitude. Where such a latitude lands on
      // a sample row, the parity breaks for that row across the whole world:
      // measured, rows at -16.5, 64.5 and 69.5 degrees came back with three
      // times their neighbours' land and drew as a line of "land" straight
      // across open ocean. The stipple rendered those lines as dotted rows
      // that read as part of the graticule, which is why three false parallels
      // survived in plain sight.
      const OFF = 0.0007;
      for (let r = 0; r < H; r++) {
        const lat = -85 + r * 0.5 + OFF;
        for (let c = 0; c < W; c++) {
          const lon = -180 + c * 0.5 + OFF;
          if (this._pointInPoly(lat, lon)) grid[r * W + c] = 1;
        }
      }
      for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
          const gi = r * W + c;
          if (!grid[gi]) continue;
          const up = r > 0 ? grid[(r - 1) * W + c] : 0;
          const dn = r < H - 1 ? grid[(r + 1) * W + c] : 0;
          const lt = grid[r * W + ((c + 1) % W)];
          const rt = c > 0 ? grid[r * W + c - 1] : grid[r * W + W - 1];
          if (!up || !dn || !lt || !rt) coast[gi] = 1;
        }
      }
      this._landGrid = grid;
      this._coastGrid = coast;
      this._landW = W;
      this._landH = H;
      // Precompute sin/cos for grid coordinates
      const sinLat = new Float32Array(H);
      const cosLat = new Float32Array(H);
      const sinLon = new Float32Array(W);
      const cosLon = new Float32Array(W);
      const D = Math.PI / 180;
      for (let r = 0; r < H; r++) {
        const lat = (-85 + r * 0.5) * D;
        sinLat[r] = Math.sin(lat);
        cosLat[r] = Math.cos(lat);
      }
      for (let c = 0; c < W; c++) {
        const lon = (-180 + c * 0.5) * D;
        sinLon[c] = Math.sin(lon);
        cosLon[c] = Math.cos(lon);
      }
      this._sinLat = sinLat;
      this._cosLat = cosLat;
      this._sinLon = sinLon;
      this._cosLon = cosLon;
      this._landRings = null; // free memory
    } catch (e) {
      console.warn("[GlobeView] land fetch failed:", e.message);
    }
  }

  _decodeTopo(topo) {
    const { scale, translate } = topo.transform;
    const arcs = topo.arcs.map((arc) => {
      let x = 0,
        y = 0;
      return arc.map(([dx, dy]) => {
        x += dx;
        y += dy;
        return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
      });
    });
    const rings = [];
    const collect = (geo) => {
      if (geo.type === "Polygon") {
        for (const arcRefs of geo.arcs) {
          const ring = [];
          for (const ref of arcRefs) {
            const arc = ref < 0 ? arcs[~ref].slice().reverse() : arcs[ref];
            for (const [lon, lat] of arc) ring.push({ lat, lon });
          }
          rings.push(ring);
        }
      } else if (geo.type === "MultiPolygon") {
        for (const poly of geo.arcs)
          for (const arcRefs of poly) {
            const ring = [];
            for (const ref of arcRefs) {
              const arc = ref < 0 ? arcs[~ref].slice().reverse() : arcs[ref];
              for (const [lon, lat] of arc) ring.push({ lat, lon });
            }
            rings.push(ring);
          }
      } else if (geo.type === "GeometryCollection") {
        for (const g of geo.geometries) collect(g);
      }
    };
    collect(topo.objects.land);
    // Unwrap longitudes so no ring contains a 360-degree jump.
    //
    // Fiji, Chukotka, Wrangel Island and Antarctica all cross the
    // antimeridian, and in raw coordinates such a ring steps from +179.9 to
    // -179.9 — a short edge on the globe, a sweep across the whole map in the
    // plane. Planar ray casting cannot survive that, and what it produced here
    // was three false parallels: at -16.5 (Fiji's latitudes), 64.5 and 69.5
    // (Chukotka's), every cell east of the seam came back as land. After
    // unwrapping, Fiji simply spans 178 to 182 and the ray sees an ordinary
    // closed ring.
    for (const ring of rings) {
      for (let i = 1; i < ring.length; i++) {
        const d = ring[i].lon - ring[i - 1].lon;
        if (d > 180) ring[i].lon -= 360;
        else if (d < -180) ring[i].lon += 360;
      }
    }
    return rings;
  }

  _pointInPoly(lat, lon) {
    // Even-odd per ring, then XOR across rings.
    //
    // This used to keep one `inside` flag for every ring at once while also
    // skipping rings by bounding box — two different algorithms sharing a
    // loop. Cross-ring parity only works if every ring the ray crosses is
    // counted, and the box test threw away exactly the rings to the east that
    // the ray does cross. Testing each ring on its own makes the box a real
    // early-out (a point outside a ring's box is outside that ring) and makes
    // holes come out right for free.
    let inside = false;
    for (const ring of this._landRings) {
      const bb = ring._bb;
      let L = lon;
      if (bb) {
        if (lat < bb[0] || lat > bb[1]) continue;
        // Rings are unwrapped, so one may live at 178..182; a point at -179
        // has to be compared as +181.
        if (L < bb[2]) L += 360;
        else if (L > bb[3]) L -= 360;
        if (L < bb[2] || L > bb[3]) continue;
      }
      let hit = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const yi = ring[i].lat,
          xi = ring[i].lon;
        const yj = ring[j].lat,
          xj = ring[j].lon;
        if (
          yi > lat !== yj > lat &&
          L < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
        ) {
          hit = !hit;
        }
      }
      if (hit) inside = !inside;
    }
    return inside;
  }

  _drawLand() {
    if (!this._landGrid) return;
    const { R, cx, cy, viewLon, viewLat } = this;

    const needsRedraw =
      !this._landOC ||
      Math.abs(viewLon - this._landCacheLon) > 0.15 ||
      Math.abs(viewLat - this._landCacheLat) > 0.15 ||
      Math.abs(R - this._landCacheR) > 0.5;

    if (needsRedraw) {
      const w = this.canvas.clientWidth,
        h = this.canvas.clientHeight;
      if (!this._landOC) this._landOC = document.createElement("canvas");
      this._landOC.width = w;
      this._landOC.height = h;
      const lc = this._landOC.getContext("2d");
      const imgData = lc.createImageData(w, h);
      const px = imgData.data;

      const W = this._landW,
        H = this._landH;
      const step = R < 100 ? 4 : R < 160 ? 3 : R < 240 ? 2 : 1;
      // The land is a stipple of small dots, one per 0.5-degree cell. Zoomed in,
      // a cell spans R * 0.5deg pixels on screen and the dots drift apart until
      // continents look hollow. Subdividing each cell keeps dots ~2px apart at
      // any zoom; at the default zoom `sub` is 1 and this is the original loop.
      // Subdivision keeps the dots about 2.2px apart whatever the zoom, which
      // is the whole premise of drawing land as a stipple.
      //
      // The clamp used to be 4, which was enough while the picker stopped at
      // 6x. At the zooms it allows now a cell spans 37px and four sub-samples
      // put the dots 9px apart — the land came out sparser than the airports
      // over it and stopped reading as land at all, which is the very thing
      // the fill was meant to solve. The window below means only a few hundred
      // cells are visible at those zooms, so a much higher ceiling costs
      // almost nothing; measured, the whole rebuild stays under a millisecond.
      const sub =
        step > 1
          ? 1
          : Math.max(1, Math.min(22, Math.round((R * 0.00872665) / 2.2)));
      const D = Math.PI / 180;
      const sinP0 = Math.sin(viewLat * D);
      const cosP0 = Math.cos(viewLat * D);
      const vl = viewLon * D;
      const cosVl = Math.cos(vl);
      const sinVl = Math.sin(vl);

      // Only walk the part of the grid that can land on this canvas.
      //
      // The loop used to visit all 720x342 cells whichever way the globe was
      // turned, and then multiply that by up to 16 with subdivision. At the
      // default zoom that is most of a hemisphere and the work is real; at the
      // zooms this picker now allows, the visible cap is a few degrees across
      // and the other 99% of the world is projected, tested and thrown away
      // every time the cache is rebuilt — which, while a zoom animates, is
      // every frame. Hence the jank.
      //
      // The visible cap is a circle of angular radius asin(rMax / R) around
      // the view centre, where rMax is the canvas' own half-diagonal. Latitude
      // clamps directly; longitude has to widen by 1/cos(lat) as it nears the
      // pole, and gives up and takes the whole row once the cap contains one.
      const rMax = Math.hypot(w, h) / 2;
      const capRad = rMax >= R ? Math.PI / 2 : Math.asin(rMax / R);
      const capDeg = capRad / D + 0.75; // a cell of slack at the rim
      const latLo = Math.max(-85, viewLat - capDeg);
      const latHi = Math.min(85, viewLat + capDeg);
      const rowLo = Math.max(0, Math.floor((latLo + 85) / 0.5));
      const rowHi = Math.min(H - 1, Math.ceil((latHi + 85) / 0.5));
      const polar = latHi >= 84 || latLo <= -84;

      // Walk whole cells, and oversample only the ones that are land.
      //
      // The loop used to step in 1/sub increments across the entire window and
      // test the land grid at every sub-sample, which at the default zoom is
      // 890,000 iterations to draw perhaps 28,000 dots — the oversampling is
      // there to fill land, and it was being paid for over every square of
      // ocean as well. Testing each cell once and then placing its sub-dots
      // does exactly the same drawing for a quarter of the work.
      //
      // The longitude wrap also moved out of the inner loop. Two modulo
      // operations per sub-sample, nearly a million times a rebuild, was a
      // regression I introduced along with the window: at the default zoom the
      // window covers every column anyway, so the wrap is only needed when it
      // does not.
      const subStep = step / sub;

      // Sub-sample offsets as sin/cos pairs.
      //
      // There are only `sub` distinct offsets, and a sample's latitude is the
      // cell's latitude plus one of them — so angle addition turns what was
      // four Math.sin/Math.cos calls per sub-sample into four multiplies
      // against the sin/cos tables the grid already carries. At the default
      // zoom that was around half a million trig calls per rebuild, which was
      // most of what was left of the cost.
      const offS = new Float64Array(sub);
      const offC = new Float64Array(sub);
      for (let k = 0; k < sub; k++) {
        const a = k * subStep * 0.5 * D;
        offS[k] = Math.sin(a);
        offC[k] = Math.cos(a);
      }

      for (let r = rowLo; r <= rowHi; r += step) {
        const rowBase = r * W;
        const sinR = this._sinLat[r];
        const cosR = this._cosLat[r];

        // Longitude window for this row. It widens by 1/cos(lat) toward the
        // pole and gives up once the visible cap contains one.
        let colLo = 0,
          colHi = W - 1;
        if (!polar && capDeg < 175) {
          const cosLat = cosR < 0 ? -cosR : cosR;
          const halfLon = cosLat < 0.02 ? 181 : capDeg / cosLat + 0.75;
          if (halfLon < 180) {
            colLo = Math.floor((viewLon - halfLon + 180) / 0.5);
            colHi = Math.ceil((viewLon + halfLon + 180) / 0.5);
          }
        }
        // Only the windowed case can run off the ends of the grid.
        const wraps = colLo < 0 || colHi > W - 1;

        for (let sr = 0; sr < sub; sr++) {
          // Latitude trig, once per row and sub-row rather than once per cell.
          const sinPhi = sinR * offC[sr] + cosR * offS[sr];
          const cosPhi = cosR * offC[sr] - sinR * offS[sr];
          const zTerm = cosP0 * sinPhi;
          const nTerm = sinP0 * cosPhi;

          for (let cc = colLo; cc <= colHi; cc += step) {
            const c = wraps ? ((cc % W) + W) % W : cc;
            const gi = rowBase + c;
            if (!this._landGrid[gi]) continue;
            const isCoast = this._coastGrid[gi];
            // The coast is one dot per cell however finely the interior is
            // sampled, or it thickens into a band as the cell splits up.
            if (isCoast && sr > 0) continue;
            const subs = isCoast ? 1 : sub;
            const sinC = this._sinLon[c];
            const cosC = this._cosLon[c];

            for (let sc = 0; sc < subs; sc++) {
              const sinLon = sinC * offC[sc] + cosC * offS[sc];
              const cosLon = cosC * offC[sc] - sinC * offS[sc];
              // Inline projection — no object allocation
              const dl = sinLon * cosVl - cosLon * sinVl;
              const dlc = cosLon * cosVl + sinLon * sinVl;
              const cosc = sinP0 * sinPhi + cosP0 * cosPhi * dlc;
              if (cosc < 0) continue; // not visible
              const x = cx + R * cosPhi * dl;
              const y = cy - R * (zTerm - nTerm * dlc);
              if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
              const d = cosc < 0.15 ? 0.15 : cosc;

              // Write pixels directly to ImageData — much faster than fillRect
              const sz = isCoast
                ? step <= 1
                  ? 1
                  : step === 2
                    ? 2
                    : step === 3
                      ? 2
                      : 3
                : step <= 1
                  ? 1
                  : step === 2
                    ? 1
                    : step === 3
                      ? 2
                      : 2;
              const alpha = isCoast
                ? ((0.55 * d + 0.2) * 255 + 0.5) | 0
                : ((0.5 * d + 0.16) * 255 + 0.5) | 0;
              // Land was blue — a lighter blue on a blue ocean, which is why
              // the whole globe read as one colour. Ground is not blue: the
              // coast catches the light as a pale warm grey and the interior
              // settles into a muted olive-slate, so land and water separate
              // by hue instead of by brightness alone.
              const rr = isCoast ? 142 : 74;
              const gg = isCoast ? 140 : 78;
              const bb = isCoast ? 130 : 76;
              const px0 = (x - sz / 2 + 0.5) | 0;
              const py0 = (y - sz / 2 + 0.5) | 0;
              for (let dy = 0; dy < sz; dy++) {
                const py = py0 + dy;
                if (py < 0 || py >= h) continue;
                const rowPx = py * w;
                for (let dx = 0; dx < sz; dx++) {
                  const ppx = px0 + dx;
                  if (ppx < 0 || ppx >= w) continue;
                  const idx = (rowPx + ppx) * 4;
                  px[idx] = rr;
                  px[idx + 1] = gg;
                  px[idx + 2] = bb;
                  px[idx + 3] = alpha;
                }
              }
            }
          }
        }
      }
      lc.putImageData(imgData, 0, 0);
      this._landCacheLon = viewLon;
      this._landCacheLat = viewLat;
      this._landCacheR = R;
    }

    this.ctx.drawImage(this._landOC, 0, 0);
  }

  _computeDotSizes() {
    this._dotSizes = CITIES.map((c) =>
      _computeDotSizesSet_MEGA.has(c.code)
        ? 2
        : _computeDotSizesSet_MAJOR.has(c.code)
          ? 1
          : 0,
    );
  }

  _bindEvents() {
    const c = this.canvas;
    c.addEventListener("mousedown", (e) => {
      this._dragging = true;
      this._autoRotate = false;
      this._lastX = e.clientX;
      this._lastY = e.clientY;
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
      if (!this._paused) this._onMove(e);
    });
    window.addEventListener("mouseup", () => {
      this._dragging = false;
    });
    c.addEventListener("mouseleave", () => {
      if (!this._dragging) {
        this.hoveredIdx = -1;
        this.onHover(-1);
      }
    });
    c.addEventListener("click", () => {
      if (this.hoveredIdx >= 0) {
        this.selectedIdx = this.hoveredIdx;
        this.onSelect(this.hoveredIdx);
      }
    });
    c.addEventListener(
      "touchstart",
      (e) => {
        this._dragging = true;
        this._autoRotate = false;
        this._lastX = e.touches[0].clientX;
        this._lastY = e.touches[0].clientY;
      },
      { passive: true },
    );
    c.addEventListener(
      "touchmove",
      (e) => {
        if (!this._dragging) return;
        const dx = e.touches[0].clientX - this._lastX;
        const dy = e.touches[0].clientY - this._lastY;
        const sens = 0.5 / Math.max(this._zoom, 1);
        this.viewLon -= dx * sens;
        this._tLon = this.viewLon;
        this.viewLat = Math.max(
          -85,
          Math.min(85, this.viewLat + dy * sens * 0.6),
        );
        this._tLat = this.viewLat;
        this._lastX = e.touches[0].clientX;
        this._lastY = e.touches[0].clientY;
        e.preventDefault();
      },
      { passive: false },
    );
    c.addEventListener("touchend", () => {
      this._dragging = false;
    });
    c.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.88 : 1.14;
        this._targetZoom = Math.max(
          0.6,
          Math.min(16.0, this._targetZoom * factor),
        );
      },
      { passive: false },
    );
  }

  _onMove(e) {
    if (this._dragging) {
      const dx = e.clientX - this._lastX,
        dy = e.clientY - this._lastY;
      // Drag sensitivity scales inversely with zoom — zoomed in = finer control
      const sens = 0.5 / Math.max(this._zoom, 1);
      this.viewLon -= dx * sens;
      this._tLon = this.viewLon;
      this.viewLat = Math.max(
        -85,
        Math.min(85, this.viewLat + dy * sens * 0.6),
      );
      this._tLat = this.viewLat;
      this._lastX = e.clientX;
      this._lastY = e.clientY;
      this.hoveredIdx = -1;
    } else {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left,
        my = e.clientY - rect.top;
      const dx0 = mx - this.cx,
        dy0 = my - this.cy;
      if (dx0 * dx0 + dy0 * dy0 > this.R * this.R) {
        this.hoveredIdx = -1;
        return;
      }
      let best = -1,
        bestD = 14;
      for (let i = 0; i < CITIES.length; i++) {
        const p = this._proj(CITIES[i].lat, CITIES[i].lon);
        if (!p.visible) continue;
        const d = Math.hypot(p.x - mx, p.y - my);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best !== this.hoveredIdx) {
        this.hoveredIdx = best;
        this.canvas.style.cursor = best >= 0 ? "pointer" : "grab";
        this.onHover(best);
      }
    }
  }

  setFocused(idx) {
    this.focusedIdx = idx;
    this._pulsePhase = 0;
    if (idx >= 0) {
      const c = CITIES[idx];
      this._tLon = c.lon;
      this._tLat = Math.max(-70, Math.min(70, c.lat * 0.75));
      this._autoRotate = false;
      // precompute nearest 4 airports for arc drawing
      this._nearbyIdxs = CITIES.map((cc, i) => ({
        i,
        d: haversineKm(c.lat, c.lon, cc.lat, cc.lon),
      }))
        .filter(({ i }) => i !== idx)
        .sort((a, b) => a.d - b.d)
        .slice(0, 4)
        .map(({ i }) => i);
    } else {
      this._nearbyIdxs = [];
    }
  }

  _loop() {
    if (this._paused) return;
    this._raf = requestAnimationFrame(() => this._loop());
    if (this._autoRotate && !this._dragging) {
      this.viewLon += 0.05;
      this._tLon = this.viewLon;
    }
    if (!this._dragging) {
      this.viewLon += (this._tLon - this.viewLon) * 0.1;
      this.viewLat += (this._tLat - this.viewLat) * 0.1;
    }
    this._zoom += (this._targetZoom - this._zoom) * 0.12;
    this.R = this._baseR * this._zoom;
    this._draw();
  }

  setUnseenMode(on) {
    this._unseenMode = !!on;
    // One nearest-cell lookup per city, here, not per city per frame: with
    // 1,623 cities and a few hundred cells that was twenty-odd million
    // comparisons a second for a picture that only changes when the index does.
    this._unseenByCity = this._unseenMode ? CITIES.map((c) => _visShareFor(c.lat, c.lon)) : null;
  }

  setFilter(region, query) {
    this.activeRegion = region;
    this.searchQuery = (query || "").toLowerCase();
  }

  flyTo(lat, lon) {
    this._autoRotate = false;
    this._tLat = lat;
    // Shortest arc in longitude
    let dl = ((((lon - this.viewLon) % 360) + 540) % 360) - 180;
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
    // _resize ran only here, so the backing store was sized once when the
    // picker opened and never again. Resizing the window after that stretched
    // the canvas element while its pixels stayed the old shape, which squashes
    // the globe and everything drawn on it. Watch the element instead.
    if (!this._ro && typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => {
        if (!this._paused) this._resize();
      });
      this._ro.observe(this.canvas);
    }
    this._loop();
  }

  pause() {
    this._paused = true;
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  }
}

let _globeView = null;

// ── Airport metadata lookup ──────────────────────────────────────────────────
const AIRPORT_DATA = {
  // ── USA MEGA HUBS ──────────────────────────────────────────────────────────
  ATL: {
    icao: "KATL",
    elev: 1026,
    tz: "EST/EDT",
    rwys: 5,
    pax: 93.7,
    terminals: 2,
    rwyLen: "12390 ft",
    hub: "Delta",
    fact: "World's busiest airport — #1 for over 22 consecutive years",
    desc: "Atlanta pulses with the spirit of the American South — birthplace of Martin Luther King Jr., home of Coca-Cola, and a creative powerhouse where hip-hop, soul food, and civil rights history converge. The city's tree-lined neighborhoods and world-class aquarium make it as livable as it is historic.",
  },
  DFW: {
    icao: "KDFW",
    elev: 603,
    tz: "CST/CDT",
    rwys: 7,
    pax: 73.4,
    terminals: 5,
    rwyLen: "13401 ft",
    hub: "American",
    fact: "Larger than Manhattan Island at 69 km² — the world's 2nd largest airport campus",
    desc: "Dallas-Fort Worth is where Texas swagger meets cosmopolitan ambition — a sprawling metroplex of world-class museums, sizzling Tex-Mex, and Friday night football under stadium lights. The Arts District downtown is the largest contiguous urban arts district in the nation.",
  },
  DEN: {
    icao: "KDEN",
    elev: 5431,
    tz: "MST/MDT",
    rwys: 6,
    pax: 69.3,
    terminals: 1,
    rwyLen: "16000 ft",
    hub: "United/Frontier",
    fact: "At 5,431 ft — the highest major US airport. Its 16,000 ft runway can handle any aircraft",
    desc: "Denver sits a mile high where the Great Plains meet the Rocky Mountains — a city of craft breweries, outdoor adventure, and a thriving arts scene along the RiNo district's muraled warehouses. Red Rocks Amphitheatre and world-class skiing are less than an hour away.",
  },
  ORD: {
    icao: "KORD",
    elev: 672,
    tz: "CST/CDT",
    rwys: 8,
    pax: 83.3,
    terminals: 4,
    rwyLen: "13000 ft",
    hub: "United/American",
    fact: "Has the most runways (8) of any US airport — was the world's busiest for over 30 years",
    desc: "Chicago is America's architectural capital — a city of soaring skyscrapers, deep-dish pizza, and blues clubs that shaped modern music. From the Art Institute's Impressionist galleries to the electric energy of Wrigley Field, the Windy City rewards every visitor.",
  },
  LAX: {
    icao: "KLAX",
    elev: 128,
    tz: "PST/PDT",
    rwys: 4,
    pax: 88.1,
    terminals: 9,
    rwyLen: "12091 ft",
    hub: "Delta/United/American",
    fact: "Gateway to the Pacific — the distinctive Theme Building opened in 1961, a Googie architecture icon",
    desc: "Los Angeles is the entertainment capital of the world — a sun-drenched mosaic of Hollywood glamour, taco trucks, surf culture, and cutting-edge contemporary art. From the Getty Center perched above the city to the vibrant neighborhoods of Koreatown and Silver Lake, LA defies any single narrative.",
  },
  JFK: {
    icao: "KJFK",
    elev: 13,
    tz: "EST/EDT",
    rwys: 4,
    pax: 62.5,
    terminals: 6,
    rwyLen: "14511 ft",
    hub: "Delta/JetBlue",
    fact: "Renamed for President Kennedy in 1963. The iconic TWA Flight Center by Eero Saarinen is now a hotel",
    desc: "New York City is the cultural engine of the Western world — a vertical metropolis of Broadway theaters, world-class museums, and 800 languages spoken across its five boroughs. From the neon canyons of Times Square to the quiet streets of Greenwich Village, the city never sleeps and never stops reinventing itself.",
  },
  SFO: {
    icao: "KSFO",
    elev: 13,
    tz: "PST/PDT",
    rwys: 4,
    pax: 57.5,
    terminals: 4,
    rwyLen: "11870 ft",
    hub: "United",
    fact: "Built on San Francisco Bay landfill — two parallel runways are just 750 ft apart",
    desc: "San Francisco is a city of fog-kissed hills, cable cars, and radical reinvention — from the Gold Rush to the Summer of Love to Silicon Valley. The Golden Gate Bridge, Chinatown's dim sum parlors, and the painted Victorians of Haight-Ashbury define a city that celebrates the unconventional.",
  },
  SEA: {
    icao: "KSEA",
    elev: 433,
    tz: "PST/PDT",
    rwys: 3,
    pax: 50.6,
    terminals: 2,
    rwyLen: "11901 ft",
    hub: "Alaska/Delta",
    fact: "Runs on 100% renewable energy — one of the greenest major airports in the US",
    desc: "Seattle is the rain-soaked jewel of the Pacific Northwest — birthplace of grunge music, home to Pike Place Market's flying fish, and a city where coffee culture was perfected. Mount Rainier looms over a skyline defined by the Space Needle and a booming tech scene.",
  },
  LAS: {
    icao: "KLAS",
    elev: 2181,
    tz: "PST/PDT",
    rwys: 4,
    pax: 57.3,
    terminals: 3,
    rwyLen: "14510 ft",
    hub: "Spirit/Frontier",
    fact: "The only major US airport with slot machines in the terminal — estimated 1,300 machines",
    desc: "Las Vegas is a neon oasis in the Mojave Desert — a city built on spectacle, from the Strip's mega-resorts and world-class shows to the red rock canyons just minutes away. It reinvents itself endlessly, now rivaling any city for fine dining and contemporary art.",
  },
  MCO: {
    icao: "KMCO",
    elev: 96,
    tz: "EST/EDT",
    rwys: 4,
    pax: 58.0,
    terminals: 2,
    rwyLen: "12005 ft",
    hub: "JetBlue/Southwest",
    fact: "Serves Walt Disney World, Universal and SeaWorld — the world's most visited tourist region",
    desc: "Orlando is the theme park capital of the planet — a place where imagination becomes reality across Walt Disney World, Universal, and a constellation of attractions. Beyond the parks, the city's growing food scene and nearby Space Coast add unexpected depth.",
  },
  CLT: {
    icao: "KCLT",
    elev: 748,
    tz: "EST/EDT",
    rwys: 4,
    pax: 53.0,
    terminals: 1,
    rwyLen: "10000 ft",
    hub: "American",
    fact: "American Airlines' largest hub by departures — a connection machine handling 1,500+ daily flights",
    desc: "Charlotte is the banking capital of the American South — a fast-growing city where gleaming uptown towers meet tree-shaded neighborhoods, NASCAR heritage, and a craft beer scene that rivals any in the Southeast. The Blue Ridge Mountains beckon just two hours west.",
  },
  MIA: {
    icao: "KMIA",
    elev: 9,
    tz: "EST/EDT",
    rwys: 4,
    pax: 52.0,
    terminals: 3,
    rwyLen: "13016 ft",
    hub: "American",
    fact: "#1 US international gateway to Latin America, with non-stop service to 100+ countries",
    desc: "Miami is where Latin America meets the United States — a bilingual, sun-soaked metropolis of Art Deco architecture on South Beach, Calle Ocho's Cuban coffee windows, and Wynwood's explosion of street art. The city's nightlife, cuisine, and cultural energy are unmatched.",
  },
  EWR: {
    icao: "KEWR",
    elev: 18,
    tz: "EST/EDT",
    rwys: 3,
    pax: 46.3,
    terminals: 3,
    rwyLen: "11000 ft",
    hub: "United",
    fact: "America's first major commercial airport, opened in 1928 — predates both JFK and LaGuardia",
    desc: "Newark serves as a gateway to both New York City and northern New Jersey — a region of remarkable diversity, from the brownstones of Hoboken to the cultural riches of Manhattan just minutes across the Hudson. The Ironbound district is one of America's great Portuguese and Brazilian food destinations.",
  },
  BOS: {
    icao: "KBOS",
    elev: 19,
    tz: "EST/EDT",
    rwys: 6,
    pax: 42.5,
    terminals: 4,
    rwyLen: "10083 ft",
    hub: "JetBlue/Delta",
    fact: "Named for General Edward Logan. Extension runways literally jut into Boston Harbor",
    desc: "Boston is America's cradle of revolution and intellect — a walkable city of cobblestone streets, Harvard and MIT's ivory towers, and passionate Red Sox fandom. The Freedom Trail winds through 400 years of history, while the waterfront serves some of the finest seafood on the Atlantic.",
  },
  MSP: {
    icao: "KMSP",
    elev: 841,
    tz: "CST/CDT",
    rwys: 4,
    pax: 39.6,
    terminals: 2,
    rwyLen: "11006 ft",
    hub: "Delta/Sun Country",
    fact: "Delta's second-largest hub, designed for Minnesota winters — heated jet bridges throughout",
    desc: "Minneapolis-St. Paul is the Twin Cities of culture and nature — home to the Guthrie Theater, Prince's Paisley Park, and a chain of urban lakes perfect for year-round recreation. The skyway system lets residents navigate brutal winters without ever stepping outside.",
  },
  DTW: {
    icao: "KDTW",
    elev: 645,
    tz: "EST/EDT",
    rwys: 6,
    pax: 36.4,
    terminals: 2,
    rwyLen: "12003 ft",
    hub: "Delta/Spirit",
    fact: "Home to the world's longest airport tram tunnel — the McNamara Terminal's underground walkway",
    desc: "Detroit is a city of resilience and reinvention — the birthplace of Motown Records, the American auto industry, and a creative renaissance transforming its neighborhoods. From the Detroit Institute of Arts' Diego Rivera murals to Eastern Market's weekend bustle, the Motor City roars back to life.",
  },
  IAH: {
    icao: "KIAH",
    elev: 97,
    tz: "CST/CDT",
    rwys: 5,
    pax: 45.3,
    terminals: 5,
    rwyLen: "12001 ft",
    hub: "United",
    fact: "United Airlines' largest international hub — a major gateway for Latin America routes",
    desc: "Houston is Space City — home to NASA's Mission Control, a dazzling museum district, and one of America's most diverse food scenes, from Vietnamese pho in Midtown to Tex-Mex and world-class barbecue. The energy capital of the world pulses with ambition and Southern hospitality.",
  },
  PHX: {
    icao: "KPHX",
    elev: 1135,
    tz: "MST",
    rwys: 3,
    pax: 46.3,
    terminals: 3,
    rwyLen: "11489 ft",
    hub: "American/Southwest",
    fact: "Arizona observes no daylight saving time — PHX is the only US mega-hub in a single timezone year-round",
    desc: "Phoenix blazes in the Sonoran Desert — a sprawling sun-belt city of stunning desert botanical gardens, Frank Lloyd Wright's Taliesin West, and fiery Southwestern cuisine. Camelback Mountain rises from the city's heart, offering dramatic hikes with valley-wide panoramas.",
  },
  IAD: {
    icao: "KIAD",
    elev: 313,
    tz: "EST/EDT",
    rwys: 4,
    pax: 27.6,
    terminals: 1,
    rwyLen: "11501 ft",
    hub: "United",
    fact: "Designed by Eero Saarinen, opened 1962. The mobile lounges were futuristic for their era",
    desc: "Washington, D.C. is the seat of American power and a treasure trove of free Smithsonian museums, marble monuments, and cherry blossoms along the Tidal Basin. The capital's Georgetown townhouses, vibrant U Street corridor, and multicultural dining scene reveal a city far richer than politics alone.",
  },
  PHL: {
    icao: "KPHL",
    elev: 36,
    tz: "EST/EDT",
    rwys: 4,
    pax: 33.4,
    terminals: 7,
    rwyLen: "10506 ft",
    hub: "American",
    fact: "One of the original four American Airlines hubs from the hub-and-spoke era of the 1980s",
    desc: "Philadelphia is where America began — the city of the Liberty Bell, Independence Hall, and a fiercely loyal sports culture. Rocky's steps at the Art Museum, Reading Terminal Market's cheesesteaks, and a thriving mural arts program make Philly one of the East Coast's most underrated destinations.",
  },
  DCA: {
    icao: "KDCA",
    elev: 15,
    tz: "EST/EDT",
    rwys: 3,
    pax: 25.5,
    terminals: 3,
    rwyLen: "6869 ft",
    hub: "American",
    fact: "Subject to the strictest airspace restrictions in the US — the 30 nm SFRA around Washington DC",
    desc: "Reagan National offers the most dramatic approach of any American airport — banking over the Potomac with the Lincoln Memorial, Washington Monument, and Capitol dome in full view. The nation's capital is a city of stately grandeur and surprising neighborhood charm.",
  },
  // ── USA MAJOR ──────────────────────────────────────────────────────────────
  SAN: {
    icao: "KSAN",
    elev: 17,
    tz: "PST/PDT",
    rwys: 1,
    pax: 25.2,
    terminals: 2,
    rwyLen: "9401 ft",
    hub: "Southwest",
    fact: "One of only a few major US airports with a single runway — approaches skim downtown rooftops",
    desc: "San Diego basks in near-perfect weather year-round — a laid-back coastal city of craft breweries, fish tacos, the world-famous Zoo, and miles of golden Pacific beaches.",
  },
  PDX: {
    icao: "KPDX",
    elev: 31,
    tz: "PST/PDT",
    rwys: 3,
    pax: 20.1,
    terminals: 1,
    rwyLen: "11000 ft",
    hub: "Alaska",
    fact: "Famous for its carpet — replaced in 2015, the old pattern became a pop culture icon",
    desc: 'Portland is the fiercely independent city of food carts, independent bookstores, craft coffee, and misty forests — where "Keep Portland Weird" is a way of life.',
  },
  SLC: {
    icao: "KSLC",
    elev: 4227,
    tz: "MST/MDT",
    rwys: 4,
    pax: 27.0,
    terminals: 1,
    rwyLen: "12003 ft",
    hub: "Delta",
    fact: "Delta's western mountain hub at 4,227 ft — brand new terminal opened in 2020",
    desc: "Salt Lake City sits in a dramatic valley between the Wasatch Range and the Great Salt Lake — a gateway to legendary skiing and Utah's five stunning national parks.",
  },
  TPA: {
    icao: "KTPA",
    elev: 26,
    tz: "EST/EDT",
    rwys: 3,
    pax: 23.3,
    terminals: 1,
    rwyLen: "11002 ft",
    hub: "Breeze/Southwest",
    fact: "Known for its automated people mover shuttles between landside and airside since 1971",
    desc: "Tampa Bay blends Florida sunshine with Cuban heritage in historic Ybor City, waterfront dining along the Riverwalk, and easy access to Gulf Coast white-sand beaches.",
  },
  RDU: {
    icao: "KRDU",
    elev: 435,
    tz: "EST/EDT",
    rwys: 3,
    pax: 14.8,
    terminals: 2,
    rwyLen: "10000 ft",
    hub: "Frontier",
    fact: "Named for both Raleigh and Durham — a gateway to the Research Triangle tech corridor",
    desc: "Raleigh-Durham is the intellectual heart of the Carolinas — a region of top universities, craft barbecue, and pine-shaded innovation corridors.",
  },
  BWI: {
    icao: "KBWI",
    elev: 146,
    tz: "EST/EDT",
    rwys: 3,
    pax: 26.5,
    terminals: 1,
    rwyLen: "10502 ft",
    hub: "Southwest",
    fact: "Southwest's largest East Coast operation — named for Thurgood Marshall since 2005",
    desc: "Baltimore is a city of harbor charm and gritty soul — home to the National Aquarium, steamed crabs seasoned with Old Bay, and Edgar Allan Poe's final resting place.",
  },
  MCI: {
    icao: "KMCI",
    elev: 1026,
    tz: "CST/CDT",
    rwys: 3,
    pax: 13.4,
    terminals: 1,
    rwyLen: "10801 ft",
    hub: "Southwest",
    fact: "New single terminal opened 2023, replacing the 1972 drive-to-your-gate design",
    desc: "Kansas City is America's barbecue mecca and jazz crossroads — a city of fountains, boulevards, and the legendary 18th and Vine jazz district.",
  },
  MSY: {
    icao: "KMSY",
    elev: 4,
    tz: "CST/CDT",
    rwys: 2,
    pax: 14.5,
    terminals: 1,
    rwyLen: "10104 ft",
    hub: "Southwest/Spirit",
    fact: "New $1.3B terminal opened 2019, replacing the 1959 original on the same site",
    desc: "New Orleans is pure magic — a city of jazz spilling from Bourbon Street, beignets at Cafe Du Monde, Creole cuisine, and Mardi Gras revelry that celebrates life like nowhere else.",
  },
  AUS: {
    icao: "KAUS",
    elev: 542,
    tz: "CST/CDT",
    rwys: 2,
    pax: 21.7,
    terminals: 1,
    rwyLen: "12250 ft",
    hub: "Southwest",
    fact: "One of the fastest-growing US airports, tripling traffic since 2010 with Austin's tech boom",
    desc: "Austin is the live music capital of the world — a city of SXSW creativity, breakfast tacos, Barton Springs swimming holes, and a tech-fueled energy that keeps it forever young.",
  },
  SMF: {
    icao: "KSMF",
    elev: 27,
    tz: "PST/PDT",
    rwys: 2,
    pax: 14.4,
    terminals: 2,
    rwyLen: "8601 ft",
    hub: "Southwest",
    fact: "Sacramento's gateway — the closest major airport to California's state capital",
    desc: "Sacramento is California's farm-to-fork capital — a tree-lined river city with Gold Rush history, a thriving craft beer scene, and easy access to Napa Valley and Lake Tahoe.",
  },
  SJC: {
    icao: "KSJC",
    elev: 62,
    tz: "PST/PDT",
    rwys: 2,
    pax: 16.0,
    terminals: 2,
    rwyLen: "11000 ft",
    hub: "Southwest/Alaska",
    fact: "Silicon Valley's airport — walking distance from many tech campuses",
    desc: "San Jose is the capital of Silicon Valley — a diverse, sun-warmed city where tech innovation meets a rich Mexican-American heritage and some of the Bay Area's best Vietnamese food.",
  },
  FLL: {
    icao: "KFLL",
    elev: 9,
    tz: "EST/EDT",
    rwys: 2,
    pax: 36.0,
    terminals: 4,
    rwyLen: "9000 ft",
    hub: "JetBlue/Spirit",
    fact: "South Florida's low-cost carrier hub — within 30 miles of both Fort Lauderdale and Miami",
    desc: "Fort Lauderdale is the Venice of America — a city of canals, yacht-lined waterways, and a more relaxed alternative to Miami's glamour, with gorgeous beaches and a thriving arts district.",
  },
  MDW: {
    icao: "KMDW",
    elev: 620,
    tz: "CST/CDT",
    rwys: 5,
    pax: 23.4,
    terminals: 1,
    rwyLen: "6522 ft",
    hub: "Southwest",
    fact: "Southwest Airlines' original home base — the airline was born here in 1971",
    desc: "Chicago's South Side gateway — close to the historic Bridgeport neighborhood, White Sox baseball, and the city's legendary deep-dish pizza joints.",
  },
  HNL: {
    icao: "PHNL",
    elev: 13,
    tz: "HST",
    rwys: 4,
    pax: 21.0,
    terminals: 3,
    rwyLen: "12300 ft",
    hub: "Hawaiian",
    fact: "The only major US airport with an outdoor terminal — reef runway built on a coral reef",
    desc: "Honolulu is paradise found — where Waikiki's surf breaks, Diamond Head's silhouette, Hawaiian plate lunches, and the spirit of aloha welcome travelers to the heart of the Pacific.",
  },
  BNA: {
    icao: "KBNA",
    elev: 599,
    tz: "CST/CDT",
    rwys: 4,
    pax: 22.0,
    terminals: 1,
    rwyLen: "11030 ft",
    hub: "Southwest",
    fact: "Nashville's music city gateway — one of the fastest-growing airports in America",
    desc: "Nashville is Music City USA — where the Grand Ole Opry, honky-tonk bars on Broadway, and hot chicken define a city that lives and breathes country, rock, and Americana.",
  },
  STL: {
    icao: "KSTL",
    elev: 618,
    tz: "CST/CDT",
    rwys: 4,
    pax: 16.5,
    terminals: 2,
    rwyLen: "11019 ft",
    hub: "Southwest",
    fact: "Once TWA's fortress hub — its massive Terminal 2 now serves Southwest exclusively",
    desc: "St. Louis is the Gateway to the West — a city of the iconic Arch, toasted ravioli, world-class craft beer, and a free zoo that ranks among America's finest.",
  },
  OAK: {
    icao: "KOAK",
    elev: 9,
    tz: "PST/PDT",
    rwys: 4,
    pax: 14.1,
    terminals: 2,
    rwyLen: "10520 ft",
    hub: "Southwest/Spirit",
    fact: "The affordable Bay Area alternative — a 25 minute BART ride from downtown San Francisco",
    desc: "Oakland is the East Bay's creative soul — a culturally rich, diverse city of vibrant food scenes, Lake Merritt's urban oasis, and a storied music heritage spanning jazz to hyphy.",
  },
  CLE: {
    icao: "KCLE",
    elev: 791,
    tz: "EST/EDT",
    rwys: 3,
    pax: 10.6,
    terminals: 1,
    rwyLen: "9956 ft",
    hub: "Spirit/Frontier",
    fact: "Former Continental hub — the Rock & Roll Hall of Fame is visible on approach to runway 6L",
    desc: "Cleveland rocks on the shores of Lake Erie — home to the Rock & Roll Hall of Fame, a world-renowned orchestra, and a revitalized dining scene in the Tremont neighborhood.",
  },
  CMH: {
    icao: "KCMH",
    elev: 816,
    tz: "EST/EDT",
    rwys: 3,
    pax: 10.2,
    terminals: 1,
    rwyLen: "10113 ft",
    hub: "Breeze",
    fact: "John Glenn Columbus — named for Ohio's astronaut-senator who orbited Earth in 1962",
    desc: "Columbus is Ohio's dynamic capital — a youthful city driven by Ohio State University, the Short North Arts District, and one of America's most underrated food scenes.",
  },
  RSW: {
    icao: "KRSW",
    elev: 30,
    tz: "EST/EDT",
    rwys: 2,
    pax: 12.3,
    terminals: 1,
    rwyLen: "12000 ft",
    hub: "Southwest",
    fact: "Southwest Florida International — gateway to Sanibel Island and Fort Myers beaches",
    desc: "Fort Myers is Southwest Florida's tropical escape — where shell-strewn Sanibel beaches, the Edison and Ford Winter Estates, and mangrove-lined waterways await.",
  },
  OGG: {
    icao: "PHOG",
    elev: 54,
    tz: "HST",
    rwys: 2,
    pax: 8.4,
    terminals: 1,
    rwyLen: "6995 ft",
    hub: "Hawaiian",
    fact: "Kahului Airport — Maui's gateway, with stunning views of Haleakala volcano on approach",
    desc: "Maui is the Valley Isle — a paradise of the Road to Hana's waterfalls, Haleakala's sunrise above the clouds, and some of Hawaii's finest snorkeling and whale watching.",
  },
  PIT: {
    icao: "KPIT",
    elev: 1204,
    tz: "EST/EDT",
    rwys: 4,
    pax: 10.8,
    terminals: 1,
    rwyLen: "11500 ft",
    hub: "Spirit",
    fact: "Former USAirways mega-hub — its landside terminal now houses offices and a hotel",
    desc: "Pittsburgh is the Steel City reborn — a city of bridges, Andy Warhol's hometown museum, Carnegie's cultural legacy, and a food scene crowned by Primanti Brothers sandwiches.",
  },
  IND: {
    icao: "KIND",
    elev: 797,
    tz: "EST/EDT",
    rwys: 3,
    pax: 10.0,
    terminals: 1,
    rwyLen: "11200 ft",
    hub: "Allegiant",
    fact: "Indianapolis — home to the world's 2nd largest FedEx hub, processing 3M+ packages nightly",
    desc: "Indianapolis is the racing capital of the world — home to the legendary Indy 500, a vibrant cultural trail downtown, and the largest children's museum on the planet.",
  },
  CVG: {
    icao: "KCVG",
    elev: 896,
    tz: "EST/EDT",
    rwys: 4,
    pax: 9.8,
    terminals: 2,
    rwyLen: "12000 ft",
    hub: "DHL/Allegiant",
    fact: "DHL's Americas superhub — once Delta's largest hub, now a major cargo center",
    desc: "Cincinnati straddles the Ohio River with Germanic heritage, legendary chili parlors, and the revitalized Over-the-Rhine neighborhood — one of America's best urban comebacks.",
  },
  JAX: {
    icao: "KJAX",
    elev: 30,
    tz: "EST/EDT",
    rwys: 2,
    pax: 8.0,
    terminals: 1,
    rwyLen: "10000 ft",
    hub: "Breeze",
    fact: "Jacksonville — one of the largest US cities by area, serving Northeast Florida's coastline",
    desc: "Jacksonville sprawls across Northeast Florida where the St. Johns River meets the Atlantic — a city of uncrowded beaches, craft breweries, and Southern coastal charm.",
  },
  ABQ: {
    icao: "KABQ",
    elev: 5355,
    tz: "MST/MDT",
    rwys: 3,
    pax: 6.2,
    terminals: 1,
    rwyLen: "13793 ft",
    hub: "Southwest",
    fact: "Albuquerque Sunport at 5,355 ft — the extra-long runway handles hot-and-high takeoffs",
    desc: "Albuquerque glows with desert light and chile-scented air — a city of hot air balloon festivals, adobe Old Town, and the Sandia Mountains' dramatic pink sunsets.",
  },
  ANC: {
    icao: "PANC",
    elev: 152,
    tz: "AKST/AKDT",
    rwys: 3,
    pax: 5.5,
    terminals: 2,
    rwyLen: "12400 ft",
    hub: "Alaska",
    fact: "Ted Stevens Anchorage — a critical refueling stop for Pacific cargo flights, top 5 US cargo airport",
    desc: "Anchorage is America's last frontier city — where glaciers, moose, and the Northern Lights coexist with urban life, all ringed by the stunning Chugach Mountains.",
  },
  MEM: {
    icao: "KMEM",
    elev: 341,
    tz: "CST/CDT",
    rwys: 4,
    pax: 5.2,
    terminals: 2,
    rwyLen: "11120 ft",
    hub: "FedEx",
    fact: "FedEx's global superhub — processes 4M+ packages per night, busiest cargo airport in the Americas",
    desc: "Memphis is the birthplace of rock 'n' roll and blues — where Beale Street's neon signs glow, Graceland preserves Elvis's legacy, and smoky barbecue rivals any in the South.",
  },
  // ── EUROPE ─────────────────────────────────────────────────────────────────
  LHR: {
    icao: "EGLL",
    elev: 83,
    tz: "GMT/BST",
    rwys: 2,
    pax: 79.2,
    terminals: 4,
    rwyLen: "12799 ft",
    hub: "British Airways",
    fact: "Europe's busiest at 80M+ passengers/year. A 3rd runway debate has lasted over 50 years",
    desc: "London is one of the great cities of human civilization — a tapestry of royal pageantry, West End theater, world-class museums like the British Museum and Tate Modern, and a food scene reborn from curry houses to Michelin-starred kitchens. The Thames weaves through centuries of history and relentless reinvention.",
  },
  CDG: {
    icao: "LFPG",
    elev: 392,
    tz: "CET/CEST",
    rwys: 4,
    pax: 67.4,
    terminals: 3,
    rwyLen: "13829 ft",
    hub: "Air France",
    fact: "Named for Charles de Gaulle, opened 1974. Terminal 1's satellite pods are iconic Brutalist architecture",
    desc: "Paris is the City of Light — where the Eiffel Tower pierces the sky, the Louvre guards the Mona Lisa, and every arrondissement reveals another layer of art, fashion, philosophy, and cuisine. A morning croissant along the Seine remains one of life's great pleasures.",
  },
  FRA: {
    icao: "EDDF",
    elev: 364,
    tz: "CET/CEST",
    rwys: 4,
    pax: 59.4,
    terminals: 2,
    rwyLen: "13123 ft",
    hub: "Lufthansa",
    fact: "Europe's largest cargo hub and a Lufthansa stronghold — its own on-airport train station since 1972",
    desc: "Frankfurt is Europe's financial powerhouse — a city of gleaming skyscrapers along the Main River, Goethe's birthplace, apple wine taverns in Sachsenhausen, and world-class museums lining the Museumsufer. Old and new Germany coexist with remarkable harmony.",
  },
  AMS: {
    icao: "EHAM",
    elev: -11,
    tz: "CET/CEST",
    rwys: 6,
    pax: 61.7,
    terminals: 1,
    rwyLen: "12467 ft",
    hub: "KLM",
    fact: "At -11 ft — one of the world's lowest airports, built on reclaimed Dutch polder land",
    desc: "Amsterdam is a city of canals, Rembrandt, and radical tolerance — where Golden Age merchant houses line the Grachtengordel, the Van Gogh Museum dazzles, and cyclists outnumber cars. The city's cozy brown cafes and vibrant Jordaan neighborhood enchant every visitor.",
  },
  MAD: {
    icao: "LEMD",
    elev: 2001,
    tz: "CET/CEST",
    rwys: 4,
    pax: 60.1,
    terminals: 4,
    rwyLen: "13451 ft",
    hub: "Iberia",
    fact: "Highest capital-city airport in Europe at 2,001 ft. Terminal 4 by Richard Rogers spans 760,000 m²",
    desc: "Madrid is Spain's passionate heart — a city that lives late into the night, from the Prado's Velazquez masterpieces to tapas-hopping through La Latina's medieval lanes. The Retiro Park's crystal palace and the electric energy of Gran Via make the capital irresistible.",
  },
  FCO: {
    icao: "LIRF",
    elev: 14,
    tz: "CET/CEST",
    rwys: 3,
    pax: 40.4,
    terminals: 3,
    rwyLen: "12795 ft",
    hub: "ITA Airways",
    fact: "Leonardo da Vinci International — Italy's busiest and gateway to ancient Rome",
    desc: "Rome is the Eternal City — where the Colosseum, Vatican, and Pantheon anchor 2,800 years of Western civilization, and every cobblestoned piazza rewards with gelato, espresso, and la dolce vita. Trastevere's winding streets and rooftop terraces at sunset are unforgettable.",
  },
  BCN: {
    icao: "LEBL",
    elev: 12,
    tz: "CET/CEST",
    rwys: 3,
    pax: 52.7,
    terminals: 2,
    rwyLen: "10499 ft",
    hub: "Vueling",
    fact: "One runway extends over the Mediterranean Sea — the beach is just 500m from the terminal",
    desc: "Barcelona is Gaudi's masterpiece city — where the Sagrada Familia soars heavenward, Las Ramblas buzzes with life, and Mediterranean beaches meet Gothic Quarter alleyways. Catalan cuisine, from pintxos to paella, is among the finest on the continent.",
  },
  MUC: {
    icao: "EDDM",
    elev: 1487,
    tz: "CET/CEST",
    rwys: 2,
    pax: 47.9,
    terminals: 2,
    rwyLen: "13123 ft",
    hub: "Lufthansa",
    fact: "Consistently rated Europe's best airport — opened in 1992 replacing Riem after 60 years",
    desc: "Munich is Bavaria's grand capital — a city of Oktoberfest beer gardens, BMW's gleaming headquarters, Marienplatz's Glockenspiel, and the Alps shimmering on the southern horizon. The Englischer Garten is one of the world's largest urban parks, complete with riverside surfers.",
  },
  ZRH: {
    icao: "LSZH",
    elev: 1416,
    tz: "CET/CEST",
    rwys: 3,
    pax: 31.5,
    terminals: 3,
    rwyLen: "12139 ft",
    hub: "Swiss",
    fact: "Swiss precision — one of Europe's most punctual airports, pioneering airside transit zones",
    desc: "Zurich is Switzerland's cultural and financial capital — a pristine lakeside city of old-town cobblestones, world-class chocolate shops, and Alpine vistas that begin right at the city limits. The Bahnhofstrasse is one of Europe's most elegant shopping boulevards.",
  },
  VIE: {
    icao: "LOWW",
    elev: 600,
    tz: "CET/CEST",
    rwys: 3,
    pax: 31.7,
    terminals: 3,
    rwyLen: "11811 ft",
    hub: "Austrian",
    fact: "Eastern gateway to Western Europe — Austrian Airlines hub connecting Central and Eastern Europe",
    desc: "Vienna is the city of Mozart, Klimt, and Freud — an imperial capital where ornate coffee houses, the Vienna State Opera, and Schonbrunn Palace transport visitors to an era of Hapsburg grandeur. The Naschmarkt's stalls and Heuriger wine taverns add warmth to the city's elegance.",
  },
  IST: {
    icao: "LTFM",
    elev: 325,
    tz: "TRT",
    rwys: 5,
    pax: 76.1,
    terminals: 1,
    rwyLen: "13451 ft",
    hub: "Turkish Airlines",
    fact: "Istanbul Airport opened 2019 with planned ultimate capacity of 200 million passengers per year",
    desc: "Istanbul is where East meets West — a city of minarets and bazaars straddling the Bosphorus, where the Hagia Sophia's dome has witnessed empires rise and fall. The Grand Bazaar's labyrinthine corridors, sizzling kebab stalls, and call to prayer echoing across the Golden Horn create an atmosphere found nowhere else on Earth.",
  },
  DME: {
    icao: "UUDD",
    elev: 588,
    tz: "MSK",
    rwys: 3,
    pax: 22.0,
    terminals: 2,
    rwyLen: "11484 ft",
    hub: "S7 Airlines",
    fact: "Russia's largest airport by passenger traffic, named Domodedovo after the surrounding district",
    desc: "Moscow is Russia's grand capital — a city of the Kremlin's red walls, St. Basil's psychedelic domes, and the Bolshoi Ballet's legendary stage. The Moscow Metro doubles as an underground palace of chandeliers and marble, and the city's literary and artistic heritage is staggering.",
  },
  SVO: {
    icao: "UUEE",
    elev: 630,
    tz: "MSK",
    rwys: 3,
    pax: 18.0,
    terminals: 4,
    rwyLen: "12139 ft",
    hub: "Aeroflot",
    fact: "Sheremetyevo, formally named after Alexander Pushkin in 2019 — Aeroflot's primary hub",
    desc: "Moscow's northern gateway opens onto a city of Tsarist splendor and Soviet monumentalism — where the Tretyakov Gallery's icons, Gorky Park's promenades, and late-night borscht in candlelit restaurants reveal Russia's deep cultural soul.",
  },
  ORY: {
    icao: "LFPO",
    elev: 292,
    tz: "CET/CEST",
    rwys: 3,
    pax: 33.1,
    terminals: 4,
    rwyLen: "11975 ft",
    hub: "Transavia",
    fact: "Paris Orly — originally the city's main airport before CDG opened in 1974",
    desc: "Paris's southern gateway is closer to the city's Left Bank charms — Montparnasse's literary cafes, the Luxembourg Gardens, and the bohemian spirit that inspired generations of artists.",
  },
  MXP: {
    icao: "LIMC",
    elev: 768,
    tz: "CET/CEST",
    rwys: 2,
    pax: 28.8,
    terminals: 2,
    rwyLen: "12861 ft",
    hub: "Ryanair/EasyJet",
    fact: "Milan Malpensa — northern Italy's intercontinental gateway, 50 km from the city center",
    desc: "Milan is Italy's capital of fashion and design — home to Leonardo's Last Supper, the Duomo's Gothic spires, and the Quadrilatero della Moda where haute couture meets aperitivo culture.",
  },
  LGW: {
    icao: "EGKK",
    elev: 202,
    tz: "GMT/BST",
    rwys: 2,
    pax: 32.8,
    terminals: 2,
    rwyLen: "10364 ft",
    hub: "EasyJet",
    fact: "London Gatwick — the world's busiest single-runway operation (the northern runway is standby only)",
    desc: "London's southern gateway sits in the Sussex countryside — offering quick access to the capital's theatres, pubs, and palaces, plus the rolling green hills of the English South Downs.",
  },
  ARN: {
    icao: "ESSA",
    elev: 137,
    tz: "CET/CEST",
    rwys: 3,
    pax: 26.8,
    terminals: 4,
    rwyLen: "10830 ft",
    hub: "SAS",
    fact: 'Stockholm Arlanda — named from a combination of "Ärna" (the old air base) and "landa" (to land)',
    desc: "Stockholm is Scandinavia's most beautiful capital — a city spread across 14 islands where Viking history meets cutting-edge Nordic design, and ABBA's legacy lives on.",
  },
  CPH: {
    icao: "EKCH",
    elev: 17,
    tz: "CET/CEST",
    rwys: 3,
    pax: 30.3,
    terminals: 3,
    rwyLen: "11811 ft",
    hub: "SAS",
    fact: "Copenhagen Kastrup — the busiest airport in the Nordics, a 12-minute metro ride to city center",
    desc: "Copenhagen is the birthplace of hygge — a city of colorful Nyhavn canal houses, Tivoli Gardens' fairy-tale charm, and the world's most celebrated New Nordic cuisine.",
  },
  HEL: {
    icao: "EFHK",
    elev: 179,
    tz: "EET/EEST",
    rwys: 3,
    pax: 18.0,
    terminals: 2,
    rwyLen: "11286 ft",
    hub: "Finnair",
    fact: "Helsinki-Vantaa — Finnair's hub for the fastest Europe-to-Asia routing via the Arctic",
    desc: "Helsinki is a city of sauna culture, minimalist design, and Baltic light — where Finnish innovation meets Art Nouveau architecture and the sea is never far away.",
  },
  OSL: {
    icao: "ENGM",
    elev: 681,
    tz: "CET/CEST",
    rwys: 2,
    pax: 28.6,
    terminals: 1,
    rwyLen: "11811 ft",
    hub: "SAS/Norwegian",
    fact: "Oslo Gardermoen — one of Europe's newest major airports, opened 1998 with a stunning timber terminal",
    desc: "Oslo sits at the head of a glittering fjord — a city of Edvard Munch's Scream, the Viking Ship Museum, and world-leading sustainability wrapped in stunning Nordic nature.",
  },
  DUB: {
    icao: "EIDW",
    elev: 242,
    tz: "GMT/IST",
    rwys: 2,
    pax: 32.9,
    terminals: 2,
    rwyLen: "8652 ft",
    hub: "Ryanair/Aer Lingus",
    fact: "Dublin — one of few European airports offering US Customs preclearance before departure",
    desc: "Dublin is a city of literary giants and legendary pubs — where Joyce, Wilde, and Yeats walked the Georgian streets, and a pint of Guinness at the source tastes like nowhere else.",
  },
  LIS: {
    icao: "LPPT",
    elev: 374,
    tz: "WET/WEST",
    rwys: 2,
    pax: 31.2,
    terminals: 2,
    rwyLen: "12484 ft",
    hub: "TAP Portugal",
    fact: "Lisbon Humberto Delgado — Europe's westernmost major airport, gateway to the Azores and Africa",
    desc: "Lisbon is Europe's sunniest capital — a city of pastel-tiled facades, melancholic fado music, custard tarts from Belem, and trams rattling through the Alfama's ancient lanes.",
  },
  BRU: {
    icao: "EBBR",
    elev: 184,
    tz: "CET/CEST",
    rwys: 3,
    pax: 22.2,
    terminals: 1,
    rwyLen: "11936 ft",
    hub: "Brussels Airlines",
    fact: "Brussels Zaventem — headquarters of the European Union is just 12 km from the airport",
    desc: "Brussels is the capital of Europe and of fine chocolate — a city of Grand Place's gilded guildhalls, Art Nouveau treasures, Magritte's surrealism, and world-class moules-frites.",
  },
  PRG: {
    icao: "LKPR",
    elev: 1247,
    tz: "CET/CEST",
    rwys: 2,
    pax: 17.8,
    terminals: 2,
    rwyLen: "12191 ft",
    hub: "Smartwings/Czech Airlines",
    fact: "Prague Václav Havel — named for the first Czech president, nestled in rolling Bohemian countryside",
    desc: "Prague is the City of a Hundred Spires — a fairy-tale capital of Gothic and Baroque architecture, Charles Bridge at dawn, and some of the world's finest beer at unbeatable prices.",
  },
  BUD: {
    icao: "LHBP",
    elev: 495,
    tz: "CET/CEST",
    rwys: 2,
    pax: 16.2,
    terminals: 2,
    rwyLen: "12162 ft",
    hub: "Wizz Air",
    fact: "Budapest Liszt Ferenc — Wizz Air's original base, and the largest in Central Europe's LCC market",
    desc: "Budapest is the Pearl of the Danube — a city of grand thermal baths, ruin bars in the Jewish Quarter, and a stunning Parliament building illuminated along the riverbank at night.",
  },
  WAW: {
    icao: "EPWA",
    elev: 362,
    tz: "CET/CEST",
    rwys: 2,
    pax: 18.9,
    terminals: 1,
    rwyLen: "11483 ft",
    hub: "LOT Polish",
    fact: "Warsaw Chopin — LOT Polish Airlines has operated from here since 1934, Poland's busiest",
    desc: "Warsaw is a city reborn from the ashes of war — its meticulously reconstructed Old Town, thriving arts scene, and innovative food culture showcase Poland's remarkable resilience.",
  },
  ATH: {
    icao: "LGAV",
    elev: 308,
    tz: "EET/EEST",
    rwys: 2,
    pax: 28.3,
    terminals: 2,
    rwyLen: "13123 ft",
    hub: "Aegean Airlines",
    fact: "Athens Eleftherios Venizelos — opened 2001, replacing the legendary Hellinikon on the coast",
    desc: "Athens is the cradle of Western civilization — where the Parthenon crowns the Acropolis, tavernas serve ouzo and grilled octopus, and 3,000 years of history live in every stone.",
  },
  LED: {
    icao: "ULLI",
    elev: 78,
    tz: "MSK",
    rwys: 2,
    pax: 19.6,
    terminals: 2,
    rwyLen: "11483 ft",
    hub: "Rossiya Airlines",
    fact: "St. Petersburg Pulkovo — gateway to Russia's cultural capital and the Hermitage Museum",
    desc: "St. Petersburg is Russia's imperial jewel — a city of white nights, the Hermitage's three million artworks, Baroque palaces, and ballet at the Mariinsky Theatre.",
  },
  EDI: {
    icao: "EGPH",
    elev: 135,
    tz: "GMT/BST",
    rwys: 1,
    pax: 14.7,
    terminals: 1,
    rwyLen: "8399 ft",
    hub: "Ryanair/EasyJet",
    fact: "Edinburgh — Scotland's busiest airport, with Edinburgh Castle visible from the apron",
    desc: "Edinburgh is a city of dramatic volcanic crags and literary heritage — where the Royal Mile descends from the castle, whisky flows freely, and the Fringe Festival takes over every August.",
  },
  GVA: {
    icao: "LSGG",
    elev: 1411,
    tz: "CET/CEST",
    rwys: 1,
    pax: 17.9,
    terminals: 1,
    rwyLen: "12795 ft",
    hub: "EasyJet/Swiss",
    fact: "Geneva — uniquely has a French-side entrance accessible without passing Swiss immigration",
    desc: "Geneva is the world's diplomatic capital — a pristine lakeside city framed by Mont Blanc, home to the United Nations, CERN, and exquisite Swiss watchmaking heritage.",
  },
  AGP: {
    icao: "LEMG",
    elev: 53,
    tz: "CET/CEST",
    rwys: 2,
    pax: 22.0,
    terminals: 3,
    rwyLen: "10499 ft",
    hub: "Ryanair",
    fact: "Málaga Costa del Sol — southern Spain's beach gateway, busiest non-capital airport in Spain",
    desc: "Malaga is Picasso's birthplace and the Costa del Sol's cultural heart — a city of Moorish fortresses, buzzing tapas bars, and year-round Mediterranean sunshine.",
  },
  PMI: {
    icao: "LEPA",
    elev: 27,
    tz: "CET/CEST",
    rwys: 2,
    pax: 31.1,
    terminals: 1,
    rwyLen: "10728 ft",
    hub: "Ryanair/EasyJet",
    fact: "Palma de Mallorca — Europe's busiest seasonal airport, handling 35M+ in summer peak",
    desc: "Palma de Mallorca is the Balearic gem — a Mediterranean island city of Gothic cathedrals, turquoise coves, and almond-blossom countryside beloved by European sun-seekers.",
  },
  // ── MIDDLE EAST ────────────────────────────────────────────────────────────
  DXB: {
    icao: "OMDB",
    elev: 62,
    tz: "GST+4",
    rwys: 2,
    pax: 87.0,
    terminals: 3,
    rwyLen: "13124 ft",
    hub: "Emirates/flydubai",
    fact: "World's busiest international airport. Terminal 3 alone is one of the largest buildings on Earth",
    desc: "Dubai is a city of superlatives rising from the desert — the world's tallest tower in the Burj Khalifa, gold-draped souks, ultra-luxury shopping, and a multicultural energy where over 200 nationalities coexist. From desert dune-bashing to Michelin-starred dining on the 122nd floor, Dubai redefines ambition.",
  },
  DOH: {
    icao: "OTHH",
    elev: 13,
    tz: "AST+3",
    rwys: 2,
    pax: 46.3,
    terminals: 1,
    rwyLen: "15912 ft",
    hub: "Qatar Airways",
    fact: "Hamad International opened 2014, with a 23m bronze teddy bear sculpture in the concourse",
    desc: "Doha is Qatar's futuristic pearl — a city of the Museum of Islamic Art's striking I.M. Pei silhouette, the Souq Waqif's spice-scented alleyways, and a cultural ambition that hosted the 2022 FIFA World Cup. The desert meets the Persian Gulf in a skyline that seems to grow overnight.",
  },
  AUH: {
    icao: "OMAA",
    elev: 88,
    tz: "GST+4",
    rwys: 2,
    pax: 24.3,
    terminals: 3,
    rwyLen: "13451 ft",
    hub: "Etihad",
    fact: "Etihad's home — the Sheikh Zayed Grand Mosque is visible on approach to runway 31L",
    desc: "Abu Dhabi is the UAE's cultured capital — home to the stunning Louvre Abu Dhabi floating on the sea, the Sheikh Zayed Grand Mosque's white marble magnificence, and Yas Island's Formula 1 circuit. The city balances Bedouin heritage with a vision of the future.",
  },
  RUH: {
    icao: "OERK",
    elev: 2049,
    tz: "AST+3",
    rwys: 4,
    pax: 29.5,
    terminals: 5,
    rwyLen: "13780 ft",
    hub: "Saudia/flynas",
    fact: "King Khalid — expanding under Vision 2030. New Riyadh airport will be one of world's largest",
    desc: "Riyadh is Saudi Arabia's rapidly transforming capital — a desert metropolis where ancient Najdi architecture in the Diriyah district meets the ambitions of Vision 2030, and the Edge of the World escarpment offers one of the Middle East's most dramatic landscapes.",
  },
  JED: {
    icao: "OEJN",
    elev: 48,
    tz: "AST+3",
    rwys: 2,
    pax: 40.2,
    terminals: 2,
    rwyLen: "12467 ft",
    hub: "Saudia/flynas",
    fact: "King Abdulaziz — gateway for Hajj pilgrims, handling 2M+ pilgrims annually",
    desc: "Jeddah is the gateway to Mecca and the Red Sea's cosmopolitan port city — where the historic Al-Balad district's coral-stone houses, vibrant Corniche waterfront, and rich Hejazi cuisine reflect centuries as Arabia's crossroads of trade and pilgrimage.",
  },
  MCT: {
    icao: "OOMS",
    elev: 48,
    tz: "GST+4",
    rwys: 1,
    pax: 14.5,
    terminals: 1,
    rwyLen: "13123 ft",
    hub: "Oman Air",
    fact: "Muscat — opened a stunning new terminal in 2018, designed to resemble a Bedouin tent",
    desc: "Muscat is the Gulf's most understated gem — a city of frankincense-scented souks, the Sultan Qaboos Grand Mosque, and dramatic wadis carved into the Hajar Mountains.",
  },
  AMM: {
    icao: "OJAI",
    elev: 2395,
    tz: "EET+2",
    rwys: 2,
    pax: 9.2,
    terminals: 2,
    rwyLen: "12008 ft",
    hub: "Royal Jordanian",
    fact: "Queen Alia — gateway to Petra, the Dead Sea, and Wadi Rum, at 2,395 ft above sea level",
    desc: "Amman is a city of ancient hills and warm hospitality — gateway to Petra's rose-red facades, the Dead Sea's mineral waters, and Wadi Rum's Martian landscapes.",
  },
  BAH: {
    icao: "OBBI",
    elev: 6,
    tz: "AST+3",
    rwys: 1,
    pax: 11.0,
    terminals: 1,
    rwyLen: "12927 ft",
    hub: "Gulf Air",
    fact: "Bahrain — one of the oldest airports in the Gulf, built on an island in the Persian Gulf",
    desc: "Bahrain is the Gulf's island kingdom — a pearl-diving heritage, ancient Dilmun civilization ruins, and a Formula 1 circuit surrounded by warm Persian Gulf waters.",
  },
  KWI: {
    icao: "OKBK",
    elev: 206,
    tz: "AST+3",
    rwys: 2,
    pax: 15.5,
    terminals: 2,
    rwyLen: "11155 ft",
    hub: "Kuwait Airways",
    fact: "Kuwait — its new terminal by Foster+Partners features a 1.2 km roof inspired by a sail",
    desc: "Kuwait City blends oil-era prosperity with Gulf trading heritage — the Kuwait Towers' iconic silhouette and the Grand Mosque anchor a city rebuilding its cultural identity.",
  },
  TLV: {
    icao: "LLBG",
    elev: 135,
    tz: "IST+2",
    rwys: 3,
    pax: 25.0,
    terminals: 3,
    rwyLen: "11998 ft",
    hub: "El Al",
    fact: "Ben Gurion — considered one of the world's most secure airports with multi-layer security",
    desc: "Tel Aviv is the Mediterranean's most vibrant startup city — a Bauhaus White City of beach culture, world-class nightlife, Carmel Market's flavors, and creative energy that never sleeps.",
  },
  // ── ASIA ───────────────────────────────────────────────────────────────────
  SIN: {
    icao: "WSSS",
    elev: 22,
    tz: "SGT+8",
    rwys: 3,
    pax: 62.6,
    terminals: 4,
    rwyLen: "13123 ft",
    hub: "Singapore Airlines",
    fact: "Changi — voted world's best airport 12+ years running. Jewel Changi has a 40m indoor waterfall",
    desc: "Singapore is a tropical city-state of astonishing order and diversity — where hawker centers serve the world's cheapest Michelin-starred meals, Gardens by the Bay's supertrees glow at night, and Little India, Chinatown, and Arab Street coexist in seamless multicultural harmony.",
  },
  PEK: {
    icao: "ZBAA",
    elev: 116,
    tz: "CST+8",
    rwys: 3,
    pax: 62.0,
    terminals: 3,
    rwyLen: "12467 ft",
    hub: "Air China",
    fact: "Beijing Capital — one of the world's top 3 busiest. Terminal 3 is the world's 2nd largest building",
    desc: "Beijing is the seat of Chinese civilization — where the Forbidden City's imperial grandeur, the Great Wall's mountain-spanning majesty, and hutong alleyways' intimate charm reveal millennia of history. Peking duck in its birthplace remains one of the world's great culinary experiences.",
  },
  PVG: {
    icao: "ZSPD",
    elev: 13,
    tz: "CST+8",
    rwys: 4,
    pax: 50.1,
    terminals: 2,
    rwyLen: "12467 ft",
    hub: "China Eastern",
    fact: "Shanghai Pudong — China's largest cargo airport, opened 1999 on reclaimed Yangtze delta land",
    desc: "Shanghai is China's dazzling metropolis of commerce and style — where the Bund's Art Deco facades face Pudong's futuristic skyline across the Huangpu River, and the city's xiao long bao soup dumplings are a pilgrimage-worthy culinary art form. French Concession tree-lined lanes and rooftop cocktail bars capture the city's dual personality.",
  },
  HND: {
    icao: "RJTT",
    elev: 35,
    tz: "JST+9",
    rwys: 4,
    pax: 87.1,
    terminals: 3,
    rwyLen: "9843 ft",
    hub: "ANA/JAL",
    fact: "Tokyo Haneda — consistently the world's most punctual major airport, rebuilt after WWII",
    desc: "Tokyo is a city of mesmerizing contrasts — ancient Meiji Shrine tranquility steps from Shibuya's neon-lit scramble crossing, Tsukiji's sushi masters beside Akihabara's electric wonderland. The world's most Michelin-starred city rewards endlessly with precision, politeness, and creative genius.",
  },
  NRT: {
    icao: "RJAA",
    elev: 141,
    tz: "JST+9",
    rwys: 2,
    pax: 35.7,
    terminals: 3,
    rwyLen: "13123 ft",
    hub: "ANA/JAL",
    fact: "Narita opened 1978 amid massive protests — the only Japanese airport with a curfew (23:00-06:00)",
    desc: "Tokyo's international gateway sits in Chiba's countryside — a launching point for the sensory overload of the world's largest metropolitan area, where tradition and hyper-modernity coexist in perfect harmony. Naritasan Shinshoji temple nearby offers a serene prelude to the capital.",
  },
  ICN: {
    icao: "RKSI",
    elev: 23,
    tz: "KST+9",
    rwys: 4,
    pax: 71.2,
    terminals: 2,
    rwyLen: "12300 ft",
    hub: "Korean Air/Asiana",
    fact: "Seoul Incheon — built on reclaimed sea between two islands, rated world's best airport repeatedly",
    desc: "Seoul is the K-culture capital of the world — a city of Joseon dynasty palaces, sizzling Korean BBQ, K-pop energy, and cutting-edge design in Gangnam and Hongdae. The city's 600-year-old Bukchon hanok village and neon-drenched Myeongdong exist side by side in electrifying contrast.",
  },
  BKK: {
    icao: "VTBS",
    elev: 5,
    tz: "ICT+7",
    rwys: 2,
    pax: 60.9,
    terminals: 1,
    rwyLen: "13123 ft",
    hub: "Thai Airways",
    fact: 'Suvarnabhumi — "Golden Land" in Sanskrit. The terminal roof spans 563,000 m²',
    desc: "Bangkok is a sensory feast — a city of gilded temple spires, floating markets, fiery street food served from sizzling woks, and a nightlife scene that pulses until dawn. The Grand Palace's dazzling Wat Phra Kaew and the Chao Phraya River's longboat traffic are quintessential Southeast Asia.",
  },
  HKG: {
    icao: "VHHH",
    elev: 28,
    tz: "HKT+8",
    rwys: 2,
    pax: 39.8,
    terminals: 2,
    rwyLen: "12467 ft",
    hub: "Cathay Pacific",
    fact: "Built on reclaimed Lantau Island land — the old Kai Tak runway 13 approach was legendary",
    desc: "Hong Kong is a vertical city of breathtaking contrasts — where bamboo-scaffolded skyscrapers tower above incense-filled temples, dim sum is an art form, and Victoria Peak offers one of the world's most iconic skyline views. The Star Ferry crossing remains one of travel's great bargains.",
  },
  KUL: {
    icao: "WMKK",
    elev: 69,
    tz: "MYT+8",
    rwys: 2,
    pax: 48.0,
    terminals: 2,
    rwyLen: "13402 ft",
    hub: "AirAsia/Malaysia",
    fact: 'KLIA — designed by Kisho Kurokawa with the "forest terminal" concept, connected by high-speed rail',
    desc: "Kuala Lumpur is a tropical melting pot — where the Petronas Twin Towers pierce the skyline, Batu Caves' Hindu shrines glow in jungle mist, and hawker stalls serve some of Asia's most diverse and delicious street food. Malay, Chinese, and Indian cultures blend into something uniquely Malaysian.",
  },
  DEL: {
    icao: "VIDP",
    elev: 777,
    tz: "IST+5:30",
    rwys: 3,
    pax: 72.3,
    terminals: 3,
    rwyLen: "14534 ft",
    hub: "IndiGo/Air India",
    fact: "Indira Gandhi International — India's busiest, handling 72M+ passengers at South Asia's largest hub",
    desc: "Delhi is a city layered with empires — from the Mughal majesty of the Red Fort and Jama Masjid to the colonial grandeur of Lutyens' boulevards and the chaotic splendor of Old Delhi's spice markets. The street food alone, from chaat to paranthas, is worth the journey.",
  },
  BOM: {
    icao: "VABB",
    elev: 37,
    tz: "IST+5:30",
    rwys: 2,
    pax: 51.8,
    terminals: 2,
    rwyLen: "12008 ft",
    hub: "IndiGo/Air India",
    fact: "Chhatrapati Shivaji Maharaj — sits between the Arabian Sea and the city, land is ultra-scarce",
    desc: "Mumbai is India's city of dreams — the financial capital where Bollywood glamour coexists with the Gateway of India's colonial grandeur, Crawford Market's sensory overload, and the dabbawala lunch delivery system's legendary precision. The Marine Drive seafront at sunset is pure magic.",
  },
  CAN: {
    icao: "ZGGG",
    elev: 46,
    tz: "CST+8",
    rwys: 3,
    pax: 63.4,
    terminals: 2,
    rwyLen: "12467 ft",
    hub: "China Southern",
    fact: "Guangzhou Baiyun — China Southern's mega-hub, one of the world's fastest-growing airports",
    desc: "Guangzhou is southern China's culinary capital — a city where Cantonese dim sum was perfected, the Pearl River glows with neon at night, and centuries of maritime trade have made it one of Asia's most cosmopolitan centers. The city's morning tea tradition is a cultural institution.",
  },
  CTU: {
    icao: "ZUUU",
    elev: 1624,
    tz: "CST+8",
    rwys: 3,
    pax: 53.0,
    terminals: 2,
    rwyLen: "11811 ft",
    hub: "Air China/Sichuan",
    fact: "Chengdu Shuangliu — in the Sichuan basin, with Chengdu Tianfu (TFU) as its newer partner",
    desc: "Chengdu is China's most laid-back megacity — home to giant pandas at the Research Base, face-numbing Sichuan hotpot, ancient tea houses, and a nightlife scene that rivals Shanghai's. The city's mahjong culture and misty bamboo-forested surroundings define a uniquely relaxed urbanism.",
  },
  SZX: {
    icao: "ZGSZ",
    elev: 13,
    tz: "CST+8",
    rwys: 2,
    pax: 52.9,
    terminals: 2,
    rwyLen: "11155 ft",
    hub: "Shenzhen Airlines",
    fact: "Shenzhen Bao'an — its futuristic terminal resembles a manta ray, designed by Studio Fuksas",
    desc: "Shenzhen is China's Silicon Valley miracle — a fishing village turned megacity in just 40 years, now a global tech hub of Huawei and Tencent headquarters, futuristic architecture, and a youthful energy that defines 21st-century China.",
  },
  CGK: {
    icao: "WIII",
    elev: 34,
    tz: "WIB+7",
    rwys: 3,
    pax: 54.2,
    terminals: 3,
    rwyLen: "12008 ft",
    hub: "Garuda/Lion Air",
    fact: "Jakarta Soekarno-Hatta — serves the world's 4th most populous country, Indonesia's primary gateway",
    desc: "Jakarta is Southeast Asia's largest city — a sprawling, vibrant capital of 30 million where Javanese traditions meet modern ambition, street food sizzles at every corner, and the National Monument rises above a city that never stops moving.",
  },
  MNL: {
    icao: "RPLL",
    elev: 75,
    tz: "PHT+8",
    rwys: 2,
    pax: 49.8,
    terminals: 4,
    rwyLen: "11004 ft",
    hub: "Philippine Airlines/Cebu",
    fact: "Ninoy Aquino — famously congested, this airport serves Metro Manila's 13 million residents",
    desc: "Manila is a city of irrepressible Filipino spirit — where Spanish colonial Intramuros, vibrant jeepney culture, and some of Asia's most exuberant nightlife create a metropolis that overwhelms and rewards in equal measure. The warmth of Filipino hospitality is legendary.",
  },
  TPE: {
    icao: "RCTP",
    elev: 106,
    tz: "CST+8",
    rwys: 2,
    pax: 48.6,
    terminals: 2,
    rwyLen: "12008 ft",
    hub: "EVA Air/China Airlines",
    fact: "Taiwan Taoyuan — known for exceptional transit facilities and award-winning airline lounges",
    desc: "Taipei is one of Asia's most underrated capitals — a city of steaming night market stalls, Taipei 101's bamboo-inspired tower, serene Buddhist temples, and some of the world's finest Chinese cuisine. The hot springs of Beitou and misty mountain tea houses add layers of tranquility.",
  },
  CCU: {
    icao: "VECC",
    elev: 16,
    tz: "IST+5:30",
    rwys: 2,
    pax: 23.5,
    terminals: 2,
    rwyLen: "11900 ft",
    hub: "IndiGo",
    fact: "Netaji Subhas Chandra Bose — Kolkata's gateway, serving eastern India and the Bay of Bengal",
    desc: "Kolkata is India's intellectual and artistic soul — the city of Rabindranath Tagore, Mother Teresa's mission, Durga Puja festivals, and the sweetest rasgullas in the subcontinent.",
  },
  KHI: {
    icao: "OPKC",
    elev: 100,
    tz: "PKT+5",
    rwys: 2,
    pax: 12.0,
    terminals: 3,
    rwyLen: "10500 ft",
    hub: "PIA",
    fact: "Jinnah International — Pakistan's busiest airport, named for the nation's founder",
    desc: "Karachi is Pakistan's sprawling port metropolis — a city of Mughal-era mausoleums, vibrant Sindhi street food, and the Arabian Sea's crashing waves along Clifton Beach.",
  },
  SGN: {
    icao: "VVTS",
    elev: 33,
    tz: "ICT+7",
    rwys: 2,
    pax: 41.2,
    terminals: 2,
    rwyLen: "12468 ft",
    hub: "Vietnam Airlines/VietJet",
    fact: "Ho Chi Minh City Tan Son Nhat — one of the world's 50 busiest, surrounded entirely by urban sprawl",
    desc: "Ho Chi Minh City is Vietnam's electric southern dynamo — a city of motorbike rivers, French colonial architecture, steaming bowls of pho, and the Cu Chi Tunnels' haunting war history.",
  },
  HAN: {
    icao: "VVNB",
    elev: 39,
    tz: "ICT+7",
    rwys: 2,
    pax: 28.9,
    terminals: 2,
    rwyLen: "11811 ft",
    hub: "Vietnam Airlines/Bamboo",
    fact: "Hanoi Noi Bai — Vietnam's capital gateway, 35 km north of the ancient Old Quarter",
    desc: "Hanoi is Vietnam's ancient heart — a city of thousand-year-old temples, fragrant street-side pho stands, the serene Hoan Kiem Lake, and the Old Quarter's labyrinthine charm.",
  },
  BLR: {
    icao: "VOBL",
    elev: 3000,
    tz: "IST+5:30",
    rwys: 2,
    pax: 37.6,
    terminals: 2,
    rwyLen: "13120 ft",
    hub: "IndiGo/Air India",
    fact: "Kempegowda International — India's tech capital airport at 3,000 ft, opened 2008",
    desc: "Bangalore is India's Garden City and tech hub — where colonial-era parks, craft beer breweries, and a thriving startup culture coexist with ancient temple heritage.",
  },
  MAA: {
    icao: "VOMM",
    elev: 52,
    tz: "IST+5:30",
    rwys: 2,
    pax: 22.5,
    terminals: 2,
    rwyLen: "12001 ft",
    hub: "IndiGo/SpiceJet",
    fact: "Chennai — gateway to South India and the Bay of Bengal, India's 4th busiest airport",
    desc: "Chennai is the cultural capital of South India — a city of Bharatanatyam dance, Carnatic music, magnificent Dravidian temples, and fiery Chettinad cuisine along the Bay of Bengal.",
  },
  HYD: {
    icao: "VOHS",
    elev: 2024,
    tz: "IST+5:30",
    rwys: 1,
    pax: 25.0,
    terminals: 1,
    rwyLen: "13976 ft",
    hub: "IndiGo",
    fact: "Rajiv Gandhi International — at 2,024 ft with one of India's longest runways for A380 operations",
    desc: "Hyderabad is the City of Pearls and biryanis — where the Charminar's minarets anchor the old city, and a booming tech corridor earned it the nickname Cyberabad.",
  },
  PKX: {
    icao: "ZBAD",
    elev: 102,
    tz: "CST+8",
    rwys: 4,
    pax: 26.0,
    terminals: 1,
    rwyLen: "12467 ft",
    hub: "China Southern/China United",
    fact: "Beijing Daxing — the starfish terminal by Zaha Hadid is the world's largest single-structure airport",
    desc: "Beijing's southern gateway connects to a capital of imperial grandeur — the Forbidden City, Temple of Heaven, and a rapidly modernizing metropolis where ancient hutong life endures.",
  },
  KIX: {
    icao: "RJBB",
    elev: 26,
    tz: "JST+9",
    rwys: 2,
    pax: 31.0,
    terminals: 2,
    rwyLen: "13123 ft",
    hub: "Peach/ANA",
    fact: "Kansai — built on an artificial island in Osaka Bay by Renzo Piano, it never loses luggage",
    desc: "Osaka is Japan's kitchen — a city of takoyaki octopus balls, okonomiyaki, and the neon-blazing Dotonbori canal, with Kyoto's temples and Nara's sacred deer just a short train ride away.",
  },
  // ── AFRICA ─────────────────────────────────────────────────────────────────
  JNB: {
    icao: "FAOR",
    elev: 5558,
    tz: "SAST+2",
    rwys: 2,
    pax: 21.0,
    terminals: 2,
    rwyLen: "14495 ft",
    hub: "South African",
    fact: "O.R. Tambo — Africa's busiest at 5,558 ft on the Highveld, handling 21M+ passengers",
    desc: "Johannesburg is South Africa's economic engine — a city of Apartheid Museum reflection, the vibrant Maboneng arts district, and the Cradle of Humankind on its doorstep.",
  },
  CAI: {
    icao: "HECA",
    elev: 382,
    tz: "EET+2",
    rwys: 4,
    pax: 22.7,
    terminals: 3,
    rwyLen: "13124 ft",
    hub: "EgyptAir",
    fact: "Cairo International — gateway to 5,000 years of history, EgyptAir's hub since 1960",
    desc: "Cairo is the city of the Pyramids — a chaotic, magnificent metropolis where pharaonic tombs meet Islamic minarets, and the Nile carves through 20 million lives of ancient and modern drama.",
  },
  CMN: {
    icao: "GMMN",
    elev: 656,
    tz: "WET+1",
    rwys: 2,
    pax: 10.4,
    terminals: 2,
    rwyLen: "12205 ft",
    hub: "Royal Air Maroc",
    fact: "Mohammed V — Africa's 3rd busiest and Royal Air Maroc's hub, a gateway between continents",
    desc: "Casablanca is Morocco's cosmopolitan Atlantic port — a city of the towering Hassan II Mosque over the sea, Art Deco boulevards, and a gateway to the medinas of Marrakech and Fez.",
  },
  ADD: {
    icao: "HAAB",
    elev: 7625,
    tz: "EAT+3",
    rwys: 3,
    pax: 13.2,
    terminals: 2,
    rwyLen: "12468 ft",
    hub: "Ethiopian Airlines",
    fact: "Bole — Ethiopian Airlines' massive hub at 7,625 ft, Africa's fastest-growing carrier base",
    desc: "Addis Ababa is the diplomatic capital of Africa — a highland city of ancient coffee ceremony traditions, the African Union headquarters, and Lucy's fossilized bones in the National Museum.",
  },
  NBO: {
    icao: "HKJK",
    elev: 5327,
    tz: "EAT+3",
    rwys: 2,
    pax: 8.1,
    terminals: 2,
    rwyLen: "13507 ft",
    hub: "Kenya Airways",
    fact: "Jomo Kenyatta — East Africa's hub at 5,327 ft, Kenya Airways' home and safari gateway",
    desc: "Nairobi is the safari capital of the world — a dynamic city where giraffes roam a national park within city limits, and the Maasai Mara's Great Migration is just a short flight away.",
  },
  CPT: {
    icao: "FACT",
    elev: 151,
    tz: "SAST+2",
    rwys: 2,
    pax: 10.7,
    terminals: 1,
    rwyLen: "10502 ft",
    hub: "FlySafair",
    fact: "Cape Town — Table Mountain is visible on approach, with stunning views of the Cape coastline",
    desc: "Cape Town is one of the world's most beautiful cities — where Table Mountain towers above vineyards, penguins waddle on Boulders Beach, and the Cape of Good Hope marks Africa's dramatic edge.",
  },
  LOS: {
    icao: "DNMM",
    elev: 135,
    tz: "WAT+1",
    rwys: 2,
    pax: 9.1,
    terminals: 2,
    rwyLen: "12795 ft",
    hub: "Air Peace",
    fact: "Murtala Muhammed — Nigeria's busiest, serving Lagos, Africa's most populous city (21M+)",
    desc: "Lagos is Africa's creative powerhouse — a megacity of Afrobeats music, Nollywood cinema, vibrant markets, and an entrepreneurial spirit that pulses through every neighborhood.",
  },
  ACC: {
    icao: "DGAA",
    elev: 205,
    tz: "GMT",
    rwys: 1,
    pax: 3.2,
    terminals: 3,
    rwyLen: "11155 ft",
    hub: "Africa World Airlines",
    fact: "Kotoka — Ghana's primary gateway, a growing hub for West African travel and commerce",
    desc: "Accra is Ghana's sun-drenched coastal capital — a city of Jamestown's fishing heritage, vibrant kente cloth markets, and the sobering Cape Coast slave castles nearby.",
  },
  DAR: {
    icao: "HTDA",
    elev: 182,
    tz: "EAT+3",
    rwys: 2,
    pax: 3.8,
    terminals: 3,
    rwyLen: "12008 ft",
    hub: "Air Tanzania",
    fact: "Julius Nyerere — gateway to Zanzibar and the Serengeti, Tanzania's busiest airport",
    desc: "Dar es Salaam is Tanzania's Indian Ocean port city — a gateway to Zanzibar's spice islands, Serengeti safaris, and Kilimanjaro's snow-capped peak.",
  },
  ALG: {
    icao: "DAAG",
    elev: 82,
    tz: "CET",
    rwys: 3,
    pax: 10.0,
    terminals: 3,
    rwyLen: "11483 ft",
    hub: "Air Algérie",
    fact: "Houari Boumediene — Algeria's largest airport, gateway to the Sahara and Casbah of Algiers",
    desc: "Algiers is the White City — a Mediterranean capital of the UNESCO-listed Casbah's labyrinthine alleys, French colonial architecture, and gateway to the vast Sahara Desert.",
  },
  DSS: {
    icao: "GOBD",
    elev: 289,
    tz: "GMT",
    rwys: 1,
    pax: 3.0,
    terminals: 1,
    rwyLen: "11483 ft",
    hub: "Air Sénégal",
    fact: "Blaise Diagne — Senegal's new airport, opened 2017 to replace the cramped Léopold Sédar Senghor",
    desc: "Dakar sits on Africa's westernmost point — a city of vibrant Wolof culture, thieboudienne fish dishes, and the haunting Goree Island slave memorial.",
  },
  TUN: {
    icao: "DTTA",
    elev: 22,
    tz: "CET",
    rwys: 2,
    pax: 7.8,
    terminals: 2,
    rwyLen: "10827 ft",
    hub: "Tunisair",
    fact: "Tunis-Carthage — named for the ancient city of Carthage, Tunisia's primary gateway",
    desc: "Tunis is where the ancient ruins of Carthage meet a vibrant Mediterranean medina — a North African capital of mosaic art, jasmine-scented streets, and rich culinary traditions.",
  },
  // ── OCEANIA ────────────────────────────────────────────────────────────────
  SYD: {
    icao: "YSSY",
    elev: 21,
    tz: "AEST+10",
    rwys: 3,
    pax: 44.4,
    terminals: 3,
    rwyLen: "12999 ft",
    hub: "Qantas",
    fact: "Kingsford Smith — named for the aviator who crossed the Pacific in 1928, Qantas' home base",
    desc: "Sydney is Australia's harbor jewel — where the Opera House's white sails and the Harbour Bridge's steel arc frame one of the world's most recognizable waterfronts. Bondi Beach's surf culture, Chinatown's dumplings, and the Blue Mountains' ancient eucalyptus wilderness reveal a city of extraordinary range.",
  },
  MEL: {
    icao: "YMML",
    elev: 434,
    tz: "AEST+10",
    rwys: 2,
    pax: 37.7,
    terminals: 4,
    rwyLen: "11998 ft",
    hub: "Qantas/Jetstar",
    fact: "Melbourne Tullamarine — Australia's second busiest, with a unique cross-wind runway layout",
    desc: "Melbourne is Australia's cultural capital — a city of hidden laneway cafes, world-class street art, the Melbourne Cup, Australian Rules football passion, and a food and coffee scene that rivals any on Earth. The Great Ocean Road begins just outside the city.",
  },
  BNE: {
    icao: "YBBN",
    elev: 13,
    tz: "AEST+10",
    rwys: 2,
    pax: 23.7,
    terminals: 2,
    rwyLen: "11483 ft",
    hub: "Qantas/Virgin Australia",
    fact: "Brisbane — a massive new parallel runway opened 2020, making it Australia's best-equipped airport",
    desc: "Brisbane is Queensland's sun-soaked river city — a gateway to the Gold Coast's surf beaches, the Great Barrier Reef, and a rapidly maturing arts and dining scene along South Bank.",
  },
  PER: {
    icao: "YPPH",
    elev: 67,
    tz: "AWST+8",
    rwys: 3,
    pax: 15.0,
    terminals: 4,
    rwyLen: "11299 ft",
    hub: "Qantas",
    fact: "Perth — Australia's western gateway, endpoint of the world's longest non-stop flight from London",
    desc: "Perth is the world's most isolated major city — a sun-drenched oasis of pristine Indian Ocean beaches, Kings Park's wildflower bushland, and a relaxed wine country in the Swan Valley.",
  },
  AKL: {
    icao: "NZAA",
    elev: 7,
    tz: "NZST+12",
    rwys: 1,
    pax: 21.4,
    terminals: 2,
    rwyLen: "11926 ft",
    hub: "Air New Zealand",
    fact: "Auckland — New Zealand's busiest, sitting on an isthmus between two harbours",
    desc: "Auckland is the City of Sails — a Polynesian-flavored metropolis spread across volcanic cones, with harbors on both sides, Maori culture, and Middle-earth landscapes a short drive away.",
  },
  ADL: {
    icao: "YPAD",
    elev: 20,
    tz: "ACST+9:30",
    rwys: 2,
    pax: 8.6,
    terminals: 2,
    rwyLen: "10171 ft",
    hub: "Qantas/Rex",
    fact: "Adelaide — South Australia's gateway, known for its efficient single-terminal design",
    desc: "Adelaide is Australia's festival city — a graceful, parkland-ringed capital renowned for the Barossa Valley's shiraz, Central Market's produce, and a world-class arts festival each March.",
  },
  NAN: {
    icao: "NFNA",
    elev: 59,
    tz: "FJT+12",
    rwys: 1,
    pax: 2.5,
    terminals: 1,
    rwyLen: "10502 ft",
    hub: "Fiji Airways",
    fact: "Nadi — Fiji's international gateway, the Pacific Islands' busiest airport by traffic",
    desc: "Fiji is the heart of the South Pacific — a paradise of 333 islands, crystal lagoons, traditional kava ceremonies, and the warmest welcome in Oceania.",
  },
  // ── LATIN AMERICA ──────────────────────────────────────────────────────────
  GRU: {
    icao: "SBGR",
    elev: 2459,
    tz: "BRT-3",
    rwys: 2,
    pax: 41.2,
    terminals: 3,
    rwyLen: "12139 ft",
    hub: "LATAM/Gol/Azul",
    fact: "São Paulo Guarulhos — Latin America's busiest at 2,459 ft, LATAM's primary hub",
    desc: "Sao Paulo is South America's colossal cultural engine — a city of 12 million where Japanese, Italian, and Lebanese immigrant communities have created the continent's most diverse food scene. The Pinacoteca's art, Vila Madalena's street murals, and a nightlife that rivals Berlin's make it Latin America's most cosmopolitan metropolis.",
  },
  GIG: {
    icao: "SBGL",
    elev: 28,
    tz: "BRT-3",
    rwys: 2,
    pax: 12.5,
    terminals: 2,
    rwyLen: "13123 ft",
    hub: "LATAM/Gol",
    fact: "Rio Galeão — stunning approach over Guanabara Bay with Sugarloaf Mountain in view",
    desc: "Rio de Janeiro is the Cidade Maravilhosa — where Christ the Redeemer watches over samba rhythms on Copacabana, Carnival's sequined extravagance, and Sugarloaf Mountain's breathtaking panoramas.",
  },
  MEX: {
    icao: "MMMX",
    elev: 7316,
    tz: "CST-6",
    rwys: 2,
    pax: 50.3,
    terminals: 2,
    rwyLen: "12795 ft",
    hub: "Aeromexico/Volaris",
    fact: "Benito Juárez — one of the world's highest major airports at 7,316 ft elevation",
    desc: "Mexico City is one of the world's great capitals — a sprawling metropolis built atop the Aztec city of Tenochtitlan, where Diego Rivera's murals adorn palatial walls, street tacos achieve perfection on every corner, and the Museo Nacional de Antropologia houses treasures of Mesoamerican civilization. Frida Kahlo's Blue House and the floating gardens of Xochimilco add layers of magic.",
  },
  BOG: {
    icao: "SKBO",
    elev: 8361,
    tz: "COT-5",
    rwys: 2,
    pax: 38.0,
    terminals: 2,
    rwyLen: "12467 ft",
    hub: "Avianca/LATAM",
    fact: "El Dorado — world's highest-elevation major hub at 8,361 ft above sea level in the Andes",
    desc: "Bogota is Colombia's high-altitude capital of reinvention — a city of the Botero Museum's voluptuous sculptures, La Candelaria's colorful colonial streets, and a coffee culture perfected at the source.",
  },
  EZE: {
    icao: "SAEZ",
    elev: 67,
    tz: "ART-3",
    rwys: 2,
    pax: 14.3,
    terminals: 3,
    rwyLen: "10827 ft",
    hub: "Aerolíneas Argentinas",
    fact: "Ezeiza — Buenos Aires' international gateway, 35 km from the city, named Ministro Pistarini",
    desc: "Buenos Aires is the Paris of South America — a city of tango milongas, world-class steak parrillas, Recoleta's Parisian boulevards, and La Boca's colorful caminito.",
  },
  SCL: {
    icao: "SCEL",
    elev: 1555,
    tz: "CLT-4",
    rwys: 2,
    pax: 24.6,
    terminals: 2,
    rwyLen: "12232 ft",
    hub: "LATAM/Sky",
    fact: "Santiago Arturo Merino Benítez — Chile's busiest, framed by the Andes on approach from the east",
    desc: "Santiago sits in a valley embraced by the snow-capped Andes — a sophisticated capital of Neruda's poetry, world-class wine from surrounding valleys, and Barrio Lastarria's cafe culture.",
  },
  LIM: {
    icao: "SPJC",
    elev: 113,
    tz: "PET-5",
    rwys: 2,
    pax: 24.5,
    terminals: 1,
    rwyLen: "11506 ft",
    hub: "LATAM Peru",
    fact: "Jorge Chávez — named for the Peruvian aviator who first flew over the Alps in 1910",
    desc: "Lima is the gastronomic capital of South America — a city where Inca heritage meets Spanish colonial grandeur, ceviche achieves perfection, and Miraflores's cliffs overlook the Pacific.",
  },
  CUN: {
    icao: "MMUN",
    elev: 22,
    tz: "EST-5",
    rwys: 3,
    pax: 31.4,
    terminals: 4,
    rwyLen: "11484 ft",
    hub: "Volaris/VivaAerobus",
    fact: "Cancún — Mexico's busiest tourist airport, gateway to the Riviera Maya and Chichén Itzá",
    desc: "Cancun is Mexico's Caribbean jewel — turquoise waters, Mayan ruins at Tulum and Chichen Itza, underground cenotes for swimming, and the vibrant nightlife of the Hotel Zone.",
  },
  PTY: {
    icao: "MPTO",
    elev: 135,
    tz: "EST-5",
    rwys: 2,
    pax: 16.7,
    terminals: 2,
    rwyLen: "10006 ft",
    hub: "Copa Airlines",
    fact: 'Tocumen — Copa Airlines\' hub, called the "Hub of the Americas" connecting North and South',
    desc: "Panama City is where two oceans meet — a city of the iconic Canal, Casco Viejo's colonial charm, gleaming glass towers, and the biodiversity of the surrounding rainforests.",
  },
  GDL: {
    icao: "MMGL",
    elev: 5016,
    tz: "CST-6",
    rwys: 2,
    pax: 15.8,
    terminals: 2,
    rwyLen: "13123 ft",
    hub: "Volaris",
    fact: "Guadalajara — Mexico's 2nd busiest airport at 5,016 ft, gateway to tequila country",
    desc: "Guadalajara is the birthplace of mariachi and tequila — Mexico's second city of colonial plazas, the Hospicio Cabanas murals by Orozco, and the agave fields of Jalisco.",
  },
  BSB: {
    icao: "SBBR",
    elev: 3479,
    tz: "BRT-3",
    rwys: 2,
    pax: 15.0,
    terminals: 1,
    rwyLen: "10827 ft",
    hub: "LATAM/Gol",
    fact: "Brasília — serves Brazil's planned capital city at 3,479 ft on the Central Plateau",
    desc: "Brasilia is Oscar Niemeyer's modernist masterpiece — a planned capital of sweeping curves and utopian architecture, a UNESCO World Heritage Site unlike any other city on Earth.",
  },
  CNF: {
    icao: "SBCF",
    elev: 2715,
    tz: "BRT-3",
    rwys: 2,
    pax: 10.8,
    terminals: 1,
    rwyLen: "9843 ft",
    hub: "Azul",
    fact: "Confins — Belo Horizonte's airport, Azul Airlines' key hub in the Minas Gerais highlands",
    desc: "Belo Horizonte is the gateway to Minas Gerais — a Brazilian state famous for its hearty mineiro cuisine, historic baroque towns like Ouro Preto, and warm hospitality.",
  },
  MDE: {
    icao: "SKRG",
    elev: 6955,
    tz: "COT-5",
    rwys: 2,
    pax: 11.0,
    terminals: 2,
    rwyLen: "11480 ft",
    hub: "Avianca",
    fact: "José María Córdova — Medellín's airport at 6,955 ft in the Andes, with challenging approaches",
    desc: "Medellin is Colombia's city of eternal spring — transformed from notoriety into a model of urban innovation, with cable cars, botanical gardens, and Botero's bronze sculptures in the plazas.",
  },
  UIO: {
    icao: "SEQM",
    elev: 7874,
    tz: "ECT-5",
    rwys: 1,
    pax: 5.4,
    terminals: 1,
    rwyLen: "13451 ft",
    hub: "LATAM Ecuador",
    fact: "Quito Mariscal Sucre — at 7,874 ft with a 13,451 ft runway for high-altitude performance",
    desc: "Quito is the world's highest official capital — a colonial gem nestled in an Andean valley, with UNESCO-listed churches, the equator monument, and volcanoes framing the horizon.",
  },
  MVD: {
    icao: "SUMU",
    elev: 105,
    tz: "UYT-3",
    rwys: 2,
    pax: 3.5,
    terminals: 1,
    rwyLen: "10499 ft",
    hub: "Amaszonas",
    fact: "Carrasco — Uruguay's gateway, its award-winning Rafael Viñoly terminal opened in 2009",
    desc: "Montevideo is South America's most laid-back capital — a city of mate-sipping rambla strolls, tango milongas, asado traditions, and the charming Ciudad Vieja quarter.",
  },
  SJO: {
    icao: "MROC",
    elev: 3021,
    tz: "CST-6",
    rwys: 1,
    pax: 7.2,
    terminals: 1,
    rwyLen: "9882 ft",
    hub: "Avianca CR",
    fact: "Juan Santamaría — Costa Rica's primary airport, gateway to biodiversity-rich rainforests",
    desc: "San Jose is Costa Rica's gateway to pura vida — a springboard to cloud forests, volcanic hot springs, Pacific surf, and some of the richest biodiversity on the planet.",
  },
};

// ── 初始化本地路由推断引擎 ───────────────────────────────────────────────────
initAirportCities(CITIES);
// T2-04: Expose CITIES for nearest airport lookup in detail.js
window._CITIES = CITIES;
window._AIRPORT_DATA = AIRPORT_DATA;
// routeInfer initialized lazily once module loads (see import at top)
if (window._initRouteInfer) window._initRouteInfer();
else
  window.addEventListener("routeInferReady", () => window._initRouteInfer?.());

function initCityPicker() {
  const overlay = document.getElementById("city-overlay");
  const grid = document.getElementById("city-grid");
  const closeBtn = document.getElementById("city-overlay-close");
  const hudCityBtn = document.getElementById("hud-city-btn");
  if (!overlay || !grid) return;

  // Update airport count dynamically
  const countEl = document.getElementById("city-overlay-count");
  if (countEl)
    countEl.textContent = `${CITIES.length.toLocaleString()} airports · live ADS-B`;

  // ── Region metadata ────────────────────────────────────────────────────
  const REGION_CENTERS = {
    Americas: { lat: 12, lon: -88 },
    Europe: { lat: 52, lon: 12 },
    "Middle East": { lat: 26, lon: 48 },
    Africa: { lat: 4, lon: 22 },
    Asia: { lat: 22, lon: 100 },
    Pacific: { lat: -28, lon: 148 },
  };

  // ── Pre-build search index ──────────────────────────────────────────────
  const _searchIndex = CITIES.map((c, i) => ({
    i,
    nameLower: c.name.toLowerCase(),
    codeLower: c.code.toLowerCase(),
    countryLower: (c.country || "").toLowerCase(),
    icaoLower: (AIRPORT_DATA[c.code]?.icao || "").toLowerCase(),
    tier: getTierNum(c),
    pax: AIRPORT_DATA[c.code]?.pax || 0,
    rwys: AIRPORT_DATA[c.code]?.rwys || 0,
    elev: AIRPORT_DATA[c.code]?.elev || 0,
  }));

  function getTierNum(c) {
    const MEGA = _computeDotSizesSet_MEGA;
    const MAJOR = _computeDotSizesSet_MAJOR;
    if (MEGA.has(c.code)) return 2;
    if (MAJOR.has(c.code)) return 1;
    return 0;
  }

  const regionOrder = [];
  const regionCounts = {};
  for (const c of CITIES) {
    if (!regionCounts[c.region]) {
      regionCounts[c.region] = 0;
      regionOrder.push(c.region);
    }
    regionCounts[c.region]++;
  }

  // ── Globe ────────────────────────────────────────────────────────────────
  // ── Airport info card helpers ─────────────────────────────────────────────
  const MEGA_HUBS = new Set([
    "ATL",
    "DFW",
    "DEN",
    "ORD",
    "LAX",
    "JFK",
    "SFO",
    "SEA",
    "LAS",
    "MCO",
    "CLT",
    "MIA",
    "EWR",
    "BOS",
    "MSP",
    "DTW",
    "IAH",
    "PHX",
    "IAD",
    "PHL",
    "DCA",
    "LHR",
    "CDG",
    "FRA",
    "AMS",
    "MAD",
    "FCO",
    "BCN",
    "MUC",
    "ZRH",
    "VIE",
    "IST",
    "DME",
    "DXB",
    "DOH",
    "RUH",
    "SIN",
    "PEK",
    "PVG",
    "HND",
    "NRT",
    "ICN",
    "BKK",
    "HKG",
    "KUL",
    "CAN",
    "CTU",
    "SZX",
    "DEL",
    "BOM",
    "SYD",
    "MEL",
    "GRU",
    "MEX",
  ]);
  const MAJOR_HUBS = new Set([
    "PDX",
    "SAN",
    "SLC",
    "TPA",
    "RDU",
    "BWI",
    "MCI",
    "OAK",
    "MSY",
    "AUS",
    "SMF",
    "SJC",
    "CLE",
    "CMH",
    "OGG",
    "FLL",
    "MDW",
    "HNL",
    "STL",
    "BNA",
    "RSW",
    "ORY",
    "MXP",
    "LGW",
    "ARN",
    "CPH",
    "HEL",
    "OSL",
    "DUB",
    "LIS",
    "BRU",
    "PRG",
    "BUD",
    "WAW",
    "ATH",
    "AUH",
    "SVO",
    "LED",
    "CAI",
    "CMN",
    "JNB",
    "CPT",
    "NBO",
    "ADD",
    "LOS",
    "ACC",
    "DAR",
    "CGK",
    "MNL",
    "TPE",
    "KUL",
    "CCU",
    "KHI",
    "LHE",
    "AKL",
    "PER",
    "ADL",
    "BNE",
    "GRU",
    "GIG",
    "EZE",
    "SCL",
    "LIM",
    "BOG",
  ]);

  function getHubTier(city) {
    if (MEGA_HUBS.has(city.code)) return "MEGA HUB";
    if (MAJOR_HUBS.has(city.code)) return "MAJOR";
    return "REGIONAL";
  }

  function getUtcOffset(lon) {
    const h = Math.round(lon / 15);
    return h >= 0 ? `UTC+${h}` : `UTC${h}`;
  }

  function fmtCoord(lat, lon) {
    const la = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? "N" : "S"}`;
    const lo = `${Math.abs(lon).toFixed(1)}°${lon >= 0 ? "E" : "W"}`;
    return `${la}  ${lo}`;
  }

  const infoCard = document.getElementById("airport-info-card");
  function updateInfoCard(idx) {
    if (!infoCard) return;
    if (idx < 0) {
      infoCard.classList.add("hidden");
      return;
    }
    const c = CITIES[idx];
    document.getElementById("aic-iata").textContent = c.code;
    document.getElementById("aic-name").textContent = c.name;
    document.getElementById("aic-country").textContent = c.country || "";
    document.getElementById("aic-coord").textContent = fmtCoord(c.lat, c.lon);
    document.getElementById("aic-utc").textContent = getUtcOffset(c.lon);
    const tier = getHubTier(c);
    const tierEl = document.getElementById("aic-tier");
    tierEl.textContent = tier;
    tierEl.className =
      "aic-tier-badge aic-tier-" + tier.replace(" ", "-").toLowerCase();
    infoCard.classList.remove("hidden");
  }

  // ── Globe ────────────────────────────────────────────────────────────────
  const globeCanvas = document.getElementById("city-globe-canvas");
  if (globeCanvas) {
    // Exposed for the same reason the renderer is: a canvas can only be
    // debugged by turning its layers off one at a time from a console.
    _globeView = new GlobeView(globeCanvas, (idx) => {
      focusCity(idx);
    });
    window._globeView = _globeView;
    _globeView.onHover = updateInfoCard;
  }

  // ── Elements ──────────────────────────────────────────────────────────────
  const searchInput = document.getElementById("city-search-input");
  const modeChips = document.getElementById("city-mode-chips");
  modeChips?.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-mode]");
    if (!btn) return;
    showMode = btn.dataset.mode;
    modeChips.querySelectorAll(".tier-chip").forEach((b) => b.classList.toggle("active", b === btn));
    _globeView?.setUnseenMode(showMode === "unseen");
    // The picture is the contrast between two sides of an ocean; turn the globe
    // to the Atlantic so both are in view when the mode is chosen.
    if (showMode === "unseen") _globeView?.flyTo(35, -40);
    const sel = document.getElementById("city-sort-select");
    if (showMode === "unseen" && sel && sel.value !== "unseen") { sel.value = "unseen"; sortBy = "unseen"; }
    renderList();
  });
  // When the index lands after the picker is already open, repaint.
  _onVisibilityIndex = () => { if (showMode === "unseen") { _globeView?.setUnseenMode(true); renderList(); } };
  const tierChips = document.getElementById("city-tier-chips");
  const regionChips = document.getElementById("city-region-chips");
  const sortSelect = document.getElementById("city-sort-select");
  const resultCount = document.getElementById("city-result-count");
  const filterBar = grid.parentElement.querySelector(".city-filter-bar");

  // ── State ────────────────────────────────────────────────────────────────
  let searchQuery = "";
  let activeTier = "all"; // all | mega | major | regional
  let activeRegion = "All"; // All | Americas | Europe | ...
  let sortBy = "pax"; // pax | unseen | name | runways | elevation | country
  let showMode = "traffic"; // traffic | unseen
  let _selectedIdx = -1;
  let _focusedIdx = -1;

  // ── Detail pane ──────────────────────────────────────────────────────────
  const detailPane = document.getElementById("city-detail-pane");
  const cdpSelectBtn = document.getElementById("cdp-select-btn");
  const cdpBackBtn = document.getElementById("cdp-back");

  function getNearby(idx, n = 4) {
    const src = CITIES[idx];
    return CITIES.map((c, i) => ({
      c,
      i,
      d: haversineKm(src.lat, src.lon, c.lat, c.lon),
    }))
      .filter(({ i }) => i !== idx)
      .sort((a, b) => a.d - b.d)
      .slice(0, n);
  }

  function renderDetailPane(idx) {
    if (!detailPane) return;
    const c = CITIES[idx];
    const meta = AIRPORT_DATA[c.code] || {};
    const tier = getHubTier(c);
    const tierClass = "cdp-tier-" + tier.replace(" ", "-").toLowerCase();
    document.getElementById("cdp-iata").textContent = c.code;
    document.getElementById("cdp-name").textContent = c.name;
    document.getElementById("cdp-country-region").textContent =
      `${c.country || ""}  ·  ${c.region}`;
    const tierEl = document.getElementById("cdp-tier");
    tierEl.textContent = tier;
    tierEl.className = "cdp-tier " + tierClass;
    document.getElementById("cdp-icao").textContent = meta.icao || "—";
    document.getElementById("cdp-elev").textContent =
      meta.elev != null ? `${meta.elev.toLocaleString()} ft` : "—";
    document.getElementById("cdp-rwys").textContent =
      meta.rwys != null ? meta.rwys : "—";
    document.getElementById("cdp-tz").textContent =
      meta.tz || getUtcOffset(c.lon);
    document.getElementById("cdp-coord").textContent = fmtCoord(c.lat, c.lon);
    const paxEl = document.getElementById("cdp-pax");
    if (paxEl) paxEl.textContent = meta.pax != null ? `${meta.pax}M/yr` : "—";
    const hubEl = document.getElementById("cdp-hub");
    if (hubEl) hubEl.textContent = meta.hub || "—";
    const termEl = document.getElementById("cdp-terminals");
    if (termEl)
      termEl.textContent = meta.terminals != null ? meta.terminals : "—";
    const rwyLenEl = document.getElementById("cdp-rwylen");
    if (rwyLenEl) rwyLenEl.textContent = meta.rwyLen || "—";
    const factEl = document.getElementById("cdp-fact");
    if (meta.fact) {
      factEl.textContent = `"${meta.fact}"`;
      factEl.classList.remove("hidden");
    } else {
      factEl.classList.add("hidden");
    }
    const descEl = document.getElementById("cdp-desc");
    if (descEl) {
      if (meta.desc) {
        descEl.textContent = meta.desc;
        descEl.classList.remove("hidden");
      } else {
        descEl.classList.add("hidden");
      }
    }
    const nearbyEl = document.getElementById("cdp-nearby");
    const nearby = getNearby(idx, 4);
    nearbyEl.innerHTML = nearby
      .map(
        ({ c: nc, i, d }) =>
          `<div class="cdp-nearby-item" data-idx="${i}">
        <span class="cdp-nearby-code">${nc.code}</span>
        <span class="cdp-nearby-name">${nc.name}</span>
        <span class="cdp-nearby-dist">${Math.round(d)} km</span>
      </div>`,
      )
      .join("");
    nearbyEl.querySelectorAll(".cdp-nearby-item").forEach((el) => {
      el.addEventListener("click", () => focusCity(+el.dataset.idx));
    });
  }

  function showDetailPane() {
    if (!detailPane) return;
    if (filterBar) filterBar.style.display = "none";
    grid.style.display = "none";
    detailPane.classList.remove("hidden");
  }

  function hideDetailPane() {
    if (!detailPane) return;
    detailPane.classList.add("hidden");
    if (filterBar) filterBar.style.display = "";
    grid.style.display = "";
    _globeView?.setFocused(-1);
    updateInfoCard(-1);
    _focusedIdx = -1;
  }

  function focusCity(idx) {
    _focusedIdx = idx;
    renderDetailPane(idx);
    showDetailPane();
    _globeView?.setFocused(idx);
    updateInfoCard(idx);
  }

  if (cdpBackBtn) cdpBackBtn.addEventListener("click", hideDetailPane);
  if (cdpSelectBtn)
    cdpSelectBtn.addEventListener("click", () => {
      if (_focusedIdx >= 0) selectCity(_focusedIdx);
    });

  function selectCity(idx) {
    _selectedIdx = idx;
    _globeView?.setSelected(idx);
    overlay.classList.add("hidden");
    _globeView?.pause();
    localStorage.setItem("stratum:city-picked", "1");
    if (hudCityBtn) hudCityBtn.classList.remove("nudge");
    switchCity(CITIES[idx]);
  }

  // ── Filter + sort engine ─────────────────────────────────────────────────
  function getFilteredList() {
    const q = searchQuery;
    let results = _searchIndex;

    // Tier filter
    if (activeTier !== "all") {
      const tierNum =
        activeTier === "mega" ? 2 : activeTier === "major" ? 1 : 0;
      results = results.filter((e) => e.tier === tierNum);
    }

    // Region filter
    if (activeRegion !== "All") {
      results = results.filter((e) => CITIES[e.i].region === activeRegion);
    }

    // Search filter (fuzzy: name, code, country, icao)
    if (q) {
      results = results.filter(
        (e) =>
          e.nameLower.includes(q) ||
          e.codeLower.startsWith(q) ||
          e.countryLower.includes(q) ||
          e.icaoLower.startsWith(q),
      );
    }

    // Sort
    if (sortBy === "pax") {
      results = results.slice().sort((a, b) => b.pax - a.pax);
    } else if (sortBy === "unseen") {
      // Measured skies by share, most hidden first; the unmeasured after them.
      const sh = (e) => { const v = _visShareCached(e.i); return v ? v.share : -1; };
      results = results.slice().sort((a, b) => sh(b) - sh(a) || b.pax - a.pax);
    } else if (sortBy === "runways") {
      results = results.slice().sort((a, b) => b.rwys - a.rwys);
    } else if (sortBy === "elevation") {
      results = results.slice().sort((a, b) => b.elev - a.elev);
    } else if (sortBy === "country") {
      results = results
        .slice()
        .sort(
          (a, b) =>
            a.countryLower.localeCompare(b.countryLower) ||
            a.nameLower.localeCompare(b.nameLower),
        );
    } else {
      // The unfiltered list was left in the CITIES array's own order, which is
      // curated by importance, while the control said "Name A-Z". Sort for real.
      results = results
        .slice()
        .sort((a, b) => a.nameLower.localeCompare(b.nameLower));
    }

    return results;
  }

  const TIER_LABELS = ["Regional", "Major", "Mega Hub"];
  const TIER_CLASSES = ["cli-tier-regional", "cli-tier-major", "cli-tier-mega"];

  function renderList() {
    const filtered = getFilteredList();
    if (resultCount)
      resultCount.textContent = `${filtered.length.toLocaleString()} airport${filtered.length !== 1 ? "s" : ""}`;

    // Update globe filter
    _globeView?.setFilter(activeRegion, searchQuery);

    if (!filtered.length) {
      grid.innerHTML = `<div class="city-no-results">No airports match your filters</div>`;
      return;
    }

    // Virtual scroll: only render first 80 for performance, expand on scroll
    const BATCH = 80;
    const toRender = filtered.slice(0, BATCH);
    let rendered = BATCH;

    grid.innerHTML = `<div class="city-list-items" id="city-list-items">
         ${toRender.map((e) => renderItem(e)).join("")}
       </div>`;

    // Lazy load more on scroll
    if (filtered.length > BATCH) {
      grid.addEventListener("scroll", function onScroll() {
        if (
          grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 80 &&
          rendered < filtered.length
        ) {
          const next = filtered.slice(rendered, rendered + BATCH);
          const el = document.getElementById("city-list-items");
          if (el)
            el.insertAdjacentHTML(
              "beforeend",
              next.map((e) => renderItem(e)).join(""),
            );
          rendered += BATCH;
          if (rendered >= filtered.length)
            grid.removeEventListener("scroll", onScroll);
        }
      });
    }

    bindListItems();
  }

  function renderItem(e) {
    const c = CITIES[e.i];
    const meta = AIRPORT_DATA[c.code] || {};
    const icao = meta.icao || "";
    // Nine identical MEGA HUB badges down a column carry no information, and the
    // tier is already the filter directly above the list. The same fact is worth
    // more as a length: a bar scaled to annual passengers, against the busiest
    // airport in the world, so every row differs from the one above it.
    let paxStr = e.pax > 0 ? `${e.pax}M` : "";
    let paxPct = e.pax > 0 ? Math.min(100, Math.round((e.pax / 105) * 100)) : 0;
    if (showMode === "unseen") {
      // The bar becomes the share that asked not to be seen, on a 0-20% scale.
      const v = _visShareCached(e.i);
      paxStr = v ? `${Math.round(v.share * 100)}%` : "";
      paxPct = v ? Math.min(100, Math.round((v.share / 0.2) * 100)) : 0;
    }
    return `<div class="city-list-item${e.i === _selectedIdx ? " active" : ""}" data-idx="${e.i}">
      <span class="cli-code">${c.code}</span>
      <div class="cli-info">
        <span class="cli-name">${c.name}</span>
        <span class="cli-sub">${c.country || ""}${icao ? " · " + icao : ""}</span>
      </div>
      <span class="cli-load" title="${showMode === "unseen" ? (paxStr ? paxStr + " of aircraft here asked not to be seen" : "not measured yet") : (paxStr ? paxStr + " passengers a year" : "no traffic figure")}">
        <span class="cli-load-bar"><i style="width:${paxPct}%"></i></span>
        <span class="cli-pax">${paxStr}</span>
      </span>
      <span class="cli-chevron">›</span>
    </div>`;
  }

  function bindListItems() {
    const el = document.getElementById("city-list-items");
    if (!el) return;
    el.addEventListener("mouseover", (e) => {
      const item = e.target.closest(".city-list-item");
      if (item) {
        const idx = +item.dataset.idx;
        if (_globeView) _globeView.hoveredIdx = idx;
        updateInfoCard(idx);
      }
    });
    el.addEventListener("mouseleave", () => {
      if (_globeView) _globeView.hoveredIdx = -1;
      updateInfoCard(-1);
    });
    el.addEventListener("click", (e) => {
      const item = e.target.closest(".city-list-item");
      if (item) focusCity(+item.dataset.idx);
    });
  }

  // ── Event bindings ───────────────────────────────────────────────────────
  // Search input
  let _searchTimer = null;
  searchInput.addEventListener("input", () => {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => {
      searchQuery = searchInput.value.toLowerCase().trim();
      renderList();
    }, 80);
  });

  // Tier chips
  tierChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".tier-chip");
    if (!chip) return;
    activeTier = chip.dataset.tier;
    tierChips
      .querySelectorAll(".tier-chip")
      .forEach((c) => c.classList.toggle("active", c === chip));
    renderList();
  });

  // Region chips
  regionChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".region-chip");
    if (!chip) return;
    activeRegion = chip.dataset.region;
    regionChips
      .querySelectorAll(".region-chip")
      .forEach((c) => c.classList.toggle("active", c === chip));
    // Fly globe to region center
    if (activeRegion !== "All") {
      const center = REGION_CENTERS[activeRegion];
      if (center) _globeView?.flyTo(center.lat, center.lon);
    }
    renderList();
  });

  // Sort select
  sortSelect.addEventListener("change", () => {
    sortBy = sortSelect.value;
    renderList();
  });

  // Close overlay
  const closeOverlay = () => {
    overlay.classList.add("hidden");
    _globeView?.pause();
  };
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });
  if (closeBtn) closeBtn.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  if (hudCityBtn) {
    hudCityBtn.addEventListener("click", () => openCityPicker());
    if (!localStorage.getItem("stratum:city-picked"))
      hudCityBtn.classList.add("nudge");
  }
  if (!localStorage.getItem("stratum:city-picked"))
    setTimeout(() => openCityPicker(), 1200);

  // Initial render — flat list, all airports, sorted by name
  renderList();
}

function openCityPicker() {
  const overlay = document.getElementById("city-overlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");
  _globeView?.resume();
  setTimeout(() => {
    const s = document.getElementById("city-search-input");
    if (s) s.focus();
  }, 60);
}

// --- Search with keyboard navigation ---
function initSearch() {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!input || !results) return;

  let debounceTimer = null;
  let selectedIndex = -1;

  function getResultItems() {
    return [
      ...results.querySelectorAll(
        ".search-result[data-icao], .search-result[data-airport]",
      ),
    ];
  }

  function setSelection(idx, items) {
    items.forEach((el, i) => {
      el.classList.toggle("selected", i === idx);
      if (i === idx) el.scrollIntoView({ block: "nearest" });
    });
    selectedIndex = idx;
  }

  function clearResults() {
    results.innerHTML = "";
    results.classList.remove("open");
    selectedIndex = -1;
  }

  // Search airports from CITIES array
  function searchAirports(q, limit = 8) {
    const scored = [];
    const ql = q.toLowerCase();
    for (const c of CITIES) {
      const code = c.code.toUpperCase();
      const name = c.name.toLowerCase();
      const country = (c.country || "").toLowerCase();
      let score = 0;
      if (code === q) score = 200;
      else if (code.startsWith(q)) score = 150;
      else if (name === ql) score = 140;
      else if (name.startsWith(ql)) score = 120;
      else if (code.includes(q)) score = 80;
      else if (name.includes(ql)) score = 60;
      else if (country.startsWith(ql)) score = 40;
      else if (country.includes(ql)) score = 30;
      if (score > 0) scored.push({ city: c, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.city);
  }

  // Escape HTML
  function esc(s) {
    return (s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderResults(q) {
    selectedIndex = -1;
    if (q.length < 2 || !aircraftManager) {
      clearResults();
      return;
    }

    const acMatches = aircraftManager.search(q, 12);
    const aptMatches = searchAirports(q, 6);
    const hasAC = acMatches.length > 0;
    const hasAPT = aptMatches.length > 0;

    if (!hasAC && !hasAPT) {
      results.innerHTML = `<div class="search-no-results">
        <div class="search-no-results-icon">⌕</div>
        <div class="search-no-results-text">No results for "${esc(q)}"</div>
        <div class="search-no-results-hint">Try callsign, registration, type, route, or airport</div>
      </div>`;
      results.classList.add("open");
      return;
    }

    let html = "";

    // Aircraft results
    if (hasAC) {
      html += `<div class="search-category">AIRCRAFT <span class="search-category-count">${acMatches.length}</span></div>`;
      for (const ac of acMatches) {
        const d = ac.getDisplayData();
        const cs = esc(d.callsign || d.icao24);
        const typeReg = [d.aircraftType, d.registration]
          .filter(Boolean)
          .map(esc)
          .join(" · ");
        const route =
          d.origin || d.destination
            ? `${esc(d.origin || "?")}→${esc(d.destination || "?")}`
            : "";
        const altFt =
          d._rawAlt != null ? Math.round(d._rawAlt * 3.28084) : null;
        const altStr =
          altFt != null
            ? altFt >= 18000
              ? `FL${Math.round(altFt / 100)}`
              : `${altFt.toLocaleString()}ft`
            : "";
        const phase = d.flightPhase || "";
        const phaseClass =
          phase === "CLIMB" || phase === "INITIAL CLIMB" || phase === "TAKEOFF"
            ? "climb"
            : phase === "DESCENT" || phase === "APPROACH" || phase === "LANDING"
              ? "descent"
              : phase === "CRUISE"
                ? "cruise"
                : "";
        html += `<div class="search-result" role="option" data-icao="${esc(d.icao24)}">
          <div class="search-result-main">
            <span class="search-result-callsign">${cs}</span>
            ${route ? `<span class="search-result-route">${route}</span>` : ""}
          </div>
          <div class="search-result-detail">
            <span class="search-result-info">${typeReg || esc(d.icao24)}</span>
            ${altStr ? `<span class="search-result-alt">${altStr}</span>` : ""}
            ${phaseClass ? `<span class="search-result-status ${phaseClass}">${esc(phase)}</span>` : ""}
          </div>
        </div>`;
      }
    }

    // Airport results
    if (hasAPT) {
      html += `<div class="search-category">AIRPORTS <span class="search-category-count">${aptMatches.length}</span></div>`;
      for (const apt of aptMatches) {
        html += `<div class="search-result search-result-airport" role="option" data-airport="${esc(apt.code)}">
          <div class="search-result-main">
            <span class="search-result-callsign">${esc(apt.code)}</span>
            <span class="search-result-airport-name">${esc(apt.name)}</span>
          </div>
          <div class="search-result-detail">
            <span class="search-result-info">${esc(apt.country)} · ${esc(apt.region)}</span>
          </div>
        </div>`;
      }
    }

    results.innerHTML = html;
    results.classList.add("open");

    // Click handlers
    results.querySelectorAll(".search-result[data-icao]").forEach((el) => {
      el.addEventListener("click", () => selectAircraftResult(el.dataset.icao));
    });
    results.querySelectorAll(".search-result[data-airport]").forEach((el) => {
      el.addEventListener("click", () =>
        selectAirportResult(el.dataset.airport),
      );
    });
  }

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderResults(input.value.trim().toUpperCase());
    }, 120);
  });

  function selectAircraftResult(icao) {
    const ac = aircraftManager.getByIcao(icao);
    if (ac) {
      const { lat, lon } = getUserLocation();
      showDetail(ac, lat, lon);
      _recordContact(ac);
      aircraftManager.selectAircraft(ac);
      flyToThenFollow(ac);
      input.value = "";
      clearResults();
      input.blur();
    }
  }

  function selectAirportResult(code) {
    const city = CITIES.find((c) => c.code === code);
    if (city) {
      input.value = "";
      clearResults();
      input.blur();
      switchCity(city);
    }
  }

  // Keyboard navigation inside search
  input.addEventListener("keydown", (e) => {
    const items = getResultItems();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelection(Math.min(selectedIndex + 1, items.length - 1), items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelection(Math.max(selectedIndex - 1, 0), items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        const el = items[selectedIndex];
        if (el.dataset.icao) selectAircraftResult(el.dataset.icao);
        else if (el.dataset.airport) selectAirportResult(el.dataset.airport);
      }
    }
  });

  input.addEventListener("focus", () => input.select());
  input.addEventListener("blur", () => {
    setTimeout(() => {
      clearResults();
      // Hide search bar when focus leaves and input is empty
      if (!input.value.trim()) _toggleSearchBar(false);
    }, 250);
  });

  // Global shortcuts
  document.addEventListener("keydown", (e) => {
    // Bare slash only. Without the modifier guard this also fired on Shift+/,
    // which is how "?" is typed on a US layout and how some layouts and IMEs
    // report it -- so asking for the keyboard guide opened the search bar
    // instead. It also fired on Cmd+/ and Ctrl+/, which belong to the browser.
    if (
      e.key === "/" &&
      !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey &&
      document.activeElement !== input
    ) {
      e.preventDefault();
      _toggleSearchBar(true);
    }
    if (e.key === "Escape") {
      // Close overlays/panels in priority order (highest z-index first)
      const cityOverlay = document.getElementById("city-overlay");
      if (cityOverlay && !cityOverlay.classList.contains("hidden")) {
        cityOverlay.classList.add("hidden");
        return;
      }
      // Close any open overlay-backdrop (stats, history, spotter, notes)
      const openBackdrop = document.querySelector(
        ".overlay-backdrop:not(.hidden)",
      );
      if (openBackdrop) {
        openBackdrop.classList.add("hidden");
        return;
      }
      // Close help panel
      const hp = document.getElementById("help-panel");
      if (hp && !hp.classList.contains("hidden")) {
        hp.classList.add("hidden");
        return;
      }
      // Close search bar
      const searchBar = document.getElementById("search-bar");
      if (searchBar && searchBar.classList.contains("visible")) {
        _toggleSearchBar(false);
        return;
      }
      // Close detail panel
      const dp = document.getElementById("detail-panel");
      if (dp && !dp.classList.contains("hidden")) {
        closeDetail();
        if (aircraftManager) aircraftManager.deselectAircraft();
        stopFollow();
        removeRouteArc(scene);
        _clearHoldingOval(); // A-3
        return;
      }
      // Stop follow
      if (followTarget) stopFollow();
    }
  });
}

// --- Floating action toolbar — wire button clicks to existing keyboard actions ---
function _toggleSearchBar(forceShow) {
  const bar = document.getElementById("search-bar");
  const input = document.getElementById("search-input");
  if (!bar || !input) return;
  const show =
    forceShow != null ? forceShow : !bar.classList.contains("visible");
  if (show) {
    bar.classList.add("visible");
    input.focus();
  } else {
    bar.classList.remove("visible");
    input.blur();
    input.value = "";
    const results = document.getElementById("search-results");
    if (results) {
      results.innerHTML = "";
      results.classList.remove("open");
    }
  }
}

function initToolbar() {
  document.getElementById("fab-search")?.addEventListener("click", () => {
    _toggleSearchBar();
  });
  document.getElementById("fab-help")?.addEventListener("click", () => {
    toggleHelp();
  });
  document.getElementById("fab-airspace")?.addEventListener("click", () => {
    openCityPicker();
  });
  document.getElementById("fab-filter")?.addEventListener("click", () => {
    const panel = document.getElementById("filter-panel");
    if (!panel) return;
    filterState.active = !filterState.active;
    panel.classList.toggle("hidden", !filterState.active);
    if (filterState.active) {
      if (window._filterPanelRender) window._filterPanelRender();
      requestAnimationFrame(() => panel.classList.add("visible"));
    } else {
      panel.classList.remove("visible");
      filterState.altPreset = "ALL";
      filterState.isolate = false;
      filterState.airportMode = "ALL";
      aircraftManager?.clearFilter();
    }
  });
}

// --- Init ---
// ── My Location: find nearest CITIES entry by haversine ──────────────────────
function _findNearestCity(lat, lon) {
  let best = null,
    bestDist = Infinity;
  for (const city of CITIES) {
    const d = haversineKm(lat, lon, city.lat, city.lon);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  return best || CITIES.find((c) => c.code === "JFK") || CITIES[0];
}

// ── Boot step progress helpers ────────────────────────────────────────────────
function _setBootStep(id, state) {
  const el = document.getElementById(id);
  if (!el) return;
  const icon = el.querySelector(".sts-icon");
  el.classList.remove("sts-active", "sts-done");
  if (state === "active") {
    el.classList.add("sts-active");
    if (icon) icon.textContent = "◌";
  } else if (state === "done") {
    el.classList.add("sts-done");
    if (icon) icon.textContent = "✓";
  } else {
    if (icon) icon.textContent = "○";
  }
}
function _resetBootSteps() {
  ["sts-loc", "sts-map", "sts-apt", "sts-acft"].forEach((id) =>
    _setBootStep(id, "idle"),
  );
}

// ── Post-boot loading status pill ────────────────────────────────────────────
// Looked up on use, not captured at module scope. Captured, these were null
// whenever this module happened to evaluate before the element existed, and
// every later call to _setLoadStatus returned at its own guard -- silently, so
// the pill kept whatever the markup said and no status ever reached anyone.
let _loadStatusEl = null;
let _loadStatusTextEl = null;
let _aptLoadDone = false;
let _aircraftArrived = false;

function _setLoadStatus(text) {
  _loadStatusEl ||= document.getElementById("load-status");
  _loadStatusTextEl ||= document.getElementById("load-status-text");
  if (!_loadStatusEl) return;
  if (text) {
    if (_loadStatusTextEl) _loadStatusTextEl.textContent = text;
    _loadStatusEl.classList.remove("hidden");
  } else {
    _loadStatusEl.classList.add("hidden");
  }
}

function _onAptLoaded() {
  _aptLoadDone = true;
  _setBootStep("sts-apt", "done");
  if (_aircraftArrived) _setLoadStatus(null);
  else _setLoadStatus("Awaiting aircraft data…");
}

function _onAircraftArrived() {
  if (_aircraftArrived) return;
  _aircraftArrived = true;
  _setBootStep("sts-acft", "done");
  if (_aptLoadDone) _setLoadStatus(null);
}

// ── Low-coverage region definitions ──────────────────────────────────────────
const _LOW_COVERAGE = {
  China: {
    title: "Mainland China — Restricted ADS-B",
    body: "China's civil aviation authority (CAAC) restricts public sharing of ADS-B transponder data from mainland airports and ground stations. Our network has very limited reception in this region, so only a small fraction of actual traffic is currently visible.",
  },
  Russia: {
    title: "Russia — Reduced ADS-B Coverage",
    body: "Since 2022, ADS-B feeder access across Russia has been significantly curtailed. Aircraft near international borders or operated by carriers with external feeders may still appear, but coverage is sparse.",
  },
  "North Korea": {
    title: "DPRK — No Civilian ADS-B",
    body: "North Korean airspace is closed to civilian ADS-B reception. The handful of government-authorized international flights operating here don't broadcast publicly readable transponder data.",
  },
  Kazakhstan: {
    title: "Central Asia — Sparse Feeders",
    body: "This region has limited ADS-B ground station density. High-altitude en-route traffic may appear, but terminal-area departures and arrivals are often invisible until closer to major hubs.",
  },
  Uzbekistan: {
    title: "Central Asia — Sparse Feeders",
    body: "This region has limited ADS-B ground station density. High-altitude en-route traffic may appear, but terminal-area departures and arrivals are often invisible until closer to major hubs.",
  },
};

function _showNoCoverageDialog(info) {
  const backdrop = document.getElementById("no-coverage-backdrop");
  const titleEl = document.getElementById("no-coverage-title");
  const bodyEl = document.getElementById("no-coverage-body");
  if (!backdrop || !titleEl || !bodyEl) return;
  titleEl.textContent = info.title;
  bodyEl.textContent = info.body;
  backdrop.classList.remove("hidden");
}

const _lowCoverageShown = new Set();
function _checkLowCoverage(city) {
  const info = _LOW_COVERAGE[city.country];
  if (!info) return;
  const count = aircraftManager ? aircraftManager.getCount() : 0;
  // Beijing shows twenty-odd aircraft in a box that holds two hundred over an
  // American city of the same size. Twenty is not "no coverage", so the old
  // threshold of three never fired and the sky simply looked empty of events
  // -- no arrivals, no departures -- with nothing to say why. Judged against
  // what a hub's sky normally holds, once per city.
  if (count < 40 && !_lowCoverageShown.has(city.code)) {
    _lowCoverageShown.add(city.code);
    _showNoCoverageDialog(info);
  }
}

async function init() {
  // T3-15: Check for shared view link
  const urlCity = restoreViewFromURL();
  // Fallback centre used until (or instead of) geolocation — resolves to JFK,
  // which publishes a tower feed. O'Hare does not, so it opened silent.
  const _FALLBACK = { lat: 40.6413, lon: -73.7781 };

  // ── 1. Start render loop IMMEDIATELY ──
  animate();

  // ── 2. Kick off geo detection in the background — don't block anything ──
  _setBootStep("sts-loc", "active");
  if (sceneTransName) sceneTransName.textContent = "Detecting location…";
  const geoPromise = Promise.race([
    initLocation().catch(() => _FALLBACK),
    new Promise((r) => setTimeout(() => r(_FALLBACK), 1200)),
  ]);

  // ── 3. Resolve start city from URL or NYC default (no geo wait) ──
  const defaultCity = urlCity
    ? CITIES.find((c) => c.code === urlCity) ||
      _findNearestCity(_FALLBACK.lat, _FALLBACK.lon)
    : _findNearestCity(_FALLBACK.lat, _FALLBACK.lon);

  activeCity = defaultCity;
  setUserLocation(defaultCity.lat, defaultCity.lon);
  updateHUDCity(defaultCity.name, defaultCity.code);
  setCommonsPlace(defaultCity.name);
  initATC();
  startDetailRotor();
  setATCAirport(AIRPORT_DATA[defaultCity.code]?.icao || null);
  armATCAutoplay();
  updateHUD(0, defaultCity.lat, defaultCity.lon);
  sessionStats.cities.add(defaultCity.code);

  aircraftManager = new AircraftManager(
    scene,
    defaultCity.lat,
    defaultCity.lon,
  );
  window._aircraftManager = aircraftManager;

  if (sceneTransCode) sceneTransCode.textContent = defaultCity.code;
  if (sceneTransName) sceneTransName.textContent = defaultCity.name;

  // ── 4. Start ALL data loads immediately — parallel with geo ──
  _setBootStep("sts-map", "active");
  _setBootStep("sts-apt", "active");
  _setBootStep("sts-acft", "active");
  const mapP = loadGroundMap(defaultCity.lat, defaultCity.lon);
  const aptP = loadAirports(scene, defaultCity.lat, defaultCity.lon).then(
    () => {
      const aptData = getAirportData();
      if (aptData) updateHUDAirports(aptData.airports.length);
      _onAptLoaded();
    },
  );
  // Start the commons with everything else rather than waiting for a poll, so
  // the names are on the ringed labels the first time they are drawn instead of
  // appearing a beat later. It does not move the "while you were away" line,
  // which is computed on the first data and therefore lands when the boot
  // splash lifts -- measured at eight seconds, which is where it belongs: any
  // earlier and it would be playing to a covered screen.
  refreshIndex(true).then((changed) => { if (changed) refreshGhostNames(); });
  initAmbience();
  startPolling(handleData, handleError);

  // ── 5. Await geo + first data arrival in parallel ──
  // Data loads from Worker cache (~200ms); geo runs concurrently — no sequential stall.
  const [geoCoords] = await Promise.all([
    geoPromise,
    Promise.race([aptP, new Promise((r) => setTimeout(r, 800))]),
  ]);
  _setBootStep("sts-loc", "done");
  _setBootStep("sts-map", "done");

  // ── 6. Optionally follow the resolved location ──
  // Off by default: behind a VPN or corporate proxy this resolves to the exit
  // node, so the app would boot at the fallback and then yank itself to an
  // unrelated city a second later. Opt in with ?geo=1.
  const followGeo = new URLSearchParams(location.search).get("geo") === "1";
  if (!urlCity && followGeo) {
    const realCity = _findNearestCity(geoCoords.lat, geoCoords.lon);
    if (realCity.code !== defaultCity.code) {
      switchCity(realCity);
    }
  }

  // ── 7. Fade out boot splash ──
  if (sceneTrans) {
    sceneTrans.classList.remove("scene-transition--boot");
    sceneTrans.classList.remove("loading");
    sceneTrans.style.transition = "opacity 0.8s ease";
    sceneTrans.style.opacity = "0";
    sceneTrans.style.pointerEvents = "";
    _introDescent();
    initSchool({
      camera, canvas,
      getAircraft: () => (aircraftManager ? [...aircraftManager.aircraft.values()] : []),
      getFixes: getChartFixes,
      getNavaids: getNavHitTargets,
      getThresholds: getRunwayThresholdTargets,
      getRingsVisible: () => distanceRingsVisible,
    });
  }

  // Show post-boot loading pill if not fully loaded yet
  if (!_aptLoadDone || !_aircraftArrived) {
    _setLoadStatus(
      _aptLoadDone ? "Awaiting aircraft data…" : "Loading airports…",
    );
  }

  // ── 8. Deferred UI init — next frame, after scene is visible ──
  requestAnimationFrame(() => {
    initSearch();
    initCityPicker();
    initFilterPanel();
    initToolbar();
    initMobileTouch();
    initWeatherPanel();
    _startWxRotation();
    updateWeatherWidget();

    // Overlay close handlers
    document.querySelectorAll(".overlay-backdrop").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target === el) el.classList.add("hidden");
      });
    });
    document.querySelectorAll(".overlay-close-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".overlay-backdrop")?.classList.add("hidden");
      });
    });

    // No-coverage dialog buttons
    document
      .getElementById("no-coverage-close")
      ?.addEventListener("click", () => {
        document
          .getElementById("no-coverage-backdrop")
          ?.classList.add("hidden");
      });
    document
      .getElementById("no-coverage-switch")
      ?.addEventListener("click", () => {
        document
          .getElementById("no-coverage-backdrop")
          ?.classList.add("hidden");
        document.getElementById("city-overlay")?.classList.remove("hidden");
      });
  });

  // ── 9. Deferred data loads ──
  setTimeout(
    () => reloadFIRForLocation(scene, defaultCity.lat, defaultCity.lon),
    1500,
  );
  aptP.then(() => reloadNavChart(scene, defaultCity.lat, defaultCity.lon));
  // Prefetch only nearest 30 cities — Worker cron pre-warms top 65 globally already.
  // Prefetching 600+ cities floods the network with 30+ batch requests on startup.
  aptP.then(() => {
    const nearest = [...CITIES]
      .map((c) => ({
        ...c,
        _d: Math.hypot(c.lat - defaultCity.lat, c.lon - defaultCity.lon),
      }))
      .sort((a, b) => a._d - b._d)
      .slice(0, 30);
    prefetchAirportData(nearest);
  });

  // ── 10. Check low-coverage zone after 12s ──
  setTimeout(() => _checkLowCoverage(defaultCity), 12000);
}

init();
