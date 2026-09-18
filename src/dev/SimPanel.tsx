import { useState } from "react";
import { useBench } from "./benchStore";
import { useCabin } from "../flight-state/store";
import { AIRPORTS, blockMinutes } from "./mockFlight";
import type { FlightPhase } from "../flight-state/types";
import { duration } from "../ife/format";

const PHASES: FlightPhase[] = [
  "boarding",
  "taxi",
  "takeoff",
  "cruise",
  "descent",
  "landed",
];

/**
 * Everything that would be true of a real flight, made adjustable. It lives
 * outside the bezel because it is not part of the IFE and must never be
 * mistaken for it — there is no such panel on an aircraft.
 */
export function SimPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const b = useBench();
  const seats = useCabin((s) => s.seats);
  const setSeat = useCabin((s) => s.setSeat);
  const messages = useCabin((s) => s.messages);

  // Somebody in another seat writing back. There is no such button on an
  // aircraft — this is the bench standing in for a second passenger, so the
  // seen/unseen half of a thread can be seen working at all.
  const reply = (from: string) => {
    const lines = [
      "are you seeing this weather",
      "swap seats after the meal?",
      "which film did you pick",
      "wake me for the descent",
    ];
    useCabin
      .getState()
      .post({ from, to: b.seat, text: lines[Math.floor(Math.random() * lines.length)] });
  };

  if (collapsed) {
    return (
      <aside className="bench-panel" data-collapsed="true">
        <button
          className="bench-panel-toggle"
          onClick={() => setCollapsed(false)}
          title="Show simulation controls"
          style={{ margin: "0 8px" }}
        >
          ‹
        </button>
      </aside>
    );
  }

  const block = blockMinutes(AIRPORTS[b.fromIata], AIRPORTS[b.toIata]);

  return (
    <aside className="bench-panel">
      <div className="bench-head">
        <span className="bench-title">Simulation</span>
        <button
          className="bench-panel-toggle"
          onClick={() => setCollapsed(true)}
          title="Hide"
        >
          ›
        </button>
      </div>

      <div className="bench-group">
        <div className="bench-group-name">Seat</div>
        <div className="bench-row">
          <label htmlFor="sim-seat">Number</label>
          <input
            id="sim-seat"
            value={b.seat}
            onChange={(e) => b.set({ seat: e.target.value.toUpperCase() })}
          />
        </div>
        <div className="bench-row">
          <label>Cabin</label>
          <div className="bench-seg">
            {(["business", "economy"] as const).map((c) => (
              <button
                key={c}
                data-on={b.cabinClass === c}
                onClick={() => b.set({ cabinClass: c })}
              >
                {c === "business" ? "Business" : "Economy"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bench-group">
        <div className="bench-group-name">Seat messages</div>
        <div className="bench-row">
          <label>Reply from</label>
          <div className="bench-seg">
            {["12J", "14A", "02C"].map((s2) => (
              <button key={s2} onClick={() => reply(s2)}>
                {s2}
              </button>
            ))}
          </div>
        </div>
        <div className="bench-row">
          <label>Departure board</label>
          <div className="bench-seg">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                data-on={b.connections === v}
                onClick={() => b.set({ connections: v })}
              >
                {v ? "Sent up" : "Not sent"}
              </button>
            ))}
          </div>
        </div>
        <div className="bench-row">
          <label>On board</label>
          <span className="bench-value">
            {messages.length} held · {messages.filter((m) => !m.seenUtc).length}{" "}
            unseen
          </span>
        </div>
      </div>

      <div className="bench-group">
        <div className="bench-group-name">Route</div>
        <div className="bench-row">
          <label htmlFor="sim-from">From</label>
          <select
            id="sim-from"
            value={b.fromIata}
            onChange={(e) => b.set({ fromIata: e.target.value, gaps: [] })}
          >
            {Object.keys(AIRPORTS).map((k) => (
              <option key={k} value={k}>
                {k} · {AIRPORTS[k].city.en}
              </option>
            ))}
          </select>
        </div>
        <div className="bench-row">
          <label htmlFor="sim-to">To</label>
          <select
            id="sim-to"
            value={b.toIata}
            onChange={(e) => b.set({ toIata: e.target.value, gaps: [] })}
          >
            {Object.keys(AIRPORTS).map((k) => (
              <option key={k} value={k}>
                {k} · {AIRPORTS[k].city.en}
              </option>
            ))}
          </select>
        </div>
        <div className="bench-row">
          <label htmlFor="sim-no">Flight</label>
          <input
            id="sim-no"
            value={b.flightNo}
            onChange={(e) => b.set({ flightNo: e.target.value })}
          />
        </div>
        <div className="bench-row">
          <label htmlFor="sim-dep">Departed</label>
          <input
            id="sim-dep"
            type="number"
            step={15}
            value={b.departureOffsetMin}
            onChange={(e) =>
              b.set({ departureOffsetMin: Number(e.target.value) })
            }
          />
        </div>
        <div className="bench-note">
          Minutes from now; negative is already airborne. Block time{" "}
          {duration(block * 60_000)}.
        </div>
      </div>

      <div className="bench-group">
        <div className="bench-group-name">Time</div>
        <div className="bench-row">
          <label>Rate</label>
          <div className="bench-seg">
            {([1, 10, 60] as const).map((s) => (
              <button
                key={s}
                data-on={b.speed === s}
                onClick={() => b.set({ speed: s })}
              >
                {s}×
              </button>
            ))}
            <button
              data-on={!b.running}
              onClick={() => b.set({ running: !b.running })}
            >
              {b.running ? "Pause" : "Paused"}
            </button>
          </div>
        </div>
        <div className="bench-row">
          <label htmlFor="sim-prog">Timeline</label>
          <input
            id="sim-prog"
            type="range"
            min={0}
            max={1000}
            value={Math.round(b.progress * 1000)}
            onChange={(e) => {
              b.set({ phaseOverride: null });
              b.advance(Number(e.target.value) / 1000);
            }}
          />
        </div>
        <div className="bench-row">
          <label>Phase</label>
          <div className="bench-seg">
            {PHASES.map((p) => (
              <button
                key={p}
                data-on={b.phaseOverride === p}
                onClick={() =>
                  b.set({ phaseOverride: b.phaseOverride === p ? null : p })
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="bench-note">
          Picking a phase pins the flight to its midpoint. Pick it again to
          release it back to the timeline.
        </div>
      </div>

      <div className="bench-group">
        <div className="bench-group-name">Evidence</div>
        <div className="bench-row">
          <label>Receiver</label>
          <div className="bench-seg">
            <button data-on={b.heard} onClick={() => b.set({ heard: true })}>
              Heard
            </button>
            <button data-on={!b.heard} onClick={() => b.set({ heard: false })}>
              Not heard
            </button>
          </div>
        </div>
        <div className="bench-note">
          While nothing is heard the track behind the aircraft is drawn broken
          and the remaining time is marked inferred. {b.gaps.length} gap
          {b.gaps.length === 1 ? "" : "s"} so far.
        </div>
        <div className="bench-seg">
          <button onClick={() => b.set({ gaps: [] })}>Clear gaps</button>
        </div>
      </div>

      <div className="bench-group">
        <div className="bench-group-name">Announcement</div>
        <div className="bench-seg">
          <button
            data-on={b.paOverride === null}
            onClick={() => b.set({ paOverride: null })}
          >
            None
          </button>
          <button
            data-on={b.paOverride === "safety"}
            onClick={() => b.set({ paOverride: "safety" })}
          >
            Safety
          </button>
          <button
            data-on={b.paOverride === "captain"}
            onClick={() => b.set({ paOverride: "captain" })}
          >
            Captain
          </button>
        </div>
        <div className="bench-note">
          Takes every screen in the cabin. The passenger cannot dismiss it.
        </div>
      </div>

      <div className="bench-group">
        <div className="bench-group-name">Cabin</div>
        <div className="bench-note">
          Click a seat to toggle its reading light; shift-click for its call
          light.
        </div>
        <div className="bench-cabin">
          {Object.values(seats).map((s) => (
            <button
              key={s.seat}
              data-self={s.seat === b.seat}
              onClick={(e) =>
                e.shiftKey
                  ? setSeat(s.seat, { callAttendant: !s.callAttendant })
                  : setSeat(s.seat, { readingLight: !s.readingLight })
              }
            >
              <span>{s.seat}</span>
              <span className="bench-cabin-flags">
                {s.readingLight ? "L" : ""}
                {s.callAttendant ? "C" : ""}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
