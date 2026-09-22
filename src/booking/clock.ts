import { useEffect, useState } from "react";

/**
 * The minute, as a state.
 *
 * Every screen that prints a clock or counts down to something is printing a
 * reading, and a reading taken when the app started and never again is worse
 * than no reading: the home screen said it was 04:55 in New York for as long
 * as you left it open, and the trip screen said a departure was fourteen
 * hours away an hour after it had stopped being.
 *
 * One timer, one minute, and it lands on the wall clock rather than drifting
 * a little further from it on every tick.
 */
export function useMinute(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let id = 0;
    const tick = () => {
      setNow(Date.now());
      id = window.setTimeout(tick, 60000 - (Date.now() % 60000));
    };
    id = window.setTimeout(tick, 60000 - (Date.now() % 60000));
    return () => window.clearTimeout(id);
  }, []);
  return now;
}

/** "14h 20m", "48m", "now" — a gap said the way somebody waiting says it. */
export function away(ms: number): string {
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  return `${Math.round(h / 24)} days`;
}
