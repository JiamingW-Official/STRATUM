#!/usr/bin/env python3
"""Key a flat background out of an image and write a PNG with alpha.

This is the deterministic half of the pair. `subjectlift` asks a model what
the subject is; this asks nothing — it takes the colour at the edge of the
frame and removes every pixel connected to the edge that matches it. On an
image generated *for* cutting out (a flat chroma field, no gradient, no cast
shadow) it gives an exact edge with no model and no guessing, and it never
punches a hole in the middle of the subject the way a global colour replace
does, because it only removes what the border can reach.

    keyflat.py in.png out.png [--key "#00b140"] [--tol 14] [--feather 1.2]
                              [--shrink 0.6]

--key      the background colour. Omitted, it is the median of the four
           corners, which is right whenever the background really is flat.
--tol      how far from that colour still counts as background, 0-100.
--feather  blur on the alpha only, in pixels. A hard edge on a cutout that
           will sit on a dark panel reads as a sticker.
--shrink   pull the edge in by this many pixels before feathering, which is
           what removes the halo of background colour that survives on the
           boundary. 0 turns it off.

Exit codes: 0 wrote a cutout · 2 bad arguments · 3 the key would remove
almost everything or almost nothing (the caller should not use this image)
"""

import argparse
import sys

import numpy as np
from PIL import Image
from scipy import ndimage


def parse_hex(s: str) -> np.ndarray:
    s = s.strip().lstrip("#")
    if len(s) != 6:
        raise ValueError(f"not a #rrggbb colour: {s}")
    return np.array([int(s[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--key")
    ap.add_argument("--tol", type=float, default=14.0)
    ap.add_argument("--feather", type=float, default=1.2)
    ap.add_argument("--shrink", type=float, default=0.6)
    a = ap.parse_args()

    im = Image.open(a.src).convert("RGB")
    # float32, not int16: squaring a channel difference of more than 181
    # overflows int16, and the sum of three of them came out negative, which
    # made the distance NaN for exactly the pixels furthest from the key.
    rgb = np.asarray(im, dtype=np.float32)
    h, w, _ = rgb.shape

    if a.key:
        key = parse_hex(a.key)
    else:
        corners = np.array(
            [rgb[0, 0], rgb[0, w - 1], rgb[h - 1, 0], rgb[h - 1, w - 1]],
            dtype=np.float32,
        )
        key = np.median(corners, axis=0)

    # Distance in plain RGB, as a fraction of the longest possible distance.
    dist = np.sqrt(((rgb - key) ** 2).sum(axis=2)) / (255 * np.sqrt(3)) * 100
    near = dist <= a.tol

    # Only what the border can reach. This is the whole point: a subject that
    # happens to contain the key colour keeps it.
    labels, n = ndimage.label(near)
    if n == 0:
        print("nothing matched the key colour", file=sys.stderr)
        return 3
    edge_labels = set(labels[0, :]) | set(labels[-1, :])
    edge_labels |= set(labels[:, 0]) | set(labels[:, -1])
    edge_labels.discard(0)
    if not edge_labels:
        print("the key colour does not touch the border", file=sys.stderr)
        return 3
    background = np.isin(labels, list(edge_labels))

    share = background.mean()
    if share < 0.02 or share > 0.98:
        print(
            f"key would remove {share * 100:.1f}% of the frame — wrong image "
            "or wrong key colour",
            file=sys.stderr,
        )
        return 3

    alpha = np.where(background, 0.0, 255.0)
    if a.shrink > 0:
        # Erode the kept area, not the background, so the fringe goes.
        keep = ndimage.binary_erosion(
            ~background, iterations=max(1, int(round(a.shrink)))
        )
        alpha = np.where(keep, 255.0, 0.0)
    if a.feather > 0:
        alpha = ndimage.gaussian_filter(alpha, sigma=a.feather)

    out = np.dstack([np.asarray(im, dtype=np.uint8), alpha.clip(0, 255).astype(np.uint8)])
    Image.fromarray(out, "RGBA").save(a.dst)
    print(
        f"keyed #{''.join(f'{int(c):02x}' for c in key)} · removed "
        f"{share * 100:.1f}% · {w}x{h} · {a.dst.split('/')[-1]}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
