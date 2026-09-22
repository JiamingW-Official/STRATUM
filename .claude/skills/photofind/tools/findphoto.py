#!/usr/bin/env python3
"""Find a photograph on the free web and bring it down with its papers.

Three verbs, because the three gates a picture has to pass are different
kinds of question and only one of them is a machine's to answer:

    findphoto.py find  "compression socks" [--limit 12] [--source both]
    findphoto.py sheet candidates.json sheet.png     # look at them, at once
    findphoto.py get   "<id or File:Title>" out.png  [--width 2000]

── The three gates ────────────────────────────────────────────────────────
1. LICENCE, which a script can decide. Every result carries a machine-
   readable licence and `find` ranks and marks it; `get` refuses anything
   outside the allowed classes.
2. SUBJECT, which a script cannot decide and must not pretend to. Is this a
   photograph of the thing, or of somebody's brand of the thing? That is
   what `sheet` is for: it tiles the candidates into one image so a person
   looks at all of them in one glance instead of accepting a filename.
3. FIT, also a person's: is it lit like the others, shot from the same kind
   of angle, and is the object free enough of its background to cut out.

The failure this ordering prevents is the obvious one — a search for "gin
bottle" returns, correctly licensed and beautifully photographed, a bottle
of Bombay Sapphire. A filter cannot see the label. Skipping gate 2 is how a
project ends up shipping somebody's trademark.

── The licence classes ────────────────────────────────────────────────────
    public     PD, CC0, PDM — no obligation at all
    by         CC BY — must credit, and that is all
    by-sa      CC BY-SA — must credit *and* license derivatives alike

A cutout is a derivative, so taking a BY-SA photograph puts share-alike on
whatever ships it. That is a decision about the repository, not one a script
makes, so by-sa is ranked last, marked `!`, and refused unless it is asked
for by name.

── The two libraries ──────────────────────────────────────────────────────
Wikimedia Commons and Openverse, because both hand back a licence, a named
author and a stable page. An image search hands back pictures; these hand
back pictures you may actually use. Neither needs a key.

`get` writes `<out>.json` beside the file holding what a credit line is made
of. Nothing downstream has to remember where a picture came from, because
the picture carries it.
"""

import argparse
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request

COMMONS = "https://commons.wikimedia.org/w/api.php"
OPENVERSE = "https://api.openverse.org/v1/images/"
# Both libraries ask for a real agent and a way to be contacted. Being a
# robot is fine; being an anonymous one is what gets a project blocked.
AGENT = "STRATUM-photofind/1.0 (https://github.com/JiamingW-Official/STRATUM)"

# Read in order, first hit wins. Anything matching nothing is unknown, which
# is treated as the strictest case rather than the loosest.
# Tried in this order, first hit wins, and by-sa comes first on purpose:
# "cc by-sa 4.0" also starts with every one of the "by" heads.
CLASSES = {
    "by-sa": ("cc by-sa", "cc-by-sa", "by-sa", "gfdl", "fal"),
    "public": ("cc0", "pdm", "public domain", "pd-", "no restrictions"),
    "by": ("cc by 1.0", "cc by 2.0", "cc by 2.5", "cc by 3.0", "cc by 4.0", "by"),
}
RANK = {"public": 0, "by": 1, "by-sa": 2, "unknown": 3}
MARK = {"public": "  ", "by": "  ", "by-sa": "! ", "unknown": "? "}


def classify(short: str) -> str:
    s = (short or "").strip().lower()
    for name, heads in CLASSES.items():
        if any(s.startswith(h) for h in heads):
            return name
    return "unknown"


def plain(html: str) -> str:
    """Both libraries return small HTML fragments in these fields."""
    text = re.sub(r"<[^>]+>", " ", html or "")
    text = urllib.parse.unquote(text)
    text = text.replace("&amp;", "&").replace("&#039;", "'")
    return re.sub(r"\s+", " ", text).strip()


def fetch(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": AGENT})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1.5 * (attempt + 1))
    return b""


# ── Wikimedia Commons ──────────────────────────────────────────────────────


def commons_call(params: dict) -> dict:
    params = {**params, "format": "json", "formatversion": "2"}
    return json.loads(fetch(f"{COMMONS}?{urllib.parse.urlencode(params)}"))


def commons_row(title: str, info: dict) -> dict:
    meta = info.get("extmetadata", {}) or {}
    short = plain(meta.get("LicenseShortName", {}).get("value", ""))
    return {
        "source": "commons",
        "id": title,
        "title": title.split(":", 1)[-1],
        "page": info.get("descriptionurl", ""),
        "url": info.get("url", ""),
        "w": info.get("width", 0),
        "h": info.get("height", 0),
        "licence": short or "unknown",
        "licence_url": plain(meta.get("LicenseUrl", {}).get("value", "")),
        "author": plain(meta.get("Artist", {}).get("value", "")) or "unknown",
        "class": classify(short),
    }


def commons_find(query: str, limit: int) -> list[dict]:
    data = commons_call(
        {
            "action": "query",
            "generator": "search",
            "gsrnamespace": "6",
            "gsrlimit": str(max(limit * 3, 20)),
            "gsrsearch": query,
            "prop": "imageinfo",
            "iiprop": "url|size|extmetadata|mime",
        }
    )
    out = []
    for page in (data.get("query", {}) or {}).get("pages", []) or []:
        info = (page.get("imageinfo") or [None])[0]
        if not info or info.get("mime") not in ("image/jpeg", "image/png"):
            continue
        out.append(commons_row(page["title"], info))
    return out


def commons_render(title: str, width: int) -> str:
    """A scaled render. Special:FilePath does the resizing server-side, so a
    4000px museum scan does not come down whole to be thrown away."""
    name = title.split(":", 1)[-1].replace(" ", "_")
    return (
        "https://commons.wikimedia.org/wiki/Special:FilePath/"
        f"{urllib.parse.quote(name)}?width={width}"
    )


# ── Openverse ──────────────────────────────────────────────────────────────


def openverse_find(query: str, limit: int) -> list[dict]:
    q = urllib.parse.urlencode(
        {
            "q": query,
            "license": "cc0,pdm,by",
            # No size filter. The libraries of isolated-on-white product
            # photography — the only place this search reliably finds an
            # object rather than a scene — publish at around 1024px, and
            # asking for "large" excludes every one of them. Ranking by
            # pixels below keeps the big files first anyway.
            "page_size": str(min(max(limit * 2, 10), 20)),
        }
    )
    try:
        data = json.loads(fetch(f"{OPENVERSE}?{q}"))
    except Exception:
        return []
    out = []
    for r in data.get("results", []) or []:
        # SVG is a drawing, not a photograph, and nothing downstream can key
        # a background out of one.
        if (r.get("filetype") or "").lower() == "svg" or (r.get("url") or "").lower().endswith(".svg"):
            continue
        short = (r.get("license") or "").upper()
        ver = r.get("license_version") or ""
        label = f"{short} {ver}".strip()
        out.append(
            {
                "source": "openverse",
                "id": r.get("id", ""),
                "title": plain(r.get("title") or ""),
                "page": r.get("foreign_landing_url", "") or r.get("url", ""),
                "url": r.get("url", ""),
                "w": r.get("width") or 0,
                "h": r.get("height") or 0,
                "licence": label or "unknown",
                "licence_url": r.get("license_url", "") or "",
                "author": plain(r.get("creator") or "") or "unknown",
                # Openverse already names the licence in a fixed vocabulary,
                # so it is read directly rather than through the string
                # matcher that Commons' free-text short names need.
                "class": (
                    "public"
                    if short in ("CC0", "PDM")
                    else "by-sa"
                    if "SA" in short
                    else "by"
                    if short.startswith("BY")
                    else "unknown"
                ),
            }
        )
    return out


# ── The verbs ──────────────────────────────────────────────────────────────


def find(query: str, limit: int, source: str) -> list[dict]:
    rows = []
    if source in ("commons", "both"):
        rows += commons_find(query, limit)
    if source in ("openverse", "both"):
        rows += openverse_find(query, limit)
    seen, out = set(), []
    for r in rows:
        key = (r["title"].lower(), r["w"], r["h"])
        if key in seen:
            continue
        seen.add(key)
        out.append(r)
    # Freest first; among equals the biggest, because every step after this
    # one throws pixels away.
    out.sort(key=lambda c: (RANK[c["class"]], -(c["w"] or 0) * (c["h"] or 0)))
    return out[:limit]


def sheet(rows: list[dict], dst: str, cell: int = 300) -> int:
    """Tile the candidates into one image, numbered, so gate 2 is one look.

    Numbered rather than captioned: a caption under a thumbnail is read
    instead of the picture, and the picture is the thing being judged.
    """
    from PIL import Image, ImageDraw

    cols = min(4, max(1, len(rows)))
    rowsn = (len(rows) + cols - 1) // cols
    pad = 10
    sheet_img = Image.new(
        "RGB", (cols * (cell + pad) + pad, rowsn * (cell + pad + 22) + pad), (24, 24, 26)
    )
    draw = ImageDraw.Draw(sheet_img)
    for i, r in enumerate(rows):
        x = pad + (i % cols) * (cell + pad)
        y = pad + (i // cols) * (cell + pad + 22)
        try:
            src = (
                commons_render(r["id"], cell * 2)
                if r["source"] == "commons"
                else r["url"]
            )
            im = Image.open(io.BytesIO(fetch(src, timeout=60))).convert("RGB")
            im.thumbnail((cell, cell), Image.LANCZOS)
            sheet_img.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2))
        except Exception as e:
            draw.text((x + 8, y + cell // 2), f"[{e.__class__.__name__}]", fill=(120, 120, 120))
        label = f"{i}  {MARK[r['class']].strip()}{r['class']}  {r['title'][:30]}"
        draw.text(
            (x + 4, y + cell + 4),
            label.encode("latin-1", "replace").decode("latin-1"),
            fill=(190, 190, 190),
        )
    sheet_img.save(dst)
    return 0


def get(ident: str, dst: str, width: int, allowed: set[str], rows: list[dict]) -> int:
    row = None
    if ident.startswith("File:"):
        data = commons_call(
            {
                "action": "query",
                "titles": ident,
                "prop": "imageinfo",
                "iiprop": "url|size|extmetadata|mime",
            }
        )
        pages = (data.get("query", {}) or {}).get("pages", []) or []
        if not pages or "imageinfo" not in pages[0]:
            print(f"no such file: {ident}", file=sys.stderr)
            return 3
        row = commons_row(pages[0]["title"], pages[0]["imageinfo"][0])
    else:
        row = next((r for r in rows if r["id"] == ident), None)
        if row is None:
            print(f"{ident} is not in the candidates file", file=sys.stderr)
            return 3

    if row["class"] not in allowed:
        print(
            f"refusing {row['title']!r}: licence {row['licence']!r} is class "
            f"{row['class']!r}, allowed {sorted(allowed)}. Pass --allow on purpose.",
            file=sys.stderr,
        )
        return 4

    src = commons_render(row["id"], width) if row["source"] == "commons" else row["url"]
    with open(dst, "wb") as fh:
        fh.write(fetch(src, timeout=120))
    slip = {
        **{k: row[k] for k in ("source", "title", "page", "author", "licence", "licence_url")},
        "licence_class": row["class"],
        "source_width": row["w"],
        "source_height": row["h"],
        "fetched": time.strftime("%Y-%m-%d"),
    }
    with open(dst + ".json", "w") as fh:
        json.dump(slip, fh, ensure_ascii=False, indent=2)
    print(f"{dst}  {row['class']}  {row['licence']}  {row['author'][:40]}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="verb", required=True)

    f = sub.add_parser("find")
    f.add_argument("query")
    f.add_argument("--limit", type=int, default=12)
    f.add_argument("--source", default="both", choices=["commons", "openverse", "both"])
    f.add_argument("--json", help="also write the candidates here")

    s = sub.add_parser("sheet")
    s.add_argument("candidates")
    s.add_argument("dst")
    s.add_argument("--cell", type=int, default=300)

    g = sub.add_parser("get")
    g.add_argument("ident", help='"File:Title.jpg", or an Openverse id from --json')
    g.add_argument("dst")
    g.add_argument("--width", type=int, default=2000)
    g.add_argument("--from", dest="src_json", help="the candidates file")
    g.add_argument("--allow", default="public,by")

    a = ap.parse_args()

    if a.verb == "find":
        rows = find(a.query, a.limit, a.source)
        if a.json:
            with open(a.json, "w") as fh:
                json.dump(rows, fh, ensure_ascii=False, indent=2)
        if not rows:
            print(f"nothing for {a.query!r}", file=sys.stderr)
            return 3
        for i, c in enumerate(rows):
            print(
                f"{i:2d} {MARK[c['class']]}{c['class']:8s} {c['licence'][:14]:15s} "
                f"{c['w']:5d}x{c['h']:<5d} {c['author'][:24]:26s} {c['title'][:44]}"
            )
        return 0

    if a.verb == "sheet":
        with open(a.candidates) as fh:
            return sheet(json.load(fh), a.dst, a.cell)

    rows = []
    if a.src_json:
        with open(a.src_json) as fh:
            rows = json.load(fh)
    return get(a.ident, a.dst, a.width, {s.strip() for s in a.allow.split(",")}, rows)


if __name__ == "__main__":
    sys.exit(main())
