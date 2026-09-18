#!/usr/bin/env python3
"""Trim a sleeve's white border, square it from the centre, write 1024px.

A generated album cover usually arrives photographed on white: the sleeve is
the artwork and the white is the table it was put on. This finds the artwork's
own bounding box, crops to it, takes the largest centred square, and writes a
JPEG the app can serve.

    coverfit.py in.png src/covers/indie.jpg [--size 1024]

Exit codes: 0 wrote it · 2 bad arguments · 3 the trim found no artwork (the
image is blank, or it is all artwork and there was nothing to trim, which is
also fine — pass --no-trim).
"""

import argparse
import sys

import numpy as np
from PIL import Image


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--size", type=int, default=1024)
    ap.add_argument("--no-trim", action="store_true")
    a = ap.parse_args()

    im = Image.open(a.src).convert("RGB")
    before = im.size

    if not a.no_trim:
        arr = np.asarray(im).astype(int)
        # Anything more than a few points off white on any channel is art. Both
        # tests matter: a pale cream edge is light but not neutral, and a grey
        # scan border is neutral but not light.
        ink = (arr.max(axis=2) < 244) | (arr.min(axis=2) < 226)
        ys, xs = ink.nonzero()
        if len(xs) < 100:
            print("nothing but white in this image", file=sys.stderr)
            return 3
        im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

    w, h = im.size
    side = min(w, h)
    im = im.crop(
        (
            (w - side) // 2,
            (h - side) // 2,
            (w - side) // 2 + side,
            (h - side) // 2 + side,
        )
    )
    im = im.resize((a.size, a.size), Image.LANCZOS)
    im.save(a.dst, quality=90, optimize=True)
    print(f"{before[0]}x{before[1]} -> {a.size}x{a.size}  {a.dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
