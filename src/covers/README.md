# Sleeve art

One square WebP per station, named after the station's id in
`src/data/stations.js`:

    electronic.webp   Night Shift
    indie.webp        First Light
    relax.webp        Low Cloud
    soul.webp         After Hours

Whatever is here is picked up by a glob in `src/ife/chrome/Sleeve.tsx` — no
path to edit, no manifest to keep in step. A station with no file here gets
the drawn sleeve instead: its name, its colour, and one groove per track. That
is not a placeholder, it is the sleeve a record with no cover has.

Square, 1024px, WebP at quality 90, and cropped to the artwork with no white
border around it. WebP rather than JPEG because it is measurably both smaller
and slightly closer to the original on this kind of image: on the densest of
these four sleeves, 171 KB at 36.6 dB against JPEG's 237 KB at 36.1 dB. Flat
colour with a fine dot screen is what WebP is good at and what JPEG is worst
at. `.claude/skills/midjourney/tools/coverfit.py` does the whole step and
picks the format from the extension you give it. Vite fingerprints and serves them, so they belong here rather than in
`public/` — a file in `public/` that does not exist is a 404 on every screen
that draws a sleeve, and a glob of an empty folder is nothing at all.
