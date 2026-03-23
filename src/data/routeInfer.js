/**
 * routeInfer.js — 本地起降机场推断引擎
 *
 * 分层推断 + 本地缓存 + 按需计算
 * 不依赖任何付费航班 API，利用 callsign + 轨迹 + 本地机场库进行概率推断
 *
 * 评分维度：
 *  - 距离分（distance）: 候选机场与轨迹点的距离
 *  - 航向分（heading）: 航向与机场方向的一致性
 *  - 轨迹连续性分（trajectory）: 多个轨迹点是否指向同一机场
 *  - 飞行阶段分（phase）: 高度/垂直速率是否符合起飞/降落特征
 */

const DEG_TO_RAD = Math.PI / 180;
const METERS_TO_FEET = 3.28084;

// ── 配置 ─────────────────────────────────────────────────────────────────────
const ORIGIN_SEARCH_RADIUS_KM = 30;       // 起飞阶段搜索半径
const DEST_SEARCH_RADIUS_KM = 50;         // 降落阶段搜索半径
const ORIGIN_ALT_THRESHOLD_FT = 8000;     // 低于此高度才考虑起飞匹配
const DEST_ALT_THRESHOLD_FT = 12000;      // 低于此高度才考虑降落匹配
const CLIMB_RATE_THRESHOLD = 2.0;         // m/s, 爬升率阈值
const DESCENT_RATE_THRESHOLD = -2.0;      // m/s, 下降率阈值
const MIN_SCORE_THRESHOLD = 0.42;         // 最低综合得分阈值（≥0.42 减少误判）
const DEST_CONFIRM_COUNT = 3;             // destination 需要连续 N 次指向同一机场
const CACHE_TTL = 12 * 3600 * 1000;       // 推断缓存 12 小时
const POS_HISTORY_MAX = 120;              // 每架飞机最多保留 120 个位置（约 6 分钟 @ 3s）
const POS_HISTORY_RETENTION = 60 * 60000; // 轨迹保留 60 分钟
const LOG_INFER = false;                  // 是否在 console 输出推断日志

// ── 机场空间索引 ─────────────────────────────────────────────────────────────
// 按 1° 网格分桶，支持快速近邻查询

let _airports = [];        // {code, icao, lat, lon, name, country}
const _grid = new Map();   // "latBucket,lonBucket" → [airport index, ...]
const _gridRes = 1;        // 度

/**
 * 初始化机场库
 * @param {Array} cities - CITIES 数组，每项含 {code, lat, lon, name, country}
 * @param {Object} airportData - AIRPORT_DATA 对象，code → {icao, ...}
 */
export function initRouteInfer(cities, airportData = {}) {
  _airports = cities.map(c => ({
    code: c.code,
    icao: airportData[c.code]?.icao || c.code,
    lat: c.lat,
    lon: c.lon,
    name: c.name,
    country: c.country || '',
  }));

  // 建立空间索引
  _grid.clear();
  for (let i = 0; i < _airports.length; i++) {
    const a = _airports[i];
    const key = `${Math.floor(a.lat / _gridRes)},${Math.floor(a.lon / _gridRes)}`;
    if (!_grid.has(key)) _grid.set(key, []);
    _grid.get(key).push(i);
  }

  if (LOG_INFER) console.log(`[RouteInfer] 初始化完成: ${_airports.length} 个机场, ${_grid.size} 个网格桶`);
}

/**
 * 查询半径内的机场
 * @returns {Array<{airport, dist}>} 按距离排序
 */
function findNearbyAirports(lat, lon, radiusKm) {
  const results = [];
  const cellRange = Math.ceil(radiusKm / 111) + 1; // 1° ≈ 111 km
  const latB = Math.floor(lat / _gridRes);
  const lonB = Math.floor(lon / _gridRes);

  for (let dy = -cellRange; dy <= cellRange; dy++) {
    for (let dx = -cellRange; dx <= cellRange; dx++) {
      const key = `${latB + dy},${lonB + dx}`;
      const bucket = _grid.get(key);
      if (!bucket) continue;
      for (const idx of bucket) {
        const a = _airports[idx];
        const d = haversineKm(lat, lon, a.lat, a.lon);
        if (d <= radiusKm) {
          results.push({ airport: a, dist: d, idx });
        }
      }
    }
  }

  results.sort((a, b) => a.dist - b.dist);
  return results;
}

// ── Haversine 距离 ───────────────────────────────────────────────────────────

function haversineKm(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * 计算从 (lat1,lon1) 到 (lat2,lon2) 的方位角（度，0-360）
 */
function bearing(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const y = Math.sin(dLon) * Math.cos(lat2 * DEG_TO_RAD);
  const x =
    Math.cos(lat1 * DEG_TO_RAD) * Math.sin(lat2 * DEG_TO_RAD) -
    Math.sin(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

/**
 * 两个角度（度）之间的最小差值 (0-180)
 */
function angleDiff(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// ── Callsign 解析 ────────────────────────────────────────────────────────────

// ICAO 航司三字母代码 → 主要运营区域提示（用于增强候选过滤，非强绑定）
const AIRLINE_REGIONS = {
  UAL: 'Americas', AAL: 'Americas', DAL: 'Americas', SWA: 'Americas',
  JBU: 'Americas', NKS: 'Americas', FFT: 'Americas', ASA: 'Americas',
  SKW: 'Americas', RPA: 'Americas', ENY: 'Americas', PDT: 'Americas',
  BAW: 'Europe', EZY: 'Europe', RYR: 'Europe', DLH: 'Europe',
  AFR: 'Europe', KLM: 'Europe', SAS: 'Europe', FIN: 'Europe',
  AZA: 'Europe', IBE: 'Europe', VLG: 'Europe', SWR: 'Europe',
  AUA: 'Europe', TAP: 'Europe', LOT: 'Europe', WZZ: 'Europe',
  THY: 'Europe', AFL: 'Europe', EIN: 'Europe',
  UAE: 'Middle East', QTR: 'Middle East', ETD: 'Middle East',
  SVA: 'Middle East', MEA: 'Middle East', GIA: 'Middle East',
  SIA: 'Asia', CPA: 'Asia', ANA: 'Asia', JAL: 'Asia',
  KAL: 'Asia', AAR: 'Asia', CCA: 'Asia', CES: 'Asia',
  CSN: 'Asia', HVN: 'Asia', THA: 'Asia', MAS: 'Asia',
  AXM: 'Asia', CEB: 'Asia', IGO: 'Asia', AIC: 'Asia',
  QFA: 'Pacific', ANZ: 'Pacific', VOZ: 'Pacific', JST: 'Pacific',
  AVA: 'Americas', LAN: 'Americas', GLO: 'Americas', AZU: 'Americas',
  AMX: 'Americas', CMP: 'Americas',
  ETH: 'Africa', SAA: 'Africa', KQA: 'Africa', MSR: 'Africa',
  RAM: 'Africa',
};

/**
 * 解析 callsign → {airline, flightNum}
 * 例: "UAL1234" → {airline: "UAL", flightNum: "1234"}
 */
function parseCallsign(callsign) {
  if (!callsign || callsign.length < 4) return null;
  const match = callsign.match(/^([A-Z]{2,3})(\d{1,5})/);
  if (!match) return null;
  return {
    airline: match[1],
    flightNum: match[2],
    region: AIRLINE_REGIONS[match[1]] || null,
  };
}

// ── 位置历史管理 ──────────────────────────────────────────────────────────────

// icao24 → {positions: [{lat, lon, altFt, vRate, heading, ts}], ...}
const _posHistory = new Map();

/**
 * 记录飞机位置更新（每次 API poll 时调用）
 */
export function recordPosition(icao24, data) {
  if (!data.latitude || !data.longitude) return;
  const altFt = data.baroAltitude != null ? data.baroAltitude * METERS_TO_FEET : null;

  let entry = _posHistory.get(icao24);
  if (!entry) {
    entry = {
      positions: [],
      callsign: data.callsign || null,
      originLocked: false,
      destLocked: false,
      destCandidateCode: null,
      destCandidateCount: 0,
      lastInferTime: 0,
    };
    _posHistory.set(icao24, entry);
  }

  // 更新 callsign（可能在后续 poll 中才出现）
  if (data.callsign && data.callsign.length >= 3) {
    entry.callsign = data.callsign;
  }

  entry.positions.push({
    lat: data.latitude,
    lon: data.longitude,
    altFt,
    vRate: data.verticalRate || 0,
    heading: data.trueTrack != null ? data.trueTrack : null,
    gs: data.velocity || 0, // m/s
    ts: Date.now(),
  });

  // 限制历史长度
  if (entry.positions.length > POS_HISTORY_MAX) {
    entry.positions.splice(0, entry.positions.length - POS_HISTORY_MAX);
  }

  // 清理过期数据（超过 60 分钟的位置）
  const cutoff = Date.now() - POS_HISTORY_RETENTION;
  while (entry.positions.length > 0 && entry.positions[0].ts < cutoff) {
    entry.positions.shift();
  }
}

/**
 * 移除已消失飞机的历史
 */
export function removeHistory(icao24) {
  _posHistory.delete(icao24);
}

// ── 推断缓存 ──────────────────────────────────────────────────────────────────

// key: "callsign:YYYYMMDD" 或 "icao24:YYYYMMDD"
const _inferCache = new Map();

function getCacheKey(callsign, icao24) {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return callsign && callsign.length >= 3
    ? `${callsign}:${day}`
    : `${icao24}:${day}`;
}

function getCached(callsign, icao24) {
  const key = getCacheKey(callsign, icao24);
  const entry = _inferCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    _inferCache.delete(key);
    return null;
  }
  return entry;
}

function setCache(callsign, icao24, origin, destination, confidence) {
  const key = getCacheKey(callsign, icao24);
  _inferCache.set(key, {
    origin,
    destination,
    confidence,
    estimated: true,
    ts: Date.now(),
  });
}

// ── 评分系统 ──────────────────────────────────────────────────────────────────

/**
 * 为 origin 候选机场打分
 * @param {Object} airport - {lat, lon, code, ...}
 * @param {Array} positions - 起飞阶段轨迹点
 * @param {Object} parsed - callsign 解析结果
 * @returns {number} 0-1 综合得分
 */
function scoreOrigin(airport, positions, parsed) {
  if (positions.length === 0) return 0;

  // 1. 距离分 — 用最早的低空点与机场的距离
  const earliest = positions[0];
  const distKm = haversineKm(earliest.lat, earliest.lon, airport.lat, airport.lon);
  // 5km 以内满分，30km 以外 0 分
  const distScore = Math.max(0, 1 - distKm / ORIGIN_SEARCH_RADIUS_KM);

  // 2. 航向分 — 飞机航向应大致背离机场（刚起飞方向）
  let headingScore = 0.5; // 默认中性
  if (earliest.heading != null) {
    const bearToAirport = bearing(earliest.lat, earliest.lon, airport.lat, airport.lon);
    // 起飞后航向应该背离机场（180° 差异 = 最佳）
    const diff = angleDiff(earliest.heading, bearToAirport);
    // 但也可能还在转弯，所以不太严格
    headingScore = diff > 90 ? 0.8 + 0.2 * ((diff - 90) / 90) : 0.3;
  }

  // 3. 飞行阶段分 — 应该是爬升阶段
  let phaseScore = 0.3;
  const climbCount = positions.filter(p => p.vRate > CLIMB_RATE_THRESHOLD).length;
  const climbRatio = climbCount / positions.length;
  phaseScore = Math.min(1, climbRatio * 1.5);

  // 4. 高度分 — 最早点应该在低空
  let altScore = 0.5;
  if (earliest.altFt != null) {
    if (earliest.altFt < 2000) altScore = 1.0;
    else if (earliest.altFt < 5000) altScore = 0.7;
    else if (earliest.altFt < ORIGIN_ALT_THRESHOLD_FT) altScore = 0.4;
    else altScore = 0.1;
  }

  // 5. 航司区域加分（弱因子）
  let regionBonus = 0;
  if (parsed?.region && airport.country) {
    // 简单的区域匹配
    regionBonus = 0.05; // 小加分
  }

  // 综合加权
  const score = (
    distScore * 0.40 +
    headingScore * 0.15 +
    phaseScore * 0.25 +
    altScore * 0.20
  ) + regionBonus;

  return Math.min(1, score);
}

/**
 * 为 destination 候选机场打分
 * @param {Object} airport - {lat, lon, code, ...}
 * @param {Array} positions - 下降阶段轨迹点
 * @param {Object} parsed - callsign 解析结果
 * @returns {number} 0-1 综合得分
 */
function scoreDestination(airport, positions, parsed) {
  if (positions.length === 0) return 0;

  // 1. 距离分 — 用最近的低空点与机场的距离
  const latest = positions[positions.length - 1];
  const distKm = haversineKm(latest.lat, latest.lon, airport.lat, airport.lon);
  const distScore = Math.max(0, 1 - distKm / DEST_SEARCH_RADIUS_KM);

  // 2. 航向分 — 飞机航向应指向机场
  let headingScore = 0.5;
  if (latest.heading != null) {
    const bearToAirport = bearing(latest.lat, latest.lon, airport.lat, airport.lon);
    const diff = angleDiff(latest.heading, bearToAirport);
    // 航向朝向机场（差异小 = 好）
    headingScore = diff < 30 ? 1.0 : diff < 60 ? 0.7 : diff < 90 ? 0.4 : 0.1;
  }

  // 3. 轨迹收敛分 — 多个轨迹点应该越来越接近机场
  let convergenceScore = 0.5;
  if (positions.length >= 3) {
    let converging = 0;
    for (let i = 1; i < positions.length; i++) {
      const d1 = haversineKm(positions[i - 1].lat, positions[i - 1].lon, airport.lat, airport.lon);
      const d2 = haversineKm(positions[i].lat, positions[i].lon, airport.lat, airport.lon);
      if (d2 < d1) converging++;
    }
    convergenceScore = converging / (positions.length - 1);
  }

  // 4. 飞行阶段分 — 应该是下降阶段
  let phaseScore = 0.3;
  const descCount = positions.filter(p => p.vRate < DESCENT_RATE_THRESHOLD).length;
  const descRatio = descCount / positions.length;
  phaseScore = Math.min(1, descRatio * 1.5);

  // 5. 高度递减分 — 高度应逐渐降低
  let altTrendScore = 0.5;
  if (positions.length >= 3) {
    const first = positions[0];
    const last = positions[positions.length - 1];
    if (first.altFt != null && last.altFt != null && last.altFt < first.altFt) {
      const drop = first.altFt - last.altFt;
      altTrendScore = Math.min(1, drop / 5000); // 下降 5000 ft 以上满分
    }
  }

  // 6. 航司区域加分
  let regionBonus = 0;
  if (parsed?.region) {
    regionBonus = 0.03;
  }

  const score = (
    distScore * 0.35 +
    headingScore * 0.20 +
    convergenceScore * 0.15 +
    phaseScore * 0.15 +
    altTrendScore * 0.15
  ) + regionBonus;

  return Math.min(1, score);
}

// ── 主推断逻辑 ────────────────────────────────────────────────────────────────

/**
 * 推断 origin（起飞机场）
 * 触发条件：低空 + 爬升
 */
function inferOrigin(entry) {
  const positions = entry.positions;
  if (positions.length < 3) return null;

  // 找到"起飞阶段"的轨迹点 — 最早的低空爬升段
  // Also include very low altitude points (< 500 ft) even without positive vRate
  // to cover takeoff roll and ADS-B vertical-rate lag at departure.
  const takeoffPoints = [];
  for (const p of positions) {
    if (p.altFt == null) continue;
    if (p.altFt > ORIGIN_ALT_THRESHOLD_FT) break;
    if (p.vRate > 0 || p.altFt < 500) { // climbing OR very low altitude
      takeoffPoints.push(p);
    }
  }

  if (takeoffPoints.length < 2) return null;

  // 用最早的低空点搜索附近机场
  const searchPoint = takeoffPoints[0];
  const nearby = findNearbyAirports(searchPoint.lat, searchPoint.lon, ORIGIN_SEARCH_RADIUS_KM);
  if (nearby.length === 0) return null;

  const parsed = parseCallsign(entry.callsign);

  // 为每个候选机场评分
  const candidates = nearby.map(({ airport, dist }) => ({
    code: airport.code,
    icao: airport.icao,
    name: airport.name,
    dist: Math.round(dist * 10) / 10,
    score: scoreOrigin(airport, takeoffPoints, parsed),
  }));

  candidates.sort((a, b) => b.score - a.score);

  if (LOG_INFER) {
    console.log(`[RouteInfer] Origin推断 ${entry.callsign || '?'}: ` +
      `${candidates.length} 个候选`, candidates.slice(0, 5));
  }

  const best = candidates[0];
  if (best && best.score >= MIN_SCORE_THRESHOLD) {
    return { code: best.code, icao: best.icao, score: best.score, dist: best.dist };
  }
  return null;
}

/**
 * 推断 destination（目的机场）
 * 触发条件：低空 + 持续下降
 * 要求连续 DEST_CONFIRM_COUNT 次指向同一机场才确认
 */
function inferDestination(entry) {
  const positions = entry.positions;
  if (positions.length < 5) return null;

  // 找到"下降阶段"的轨迹点 — 最近的低空下降段
  const descentPoints = [];
  for (let i = positions.length - 1; i >= 0; i--) {
    const p = positions[i];
    if (p.altFt == null) continue;
    if (p.altFt > DEST_ALT_THRESHOLD_FT) break;
    if (p.vRate < 0) {
      descentPoints.unshift(p); // 保持时间顺序
    }
  }

  if (descentPoints.length < 3) {
    // Fallback: try heading-based destination inference (works at any altitude)
    return inferDestinationByHeading(entry);
  }

  // 用最近的低空点搜索附近机场
  const searchPoint = descentPoints[descentPoints.length - 1];
  const nearby = findNearbyAirports(searchPoint.lat, searchPoint.lon, DEST_SEARCH_RADIUS_KM);
  if (nearby.length === 0) return null;

  const parsed = parseCallsign(entry.callsign);

  const candidates = nearby.map(({ airport, dist }) => ({
    code: airport.code,
    icao: airport.icao,
    name: airport.name,
    dist: Math.round(dist * 10) / 10,
    score: scoreDestination(airport, descentPoints, parsed),
  }));

  candidates.sort((a, b) => b.score - a.score);

  if (LOG_INFER) {
    console.log(`[RouteInfer] Dest推断 ${entry.callsign || '?'}: ` +
      `${candidates.length} 个候选`, candidates.slice(0, 5));
  }

  const best = candidates[0];
  if (!best || best.score < MIN_SCORE_THRESHOLD) return null;

  // 延迟确认机制：需要连续 N 次指向同一机场
  if (entry.destCandidateCode === best.code) {
    entry.destCandidateCount++;
  } else {
    entry.destCandidateCode = best.code;
    entry.destCandidateCount = 1;
  }

  if (entry.destCandidateCount >= DEST_CONFIRM_COUNT) {
    return { code: best.code, icao: best.icao, score: best.score, dist: best.dist };
  }

  return null; // 还未确认
}

/**
 * 航向推断目的地 — 用于巡航高度的飞机
 * 即使飞机在 30,000+ ft，如果航向持续指向某个大型机场，
 * 且距离在合理范围内（50-500 km），可以推测为目的地
 */
function inferDestinationByHeading(entry) {
  const positions = entry.positions;
  if (positions.length < 8) return null;

  // Use the latest 8 positions to check heading consistency
  const recent = positions.slice(-8);
  const latest = recent[recent.length - 1];
  if (latest.heading == null || latest.lat == null) return null;

  // Project a point ~200km ahead along current heading
  const projDist = 200;
  const projLat = latest.lat + (projDist / 111) * Math.cos(latest.heading * DEG_TO_RAD);
  const projLon = latest.lon + (projDist / (111 * Math.cos(latest.lat * DEG_TO_RAD))) * Math.sin(latest.heading * DEG_TO_RAD);

  // Search around both current position and projected position
  const nearby1 = findNearbyAirports(latest.lat, latest.lon, 350);
  const nearby2 = findNearbyAirports(projLat, projLon, 250);

  // Merge and deduplicate
  const seen = new Set();
  const allNearby = [];
  for (const n of [...nearby1, ...nearby2]) {
    if (seen.has(n.airport.code)) continue;
    seen.add(n.airport.code);
    const d = haversineKm(latest.lat, latest.lon, n.airport.lat, n.airport.lon);
    if (d < 25 || d > 600) continue; // 25–600 km window (covers short-haul to 6h flights)
    allNearby.push({ airport: n.airport, dist: d });
  }

  if (allNearby.length === 0) return null;

  const parsed = parseCallsign(entry.callsign);

  const candidates = [];
  for (const { airport, dist } of allNearby) {
    let alignCount = 0;
    let totalChecked = 0;
    for (const p of recent) {
      if (p.heading == null) continue;
      totalChecked++;
      const bearTo = bearing(p.lat, p.lon, airport.lat, airport.lon);
      const diff = angleDiff(p.heading, bearTo);
      if (diff < 25) alignCount++;
    }
    if (totalChecked < 4) continue;

    const alignRatio = alignCount / totalChecked;
    if (alignRatio < 0.5) continue;

    let distScore = 0;
    if (dist >= 50 && dist <= 450) distScore = 0.8;
    else if (dist > 450) distScore = Math.max(0, 0.8 - (dist - 450) / 600);
    else distScore = dist / 50 * 0.5; // < 50 km — too close, low confidence

    let regionBonus = 0;
    if (parsed?.region) regionBonus = 0.05;

    const score = alignRatio * 0.55 + distScore * 0.40 + regionBonus;

    candidates.push({
      code: airport.code,
      icao: airport.icao,
      name: airport.name,
      dist: Math.round(dist),
      score: Math.min(1, score),
    });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);

  if (LOG_INFER) {
    console.log(`[RouteInfer] HeadingDest推断 ${entry.callsign || '?'}: ` +
      `${candidates.length} 个候选`, candidates.slice(0, 5));
  }

  const best = candidates[0];
  if (best.score < 0.40) return null;

  // Delayed confirmation — heading-based needs extra confirmations
  if (entry.destCandidateCode === best.code) {
    entry.destCandidateCount++;
  } else {
    entry.destCandidateCode = best.code;
    entry.destCandidateCount = 1;
  }

  if (entry.destCandidateCount >= DEST_CONFIRM_COUNT + 1) {
    return { code: best.code, icao: best.icao, score: best.score, dist: best.dist };
  }

  return null;
}

// ── Trace 数据注入 ──────────────────────────────────────────────────────────

/**
 * 将 trace（历史 30 分钟航迹）注入位置历史
 * trace waypoints 通常包含起飞阶段的低空数据点，这对 origin 推断至关重要
 *
 * @param {string} icao24
 * @param {Array} waypoints - [{latitude, longitude, baroAltitude (meters), time (epoch s)}, ...]
 * @param {string} callsign
 */
export function feedTrace(icao24, waypoints, callsign) {
  if (!waypoints || waypoints.length < 2) return;

  let entry = _posHistory.get(icao24);
  if (!entry) {
    entry = {
      positions: [],
      callsign: callsign || null,
      originLocked: false,
      destLocked: false,
      destCandidateCode: null,
      destCandidateCount: 0,
      lastInferTime: 0,
    };
    _posHistory.set(icao24, entry);
  }

  // Already fully inferred — skip
  if (entry.originLocked && entry.destLocked) return;

  // Only inject trace points that are OLDER than our earliest live position
  // to avoid duplicating data
  const earliestLive = entry.positions.length > 0 ? entry.positions[0].ts : Infinity;

  let injected = 0;
  const tracePoints = [];
  for (const wp of waypoints) {
    const ts = wp.time * 1000; // epoch s → ms
    if (ts >= earliestLive) continue; // skip if we already have live data for this time
    if (wp.latitude == null || wp.longitude == null) continue;

    const altFt = wp.baroAltitude != null ? wp.baroAltitude * METERS_TO_FEET : null;

    tracePoints.push({
      lat: wp.latitude,
      lon: wp.longitude,
      altFt,
      vRate: 0, // trace doesn't have vertical rate, will estimate below
      heading: null,
      gs: 0,
      ts,
    });
    injected++;
  }

  if (tracePoints.length < 2) return;

  // Sort chronologically
  tracePoints.sort((a, b) => a.ts - b.ts);

  // Estimate vertical rate and heading from consecutive points
  for (let i = 1; i < tracePoints.length; i++) {
    const prev = tracePoints[i - 1];
    const curr = tracePoints[i];
    const dt = (curr.ts - prev.ts) / 1000; // seconds
    if (dt > 0 && prev.altFt != null && curr.altFt != null) {
      // Convert ft/s to m/s (since vRate thresholds are in m/s)
      curr.vRate = ((curr.altFt - prev.altFt) / dt) / METERS_TO_FEET;
    }
    // Estimate heading from consecutive lat/lon
    curr.heading = bearing(prev.lat, prev.lon, curr.lat, curr.lon);
  }
  // First point: copy from second
  if (tracePoints.length >= 2) {
    tracePoints[0].vRate = tracePoints[1].vRate;
    tracePoints[0].heading = tracePoints[1].heading;
  }

  // Prepend trace points before live positions
  entry.positions = tracePoints.concat(entry.positions);

  // Trim to max size
  if (entry.positions.length > POS_HISTORY_MAX * 2) {
    entry.positions = entry.positions.slice(0, POS_HISTORY_MAX * 2);
  }

  if (callsign) entry.callsign = callsign;

  if (LOG_INFER) {
    console.log(`[RouteInfer] Trace注入 ${callsign || icao24}: ${injected} 个历史点, 总 ${entry.positions.length} 个`);
  }

  // Immediately attempt inference with the enriched history
  if (!entry.originLocked || !entry.destLocked) {
    triggerInference(icao24, callsign || entry.callsign);
  }
}

// ── 公共 API ──────────────────────────────────────────────────────────────────

/**
 * 触发推断（按需调用）
 * 调用时机：
 *  1. 新飞机出现
 *  2. 飞机进入起飞/降落阶段
 *  3. 用户点击某架飞机查看详情
 *
 * @param {string} icao24
 * @param {string} callsign
 * @returns {{ origin, destination, confidence, estimated }|null}
 */
export function triggerInference(icao24, callsign) {
  if (_airports.length === 0) return null;

  // 1. 查缓存
  const cached = getCached(callsign, icao24);
  if (cached && (cached.origin || cached.destination)) {
    return cached;
  }

  // 2. 查位置历史
  const entry = _posHistory.get(icao24);
  if (!entry || entry.positions.length < 3) return null;

  // 3. 限频：同一架飞机 10 秒内不重复推断
  const now = Date.now();
  if (now - entry.lastInferTime < 10000) {
    return getCached(callsign, icao24);
  }
  entry.lastInferTime = now;

  let origin = null;
  let destination = null;
  let confidence = 'low';

  // 4. 推断 origin（未锁定时）
  if (!entry.originLocked) {
    const result = inferOrigin(entry);
    if (result) {
      origin = result.code;
      entry.originLocked = true;
      if (LOG_INFER) {
        console.log(`[RouteInfer] ✓ Origin 确认: ${callsign || icao24} → ${result.code} ` +
          `(${result.dist}km, score=${result.score.toFixed(3)})`);
      }
    }
  }

  // 5. 推断 destination（未锁定时）
  if (!entry.destLocked) {
    const result = inferDestination(entry);
    if (result) {
      destination = result.code;
      entry.destLocked = true;
      if (LOG_INFER) {
        console.log(`[RouteInfer] ✓ Dest 确认: ${callsign || icao24} → ${result.code} ` +
          `(${result.dist}km, score=${result.score.toFixed(3)})`);
      }
    }
  }

  // 从缓存中获取之前推断的结果
  const prev = getCached(callsign, icao24);
  if (!origin && prev?.origin) origin = prev.origin;
  if (!destination && prev?.destination) destination = prev.destination;

  // 计算 confidence
  if (origin && destination) confidence = 'high';
  else if (origin || destination) confidence = 'medium';
  else confidence = 'low';

  // 写入缓存
  if (origin || destination) {
    setCache(callsign, icao24, origin, destination, confidence);
  }

  if (!origin && !destination) return null;

  return {
    origin,
    destination,
    confidence,
    estimated: true,
  };
}

/**
 * 获取推断结果（不触发新推断，仅读缓存）
 */
export function getInferredRoute(icao24, callsign) {
  return getCached(callsign, icao24);
}

/**
 * 批量更新位置历史 — 在每次 poll 数据到达时调用
 * 只对符合条件的飞机触发推断（新飞机、起飞/降落阶段）
 */
export function batchUpdate(dataList) {
  for (const data of dataList) {
    if (!data.icao24 || !data.latitude || !data.longitude) continue;
    recordPosition(data.icao24, data);

    // 只对以下情况自动触发推断：
    const entry = _posHistory.get(data.icao24);
    if (!entry) continue;

    // 已经全部推断完成的飞机跳过
    if (entry.originLocked && entry.destLocked) continue;

    const altFt = data.baroAltitude != null ? data.baroAltitude * METERS_TO_FEET : null;
    const vRate = data.verticalRate || 0;

    const shouldInfer =
      // 新飞机（少于 5 个位置记录）
      entry.positions.length <= 5 ||
      // 起飞阶段（低空 + 爬升）
      (!entry.originLocked && altFt != null && altFt < ORIGIN_ALT_THRESHOLD_FT && vRate > CLIMB_RATE_THRESHOLD) ||
      // 降落阶段（低空 + 下降）
      (!entry.destLocked && altFt != null && altFt < DEST_ALT_THRESHOLD_FT && vRate < DESCENT_RATE_THRESHOLD) ||
      // 巡航阶段但有足够的历史数据 — 航向推断目的地（每 30 个点触发一次）
      (!entry.destLocked && entry.positions.length >= 8 && entry.positions.length % 30 === 0);

    if (shouldInfer) {
      triggerInference(data.icao24, data.callsign || entry.callsign);
    }
  }
}

/**
 * 清理已消失飞机的数据
 */
export function cleanupStale(activeIcaoSet) {
  for (const icao24 of _posHistory.keys()) {
    if (!activeIcaoSet.has(icao24)) {
      _posHistory.delete(icao24);
    }
  }

  // 清理过期缓存
  const now = Date.now();
  for (const [key, val] of _inferCache) {
    if (now - val.ts > CACHE_TTL) {
      _inferCache.delete(key);
    }
  }
}

/**
 * 获取推断系统统计信息（调试用）
 */
// A2: Holding Pattern Detector
// Analyzes trace waypoints for cumulative heading change > 360° within bounded area (<15nm).
export function detectHoldingPattern(waypoints) {
  if (!waypoints || waypoints.length < 10) return false;
  // Use last 5 minutes of waypoints
  const now = Date.now() / 1000;
  const cutoff = now - 300;
  const recent = waypoints.filter(wp => wp.time >= cutoff);
  if (recent.length < 6) return false;

  // Check geographic spread (must be <15nm ≈ 28km)
  let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
  for (const wp of recent) {
    if (wp.latitude < minLat) minLat = wp.latitude;
    if (wp.latitude > maxLat) maxLat = wp.latitude;
    if (wp.longitude < minLon) minLon = wp.longitude;
    if (wp.longitude > maxLon) maxLon = wp.longitude;
  }
  const latSpan = (maxLat - minLat) * 111; // ~km per degree
  const lonSpan = (maxLon - minLon) * 111 * Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
  if (latSpan > 28 || lonSpan > 28) return false;

  // Compute cumulative heading change
  let totalTurn = 0;
  for (let i = 1; i < recent.length; i++) {
    const dlat = recent[i].latitude - recent[i - 1].latitude;
    const dlon = recent[i].longitude - recent[i - 1].longitude;
    if (Math.abs(dlat) < 0.00001 && Math.abs(dlon) < 0.00001) continue;
    const hdg = Math.atan2(dlon, dlat) * 180 / Math.PI;
    if (i >= 2) {
      const prevDlat = recent[i - 1].latitude - recent[i - 2].latitude;
      const prevDlon = recent[i - 1].longitude - recent[i - 2].longitude;
      if (Math.abs(prevDlat) < 0.00001 && Math.abs(prevDlon) < 0.00001) continue;
      const prevHdg = Math.atan2(prevDlon, prevDlat) * 180 / Math.PI;
      let delta = hdg - prevHdg;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      totalTurn += Math.abs(delta);
    }
  }
  return totalTurn >= 360;
}

export function getStats() {
  let originCount = 0, destCount = 0, bothCount = 0;
  for (const [, val] of _inferCache) {
    if (val.origin) originCount++;
    if (val.destination) destCount++;
    if (val.origin && val.destination) bothCount++;
  }
  return {
    trackedAircraft: _posHistory.size,
    cacheEntries: _inferCache.size,
    inferredOrigins: originCount,
    inferredDestinations: destCount,
    inferredBoth: bothCount,
    airports: _airports.length,
  };
}
