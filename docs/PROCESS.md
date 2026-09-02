# STRATUM — process

STRATUM is a live map of the sky over a city, drawn from the same volunteer
ADS-B network that feeds every flight tracker. This document is the path, not
the endpoint: what was wrong, how it was measured, what changed, what was
tested, and what I got wrong along the way. Numbers are from instrumented runs
against the deployed site, not estimates.

## 1. Problem definition

The first version was complete and unusable: aircraft took 30 seconds or never
appeared, the map went blank on switching cities, and the interface read as a
feature list — twenty-three keyboard shortcuts, every number in its own bordered
card, every panel wearing the same amber accent bar. A reviewer's first question
would have been "why does this exist?" and the interface had no answer.

Two problems, then. A performance problem that turned out to be an
infrastructure problem, and a design problem that turned out to be a stance
problem.

## 2. Research: measure before touching anything

**Where the time went.** Instrumenting `PerformanceObserver` on a cold load of
a new city:

| | before | after |
|---|---|---|
| basemap requests per city | 767+ (still incomplete at 42 s) | 4 |
| median tile latency | 16.1 s | — |
| first aircraft on screen | never (Worker site) | 1.8 s |
| position poll cadence | 4.0–10.0 s | 2.3 s median |
| `/api/boot` | 10–18 s, cache miss every time | 0.7 s |
| Austin airport geometry | HTTP 502 after 13.5 s | 2.6 s (KV) |

**Why.** Every fix came from a measurement that contradicted an assumption:

- The dev server could not reach any upstream. Vite's proxy is node-http-proxy,
  which honours neither `HTTPS_PROXY` nor the OS proxy the browser uses; on a
  network that only reaches these hosts through a local proxy, every server-side
  fetch failed while the browser's own requests succeeded. The app was silently
  running on its slowest fallback path.
- The production Worker was blocked by every ADS-B source: adsb.fi and adsb.one
  answered its requests with a Cloudflare block page, airplanes.live with a
  written "please contact us", OpenSky with a timeout. No source sends CORS
  headers, so the browser cannot go direct. The tracker had no legal route to
  its own data. (This became the project's subject — §5.)
- Airport geometry from Overpass was cached in `localStorage` for seven days
  *including empty results*, because Overpass soft-fails with HTTP 200 and an
  empty array. One timeout darkened a city for a week.
- Cache writes in the Worker were fire-and-forget; the runtime cancelled them
  after the response returned, so nothing was ever stored and every visit re-ran
  a 15–20 s query. overpass-api.de allows two concurrent requests per IP; my own
  warm-up job fanned out 89 at once and was the cause of its own 502s.

## 3. Iteration, including the parts that went wrong

**Misreading the brief, twice.** The land on the airspace-picker globe went
hollow when zoomed. I read "密集度小点点" as "smaller dots" and shipped a solid
fill; the user's reply was that the green border was ugly and the original had
been a dense dot stipple. I restored the stipple and subdivided cells under
zoom; it was then too dark and the coastline too thick, because subdivision had
also split coast cells into 2×2 blocks. Third pass: one dot per coast cell,
interior alpha lifted. Each step was verified by screenshot at two zoom levels
before deploying. The lesson I would repeat: when a request is one short
sentence, the cheapest thing is to reproduce the *original* state and ask which
property changed, not to redesign.

**The redesign as an audit, not a taste.** Before rewriting 4,000 lines of CSS
I had the stylesheet counted: 27 distinct font sizes in 0.5 px steps, the
smallest 5.5 px; 191 tracked-uppercase micro-labels, so nothing outranked
anything; 63 `backdrop-filter` declarations at 12 radii; 755 raw `rgba()`
literals bypassing the tokens that existed — the accent hard-coded as
`196,160,88` 256 times while the token said `#c9a45c`, two different golds.
Nine panels wore a left accent bar. The rewrite reduced this to: four type
sizes (268 px declarations → 7, all deliberate display sizes), three material
tiers, two radii, one shadow, every colour through a token. Every phase was
screenshotted; two of those screenshots caught regressions (values truncated by
a four-column grid; a close button pushed off a panel by its own siblings) that
were fixed before the next phase.

**Fonts that were not there.** Every local screenshot of the redesign was
rendering system fallbacks: the dev server had no route for the self-hosted
font path, so `document.fonts` was empty. Found by measuring glyph advance
widths against the generic monospace fallback. Fixed before any typography
judgement was trusted.

## 4. Validation

Each change shipped with the check that would catch it regressing:

- Position polling: 29/29 requests succeeding at 1.5 s average, 2.3 s cadence.
- Trail history: 186/186 trace requests at 455 ms, after being 403 for the
  project's whole life (the host wants its own `Referer`).
- Airport widget close button: hit-tested at panel widths 240–420 px; at 280 px
  the old layout had pushed the button 24 px outside the clipped edge, leaving
  the copy button under the cursor. Confirmed by dispatching a click at the
  corner and asserting which handler fired.
- Phase tooltip and TCAS panel: measured `getBoundingClientRect()` against the
  viewport and the panel edge; opacity 0 → 1 → 0 across hover enter/leave.
- Ghost layer (§5): 14 aircraft over O'Hare at 02:00, one Gulfstream 650 on
  the FAA's LADD list rendered as a wireframe by default; toggling applies to
  every live object within one frame, not one poll.

## 5. The turn: from tool to argument

The blocking described in §2 was not an obstacle to route around; it was the
finding. Public flight data is public until you try to serve it from
infrastructure the providers do not recognise. Who is allowed to see the sky is
a live constraint written into this codebase — in the relay through a second
host, in the list of 73 airports the cache warms first, in the aircraft that
carry a flag asking not to be shown.

The ghost layer makes that constraint the interface. Every position already
says how it reached us: the aircraft speaking for itself over ADS-B, volunteers
triangulating a transponder that will not (MLAT), or a state relay (TIS-B).
Aircraft on the LADD or PIA lists have asked aggregators to withhold their
identity. In ghost mode they are drawn as bare wireframes with no callsign and
no route — present, unnamed — while everything else keeps its light. The HUD
reads the sky as people: seats overhead by type, distinct destinations, and the
count that asked not to be seen. A coverage shadow darkens ground where the
volunteer network only ever hears faintly or late; cells with no data stay
clear, because "no data" is not "no coverage" and the layer must not pretend
otherwise. Tower audio is the one trace a ghost still leaves.

Nothing in this layer is invented. Every element is a field that was already
in the feed and had been thrown away.

**Tower audio, and one more refusal.** The sound of the layer is live tower
audio from LiveATC. The Worker could not carry it (its egress is refused, as
above); the browser can, because LiveATC's Icecast mirrors allow cross-origin
playback with no header tricks — verified by requesting the stream with
nothing but a byte range. But the directory that says *which* mount an airport
uses sits behind a Cloudflare managed challenge ("Just a moment…"); I did not
try to defeat it. The feed map was instead built through LiveATC's own
redirector, which resolves a mount name to whichever mirror is serving it and
answers a wrong name with a 404, and only feeds that answered as audio were
kept. Mounts rotate between mirrors; the player follows. The audio is credited
on screen, and the terms question — a portfolio prototype embedding another
service's streams — was put to the owner explicitly and decided by them.

## 6. Reflection

Three things I would tell myself at the start:

1. Measure the deployed thing, not the local thing. Half the problems only
   existed in production, and one of them (fonts) only existed locally.
2. A design audit with counts is a better brief than a design opinion. "27 font
   sizes" is arguable with; "too AI" is not.
3. When infrastructure refuses you, write it down before working around it.
   The refusals were the most interesting data the project produced.

What I did not do: I did not spoof headers to defeat the providers' blocks
beyond the one `Referer` the trace host requires and the user chose to send.
The airplanes.live message asked for an email; that is the correct next step,
and it is the user's to take.
