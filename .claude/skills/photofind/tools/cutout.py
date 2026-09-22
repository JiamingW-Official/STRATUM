#!/usr/bin/env python3
"""Cut a found photograph out of its background and put it on the shelf.

    cutout.py in.jpg src/wares/watch-field.webp [--size 512] [--fit box]
                                                [--crop x,y,w,h] [--air 0.08]

Stage three. `findphoto.py` brought a picture down with its licence; this
turns it into something that can sit on a panel beside eleven others without
being the one that looks wrong.

`--crop x,y,w,h` takes a rectangle of the source first, in source pixels,
for the photograph that contains the subject *and something else*. The deck
of cards here came with a hand placing it; Vision lifts the hand too,
because the hand is the subject of that photograph. Naming the rectangle is
the honest fix and it is a person's judgement again, not a filter's.

── Lift, then key, then give up honestly ──────────────────────────────────
`subjectlift` first: it asks Vision what the subject is, which works on a
real photograph with a real background. If it finds nothing (exit 3) the
picture probably *is* an object on a flat field, so `keyflat` takes over and
removes what the border can reach. If neither works the file is not usable
and saying so is the correct output — there is no third algorithm, and a
half-keyed bottle with a grey rind is worse than a drawing.

── How big, and how bright ────────────────────────────────────────────────
Two knobs, and the first one had to be argued out rather than copied.

`src/marks` normalises by optical mass — opaque pixels over the square — so
four menu marks carry the same weight. Doing that here was measured and
wrong: a pair of sunglasses is mostly holes, so matching its *ink* to a
bottle's means drawing it half again wider than the card. Run on the two
real cutouts it gave one object at 0.31 of the square and the other at 0.10,
which is the opposite of the thing being asked for.

The shelf's unit is the card, not the ink. And the ten drawings it sits
beside are each drawn to fill one 120x160 box, so box is already the rule
this screen uses:

    fit box    the object's longest side becomes 1 - 2*air of the square
    fit mass   opaque pixels / square reaches --mass (the marks rule)

Either way it is set by *scaling*, never by cropping: the object keeps its
proportions and the square gets more or less air.

`--value` is off by default, and that is the second rule copied from
`src/marks` and then thrown away. Pushing every mark to one mean luminance
is right for line art, where the ink has no colour of its own and a darker
mark is just a heavier mark. An object does have a colour of its own. Run
on a pair of black sunglasses it lifted them to a flat grey-white — it had
been told they were underexposed, when they were black. A white bottle and
a black watch are allowed to differ, and that difference is the photograph.

Pass `--value 135` only when a picture really is mis-exposed against the
others. It is a gamma when it runs, not a brightness offset — an offset
crushes a highlight to flat white, where a gamma moves the middle and
leaves both ends where the photographer put them.

`--floor` is the rule that survived contact with a real shelf, and it is a
floor rather than a target for exactly the reason above. Twelve found
photographs came in between 51 and 186 mean luminance, and against a panel
at 20 the bottom of that range is not dark, it is *gone*: a dark green
whisky bottle on navy is a rumour. So anything below the floor is lifted to
it and anything above is left alone — the black sunglasses stay darker than
the white hand cream, which is true, while nothing disappears.

    floor 110   about 3.9:1 against rgb(10,21,36), measured

── The one thing this cannot check ────────────────────────────────────────
Whether the object is somebody's brand. That was gate 2 in findphoto.py and
it belongs to a person. This script will happily normalise a trademark.
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
# The lifter lives with the skill that first needed it; there is one copy.
LIFT = os.path.join(HERE, "..", "..", "midjourney", "tools", "subjectlift")
KEY = os.path.join(HERE, "..", "..", "midjourney", "tools", "keyflat.py")


def lift(src: str, dst: str, edge: float) -> str:
    """Vision first, the deterministic key second. Returns which one worked."""
    if os.path.exists(LIFT):
        r = subprocess.run([LIFT, src, dst, "--edge", str(edge)], capture_output=True)
        if r.returncode == 0:
            return "subjectlift"
        if r.returncode not in (3, 4):
            print(r.stderr.decode()[:200], file=sys.stderr)
    r = subprocess.run(
        [sys.executable, KEY, src, dst, "--feather", str(edge), "--shrink", "0.8"],
        capture_output=True,
    )
    if r.returncode == 0:
        return "keyflat"
    raise SystemExit(f"neither lift nor key worked on {src}: {r.stderr.decode()[:200]}")


def normalise(im: Image.Image, size: int, mass: float, value: float | None,
              air: float, fit: str = "box", floor: float | None = None):
    """Trim to the subject, scale it to the target mass, centre it, set value."""
    a = np.array(im.convert("RGBA"))
    alpha = a[:, :, 3]
    ys, xs = np.nonzero(alpha > 8)
    if len(ys) == 0:
        raise SystemExit("the cutout is empty")
    im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

    # The box the object gets to occupy, which is what the ten drawings
    # beside it already use.
    box = (size * (1 - 2 * air)) / max(im.width, im.height)
    if fit == "mass":
        a = np.array(im.convert("RGBA"))
        fill = float((a[:, :, 3] > 8).sum()) / (im.width * im.height)
        # side² · fill = mass · size² → the side the object's box must become.
        side = (mass * size * size / max(fill, 1e-6)) ** 0.5
        # Never let a sparse object run off the square to make up its ink.
        scale = min(side / max(im.width, im.height), box)
    else:
        scale = box
    w, h = max(1, round(im.width * scale)), max(1, round(im.height * scale))
    im = im.resize((w, h), Image.LANCZOS)

    a = np.array(im.convert("RGBA")).astype(np.float32)
    op = a[:, :, 3] > 128
    if value is None and floor is not None and op.any():
        lum = (0.2126 * a[:, :, 0] + 0.7152 * a[:, :, 1] + 0.0722 * a[:, :, 2])[op]
        if lum.mean() < floor:
            value = floor
    if value is not None and op.any():
        def mean_lum(arr):
            return float(
                (0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2])[
                    op
                ].mean()
            )

        # Three passes, because one is not enough: the gamma is solved on the
        # luminance but applied to the three channels, and on a saturated
        # object those are not the same curve — one pass on the pink scarf
        # landed at 118 against a target of 135. Each pass re-solves against
        # what the last one actually produced, and it converges in two.
        for _ in range(3):
            cur = mean_lum(a)
            if cur <= 1 or abs(cur - value) <= 1:
                break
            g = np.log(max(value, 1) / 255.0) / np.log(max(cur, 1) / 255.0)
            g = float(np.clip(g, 0.4, 2.5))
            a[:, :, :3] = 255.0 * np.power(np.clip(a[:, :, :3] / 255.0, 0, 1), g)
        im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")

    sq = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sq.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    return sq


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--size", type=int, default=512)
    ap.add_argument("--mass", type=float, default=0.36)
    ap.add_argument("--value", type=float, default=None)
    ap.add_argument("--air", type=float, default=0.08)
    ap.add_argument("--fit", default="box", choices=["box", "mass"])
    ap.add_argument("--crop", help="x,y,w,h in source pixels, taken first")
    ap.add_argument("--floor", type=float, default=None,
                    help="lift to this mean luminance only if below it")
    ap.add_argument("--edge", type=float, default=1.2)
    ap.add_argument("--quality", type=int, default=88)
    a = ap.parse_args()

    with tempfile.TemporaryDirectory() as tmp:
        src = a.src
        if a.crop:
            x, y, w, h = (int(v) for v in a.crop.split(","))
            src = os.path.join(tmp, "crop.png")
            Image.open(a.src).convert("RGB").crop((x, y, x + w, y + h)).save(src)
        cut = os.path.join(tmp, "cut.png")
        how = lift(src, cut, a.edge)
        im = normalise(Image.open(cut), a.size, a.mass, a.value, a.air, a.fit,
                       a.floor)
        im.save(a.dst, "WEBP", quality=a.quality, method=6, exact=True)

    # Carry the slip across. A cutout of a CC BY photograph is still that
    # photographer's picture and the credit has to travel with the file, not
    # live in a note somebody remembers to keep.
    slip = a.src + ".json"
    if os.path.exists(slip):
        rec = json.load(open(slip))
        rec["cut_with"] = how
        rec["normalised"] = {"size": a.size, "fit": a.fit, "value": a.value}
        rec["normalised"] = {k: v for k, v in rec["normalised"].items() if v is not None}
        json.dump(rec, open(a.dst + ".json", "w"), ensure_ascii=False, indent=2)

    arr = np.array(Image.open(a.dst).convert("RGBA")).astype(np.float32)
    op = arr[:, :, 3] > 128
    lum = (0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2])[op]
    print(
        f"{a.dst}  {how}  mass {op.mean():.3f}  value {lum.mean():.0f}  "
        f"{os.path.getsize(a.dst) // 1024} KB"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
