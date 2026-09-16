import { useEffect, useState } from "react";
import type { Airport } from "../flight-state/types";

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

/** WMO codes, collapsed to the handful a passenger cares about. */
export function conditionKey(code: number): [string, string] {
  if (code === 0) return ["Clear", "晴"];
  if (code <= 2) return ["Mostly clear", "少云"];
  if (code === 3) return ["Overcast", "阴"];
  if (code <= 48) return ["Fog", "雾"];
  if (code <= 57) return ["Drizzle", "毛毛雨"];
  if (code <= 67) return ["Rain", "雨"];
  if (code <= 77) return ["Snow", "雪"];
  if (code <= 82) return ["Showers", "阵雨"];
  if (code <= 86) return ["Snow showers", "阵雪"];
  return ["Thunderstorm", "雷暴"];
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
