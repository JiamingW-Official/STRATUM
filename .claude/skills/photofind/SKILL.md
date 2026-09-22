---
name: photofind
description: Find a photograph on the free web, check its licence, cut the object out and put it on a panel — with the credit travelling in a sidecar beside the file. Use when a screen needs a real photograph of a thing rather than a drawing or a render.
---

# photofind

Three gates, in order, and the middle one is not a machine's to pass.

    findphoto.py find  "<what>" --limit 12 --json cands.json
    findphoto.py sheet cands.json sheet.png        # look at all of them
    findphoto.py get   "<id>" raw.png --from cands.json
    cutout.py          raw.png src/wares/thing.webp --size 512

## 1 · Licence — the script decides

Wikimedia Commons and Openverse, because both return a machine-readable
licence, a named author and a stable page. An image search returns pictures;
these return pictures you may actually use. Neither needs a key.

    public   PD, CC0, PDM      no obligation
    by       CC BY             must credit
    by-sa    CC BY-SA          must credit *and* license derivatives alike

A cutout is a derivative, so a BY-SA photograph puts share-alike on whatever
ships it. That is a decision about the repository, not one a script makes:
by-sa is ranked last, marked `!`, and refused unless asked for by name.

`get` writes `<file>.json` beside the image and `cutout.py` carries it
across to the `.webp`. Nothing downstream has to remember where a picture
came from, because the picture carries it.

## 2 · Subject — a person decides, and must

**Is this a photograph of the thing, or of somebody's brand of the thing?**

A licence filter cannot read a label. Searching Openverse for `sunglasses
isolated` returns, correctly tagged CC0, two pairs of Gucci. Searching
Commons for `whisky bottle` returns, correctly tagged, Jack Daniel's and
Macallan. Every one of those is free to copy and none of them may go on a
screen that is not theirs.

`sheet` exists for this gate: it tiles the candidates into one image so they
are judged by looking rather than by filename.

**Then look at the winner full size before accepting it.** Two watches
passed the 260px sheet looking like clean unbranded product shots. At full
size one dial read ZENITH and the other Longines. The sheet is for throwing
candidates away; it is not enough to keep one.

## 3 · Fit — also a person

Lit like the others? Shot from the same kind of angle? Free enough of its
background to cut? And, on a screen with a palette: does it belong to it. A
genuine, free, unbranded photograph can still be the wrong picture — a hot
pink scarf on a navy panel is one accent colour too many, and it wins the
squint test against whatever the screen's actual subject is.

## The cutout

`subjectlift` first (Vision's foreground mask, same model as Photos'
long-press), `keyflat` second when Vision finds no subject, and an honest
failure third. There is no algorithm after those two, and a half-keyed
bottle with a grey rind is worse than a drawing.

Then scaled so the object's longest side fills `1 - 2*air` of the square —
**box**, not optical mass. Mass is the rule `src/marks` uses and it is wrong
here: sunglasses are mostly holes, so matching their ink to a bottle's draws
them half again wider than the card. Measured on the two real cutouts, mass
gave 0.31 and 0.10 of the square; box gives them the same box, which is what
the ten drawings beside them already use.

`--value` is off by default for the same kind of reason. Forcing one mean
luminance is right for line art, where ink has no colour of its own. An
object has one. On black sunglasses it lifted them to flat grey-white — told
they were underexposed when they were black.

## What this found, for src/wares, on 2026-09-22

Run twice, and the difference between the runs is the lesson.

**First run, under a no-brands rule.** Gate 1 passed plenty. Gate 2 removed
nearly all of it and the remainder did not survive gate 3:

    branded          Jack Daniel's, Macallan, Guerlain, Savlon, Gucci,
                     Affligem, Coca-Cola, Chanel No 5, ZENITH, Longines
    museum objects   MET and Cooper Hewitt glass, 19th-century flacons,
                     an infant's socks with the accession number inked on
    illustrations    rawpixel's "clipart" and "sticker" collections, which
                     are drawings, not photographs
    shipped          none

That is a real finding about the free web rather than a failed search: the
people who photograph a product on white are photographing it *for its
maker*, so the picture and the brand arrive together. An object nobody sells
has nobody to photograph it.

**Second run, brands allowed**, because a duty-free trolley carries brands
and the owner said so. Twelve for twelve, in about an hour:

    CC0 / public domain   7      CC BY   2      CC BY-SA   3

Worth keeping straight, because the first run confused the two: almost
everything gate 2 threw out was **licensed perfectly well**. Jack Daniel's
on Commons is CC BY; Chanel No 5 is public domain. What made them
unshippable was a rule about trademarks, which is a different question with
a different answer, and conflating them cost a run.

So gate 2 is really two gates. *May I copy this picture?* is the licence,
and the script answers it. *May I show what is in it?* is not, and nothing
in this skill can answer it — it depends on what the screen is claiming and
who it belongs to.
