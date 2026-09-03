import * as THREE from "three";

const TILE_SIZE = 256;

// ── Basemap provider ──
// CARTO stamps "API KEY REQUIRED" into every keyless tile, so it is only used
// when a key is configured. Esri's dark canvas is unstamped and keyless, and it
// is the only free source that tolerates this app's per-city tile volume
// (Stadia's keyless tier rejects it), but its palette is a flat mid-gray —
// `grade` pulls it onto CARTO dark_all's near-black so both look the same.
const CARTO_KEY = import.meta.env.VITE_CARTO_API_KEY || "";

const PROVIDERS = {
  carto: {
    url: (z, x, y) =>
      `https://${"abcd"[(x + y) % 4]}.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}@2x.png?api_key=${CARTO_KEY}`,
    grade: null,
  },
  esri: {
    url: (z, x, y) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/${z}/${y}/${x}`,
    // MapServer can rasterise an arbitrary bbox in one request. Stitching the
    // same ground from 256px tiles costs hundreds of round trips, which is ruinous
    // behind a proxy where per-connection overhead dwarfs transfer time.
    exportUrl: (mercBbox, w, h) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/export` +
      `?bbox=${mercBbox.join(",")}&bboxSR=102100&imageSR=102100&size=${w},${h}` +
      `&format=png&transparent=false&f=image`,
    // Measured against CARTO dark_all: Esri's land fill sits at luma 71 and its
    // brightest roads at ~104, so the curve maps 71 -> 9 and 100+ -> ~150.
    // The knee at `land` keeps landuse fills from lifting off the background
    // the way a single gamma curve over the whole range makes them.
    grade: {
      floor: 26,
      land: 70,
      white: 100,
      lift: 9,
      gamma: 2.1,
      gain: 0.57,
      tint: [0.88, 0.95, 1.16],
    },
  },
};

const PROVIDER = PROVIDERS[CARTO_KEY ? "carto" : "esri"];

function buildGradeLut({ floor, land, white, lift, gamma, gain, tint }) {
  const lut = [new Uint8Array(256), new Uint8Array(256), new Uint8Array(256)];
  for (let l = 0; l < 256; l++) {
    const v =
      l <= land
        ? (lift * Math.max(0, l - floor)) / (land - floor)
        : lift +
          (255 - lift) *
            Math.pow(Math.min(1, (l - land) / (white - land)), gamma) *
            gain;
    for (let k = 0; k < 3; k++) lut[k][l] = Math.min(255, v * tint[k]);
  }
  return lut;
}

const GRADE_LUT = PROVIDER.grade ? buildGradeLut(PROVIDER.grade) : null;

// Reused scratch tile — grading runs synchronously between load and draw,
// so one buffer serves every concurrent tile fetch.
let _scratch = null;
let _scratchCtx = null;

function gradeCanvas(ctx, w, h) {
  const data = ctx.getImageData(0, 0, w, h);
  const p = data.data;
  const [lr, lg, lb] = GRADE_LUT;
  for (let i = 0; i < p.length; i += 4) {
    const l = (p[i] * 77 + p[i + 1] * 150 + p[i + 2] * 29) >> 8;
    p[i] = lr[l];
    p[i + 1] = lg[l];
    p[i + 2] = lb[l];
  }
  ctx.putImageData(data, 0, 0);
}

function gradeTile(img) {
  if (!_scratch) {
    _scratch = document.createElement("canvas");
    _scratch.width = TILE_SIZE;
    _scratch.height = TILE_SIZE;
    _scratchCtx = _scratch.getContext("2d", { willReadFrequently: true });
  }
  _scratchCtx.drawImage(img, 0, 0, TILE_SIZE, TILE_SIZE);
  gradeCanvas(_scratchCtx, TILE_SIZE, TILE_SIZE);
  return _scratch;
}

// ── Abort controller for canceling stale city loads ──
let _abortCtrl = null;

export function abortMapLoads() {
  if (_abortCtrl) {
    _abortCtrl.abort();
    _abortCtrl = null;
  }
}

function lonToTileX(lon, z) {
  return Math.floor(((lon + 180) / 360) * (1 << z));
}

function latToTileY(lat, z) {
  const latRad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      (1 << z),
  );
}

function tileXToLon(x, z) {
  return (x / (1 << z)) * 360 - 180;
}

function tileYToLat(y, z) {
  const n = Math.PI - (2 * Math.PI * y) / (1 << z);
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
}

function loadImage(url, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    if ("fetchPriority" in img) img.fetchPriority = "low";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    if (signal) {
      signal.addEventListener(
        "abort",
        () => {
          img.src = ""; // cancel in-flight download
          resolve(null);
        },
        { once: true },
      );
    }
    img.src = url;
  });
}

const MERC_MAX = 20037508.34;
const lonToMerc = (lon) => (lon * MERC_MAX) / 180;
const latToMerc = (lat) =>
  (Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)) *
  (MERC_MAX / 180);

// Longest edge of a single rasterised region. 2048 costs one ~10s request; the
// tiled equivalent is several hundred requests for the same ground.
const EXPORT_MAX_PX = 2048;
const EXPORT_BASE_PX = 1024;
const EXPORT_PREVIEW_PX = 512;

// Same return shape as loadTilesForRegion, so callers do not care which path ran.
// Like the tiled path, this treats the image as linear in latitude across the
// region — an approximation that stays sub-pixel at these extents.
async function loadRegionViaExport(
  centerLat,
  centerLon,
  halfDeg,
  signal,
  maxPx,
) {
  if (signal?.aborted) return null;

  const lonMin = centerLon - halfDeg;
  const lonMax = centerLon + halfDeg;
  const latMin = centerLat - halfDeg;
  const latMax = centerLat + halfDeg;

  const bbox = [
    lonToMerc(lonMin),
    latToMerc(latMin),
    lonToMerc(lonMax),
    latToMerc(latMax),
  ];
  const mercW = bbox[2] - bbox[0];
  const mercH = bbox[3] - bbox[1];
  const scale = (maxPx || EXPORT_MAX_PX) / Math.max(mercW, mercH);
  const w = Math.max(1, Math.round(mercW * scale));
  const h = Math.max(1, Math.round(mercH * scale));

  const img = await loadImage(PROVIDER.exportUrl(bbox, w, h), signal);
  if (!img || signal?.aborted) return null;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: !!GRADE_LUT });
  ctx.fillStyle = "#050d1a";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  if (GRADE_LUT) gradeCanvas(ctx, w, h);

  return {
    canvas,
    canvasLonMin: lonMin,
    canvasLonMax: lonMax,
    canvasLatMin: latMin,
    canvasLatMax: latMax,
  };
}

async function loadTilesForRegion(
  centerLat,
  centerLon,
  halfDeg,
  zoom,
  maxTiles = 600,
  signal,
) {
  if (PROVIDER.exportUrl) {
    // Rasterised regions have no tile pyramid, so `zoom` only decides how large
    // an image to ask for — and rasterising time scales with pixel count, not
    // ground area (2048px ≈ 10s, 1024px ≈ 3.8s, both with ~3s of fixed overhead).
    // Only the detail rings pay for 2048: the full-area pass is the backdrop
    // behind them, so a mid-size image there puts real ground under the camera
    // seconds earlier, and the preview stays small for first paint.
    return loadRegionViaExport(
      centerLat,
      centerLon,
      halfDeg,
      signal,
      zoom <= 8
        ? EXPORT_PREVIEW_PX
        : zoom <= 11
          ? EXPORT_BASE_PX
          : EXPORT_MAX_PX,
    );
  }
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
    console.warn(
      `[MapTiles] Skipping zoom ${zoom}: ${totalTiles} tiles exceeds ${maxTiles}`,
    );
    return null;
  }

  const cw = tilesX * TILE_SIZE;
  const ch = tilesY * TILE_SIZE;

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#050d1a";
  ctx.fillRect(0, 0, cw, ch);

  const tasks = [];
  for (let ty = tyMin; ty <= tyMax; ty++) {
    for (let tx = txMin; tx <= txMax; tx++) {
      tasks.push({ tx, ty });
    }
  }

  // Launch all tile fetches concurrently — browser handles connection pooling.
  await Promise.all(
    tasks.map(({ tx, ty }) => {
      if (signal?.aborted) return Promise.resolve();
      const px = (tx - txMin) * TILE_SIZE;
      const py = (ty - tyMin) * TILE_SIZE;
      return loadImage(PROVIDER.url(zoom, tx, ty), signal).then((img) => {
        if (!img || signal?.aborted) return;
        ctx.drawImage(
          GRADE_LUT ? gradeTile(img) : img,
          px,
          py,
          TILE_SIZE,
          TILE_SIZE,
        );
      });
    }),
  );

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
  // The camera looks across the ground at a shallow angle, which squeezes
  // texels in the distance; 16x anisotropy is what keeps the middle distance
  // legible, and the GPU clamps it if it cannot.
  texture.anisotropy = 16;

  const uOffset =
    (lonMin - result.canvasLonMin) /
    (result.canvasLonMax - result.canvasLonMin);
  const vOffset =
    (latMin - result.canvasLatMin) /
    (result.canvasLatMax - result.canvasLatMin);
  const uRepeat =
    (lonMax - lonMin) / (result.canvasLonMax - result.canvasLonMin);
  const vRepeat =
    (latMax - latMin) / (result.canvasLatMax - result.canvasLatMin);

  texture.offset.set(uOffset, vOffset);
  texture.repeat.set(uRepeat, vRepeat);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return texture;
}

/**
 * Progressive LOD map loading:
 * Phase 0: zoom 8 — instant preview
 * Phase 1: zoom 11 — sharper full-area base
 * Phase 2+: DETAIL_LEVELS — hi-res rings over the centre
 * All phases abortable on city switch.
 */
export async function loadMapTexture(
  centerLat,
  centerLon,
  degreesExtent,
  onUpgrade,
) {
  // Abort any previous load
  abortMapLoads();
  _abortCtrl = new AbortController();
  const signal = _abortCtrl.signal;

  const half = degreesExtent / 2;
  const lonMin = centerLon - half;
  const lonMax = centerLon + half;
  const latMin = centerLat - half;
  const latMax = centerLat + half;

  // Phase 0: the cheap preview that gives first paint.
  const previewPromise = loadTilesForRegion(
    centerLat,
    centerLon,
    half,
    8,
    600,
    signal,
  );

  // Start every refinement now rather than after the preview resolves. On the
  // rasterised path each is one request and the server parallelises them almost
  // for free — five 2048px exports finish in 12s against 10s for a single one —
  // so waiting for one before starting the next was adding its whole latency to
  // the total for no benefit.
  if (onUpgrade) {
    loadProgressiveAsync(
      centerLat,
      centerLon,
      half,
      lonMin,
      lonMax,
      latMin,
      latMax,
      onUpgrade,
      signal,
    );
  }

  const preview = await previewPromise;
  if (signal.aborted) return null;

  if (!preview) {
    // No preview: fall back to the full-area pass for the initial texture. With
    // onUpgrade present that pass is already in flight above and will paint on
    // its own, so this only matters for callers that want a texture returned.
    const lo = await loadTilesForRegion(
      centerLat,
      centerLon,
      half,
      11,
      600,
      signal,
    );
    if (signal.aborted) return null;
    if (!lo) throw new Error("Failed to load base map tiles");
    return createTextureFromRegion(lo, lonMin, lonMax, latMin, latMax);
  }

  return createTextureFromRegion(preview, lonMin, lonMax, latMin, latMax);
}

async function loadProgressiveAsync(
  centerLat,
  centerLon,
  half,
  lonMin,
  lonMax,
  latMin,
  latMax,
  onUpgrade,
  signal,
) {
  try {
    // Full-area refinement and the detail rings go out together; only the order
    // in which their results are applied matters, since each ring is layered on
    // top of the last.
    const basePromise = loadTilesForRegion(
      centerLat,
      centerLon,
      half,
      11,
      600,
      signal,
    );
    const rings = startHighResFetches(centerLat, centerLon, half, signal);

    const r1 = await basePromise;
    if (signal.aborted) return;
    if (r1 && onUpgrade) {
      onUpgrade(
        createTextureFromRegion(r1, lonMin, lonMax, latMin, latMax),
        null,
      );
    }

    await applyHighRes(rings, centerLat, centerLon, onUpgrade, signal);

    // Outside the detail rings the ground was a 2048px export of the whole
    // 445km area -- 290m a pixel, stretched two and a half times across a
    // screen at the default framing. The server caps an export at 4096, so
    // spending that on the whole area only halves the blur. Spent on the
    // 200km disc the camera actually frames it is 49m a pixel, the same as the
    // first detail ring. Fetched after the rings, laid *under* them so the
    // sharper airport imagery stays on top, cached by the service worker. Not
    // on small screens or under save-data.
    const wantSharp =
      !signal.aborted &&
      window.innerWidth >= 900 &&
      !(navigator.connection && navigator.connection.saveData);
    if (wantSharp && onUpgrade) {
      const hd = 0.9;
      const r2 = await loadRegionViaExport(centerLat, centerLon, hd, signal, 4096);
      if (r2 && !signal.aborted) {
        const b = { lonMin: centerLon - hd, lonMax: centerLon + hd, latMin: centerLat - hd, latMax: centerLat + hd, under: 1 };
        onUpgrade(createTextureFromRegion(r2, b.lonMin, b.lonMax, b.latMin, b.latMax), b);
      }

      // Then the surroundings proper. One export is capped at 4096, so the
      // 78km square around the airport is fetched as a 3x3 mosaic of 2048s:
      // 26km a tile, about 13m a pixel -- four times the disc. Three at a
      // time, each laid in as it lands, above the disc and below the rings,
      // all after the visitor already has a map. About 4MB, once per city.
      const mh = 0.35, n = 3, step = (2 * mh) / n;
      const tiles = [];
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const cLon = centerLon - mh + step * (i + 0.5), cLat = centerLat - mh + step * (j + 0.5);
        tiles.push({ cLon, cLat, d: Math.hypot(i - (n - 1) / 2, j - (n - 1) / 2) });
      }
      tiles.sort((a, b) => a.d - b.d); // centre first
      let idx = 0;
      const worker = async () => {
        while (idx < tiles.length && !signal.aborted) {
          const t = tiles[idx++];
          const r = await loadRegionViaExport(t.cLat, t.cLon, step / 2, signal, 2048);
          if (!r || signal.aborted) continue;
          const b = { lonMin: t.cLon - step / 2, lonMax: t.cLon + step / 2, latMin: t.cLat - step / 2, latMax: t.cLat + step / 2, under: 2 };
          onUpgrade(createTextureFromRegion(r, b.lonMin, b.lonMax, b.latMin, b.latMax), b);
        }
      };
      await Promise.all([worker(), worker(), worker()]);
    }
  } catch (err) {
    if (!signal.aborted)
      console.warn("[MapTiles] Progressive load failed:", err.message);
  }
}

// Detail rings layered over the full-area base, each tighter and therefore sharper
// than the last. On the rasterised path every ring is a single request, so the
// bottom ring can go tight enough to stay crisp at ground level — roughly 3m per
// pixel, which is about all the source has. The old tiled ladder could not afford
// this: it cost ~4300 requests per city and its sharpest ring still worked out to
// ~12m per pixel because the tightest level always blew past its own tile cap.
const DETAIL_LEVELS = [
  { zoom: 13, half: 0.45, maxTiles: 700 },
  { zoom: 15, half: 0.11, maxTiles: 700 },
  { zoom: 16, half: 0.03, maxTiles: 700 },
];

// Rasterised rings are one request each, so they all go out immediately and only
// their application is ordered. The tiled path stays lazy — overlapping it would
// put thousands of tile requests in flight at once — so it hands back thunks.
function startHighResFetches(centerLat, centerLon, half, signal) {
  const overlap = !!PROVIDER.exportUrl;
  return DETAIL_LEVELS.map((level) => {
    const h = Math.min(half, level.half);
    const start = () =>
      loadTilesForRegion(
        centerLat,
        centerLon,
        h,
        level.zoom,
        level.maxTiles,
        signal,
      );
    return { h, pending: overlap ? start() : start, overlap };
  });
}

async function applyHighRes(rings, centerLat, centerLon, onUpgrade, signal) {
  try {
    for (const entry of rings) {
      const h = entry.h;
      const region = await (entry.overlap ? entry.pending : entry.pending());
      if (signal.aborted) return;
      if (!region) continue;
      const bounds = {
        lonMin: centerLon - h,
        lonMax: centerLon + h,
        latMin: centerLat - h,
        latMax: centerLat + h,
      };
      onUpgrade(
        createTextureFromRegion(
          region,
          bounds.lonMin,
          bounds.lonMax,
          bounds.latMin,
          bounds.latMax,
        ),
        bounds,
      );
    }
  } catch (err) {
    if (!signal.aborted)
      console.warn("[MapTiles] High-res load failed:", err.message);
  }
}
