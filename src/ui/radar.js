// --- Radar Minimap ---

const RADAR_SIZE = 140;
const RADAR_RANGE_KM = 150;
const DEG_TO_RAD = Math.PI / 180;

let canvas, ctx;
let sweepAngle = 0;
let blips = [];
let onBlipClick = null;

export function initRadar(clickCallback) {
  canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  canvas.width = RADAR_SIZE * 2;
  canvas.height = RADAR_SIZE * 2;
  ctx = canvas.getContext('2d');
  onBlipClick = clickCallback;

  canvas.addEventListener('click', (e) => {
    if (!onBlipClick) return;
    const rect = canvas.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * RADAR_SIZE * 2;
    const sy = ((e.clientY - rect.top) / rect.height) * RADAR_SIZE * 2;
    const cx = RADAR_SIZE, cy = RADAR_SIZE;

    let closest = null;
    let closestDist = 20;
    for (const b of blips) {
      const bx = cx + b.x * (RADAR_SIZE - 10);
      const by = cy + b.y * (RADAR_SIZE - 10);
      const d = Math.hypot(sx - bx, sy - by);
      if (d < closestDist) { closestDist = d; closest = b; }
    }
    if (closest) onBlipClick(closest.icao24);
  });
}

export function updateRadarBlips(aircraftList, userLat, userLon, heading) {
  blips = [];
  for (const ac of aircraftList) {
    if (ac.latitude == null || ac.longitude == null) continue;
    const dLat = (ac.latitude - userLat) * 111;
    const dLon = (ac.longitude - userLon) * 111 * Math.cos(userLat * DEG_TO_RAD);
    const dist = Math.hypot(dLat, dLon);
    if (dist > RADAR_RANGE_KM) continue;
    const bearing = Math.atan2(dLon, dLat);
    const angle = bearing - (heading || 0);
    const r = dist / RADAR_RANGE_KM;
    blips.push({
      x: Math.sin(angle) * r,
      y: -Math.cos(angle) * r,
      icao24: ac.icao24,
      alt: ac.baroAltitude || 0,
    });
  }
}

export function drawRadar(elapsed) {
  if (!ctx) return;
  const cx = RADAR_SIZE, cy = RADAR_SIZE;
  const r = RADAR_SIZE - 6;

  ctx.clearRect(0, 0, RADAR_SIZE * 2, RADAR_SIZE * 2);

  // Background circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(8, 7, 10, 0.85)';
  ctx.fill();

  // Range rings
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (r / 3) * i, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(196, 160, 88, ${0.05 + i * 0.02})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Crosshairs
  ctx.strokeStyle = 'rgba(196, 160, 88, 0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
  ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
  ctx.stroke();

  // Cardinal labels
  ctx.font = '16px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(196, 160, 88, 0.2)';
  ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - r + 16);

  // Sweep line
  sweepAngle += 0.014;
  const sweepX = cx + Math.sin(sweepAngle) * r;
  const sweepY = cy - Math.cos(sweepAngle) * r;

  const sweepGrad = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
  sweepGrad.addColorStop(0, 'rgba(196, 160, 88, 0)');
  sweepGrad.addColorStop(1, 'rgba(196, 160, 88, 0.45)');
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(sweepX, sweepY);
  ctx.strokeStyle = sweepGrad;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sweep glow cone
  const coneAngle = 0.28;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, sweepAngle - Math.PI / 2 - coneAngle, sweepAngle - Math.PI / 2, false);
  ctx.closePath();
  const coneGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  coneGrad.addColorStop(0, 'rgba(196, 160, 88, 0)');
  coneGrad.addColorStop(0.5, 'rgba(196, 160, 88, 0.03)');
  coneGrad.addColorStop(1, 'rgba(196, 160, 88, 0.07)');
  ctx.fillStyle = coneGrad;
  ctx.fill();

  // Blips
  for (const b of blips) {
    const bx = cx + b.x * (r - 10);
    const by = cy + b.y * (r - 10);

    // Brightness based on angle proximity to sweep
    const blipAngle = Math.atan2(b.x, -b.y);
    let diff = sweepAngle - blipAngle;
    diff = ((diff % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const bright = diff < 0.8 ? 1.0 : Math.max(0.25, 1.0 - (diff - 0.8) * 0.14);

    const altKm = (b.alt || 0) / 1000;
    const size = 2 + Math.min(altKm * 0.25, 2);

    ctx.beginPath();
    ctx.arc(bx, by, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 195, 130, ${0.55 * bright})`;
    ctx.fill();

    // Glow halo
    ctx.beginPath();
    ctx.arc(bx, by, size + 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(196, 160, 88, ${0.1 * bright})`;
    ctx.fill();
  }

  // Center dot (user)
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(90, 158, 114, 0.9)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(90, 158, 114, 0.15)';
  ctx.fill();

  // Outer border
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(196, 160, 88, 0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Blip count
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(238, 233, 220, 0.2)';
  ctx.textAlign = 'left';
  ctx.fillText(`${blips.length}`, cx - r + 10, cy + r - 10);
}
