import type React from "react";
import { useBooking } from "../store";
import { Go } from "../icons";
import {
  CABIN_EARN,
  FARE_EARN,
  REDEMPTIONS,
  clubCardNumber,
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

/** "Sept 2026", which is how long you have had a card. */
const monthYear = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );

/**
 * The club: the card, and the rooms off it.
 *
 * The hub used to be five rows that looked alike, each with a sentence under
 * it — a menu you had to read rather than see. Three things are different
 * from each other and are now built that way:
 *
 *   The card is the card. Status is not a row you tap, it is the thing you
 *   are holding, so the card carries the two counts as two bars and opens
 *   the ladder when tapped. "Whichever gets there first" is a rule no
 *   sentence makes obvious and two bars make obvious at a glance.
 *
 *   The Club Card is an object, so it sits in a slot: proud of the page when
 *   it is held, recessed into it when it is not, with the chip in brass
 *   because brass is what is yours here.
 *
 *   The rest is a table. A name and the one figure that answers it, right
 *   aligned, no prose.
 */
export function Account() {
  const member = useBooking((s) => s.member);
  const savedCard = useBooking((s) => s.savedCard);
  const passengers = useBooking((s) => s.passengers);
  const activity = useBooking((s) => s.activity);
  const forgetSavedCard = useBooking((s) => s.forgetSavedCard);
  const forgetPassport = useBooking((s) => s.forgetPassport);
  const go = useBooking((s) => s.go);
  const p = passengers[0];
  const hasDoc = p.passportNo !== "";

  const miles = member?.miles ?? 0;
  const segments = activity.reduce((n, e) => n + e.segments, 0);
  const tier = tierOfBoth(miles, segments);
  const next = NEXT[tier];

  // How far along this rung each count has come. A bar at nothing reads as
  // broken rather than as empty, so the rail keeps a nub: being on the
  // ladder at all is the first thing it has to say.
  const part = (now: number, from: number, to: number) =>
    `${Math.round(Math.min(1, Math.max(0.025, (now - from) / (to - from))) * 100)}%`;
  const byMiles = next ? part(miles, tierStarts(tier), tierStarts(next)) : "100%";
  const byFlights = next
    ? part(segments, segmentsFor(tier), segmentsFor(next))
    : "100%";
  const milesLead = next
    ? (miles - tierStarts(tier)) / (tierStarts(next) - tierStarts(tier)) >=
      (segments - segmentsFor(tier)) / (segmentsFor(next) - segmentsFor(tier))
    : true;

  const held = Boolean(member?.cardHolder);
  const last4 = member ? clubCardNumber(member.number).slice(-4) : "";
  // The rate a fare can earn at, from the tables the miles are worked out
  // with, so the hub cannot promise what the statement will not pay.
  const floor = CABIN_EARN.economy * FARE_EARN.light;
  const ceiling = CABIN_EARN.first * FARE_EARN.flex;
  const cheapest = Math.min(...REDEMPTIONS.map((r) => r.miles));

  return (
    <div className="bk-body">
      {member ? (
        <>
          {/* The card is the status: tapping it opens the ladder it is a
              rung of. */}
          <button
            className="bk-member"
            data-tier={tier}
            onClick={() => go("club-status")}
          >
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

            {next ? (
              <div className="bk-toward">
                <span className="bk-toward-k">mi</span>
                <span className="bk-toward-t" data-lead={milesLead}>
                  <i className="bk-toward-bed" />
                  <i
                    className="bk-toward-fill"
                    style={{ "--w": byMiles } as React.CSSProperties}
                  />
                </span>
                <span className="bk-toward-goal">
                  {next}
                  <Go size={13} />
                </span>
                <span className="bk-toward-k">flights</span>
                <span className="bk-toward-t" data-lead={!milesLead}>
                  <i className="bk-toward-bed" />
                  <i
                    className="bk-toward-fill"
                    style={{ "--w": byFlights } as React.CSSProperties}
                  />
                </span>
              </div>
            ) : (
              <div className="bk-toward" data-top="true">
                <span className="bk-toward-k">The top card</span>
                <span className="bk-toward-goal">
                  <Go size={13} />
                </span>
              </div>
            )}

            <div className="bk-member-foot">
              <span className="bk-mono">{member.number}</span>
              {member.since && <span>Since {monthYear(member.since)}</span>}
            </div>
          </button>

          {/* Held or not held, shown rather than said. */}
          <button
            className="bk-wallet"
            data-held={held}
            onClick={() => go("club-card")}
          >
            <span className="bk-wallet-chip" aria-hidden="true" />
            <span className="bk-wallet-k">
              Club Card
              {held ? (
                <span className="bk-wallet-no bk-mono">•••• {last4}</span>
              ) : (
                <span className="bk-wallet-no">
                  2× miles · a bag on Light · boards earlier
                </span>
              )}
            </span>
            <span className="bk-wallet-v">
              {held ? "Held" : "Not held"}
              <Go size={13} />
            </span>
          </button>

          <div className="bk-card" data-flush="true">
            <div className="bk-sec">Miles</div>
            <div className="bk-pad">
              <button
                className="bk-row"
                data-go="true"
                onClick={() => go("club-earn")}
              >
                <span className="bk-row-k">Earn miles</span>
                <span className="bk-row-v">
                  ×{floor} – ×{ceiling}
                  <Go size={13} />
                </span>
              </button>
              <button
                className="bk-row"
                data-go="true"
                onClick={() => go("club-miles")}
              >
                <span className="bk-row-k">Use miles</span>
                <span className="bk-row-v">
                  From {cheapest.toLocaleString("en-US")}
                  <Go size={13} />
                </span>
              </button>
              <button
                className="bk-row"
                data-go="true"
                onClick={() => go("club-activity")}
              >
                <span className="bk-row-k">Activity</span>
                <span className="bk-row-v">
                  {segments} flight{segments === 1 ? "" : "s"}
                  <Go size={13} />
                </span>
              </button>
            </div>
          </div>
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
