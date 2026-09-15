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
500 metres a pixel -- and it read as soft at every zoom. The first attempt
re-fetched the same area at 2048: 290 metres a pixel, still stretched two
and a half times across a screen at the default framing, and the owner said
so. The server caps an export at 4096, and spending that on the whole area
only halves the blur; spent on the 200-kilometre disc the camera actually
frames, it is 49 metres a pixel, the same as the first detail ring. That is
what ships: the small base still loads first, because the first picture
matters more than the sharp one; the disc is fetched after the rings (2.2 MB,
about thirty seconds to rasterise the first time a city is asked, then
cached by the service worker) and laid under them, so the airport's
three-metre imagery stays on top. Not on small screens, and not when the
browser says the visitor is saving data. Anisotropic filtering went from 8
to 16 at the same time: the camera looks across the ground at a shallow
angle, and that is what keeps the middle distance legible.

The owner's answer was that 49 metres a pixel was still too low, and that
the load must not slow down. One export is capped at 4096, so the next step
is a mosaic: the 78-kilometre square around the airport as nine 2048-pixel
tiles, 26 kilometres each, about 13 metres a pixel -- four times the disc.
They are fetched three at a time, centre first, after the disc, each laid in
as it lands, above the disc and below the airport rings, at low fetch
priority so none of them ever queues ahead of a position poll. Measured on
the live site: first paint unchanged at 0.7 s, eight of nine tiles in place
by 60 s on a cold city, all nine by the next reading; 9.5 MB across fifteen
exports the first time a city is asked, then cached. The cost is real --
about 250 MB of texture on the GPU -- which is why none of it happens on
small screens or under save-data.

Then the owner sent a screenshot from low over Queens, outside the rings,
and it was still soft. Nothing fixed can be sharp at every altitude: a
mosaic that reads at the default framing is ten times too coarse when the
camera comes down over a suburb. So the camera decides. Every ground layer
registers its resolution as it lands. When the camera rests for 400 ms, the
ground under the screen centre is compared with what the screen can show --
seen at a shallow angle, it wants two to three texels per pixel -- and if
the screen could show more, a 2048 export sized to that need is fetched for
the cell under the centre and then its four neighbours, laid in above the
mosaic and below the airport rings. Cells sit on a ladder of four sizes so a
view seen twice is fetched once; twenty-four a city, then it stops. The
first version of this called a 12-metre ring sharp enough at an altitude
where it plainly was not, because it compared at one texel per pixel and
fetched one tile the size of the whole footprint, which could not beat the
ring anyway. Measured on the live site, low over Queens: the screen wanted
8.4 metres a pixel, the target came out at 3, four 10.7-kilometre tiles at
about 5 metres a pixel landed within a minute, and the streets under the
camera had names.

**Rendered once, for everyone.** The owner's next message was that it was
all still too slow, and that a street grid everywhere was not the point --
no jaggedness, no low-pixel feel was the point. The slowness was structural:
the source takes 4 to 30 seconds to rasterise each image, and every visitor
was paying it, city by city. The images now go through the Worker on the
same origin and are cached at the edge for a week; the bbox is rounded to
integer metres so the URL is deterministic. Then the cron warms them: two
cities a run, rotating through the busiest seventy, the fifteen images a
visitor's first minute asks for, built with the same mercator, scale and
rounding as the client. Checked on the live site: the client's URL for the
JFK base and the Worker's are the same byte for byte; a cold image took 4.1 s
and the next two requests for it 2.3 s, all of which is this machine's proxy
and none of which is rendering. What made the cache not work the first time
is a bug this project had met before: the proxy stored its result without
awaiting the write, and the runtime cancels a pending write once the
response has gone out, so every image was a miss. The lesson from section 2
held a second time; it is now in the generic proxy as well. The view loader's
target eased from 3 to 5 metres a pixel -- half the requests, and the source
has little more to give below that -- and street-grid detail exists only
where the camera actually is.

## 10. Two questions from the owner, and what they turned up

*Can the tower audio reach LaGuardia?* It could -- KLGA has had a feed since
the harvest -- but only by switching the airspace. Over New York the feeds
within sixty kilometres are JFK, LaGuardia, Newark and White Plains: one
sky, several towers. A small control beside the tower button now cycles
through them, nearest first, and the label says which and how far. Checked
live: JFK → KLGA 17 km → KEWR 33 km → KHPN 48 km, each on its own mirror.

*Why do Chinese airports show no arrivals and no information?* My first
answer was wrong, and instructively so. I probed the airport endpoint and
read back "zero runways" for Beijing, Shanghai and Guangzhou, and went
looking for an Overpass failure. There was one to find -- overpass-api.de
had begun answering every request through the relay with 406, its egress
on their blocklist, and kumi was overloaded, so every airport not already
in KV was failing, in China and in North Dakota alike; mail.ru's mirror now
goes first, and the 502 names which mirror failed and how. But that was not
the Chinese airports' problem. My probe had counted a field the endpoint
does not return. Read properly: Beijing has 36 runways and 2,032 taxiways
on the map, Shanghai 24, Guangzhou 31. What those skies lack is aircraft.
Shanghai's hundred-mile box held none; Beijing's held twenty-two, where an
American hub's holds two hundred. Mainland China restricts public sharing
of ADS-B, the volunteer network barely hears it, and with no aircraft there
are no arrivals to list. The project already carried a note explaining
this; it fired only below three aircraft, so twenty-two looked like an
empty, silent, unexplained airport. It now fires when a hub's sky holds
fewer than forty, once per city.

And one more thing, found last: mainland China was not in the picker at all.
Hong Kong, Macau and Taipei were; Beijing, Shanghai and Guangzhou were not,
though their runways were in the cache and their metadata in the table.
Twenty-four mainland hubs are listed now, and warmed like the rest.

The lesson is the one from section 5, in the other direction: last time I
mistook my own bad technique for a refusal by the infrastructure; this time
I found a real refusal and nearly pinned the wrong symptom on it. Both times
the correction came from reading the actual bytes.

## 11. One mark, one meaning

Late on, I audited the drawing rather than the code, and found the piece had
been saying the same thing four ways and four things one way.

A dashed line appeared in four places: the bridge across a gap in a trail, the
prediction reaching ahead of a selected aircraft, the leader line dropping from
an aircraft to the ground, and the border around an estimated route in the
dossier. Three of those are the same claim — *this was computed, not received*.
The fourth is not: the drop line carries an altitude the aircraft broadcast.
Its dash rhythm was 0.15/0.25, the gap line's 0.15/0.20, the prediction's
0.15/0.10. Three rhythms, two meanings, no rule.

So I wrote the rule down, in the file where the marks are made:

> A dashed line means exactly one thing: nobody measured this.

Then I made the drawing obey it. The gap and the prediction became the same
mark — one dash rhythm, one colour, stated once as `COLOR_INFERRED`,
`DASH_SIZE`, `DASH_GAP` — because they are the same claim pointing in opposite
directions in time. The drop line went solid, and lost a third of its opacity
to compensate: a dashed line is only drawing about half the time, so solid at
0.09 sits where dashed at 0.15 sat. Same presence, one fewer meaning.

Then the rule left the scene. The passenger figure in the corner is not a
count of anybody; it is a seat table keyed on aircraft type. It now carries a
dashed underline. The "no coverage" dialog had been opening with a satellite-
dish emoji — a picture of the equipment, which is not what the dialog is about.
It opens with a dashed ring now, which is the project's own word for *nobody
measured this*, and is exactly what the dialog goes on to say.

The test I want this to pass is that nothing above needs a key. A reader who
has watched one trail break and reconnect has already learned the underline.
That is the difference I was reaching for between a legend and a language: a
legend is a list you consult, a language is a rule you absorb once and then
read with. It is also the cheapest argument in the project — it adds no panel,
no toggle and no text, and it makes the piece's central claim, that this sky is
partly heard and partly guessed, legible in every line on the screen.

The one lesson added to Ground School since is the only place the rule is
spelled out, and it is spelled out last, for the reader who wants confirming
rather than teaching.

## 12. The hierarchy was arguing against the thesis

The panel in the corner opened with three numbers at the same size: aircraft,
airports, clock. That is the masthead of every flight tracker ever built, and I
had reproduced it without noticing, in a piece whose whole claim is that the
interesting part of this sky is the part you are not shown.

The test is to squint at the screen until only contrast survives. What survived
was `273` — the traffic count. The argument, *thirty-four asked not to be
seen*, was set two sizes down in grey, below the fold of attention. A reviewer
reading only the shapes would have read a tracker.

So the panel has one protagonist now. The withheld count is at hero size in the
accent colour; the traffic count, the airport count and the clock sit under it
in one line at label size, prefixed "of" — they are the denominator, not the
subject. The hero is also the control: pressing it draws the aircraft it
counts, so the largest thing on the panel is the one gesture worth finding.

A sky where the count is zero keeps the hero slot and loses only its colour. In
a Chinese or European airspace `0 asked not to be seen` is not an empty state,
it is the finding — those jurisdictions have no programme to ask through — and
the comparison line underneath names the contrast.

Three smaller things fell out of the same pass, all of them deletions:

The clock had been flipping itself between Zulu and local every fifteen seconds
with a slide animation. As a hero stat with its own label that was defensible.
As the tail of a quiet context line it pulled the eye off the one number the
panel is about and jittered the line's width twice a minute. It shows Zulu now,
which is the unit every ADS-B timestamp actually arrives in, and swaps on a
click. A gesture, not a timer.

It also read `14:41Z UTC`, which says the same thing twice; the Z is the label.

And the contact counter sat directly under the hero reading `34 to find`, one
line below a `34` four times its size. It carries progress only now.

The generalisation I would take to the next project: a layout is an argument
about what matters, and it is made before anyone reads a word. If the biggest
thing on the screen is not the thesis, the thesis is decoration.

## 13. The game was already in the data

The brief was to make this play like something you would buy, and to make it
mean something that tens of thousands of people are inside it at once. The easy
version of that is a cliché I can name in advance: experience points, levels,
daily streaks, badges, a leaderboard of aircraft spotted. That bolts a generic
economy onto a specific subject, and the subject stops mattering — you could
swap the aircraft for mushrooms and the loop would be unchanged.

So I looked for the game already present in the material, and there is exactly
one thing here that is structurally a game: **some aircraft can be seen and
cannot be named.** Position, altitude, type and tower audio are all public; the
identity is withheld by an FAA programme. That is not a missing feature. It is a
puzzle with a fixed, honest, unsolvable centre.

And the multiplayer needs no lobby, because the premise is already true:
everyone looking at this airspace at 14:44Z is looking at the same two hundred
and sixty-nine aircraft. It is the rarest thing in multiplayer design — a shared
world that costs nothing to host, because it is the actual sky.

**The mechanic.** The data refuses to name these aircraft, so the people
watching name them. The first person ever to contact an airframe is offered
three words derived from its own address; whichever they choose is written
globally and permanently. Everyone who meets the aircraft afterwards meets it by
that name, on the map, in the dossier, in the tracking pill and in the ticker,
and is told how many heard it first. There is no score, no level and no
leaderboard. What accumulates is a public record, and your line in it.

**Why this is not a privacy violation, and why that is the point.** The name is
fictional and never touches the registration, the operator or the owner. The
commons gets a record and the owner keeps exactly the privacy they asked for,
because the name the crowd gives is precisely *not* the aircraft's name. The
dossier says so under every one: *a name the listeners gave it. Not its name.*
The two claims do not trade against each other, and the piece would be worth
less if they did.

Both halves of every name come from fixed lists, so there is no free text and
therefore no moderation surface — a decision made for safety that also made the
naming better, because a constrained vocabulary in the register of storm names
and ship names produces *pale heron* and *iron lantern* rather than whatever a
text field would have produced.

**Scale, stated honestly.** Claims are one write per airframe in the history of
the project, which is what KV is for. The "heard by" counter is a
read-modify-write on one key, and KV allows about a write a second per key and
settles eventually, so on a busy airframe some increments are lost: the count is
a floor and the copy never says "exactly". Reading is the part that had to be
right at scale, and the whole commons is served as one object, cached sixty
seconds at the edge — one read per datacentre per minute regardless of how many
people are watching, instead of forty lookups per visitor per poll. Past about
fifty thousand named airframes this becomes a Durable Object per aircraft; the
client only ever reads a name, so that is a migration and not a rewrite.

### The regression this uncovered

Wiring the names into the map labels surfaced something worse than the feature.
The per-frame rebuild budget from §12's pass — six labels a frame, to stop three
hundred canvas redraws landing on the same frame as a rotation — was being
claimed first-come, inside the per-aircraft loop. Every position update
re-dirties every label, so the few aircraft at the head of the map ate all six
rebuilds every frame and nothing behind them ever came up. Measured: **262 of
291 labels had never been redrawn once**, and eight seconds of watching did not
change the number by one.

So it was not showing the names, and it had not been showing altitudes either.
The fix is to hand the budget out before the loop rather than let it be claimed
inside: the manager grants tickets to the stalest few dirty labels, which is the
only ordering that cannot starve anybody. Same 262 aircraft, same eight seconds,
after: **2**.

The lesson is the one this project keeps relearning in different costumes. A
throttle is a scheduler whether or not you write one, and if you do not choose
the order, insertion order chooses it for you — which is never the order you
wanted. It took a new feature failing visibly to expose an old feature that had
been failing invisibly for a week.

## 14. The part that cannot be designed

The naming mechanic in §13 had a hole I did not see until I had played with it
for an afternoon: it is a one-way gesture. You give an airframe a word, and
then nothing. No reason to open the page tomorrow.

The instinct at that point is to add a reason — a streak, a daily goal, a
collection with empty slots asking to be filled. Every one of those is an
invented appetite, and inventing appetites is what I said in §13 I would not do.

The reason was already in the material, and it is the best thing in the project
because it is the one thing in it I could not design. These are real airframes
flying real routes. **The one you named last week flies over again.** All the
piece has to do is notice, and say so.

    SALT ANVIL is back · named 3 days ago

It says it on the line that already tracks your relationship to the unseen, for
twelve seconds, while that aircraft's own ring pulses so you can find it in the
sky. Once per airframe per session, because a greeting repeated is a
notification. No sound: the contact blip already owns that, and a reunion that
beeps is a reunion asking for credit.

Two things had to be got right, and both were wrong first.

**They queued badly.** Several of your aircraft can be overhead at once, and
greeting them one poll apart meant each overwrote the last before it could be
read — four names in eight seconds, none of them legible. They wait for the
slot now.

**The line wrapped.** *SALT ANVIL is back · you named it 3 days ago* renders at
240px in a 238px slot, so for twelve seconds it pushed the tower button and the
weather row down and then pulled them back. I measured rather than guessed:
without the pronoun, the worst case the word lists can produce measures 234.
The pronoun is the part that can go, because this line only ever appears for a
name you gave.

Two smaller additions from the same pass. The ticker carries how many airframes
the commons has named, so a visitor can tell whether they are the fifth person
here or the fifty thousandth — without it the naming reads as a private toy
rather than a shared record. And the dossier now says you are the *n*th person
**here** to hear an aircraft: the count is how many met it through this project,
not how many exist, and the bare version claimed a rarity the data cannot
support.

What I would keep from this: the strongest mechanic in a piece built on live
data is usually the one you have to wait for rather than the one you can ship.
It costs almost nothing to implement and it cannot be faked, because the sky
has to actually bring the thing back.

## 15. Coming back should be cheap

The piece was built to be arrived at. It was not built to be returned to, and
returning is what anyone who actually likes it will do.

So I measured a return visit instead of guessing at it. The shell was fine —
289ms to first byte, interactive in 783ms. Then it spent **fourteen more
seconds** finishing, and the tail was almost entirely one thing:

| | requests | cumulative time |
|---|---|---|
| `/api/trail` | 148 | 35.5s |
| aircraft models | 7 | ~6.8s |

None of it cached between visits, because the service worker opened with
`if (url.pathname.startsWith("/api/")) return;` — a blanket bail-out written
when the only `/api/` route was live positions, and never revisited when trails
arrived. And the models sat outside the cache-first list next to `/assets/`,
`/cifp/` and `/atc/`, so four megabytes of static geometry was re-fetched every
time.

A trail is history, which is exactly the thing that is safe to show slightly
old: it paints from cache instantly and is corrected within the second by the
revalidation already in flight. Capped at ten minutes, past which the aircraft
has moved far enough that a stale trail would be a visible lie rather than a
head start.

| | before | after |
|---|---|---|
| trail, cumulative | 35.5s | 3.5s |
| trail, average | 240ms | 37ms |
| models, cumulative | ~6.8s | 43ms |

124 of 129 trails now answer in under 60ms.

### The overture became a toll

The other cost was mine, not the network's. The opening descent — four and a
bit seconds of camera settling onto the airport, so the sky is arrived at as a
place rather than switched on as a picture — played on **every** entry, because
the flag that suppressed a repeat lived in module scope and died with the page.

That is worth four seconds from someone meeting the piece and it is a toll on
someone who left ten minutes ago. It now plays on a real arrival and not on a
return: six hours away and you get the overture, under it you get the sky. The
flag is a timestamp in local storage, which is the only place a fact about
*this visitor's last visit* can honestly live.

### And then coming back was worth something

Making returns fast is only half of it; a fast return to an unchanged world is
still nothing. The commons is shared, but from inside a single session the only
evidence is a number in the ticker that never visibly moves. Between visits it
does. Holding that number from last time costs one integer:

    4 aircraft were named while you were away

It lands as the boot splash lifts, about eight seconds in, which is where it
belongs — I checked whether it could be earlier and it cannot usefully be, since
earlier means playing to a covered screen. It says nothing on a first visit,
because there is no away to have been in.

The generalisation: I had measured this project's first load many times and its
second load never once, and the second load is the one that decides whether
anybody has a third.
