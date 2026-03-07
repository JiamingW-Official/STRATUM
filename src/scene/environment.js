import * as THREE from 'three';
import { loadMapTexture } from './mapTiles.js';

export const ALT_LEVELS = [
  { ft: 10000, y: 3.5, label: '10,000 ft', color: 0x4a3a1a },
  { ft: 18000, y: 6.3, label: '18,000 ft', color: 0x1a3a6b },
  { ft: 35000, y: 12.25, label: '35,000 ft', color: 0x1a3a6b },
  { ft: 40000, y: 14.0, label: '40,000 ft', color: 0x0a1a3b },
];

const GROUND_SIZE = 200;
const GEO_SCALE = 20;

let groundMaterial = null;

export function createEnvironment(scene) {
  // Ambient light
  const ambient = new THREE.AmbientLight(0x334466, 0.6);
  scene.add(ambient);

  // Directional light from above
  const dirLight = new THREE.DirectionalLight(0x88aacc, 0.4);
  dirLight.position.set(20, 60, 30);
  scene.add(dirLight);

  // Ground plane — starts dark, map tiles loaded async
  const groundGeo = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE);
  groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
  });
  const ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.name = 'ground';
  scene.add(ground);

  // Ground grid (on top of map)
  const gridHelper = new THREE.GridHelper(GROUND_SIZE, 40, 0x0a1520, 0x0a1520);
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  gridHelper.position.y = 0.02;
  scene.add(gridHelper);

  // User location pulse ring
  const pulseGroup = new THREE.Group();
  pulseGroup.name = 'userPulse';

  const ringGeo = new THREE.RingGeometry(0.8, 1.0, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x4d9fff,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.04;
  pulseGroup.add(ring);

  const dotGeo = new THREE.CircleGeometry(0.3, 32);
  const dotMat = new THREE.MeshBasicMaterial({
    color: 0x4d9fff,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.rotation.x = -Math.PI / 2;
  dot.position.y = 0.05;
  pulseGroup.add(dot);

  const pulseRingGeo = new THREE.RingGeometry(1.0, 1.15, 64);
  const pulseRingMat = new THREE.MeshBasicMaterial({
    color: 0x4d9fff,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  });
  const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
  pulseRing.rotation.x = -Math.PI / 2;
  pulseRing.position.y = 0.04;
  pulseRing.name = 'pulseRing';
  pulseGroup.add(pulseRing);

  scene.add(pulseGroup);

  // Altitude layer planes
  ALT_LEVELS.forEach((level) => {
    const planeGeo = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE);
    const planeMat = new THREE.MeshBasicMaterial({
      color: level.color,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide,
      depthWrite: false,
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
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(12, 2.5, 1);
    sprite.position.set(-GROUND_SIZE / 2 + 8, level.y + 0.5, -GROUND_SIZE / 2 + 4);
    scene.add(sprite);
  });
}

/**
 * Load map tiles and apply as ground plane texture.
 * Called after user location is known.
 */
export async function loadGroundMap(lat, lon) {
  const degreesExtent = GROUND_SIZE / GEO_SCALE; // 10 degrees
  try {
    const texture = await loadMapTexture(lat, lon, degreesExtent, (upgradedTexture) => {
      // Progressive upgrade: replace texture with higher-res version
      if (groundMaterial) {
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

export function updatePulse(scene, time) {
  const pulseRing = scene.getObjectByName('pulseRing');
  if (!pulseRing) return;

  const cycle = (time % 3) / 3;
  const scale = 1 + cycle * 3;
  pulseRing.scale.set(scale, scale, 1);
  pulseRing.material.opacity = 0.4 * (1 - cycle);
}
