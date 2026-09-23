import { Fragment } from "react";
import type React from "react";
import { AIRPORTS } from "../../flight-state/airports";
import type { CabinClass } from "../../flight-state/types";
import { useBooking } from "../store";
import { FARE_FAMILIES, cabinName } from "../schedule";
import { Go, Plus, Tick } from "../icons";
import {
  CABIN_EARN,
  CLUB_CARD,
  FARE_EARN,
  LADDER,
  PARTNERS,
  REDEMPTIONS,
  balanceOf,
  PERKS,
  clubCardNumber,
  earnRate,
  ladderPosition,
  segmentsFor,
  statusThrough,
  tierOfBoth,
  tierStarts,
  type Tier,
} from "../member";

/*
 * The five rooms off the club.
 *
 * United, Delta and American each spread the programme over a handful of
 * screens rather than one long one, and for a reason that is not just length:
 * status, the card, earning, spending and the statement are five different
 * errands. Somebody checking whether they will make Gold in December does not
 * want to scroll past a credit card to find out.
 */

const NEXT: Record<Tier, Tier | null> = {
  Blue: "Silver",
  Silver: "Gold",
  Gold: "Platinum",
  Platinum: null,
};

const dayMonthYear = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );

const monthYear = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );

const day = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );

/** What the two counts stand at, and the card they add up to. */
function useStanding() {
  const member = useBooking((s) => s.member);
  const activity = useBooking((s) => s.activity);
  const miles = member?.miles ?? 0;
  const segments = activity.reduce((n, e) => n + e.segments, 0);
  const tier = tierOfBoth(miles, segments);
  return { member, activity, miles, segments, tier, next: NEXT[tier] };
}

/**
 * Status: the ladder, what the next card costs on either count, what this
 * one gives you, what the next one adds, and the rules of the year.
 */
export function ClubStatus() {
  const { miles, segments, tier, next } = useStanding();
  return (
    <div className="bk-body">
      <div className="bk-card">
        <div className="bk-card-h" data-split="true">
          <span>{tier}</span>
          <span>Through {dayMonthYear(statusThrough())}</span>
        </div>

        <ol
          className="bk-ladder"
          style={{ "--pos": ladderPosition(miles, segments) } as React.CSSProperties}
          aria-label="Status ladder"
        >
          <span className="bk-ladder-fill" aria-hidden="true" />
          {LADDER.map((l, i) => (
            <li
              key={l.tier}
              data-on={l.tier === tier}
              data-past={i < LADDER.findIndex((x) => x.tier === tier)}
            >
              <i aria-hidden="true" />
              <b>{l.tier}</b>
              {l.miles === 0 ? (
                <span>Every booking</span>
              ) : (
                <span>
                  {(l.miles / 1000).toLocaleString("en-US")}k mi
                  <br />
                  {l.flights} flights
                </span>
              )}
            </li>
          ))}
        </ol>

        {next && (
          <dl className="bk-facts">
            <div>
              <dt>Miles to go</dt>
              <dd>{Math.max(0, tierStarts(next) - miles).toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt>Or flights</dt>
              <dd>{Math.max(0, segmentsFor(next) - segments)}</dd>
            </div>
            <div>
              <dt>This year</dt>
              <dd>{segments} flown</dd>
            </div>
          </dl>
        )}

        {/* This card against the next one. Two lists, one headed "Your Blue
            card" and one headed "Silver adds", made the reader hold both in
            their head and subtract. A column each does the subtracting, and
            the channel down the right says which column is the prize. */}
        <div className="bk-perkgrid" data-alone={!next}>
          {next && (
            <>
              <i className="bk-perk-band" aria-hidden="true" />
              <span className="bk-perk-h" />
              <span className="bk-perk-h">{tier}</span>
              <span className="bk-perk-h">{next}</span>
            </>
          )}
          {PERKS.map((perk) => (
            <Fragment key={perk.name}>
              <span className="bk-perk-n">{perk.name}</span>
              <Cell has={perk.of[tier]} />
              {next && <Cell has={perk.of[next]} />}
            </Fragment>
          ))}
        </div>
      </div>

      <p className="bk-note">
        Miles never expire, and spending them does not lower status.
      </p>
    </div>
  );
}

/** One square of the comparison: a tick, a figure, or nothing at all. */
function Cell({ has }: { has: string | boolean }) {
  return (
    <span className="bk-perk-c" data-on={Boolean(has)}>
      {has === true ? <Tick size={16} /> : has === false ? "—" : has}
    </span>
  );
}

/**
 * The Club Card: the programme's own payment card, and the three things it
 * does to a booking paid with it.
 */
export function ClubCard() {
  const member = useBooking((s) => s.member);
  const passengers = useBooking((s) => s.passengers);
  const hold = useBooking((s) => s.holdClubCard);
  const drop = useBooking((s) => s.dropClubCard);
  const held = Boolean(member?.cardHolder);
  const p = passengers[0];
  const number = member ? clubCardNumber(member.number) : "5299000000000000";
  const masked = `5299 •••• •••• ${number.slice(-4)}`;

  return (
    <div className="bk-body">
      {/* The card face. Black, like the member card, because it is the same
          programme; the number is the member's own digits behind the
          programme's prefix, so it is recognised the moment it is typed. */}
      <div className="bk-member bk-clubcard" data-tier="Platinum" data-held={held}>
        <div className="bk-member-top">
          <span className="bk-label">{CLUB_CARD.name}</span>
          <span className="bk-member-tier">{held ? "Held" : "Not held"}</span>
        </div>
        <span className="bk-clubcard-chip" aria-hidden="true" />
        <div className="bk-clubcard-no bk-mono">{masked}</div>
        <div className="bk-member-foot">
          <span>{p.family ? `${p.family} / ${p.given}` : "Your name"}</span>
          <span>{held && member?.since ? `Since ${monthYear(member.since)}` : "12/30"}</span>
        </div>
      </div>

      <div className="bk-card">
        <div className="bk-card-h">What it does</div>
        <div className="bk-perks">
          {CLUB_CARD.perks.map((b) => (
            <span className="bk-fare-l" data-state={held ? "yes" : "fee"} key={b}>
              {held ? <Tick /> : <Plus />}
              {b}
            </span>
          ))}
        </div>
        <dl className="bk-facts">
          <div>
            <dt>On STRATUM</dt>
            <dd>{CLUB_CARD.onStratum} mi / $</dd>
          </div>
          <div>
            <dt>Elsewhere</dt>
            <dd>{CLUB_CARD.elsewhere} mi / $</dd>
          </div>
          <div>
            <dt>Fee</dt>
            <dd>None</dd>
          </div>
        </dl>
        <p className="bk-note">
          {held
            ? "On file as your card · every fare paid with it earns twice"
            : "Issued by nobody · charges nothing · a demonstration of the shape"}
        </p>
        {member ? (
          <button className="bk-btn" onClick={held ? drop : hold}>
            {held ? "Stop holding the card" : "Hold the card and pay with it"}
          </button>
        ) : (
          <p className="bk-empty">Issued with your first booking</p>
        )}
      </div>
    </div>
  );
}

/**
 * Use miles: the balance, and the two things it buys on the trip in hand.
 */
export function ClubMiles() {
  const member = useBooking((s) => s.member);
  const pnr = useBooking((s) => s.pnr);
  const out = useBooking((s) => s.legs.out);
  const milesBags = useBooking((s) => s.milesBags);
  const milesSeats = useBooking((s) => s.milesSeats);
  const redeem = useBooking((s) => s.redeem);
  const balance = balanceOf(member);
  // Which trip: the header names it, because "this trip" is the one that
  // happens to be open, and that is not always the one somebody meant.
  const route = out
    ? `${out.segments[0].option.from.iata} → ${out.segments[out.segments.length - 1].option.to.iata}`
    : null;
  const leaves = out ? day(out.segments[0].option.departureUtc.slice(0, 10)) : null;

  return (
    <div className="bk-body">
      <div className="bk-card">
        <div className="bk-card-h" data-split="true">
          <span>Balance</span>
          <span>{(member?.redeemed ?? 0).toLocaleString("en-US")} spent</span>
        </div>
        <div className="bk-miles-balance">
          {balance.toLocaleString("en-US")}
          <i>miles</i>
        </div>
      </div>

      <div className="bk-card" data-flush="true">
        <div className="bk-sec" data-split="true">
          <span>{pnr ? "On this trip" : "On a trip"}</span>
          {pnr && route && (
            <span>
              {route} · {leaves}
            </span>
          )}
        </div>
        <div className="bk-pad">
          {REDEMPTIONS.map((r) => {
            const done = r.id === "seats" && milesSeats;
            const can = Boolean(pnr) && balance >= r.miles && !done;
            return (
              <button
                key={r.id}
                className="bk-row"
                disabled={!can}
                onClick={() => redeem(r.id)}
              >
                <span className="bk-row-k">
                  {r.name}
                  <span className="bk-row-sub">
                    {done
                      ? "Bought for this trip"
                      : r.id === "bag" && milesBags > 0
                        ? `${milesBags} bought · ${r.does}`
                        : !pnr
                          ? "Book a trip first"
                          : balance < r.miles
                            ? `${(r.miles - balance).toLocaleString("en-US")} more miles needed`
                            : r.does}
                  </span>
                </span>
                <span className="bk-row-v bk-miles-price">
                  {r.miles.toLocaleString("en-US")}
                </span>
              </button>
            );
          })}
          {pnr && (
            <p className="bk-note">Spent on a trip that is then cancelled, they come back</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Earn miles: the formula flying uses, the card, and the partners every
 * programme lists beside them. The multipliers are read from the table the
 * statement is worked out with, so this page cannot say one thing and the
 * balance do another.
 */
export function ClubEarn() {
  const member = useBooking((s) => s.member);
  const go = useBooking((s) => s.go);
  const cabins: CabinClass[] = ["economy", "premium", "business", "first"];
  const least = CABIN_EARN.economy * FARE_EARN.light;
  const most = CABIN_EARN.first * FARE_EARN.flex;
  return (
    <div className="bk-body">
      <div className="bk-card">
        <div className="bk-card-h" data-split="true">
          <span>Flying</span>
          <span>A mile for every mile flown</span>
        </div>
        <dl className="bk-facts" data-cols="4" aria-label="By cabin">
          {cabins.map((c) => (
            <div key={c}>
              <dt>{cabinName(c).replace(" Economy", "")}</dt>
              <dd>×{CABIN_EARN[c]}</dd>
            </div>
          ))}
        </dl>
        <dl className="bk-facts" aria-label="By fare">
          {FARE_FAMILIES.map((f) => (
            <div key={f.id}>
              <dt>{f.name}</dt>
              <dd>×{FARE_EARN[f.id]}</dd>
            </div>
          ))}
        </dl>
        <p className="bk-note">
          Cabin times fare · from ×{least} in Economy Light to ×{most} in First Flex
        </p>
      </div>

      <div className="bk-card" data-flush="true">
        <div className="bk-sec">Beyond flying</div>
        <div className="bk-pad">
          <button className="bk-row" onClick={() => go("club-card")}>
            <span className="bk-row-k">
              Club Card
              <span className="bk-row-sub">
                {member?.cardHolder
                  ? "Held · every STRATUM fare earns twice"
                  : `${CLUB_CARD.onStratum} mi / $ on STRATUM · ${CLUB_CARD.elsewhere} elsewhere`}
              </span>
            </span>
            <span className="bk-row-v bk-dim">
              <Go />
            </span>
          </button>
          {PARTNERS.map((p) => (
            <div className="bk-row" data-static="true" key={p.name}>
              <span className="bk-row-k">
                {p.name}
                <span className="bk-row-sub">{p.does}</span>
              </span>
              <span className="bk-row-v">{p.rate}</span>
            </div>
          ))}
          <p className="bk-note">Named for the shape of a programme · none of them is linked here</p>
        </div>
      </div>
    </div>
  );
}

/** The statement: every flight that put the balance there, and everything
 *  that took from it, with the year's two totals at the top. */
export function ClubActivity() {
  const { activity } = useStanding();
  const today = new Date().toISOString().slice(0, 10);
  const year = today.slice(0, 4);
  const thisYear = activity.filter((e) => e.flownAt.slice(0, 4) === year);
  const earnedYear = thisYear.filter((e) => e.miles > 0).reduce((n, e) => n + e.miles, 0);
  const spentYear = thisYear.filter((e) => e.miles < 0).reduce((n, e) => n - e.miles, 0);
  return (
    <div className="bk-body">
      {activity.length > 0 ? (
        <div className="bk-card" data-flush="true">
          <div className="bk-sec" data-split="true">
            <span>Statement</span>
            <span>
              {year} · +{earnedYear.toLocaleString("en-US")}
              {spentYear > 0 && ` −${spentYear.toLocaleString("en-US")}`}
            </span>
          </div>
          <div className="bk-hist">
            {activity.map((e, i) => (
              <div
                className="bk-hist-row"
                key={i}
                data-flown={e.flownAt <= today}
                data-spent={e.miles < 0}
              >
                <span className="bk-hist-when">{day(e.flownAt)}</span>
                {e.miles < 0 ? (
                  <span className="bk-hist-what">
                    <b>{e.what}</b>
                    <span>
                      {e.from} → {e.to} · on miles
                    </span>
                  </span>
                ) : (
                  <span className="bk-hist-what">
                    <b>
                      {AIRPORTS[e.from]?.city.en ?? e.from} to{" "}
                      {AIRPORTS[e.to]?.city.en ?? e.to}
                    </b>
                    <span>
                      {[
                        e.flights.length > 0 ? e.flights.join(" + ") : null,
                        e.segments > 1 ? `${e.segments} flights` : null,
                        e.km > 0 ? `${e.km.toLocaleString("en-US")} km` : null,
                        e.cabinClass && e.family
                          ? `${cabinName(e.cabinClass).replace(" Economy", "")} ${earnRate(e.cabinClass, e.family)}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                )}
                <span className="bk-hist-miles">
                  {e.miles < 0 ? "−" : "+"}
                  {Math.abs(e.miles).toLocaleString("en-US")}
                </span>
              </div>
            ))}
          </div>
          <p className="bk-note">Miles never expire</p>
        </div>
      ) : (
        <div className="bk-card">
          <p className="bk-empty">Nothing flown yet</p>
        </div>
      )}
    </div>
  );
}
