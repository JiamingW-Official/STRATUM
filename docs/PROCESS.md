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

**The wall that was a door.** The most useful correction in the project came
from the owner, not from the code. I had concluded that public flight and
audio infrastructure simply did not carry most airports: my scripts asked
LiveATC's redirector for `kord_twr`, `kord_app`, twenty-five spellings in all,
got 404 for every one, and I reported — with evidence — that O'Hare publishes
no public feed. The owner's reply was one sentence: *I can search Chicago.*

They were right and my method was wrong. LiveATC's airport pages sit behind a
Cloudflare managed challenge that a real browser passes and a script does not,
so I had never seen the page that lists the actual mount names. Opened through
their browser, O'Hare's tower turned out to be `kord1n2_twr_n`; Denver's is
`kden1_twr_west1`. Sector letters, runway pairs and frequencies — names no
amount of enumeration would ever have produced. Reading the pages the owner
could already read took coverage from eleven airports to eighty, across five
continents, and corrected Los Angeles from a heliport stream to its actual
tower.

This is worth stating plainly because it cuts against the project's own thesis.
STRATUM argues that visibility is governed — that some aircraft are withheld and
some skies are unheard. That is true. But I had also mistaken my own bad
technique for a refusal by the infrastructure, and written it up as a finding.
Some walls are walls. Some are doors you are knocking on wrong, and the way to
tell them apart is to check with someone standing on the other side.

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

## 7. Second pass: the sky, the ground, and saying it out loud

Three weeks on, the owner's brief was one line: *this is still a long way from
a portfolio piece.* This section is what that produced, in the order it was
found.

**Trails were nine minutes long, and the reason was the data, not the code.**
The upstream publishes two trace files per aircraft. `trace_recent` is capped
at 92 points -- measured at 5.9, 10.5 and 14.0 minutes on three aircraft,
depending on how fast each was reporting -- so a jet at cruise arrived with a
stub behind it. `trace_full` is the last 24 hours: 3,480 to 6,593 points,
80-160 kB on the wire even compressed, of which about 92% is older than
anything the map draws. Fetching it for every aircraft in range is 16 MB a
visit. The cut moved to the edge: a Worker route fetches the full trace once,
keeps the wanted window, drops the fields the trail never reads and rounds to
a metre. 3,480 points and 587 kB became 360 points and 4 kB, spanning 38
minutes; the answer is shaped like the upstream file so the client parses it
with the code it had. Cached ten minutes -- only the last minute of a trail is
in motion, and every hit is a 110 kB fetch not made against a volunteer host.

Then the measure itself was wrong. Forty-five minutes is right for an aircraft
turning onto final at 180 knots and wrong for one crossing at 500, which draws
a line clean across the frame; with the window open the overflights were all
you could see. Trails now cut at 80 nautical miles, a little under the 100 nm
radius on screen, so every aircraft gets roughly the same sweep. Measured over
153 aircraft: median 80, 90th percentile 96.

**The runway was drawn at the wrong scale, seven times over.** The surface
texture was a fixed 2048x192 stretched over whatever the runway measured. On
JFK's 13R/31L, 4,408 m by 61 m, a pixel covered 2.2 m along the runway and
0.3 m across it; every mark drawn square came out seven times longer than it
was wide, and the designators, meant to stand 9 m, ran for 185 m. Pixel floors
on the other marks overrode their metre dimensions on any long runway. Width
came from `parseFloat` on the OSM tag, so `"150 ft"` became a 150-metre
runway. Every mark is now specified in metres from ICAO Annex 14 and converted
on its own axis: threshold stripes counted by width, aiming point as two bars
either side of the centreline at the distance the landing length dictates,
touchdown zone in the 3-2-2-1-1 code, rubber darkening the first 900 m. Lights
follow the same rule: white edge lights with the last 600 m yellow (the red in
the last 300 m was not an edge-light colour), the threshold bar as the
bidirectional fixture it is -- green outward, red inward -- centreline lights
every 15 m on precision runways, a PAPI abeam each aiming point, ALSF-2
corrected to 730 m with a white 1,000 ft bar. Four duplicate "glow halo" point
layers were deleted; the bloom pass already did that job, and stacked additive
layers were the white blob over every airport at map zoom.

**The highlight that was a leftover.** The white disc and grey ring over JFK
that the owner asked to have removed were not a highlight. They were a "you
are here" marker from when the map centred on the viewer; the origin is now the
focused airport, so the marker read as a statement about it. The focused
airport is marked by its label and diamond a step brighter than the rest, and
nothing else is added.

**A measurement that lied.** After the light rewrite the scene reported no
light layers at all, on three reloads. The cause was the test harness, not the
code: the browser pane was hidden, and a hidden tab throttles
`requestAnimationFrame` to nothing, so the three deferred frames that build
lights never ran. Fronting the tab produced 6,290 edge lights, 8,916 threshold,
20,552 centreline and 8,920 approach. While looking, a real race surfaced: two
airport loads overlap at boot and the deferred passes were guarded by a load
counter that either could bump, so a runway group could sit in the scene with
its lights skipped. The guard is now the group itself. Rule kept from §6, now
with a corollary: measure the deployed thing, and know what your instrument
cannot see.

**The layer that carried the argument was invisible.** Masked aircraft were
wireframes at 55% opacity with no label -- thematically right and, among 160
contacts at map zoom, a change the eye could not find. They now carry an open
ring, what a scope draws around a return it cannot identify. A sprite rather
than geometry, because ring geometry sized to look right up close measured
four pixels across at the altitude the layer works at.

**Putting the sentence where the layer is.** This document's claim -- every
position says how it reached us, some aircraft asked not to be shown -- was
not in the product. No panel was added. One line under the boot checklist,
gone with the screen. The HUD's "N asked not to be seen" is now the way into
the layer: click it and it toggles, same as V. And one sentence under each
callsign says how this position was heard -- the aircraft itself over ADS-B,
volunteers triangulating, a state ground station relaying radar -- and, for a
masked aircraft, that its owner asked through LADD or a privacy address not to
be shown: the position is public, the name is not.

That last line exposed a contradiction. The map drew a masked aircraft as
UNSEEN while the panel beneath it gave the name away -- tail number, owner,
the lot -- which made the layer a costume. While the layer is on, the panel now
withholds what the owner asked to withhold; V reveals it, immediately, so V is
an act and not a style. Verified on a Sikorsky S-92 on the FAA's limiting
list: UNSEEN / withheld with the layer on, N314RG with it off, UNSEEN again,
each within a frame.

## 8. From an instrument to a measurement

The owner's next brief was the sharpest yet: *a teacher should like this,
and it should read like a thesis, not a display.* A map that shows one city's
sky beautifully is a display. What makes it a thesis is a question the map
can answer that nothing else can.

The question was already on screen. The HUD counts aircraft that asked not to
be seen. Those aircraft are on the FAA's LADD list or fly under a PIA
address -- American programmes, with no equivalent in Europe. If that is so,
the share of a sky that asks for privacy is not a curiosity of one screen; it
is a property of a jurisdiction, and of who flies there. STRATUM was the only
thing in the room positioned to measure it, because its Worker already pulls
the sky over seventy-odd airports every five minutes to keep them warm.

So the warm pass counts. For every airspace it fetches, it tallies aircraft,
how each was heard, and how many asked not to be shown, and writes one
running index to KV per run. `/api/visibility` reads it back. Nothing shows
until a sky has three samples and three hundred aircraft behind it; a
comparison under three points is not said.

**What it found.** After 141 warm runs over roughly twenty hours (from
2026-09-02 16:45Z), counting only skies with three samples and three hundred
aircraft behind them: across 14 American skies and 119,333
aircraft-observations, 9.0% asked not to be seen -- one in eleven. Denver
15.0%, New York 11.2%, Los Angeles 10.9%, Las Vegas 9.6%, White Plains 14% --
the business-aviation fields -- against Phoenix 5.2%, Orlando 6.3%, Chicago
7.1%, Atlanta 7.2%. Across the three European skies that had qualified by
then -- Frankfurt (938 observations, 1.5%), Istanbul (361, 1.1%), Paris (336,
1.2%) -- 1,635 observations and 1.3%: one in seventy-four. The gap is the
finding, and it is the one an admissions reader can carry out of the room in
a sentence: *in an American sky, the rich can ask not to be seen; in a
European one, nobody can.* Eighteen skies outside the United States are
counted every run so that sentence keeps resting on more than it did the day
it was first said; the European figure will move as London, Amsterdam and
the Asian anchors qualify.

The boot screen now says it in the product's own words, from the same sums:
*In American skies, about one in 11. In European skies, about one in 74.*
It says nothing of the kind until both sides have enough behind them.

**Where it lives.** No panel. The HUD's \"N asked not to be seen\" now carries
the comparison in the same breath: *21 asked not to be seen · 14% here · 2%
over Frankfurt.* The comparison sky is the eligible one whose share differs
most, across an ocean where possible so the contrast is between jurisdictions
and not between two neighbouring fields, named by the nearest city. Click the
line and the ghost layer opens on the aircraft it counts.

**What it is not.** It is not a claim about individuals: the index is sums
per airspace, never a list. It is not a claim about intent: LADD covers
corporate fleets, medical flights and private owners alike. And it is not a
finished number: the American figure rests on a hundred thousand
observations and the European one, today, on a few hundred. The method is
the contribution -- the sky was already being fetched; the finding was in
fields that were being thrown away.

## 9. Participation: the layer becomes a task, and the map teaches itself

**Contacts.** The ghost layer was something to look at. It is now something
to do. A ringed aircraft can be located, heard and typed but never named;
clicking one logs a contact, the way a scope operator logs a return -- the
ring swells once and settles, a short synthesised blip, and a count under
the unseen line: *3 of 12 contacted*, and when they are all found, *all 12
contacted · none named*. The rules of the game are the argument. A ring
that has just entered the airspace swells the same way, so a new contact
draws the eye without a label.

**Arrival.** After the boot screen the camera no longer cuts to the airport.
It starts high and far and settles over four seconds, so the sky is a place
you descend into; any input ends the descent at once. The first version was
never seen: the airspace load resets the camera to its cinematic framing on
its own schedule, and whichever ran second won. The descent now owns that
framing, and the load's reset stands aside while it runs.

**Read the sky, and Ground School.** The owner asked for a classroom. I
argued against one -- a classroom takes the knowledge out of the scene and
tells it again in a panel -- and the owner asked for it anyway, with
lessons and tests. What shipped is both, taught from the thing in front of
you. K draws a leader line from six or seven real objects on screen -- a
named fix, a runway number, a VOR, the fastest trail, a ringed aircraft,
the 25-mile ring -- to one line each, and leaves at the first touch. T opens
Ground School: six short lessons, each anchored to a real object on the map
with a line to it, each with one question answered on the spot; progress is
kept in the browser. The six lessons are the six questions the map itself
raises: how an aircraft is heard, how a runway is named, what a fix is, what
the trail colour says, who asked not to be seen, and why distance is in
nautical miles.

**What the checking found.** Every one of these shipped with a live test,
and the tests turned up more than the features did:

- The fix registry called `clone()` on a plain point, which threw inside the
  nav-chart build: no fixes drawn, and the key had nothing to point at.
- The caption under runway 13 said 122 degrees -- the true heading stored
  with the geometry -- beside a lesson that says 13 points about 130. The
  number is magnetic; the caption derives from it now.
- `[` and `]` sorted aircraft by distance from a camera that was flying
  toward whatever was just selected, so the order changed under every press
  and the far aircraft were never reached. Sorted from the airport now.
- Three aircraft with no usable trace were re-requested every two seconds
  without end -- 5,400 trail requests an hour from one visitor, and the
  likeliest source of the 429s in the console. An empty answer is now an
  answer, cached like a full one.
- A visitor was running a bundle three deployments old. The service worker
  fetched the HTML shell network-first but in the default cache mode, so the
  browser's own cache returned a copy it had been told was good for a while,
  naming the old assets. The shell is fetched with `no-cache`. Several
  earlier "this change did nothing" moments, including some of my own
  checks, were this.

**Sharper ground, after first paint.** The map outside the airport's detail
rings was a single 600-pixel export of the whole hundred-mile area -- about
500 metres a pixel -- and it read as soft at every zoom. It still loads
first, because it is 60 kB and the first picture matters more than the
sharp one. Once the detail rings are on, the same area is fetched again at
2048 pixels (554 kB, measured, against 148 kB at 1024) and swapped in
underneath them: one more request, after the visitor already has a map,
cached by the service worker so a city pays it once. Not on small screens,
and not when the browser says the visitor is saving data.
