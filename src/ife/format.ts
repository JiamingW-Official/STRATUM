import type { Airport } from "../flight-state/types";

/** HH:MM in the airport's own zone. What a passenger wants is local time. */
export function localTime(iso: string, ap: Airport): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: ap.tz,
  }).format(new Date(iso));
}

export function localDay(iso: string, ap: Airport): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: ap.tz,
  }).format(new Date(iso));
}

export function utcTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(iso));
}

/**
 * "2h 53min", the phrasing every seat-back screen uses — and its Chinese,
 * because a number with an English unit beside Chinese labels is the one place
 * a translated interface always gives itself away.
 */
export function duration(ms: number, lang: "en" | "zh" = "en"): string {
  if (!isFinite(ms) || ms < 0) ms = 0;
  const total = Math.round(ms / 60_000);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (lang === "zh") return h > 0 ? `${h} 小时 ${m} 分` : `${m} 分`;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
