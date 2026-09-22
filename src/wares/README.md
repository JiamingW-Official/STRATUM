# src/wares

One picture per item in the duty-free guide, found by name. Whatever `.webp`
is sitting here named after an item's `id` is that item's picture; an item
with no file falls back to the drawn silhouette in `src/ife/chrome/Ware.tsx`,
which is a complete answer on its own rather than a placeholder.

    gin-london.webp        London dry gin
    whisky-speyside.webp   Speyside single malt
    cognac-vsop.webp       Cognac VSOP            (first and business only)
    edp-neroli.webp        Neroli eau de parfum
    edt-vetiver.webp       Vetiver eau de toilette
    hand-cream.webp        Hand cream
    watch-field.webp       Field watch
    silk-square.webp       Silk square
    sunglasses.webp        Oval sunglasses
    model-aircraft.webp    Airliner model, cutaway
    playing-cards.webp     Playing cards
    travel-socks.webp      Compression socks

All twelve are photographs. `CREDITS.md` says who took each one and under
what licence — seven owe nothing, two owe a credit, three carry share-alike,
and that last group is an obligation on anything that redistributes them.

## How they got here

`.claude/skills/photofind`, which is the workflow rather than a note about
one:

    findphoto.py find  "silk scarf" --limit 10 --json c.json
    findphoto.py sheet c.json sheet.png          # then look at it
    findphoto.py get   "File:Scarf MET CP228 CP4.jpg" raw.png --width 1600
    cutout.py          raw.png src/wares/silk-square.webp --size 512 --floor 110

Three numbers hold the shelf together, and each was argued down from a
guess to a measurement:

**Box, not mass.** Every object is scaled so its longest side fills the same
share of the square. `src/marks` normalises by optical mass instead, and
copying that here was wrong: sunglasses are mostly holes, so matching their
ink to a bottle's draws them wider than the card. Measured on two real
cutouts it gave 0.31 and 0.10 of the square.

**A floor on value, not a target.** The twelve arrived between 51 and 186
mean luminance. Against a panel at 20 the bottom of that range is not dark,
it is gone — a green whisky bottle on navy was a rumour. So anything under
110 is lifted to it and anything above is left alone, which keeps the black
sunglasses darker than the white cream because that is true.

**150 x 170 in the card.** It was 90 x 110 when these were line drawings,
and a photograph at that size is a thumbnail beside a label rather than the
goods in a guide.

## What may be here

These are real products and the labels on them are real. That is what a
duty-free trolley carries, so it is what the pictures show — but it does
mean the cabin is displaying other people's marks, and an aircraft that
actually flew this would need their agreement and not only the
photographer's. `CREDITS.md` says the same thing where the licences are.

Where a photograph contradicted its caption the caption moved, because a
picture that makes a false claim is the one thing this project does not
ship: the sunglasses are oval and no longer aviators, the silk square is
linked rings and no longer a route map, and the model is a cutaway DC-7 in
somebody else's livery and no longer "this aircraft, in this livery".

---

## If a picture has to be made instead

Kept because the search that found these twelve is worth knowing about: a
first pass ran every item through the same skill under a no-brands rule, and
almost nothing survived. The free web's product photography is photography
*for a maker* — the picture and the brand arrive together — and what is left
over is museum glass and clipart. If a future item needs a picture that
claims nothing about anybody, rendering it is the route, and these prompts
are the set.

Written for Gemini, so they are sentences rather than flags. Every one opens
with the same three paragraphs — that is what makes them a set rather than
twelve unrelated pictures — and then names its own object.

> A single product photograph on a pure white background, lit by one soft key
> light from the upper left and a weak fill from the right, so the object has
> one clear shadow side and no second highlight. Studio product photography,
> shot straight on at eye level, the whole object inside the frame with a
> little air around it. No surface under it, no cast shadow, no reflection,
> no backdrop gradient — the object and white, nothing else.
>
> The object is unbranded. No logo, no legible text, no label anybody could
> read as a real maker's. Where a real product of this kind would carry a
> label, this one carries a plain band of colour or an embossed shape.
>
> Materials are real and plain: glass is glass, steel is steel, cloth has
> weave. Nothing is glossy beyond what the material actually is, and nothing
> is styled — this is a catalogue photograph, not an advertisement.

Then, one per file:

- **gin-london** — A tall clear glass spirits bottle, square shoulders, long
  neck, a dark green wax capsule over the cork. The liquid inside is clear.
  A plain deep-green band where a label would be, with nothing printed on it.

- **whisky-speyside** — A squat single-malt bottle in heavy clear glass,
  rounded shoulders, short neck, amber spirit inside. A cream-coloured blank
  label panel and a dark cap.

- **cognac-vsop** — A cognac bottle with a wide base and a narrow waisted
  neck, deep amber spirit, a gold-coloured collar at the neck and a blank
  black label panel.

- **edp-neroli** — A heavy rectangular glass perfume bottle with a thick
  base, pale orange liquid, a flat polished metal cap. No atomiser collar
  visible.

- **edt-vetiver** — A taller cylindrical glass flask, smoke-grey glass, pale
  green liquid, a matte dark wooden cap.

- **hand-cream** — A soft aluminium tube standing on its cap, pale cream
  colour, gently squeezed at the top so the seam shows. Blank.

- **watch-field** — A steel field watch, matte brushed case, black dial with
  plain baton markers and two hands, no numerals, on an olive canvas strap
  laid flat in a shallow curve.

- **silk-square** — A silk scarf hung from one corner so it falls as a
  diamond, printed with a fine pale line drawing of an airline route map on
  a deep blue ground. The weave catches the light along one fold.

- **sunglasses** — Aviator sunglasses, thin gold wire frame, dark green glass
  lenses, folded, three-quarter view from slightly above.

- **model-aircraft** — A die-cast model airliner on a small polished metal
  stand, white fuselage with one brass stripe along the windows, seen from
  the front three-quarter angle. No airline name anywhere.

- **playing-cards** — A pack of playing cards in a plain card case, deep blue
  with a brass border, one card slid halfway out showing a plain back
  pattern. No index, no court card.

- **travel-socks** — A pair of compression socks in charcoal ribbed knit,
  one rolled and one laid flat beside it, so the ribbing reads.
