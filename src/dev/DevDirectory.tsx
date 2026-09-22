import "./bench.css";

type Status = "ready" | "building" | "not started";

const ENTRIES: Array<{
  href: string;
  name: string;
  zh: string;
  status: Status;
  note: string;
}> = [
  {
    href: "/",
    name: "Sky",
    zh: "天空视图",
    status: "ready",
    note: "The live ADS-B sky. Still at the site root; it moves to /sky when the rest of the work needs the root.",
  },
  {
    href: "/dev/ife/",
    name: "IFE bench",
    zh: "机上娱乐开发台",
    status: "ready",
    note: "One seat-back screen at 1920×1080 in a moulded surround, with the flight simulated beside it.",
  },
  {
    href: "/dev/book/",
    name: "Booking",
    zh: "订票",
    status: "ready",
    note: "STRATUM on a handset: fare, seat, check-in, and a boarding pass whose code opens the seat-back screen it was issued for.",
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
          </li>
        ))}
      </ul>
    </div>
  );
}
