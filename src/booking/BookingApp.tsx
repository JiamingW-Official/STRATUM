import { useBooking } from "./store";
import type { Step } from "./types";
import { Search } from "./screens/Search";
import { Results } from "./screens/Results";
import { Seats } from "./screens/Seats";
import { Review } from "./screens/Review";
import { Booked } from "./screens/Booked";
import { Today } from "./screens/Today";
import { Trip } from "./screens/Trip";
import { CheckIn } from "./screens/CheckIn";
import { Boarding } from "./screens/Boarding";
import { Account } from "./screens/Account";
import { TabBar } from "./TabBar";
import { DynamicIsland, StatusBar } from "./Chrome";
import { Back, Mark } from "./icons";
import "./booking.css";

// STRATUM Air. Eight screens, one line each, and the line is the same line all
// the way through: where are you going, on what, in which seat, who are you,
// pay, here is your reference, check in, here is your pass.
//
// The last screen is the one the rest exist for. Everything before it is a
// form; the pass is a document, and it is the only thing here that leaves the
// phone — it opens the seat-back screen belonging to the seat it was issued
// for, which is the whole point of putting a booking flow next to a cabin.

const TITLES: Record<Step, string> = {
  search: "STRATUM",
  account: "Stratum Club",
  results: "Select flight",
  seats: "Choose seat",
  review: "Review and pay",
  booked: "Trips",
  today: "Travel",
  trip: "Your trip",
  checkin: "Check in",
  boarding: "Boarding pass",
};

/** The three screens that are places rather than steps. */
// The trip is a page pushed from the Trips tab, so it keeps the tabs the way
// a pushed screen does on a phone. The booking flow does not: a flow you are
// halfway through is not a place.
const TABBED = new Set<Step>(["search", "account", "booked", "today", "trip"]);

/** Where "back" goes. A pass that has been issued has no back. */
const BACK: Partial<Record<Step, Step>> = {
  results: "search",
  seats: "results",
  review: "seats",
  trip: "booked",
  checkin: "trip",
  // A pass is not the end of the app. Without this the boarding pass was a
  // dead end: the back button was disabled and the only way out was an
  // unlabelled plus in the corner that silently threw the booking away.
  boarding: "trip",
};

export function BookingApp() {
  const step = useBooking((s) => s.step);
  const go = useBooking((s) => s.go);
  const leg = useBooking((s) => s.leg);
  const search = useBooking((s) => s.search);

  const pnr = useBooking((s) => s.pnr);
  const legs = useBooking((s) => s.legs);

  /**
   * Where back goes.
   *
   * Two cases are not the obvious one. The return list is half of one choice,
   * so it steps to the outbound list rather than throwing the first half away.
   * And once a booking exists the seat map is no longer part of buying
   * anything — it was opened from check-in or from the trip to move a seat —
   * so it goes back there instead of to a list of flights that are no longer
   * being chosen between.
   */
  const booked = Boolean(pnr);
  const onBack = () => {
    if (step === "results") return leg === "back" ? search() : go("search");
    // Back out of a seat map that belongs to a booking is back to that
    // booking, not to the list of trips it is one of.
    if (step === "seats") return go(booked ? "trip" : "results");
    const to = BACK[step];
    if (to) go(to);
  };
  const canGoBack =
    step === "results" || step === "seats" || Boolean(BACK[step]);

  return (
    <div className="bk-root" data-tabs={TABBED.has(step)}>
      <StatusBar />
      <DynamicIsland />
      <header className="bk-bar">
        <button
          className="bk-bar-back"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Back"
        >
          <Back />
        </button>
        {/* The mark on the screen the app opens on, and the name of the
            screen everywhere else: a title bar that says STRATUM on every
            screen is a title bar that says nothing on any of them. */}
        <div className="bk-bar-title">
          {step === "search" ? (
            <span className="bk-wordmark">
              <Mark size={17} />
              STRATUM
            </span>
          ) : (
            TITLES[step]
          )}
        </div>
        {/* Nothing in the corner. Starting a booking is what the Book tab
            does, and it does it properly — a search clears the reference and
            the legs on its way to the list. A second control for the same
            thing, labelled with a word that could mean a new pass or a new
            trip, is one control too many. */}
        <span />
      </header>

      {step === "search" && <Search />}
      {step === "account" && <Account />}
      {step === "results" && <Results />}
      {step === "seats" && <Seats />}
      {step === "review" && <Review />}
      {step === "booked" && <Booked />}
      {step === "today" && <Today />}
      {step === "trip" && <Trip />}
      {step === "checkin" && <CheckIn />}
      {step === "boarding" && <Boarding />}

      {/* Three places, and the app is only ever in one of them. It shows on
          the three screens that are places and nowhere inside the booking
          itself, because a flow you are halfway through is not a tab. */}
      {TABBED.has(step) && <TabBar />}
    </div>
  );
}
