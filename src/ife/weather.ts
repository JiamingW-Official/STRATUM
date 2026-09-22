import { useEffect, useState } from "react";
import type { Airport, Named } from "../flight-state/types";

/**
 * Weather where you are landing, from the Worker route the sky view already
 * uses. Same origin, same cache, no second key to keep.
 */
export type Weather = {
  tempC: number;
  feelsC: number;
  windKph: number;
  windDeg: number;
  code: number;
};

const cache = new Map<string, Promise<Weather | null>>();

async function fetchWeather(ap: Airport): Promise<Weather | null> {
  const res = await fetch(`/api/weather?lat=${ap.lat}&lon=${ap.lon}`);
  if (!res.ok) return null;
  const d = await res.json();
  const c = d.current ?? d.current_weather;
  if (!c) return null;
  return {
    tempC: c.temperature_2m ?? c.temperature,
    feelsC: c.apparent_temperature ?? c.temperature_2m ?? c.temperature,
    windKph: c.wind_speed_10m ?? c.windspeed ?? 0,
    windDeg: c.wind_direction_10m ?? c.winddirection ?? 0,
    code: c.weather_code ?? c.weathercode ?? 0,
  };
}

/**
 * WMO codes, collapsed to the handful a passenger cares about.
 *
 * A `Named` rather than a pair, read through `pick`, so a language that has
 * no word here reads the English instead of the Chinese — the same rule as
 * everything else the cabin says.
 */
export function conditionKey(code: number): Named {
  if (code === 0)
    return { en: "Clear", zh: "晴", "zh-Hant": "晴", ja: "快晴", es: "Despejado", fr: "Dégagé", ru: "Ясно" };
  if (code <= 2)
    return { en: "Mostly clear", zh: "少云", "zh-Hant": "少雲", ja: "晴れ", es: "Poco nuboso", fr: "Peu nuageux", ru: "Малооблачно" };
  if (code === 3)
    return { en: "Overcast", zh: "阴", "zh-Hant": "陰", ja: "曇り", es: "Nublado", fr: "Couvert", ru: "Пасмурно" };
  if (code <= 48)
    return { en: "Fog", zh: "雾", "zh-Hant": "霧", ja: "霧", es: "Niebla", fr: "Brouillard", ru: "Туман" };
  if (code <= 57)
    return { en: "Drizzle", zh: "毛毛雨", "zh-Hant": "毛毛雨", ja: "霧雨", es: "Llovizna", fr: "Bruine", ru: "Морось" };
  if (code <= 67)
    return { en: "Rain", zh: "雨", "zh-Hant": "雨", ja: "雨", es: "Lluvia", fr: "Pluie", ru: "Дождь" };
  if (code <= 77)
    return { en: "Snow", zh: "雪", "zh-Hant": "雪", ja: "雪", es: "Nieve", fr: "Neige", ru: "Снег" };
  if (code <= 82)
    return { en: "Showers", zh: "阵雨", "zh-Hant": "陣雨", ja: "にわか雨", es: "Chubascos", fr: "Averses", ru: "Ливни" };
  if (code <= 86)
    return { en: "Snow showers", zh: "阵雪", "zh-Hant": "陣雪", ja: "にわか雪", es: "Chubascos de nieve", fr: "Averses de neige", ru: "Снегопады" };
  return { en: "Thunderstorm", zh: "雷暴", "zh-Hant": "雷暴", ja: "雷雨", es: "Tormenta", fr: "Orage", ru: "Гроза" };
}

export function useWeather(airport: Airport) {
  const key = `${airport.lat},${airport.lon}`;
  const [data, setData] = useState<Weather | null>(null);
  useEffect(() => {
    if (!airport.iata || airport.lat === 0) return;
    let live = true;
    if (!cache.has(key))
      cache.set(
        key,
        fetchWeather(airport).catch(() => null),
      );
    cache.get(key)!.then((w) => live && setData(w));
    return () => {
      live = false;
    };
  }, [key]);
  return data;
}

/**
 * Which way the wind is coming from, as eight points.
 *
 * The bearing is already in the reading and was being thrown away, while the
 * card beside it spent a third of its width repeating the destination clock
 * that the left-hand column had just set at 92px. Eight points rather than
 * sixteen: nobody standing on a jet bridge needs to know it is WSW.
 */
const POINTS: Named[] = [
  { en: "N", zh: "北", "zh-Hant": "北", ja: "北", es: "N", fr: "N", ru: "С" },
  { en: "NE", zh: "东北", "zh-Hant": "東北", ja: "北東", es: "NE", fr: "NE", ru: "СВ" },
  { en: "E", zh: "东", "zh-Hant": "東", ja: "東", es: "E", fr: "E", ru: "В" },
  { en: "SE", zh: "东南", "zh-Hant": "東南", ja: "南東", es: "SE", fr: "SE", ru: "ЮВ" },
  { en: "S", zh: "南", "zh-Hant": "南", ja: "南", es: "S", fr: "S", ru: "Ю" },
  { en: "SW", zh: "西南", "zh-Hant": "西南", ja: "南西", es: "SO", fr: "SO", ru: "ЮЗ" },
  { en: "W", zh: "西", "zh-Hant": "西", ja: "西", es: "O", fr: "O", ru: "З" },
  { en: "NW", zh: "西北", "zh-Hant": "西北", ja: "北西", es: "NO", fr: "NO", ru: "СЗ" },
];

export function compass(deg: number): Named {
  const i = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return POINTS[i];
}
