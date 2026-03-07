import * as THREE from 'three';

let renderer, scene, camera, globe, userDot, acGroup;
let mounted = false;
const GLOBE_RADIUS = 3;

// Simplified continent boundary points (lon, lat) — major landmasses only
// These are rough outlines to give a recognizable earth shape
const CONTINENTS = [
  // North America (simplified)
  [[-130,50],[-125,60],[-110,68],[-95,72],[-80,70],[-65,60],[-55,48],[-67,44],[-70,42],[-75,35],[-80,25],[-85,30],[-90,28],[-97,26],[-105,20],[-100,17],[-90,15],[-85,12],[-82,8],[-80,8],[-80,5],[-77,8],[-75,10],[-77,18],[-82,22],[-88,22],[-97,26],[-105,32],[-115,32],[-120,35],[-125,42],[-125,48],[-130,50]],
  // South America (simplified)
  [[-80,8],[-75,12],[-68,12],[-60,5],[-50,0],[-45,-3],[-40,-8],[-35,-10],[-38,-15],[-40,-22],[-48,-28],[-55,-33],[-58,-38],[-65,-42],[-68,-50],[-68,-55],[-72,-50],[-74,-42],[-72,-35],[-70,-28],[-70,-18],[-75,-14],[-78,-5],[-80,0],[-80,8]],
  // Europe (simplified)
  [[-10,36],[0,38],[5,44],[2,48],[-5,48],[-10,44],[-10,36]],
  [[2,48],[8,48],[15,47],[20,42],[25,38],[28,36],[30,40],[28,44],[22,48],[18,55],[10,55],[8,58],[12,58],[15,60],[12,65],[18,70],[25,72],[30,70],[40,68],[45,70],[40,65],[35,58],[30,55],[28,50],[24,48],[15,47],[8,48],[2,48]],
  // Africa (simplified)
  [[-18,15],[-15,28],[-5,36],[10,37],[12,33],[15,30],[25,32],[30,30],[35,30],[40,12],[50,12],[42,0],[40,-5],[35,-15],[35,-25],[30,-34],[25,-34],[18,-35],[18,-30],[12,-18],[12,-5],[5,5],[2,6],[-5,5],[-8,5],[-15,10],[-18,15]],
  // Asia (simplified rough)
  [[28,36],[30,40],[35,42],[40,42],[45,40],[50,38],[55,26],[60,24],[65,25],[70,22],[75,15],[80,8],[78,22],[82,28],[88,22],[90,26],[95,20],[100,15],[105,10],[107,16],[110,20],[115,22],[120,22],[125,33],[130,35],[135,35],[130,42],[128,38],[122,38],[120,43],[130,48],[135,55],[140,53],[145,45],[142,38],[142,33],[138,35],[135,35]],
  [[40,42],[45,50],[50,55],[55,55],[60,55],[65,55],[68,58],[75,55],[80,50],[82,45],[80,40],[75,35],[70,38],[60,42],[55,42],[50,42],[50,46],[55,50],[60,50],[65,50],[70,52],[80,55],[90,55],[100,50],[110,45],[120,48],[125,52],[130,55],[140,60],[160,62],[170,64],[180,66],[-170,65],[-168,63],[-160,60],[-150,62],[-140,60],[-140,70],[-160,72],[-170,68],[180,66]],
  // Australia (simplified)
  [[115,-35],[120,-35],[130,-32],[138,-33],[145,-38],[150,-38],[153,-28],[148,-20],[145,-15],[135,-12],[130,-15],[125,-15],[115,-22],[115,-35]],
];

function latLonToSphere(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function createContinentLines() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 0x1a3a5c,
    transparent: true,
    opacity: 0.5,
  });

  for (const outline of CONTINENTS) {
    const points = [];
    for (const [lon, lat] of outline) {
      points.push(latLonToSphere(lat, lon, GLOBE_RADIUS + 0.01));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    group.add(line);
  }
  return group;
}

function createGraticule() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 0x0d1f33,
    transparent: true,
    opacity: 0.3,
  });

  // Latitude lines every 30 degrees
  for (let lat = -60; lat <= 60; lat += 30) {
    const points = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      points.push(latLonToSphere(lat, lon, GLOBE_RADIUS + 0.005));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geo, material));
  }

  // Longitude lines every 30 degrees
  for (let lon = -180; lon < 180; lon += 30) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      points.push(latLonToSphere(lat, lon, GLOBE_RADIUS + 0.005));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geo, material));
  }
  return group;
}

export function initMinimap(lat, lon) {
  const container = document.getElementById('minimap');
  const w = container.clientWidth;
  const h = container.clientHeight;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  // Globe sphere
  const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 48);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0x050d1a,
    transparent: true,
    opacity: 0.9,
  });
  globe = new THREE.Mesh(globeGeo, globeMat);
  scene.add(globe);

  // Atmosphere glow
  const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.08, 48, 48);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x1a3a6b,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(atmosGeo, atmosMat));

  // Graticule (grid lines)
  scene.add(createGraticule());

  // Continent outlines
  scene.add(createContinentLines());

  // User position dot
  const dotMat = new THREE.SpriteMaterial({
    color: 0x4d9fff,
    transparent: true,
    opacity: 0.9,
  });
  userDot = new THREE.Sprite(dotMat);
  userDot.scale.set(0.15, 0.15, 1);
  const userPos = latLonToSphere(lat, lon, GLOBE_RADIUS + 0.05);
  userDot.position.copy(userPos);
  scene.add(userDot);

  // Coverage ring on globe surface
  const coveragePoints = [];
  for (let a = 0; a <= 360; a += 5) {
    const cLat = lat + 2 * Math.cos(a * DEG_TO_RAD);
    const cLon = lon + 2 * Math.sin(a * DEG_TO_RAD);
    coveragePoints.push(latLonToSphere(cLat, cLon, GLOBE_RADIUS + 0.02));
  }
  const coverageGeo = new THREE.BufferGeometry().setFromPoints(coveragePoints);
  const coverageMat = new THREE.LineBasicMaterial({
    color: 0x4d9fff,
    transparent: true,
    opacity: 0.3,
  });
  scene.add(new THREE.Line(coverageGeo, coverageMat));

  // Aircraft group
  acGroup = new THREE.Group();
  scene.add(acGroup);

  // Rotate globe to center on user position
  rotateGlobeToCenter(lat, lon);

  mounted = true;

  // Animation loop
  function animateGlobe() {
    if (!mounted) return;
    requestAnimationFrame(animateGlobe);
    // Slow auto-rotate
    globe.rotation.y += 0.0005;
    renderer.render(scene, camera);
  }
  animateGlobe();

  // Handle resize
  const ro = new ResizeObserver(() => {
    const w2 = container.clientWidth;
    const h2 = container.clientHeight;
    camera.aspect = w2 / h2;
    camera.updateProjectionMatrix();
    renderer.setSize(w2, h2);
  });
  ro.observe(container);
}

const DEG_TO_RAD = Math.PI / 180;

function rotateGlobeToCenter(lat, lon) {
  // Rotate scene so user location faces the camera
  const phi = (90 - lat) * DEG_TO_RAD;
  const theta = lon * DEG_TO_RAD;
  // We rotate the globe (and everything attached) so user dot faces camera (+Z)
  scene.rotation.y = -theta;
  scene.rotation.x = -(Math.PI / 2 - phi);
}

export function updateMinimapAircraft(dataList) {
  if (!mounted || !acGroup) return;

  // Clear previous aircraft dots
  while (acGroup.children.length > 0) {
    const child = acGroup.children[0];
    acGroup.remove(child);
    if (child.material) child.material.dispose();
  }

  for (const data of dataList) {
    if (data.latitude == null || data.longitude == null) continue;

    let color = 0xffffff;
    if (data.verticalRate != null) {
      if (data.verticalRate > 1.5) color = 0xff9d4d;
      else if (data.verticalRate < -1.5) color = 0x4db8ff;
    }

    const mat = new THREE.SpriteMaterial({
      color: color,
      transparent: true,
      opacity: 0.85,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.08, 0.08, 1);
    const pos = latLonToSphere(data.latitude, data.longitude, GLOBE_RADIUS + 0.04);
    sprite.position.copy(pos);
    acGroup.add(sprite);
  }
}

export function updateMinimapUserPosition(lat, lon) {
  if (userDot) {
    userDot.position.copy(latLonToSphere(lat, lon, GLOBE_RADIUS + 0.05));
  }
}
