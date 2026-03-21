// ── STRATUM Cockpit HUD v3 ───────────────────────────────────────────────────
// Primary Flight Display overlay. Follow mode (Space) → V to toggle.
// Matches STRATUM design language: gold accent, info blue, deep navy, JetBrains Mono.
// DPR-aware canvas for crisp Retina rendering.

// ── Design tokens (mirrors src/style.css) ────────────────────────────────────
const C = {
  overlay:    'rgba(4,5,9,0.24)',      // translucent — scene bleeds through
  bg:         'rgba(4,6,16,0.80)',     // bars: readable but not a wall
  bgPanel:    'rgba(4,6,16,0.72)',     // tapes: semi-transparent
  border:     'rgba(255,255,255,0.038)',
  borderGold: 'rgba(196,160,88,0.12)',
  accent:     '#c9a45c',
  accentDim:  'rgba(196,160,88,0.12)',
  info:       '#6aadcc',
  success:    '#52a86c',
  danger:     '#b05048',
  text:       'rgba(240,236,226,0.92)',
  text2:      'rgba(240,236,226,0.40)',
  text3:      'rgba(240,236,226,0.16)',
  skyTop:     'rgba(3,10,28,0.96)',
  skyBot:     'rgba(8,28,68,0.96)',
  gndTop:     'rgba(48,26,7,0.96)',
  gndBot:     'rgba(14,8,3,0.98)',
};
const MONO = "'JetBrains Mono','SF Mono',ui-monospace,monospace";
const SANS = "'Inter',system-ui,-apple-system,sans-serif";

const PHASE_COLOR = {
  TAXI: 'rgba(240,236,226,0.28)', 'ON GROUND': 'rgba(240,236,226,0.28)',
  TAKEOFF: '#c9a45c', 'INITIAL CLIMB': '#c9a45c', CLIMB: '#c9a45c',
  CRUISE: '#52a86c',  'EN ROUTE': '#52a86c',
  DESCENT: '#6aadcc', APPROACH: '#e8905a', LANDING: '#b05048',
};

// ── State ─────────────────────────────────────────────────────────────────────
let _overlay = null, _canvas = null, _ctx = null;
let _animFrame = null, _aircraft = null;
let _visible = false, _dpr = 1;

// EMA smoothed values
let _dAlt = null, _dIas = null, _dVs = null, _dMach = null, _dHdg = null;

function _ema(cur, tgt, a = 0.12) {
  if (cur == null || !isFinite(cur)) return tgt;
  if (tgt == null || !isFinite(tgt)) return cur;
  return cur + a * (tgt - cur);
}

function _parseVs(raw) {
  if (raw == null) return null;
  const n = parseInt(String(raw).replace(/[^\d\-+]/g, ''));
  return isFinite(n) ? n : null;
}

// ── Public API ────────────────────────────────────────────────────────────────
export function initCockpitHUD() {
  if (_overlay) return;
  _overlay = document.createElement('div');
  _overlay.id = 'cockpit-hud';
  _overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:200;display:none;';
  _canvas = document.createElement('canvas');
  _canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  _overlay.appendChild(_canvas);
  document.body.appendChild(_overlay);
  _resizeCanvas();
  window.addEventListener('resize', _resizeCanvas);
}

export function showCockpitHUD(aircraft) {
  if (!_overlay) initCockpitHUD();
  _aircraft = aircraft;
  _visible  = true;
  _overlay.style.display = '';
  _dAlt = _dIas = _dVs = _dMach = _dHdg = null;
  _scheduleFrame();
}

export function hideCockpitHUD() {
  _visible  = false;
  _aircraft = null;
  if (_overlay) _overlay.style.display = 'none';
  if (_animFrame) { cancelAnimationFrame(_animFrame); _animFrame = null; }
}

export function toggleCockpitHUD(aircraft) {
  if (_visible) hideCockpitHUD(); else showCockpitHUD(aircraft);
  return _visible;
}

export function isCockpitHUDVisible() { return _visible; }
export function updateCockpitHUDAircraft(a) { _aircraft = a; }

// ── Canvas ────────────────────────────────────────────────────────────────────
function _resizeCanvas() {
  if (!_canvas) return;
  _dpr = window.devicePixelRatio || 1;
  _canvas.width  = Math.round(window.innerWidth  * _dpr);
  _canvas.height = Math.round(window.innerHeight * _dpr);
  _canvas.style.width  = window.innerWidth  + 'px';
  _canvas.style.height = window.innerHeight + 'px';
  _ctx = _canvas.getContext('2d');
}

function _scheduleFrame() {
  if (_animFrame) return;
  _animFrame = requestAnimationFrame(_frame);
}

function _frame() {
  _animFrame = null;
  if (!_visible || !_ctx) return;
  _render();
  if (_visible) _animFrame = requestAnimationFrame(_frame);
}

// ── Micro helpers ─────────────────────────────────────────────────────────────
function _rr(ctx, x, y, w, h, r = 4) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function _t(ctx, txt, x, y, sz, col, align = 'left', weight = 'normal', font = MONO, baseline = 'middle') {
  ctx.save();
  ctx.font = `${weight} ${sz}px ${font}`;
  ctx.fillStyle = col;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(txt, x, y);
  ctx.restore();
}

// ── Main render ───────────────────────────────────────────────────────────────
function _render() {
  const ctx = _ctx;
  const W = _canvas.width / _dpr;
  const H = _canvas.height / _dpr;
  ctx.save();
  ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const d = _aircraft ? _aircraft.getDisplayData() : null;

  // Parse — field names verified against getDisplayData() return
  const rawAlt  = d?._bestAltFt ?? null;
  const rawIas  = (d?.ias != null && d.ias > 0) ? d.ias : (d?.gsKts ?? null);
  const rawVs   = _parseVs(d?.verticalSpeed);
  const rawHdg  = d?.heading != null ? parseInt(d.heading) || 0 : 0;
  const rawMach = d?.mach   != null ? parseFloat(d.mach) : null;
  const navAlt  = d?.navAlt ?? null;
  const navHdg  = d?.navHdg ?? null;

  // EMA smooth
  _dAlt  = _ema(_dAlt,  rawAlt);
  _dIas  = _ema(_dIas,  rawIas);
  _dVs   = _ema(_dVs,   rawVs,  0.08);
  _dMach = _ema(_dMach, rawMach);
  _dHdg  = rawHdg; // heading: no EMA (wraparound risk)

  const alt  = _dAlt  ?? 0;
  const ias  = _dIas  ?? 0;
  const vs   = _dVs   ?? 0;
  const hdg  = _dHdg  ?? 0;
  const mach = _dMach;
  const phase = d?.flightPhase || '';

  // Layout — compact, lower footprint
  const TOP   = 36, BOT = 38, HDG_H = 30, GAP = 5;
  const TAPE_W = 58;
  const pfdW = Math.min(W * 0.40, 500);
  const pfdH = H - TOP - BOT - HDG_H - GAP * 4;
  const pfdX = (W - pfdW) / 2;
  const pfdY = TOP + GAP;
  const cx   = W / 2;
  const altX = pfdX - GAP - TAPE_W;
  const spdX = pfdX + pfdW + GAP;
  const hdgY = pfdY + pfdH + GAP;
  const DEG_PX = pfdH / 50; // pixels per degree of pitch
  const pitchDeg = vs ? Math.max(-18, Math.min(18, (vs / 1000) * 3)) : 0;

  // ── 1. Full-screen overlay ─────────────────────────────────────────────────
  ctx.fillStyle = C.overlay;
  ctx.fillRect(0, 0, W, H);

  // ── 2. Instruments ─────────────────────────────────────────────────────────
  _topBar(ctx, W, TOP, d, phase);
  _horizon(ctx, pfdX, pfdY, pfdW, pfdH, pitchDeg, DEG_PX, cx);
  _pfdFrame(ctx, pfdX, pfdY, pfdW, pfdH);
  _altTape(ctx, altX, pfdY, TAPE_W, pfdH, alt, navAlt, d?.altDeviation);
  _iasTape(ctx, spdX, pfdY, TAPE_W, pfdH, ias, d?.ias != null);
  _headingStrip(ctx, pfdX, hdgY, pfdW, HDG_H, hdg, navHdg);
  _bottomBar(ctx, W, H, BOT, d, vs, mach, alt);

  // ── 3. Scanline texture ────────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.010;
  ctx.fillStyle = 'rgba(0,0,0,1)';
  for (let sy = 0; sy < H; sy += 3) ctx.fillRect(0, sy, W, 1);
  ctx.globalAlpha = 1;
  ctx.restore();

  // ── 4. Key hint ────────────────────────────────────────────────────────────
  _t(ctx, '[V]  EXIT COCKPIT VIEW', W - 14, H - BOT - 7, 7, C.text3, 'right', 'normal', MONO, 'bottom');

  ctx.restore();
}

// ── Top Bar ───────────────────────────────────────────────────────────────────
function _topBar(ctx, W, H, d, phase) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  // Gold separator
  ctx.save();
  ctx.strokeStyle = C.borderGold;
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.stroke();
  ctx.restore();

  const mid = H / 2;

  // Callsign — gold, prominent
  const cs = d?.callsign || d?.icao24 || '——';
  _t(ctx, cs, 16, mid - 2, 15, C.accent, 'left', '500');

  // Registration · airline (sub)
  const reg  = d?.registration || '';
  const airl = (d?.routeAirline || d?.operator || '').slice(0, 28);
  const sub  = [reg, airl].filter(Boolean).join('  ·  ').toUpperCase();
  if (sub) _t(ctx, sub, 16, H - 7, 6.5, C.text2, 'left', 'normal', SANS, 'bottom');

  // Aircraft type (left of phase badge)
  if (d?.aircraftType) {
    _t(ctx, d.aircraftType.toUpperCase(), W / 2 - 90, mid, 8.5, C.text3, 'center', 'normal', MONO);
  }

  // Phase badge (center)
  _phaseBadge(ctx, W / 2, mid, phase);

  // UTC clock (right)
  const now = new Date();
  const utc = `${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}:${String(now.getUTCSeconds()).padStart(2,'0')}`;
  _t(ctx, utc, W - 16, mid - 2, 11, C.text, 'right', '400');
  _t(ctx, 'UTC', W - 16, H - 7, 6.5, C.text3, 'right', 'normal', SANS, 'bottom');

  // ICAO24
  if (d?.icao24) _t(ctx, d.icao24.toUpperCase(), W - 64, H - 7, 6.5, C.text3, 'right', 'normal', MONO, 'bottom');
}

// ── Phase Badge ───────────────────────────────────────────────────────────────
function _phaseBadge(ctx, cx, cy, phase) {
  if (!phase) return;
  const col = PHASE_COLOR[phase] || C.text2;
  ctx.save();
  ctx.font = `600 8px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const tw = ctx.measureText(phase).width;
  const bw = tw + 20, bh = 19;
  const bx = cx - bw / 2, by = cy - bh / 2;
  ctx.globalAlpha = 0.10; ctx.fillStyle = col;
  _rr(ctx, bx, by, bw, bh, 3); ctx.fill();
  ctx.globalAlpha = 0.36; ctx.strokeStyle = col; ctx.lineWidth = 0.75;
  _rr(ctx, bx, by, bw, bh, 3); ctx.stroke();
  ctx.globalAlpha = 1; ctx.fillStyle = col;
  ctx.fillText(phase, cx, cy);
  ctx.restore();
}

// ── Artificial Horizon (rectangular PFD) ──────────────────────────────────────
function _horizon(ctx, x, y, w, h, pitchDeg, degPx, cx) {
  const horizY = y + h / 2 + pitchDeg * degPx; // moves down when nose-up (ground rises)

  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();

  // Sky
  const skyG = ctx.createLinearGradient(0, y, 0, Math.min(horizY, y + h));
  skyG.addColorStop(0, C.skyTop);
  skyG.addColorStop(1, C.skyBot);
  ctx.fillStyle = skyG;
  ctx.fillRect(x, y, w, Math.max(0, horizY - y));

  // Ground
  const gndG = ctx.createLinearGradient(0, Math.max(horizY, y), 0, y + h);
  gndG.addColorStop(0, C.gndTop);
  gndG.addColorStop(1, C.gndBot);
  ctx.fillStyle = gndG;
  ctx.fillRect(x, Math.max(y, horizY), w, y + h - Math.max(y, horizY));

  // Horizon line
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = 1;
  if (horizY >= y && horizY <= y + h) {
    ctx.beginPath(); ctx.moveTo(x, horizY); ctx.lineTo(x + w, horizY); ctx.stroke();
  }

  // Sky grid (very subtle vertical columns)
  ctx.strokeStyle = 'rgba(255,255,255,0.014)';
  ctx.lineWidth = 0.5;
  for (let gx = x + 40; gx < x + w; gx += 40) {
    ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke();
  }

  // Pitch ladder
  _pitchLadder(ctx, y, w, h, cx, horizY, degPx);

  ctx.restore();

  // Roll arc (above PFD zone, not clipped)
  _rollArc(ctx, cx, y, Math.min(w * 0.28, 100));

  // Aircraft reference symbol (fixed, not clipped)
  _aircraftRef(ctx, cx, y + h / 2);
}

// ── Pitch Ladder ──────────────────────────────────────────────────────────────
function _pitchLadder(ctx, py, pw, ph, cx, horizY, degPx) {
  const LADDERS = [
    { deg: 2.5, ow: pw * 0.09, op: 0.20 },
    { deg: 5,   ow: pw * 0.15, op: 0.28 },
    { deg: 10,  ow: pw * 0.24, op: 0.48, lbl: true },
    { deg: 15,  ow: pw * 0.19, op: 0.38, lbl: true },
    { deg: 20,  ow: pw * 0.24, op: 0.48, lbl: true },
  ];

  ctx.save();
  for (const { deg, ow, op, lbl } of LADDERS) {
    for (const sign of [1, -1]) {
      const fy = horizY - deg * sign * degPx;
      if (fy < py + 2 || fy > py + ph - 2) continue;
      const hw = ow / 2;
      const gap = pw * 0.035;

      ctx.strokeStyle = `rgba(196,160,88,${op})`;
      ctx.lineWidth = deg >= 10 ? 0.75 : 0.5;

      // Left segment
      ctx.beginPath(); ctx.moveTo(cx - hw, fy); ctx.lineTo(cx - gap, fy); ctx.stroke();
      // Right segment
      ctx.beginPath(); ctx.moveTo(cx + gap, fy); ctx.lineTo(cx + hw, fy); ctx.stroke();

      // Tick ends on major lines
      if (deg >= 10) {
        const tick = sign > 0 ? 5 : -5;
        ctx.beginPath();
        ctx.moveTo(cx - hw, fy); ctx.lineTo(cx - hw, fy + tick);
        ctx.moveTo(cx + hw, fy); ctx.lineTo(cx + hw, fy + tick);
        ctx.stroke();
      }

      if (lbl) {
        ctx.font = `8.5px ${MONO}`;
        ctx.fillStyle = `rgba(196,160,88,${op * 0.9})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(deg), cx - hw - 14, fy);
        ctx.fillText(String(deg), cx + hw + 14, fy);
      }
    }
  }
  ctx.restore();
}

// ── Roll Arc ──────────────────────────────────────────────────────────────────
function _rollArc(ctx, cx, pfdTopY, radius) {
  const arcCY = pfdTopY + radius;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.arc(cx, arcCY, radius, (-90 - 65) * Math.PI / 180, (-90 + 65) * Math.PI / 180);
  ctx.stroke();

  for (const bank of [10, 20, 30, 45, 60]) {
    for (const sign of [-1, 1]) {
      const ang = (-90 + sign * bank) * Math.PI / 180;
      const iR = radius - (bank % 30 === 0 ? 10 : 6);
      ctx.beginPath();
      ctx.moveTo(cx + iR * Math.cos(ang), arcCY + iR * Math.sin(ang));
      ctx.lineTo(cx + radius * Math.cos(ang), arcCY + radius * Math.sin(ang));
      ctx.stroke();
    }
  }

  // Zero triangle
  const za = -Math.PI / 2;
  const tx = cx + radius * Math.cos(za), ty = arcCY + radius * Math.sin(za);
  ctx.fillStyle = 'rgba(240,236,226,0.55)';
  ctx.beginPath();
  ctx.moveTo(tx, ty + 2); ctx.lineTo(tx - 4, ty - 7); ctx.lineTo(tx + 4, ty - 7);
  ctx.closePath(); ctx.fill();

  ctx.restore();
}

// ── Aircraft Reference Symbol (FPV bird) ──────────────────────────────────────
function _aircraftRef(ctx, cx, cy) {
  const ARM = 38;
  ctx.save();
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // Left wing
  ctx.beginPath(); ctx.moveTo(cx - ARM, cy); ctx.lineTo(cx - ARM * 0.36, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - ARM * 0.33, cy); ctx.lineTo(cx - ARM * 0.33, cy + ARM * 0.17); ctx.stroke();
  // Right wing
  ctx.beginPath(); ctx.moveTo(cx + ARM * 0.36, cy); ctx.lineTo(cx + ARM, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + ARM * 0.33, cy); ctx.lineTo(cx + ARM * 0.33, cy + ARM * 0.17); ctx.stroke();
  // Vertical ref
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy - 7); ctx.lineTo(cx, cy - 14); ctx.stroke();
  // Center dot
  ctx.fillStyle = C.accent;
  ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ── PFD Frame + Corner Brackets ───────────────────────────────────────────────
function _pfdFrame(ctx, x, y, w, h) {
  const BL = 18;
  ctx.save();
  ctx.strokeStyle = C.borderGold;
  ctx.lineWidth = 1;
  // Corners
  const corners = [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]];
  for (const [cx2, cy2, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx2, cy2 + dy * BL); ctx.lineTo(cx2, cy2); ctx.lineTo(cx2 + dx * BL, cy2);
    ctx.stroke();
  }
  // Center crosshairs (very faint)
  const mx = x + w / 2, my = y + h / 2;
  ctx.strokeStyle = 'rgba(196,160,88,0.07)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x + 12, my); ctx.lineTo(mx - 56, my);
  ctx.moveTo(mx + 56, my); ctx.lineTo(x + w - 12, my);
  ctx.moveTo(mx, y + 12); ctx.lineTo(mx, my - 36);
  ctx.moveTo(mx, my + 36); ctx.lineTo(mx, y + h - 12);
  ctx.stroke();
  ctx.restore();
}

// ── Altitude Tape ─────────────────────────────────────────────────────────────
function _altTape(ctx, x, y, w, h, alt, navAlt, altDev) {
  // Panel
  ctx.fillStyle = C.bgPanel; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = C.border; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, w, h);

  const cy = y + h / 2;
  const RANGE = 2500, MINOR = 100, MAJOR = 500;

  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();

  // Low-altitude amber tint
  if (alt < 12000) {
    const loY = cy - ((Math.min(9999, alt + RANGE) - alt) / RANGE) * (h / 2);
    const hiY = cy - ((Math.max(0, alt - RANGE) - alt) / RANGE) * (h / 2);
    ctx.fillStyle = 'rgba(201,164,92,0.04)';
    ctx.fillRect(x, Math.max(y, loY), w, Math.min(y + h, hiY) - Math.max(y, loY));
  }

  // Ticks + labels
  const start = Math.ceil((alt - RANGE) / MINOR) * MINOR;
  for (let a = start; a <= alt + RANGE; a += MINOR) {
    const fy = cy - ((a - alt) / RANGE) * (h / 2);
    if (fy < y || fy > y + h) continue;
    const isMaj = a % MAJOR === 0;
    const isLow = a < 10000;
    ctx.strokeStyle = isMaj
      ? (isLow ? 'rgba(201,164,92,0.42)' : 'rgba(255,255,255,0.32)')
      : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = isMaj ? 0.75 : 0.5;
    const tl = isMaj ? 14 : 7;
    ctx.beginPath(); ctx.moveTo(x + w - tl - 1, fy); ctx.lineTo(x + w - 1, fy); ctx.stroke();
    if (isMaj) {
      const lbl = a >= 18000 ? `FL${Math.round(a / 100)}` : String(a);
      ctx.font = `8px ${MONO}`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillStyle = isLow ? 'rgba(201,164,92,0.5)' : C.text2;
      ctx.fillText(lbl, x + w - 18, fy);
    }
  }

  // NavAlt bug (info blue triangle, right edge)
  if (navAlt != null) {
    const bugY = cy - ((navAlt - alt) / RANGE) * (h / 2);
    const by   = Math.max(y + 4, Math.min(y + h - 4, bugY));
    ctx.fillStyle = C.info;
    ctx.beginPath();
    ctx.moveTo(x + w, by); ctx.lineTo(x + w - 9, by - 5); ctx.lineTo(x + w - 9, by + 5);
    ctx.closePath(); ctx.fill();
    // Off-scale arrow
    if (bugY < y || bugY > y + h) {
      ctx.font = `8px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(navAlt > alt + RANGE ? '▲' : '▼', x + w - 5, by);
    }
  }

  ctx.restore();

  // Current alt readout box
  const altDev200 = altDev != null && Math.abs(altDev) > 200;
  ctx.fillStyle = altDev200 ? 'rgba(232,144,90,0.90)' : 'rgba(196,160,88,0.90)';
  _rr(ctx, x, cy - 11, w, 22, 3); ctx.fill();
  const altStr = alt >= 18000 ? `FL${Math.round(alt / 100)}` : String(Math.round(alt / 100) * 100);
  _t(ctx, altStr, x + w / 2, cy, 11, '#000', 'center', '500');

  // Altitude deviation indicator
  if (altDev != null && Math.abs(altDev) > 50) {
    const devStr = `${altDev > 0 ? '+' : ''}${Math.round(altDev)}`;
    _t(ctx, devStr, x + w / 2, cy + 14, 6.5, altDev200 ? C.danger : C.text3, 'center', 'normal', MONO, 'top');
  }

  // Labels below tape
  _t(ctx, 'ALT  ft', x + w / 2, y + h + 5, 6.5, C.text3, 'center', 'normal', SANS, 'top');
  if (navAlt != null) {
    const navStr = navAlt >= 18000 ? `FL${Math.round(navAlt / 100)}` : String(Math.round(navAlt / 100) * 100);
    _t(ctx, `SEL ${navStr}`, x + w / 2, y + h + 13, 6.5, C.info, 'center', 'normal', SANS, 'top');
  }
}

// ── IAS Tape ──────────────────────────────────────────────────────────────────
function _iasTape(ctx, x, y, w, h, ias, isRealIas) {
  ctx.fillStyle = C.bgPanel; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = C.border; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, w, h);

  const cy = y + h / 2;
  const RANGE = 80, MINOR = 10, MAJOR = 20;

  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();

  const start = Math.max(0, Math.ceil((ias - RANGE) / MINOR) * MINOR);
  for (let s = start; s <= ias + RANGE; s += MINOR) {
    const fy = cy - ((s - ias) / RANGE) * (h / 2);
    if (fy < y || fy > y + h) continue;
    const isMaj = s % MAJOR === 0;
    ctx.strokeStyle = isMaj ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = isMaj ? 0.75 : 0.5;
    const tl = isMaj ? 14 : 7;
    ctx.beginPath(); ctx.moveTo(x + 1, fy); ctx.lineTo(x + tl + 1, fy); ctx.stroke();
    if (isMaj && s > 0) {
      ctx.font = `8px ${MONO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = C.text2;
      ctx.fillText(String(s), x + tl + 5, fy);
    }
  }
  ctx.restore();

  // Current IAS readout — info blue
  ctx.fillStyle = 'rgba(106,173,204,0.88)';
  _rr(ctx, x, cy - 11, w, 22, 3); ctx.fill();
  _t(ctx, String(Math.round(ias)), x + w / 2, cy, 11, '#fff', 'center', '500');

  // Label
  const lbl = isRealIas ? 'IAS  kt' : 'GS  kt';
  _t(ctx, lbl, x + w / 2, y + h + 5, 6.5, C.text3, 'center', 'normal', SANS, 'top');
}

// ── Heading Strip ─────────────────────────────────────────────────────────────
function _headingStrip(ctx, x, y, w, h, hdg, navHdg) {
  ctx.fillStyle = C.bgPanel;
  _rr(ctx, x, y, w, h, 4); ctx.fill();
  ctx.strokeStyle = C.border; ctx.lineWidth = 0.5;
  _rr(ctx, x, y, w, h, 4); ctx.stroke();

  const cx = x + w / 2, pxPerDeg = w / 60;
  const CARDS = { 0:'N', 45:'NE', 90:'E', 135:'SE', 180:'S', 225:'SW', 270:'W', 315:'NW' };

  ctx.save();
  ctx.beginPath(); ctx.rect(x + 1, y + 1, w - 2, h - 2); ctx.clip();

  for (let off = -35; off <= 35; off += 5) {
    const deg = ((hdg + off + 360) % 360);
    const px  = cx + off * pxPerDeg;
    if (px < x || px > x + w) continue;
    const isMaj = off % 10 === 0;
    const isCard = CARDS[deg] !== undefined;
    const isMainCard = deg % 90 === 0;

    ctx.strokeStyle = isMaj ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.10)';
    ctx.lineWidth = isMaj ? 0.75 : 0.5;
    const tickH = isMaj ? 10 : 5;
    ctx.beginPath(); ctx.moveTo(px, y + 2); ctx.lineTo(px, y + 2 + tickH); ctx.stroke();

    if (isMaj) {
      const lbl = isCard ? CARDS[deg] : String(Math.round(deg)).padStart(3, '0');
      ctx.font = isMainCard ? `600 9px ${MONO}` : `8px ${MONO}`;
      ctx.fillStyle = isMainCard ? C.accent : C.text2;
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(lbl, px, y + h - 5);
    }
  }

  // NavHdg bug — info blue triangle
  if (navHdg != null) {
    const bugOff = ((navHdg - hdg + 540) % 360) - 180;
    if (Math.abs(bugOff) <= 32) {
      const bx = cx + bugOff * pxPerDeg;
      ctx.fillStyle = C.info;
      ctx.beginPath();
      ctx.moveTo(bx, y + 3); ctx.lineTo(bx - 5, y + 13); ctx.lineTo(bx + 5, y + 13);
      ctx.closePath(); ctx.fill();
    }
  }

  ctx.restore();

  // Center marker (gold chevron above strip)
  ctx.fillStyle = C.accent;
  ctx.beginPath();
  ctx.moveTo(cx, y + 2); ctx.lineTo(cx - 3, y - 4); ctx.lineTo(cx + 3, y - 4);
  ctx.closePath(); ctx.fill();

  // Heading readout badge
  const bw = 46, bh = 17;
  ctx.fillStyle = C.accent;
  _rr(ctx, cx - bw / 2, y - bh - 4, bw, bh, 3); ctx.fill();
  _t(ctx, `${String(Math.round(hdg)).padStart(3,'0')}°`, cx, y - bh / 2 - 4, 10, '#000', 'center', '500');
}

// ── Bottom Bar ────────────────────────────────────────────────────────────────
function _bottomBar(ctx, W, H, barH, d, vs, mach, alt) {
  const y = H - barH;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, y, W, barH);
  ctx.save();
  ctx.strokeStyle = C.borderGold;
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  ctx.restore();

  const mid = y + barH * 0.44;
  const sub = y + barH * 0.76;

  // ── LEFT: VSI ──────────────────────────────────────────────────────────────
  const isClimb = vs > 80, isDescent = vs < -80;
  const vsCol   = isClimb ? C.accent : isDescent ? C.info : C.text2;
  const vsArrow = isClimb ? '▲' : isDescent ? '▼' : '—';
  _t(ctx, `${vsArrow} ${Math.abs(Math.round(vs))}`, 16, mid, 11, vsCol, 'left', '500');
  _t(ctx, 'V/SPD  fpm', 16, sub, 6.5, C.text3, 'left', 'normal', SANS);

  // ── LEFT+: Wind components ─────────────────────────────────────────────────
  const hw = d?.headwind, xw = d?.crosswind;
  if (hw != null && xw != null) {
    const hwStr = `${hw > 0 ? 'HW' : 'TW'} ${Math.abs(hw)}`;
    const xwStr = `XW ${Math.abs(Math.round(xw))}`;
    _t(ctx, hwStr, 110, mid - 3, 8.5, hw > 0 ? C.success : C.danger, 'left', 'normal');
    _t(ctx, xwStr, 110, mid + 7, 8.5, C.text2, 'left', 'normal');
    _t(ctx, 'WIND  kt', 110, sub, 6.5, C.text3, 'left', 'normal', SANS);
  }

  // ── CENTER: Route ───────────────────────────────────────────────────────────
  const orig = d?.origin || '???', dest = d?.destination || '???';
  _t(ctx, `${orig}  →  ${dest}`, W / 2, mid, 13, C.text, 'center', '500');

  // Sub: remaining nm + ETA
  const parts = [];
  const distKm = d?.distToDest, gsKts = d?.gsKts;
  if (distKm != null) {
    const nm = Math.round(distKm * 0.539957);
    parts.push(`${nm} nm`);
    if (gsKts && gsKts > 30) {
      const hrLeft = (distKm / 1.852) / gsKts;
      const eta = new Date(Date.now() + hrLeft * 3600000);
      parts.push(`ETA ${String(eta.getUTCHours()).padStart(2,'0')}:${String(eta.getUTCMinutes()).padStart(2,'0')}Z`);
    }
  }
  // TOD indicator
  if (d?.todNm != null && d.todNm > 0) {
    parts.push(`TOD ${d.todNm}nm`);
  } else if (d?.todNm === 0) {
    parts.push('DESCEND NOW');
  }
  if (parts.length) _t(ctx, parts.join('  ·  '), W / 2, sub, 6.5, C.text2, 'center', 'normal', SANS);

  // ── RIGHT: Mach / GS / Squawk ──────────────────────────────────────────────
  const showMach = mach != null && mach > 0.15 && alt > 10000;
  if (showMach) {
    _t(ctx, `M${mach.toFixed(3)}`, W - 16, mid, 11, alt > 25000 ? C.info : C.text2, 'right', '500');
    _t(ctx, 'MACH', W - 16, sub, 6.5, C.text3, 'right', 'normal', SANS);
  } else if (gsKts != null) {
    _t(ctx, `${Math.round(gsKts)} kt`, W - 16, mid, 11, C.text2, 'right', '500');
    _t(ctx, 'GS', W - 16, sub, 6.5, C.text3, 'right', 'normal', SANS);
  }

  // RVSM status
  if (d?.rvsm) {
    const rvsm = d.rvsm;
    _t(ctx, `RVSM ${rvsm}`, W - 16, y + 7, 6.5, rvsm === 'OK' ? 'rgba(82,168,108,0.55)' : C.danger, 'right', 'normal', MONO, 'top');
  }
  // Squawk
  if (d?.squawk) {
    const sqkX = showMach || gsKts != null ? W - 80 : W - 16;
    _t(ctx, `SQK ${d.squawk}`, sqkX, y + 7, 6.5, 'rgba(196,160,88,0.42)', 'right', 'normal', MONO, 'top');
  }

  // ── Origin country (far left, small) ───────────────────────────────────────
  if (d?.originCountry && d.originCountry !== '--') {
    _t(ctx, d.originCountry.toUpperCase(), 16, y + 7, 6.5, C.text3, 'left', 'normal', SANS, 'top');
  }
}
