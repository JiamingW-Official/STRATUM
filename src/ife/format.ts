import type { Airport, Lang } from "../flight-state/types";

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
/**
 * The unit a duration is counted in, per language.
 *
 * Short forms, because these sit beside a figure on a strip that is 104px
 * tall — "hours" spelled out in Russian is wider than the number it
 * qualifies. A language with nothing here reads the English, which is the
 * same rule the dictionary uses.
 */
const UNITS: Record<string, [hour: string, minute: string, space: string]> = {
  en: ["h", "min", ""],
  zh: ["小时", "分", " "],
  "zh-Hant": ["小時", "分", " "],
  ja: ["時間", "分", ""],
  es: ["h", "min", " "],
  fr: ["h", "min", " "],
  ru: ["ч", "мин", " "],
};

const units = (lang: Lang) => UNITS[lang] ?? UNITS.en;

export function duration(ms: number, lang: Lang = "en"): string {
  if (!isFinite(ms) || ms < 0) ms = 0;
  const total = Math.round(ms / 60_000);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const [hr, min, sp] = units(lang);
  return h > 0 ? `${h}${sp}${hr} ${m}${sp}${min}` : `${m}${sp}${min}`;
}

export const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

/**
 * The same duration, split into figures and units, for the one place it is
 * set large.
 *
 * At 92px "4 小时 39 分" is 606px of a 500px column and wrapped, dropping 分
 * onto a line of its own. Shrinking the whole line to fit would have made the
 * biggest number on the home screen smaller than the one in the top strip —
 * so the figures keep their size and the units come down to roughly half,
 * which is what a departure board does anyway: the hours are the content and
 * "h" is grammar.
 */
export function durationParts(
  ms: number,
  lang: Lang = "en",
): Array<{ n: string; u: string }> {
  if (!isFinite(ms) || ms < 0) ms = 0;
  const total = Math.round(ms / 60_000);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const [hour, min] = units(lang);
  const parts = [{ n: String(m), u: min }];
  if (h > 0) parts.unshift({ n: String(h), u: hour });
  return parts;
}
