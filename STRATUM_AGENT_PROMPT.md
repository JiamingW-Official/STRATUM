# STRATUM — Agent Build Prompt

You are building **STRATUM**, a real-time 3D airspace visualization widget and web app. Read this entire prompt before writing a single line of code.

---

## What You Are Building

A browser-based interactive visualization that renders the live airspace **above the user's location** as a true 3D environment — not a top-down map, but a **vertical glass slab of sky** showing aircraft at their real altitudes, speeds, and trajectories.

Think: ambient art installation meets air traffic control tower meets personal weather widget.

---

## Tech Stack (Use Exactly This)

| Layer | Choice | Reason |
|---|---|---|
| Rendering | **Three.js** | 3D scene, camera, lighting |
| Data | **OpenSky Network REST API** | Free, no auth for public data, globally reliable |
| Framework | **Vanilla JS + Vite** | Zero overhead, fast iteration |
| Styling | **CSS custom properties** | Dark theme, glass morphism |
| State | In-memory JS objects | No backend needed for MVP |

---

## Data Source

**OpenSky Network — States endpoint:**
```
GET https://opensky-network.org/api/states/all?lamin={lat-2}&lomin={lon-2}&lamax={lat+2}&lomax={lon+2}
```

Poll every **10 seconds**. Each aircraft state vector returns:
- `icao24` — unique aircraft ID
- `callsign` — flight number
- `longitude`, `latitude` — position
- `baro_altitude` — altitude in meters (convert to feet: × 3.28084)
- `velocity` — ground speed in m/s (convert to km/h: × 3.6)
- `vertical_rate` — climb/descent in m/s
- `true_track` — heading in degrees
- `on_ground` — boolean

---

## 3D Scene Architecture

### Coordinate Mapping
```
Real World          →    Three.js Scene
─────────────────────────────────────────
Latitude offset     →    Z axis
Longitude offset    →    X axis  
Altitude (feet)     →    Y axis (scale: 1 unit = 1000 ft)
```

Center the scene at the user's GPS coordinates. Aircraft positions are **relative offsets** from that center point.

### Scene Elements

**Sky Volume Box**
- Transparent wireframe cube
- Dimensions: ~400km wide × 45,000ft tall
- Subtle grid lines at major altitude levels: 10k, 18k, 28k, 35k, 40k ft
- Color: `rgba(100, 180, 255, 0.04)`

**Altitude Layer Planes**
- Semi-transparent horizontal planes at key altitudes
- 10,000 ft — Terminal Control Area boundary (amber)
- 18,000 ft — Class A airspace floor (blue)
- 35,000 ft — Typical cruise band start (deep blue)
- Label each with altitude text floating on the plane edge

**Aircraft Objects**
Each aircraft is a `Group` containing:
1. **Body mesh** — elongated teardrop shape (use LatheGeometry or custom)
   - Wide-body jets: larger, slightly wider silhouette
   - Narrow-body: default
   - Rotorcraft: sphere
2. **Trail line** — `BufferGeometry` line showing last 20 positions
   - Trail length proportional to speed (faster = longer trail)
   - Fades from full opacity to 0 along its length
3. **Vertical drop line** — dashed line from aircraft straight down to ground plane
   - Opacity: 0.2, helps judge horizontal position
4. **Glow sprite** — soft point light halo, subtle

**Ground Plane**
- Dark matte plane at Y=0
- Subtle circular pulse animation at scene center (your location)
- Grid: `rgba(255,255,255,0.03)`

---

## Visual Design System

### Color Palette
```css
--bg-void:        #020408;
--sky-deep:       #050d1a;
--layer-cruise:   #1a3a6b;
--layer-approach: #1a4a3a;
--layer-terminal: #4a3a1a;

--aircraft-default:  #e8f4ff;
--aircraft-climb:    #ff9d4d;  /* warm orange */
--aircraft-descend:  #4db8ff;  /* cool blue */
--aircraft-cruise:   #ffffff;
--trail-color:       #7eb8ff;

--ui-glass-bg:    rgba(255, 255, 255, 0.04);
--ui-border:      rgba(255, 255, 255, 0.08);
--ui-text:        rgba(255, 255, 255, 0.85);
--ui-text-dim:    rgba(255, 255, 255, 0.35);
--accent:         #4d9fff;
```

### Typography
- Font: `'JetBrains Mono', 'SF Mono', monospace` for data
- Font: `'Inter', system-ui` for labels
- All UI elements: glass morphism cards with `backdrop-filter: blur(12px)`

### Aircraft Color Logic
```javascript
function getAircraftColor(vertical_rate) {
  if (vertical_rate > 1.5)  return CLIMB_COLOR;   // ascending
  if (vertical_rate < -1.5) return DESCEND_COLOR;  // descending
  return CRUISE_COLOR;                              // level flight
}
```

---

## Interaction Design

### Camera
- Default view: **slightly elevated isometric** angle looking into the sky volume
- `OrbitControls` enabled — user can rotate the full 3D space
- Scroll to zoom
- Double-click to reset to default view
- Subtle auto-rotate: 0.05 deg/sec when idle for >30s (ambient mode)

### Aircraft Selection
- Hover → aircraft pulses with glow, vertical drop line brightens
- Click → **Detail Panel** slides in from right

### Detail Panel (on click)
Glass morphism card, 280px wide:
```
┌─────────────────────────────────┐
│  CA 837                    [×]  │
│  Air China                      │
│  ─────────────────────────────  │
│  PEK  ──────────────────►  JFK  │
│  Beijing             New York   │
│                                 │
│  ALT    38,400 ft               │
│  SPD    912 km/h                │
│  HDG    047°  NE                │
│  VSPD   +0 ft/min  (cruise)     │
│                                 │
│  Boeing 777-300ER               │
│  Reg: B-2086                    │
│  Distance from you: 84 km       │
└─────────────────────────────────┘
```

### HUD Overlay (always visible)
Top-left corner:
```
STRATUM  •  LIVE
━━━━━━━━━━━━━━━━━━
↑ 23 aircraft
⊙ New York, NY
⊙ 40.7128, -74.0060
↺ Updated 3s ago
```

Bottom-right: altitude legend strip (vertical color bar with labels)

---

## Animation System

### Aircraft Movement
- On each data poll (10s), calculate new target position
- **Lerp** each aircraft to new position over 10 seconds — no teleporting
- `aircraft.position.lerp(targetPosition, delta * 0.1)` in animation loop

### Trail System
- Store last N positions in a circular buffer per aircraft
- Rebuild `BufferGeometry` each frame
- N = `Math.floor(speed_kmh / 50)` clamped to [5, 30]

### Entry / Exit Animation
- New aircraft: fade in over 2s, scale from 0.1 to 1
- Aircraft leaving radius: fade out over 3s
- Never pop in/out abruptly

---

## UI Layout

```
┌──────────────────────────────────────────────────────┐
│  STRATUM • LIVE          [controls]        [23 AC]   │
│                                                      │
│                                                      │
│              [ 3D SCENE FILLS THIS ]                 │
│                                                      │
│                                                      │
│  [altitude legend]                  [detail panel]  │
└──────────────────────────────────────────────────────┘
```

The 3D canvas is always full-bleed. All UI is overlaid with `position: absolute`.

---

## File Structure

```
stratum/
├── index.html
├── main.js              ← entry, scene init, render loop
├── scene/
│   ├── aircraft.js      ← Aircraft class, mesh creation, update
│   ├── environment.js   ← sky box, ground plane, altitude layers
│   └── trail.js         ← trail geometry management
├── data/
│   └── opensky.js       ← API polling, state management
├── ui/
│   ├── hud.js           ← top-left live stats overlay
│   ├── detail.js        ← click detail panel
│   └── legend.js        ← altitude color legend
└── style.css
```

---

## MVP Build Order

1. `environment.js` — static scene: ground, altitude planes, lighting
2. `opensky.js` — fetch real data, parse, log to console
3. `aircraft.js` — render aircraft as simple spheres at correct 3D positions
4. `trail.js` — add trails
5. Replace spheres with proper aircraft mesh shapes
6. `hud.js` + `detail.js` — UI panels
7. Polish: colors, glow, smooth lerp, animations
8. `legend.js` — altitude strip

---

## Hard Rules

- **No React, no Vue.** Pure JS + Three.js only.
- **No mocking data.** Always pull from OpenSky live API. If API is down, show a graceful "Signal Lost" state.
- **No flat map projection.** This is a 3D vertical scene. X/Z are lat/lon offsets, Y is altitude. Always.
- Aircraft must **always face their heading direction** — rotate the mesh to match `true_track`.
- The scene must feel **alive and ambient** — always subtle motion, never static.
- On first load, **request geolocation** from the browser. If denied, default to `40.7128, -74.0060` (NYC).

---

## Stretch Goals (post-MVP, in priority order)

1. **Vertical corridor view** — click a point on the ground to see a vertical line and all aircraft currently above it
2. **Time scrubber** — replay the last 60 minutes of your sky
3. **Sound design** — each altitude layer has a subtle ambient drone, aircraft presence triggers soft tones
4. **Widget mode** — `?widget=true` URL param renders a minimal 400×400 version for embedding
5. **Route arc** — when an aircraft is selected, show a great-circle arc of its full route on the ground plane
