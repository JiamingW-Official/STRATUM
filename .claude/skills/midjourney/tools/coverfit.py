#!/usr/bin/env python3
"""Trim a sleeve's white border, square it from the centre, write 1024px.

The format comes from the destination's extension. Prefer .webp: measured on
the densest halftone of the four sleeves, against a master that never went
through a lossy save, WebP at 90 is 171 KB at 36.6 dB where JPEG at 90 is
237 KB at 36.1 dB — smaller *and* very slightly closer to the original. That
is the whole argument; flat colour with a fine dot screen is what WebP is good
at and what JPEG is worst at.

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
    ap.add_argument("--quality", type=int, default=90)
    ap.add_argument("--no-trim", action="store_true")
    ap.add_argument(
        "--edge",
        type=float,
        default=0.02,
        help="fraction of a row that must be artwork for the row to count",
    )
    a = ap.parse_args()

    im = Image.open(a.src).convert("RGB")
    before = im.size

    if not a.no_trim:
        arr = np.asarray(im).astype(int)
        # Anything more than a few points off white on any channel is art. Both
        # tests matter: a pale cream edge is light but not neutral, and a grey
        # scan border is neutral but not light.
        ink = (arr.max(axis=2) < 244) | (arr.min(axis=2) < 226)
        if ink.sum() < 100:
            print("nothing but white in this image", file=sys.stderr)
            return 3

        # By row and column, not by pixel. A bounding box taken over
        # individual pixels is decided by the single lightest speck in the
        # margin — one stray dot of JPEG noise out in the white and the box is
        # the whole frame, which is how three of four sleeves came through
        # this with their white border still on. A row counts as artwork when
        # enough of it is.
        h, w = ink.shape
        rows = ink.sum(axis=1) > w * a.edge
        cols = ink.sum(axis=0) > h * a.edge
        if not rows.any() or not cols.any():
            print("no row or column is mostly artwork", file=sys.stderr)
            return 3
        ys = rows.nonzero()[0]
        xs = cols.nonzero()[0]
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
    if a.dst.lower().endswith(".webp"):
        im.save(a.dst, format="WEBP", quality=a.quality, method=6)
    else:
        im.save(a.dst, format="JPEG", quality=a.quality, optimize=True)
    print(f"{before[0]}x{before[1]} -> {a.size}x{a.size}  {a.dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
