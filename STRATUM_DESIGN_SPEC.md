# STRATUM
## Design & Concept Reference

> *"You're not looking at a map. You're looking up."*

---

## The Idea

Every flight tracker puts you in the sky looking down at the earth.

**STRATUM puts you on the ground, looking up at the sky.**

A real-time 3D visualization of the airspace directly above your location — rendered as a vertical slab of atmosphere. Every aircraft at its true altitude, true speed, true heading. The sky as it actually is, right now, above you.

---

## Why It Feels Different

| FlightRadar24 | STRATUM |
|---|---|
| God-view, top-down | Ground-level, looking up |
| You find aircraft on a map | Aircraft exist in space above you |
| 2D position only | True 3D: X/Y/Z + speed + climb rate |
| Tool you open with intent | Ambient object you glance at |
| Global | Hyper-local — your sky only |

---

## The Visual Model

Imagine a glass brick standing upright. Inside it: real aircraft at real altitudes.

```
         STRATUM — your sky right now
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━
40,000ft ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
                    ✈ CA837 ────►
35,000ft ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
              ◄──── ✈ UA112
28,000ft ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
                          ✈ CZ456 ↗
18,000ft ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
10,000ft ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
    ↘ MU201
 Ground ══════════════════════════════
              ⊙ you are here
```

The camera can orbit around this volume. Rotate it like holding a snow globe. Every angle reveals something new.

---

## Reading an Aircraft at a Glance

| Visual Cue | Meaning |
|---|---|
| **Height on Y-axis** | Actual altitude |
| **Trail length** | Speed — long trail = fast |
| **Trail color: warm** | Climbing |
| **Trail color: cool** | Descending |
| **Trail color: white** | Cruising level |
| **Dashed vertical line below** | Ground position projection |
| **Body size** | Aircraft category (wide-body vs narrow) |
| **Body orientation** | Heading direction |

No legend required. The physics speak for themselves.

---

## Altitude Zones

```
40,000 ft ─ Upper Cruise Band ─────────────── deep navy
35,000 ft ─ Primary Cruise Layer ───────────── midnight blue  
18,000 ft ─ Class A Floor ──────────────────── steel blue
10,000 ft ─ Terminal Control Area ──────────── warm amber
 Ground   ═══════════════════════════════════ dark matte
```

Each zone has a subtle horizontal plane. You instantly understand the vertical structure of controlled airspace without reading a manual.

---

## Color Language

```
Background void       #020408    near-black with blue cast
Deep sky              #050d1a    darkest blue
Cruise altitude       #1a3a6b    mid navy
Approach zone         #1a4a3a    deep teal
Terminal area         #4a3a1a    deep amber

Aircraft (cruise)     #ffffff    pure white
Aircraft (climbing)   #ff9d4d    warm orange
Aircraft (descending) #4db8ff    ice blue
Trail lines           #7eb8ff    soft periwinkle

UI glass              rgba(255,255,255,0.04)
UI borders            rgba(255,255,255,0.08)
Accent                #4d9fff    signal blue
```

---

## UI Philosophy

**Everything that isn't the sky should disappear.**

- All panels: glass morphism, `backdrop-filter: blur(12px)`, barely-there borders
- Typography: monospace for data, humanist sans for labels
- No solid backgrounds. No opaque cards. No gradients that compete with the scene.
- Data appears when you need it, recedes when you don't.

---

## The Detail Panel

Click any aircraft. A glass panel slides in:

```
┌─────────────────────────────┐
│  CA 837               ×     │
│  Air China                  │
│  ───────────────────────    │
│  PEK ──────────────► JFK    │
│  Beijing          New York  │
│                             │
│  ALT    38,400 ft           │
│  SPD    912 km/h            │
│  HDG    047°   NE           │
│  V/S    +0 ft/min           │
│                             │
│  Boeing 777-300ER           │
│  84 km from you             │
└─────────────────────────────┘
```

Distance from you. Not from an airport. From **you**.

---

## Ambient Behavior

The app is designed to sit on a second monitor, a tablet, a wall display — always on, never demanding attention.

- Idle for 30 seconds → camera begins slow, continuous orbit
- Aircraft enter and exit the scene with fade transitions, never a pop
- No notification badges, no alerts, no pings
- The scene is always in motion because the sky is always in motion

---

## The Vertical Corridor (Stretch Feature)

Click any point on the ground plane. A vertical beam rises. A label reads:

> *"3 aircraft currently above this point"*

List them in order, top to bottom:
```
38,400 ft  ✈ CA837  Air China  Beijing → New York
31,200 ft  ✈ FX902  FedEx      Memphis → Paris  
11,800 ft  ✈ MU204  China Eastern  descending → PVG
```

This is the view from a rooftop, looking straight up. Nobody has built this before.

---

## Data Source

OpenSky Network — open, free, real-time ADS-B data.  
API: `https://opensky-network.org/api/states/all`  
Poll interval: 10 seconds.  
Coverage: global.  

No API key required for basic access. The sky is public.

---

## Positioning

| Axis | Maps To |
|---|---|
| X | Longitude offset from user |
| Y | Altitude (1 unit = 1,000 ft) |
| Z | Latitude offset from user |

Center of the scene is always the user's current GPS position. Everything is relative to where they stand.

---

## What This Is, Really

STRATUM is an answer to a question nobody thinks to ask:

**What is happening in the column of air above me, right now?**

It turns out: quite a lot. And once you start seeing it, you can't stop looking up.

---

*Built on Three.js + OpenSky Network*  
*Concept: STRATUM — the sky, made visible*
