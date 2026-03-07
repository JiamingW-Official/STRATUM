// --- Radar Minimap ---

const RADAR_SIZE = 140;
const RADAR_RANGE_KM = 150; // km radius shown on radar
const DEG_TO_RAD = Math.PI / 180;

let canvas, ctx;
let sweepAngle = 0;
let blips = []; // { x, y, icao24, bright }
let onBlipClick = null;

export function initRadar(clickCallback) {
  canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  canvas.width = RADAR_SIZE * 2; // retina
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
    let closestDist = 20; // pixel threshold
    for (const b of blips) {
      const bx = cx + b.x * (RADAR_SIZE - 10);
      const by = cy + b.y * (RADAR_SIZE - 10);
      const d = Math.hypot(sx - bx, sy - by);
      if (d < closestDist) {
        closestDist = d;
        closest = b;
      }
    }
    if (closest) {
      onBlipClick(closest.icao24);
    }
  });
}

export function updateRadarBlips(aircraftList, userLat, userLon, cameraHeading) {
  blips = [];
  for (const ac of aircraftList) {
    if (ac.latitude == null || ac.longitude == null) continue;

    const dLat = (ac.latitude - userLat) * 111;
    const dLon = (ac.longitude - userLon) * 111 * Math.cos(userLat * DEG_TO_RAD);
    const dist = Math.hypot(dLat, dLon);

    if (dist > RADAR_RANGE_KM) continue;

    // Bearing from user to aircraft
    const bearing = Math.atan2(dLon, dLat);
    // Rotate by negative camera heading so radar "north" matches camera view
    const angle = bearing - cameraHeading;

    const r = dist / RADAR_RANGE_KM;
    blips.push({
      x: Math.sin(angle) * r,
      y: -Math.cos(angle) * r,
      icao24: ac.icao24,
      alt: ac.baroAltitude || 0,
      speed: ac.velocity || 0,
    });
  }
}

export function drawRadar(elapsed) {
  if (!ctx) return;
  const cx = RADAR_SIZE, cy = RADAR_SIZE;
  const r = RADAR_SIZE - 6;

  ctx.clearRect(0, 0, RADAR_SIZE * 2, RADAR_SIZE * 2);

  // Background
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(4, 10, 22, 0.7)';
  ctx.fill();

  // Range rings
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (r / 3) * i, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(90, 172, 255, ${0.06 + i * 0.02})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Crosshairs
  ctx.strokeStyle = 'rgba(90, 172, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
  ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
  ctx.stroke();

  // N/S/E/W labels
  ctx.font = '16px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(90, 172, 255, 0.25)';
  ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - r + 16);
  ctx.fillText('S', cx, cy + r - 6);

  // Sweep line
  sweepAngle += 0.015;
  const sweepX = cx + Math.sin(sweepAngle) * r;
  const sweepY = cy - Math.cos(sweepAngle) * r;

  const grad = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
  grad.addColorStop(0, 'rgba(90, 172, 255, 0)');
  grad.addColorStop(1, 'rgba(90, 172, 255, 0.4)');
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(sweepX, sweepY);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sweep glow cone
  const coneAngle = 0.3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, sweepAngle - Math.PI / 2 - coneAngle, sweepAngle - Math.PI / 2, false);
  ctx.closePath();
  const coneGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  coneGrad.addColorStop(0, 'rgba(90, 172, 255, 0)');
  coneGrad.addColorStop(0.5, 'rgba(90, 172, 255, 0.04)');
  coneGrad.addColorStop(1, 'rgba(90, 172, 255, 0.08)');
  ctx.fillStyle = coneGrad;
  ctx.fill();

  // Blips
  for (const b of blips) {
    const bx = cx + b.x * (r - 10);
    const by = cy + b.y * (r - 10);

    // Angle proximity to sweep for brightness pulse
    const blipAngle = Math.atan2(b.x, -b.y);
    let angleDiff = sweepAngle - blipAngle;
    angleDiff = ((angleDiff % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const brightness = angleDiff < 0.8 ? 1.0 : Math.max(0.3, 1.0 - (angleDiff - 0.8) * 0.15);

    // Blip size based on altitude
    const altKm = (b.alt || 0) / 1000;
    const size = 2.5 + Math.min(altKm * 0.3, 2.5);

    ctx.beginPath();
    ctx.arc(bx, by, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(90, 220, 255, ${0.5 * brightness})`;
    ctx.fill();

    // Glow
    ctx.beginPath();
    ctx.arc(bx, by, size + 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(90, 172, 255, ${0.12 * brightness})`;
    ctx.fill();
  }

  // Center dot (user position)
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(52, 211, 153, 0.9)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(52, 211, 153, 0.15)';
  ctx.fill();

  // Outer border
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(90, 172, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Count label
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.textAlign = 'left';
  ctx.fillText(`${blips.length}`, cx - r + 12, cy + r - 10);
}
