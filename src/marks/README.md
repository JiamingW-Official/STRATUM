# src/marks

One icon per menu row, found by name. Whatever `.webp` is sitting here named
after a row's key is that row's mark; a row with no file keeps the drawn one,
which is what this cabin had before any of these existed.

    map.webp      Flight map
    info.webp     Flight information
    sky.webp      The sky
    movies.webp   Movies
    music.webp    Music
    games.webp    Games
    chat.webp     Seat messages

Square, full bleed: the artwork goes edge to edge and the rounding is applied
in CSS, so the tile's corners cannot disagree with the panel's radius.

To install one:

    python3 .claude/skills/midjourney/tools/coverfit.py ~/Downloads/raw.png \
      src/marks/map.webp --size 512

That trims the white the generator photographs it on, takes the largest
centred square and writes a WebP. Check afterwards: exactly square, well
under 100 KB at 512, and no pale strip along any edge.

**What may be here.** These are icons, and an icon is obviously a drawing.
Nothing in this folder may sit where the interface presents evidence — no
city photograph, no film frame, no map tile, no piece of hardware presented
as a real receiver. A made picture of a record on a menu row is a made
picture of a record; a made picture of London on the home screen would be the
one untrue object in the work.

---

## The prompts

Written for Gemini, so they are sentences rather than flags. Every one of the
seven opens with the same three paragraphs — that is what makes them a set
rather than seven unrelated pictures — and then names its own object.

### The preamble, identical in all seven

> A single app icon, rendered as a physical object. Square, 1:1. The artwork
> fills the entire square frame edge to edge, with no rounded corners and no
> border — the rounding is applied afterwards in software. Put that square in
> the middle of a plain pure-white background with a wide white margin all
> round it.
>
> Style: iOS 26 icon language. One object, seen straight on, lit by a single
> soft light from above and slightly in front. Real materials with real
> weight, shallow depth, a quiet specular along the top edge, a soft contact
> shadow underneath. Machined and physical, like a control on an aircraft
> panel — not a flat vector glyph, not a sticker, not a cartoon.
>
> Materials and colours, exactly these: the tile's ground is near-black
> anodised aluminium, #07080b through #12161d, very finely brushed. The
> object on it is warm brass, #c9a45c, matte with polished edges. Highlights
> in warm off-white, #f0ece2. No text, no letters, no numbers, no logos, no
> watermark. No purple or blue gradients, no neon glow, no lens flare, no
> bokeh, no emoji, no photographic background, no hands, no people.

### The seven objects

**map.webp — Flight map.** The object: a shallow segment of a globe seen from
above and slightly in front, machined from the dark metal, with the coastlines
very faintly etched into its surface. One polished brass great-circle arc
rises off the surface from one side to the other, with a small brass sphere at
each end of it. Nothing else on the tile.

**info.webp — Flight information.** The object: an aircraft instrument dial —
a round gauge in a heavy brass bezel, sunk into the tile. The face is matte
near-black with a fine off-white tick scale round the rim and one brass needle
pointing up and to the right. Glass over the face, with a single soft
reflection across the top left. The face carries no numbers.

**sky.webp — The sky.** The object: a shallow dome of very dark blue glass, as
if you were looking straight up at a clear night. A small polished off-white
aeroplane, seen from directly underneath, sits a little above centre. Three
thin concentric brass arcs spread outward from it like the rings of a radio
signal, fading as they widen. One cool #6aadcc rim light around the dome's
edge — the only cool colour in the set.

**movies.webp — Movies.** The object: a short length of 16 mm film. A physical
strip of dark celluloid with brass sprocket holes down both edges, curled once
so the light rakes across it, standing on the tile. Two frames visible, both
blank and slightly milky off-white, with nothing printed on them.

**music.webp — Music.** The object: a vinyl record seen straight on. Black and
finely grooved, so the light crosses the grooves in a single arc. A plain
brass centre label and a small off-white spindle hole. Lifted slightly off the
tile, with a soft shadow under its lower edge.

**games.webp — Games.** The object: four small square tiles in a two-by-two
block, like loose pieces from a sliding puzzle, machined from the same dark
metal with polished brass chamfers on every edge. One of them sits slightly
proud of the others and slightly rotated, as if it has just been moved. All
four faces are blank.

**chat.webp — Seat messages.** The object: two small rectangular placards of
warm off-white card, one lying across the other and offset, each with a thin
brass edge and one crisp fold. The top one lifts very slightly off the one
beneath it, with a soft shadow between them. Both faces are blank — no
writing, no ruled lines.
