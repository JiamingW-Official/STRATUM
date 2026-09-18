# Sleeve art

One square JPEG per station, named after the station's id in
`src/data/stations.js`:

    electronic.jpg   Night Shift
    indie.jpg        First Light
    relax.jpg        Low Cloud
    soul.jpg         After Hours

Whatever is here is picked up by a glob in `src/ife/chrome/Sleeve.tsx` — no
path to edit, no manifest to keep in step. A station with no file here gets
the drawn sleeve instead: its name, its colour, and one groove per track. That
is not a placeholder, it is the sleeve a record with no cover has.

Square, about 1024px, and cropped to the artwork with no white border around
it. Vite fingerprints and serves them, so they belong here rather than in
`public/` — a file in `public/` that does not exist is a 404 on every screen
that draws a sleeve, and a glob of an empty folder is nothing at all.
