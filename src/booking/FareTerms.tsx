import { Cross, Plus, Tick } from "./icons";
import {
  CHANGE_FEE,
  bagWeightFor,
  cabinBagFor,
  checkedBagsFor,
  fareFamily,
  seatIncludedFor,
  type FareFamily,
} from "./schedule";
import { surchargeFor } from "./cabin";
import { money } from "./format";
import type { CabinClass } from "../flight-state/types";

/**
 * What a fare includes, in one vocabulary.
 *
 * This was written twice: once as tick-and-cross lines on the fare cards, and
 * once on the review screen as a two-by-two grid of white boxes on a grey
 * band. The second version made four facts of very unequal weight into four
 * identical objects, and three of the four were absences drawn as though they
 * were features — a box with an icon in it saying "No checked bag".
 *
 * The same four lines in both places is not a saving of code, it is the point:
 * a passenger who compared fares on the list should meet the fare they chose
 * in the words they compared it in.
 */
type State = "yes" | "no" | "fee";

export function FareTerms({
  cabinClass,
  family,
}: {
  cabinClass: CabinClass;
  family: FareFamily;
}) {
  const f = fareFamily(family);
  const heavy = bagWeightFor(cabinClass);
  const checked = checkedBagsFor(cabinClass, family);
  // Three states, not two. A cross against "Change for a fee" says the thing
  // cannot be done, and it can — it costs money, which is a different answer
  // and the one airlines print as a fee badge.
  const lines: Array<[State, string]> = [
    ["yes", cabinBagFor(cabinClass)],
    [
      checked > 0 ? "yes" : "no",
      checked === 0
        ? "No checked bag"
        : `${checked} checked bag${checked > 1 ? "s" : ""}, ${heavy} kg`,
    ],
    [
      f.changes === "Free changes"
        ? "yes"
        : f.changes === "No changes"
          ? "no"
          : "fee",
      // And what the fee is. "Change for a fee" beside a badge reading FEE
      // says the word twice and the number never.
      f.changes === "Change for a fee"
        ? `Changes from ${money(CHANGE_FEE[family] ?? 0)}`
        : f.changes,
    ],
    [f.refund === "Refundable" ? "yes" : "no", f.refund],
    [
      seatIncludedFor(cabinClass, family) ? "yes" : "fee",
      seatIncludedFor(cabinClass, family)
        ? "Seat choice included"
        : `Seat choice from ${money(surchargeFor("standard"))}`,
    ],
  ];
  // What you get, then what you can buy, then what is not there. Interleaved,
  // five lines of equal weight read as a disclaimer; sorted, the card opens
  // with the fare and closes with its limits.
  const order: Record<State, number> = { yes: 0, fee: 1, no: 2 };
  lines.sort((a, b) => order[a[0]] - order[b[0]]);
  return (
    <>
      {lines.map(([state, text]) => (
        <span className="bk-fare-l" data-state={state} key={text}>
          {state === "yes" ? <Tick /> : state === "no" ? <Cross /> : <Plus />}
          {text}
        </span>
      ))}
    </>
  );
}
