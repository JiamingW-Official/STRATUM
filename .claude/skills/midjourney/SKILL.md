---
name: midjourney
description: Drive the user's logged-in Midjourney in Chrome to generate artwork for STRATUM, pick a variant, download it, and cut the background out when the image is meant to be a cutout. Use when asked to make, fetch or re-cut Midjourney artwork — marks, sleeve fields, textures, poster grounds. Carries the project's palette and its rule about what may and may not be generated.
---

# Midjourney → STRATUM

Four steps, and the fourth is conditional: **prompt · pick · download · cut**.

Everything here runs in the user's own Chrome through the `claude-in-chrome`
tools, because that is where the Midjourney session lives. The built-in browser
pane has its own profile and is not logged in — do not try it there.

## 0 · What may be generated at all

This matters more than the prompt craft, so it is first.

STRATUM's whole subject is the difference between what was really heard and
what was assumed, and the cabin carries nothing invented. A generated image is
invented. So:

**Allowed** — ornament and marks that do not claim to be a record of anything:
a texture, a field for a sleeve, an abstract ground, a graphic device, an icon
that is obviously a drawing.

**Not allowed, ever** — anything that will sit where the interface presents
evidence: a city photograph (those come from Wikipedia REST and are credited),
a film still (those are frames from the actual film), a map tile, a face, a
piece of hardware presented as a real receiver, a document. If a generated
image would be read as "this is a photograph of a real thing", it is the one
untrue object in the work and it does not go in.

If the request is for one of those, say so and offer the real source instead.
There is a precedent in this repo: an invented film synopsis was written once
and had to be deleted.

## 1 · Before the first job of a session

- **Cloudflare.** midjourney.com is behind a Turnstile challenge. When the page
  says "Verify you are human" with a checkbox, **stop and ask the user to tick
  it themselves.** Do not click it, do not reload in a loop hoping it passes.
  Completing bot-detection is off limits even when the user asks. Once they
  have ticked it the session usually holds for the rest of the day.
- **Credits.** Every job spends the user's subscription. State the exact prompt
  and how many jobs before the first one, and wait for a yes. After that, run
  the agreed batch without asking again.
- **A tab of its own.** `tabs_context_mcp` first, then `tabs_create_mcp`; do not
  reuse a tab the user is working in. Close it when done — unless the user is
  mid-challenge in it, in which case leave it and say why.

## 2 · The style

Lifted from the sky view's own tokens, which is also the cabin's palette. Put
these in the prompt as colours, not as adjectives.

```
ground    #07080b   near-black, slightly blue
paper     #f0ece2   warm off-white
brass     #c9a45c   the accent — "inferred", "asked not to be seen", "on"
cool      #6aadcc   descent, the part that has not happened, the atmosphere
alert     #b05048   used almost never
```

Reference vocabulary that is actually this work's: mid-century ephemeral film,
kinescope and 16 mm transfer, seat-back panel in a dark cabin, radar
phosphor, printed placard, Blue Note and BFI sleeves, technical diagram,
Bricolage Grotesque / Instrument Sans / JetBrains Mono.

Always append these, from the user's own design rules:

```
--style raw
--no purple blue gradient, glossy 3d render, lens flare, bokeh, emoji,
   sticker, drop shadow, rounded card, hero banner, stock photo, watermark,
   text, logo, signature
```

`--style raw` is not optional: Midjourney's default look — the glow, the
symmetry, the shallow depth of field — is exactly the "AI slop" the rules ban.

Sizes, matching what the interface actually holds:

| For | Flag |
| --- | --- |
| Film cover, poster ground | `--ar 2:3` |
| Station sleeve | `--ar 1:1` |
| Idle or home backdrop | `--ar 16:9` |
| A mark to cut out | `--ar 1:1` + the chroma field below |

**If the image is to be cut out**, generate it for cutting: add
`on a flat solid #00b140 chroma green background, no gradient, no vignette,
no cast shadow, no reflection, centred, full object in frame`. A flat field
keys exactly and needs no model. Without it you are relying on subject
detection, which is good but not exact.

## 3 · Prompt · pick · download

```
navigate → https://www.midjourney.com/imagine
```

Do not hardcode selectors. Midjourney's DOM changes often, so **discover the
controls each run**: `find` with a plain description ("prompt input",
"download button", "the four result images"), and fall back to `read_page`
with `filter: "interactive"`. If `find` returns nothing for the prompt bar,
screenshot and look — do not guess coordinates from a previous run.

1. **Prompt.** Click the prompt input, type the prompt, press Return. One job
   per Return; wait for each to appear rather than queueing blind.
2. **Wait.** A job takes roughly a minute. Poll with `find` for the new result
   rather than a fixed sleep, and screenshot to confirm it finished (not still
   at 40%).
3. **Pick.** Midjourney returns four. Choose on stated criteria, in this order:
   is the background flat enough to key (when it is a cutout), is it free of
   the banned looks, is it in the palette, is the subject whole and not
   cropped. Say which of the four you took and why in one line — the choice is
   a design decision, not a coin toss.
4. **Download.** Open the chosen image, use its own download control (the icon
   on the image, or the item's ⋯ menu). It lands in `~/Downloads`. Then move it
   into the repo's raw folder, which is gitignored:

```bash
mv ~/Downloads/<the-file>.png assets/raw/<subject>-<yyyymmdd>.png
```

   `assets/raw/` never enters git — the standing rule is that large files do
   not, and anything that has to be online goes to R2. Only a small optimised
   export goes into `public/`, and only when something in the app references
   it.

## 4 · Cut the background — the condition

**Cut it** when the image is an object: a mark, an icon, a piece of hardware,
anything that will sit on a cabin panel and must not bring a rectangle of its
own sky with it.

**Leave it** when the image *is* the background: a sleeve field, a texture, a
poster ground, a backdrop. Cutting one of those removes the thing you asked
for. This is the condition — decide it from what the image is for, and say
which branch you took.

Two tools ship with this skill, both verified on this machine, neither needs
anything installed:

```bash
# A · the image was generated on a flat chroma field. Exact, no model.
python3 .claude/skills/midjourney/tools/keyflat.py in.png out.png --key "#00b140"

# B · a photographic subject on a busy background. Vision's foreground mask,
#     the same one the Photos app uses when you drag a subject out.
.claude/skills/midjourney/tools/subjectlift in.png out.png --edge 1.0
```

`subjectlift` is a compiled Swift binary. If it is missing or the OS has moved
under it:

```bash
swiftc -O -o .claude/skills/midjourney/tools/subjectlift \
  .claude/skills/midjourney/tools/subjectlift.swift
```

Exit codes matter. `subjectlift` returns **3** when it finds no subject — then
fall back to A, or regenerate on a chroma field. `keyflat.py` returns **3**
when the key would take less than 2% or more than 98% of the frame, which
means the image was wrong for that path, not that the tolerance needs
loosening.

Both take `--edge` / `--feather`: a pixel or so of softness, because a hard
edge on a cutout sitting on a dark panel reads as a sticker.

**Then check the alpha rather than trusting the exit code:**

```bash
python3 - <<'PY'
from PIL import Image
a = Image.open("out.png").convert("RGBA").getchannel("A")
px = list(a.getdata()); n = len(px)
print(f"opaque {sum(v>250 for v in px)*100//n}%  clear {sum(v<5 for v in px)*100//n}%")
PY
```

A cutout of a single object usually lands between 8% and 45% opaque. Near 0%
means it lifted nothing; near 100% means it lifted the whole frame.

## 5 · Report

Say, in one or two lines: the prompt used, which of the four was taken and
why, where the file is, whether the background was cut and by which of the two
paths, and the alpha share. Send the finished file so the user can see it.

Never say an image is "on brand" — show it.
