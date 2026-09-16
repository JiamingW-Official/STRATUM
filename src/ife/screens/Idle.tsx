import { useEffect, useState } from "react";
import { useCabin, useFlight, useSelf } from "../../flight-state/store";
import { localDay, localTime } from "../format";

/**
 * What the screen shows to an empty seat. The seat number is the protagonist:
 * it is the one fact a passenger standing in the aisle with a boarding pass is
 * looking for, and it is also the first thing the piece says — this screen
 * belongs to a place, and the place was assigned to you.
 */
export function Idle({ seat }: { seat: string }) {
  const { route, flightNo } = useFlight();
  const setScreen = useSelf((s) => s.setScreen);
  const cabinClass = useCabin((s) => s.seats[seat]?.cabinClass ?? "economy");
  const [now, setNow] = useState(() => new Date().toISOString());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toISOString()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="ife-idle"
      onClick={() => setScreen("home")}
      role="button"
      tabIndex={0}
      aria-label="Touch to begin"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setScreen("home");
      }}
    >
      <div className="ife-idle-top">
        <div>
          <div className="ife-cap">Seat</div>
          <div className="ife-idle-seat ife-mono">{seat}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="ife-cap">Flight</div>
          <div
            className="ife-mono"
            style={{ fontSize: 40, marginTop: 10, fontWeight: 500 }}
          >
            {flightNo}
          </div>
          <div className="ife-cap" style={{ marginTop: 18 }}>
            {cabinClass === "business" ? "Business" : "Economy"}
          </div>
        </div>
      </div>

      <div className="ife-idle-mid">
        <div className="ife-cap">Arriving</div>
        <div className="ife-idle-city">{route.to.city.en}</div>
        <div className="ife-idle-city-zh">
          {route.to.city.zh} · {route.to.name.en}
        </div>
      </div>

      <div className="ife-idle-bottom">
        <div>
          <div className="ife-idle-welcome">
            Welcome aboard. Your screen is ready whenever you are.
          </div>
          <div className="ife-idle-hint ife-cap">Touch anywhere to begin</div>
        </div>
        <div className="ife-idle-clock">
          <div className="ife-cap">{route.to.city.en} time</div>
          <div className="ife-idle-clock-time ife-mono">
            {localTime(now, route.to)}
          </div>
          <div className="ife-cap" style={{ marginTop: 8 }}>
            {localDay(now, route.to)}
          </div>
        </div>
      </div>
    </div>
  );
}
