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
