import { AIRPORTS } from "../../flight-state/airports";
import { useBooking } from "../store";
import { Tick } from "../icons";
import {
  benefits,
  segmentsFor,
  tierOfBoth,
  tierStarts,
  type Tier,
} from "../member";

const NEXT: Record<Tier, Tier | null> = {
  Blue: "Silver",
  Silver: "Gold",
  Gold: "Platinum",
  Platinum: null,
};

/** "19 Sept", which is how a statement line is dated. */
const day = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));

/**
 * The card: what it is worth, what it is on its way to, and what it did.
 *
 * Built the way United's and American's own account screens are, and for the
 * same reason they are built that way: a loyalty programme has two counts, not
 * one. Distance is the obvious one and it is wrong on its own — somebody who
 * flies London to Paris forty times a year would be told they are worth
 * nothing — so every real programme counts flights beside it and gives you the
 * card on whichever arrives first. Both are drawn here, against their own
 * scale, because a bar with no scale on it is a picture of a bar.
 *
 * Under them is the only thing that can make a balance checkable: the flights
 * that put it there.
 */
export function Account() {
  const member = useBooking((s) => s.member);
  const savedCard = useBooking((s) => s.savedCard);
  const passengers = useBooking((s) => s.passengers);
  const activity = useBooking((s) => s.activity);
  const forgetSavedCard = useBooking((s) => s.forgetSavedCard);
  const forgetPassport = useBooking((s) => s.forgetPassport);
  const p = passengers[0];
  const hasDoc = p.passportNo !== "";

  const miles = member?.miles ?? 0;
  const segments = activity.reduce((n, e) => n + e.segments, 0);
  const tier = tierOfBoth(miles, segments);
  const next = NEXT[tier];

  const today = new Date().toISOString().slice(0, 10);
  const flown = activity.filter((e) => e.flownAt <= today);

  return (
    <div className="bk-body">
      {member ? (
        <>
          <div className="bk-member" data-tier={tier}>
            <div className="bk-member-top">
              <span className="bk-label">
                {p.family ? `${p.family} / ${p.given}` : "Stratum Club"}
              </span>
              <span className="bk-member-tier">{tier}</span>
            </div>
            <div className="bk-member-miles">
              {miles.toLocaleString("en-US")}
              <i>miles</i>
            </div>
            <div className="bk-member-foot">
              <span className="bk-mono">{member.number}</span>
            </div>
          </div>

          {/* Two counts, and the card goes to whichever gets there first.
              They were two bars with a caption each and a sentence under
              them: five lines to read for two numbers. The numbers are the
              tiles; the one bar is the miles, because that is the count a
              passenger can feel moving; what the next card adds is a list of
              ticks, the way every fare on this app says what it includes. */}
          <div className="bk-card">
            <div className="bk-card-h">
              {next ? `Towards ${next}` : "Top card"}
            </div>
            {next ? (
              <>
                <dl className="bk-facts">
                  <div>
                    <dt>Miles to go</dt>
                    <dd>
                      {Math.max(0, tierStarts(next) - miles).toLocaleString("en-US")}
                    </dd>
                  </div>
                  <div>
                    <dt>Or flights</dt>
                    <dd>{Math.max(0, segmentsFor(next) - segments)}</dd>
                  </div>
                  <div>
                    <dt>Flown</dt>
                    <dd>{segments}</dd>
                  </div>
                </dl>
                <div className="bk-meter-bar" aria-hidden="true">
                  <span
                    style={{
                      width: `${Math.max(
                        2,
                        Math.min(
                          100,
                          ((miles - tierStarts(tier)) /
                            (tierStarts(next) - tierStarts(tier))) *
                            100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
                <div className="bk-perks">
                  {benefits(next)
                    .filter((b) => !benefits(tier).includes(b))
                    .map((b) => (
                      <span className="bk-fare-l" data-state="yes" key={b}>
                        <Tick />
                        {b}
                      </span>
                    ))}
                </div>
              </>
            ) : (
              <div className="bk-perks">
                {benefits(tier).map((b) => (
                  <span className="bk-fare-l" data-state="yes" key={b}>
                    <Tick />
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {benefits(tier).length > 1 && (
            <div className="bk-card">
              <div className="bk-card-h">What this card does</div>
              <div className="bk-perks">
                {benefits(tier).map((b) => (
                  <span className="bk-fare-l" data-state="yes" key={b}>
                    <Tick />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* No heading: the title bar two rows up already says Stratum Club,
           and a card whose only content is one sentence does not need to be
           introduced to it. */
        <div className="bk-card">
          <p className="bk-empty">
            Issued with your first booking · nothing to join, no password
          </p>
        </div>
      )}

      {/* The flights that put the balance there. A number with nothing behind
          it is a number to be taken on trust. */}
      {activity.length > 0 && (
        <div className="bk-card" data-flush="true">
          <div className="bk-sec">
            {flown.length === activity.length ? "Flight history" : "Flights"}
          </div>
          <div className="bk-hist">
            {activity.map((e, i) => (
              <div className="bk-hist-row" key={i} data-flown={e.flownAt <= today}>
                <span className="bk-hist-when">{day(e.flownAt)}</span>
                <span className="bk-hist-what">
                  <b>
                    {AIRPORTS[e.from]?.city.en ?? e.from} to{" "}
                    {AIRPORTS[e.to]?.city.en ?? e.to}
                  </b>
                  {/* No code pair: the line above is the same two places
                      written out. */}
                  <span>
                    {[
                      e.flights.length > 0 ? e.flights.join(" + ") : null,
                      e.segments > 1 ? `${e.segments} flights` : null,
                      e.km > 0 ? `${e.km.toLocaleString("en-US")} km` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <span className="bk-hist-miles">
                  +{e.miles.toLocaleString("en-US")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not a settings screen: two things are kept and each has a button that
          throws it away. */}
      <div className="bk-card" data-flush="true">
        <div className="bk-sec">Saved on this device</div>
        <div className="bk-pad">
          <div className="bk-row" data-static="true">
            <span className="bk-row-k">
              {savedCard
                ? `${savedCard.brand} ending ${savedCard.last4}`
                : "No payment card"}
              <span className="bk-row-sub">
                {savedCard
                  ? `Expires ${savedCard.expiry} · number and code never kept`
                  : "Kept only if you ask at payment"}
              </span>
            </span>
            {savedCard && (
              <button className="bk-link" onClick={forgetSavedCard}>
                Forget
              </button>
            )}
          </div>
          <div className="bk-row" data-static="true">
            <span className="bk-row-k">
              {hasDoc
                ? `${p.nationality || "Passport"} · ${p.passportNo}`
                : "No travel document"}
              <span className="bk-row-sub">
                {hasDoc
                  ? "Kept in full · one-tap check-in"
                  : "Asked for at check-in, kept after it"}
              </span>
            </span>
            {hasDoc && (
              <button className="bk-link" onClick={forgetPassport}>
                Forget
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="bk-note">
        STRATUM is not an airline. Nothing here is charged and nothing leaves
        this browser.
      </p>
    </div>
  );
}

