// ── Read the sky, and Ground School ──
// Two ways of learning the vocabulary from the thing in front of you rather
// than from a slide. "Read the sky" (L) draws a leader line from six or seven
// real objects on screen to one line each, and leaves at the first touch.
// Ground School (T) is six short lessons, each anchored to a real object on
// the live map, each with one question. Progress is kept in the browser.
import * as THREE from 'three';

let _camera = null, _canvas = null, _get = null;
let _legendEl = null, _cardEl = null;
let _legendActive = false, _legendUntil = 0;
let _raf = null;
let _lesson = -1;
let _state = { done: [], correct: 0 };
let _answered = null; // index chosen for the current lesson

const NM = 1 / 1.5; // scene units per nautical mile

const LESSONS = [
  {
    id: 'heard', anchor: 'fast', title: 'How an aircraft is heard',
    body: 'Every aircraft you see is broadcasting its own position, a thousand times an hour, on a frequency anyone can receive. Volunteers with a small antenna on a roof pass it on. Nothing here comes from an airline or an authority: it comes from the aircraft, through people.',
    q: 'Where does the position of the aircraft on this map come from?',
    options: ['The airline\'s own tracking system', 'The aircraft itself, received by volunteers', 'Radar operated by air traffic control'],
    answer: 1,
  },
  {
    id: 'runway', anchor: 'threshold', title: 'Reading a runway number',
    body: 'A runway is named by its magnetic heading, rounded to tens and with the last zero dropped: 13 points roughly 130 degrees. Parallel runways add L, C or R. The other end of the same strip is the reciprocal -- 13R from one end is 31L from the other.',
    q: 'An aircraft lands on runway 04L. Roughly which way is it pointing?',
    options: ['About 40 degrees, north-east', 'About 400 metres from the terminal', 'Due north, on the left side of the field'],
    answer: 0,
  },
  {
    id: 'fix', anchor: 'fix', title: 'Named points in the air',
    body: 'The small triangles with five-letter names are fixes: invisible points in the sky, defined by coordinates, that pilots and controllers use to say where an aircraft should go. A pilot is told to fly to ROBER the way you would be told to turn at a street.',
    q: 'What is a fix?',
    options: ['A repair scheduled for the runway', 'A point in the sky defined by coordinates and given a name', 'A radio beacon on the ground'],
    answer: 1,
  },
  {
    id: 'trail', anchor: 'fast', title: 'What the trail colour says',
    body: 'The line behind an aircraft is where it has been; its colour is how fast it was going. Cool colours are slow -- taxiing, or on final approach -- warm colours are cruise speed, four to five hundred knots. A trail that turns from warm to cool is an arrival.',
    q: 'A trail changes from orange to green as it nears the airport. The aircraft is',
    options: ['Climbing out after take-off', 'Slowing down to land', 'Circling in a holding pattern'],
    answer: 1,
  },
  {
    id: 'unseen', anchor: 'ring', title: 'The ones that asked not to be seen',
    body: 'A ringed aircraft has asked, through an FAA programme, that its identity not be published. You can see where it is, hear its tower, and read its type and altitude; the name is withheld. There is no such programme in Europe -- in an American sky about one in ten asks; in a European one almost none can.',
    q: 'What can you learn about a ringed aircraft on this map?',
    options: ['Nothing at all -- it is hidden', 'Its position, altitude and type, but not its name', 'Its owner\'s name, but not where it is'],
    answer: 1,
  },
  {
    id: 'ring', anchor: 'ring25', title: 'Distance is in nautical miles',
    body: 'The faint circles are 10, 25 and 50 nautical miles from the airport. Aviation uses nautical miles because one is one minute of latitude, so distance and position share a unit. A jet at cruise crosses the 25-mile ring in about three minutes.',
    q: 'One nautical mile is',
    options: ['One minute of latitude', 'Exactly one kilometre', 'The length of a runway'],
    answer: 0,
  },
];

export function initSchool(opts) {
  _camera = opts.camera; _canvas = opts.canvas; _get = opts;
  _legendEl = document.getElementById('sky-legend');
  _cardEl = document.getElementById('school-card');
  try { _state = JSON.parse(localStorage.getItem('stratum:school') || 'null') || _state; } catch {}
  const stop = () => { if (_legendActive) hideLegend(); };
  window.addEventListener('pointerdown', stop, true);
  window.addEventListener('wheel', stop, { passive: true, capture: true });
  window.addEventListener('keydown', (e) => { if (_legendActive && e.key !== 'k' && e.key !== 'K') hideLegend(); }, true);
}

// ── Landmarks: real objects on screen, one per kind ──
function _landmarks() {
  const out = [];
  const seen = new Set();
  const push = (kind, pos, title, text) => { if (pos && !seen.has(kind)) { seen.add(kind); out.push({ kind, pos, title, text }); } };
  const fixes = _get.getFixes?.() || [];
  const fix = fixes.slice().sort((a, b) => a.pos.lengthSq() - b.pos.lengthSq()).find((f) => /^[A-Z]{5}$/.test(f.name));
  if (fix) push('fix', fix.pos, `▲ ${fix.name}`, 'a named point in the sky pilots are told to fly to');
  const thr = (_get.getThresholds?.() || []).find((m) => m.userData?.runwayThreshold?.designator);
  if (thr) { const d = thr.userData.runwayThreshold; push('threshold', thr.position, `${d.designator}`, `runway heading about ${d.heading}°${/[LRC]$/.test(d.designator) ? ', one of a parallel pair' : ''}`); }
  const nav = (_get.getNavaids?.() || []).find((m) => /VOR/.test(m.userData?.navaid?.type || ''));
  if (nav) push('vor', nav.position, `${nav.userData.navaid.ident} VOR`, 'a ground beacon; headings are measured from it');
  const acs = _get.getAircraft?.() || [];
  let fast = null, fastV = 250 / 1.944; // > 250 kt
  let ring = null;
  for (const a of acs) {
    if (a.fadingOut) continue;
    if ((a.data.velocity || 0) > fastV && !a.data.masked) { fastV = a.data.velocity; fast = a; }
    if (a.data.masked && a._ghostRing && !ring) ring = a;
  }
  if (fast) push('fast', fast.group.position, `${fast.data.callsign || fast.data.icao24}`, `${Math.round(fast.data.velocity * 1.944)} kt — the trail colour is speed; warm is cruise`);
  if (ring) push('ring', ring.group.position, '○ unseen', 'asked not to be shown: position public, name withheld');
  if (_get.getRingsVisible?.()) push('ring25', new THREE.Vector3(25 * NM * 0.7, 0.05, 25 * NM * 0.7), '25 nm', 'distance rings are in nautical miles — one minute of latitude');
  return out.slice(0, 7);
}

function _project(pos) {
  const v = pos.clone().project(_camera);
  const r = _canvas.getBoundingClientRect();
  return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height, front: v.z < 1 };
}

// ── Legend ──
export function toggleSkyLegend() { if (_legendActive) hideLegend(); else showLegend(); }
function showLegend() {
  if (!_legendEl) return;
  const marks = _landmarks();
  if (!marks.length) return;
  _legendActive = true; _legendUntil = performance.now() + 12000;
  _legendEl.classList.remove('hidden');
  _legendEl.innerHTML = '<svg class="sky-legend-lines"></svg>' + marks.map((m, i) => `<div class="sky-cap" data-i="${i}"><b>${m.title}</b><span>${m.text}</span></div>`).join('');
  _legendEl._marks = marks;
  _tick();
}
function hideLegend() {
  _legendActive = false;
  if (_legendEl) { _legendEl.classList.add('hidden'); _legendEl.innerHTML = ''; }
}
function _layout(el, marks) {
  const svg = el.querySelector('svg');
  const caps = el.querySelectorAll('.sky-cap');
  const W = window.innerWidth, H = window.innerHeight;
  const slotsL = [], slotsR = [];
  const pts = marks.map((m) => _project(m.pos));
  // captions sit in two columns at the screen's sides, ordered by the point's y
  const order = pts.map((p, i) => i).sort((a, b) => pts[a].y - pts[b].y);
  let lines = '';
  for (const i of order) {
    const p = pts[i], cap = caps[i];
    const right = p.x > W / 2;
    const col = right ? slotsR : slotsL;
    let y = Math.max(90, Math.min(H - 80, p.y));
    while (col.some((cy) => Math.abs(cy - y) < 48)) y += 48;
    col.push(y);
    const x = right ? W - 300 : 300;
    cap.style.left = `${right ? x : x - 260}px`; cap.style.top = `${y - 18}px`;
    cap.style.textAlign = right ? 'left' : 'right';
    const ax = right ? x - 8 : x + 8;
    cap.style.opacity = p.front ? '1' : '0';
    if (p.front) lines += `<line x1="${p.x}" y1="${p.y}" x2="${ax}" y2="${y}"/><circle cx="${p.x}" cy="${p.y}" r="3.5"/>`;
  }
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.innerHTML = lines;
}
function _tick() {
  if (_raf) cancelAnimationFrame(_raf);
  const step = () => {
    if (_legendActive && _legendEl) {
      if (performance.now() > _legendUntil) { hideLegend(); }
      else _layout(_legendEl, _legendEl._marks);
    }
    if (_lesson >= 0 && _cardEl && _cardEl._mark) _layoutCardLine();
    if (_legendActive || _lesson >= 0) _raf = requestAnimationFrame(step); else _raf = null;
  };
  _raf = requestAnimationFrame(step);
}

// ── Ground School ──
export function toggleSchool() { if (_lesson >= 0) closeSchool(); else openSchool(); }
function openSchool() {
  if (!_cardEl) return;
  const next = LESSONS.findIndex((l) => !_state.done.includes(l.id));
  _lesson = next === -1 ? 0 : next;
  _renderLesson();
  _tick();
}
export function closeSchool() {
  _lesson = -1; _answered = null;
  if (_cardEl) { _cardEl.classList.add('hidden'); _cardEl.innerHTML = ''; _cardEl._mark = null; }
  const line = document.getElementById('school-line'); if (line) line.innerHTML = '';
}
function _save() { try { localStorage.setItem('stratum:school', JSON.stringify(_state)); } catch {} }
function _renderLesson() {
  const L = LESSONS[_lesson];
  const marks = _landmarks();
  const mark = marks.find((m) => m.kind === L.anchor) || null;
  _cardEl._mark = mark;
  _answered = null;
  const done = _state.done.length, total = LESSONS.length;
  _cardEl.innerHTML = `
    <div class="school-head"><span class="school-kicker">Ground school · ${_lesson + 1} / ${total}</span><button type="button" class="school-x" aria-label="Close">×</button></div>
    <div class="school-title">${L.title}</div>
    <div class="school-body">${L.body}${mark ? '' : ' <em>(nothing of this kind is on screen right now)</em>'}</div>
    <div class="school-q">${L.q}</div>
    <div class="school-opts">${L.options.map((o, i) => `<button type="button" class="school-opt" data-i="${i}"><kbd>${i + 1}</kbd>${o}</button>`).join('')}</div>
    <div class="school-fb" id="school-fb"></div>
    <div class="school-nav"><button type="button" class="school-btn" data-nav="-1" ${_lesson === 0 ? 'disabled' : ''}>← Previous</button><span class="school-score">${done} of ${total} done · ${_state.correct} right</span><button type="button" class="school-btn" data-nav="1">${_lesson === total - 1 ? 'Finish' : 'Next →'}</button></div>`;
  _cardEl.classList.remove('hidden');
  _cardEl.querySelector('.school-x').onclick = closeSchool;
  _cardEl.querySelectorAll('.school-opt').forEach((b) => b.onclick = () => _answer(+b.dataset.i));
  _cardEl.querySelectorAll('.school-btn').forEach((b) => b.onclick = () => _go(+b.dataset.nav));
}
function _answer(i) {
  if (_answered !== null) return;
  const L = LESSONS[_lesson];
  _answered = i;
  const ok = i === L.answer;
  _cardEl.querySelectorAll('.school-opt').forEach((b, j) => {
    b.classList.toggle('is-right', j === L.answer);
    b.classList.toggle('is-wrong', j === i && !ok);
    b.disabled = true;
  });
  const fb = document.getElementById('school-fb');
  if (fb) fb.textContent = ok ? 'Right.' : `Not quite — ${L.options[L.answer]}.`;
  if (!_state.done.includes(L.id)) { _state.done.push(L.id); if (ok) _state.correct++; _save(); }
  const sc = _cardEl.querySelector('.school-score');
  if (sc) sc.textContent = `${_state.done.length} of ${LESSONS.length} done · ${_state.correct} right`;
}
function _go(dir) {
  const n = _lesson + dir;
  if (n >= LESSONS.length) { closeSchool(); return; }
  if (n < 0) return;
  _lesson = n; _renderLesson();
}
export function schoolKey(e) {
  if (_lesson < 0) return false;
  if (e.key === 'Escape') { closeSchool(); return true; }
  if (/^[1-3]$/.test(e.key)) { _answer(+e.key - 1); return true; }
  if (e.key === 'ArrowRight' || e.key === 'Enter') { _go(1); return true; }
  if (e.key === 'ArrowLeft') { _go(-1); return true; }
  return false;
}
function _layoutCardLine() {
  let svg = document.getElementById('school-line');
  if (!svg) return;
  const m = _cardEl._mark; if (!m) { svg.innerHTML = ''; return; }
  const p = _project(m.pos);
  const r = _cardEl.getBoundingClientRect();
  const W = window.innerWidth, H = window.innerHeight;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = p.front ? `<line x1="${p.x}" y1="${p.y}" x2="${r.left + r.width / 2}" y2="${r.top}"/><circle cx="${p.x}" cy="${p.y}" r="4"/>` : '';
}
export function isSchoolOpen() { return _lesson >= 0; }
