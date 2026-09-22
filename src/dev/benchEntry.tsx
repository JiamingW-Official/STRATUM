import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IFEBench } from "./IFEBench";
import { useBench } from "./benchStore";
import { useSelf } from "../flight-state/store";
import { seedFromPass } from "./seedFromPass";

// A boarding pass in the address bar wins over the bench's defaults. Seeding
// before the first render rather than in an effect is the point: the seat
// number is on the idle screen, and a seat that is 12K for one frame and then
// the scanned one is a seat that was wrong once.
// The pass splits in two here, along the line flight-state draws: what the
// cabin is (the bench's knobs) and what this one seat is holding (its own
// booking, which no other screen may read).
const scanned = seedFromPass(window.location.search);
if (scanned) {
  useBench.getState().set(scanned.bench);
  useSelf.getState().setBooking(scanned.booking);
}

createRoot(document.getElementById("bench")!).render(
  <StrictMode>
    <IFEBench />
  </StrictMode>,
);
