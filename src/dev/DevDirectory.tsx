import "./bench.css";

type Status = "ready" | "building" | "not started";

const ENTRIES: Array<{
  href: string;
  name: string;
  zh: string;
  status: Status;
  /** What the thing is, for somebody about to click it. */
  note: string;
  /** What it is *for*: the job it does in the thesis these four pieces test. */
  role?: string;
}> = [
  /* In the order the work is used, not the order it was built: you book a
     seat, you sit down in front of the screen, and the sky is what is
     outside the window the whole time. Sky led this list because it existed
     first, which is a fact about the repository rather than about anybody
     arriving at the page. */
  {
    href: "/dev/book/",
    name: "Booking",
    zh: "订票",
    status: "ready",
    note: "STRATUM on a handset: fare, seat, check-in, and a boarding pass whose code opens the seat-back screen it was issued for.",
    role:
      "All decision, no admission. The sorting happens here and you are the one doing it, so this should be the least calm piece. It is the control.",
  },
  {
    href: "/dev/ife/",
    name: "IFE bench",
    zh: "机上娱乐开发台",
    status: "ready",
    note: "One seat-back screen at 1920×1080 in a moulded surround, with the flight simulated beside it.",
    role:
      "Total information, nothing left to decide — the one interface you get in the middle state.",
  },
  {
    href: "/",
    name: "Sky",
    zh: "天空视图",
    status: "ready",
    note: "The live ADS-B sky. Still at the site root; it moves to /sky when the rest of the work needs the root.",
    role:
      "The same middle state from outside, including the aircraft that applied not to be seen. The calm should break here.",
  },
  {
    href: "",
    name: "Terminal",
    zh: "候机楼",
    status: "not started",
    note: "Gates, boarding, and the sky view running on a departures wall.",
  },
  {
    href: "",
    name: "Cabin",
    zh: "机舱",
    status: "not started",
    note: "The Blender cabin, with this IFE hung on the seat in front of you.",
    role:
      "In the room, nothing left to decide. The class line is not described, it is a wall a few rows ahead of you.",
  },
];

/**
 * A workshop index, not a front door. It is deliberately plain: the work it
 * points at is the work, and this page should never be mistaken for part of
 * it.
 */
export function DevDirectory() {
  return (
    <div className="dev-dir">
      <div className="dev-dir-head">
        <span className="bench-title">STRATUM · developer directory</span>
      </div>

      {/* The four pieces below are not a portfolio; they are one experiment
          cut into four, and each of them moves one of the two conditions.
          Without this at the top the list reads as four unrelated demos —
          which is what it looked like, and what it is not.

          The thesis document itself is not linked from here: this repository
          is public, and a share link to a live working draft is the author's
          to hand out rather than the index's. */}
      <section className="dev-thesis">
        <p className="dev-thesis-q">
          Why do people feel calmest when they belong nowhere?
        </p>
        <p className="dev-thesis-p">
          The calm comes from <b>being let in</b> and{" "}
          <b>having nothing left to decide</b> — not from comfort, and not
          from disconnection. It holds while the system's sorting stays out
          of sight, and breaks the moment that sorting becomes visible.
        </p>
      </section>
      <ul className="dev-list">
        {ENTRIES.map((e) => (
          <li key={e.name} className="dev-item" data-off={!e.href}>
            {e.href ? (
              <a href={e.href} className="dev-item-name">
                {e.name}
              </a>
            ) : (
              <span className="dev-item-name">{e.name}</span>
            )}
            <span className="dev-item-zh">{e.zh}</span>
            <span className="dev-item-status" data-status={e.status}>
              {e.status}
            </span>
            <span className="dev-item-note">{e.note}</span>
            {e.role && <span className="dev-item-role">{e.role}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
