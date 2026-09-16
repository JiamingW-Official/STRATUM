import { useCabin, useFlight, useSelf } from "../../flight-state/store";
import type { ScreenName } from "../../flight-state/types";
import { duration, localTime } from "../format";

const ENTRIES: Array<{
  screen: ScreenName;
  label: string;
  zh: string;
  soon?: boolean;
}> = [
  { screen: "map", label: "Flight map", zh: "航图" },
  { screen: "flightInfo", label: "Flight information", zh: "航班信息" },
  { screen: "movies", label: "Movies", zh: "电影", soon: true },
  { screen: "music", label: "Music", zh: "音乐", soon: true },
  { screen: "games", label: "Games", zh: "游戏", soon: true },
];

export function Home({ seat }: { seat: string }) {
  const setScreen = useSelf((s) => s.setScreen);
  const cabinClass = useCabin((s) => s.seats[seat]?.cabinClass ?? "economy");
  const { route, etaUtc, etaInferred, phase } = useFlight();
  const remaining = Date.parse(etaUtc) - Date.now();

  return (
    <div className="ife-pad">
      <div className="ife-home">
        <div className="ife-home-ident">
          <div className="ife-cap">Seat</div>
          <div className="ife-home-seat ife-mono">{seat}</div>
          <div className="ife-home-class ife-cap">
            {cabinClass === "business" ? "Business class" : "Economy class"}
          </div>

          <div className="ife-home-stat">
            <div className="ife-cap">
              {phase === "landed" ? "Arrived" : "Time remaining"}
            </div>
            <div
              className={`ife-home-stat-value ife-mono${etaInferred && phase !== "landed" ? " ife-inferred" : ""}`}
            >
              {phase === "landed" ? "——" : duration(remaining)}
            </div>
          </div>

          <div className="ife-home-stat">
            <div className="ife-cap">
              Arriving {route.to.city.en} · local time
            </div>
            <div className="ife-home-stat-value ife-mono">
              {localTime(etaUtc, route.to)}
            </div>
          </div>
        </div>

        <nav className="ife-menu">
          {ENTRIES.map((e) => (
            <button
              key={e.screen}
              className="ife-menu-item"
              data-soon={!!e.soon}
              onClick={() => setScreen(e.screen)}
            >
              <span className="ife-menu-label">
                {e.label}
                <span className="ife-cap" style={{ letterSpacing: 0 }}>
                  {e.zh}
                </span>
              </span>
              {e.soon && <span className="ife-menu-note">Later</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
