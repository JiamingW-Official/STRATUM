import * as THREE from 'three';

const TILE_SIZE = 256;

function lonToTileX(lon, z) {
  return Math.floor((lon + 180) / 360 * (1 << z));
}

function latToTileY(lat, z) {
  const latRad = lat * Math.PI / 180;
  return Math.floor(
    (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * (1 << z)
  );
}

function tileXToLon(x, z) {
  return x / (1 << z) * 360 - 180;
}

function tileYToLat(y, z) {
  const n = Math.PI - 2 * Math.PI * y / (1 << z);
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
}

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function loadTilesForRegion(centerLat, centerLon, halfDeg, zoom, maxTiles = 600) {
  const lonMin = centerLon - halfDeg;
  const lonMax = centerLon + halfDeg;
  const latMin = centerLat - halfDeg;
  const latMax = centerLat + halfDeg;

  const txMin = lonToTileX(lonMin, zoom);
  const txMax = lonToTileX(lonMax, zoom);
  const tyMin = latToTileY(latMax, zoom);
  const tyMax = latToTileY(latMin, zoom);

  const tilesX = txMax - txMin + 1;
  const tilesY = tyMax - tyMin + 1;
  const totalTiles = tilesX * tilesY;

  if (totalTiles > maxTiles) {
    console.warn(`[MapTiles] Skipping zoom ${zoom}: ${totalTiles} tiles exceeds ${maxTiles}`);
    return null;
  }

  const cw = tilesX * TILE_SIZE;
  const ch = tilesY * TILE_SIZE;

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#050d1a';
  ctx.fillRect(0, 0, cw, ch);

  const BATCH_SIZE = 24;
  const tasks = [];
  for (let ty = tyMin; ty <= tyMax; ty++) {
    for (let tx = txMin; tx <= txMax; tx++) {
      tasks.push({ tx, ty });
    }
  }

  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(({ tx, ty }) => {
      const px = (tx - txMin) * TILE_SIZE;
      const py = (ty - tyMin) * TILE_SIZE;
      const sub = 'abcd'[(tx + ty) % 4];
      const url = `https://${sub}.basemaps.cartocdn.com/dark_all/${zoom}/${tx}/${ty}@2x.png`;
      return loadImage(url).then((img) => {
        if (img) ctx.drawImage(img, px, py, TILE_SIZE, TILE_SIZE);
      });
    }));
  }

  const canvasLonMin = tileXToLon(txMin, zoom);
  const canvasLonMax = tileXToLon(txMax + 1, zoom);
  const canvasLatMax = tileYToLat(tyMin, zoom);
  const canvasLatMin = tileYToLat(tyMax + 1, zoom);

  return { canvas, canvasLonMin, canvasLonMax, canvasLatMin, canvasLatMax };
}

function createTextureFromRegion(result, lonMin, lonMax, latMin, latMax) {
  const texture = new THREE.CanvasTexture(result.canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const uOffset = (lonMin - result.canvasLonMin) / (result.canvasLonMax - result.canvasLonMin);
  const vOffset = (latMin - result.canvasLatMin) / (result.canvasLatMax - result.canvasLatMin);
  const uRepeat = (lonMax - lonMin) / (result.canvasLonMax - result.canvasLonMin);
  const vRepeat = (latMax - latMin) / (result.canvasLatMax - result.canvasLatMin);

  texture.offset.set(uOffset, vOffset);
  texture.repeat.set(uRepeat, vRepeat);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return texture;
}

/**
 * Progressive LOD map loading:
 * Phase 1: zoom 12 @2x (fast base)
 * Phase 2: zoom 14 @2x (full area, high detail)
 * Phase 3: zoom 16 @2x (center area, street-level detail)
 */
export async function loadMapTexture(centerLat, centerLon, degreesExtent, onUpgrade) {
  const half = degreesExtent / 2;
  const lonMin = centerLon - half;
  const lonMax = centerLon + half;
  const latMin = centerLat - half;
  const latMax = centerLat + half;

  // Phase 1: Zoom 10 @2x — fast base layer (~50 tiles for 2° extent)
  const lo = await loadTilesForRegion(centerLat, centerLon, half, 10);
  if (!lo) throw new Error('Failed to load base map tiles');
  const baseTexture = createTextureFromRegion(lo, lonMin, lonMax, latMin, latMax);

  if (onUpgrade) {
    loadHighResAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade);
  }

  return baseTexture;
}

async function loadHighResAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade) {
  try {
    // Phase 2: Zoom 12 — full area detail
    const mid = await loadTilesForRegion(centerLat, centerLon, half, 12, 1000);
    if (mid) {
      onUpgrade(createTextureFromRegion(mid, lonMin, lonMax, latMin, latMax));
    }

    // Phase 3: Zoom 14 — high detail, 0.3° around center
    const hiHalf = 0.3;
    const hiLonMin = centerLon - hiHalf;
    const hiLonMax = centerLon + hiHalf;
    const hiLatMin = centerLat - hiHalf;
    const hiLatMax = centerLat + hiHalf;
    const hi = await loadTilesForRegion(centerLat, centerLon, hiHalf, 14, 1200);
    if (hi) {
      onUpgrade(createTextureFromRegion(hi, hiLonMin, hiLonMax, hiLatMin, hiLatMax), {
        lonMin: hiLonMin, lonMax: hiLonMax, latMin: hiLatMin, latMax: hiLatMax,
      });
    }

    // Phase 4: Zoom 16 — street-level, 0.08° (~9km) around center
    const ultraHalf = 0.08;
    const uLonMin = centerLon - ultraHalf;
    const uLonMax = centerLon + ultraHalf;
    const uLatMin = centerLat - ultraHalf;
    const uLatMax = centerLat + ultraHalf;
    const ultra = await loadTilesForRegion(centerLat, centerLon, ultraHalf, 16, 1500);
    if (ultra) {
      onUpgrade(createTextureFromRegion(ultra, uLonMin, uLonMax, uLatMin, uLatMax), {
        lonMin: uLonMin, lonMax: uLonMax, latMin: uLatMin, latMax: uLatMax,
      });
    }
  } catch (err) {
    console.warn('[MapTiles] High-res load failed:', err.message);
  }
}
