import { useState } from "react";
import type { Item } from "../shop";

/**
 * The thing itself, photographed if there is a photograph, drawn if not.
 *
 * Found rather than declared, exactly like the menu's marks: whatever .webp
 * is sitting in src/wares named after an item's id is that item's picture,
 * and an item with no file keeps the drawing below. An empty folder costs
 * nothing and dropping a file in is the whole installation step.
 *
 * ── The argument this file lost, twice ─────────────────────────────────────
 * The first version refused photographs outright: a photograph of a bottle
 * is a photograph of a real bottle from a real distillery, and this aircraft
 * carries neither. That is right about the *home screen*, where a made
 * picture of London would sit where the interface is otherwise presenting
 * evidence, and it does not carry here — a shop's goods are the airline's
 * own offer, decided rather than observed, in the same class as the menu.
 *
 * The second version allowed photographs but not brands, and that line held
 * only until somebody went looking. Unbranded studio product photography
 * barely exists on the free web, because the people who shoot a product on
 * white are shooting it for its maker. It also described the wrong hazard.
 * The rule worth keeping is that a picture may not make a false claim; a
 * duty-free trolley carrying real bottles with real labels is not a false
 * claim, it is what duty free *is*. So the labels stay, and what moved
 * instead were the three captions the photographs contradicted.
 *
 * What this does not settle is the trademark question — showing somebody's
 * mark needs their agreement, not the photographer's. src/wares/CREDITS.md
 * says so next to the licences, which is where a reader will be standing
 * when it matters.
 *
 * ── The drawings stay ──────────────────────────────────────────────────────
 * Not as a placeholder. Twelve items will not all have pictures at once, and
 * a shelf where two things are photographed and ten are grey boxes is worse
 * than a shelf of drawings. A drawn silhouette is a complete answer on its
 * own, and the screen is designed so a mixed shelf reads as a shelf.
 */
const WARES = import.meta.glob("../../wares/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function wareFor(id: string): string | undefined {
  const key = Object.keys(WARES).find((k) => k.endsWith(`/${id}.webp`));
  return key ? WARES[key] : undefined;
}

export function Ware({ item }: { item: Item }) {
  const [failed, setFailed] = useState(false);
  const src = wareFor(item.id);
  if (src && !failed) {
    return (
      <span className="ife-ware ife-ware--photo">
        <img
          src={src}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }
  return (
    <span className="ife-ware" data-shape={item.shape}>
      <svg
        viewBox="0 0 120 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {SHAPES[item.shape]}
      </svg>
    </span>
  );
}

/**
 * Ten silhouettes, on one 120×160 grid so they sit at the same scale beside
 * each other — a watch drawn to fill its box beside a bottle drawn to fill
 * its box is a watch the size of a bottle.
 */
const SHAPES: Record<Item["shape"], React.ReactNode> = {
  // A tall spirits bottle: shoulder, neck, capsule.
  bottle: (
    <>
      <path d="M46 26h28v18c0 8 14 16 14 30v58a10 10 0 0 1-10 10H42a10 10 0 0 1-10-10V74c0-14 14-22 14-30z" />
      <path d="M44 20h32" />
      <path d="M32 96h56" />
    </>
  ),
  // A squat malt bottle, wider at the shoulder.
  flask: (
    <>
      <path d="M48 30h24v16c14 6 22 16 22 28v54a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8V74c0-12 8-22 22-28z" />
      <path d="M46 24h28" />
      <path d="M26 88h68" />
    </>
  ),
  // A perfume phial: a heavy base and a small cap.
  phial: (
    <>
      <path d="M38 56h44a8 8 0 0 1 8 8v66a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V64a8 8 0 0 1 8-8z" />
      <path d="M52 34h16v22H52z" />
      <path d="M48 22h24v12H48z" />
    </>
  ),
  // A tube, lying on its cap.
  tube: (
    <>
      <path d="M44 42h32v82a10 10 0 0 1-10 10H54a10 10 0 0 1-10-10z" />
      <path d="M48 42c0-8 2-12 12-12s12 4 12 12" />
      <path d="M44 62h32" />
    </>
  ),
  // A watch: case, lugs, two hands.
  watch: (
    <>
      <circle cx="60" cy="80" r="32" />
      <path d="M46 50l4-18h20l4 18M46 110l4 18h20l4-18" />
      <path d="M60 62v18l12 8" />
    </>
  ),
  // A square of silk, hung from one corner, which is how a scarf is shown
  // and the only way a square reads as cloth. Drawn flat with both diagonals
  // it was a crossed-out box.
  square: (
    <>
      <path d="M60 28l40 52-40 52-40-52z" />
      <path d="M60 28v104" />
      <path d="M40 80c8 6 32 6 40 0" />
    </>
  ),
  // Sunglasses: two lenses and a bridge.
  glasses: (
    <>
      <path d="M20 62h34a6 6 0 0 1 6 6c0 14-8 22-20 22s-20-8-20-22a6 6 0 0 1 0-6z" />
      <path d="M66 62h34a6 6 0 0 1 0 6c0 14-8 22-20 22s-20-8-20-22a6 6 0 0 1 6-6z" />
      <path d="M54 68h12" />
    </>
  ),
  // The aeroplane, from above, the way a model sits on a shelf.
  plane: (
    <>
      <path d="M60 22c5 0 8 10 8 22v20l38 22v10l-38-12v26l12 10v8l-20-6-20 6v-8l12-10V84l-38 12v-10l38-22V44c0-12 3-22 8-22z" />
    </>
  ),
  // Two cards, one behind the other, and a pip on the front one — without
  // it they are two rectangles.
  cards: (
    <>
      <path d="M50 30h38a6 6 0 0 1 6 6v72" />
      <path d="M36 40h44a6 6 0 0 1 6 6v76a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V46a6 6 0 0 1 6-6z" />
      <path d="M58 68l12 16-12 16-12-16z" />
    </>
  ),
  // A sock, which is a shape that only reads as itself.
  sock: (
    <>
      <path d="M42 26h30v54c0 12 20 18 20 34a20 20 0 0 1-40 0V80c0-10-10-12-10-24z" />
      <path d="M42 44h30" />
    </>
  ),
};
