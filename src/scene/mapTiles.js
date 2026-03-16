import * as THREE from 'three';

const TILE_SIZE = 256;

// ── Abort controller for canceling stale city loads ──
let _abortCtrl = null;

export function abortMapLoads() {
  if (_abortCtrl) { _abortCtrl.abort(); _abortCtrl = null; }
}

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

function loadImage(url, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) { resolve(null); return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    if (signal) {
      signal.addEventListener('abort', () => {
        img.src = ''; // cancel in-flight download
        resolve(null);
      }, { once: true });
    }
    img.src = url;
  });
}

async function loadTilesForRegion(centerLat, centerLon, halfDeg, zoom, maxTiles = 600, signal) {
  if (signal?.aborted) return null;

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

  const tasks = [];
  for (let ty = tyMin; ty <= tyMax; ty++) {
    for (let tx = txMin; tx <= txMax; tx++) {
      tasks.push({ tx, ty });
    }
  }

  // Launch all tile fetches concurrently — browser handles connection pooling.
  await Promise.all(tasks.map(({ tx, ty }) => {
    if (signal?.aborted) return Promise.resolve();
    const px = (tx - txMin) * TILE_SIZE;
    const py = (ty - tyMin) * TILE_SIZE;
    const sub = 'abcd'[(tx + ty) % 4];
    const url = `https://${sub}.basemaps.cartocdn.com/dark_all/${zoom}/${tx}/${ty}@2x.png`;
    return loadImage(url, signal).then((img) => {
      if (img && !signal?.aborted) ctx.drawImage(img, px, py, TILE_SIZE, TILE_SIZE);
    });
  }));

  if (signal?.aborted) return null;

  const canvasLonMin = tileXToLon(txMin, zoom);
  const canvasLonMax = tileXToLon(txMax + 1, zoom);
  const canvasLatMax = tileYToLat(tyMin, zoom);
  const canvasLatMin = tileYToLat(tyMax + 1, zoom);

  return { canvas, canvasLonMin, canvasLonMax, canvasLatMin, canvasLatMax };
}

function createTextureFromRegion(result, lonMin, lonMax, latMin, latMax) {
  const texture = new THREE.CanvasTexture(result.canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;

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
 * Phase 0: zoom 8 — instant preview
 * Phase 1: zoom 10 — sharper base
 * Phase 2-5: zoom 12-16 — progressive hi-res center
 * All phases abortable on city switch.
 */
export async function loadMapTexture(centerLat, centerLon, degreesExtent, onUpgrade) {
  // Abort any previous load
  abortMapLoads();
  _abortCtrl = new AbortController();
  const signal = _abortCtrl.signal;

  const half = degreesExtent / 2;
  const lonMin = centerLon - half;
  const lonMax = centerLon + half;
  const latMin = centerLat - half;
  const latMax = centerLat + half;

  // Phase 0: Zoom 8 @2x — instant preview (~6 tiles, <200ms)
  const preview = await loadTilesForRegion(centerLat, centerLon, half, 8, 600, signal);
  if (signal.aborted) return null;

  const baseTexture = preview
    ? createTextureFromRegion(preview, lonMin, lonMax, latMin, latMax)
    : null;

  if (onUpgrade || !baseTexture) {
    loadProgressiveAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade, signal);
  }

  if (!baseTexture) {
    const lo = await loadTilesForRegion(centerLat, centerLon, half, 10, 600, signal);
    if (signal.aborted) return null;
    if (!lo) throw new Error('Failed to load base map tiles');
    return createTextureFromRegion(lo, lonMin, lonMax, latMin, latMax);
  }

  return baseTexture;
}

async function loadProgressiveAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade, signal) {
  try {
    // Phase 1: Zoom 10 — sharper base (~50 tiles)
    const r1 = await loadTilesForRegion(centerLat, centerLon, half, 10, 600, signal);
    if (signal.aborted) return;
    if (r1 && onUpgrade) {
      onUpgrade(createTextureFromRegion(r1, lonMin, lonMax, latMin, latMax), null);
    }

    // Phase 2+: hi-res overlays
    loadHighResAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade, signal);
  } catch (err) {
    if (!signal.aborted) console.warn('[MapTiles] Progressive load failed:', err.message);
  }
}

async function loadHighResAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade, signal) {
  try {
    // Phase 2: Zoom 12, 1° half
    const h2 = Math.min(half, 1.0);
    const r2 = await loadTilesForRegion(centerLat, centerLon, h2, 12, 1000, signal);
    if (signal.aborted) return;
    if (r2) {
      onUpgrade(createTextureFromRegion(r2, centerLon - h2, centerLon + h2, centerLat - h2, centerLat + h2), {
        lonMin: centerLon - h2, lonMax: centerLon + h2, latMin: centerLat - h2, latMax: centerLat + h2,
      });
    }

    // Phase 3: Zoom 13, 0.55° half
    const h3 = 0.55;
    const r3 = await loadTilesForRegion(centerLat, centerLon, h3, 13, 1000, signal);
    if (signal.aborted) return;
    if (r3) {
      onUpgrade(createTextureFromRegion(r3, centerLon - h3, centerLon + h3, centerLat - h3, centerLat + h3), {
        lonMin: centerLon - h3, lonMax: centerLon + h3, latMin: centerLat - h3, latMax: centerLat + h3,
      });
    }

    // Phase 4: Zoom 14, 0.35° half
    const h4 = 0.35;
    const r4 = await loadTilesForRegion(centerLat, centerLon, h4, 14, 2000, signal);
    if (signal.aborted) return;
    if (r4) {
      onUpgrade(createTextureFromRegion(r4, centerLon - h4, centerLon + h4, centerLat - h4, centerLat + h4), {
        lonMin: centerLon - h4, lonMax: centerLon + h4, latMin: centerLat - h4, latMax: centerLat + h4,
      });
    }

    // Phase 5: Zoom 16, 0.12° half — street level center
    const h5 = 0.12;
    const r5 = await loadTilesForRegion(centerLat, centerLon, h5, 16, 2000, signal);
    if (signal.aborted) return;
    if (r5) {
      onUpgrade(createTextureFromRegion(r5, centerLon - h5, centerLon + h5, centerLat - h5, centerLat + h5), {
        lonMin: centerLon - h5, lonMax: centerLon + h5, latMin: centerLat - h5, latMax: centerLat + h5,
      });
    }
  } catch (err) {
    if (!signal.aborted) console.warn('[MapTiles] High-res load failed:', err.message);
  }
}
