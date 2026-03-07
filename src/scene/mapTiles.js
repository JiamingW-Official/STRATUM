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

/**
 * Load tiles at a specific zoom level for a geographic region.
 * Returns { canvas, lonMin, lonMax, latMin, latMax } or null on failure.
 */
async function loadTilesForRegion(centerLat, centerLon, halfDeg, zoom) {
  const lonMin = centerLon - halfDeg;
  const lonMax = centerLon + halfDeg;
  const latMin = centerLat - halfDeg;
  const latMax = centerLat + halfDeg;

  const txMin = lonToTileX(lonMin, zoom);
  const txMax = lonToTileX(lonMax, zoom);
  const tyMin = latToTileY(latMax, zoom); // north = smaller tile Y
  const tyMax = latToTileY(latMin, zoom); // south = larger tile Y

  const tilesX = txMax - txMin + 1;
  const tilesY = tyMax - tyMin + 1;
  const totalTiles = tilesX * tilesY;

  // Safety: cap at 400 tiles to prevent browser overload
  if (totalTiles > 400) {
    console.warn(`[MapTiles] Skipping zoom ${zoom}: ${totalTiles} tiles exceeds limit`);
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

  // Fetch all tiles in parallel with concurrency batching
  const BATCH_SIZE = 16;
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
      const url = `https://${sub}.basemaps.cartocdn.com/dark_all/${zoom}/${tx}/${ty}.png`;
      return loadImage(url).then((img) => {
        if (img) ctx.drawImage(img, px, py);
      });
    }));
  }

  // Geographic bounds of the full tile grid
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
 * Load map tiles with progressive LOD:
 * 1. Immediately returns zoom 8 texture (fast, ~64 tiles)
 * 2. Then async loads zoom 12 for center area and calls onUpgrade
 *
 * @param {number} centerLat
 * @param {number} centerLon
 * @param {number} degreesExtent - total degrees covered by ground plane
 * @param {function} onUpgrade - callback(texture) when higher-res tiles are ready
 * @returns {Promise<THREE.Texture>} initial low-res texture
 */
export async function loadMapTexture(centerLat, centerLon, degreesExtent, onUpgrade) {
  const half = degreesExtent / 2;
  const lonMin = centerLon - half;
  const lonMax = centerLon + half;
  const latMin = centerLat - half;
  const latMax = centerLat + half;

  // --- Phase 1: Zoom 8 (fast, full area) ---
  const lo = await loadTilesForRegion(centerLat, centerLon, half, 8);
  if (!lo) throw new Error('Failed to load base map tiles');
  const baseTexture = createTextureFromRegion(lo, lonMin, lonMax, latMin, latMax);

  // --- Phase 2: Zoom 12 (high detail, full area loaded in grid chunks) ---
  // Zoom 12 for the full 10-degree extent would be ~16k tiles — too many.
  // Instead, composite: zoom 10 for the full area, zoom 12 for center 2 degrees.
  if (onUpgrade) {
    loadHighResAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade);
  }

  return baseTexture;
}

async function loadHighResAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade) {
  try {
    // Step 1: Zoom 10 for full area (~250 tiles for 10 degrees)
    const mid = await loadTilesForRegion(centerLat, centerLon, half, 10);
    if (mid) {
      const midTexture = createTextureFromRegion(mid, lonMin, lonMax, latMin, latMax);
      onUpgrade(midTexture);
    }

    // Step 2: Zoom 12 composited onto mid-res canvas for center 3 degrees
    const hiHalf = 1.5; // ±1.5 degrees from center = 3-degree window
    const hi = await loadTilesForRegion(centerLat, centerLon, hiHalf, 12);
    if (hi && mid) {
      // Composite hi-res center onto mid-res full canvas
      const compositeCanvas = document.createElement('canvas');
      compositeCanvas.width = mid.canvas.width;
      compositeCanvas.height = mid.canvas.height;
      const ctx = compositeCanvas.getContext('2d');

      // Draw mid-res base
      ctx.drawImage(mid.canvas, 0, 0);

      // Calculate where center hi-res region maps onto mid canvas
      const hiLonMin = centerLon - hiHalf;
      const hiLonMax = centerLon + hiHalf;
      const hiLatMin = centerLat - hiHalf;
      const hiLatMax = centerLat + hiHalf;

      // Map geographic coords to pixel coords on mid canvas
      const midW = mid.canvasLonMax - mid.canvasLonMin;
      const midH = mid.canvasLatMax - mid.canvasLatMin;
      const px = (hi.canvasLonMin - mid.canvasLonMin) / midW * mid.canvas.width;
      const py = (1 - (hi.canvasLatMax - mid.canvasLatMin) / midH) * mid.canvas.height;
      const pw = (hi.canvasLonMax - hi.canvasLonMin) / midW * mid.canvas.width;
      const ph = (hi.canvasLatMax - hi.canvasLatMin) / midH * mid.canvas.height;

      ctx.drawImage(hi.canvas, px, py, pw, ph);

      const compositeResult = {
        canvas: compositeCanvas,
        canvasLonMin: mid.canvasLonMin,
        canvasLonMax: mid.canvasLonMax,
        canvasLatMin: mid.canvasLatMin,
        canvasLatMax: mid.canvasLatMax,
      };
      const finalTexture = createTextureFromRegion(compositeResult, lonMin, lonMax, latMin, latMax);
      onUpgrade(finalTexture);
    }
  } catch (err) {
    console.warn('[MapTiles] High-res load failed:', err.message);
  }
}
