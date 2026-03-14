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

    const tasks = [];
  for (let ty = tyMin; ty <= tyMax; ty++) {
    for (let tx = txMin; tx <= txMax; tx++) {
      tasks.push({ tx, ty });
    }
  }

  // Launch all tile fetches concurrently — browser handles connection pooling.
  // Sequential batching was creating unnecessary multi-RTT delays.
  await Promise.all(tasks.map(({ tx, ty }) => {
    const px = (tx - txMin) * TILE_SIZE;
    const py = (ty - tyMin) * TILE_SIZE;
    const sub = 'abcd'[(tx + ty) % 4];
    const url = `https://${sub}.basemaps.cartocdn.com/dark_all/${zoom}/${tx}/${ty}@2x.png`;
    return loadImage(url).then((img) => {
      if (img) ctx.drawImage(img, px, py, TILE_SIZE, TILE_SIZE);
    });
  }));

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

  // Phase 0: Zoom 8 @2x — instant preview (~6 tiles, <200ms)
  const preview = await loadTilesForRegion(centerLat, centerLon, half, 8);
  const baseTexture = preview
    ? createTextureFromRegion(preview, lonMin, lonMax, latMin, latMax)
    : null;

  if (onUpgrade || !baseTexture) {
    // Phase 1+: Zoom 10 → 12 → ... progressive upgrades in background
    loadProgressiveAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade);
  }

  if (!baseTexture) {
    // Fallback: wait for zoom 10 if zoom 8 somehow failed
    const lo = await loadTilesForRegion(centerLat, centerLon, half, 10);
    if (!lo) throw new Error('Failed to load base map tiles');
    return createTextureFromRegion(lo, lonMin, lonMax, latMin, latMax);
  }

  return baseTexture;
}

async function loadProgressiveAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade) {
  try {
    // Phase 1: Zoom 10 — sharper base (~50 tiles)
    const r1 = await loadTilesForRegion(centerLat, centerLon, half, 10);
    if (r1 && onUpgrade) {
      onUpgrade(createTextureFromRegion(r1, lonMin, lonMax, latMin, latMax), null);
    }

    // Phase 2+: hi-res overlays
    loadHighResAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade);
  } catch (err) {
    console.warn('[MapTiles] Progressive load failed:', err.message);
  }
}

async function loadHighResAsync(centerLat, centerLon, half, lonMin, lonMax, latMin, latMax, onUpgrade) {
  try {
    // Phase 2: Zoom 12, 1° half — covers inner 2°×2° area (~529 tiles, feasible)
    // Outer ring stays at zoom 10 but scene fog hides it at the edges
    const h2 = Math.min(half, 1.0);
    const r2 = await loadTilesForRegion(centerLat, centerLon, h2, 12, 1000);
    if (r2) {
      onUpgrade(createTextureFromRegion(r2, centerLon - h2, centerLon + h2, centerLat - h2, centerLat + h2), {
        lonMin: centerLon - h2, lonMax: centerLon + h2, latMin: centerLat - h2, latMax: centerLat + h2,
      });
    }

    // Phase 3: Zoom 13, 0.55° half — ~25×25 = 625 tiles
    const h3 = 0.55;
    const r3 = await loadTilesForRegion(centerLat, centerLon, h3, 13, 1000);
    if (r3) {
      onUpgrade(createTextureFromRegion(r3, centerLon - h3, centerLon + h3, centerLat - h3, centerLat + h3), {
        lonMin: centerLon - h3, lonMax: centerLon + h3, latMin: centerLat - h3, latMax: centerLat + h3,
      });
    }

    // Phase 4: Zoom 14, 0.35° half — ~32×32 = 1024 tiles
    const h4 = 0.35;
    const r4 = await loadTilesForRegion(centerLat, centerLon, h4, 14, 2000);
    if (r4) {
      onUpgrade(createTextureFromRegion(r4, centerLon - h4, centerLon + h4, centerLat - h4, centerLat + h4), {
        lonMin: centerLon - h4, lonMax: centerLon + h4, latMin: centerLat - h4, latMax: centerLat + h4,
      });
    }

    // Phase 5: Zoom 16, 0.12° half — street level center
    const h5 = 0.12;
    const r5 = await loadTilesForRegion(centerLat, centerLon, h5, 16, 2000);
    if (r5) {
      onUpgrade(createTextureFromRegion(r5, centerLon - h5, centerLon + h5, centerLat - h5, centerLat + h5), {
        lonMin: centerLon - h5, lonMax: centerLon + h5, latMin: centerLat - h5, latMax: centerLat + h5,
      });
    }
  } catch (err) {
    console.warn('[MapTiles] High-res load failed:', err.message);
  }
}
