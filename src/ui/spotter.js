// --- Spotter System ---
// Core rule: ONLY clicking on an aircraft counts as "spotting".
// Passive data loading does nothing for score/achievements.

const METERS_TO_FEET = 3.28084;
const MS_TO_KMH = 3.6;

// --- Rarity tiers: XP awarded per spot ---
const RARITY = {
  LEGENDARY: { xp: 200, label: 'LEGENDARY', color: '#ffd700' },
  EPIC:      { xp: 100, label: 'EPIC',      color: '#a855f7' },
  RARE:      { xp: 50,  label: 'RARE',      color: '#3b82f6' },
  UNCOMMON:  { xp: 20,  label: 'UNCOMMON',  color: '#22c55e' },
  COMMON:    { xp: 5,   label: 'COMMON',    color: '#94a3b8' },
};

const LEGENDARY_TYPES = new Set(['A388','A380','B748','CONC']);
const EPIC_TYPES = new Set(['B744','B743','B742','B741','A342','A343','A345','A346','AN22','AN24','C5M','C17','B52H','A400']);
const RARE_TYPES = new Set(['A35K','A359','A339','A338','B78X','B789','B77W','B77L','GLF6','GL7T','GLEX','C700','FA8X']);
const UNCOMMON_TYPES = new Set(['B788','B773','B772','A333','A332','B763','B764','E295','E290','BCS3','BCS1','C680','C68A','GLF5','GLF4','FA7X','C56X']);

function getRarity(typeCode) {
  if (!typeCode) return RARITY.COMMON;
  const t = typeCode.toUpperCase();
  if (LEGENDARY_TYPES.has(t)) return RARITY.LEGENDARY;
  if (EPIC_TYPES.has(t)) return RARITY.EPIC;
  if (RARE_TYPES.has(t)) return RARITY.RARE;
  if (UNCOMMON_TYPES.has(t)) return RARITY.UNCOMMON;
  return RARITY.COMMON;
}

// --- Streak system ---
const STREAK_WINDOW = 30_000; // 30s between spots to keep streak alive
const STREAK_MULTIPLIERS = [1, 1, 1.5, 2, 2.5, 3]; // multiplier at streak 0,1,2,3,4,5+

function getStreakMultiplier(streak) {
  return STREAK_MULTIPLIERS[Math.min(streak, STREAK_MULTIPLIERS.length - 1)];
}

// --- State ---
const state = {
  xp: 0,
  level: 1,
  spotted: new Set(),       // icao24s user has clicked on
  types: new Set(),         // unique type codes spotted
  airlines: new Set(),      // unique airline prefixes
  streak: 0,
  lastSpotTime: 0,
  followSeconds: 0,         // total seconds spent in follow mode
  challengesCompleted: 0,
  maxAltSpotted: 0,         // ft
  maxSpeedSpotted: 0,       // km/h
  closestSpotted: Infinity, // km
  unlockedIds: new Set(),
};

// --- Levels: XP thresholds ---
const LEVEL_THRESHOLDS = [
  0, 50, 150, 350, 700, 1200, 2000, 3200, 5000, 8000, 12000, 18000, 25000,
];

function calcLevel(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function xpForNextLevel(xp) {
  const lvl = calcLevel(xp);
  if (lvl >= LEVEL_THRESHOLDS.length) return null;
  return LEVEL_THRESHOLDS[lvl];
}

// --- Achievements (require deliberate action) ---
const ACHIEVEMENTS = [
  // Spotting milestones
  { id: 'spot_10',       label: 'SPOTTER',            desc: 'Manually spot 10 aircraft',             xp: 100,  check: s => s.spotted.size >= 10 },
  { id: 'spot_30',       label: 'RADAR OPERATOR',     desc: 'Manually spot 30 aircraft',             xp: 200,  check: s => s.spotted.size >= 30 },
  { id: 'spot_75',       label: 'AIR TRAFFIC CONTROL',desc: 'Manually spot 75 aircraft',             xp: 500,  check: s => s.spotted.size >= 75 },
  // Type collection
  { id: 'types_8',       label: 'TYPE COLLECTOR',     desc: 'Spot 8 unique aircraft types',          xp: 150,  check: s => s.types.size >= 8 },
  { id: 'types_20',      label: 'FLEET SPOTTER',      desc: 'Spot 20 unique aircraft types',         xp: 400,  check: s => s.types.size >= 20 },
  // Rarity hunts
  { id: 'rare_1',        label: 'RARE FIND',          desc: 'Spot a RARE or higher aircraft',        xp: 100,  check: s => s._lastRarity && ['RARE','EPIC','LEGENDARY'].includes(s._lastRarity) },
  { id: 'epic_1',        label: 'EPIC ENCOUNTER',     desc: 'Spot an EPIC or LEGENDARY aircraft',    xp: 200,  check: s => s._lastRarity && ['EPIC','LEGENDARY'].includes(s._lastRarity) },
  { id: 'legendary_1',   label: 'WHITE WHALE',        desc: 'Spot a LEGENDARY aircraft (A380/B748)', xp: 500,  check: s => s._lastRarity === 'LEGENDARY' },
  // Streaks
  { id: 'streak_3',      label: 'TRIPLE TAP',         desc: 'Reach a 3x spot streak',                xp: 100,  check: s => s.streak >= 3 },
  { id: 'streak_5',      label: 'ON FIRE',            desc: 'Reach a 5x spot streak',                xp: 250,  check: s => s.streak >= 5 },
  // Airlines
  { id: 'airlines_8',    label: 'AIRLINE BINGO',      desc: 'Spot 8 different airlines',             xp: 150,  check: s => s.airlines.size >= 8 },
  { id: 'airlines_20',   label: 'GLOBAL NETWORK',     desc: 'Spot 20 different airlines',            xp: 400,  check: s => s.airlines.size >= 20 },
  // Follow mode
  { id: 'follow_120',    label: 'SHADOW',             desc: 'Track an aircraft for 2+ minutes',      xp: 150,  check: s => s.followSeconds >= 120 },
  { id: 'follow_300',    label: 'ESCORT',             desc: 'Track an aircraft for 5+ minutes',      xp: 300,  check: s => s.followSeconds >= 300 },
  // Extremes — user must click on these aircraft, not just see them on screen
  { id: 'high_alt',      label: 'STRATOSPHERE',       desc: 'Spot an aircraft above 40,000 ft',      xp: 200,  check: s => s.maxAltSpotted >= 40000 },
  { id: 'fast',          label: 'SPEED DEMON',        desc: 'Spot an aircraft above 900 km/h',       xp: 200,  check: s => s.maxSpeedSpotted >= 900 },
  { id: 'close',         label: 'OVERHEAD',           desc: 'Spot an aircraft within 10 km',         xp: 200,  check: s => s.closestSpotted <= 10 },
  // Challenges
  { id: 'challenge_3',   label: 'MISSION READY',      desc: 'Complete 3 challenges',                 xp: 300,  check: s => s.challengesCompleted >= 3 },
  { id: 'challenge_10',  label: 'MISSION MASTER',     desc: 'Complete 10 challenges',                xp: 600,  check: s => s.challengesCompleted >= 10 },
];

// --- Active Challenge System ---
const CHALLENGE_TYPES = [
  {
    generate: (liveTypes) => {
      // "Find and spot a [type]" — pick a type currently on screen user hasn't spotted
      const unspotted = liveTypes.filter(t => t && !state.types.has(t));
      if (unspotted.length === 0) return null;
      const target = unspotted[Math.floor(Math.random() * unspotted.length)];
      return { type: 'find_type', target, label: `FIND: ${target}`, desc: `Spot a ${target} aircraft`, duration: 180_000, check: () => state._lastSpottedType === target };
    },
  },
  {
    generate: () => {
      // "Spot 3 aircraft in 60 seconds"
      const needed = 3;
      const startCount = state.spotted.size;
      return { type: 'speed_spot', label: `SPEED: ${needed} SPOTS`, desc: `Spot ${needed} new aircraft in 60s`, duration: 60_000, check: () => state.spotted.size - startCount >= needed };
    },
  },
  {
    generate: () => {
      // "Spot 3 different types in 3 minutes"
      const needed = 3;
      const startTypes = new Set(state.types);
      return { type: 'type_variety', label: `VARIETY: ${needed} TYPES`, desc: `Spot ${needed} new types in 3 min`, duration: 180_000, check: () => {
        let newTypes = 0;
        for (const t of state.types) { if (!startTypes.has(t)) newTypes++; }
        return newTypes >= needed;
      }};
    },
  },
  {
    generate: () => {
      // "Build a 3x streak"
      return { type: 'streak', label: 'STREAK: x3', desc: 'Reach a 3x spot streak', duration: 120_000, check: () => state.streak >= 3 };
    },
  },
  {
    generate: () => {
      // "Track an aircraft for 60 seconds"
      const startFollow = state.followSeconds;
      return { type: 'track', label: 'TRACK: 60s', desc: 'Follow-track an aircraft for 60s', duration: 120_000, check: () => state.followSeconds - startFollow >= 60 };
    },
  },
  {
    generate: () => {
      // "Spot a high-altitude aircraft (above 35,000 ft)"
      return { type: 'high_alt', label: 'HIGH FLYER', desc: 'Spot an aircraft above 35,000 ft', duration: 180_000, check: () => state._lastAltFt >= 35000 };
    },
  },
  {
    generate: () => {
      // "Spot aircraft from 3 different airlines"
      const needed = 3;
      const startAirlines = new Set(state.airlines);
      return { type: 'airline_hunt', label: `AIRLINES: ${needed}`, desc: `Spot ${needed} new airlines in 3 min`, duration: 180_000, check: () => {
        let n = 0;
        for (const a of state.airlines) { if (!startAirlines.has(a)) n++; }
        return n >= needed;
      }};
    },
  },
];

let activeChallenge = null; // { ...challenge, startTime, duration }
let challengeCooldown = 0;
const CHALLENGE_COOLDOWN = 15_000; // 15s between challenges
const CHALLENGE_SUCCESS_XP = 150;

function tryGenerateChallenge(liveTypes) {
  if (activeChallenge) return;
  if (Date.now() < challengeCooldown) return;
  if (state.spotted.size < 3) return; // need a few spots before first challenge

  // Shuffle and try to generate
  const shuffled = [...CHALLENGE_TYPES].sort(() => Math.random() - 0.5);
  for (const ct of shuffled) {
    const ch = ct.generate(liveTypes);
    if (ch) {
      activeChallenge = { ...ch, startTime: Date.now() };
      updateChallengeDisplay();
      return;
    }
  }
}

function checkChallenge() {
  if (!activeChallenge) return;
  const elapsed = Date.now() - activeChallenge.startTime;

  if (activeChallenge.check()) {
    // Success
    state.challengesCompleted++;
    awardXP(CHALLENGE_SUCCESS_XP, 'CHALLENGE COMPLETE');
    playSound('success');
    activeChallenge = null;
    challengeCooldown = Date.now() + CHALLENGE_COOLDOWN;
    updateChallengeDisplay();
    return;
  }

  if (elapsed >= activeChallenge.duration) {
    // Failed — expired
    showToast({ label: 'MISSION FAILED', desc: activeChallenge.desc, xp: 0, failed: true });
    activeChallenge = null;
    challengeCooldown = Date.now() + CHALLENGE_COOLDOWN;
    updateChallengeDisplay();
  }
}

// --- Core: Spot an aircraft (called ONLY on user click) ---
export function spotAircraft(displayData, userLat, userLon) {
  if (!displayData || !displayData.icao24) return;

  const isNew = !state.spotted.has(displayData.icao24);
  state.spotted.add(displayData.icao24);

  if (!isNew) {
    // Re-clicking same aircraft — no XP, but still check challenge
    checkChallenge();
    return;
  }

  // Streak
  const now = Date.now();
  if (now - state.lastSpotTime < STREAK_WINDOW) {
    state.streak++;
  } else {
    state.streak = 1;
  }
  state.lastSpotTime = now;

  // Type
  const typeCode = displayData.aircraftType;
  state._lastSpottedType = typeCode ? typeCode.toUpperCase() : null;
  if (typeCode) state.types.add(typeCode.toUpperCase());

  // Airline
  const cs = (displayData.callsign || '').replace(/\s/g, '');
  if (cs.length >= 3) {
    const airline = cs.slice(0, 3);
    if (/^[A-Z]{3}$/.test(airline)) state.airlines.add(airline);
  }

  // Flight stats for this click
  const altRaw = displayData._rawAlt; // baroAltitude in meters
  const spdRaw = displayData._rawSpd; // velocity in m/s
  const altFt = altRaw != null ? altRaw * METERS_TO_FEET : 0;
  const spdKmh = spdRaw != null ? spdRaw * MS_TO_KMH : 0;
  state._lastAltFt = altFt;
  if (altFt > state.maxAltSpotted) state.maxAltSpotted = altFt;
  if (spdKmh > state.maxSpeedSpotted) state.maxSpeedSpotted = spdKmh;

  // Distance
  if (displayData.latitude != null && displayData.longitude != null) {
    const dist = haversine(userLat, userLon, displayData.latitude, displayData.longitude);
    if (dist < state.closestSpotted) state.closestSpotted = dist;
  }

  // Rarity & XP
  const rarity = getRarity(typeCode);
  state._lastRarity = rarity.label;
  const multiplier = getStreakMultiplier(state.streak);
  const xpGained = Math.round(rarity.xp * multiplier);

  awardXP(xpGained, null, rarity, multiplier);

  // Check achievements
  checkAchievements();

  // Check active challenge
  checkChallenge();
}

// --- Follow mode tracking ---
let _followStart = 0;
let _followInterval = null;

export function onFollowStart() {
  _followStart = Date.now();
  _followInterval = setInterval(() => {
    state.followSeconds = Math.floor((Date.now() - _followStart) / 1000) + (state._prevFollowSeconds || 0);
    checkAchievements();
    checkChallenge();
  }, 1000);
}

export function onFollowStop() {
  if (_followInterval) {
    clearInterval(_followInterval);
    _followInterval = null;
  }
  if (_followStart) {
    state._prevFollowSeconds = state.followSeconds;
    _followStart = 0;
  }
}

// --- Update live data for challenges (passive, no XP) ---
let _liveTypes = [];

export function updateLiveData(dataList) {
  _liveTypes = dataList.map(ac => ac.aircraftType).filter(Boolean);
  tryGenerateChallenge(_liveTypes);
  checkChallenge();
}

// --- XP & Level ---
function awardXP(amount, reason, rarity, multiplier) {
  state.xp += amount;
  const newLevel = calcLevel(state.xp);
  if (newLevel > state.level) {
    state.level = newLevel;
    showToast({ label: `LEVEL ${newLevel}`, desc: 'Spotter rank up!', xp: 0, levelUp: true });
    playSound('levelup');
  }

  // Show spot feedback
  showSpotFeedback(amount, rarity, multiplier);
  updateDisplay();
}

// --- Achievement check ---
function checkAchievements() {
  for (const ach of ACHIEVEMENTS) {
    if (!state.unlockedIds.has(ach.id) && ach.check(state)) {
      state.unlockedIds.add(ach.id);
      state.xp += ach.xp;
      showToast(ach);
      playSound('achievement');
    }
  }
  const newLevel = calcLevel(state.xp);
  if (newLevel > state.level) {
    state.level = newLevel;
    showToast({ label: `LEVEL ${newLevel}`, desc: 'Spotter rank up!', xp: 0, levelUp: true });
    playSound('levelup');
  }
  updateDisplay();
}

// --- UI: Score display ---
function updateDisplay() {
  const elScore = document.getElementById('spotter-score');
  const elLevel = document.getElementById('spotter-level');
  const elCount = document.getElementById('spotter-count');
  const elTypes = document.getElementById('spotter-types');
  const elStreak = document.getElementById('spotter-streak');
  const elXpBar = document.getElementById('spotter-xp-fill');

  if (elScore) elScore.textContent = state.xp;
  if (elLevel) elLevel.textContent = `LV${state.level}`;
  if (elCount) elCount.textContent = state.spotted.size;
  if (elTypes) elTypes.textContent = state.types.size;
  if (elStreak) {
    if (state.streak >= 2) {
      elStreak.textContent = `x${state.streak}`;
      elStreak.classList.add('active');
    } else {
      elStreak.textContent = '';
      elStreak.classList.remove('active');
    }
  }

  // XP bar progress
  if (elXpBar) {
    const nextXp = xpForNextLevel(state.xp);
    if (nextXp) {
      const prevXp = LEVEL_THRESHOLDS[state.level - 1] || 0;
      const pct = ((state.xp - prevXp) / (nextXp - prevXp)) * 100;
      elXpBar.style.width = `${Math.min(pct, 100)}%`;
    } else {
      elXpBar.style.width = '100%';
    }
  }
}

// --- UI: Challenge display ---
let challengeTimerInterval = null;

function updateChallengeDisplay() {
  const el = document.getElementById('challenge-panel');
  if (!el) return;

  if (!activeChallenge) {
    el.classList.add('hidden');
    if (challengeTimerInterval) { clearInterval(challengeTimerInterval); challengeTimerInterval = null; }
    return;
  }

  el.classList.remove('hidden');
  el.querySelector('.challenge-label').textContent = activeChallenge.label;
  el.querySelector('.challenge-desc').textContent = activeChallenge.desc;

  // Timer update
  if (challengeTimerInterval) clearInterval(challengeTimerInterval);
  challengeTimerInterval = setInterval(() => {
    if (!activeChallenge) return;
    const remaining = Math.max(0, activeChallenge.duration - (Date.now() - activeChallenge.startTime));
    const sec = Math.ceil(remaining / 1000);
    const timerEl = el.querySelector('.challenge-timer');
    if (timerEl) {
      timerEl.textContent = `${sec}s`;
      timerEl.classList.toggle('urgent', sec <= 15);
    }
    if (remaining <= 0) checkChallenge();
  }, 500);
}

// --- UI: Spot feedback (floating +XP) ---
function showSpotFeedback(xp, rarity, multiplier) {
  const container = document.getElementById('spot-feedback');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'spot-xp-pop';
  let text = `+${xp} XP`;
  if (rarity && rarity.label !== 'COMMON') text += ` ${rarity.label}`;
  if (multiplier && multiplier > 1) text += ` x${multiplier}`;
  el.textContent = text;
  el.style.color = rarity ? rarity.color : '#94a3b8';

  container.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

// --- Toast ---
let toastQueue = [];
let currentToast = null;
let toastTimeout = null;

function showToast(data) {
  toastQueue.push(data);
  if (!currentToast) drainToast();
}

function drainToast() {
  if (toastQueue.length === 0) { currentToast = null; return; }
  const data = toastQueue.shift();
  currentToast = data;

  const el = document.getElementById('toast');
  if (!el) return;

  const icon = el.querySelector('.toast-icon');
  const title = el.querySelector('.toast-title');
  const desc = el.querySelector('.toast-desc');
  const pts = el.querySelector('.toast-points');

  if (data.failed) {
    icon.textContent = '\u2716'; // X
    icon.style.color = '#ef4444';
    title.style.color = '#ef4444';
  } else if (data.levelUp) {
    icon.textContent = '\u2B06'; // up arrow
    icon.style.color = '#ffd700';
    title.style.color = '#ffd700';
  } else {
    icon.textContent = '\u2733'; // star
    icon.style.color = '#ffd700';
    title.style.color = '#ffd700';
  }

  title.textContent = data.label;
  desc.textContent = data.desc;
  pts.textContent = data.xp > 0 ? `+${data.xp} XP` : '';

  el.classList.remove('hidden');
  el.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.classList.remove('show');
    el.classList.add('hidden');
    setTimeout(drainToast, 300);
  }, 3000);
}

// --- Sound ---
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
  }
  return _audioCtx;
}

function playSound(type) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t = ctx.currentTime;

  if (type === 'achievement') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1760, t + 0.15);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t); osc.stop(t + 0.4);
  } else if (type === 'success') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.2);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.start(t); osc.stop(t + 0.5);
  } else if (type === 'levelup') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(1760, t + 0.35);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.start(t); osc.stop(t + 0.6);
  }
}

// --- Haversine ---
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
