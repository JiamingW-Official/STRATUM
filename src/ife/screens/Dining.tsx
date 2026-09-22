import { useCabin, useFlight, useSelf } from "../../flight-state/store";
import { localTime } from "../format";
import { useT } from "../i18n";
import { drinksFor, meals, pickPair } from "../schedule";

/**
 * What is on the flight, and when it is meant to come round.
 *
 * A printed menu in a real cabin is already a promise rather than a report —
 * the galley runs out, the second choice goes first, the crew are two hours
 * behind a headwind — so a menu marked "planned" is not a hedge, it is what a
 * menu has always been. That is the one thing that lets this screen exist at
 * all in a piece whose subject is the difference between what was measured
 * and what was assumed: nothing here claims to be a measurement, and the time
 * beside each service is an offset from a departure that really happened.
 *
 * The dishes themselves are the fiction's furniture, the same as the flight
 * number and the seat. STR 001 does not exist and neither does its lunch.
 */
export function Dining() {
  const { t, lang } = useT();
  const { route, departureUtc, etaUtc } = useFlight();
  // The cabin is the seat's, and it is the whole of the difference: the two
  // menus are different lists, not the same list with a price on it.
  const seat = useSelf((s) => s.seat);
  const cabinClass = useCabin((s) => s.seats[seat]?.cabinClass ?? "economy");
  const services = meals(departureUtc, etaUtc, cabinClass);
  const bar = drinksFor(cabinClass);

  return (
    <div className="ife-dining">
      <header className="ife-head">
        <h2 className="ife-head-title">{t("dining")}</h2>
        <span className="ife-head-meta ife-cap">
          {t(
            cabinClass === "first"
              ? "firstClass"
              : cabinClass === "business"
              ? "businessClass"
              : cabinClass === "premium"
                ? "premiumClass"
                : "economyClass",
          )}{" "}
          ·{" "}
          {route.from.iata} → {route.to.iata}
        </span>
      </header>

      <div className="ife-dining-body">
        <div className="ife-dining-services">
          {services.map((s) => (
            <section key={s.key} className="ife-menu">
              <header className="ife-menu-head">
                <h3 className="ife-menu-title">{pickPair(s.title, lang)}</h3>
                {/* The time is brass and broken like every other plan in
                    here, and it says which end of the flight it is measured
                    from rather than pretending to be a fact of its own. */}
                <span className="ife-menu-when ife-mono ife-inferred">
                  {localTime(
                    new Date(s.at).toISOString(),
                    s.anchor === "departure" ? route.from : route.to,
                  )}
                </span>
              </header>
              <ul className="ife-menu-list">
                {s.courses!.map((c) => (
                  <li key={c.name.en} className="ife-menu-course">
                    <span className="ife-menu-dish">
                      {pickPair(c.name, lang)}
                    </span>
                    {c.note && (
                      <span className="ife-menu-note">
                        {pickPair(c.note, lang)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* The same plan the overview draws, at the size a column can carry:
            the meals are two of seven things that are supposed to happen, and
            a menu with no clock beside it is a menu for no particular
            flight. */}
        {/* Across the foot, a column per kind.
 
            It was a narrow column beside the food, which is where a drinks
            list goes on a page and not on a 1920-wide panel: seven kinds
            stacked two abreast ran off the bottom and "soft drinks" had to
            wrap. One column each, and the whole bar is on the glass.
 
            No timetable on this screen either. Every service above prints
            its own time next to its name, and the whole plan is one press
            away on the journey strip, which is the screen whose subject it
            is. */}
        <aside className="ife-dining-side">
          <section className="ife-menu ife-menu--bar">
            <header className="ife-menu-head">
              <h3 className="ife-menu-title">{t("drinks")}</h3>
            </header>
            <div className="ife-bar">
              {bar.map((g) => (
                <div key={g.key} className="ife-bar-group">
                  {/* Kind and, where it is not "whenever you ask", when it
                      is poured — on one line, because the qualifier belongs
                      to the kind. It used to sit on a line of its own, which
                      meant every column reserved an empty line so that the
                      four without a "when" would still start their lists
                      level with the one that had it: a whole line of the
                      screen held open for one phrase. */}
                  <span className="ife-cap ife-bar-kind">
                    {pickPair(g.title, lang)}
                    {g.when ? (
                      <span className="ife-bar-when">
                        {pickPair(g.when, lang)}
                      </span>
                    ) : null}
                  </span>
                  <ul className="ife-bar-list">
                    {g.items.map((i) => (
                      <li key={i.en}>{pickPair(i, lang)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <p className="ife-tt-note">{t("plannedNote")}</p>
        </aside>
      </div>
    </div>
  );
}
