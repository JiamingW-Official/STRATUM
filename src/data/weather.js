// ── T3-02: Weather Widget (Open-Meteo free API) ──

let cachedWeather = null;
let fetchingWeather = false;

export async function fetchWeather(lat, lon) {
  if (cachedWeather && cachedWeather._lat === lat.toFixed(1) && cachedWeather._lon === lon.toFixed(1)) {
    return cachedWeather;
  }
  if (fetchingWeather) return cachedWeather;
  fetchingWeather = true;

  try {
    // Use Worker edge-cached endpoint (15 min cache) with direct API fallback
    const workerUrl = `/api/weather?lat=${lat}&lon=${lon}`;
    const directUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`
      + `&current=temperature_2m,relative_humidity_2m,apparent_temperature,dewpoint_2m,surface_pressure,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cloud_cover,visibility,weather_code,is_day`
      + `&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation,precipitation_probability&forecast_hours=24`
      + `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset&forecast_days=7`
      + `&timezone=auto`;
    let res;
    try {
      res = await fetch(workerUrl, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error('Worker weather failed');
    } catch {
      res = await fetch(directUrl, { signal: AbortSignal.timeout(8000) });
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const c = data.current;
    const hourly = [];
    if (data.hourly && data.hourly.time) {
      for (let i = 0; i < Math.min(data.hourly.time.length, 24); i++) {
        const t = new Date(data.hourly.time[i]);
        hourly.push({
          hour: t.getHours(),
          temp: Math.round(data.hourly.temperature_2m[i]),
          code: data.hourly.weather_code[i],
          wind: Math.round(data.hourly.wind_speed_10m[i]),
          precip: data.hourly.precipitation?.[i] || 0,
          precipProb: data.hourly.precipitation_probability?.[i] || 0,
        });
      }
    }
    const daily = [];
    if (data.daily && data.daily.time) {
      for (let i = 0; i < data.daily.time.length; i++) {
        daily.push({
          date: data.daily.time[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          code: data.daily.weather_code[i],
          precip: data.daily.precipitation_sum?.[i] || 0,
          precipProb: data.daily.precipitation_probability_max?.[i] || 0,
          windMax: Math.round(data.daily.wind_speed_10m_max?.[i] || 0),
          sunrise: data.daily.sunrise?.[i] || null,
          sunset: data.daily.sunset?.[i] || null,
        });
      }
    }
    cachedWeather = {
      temp: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      dewpoint: c.dewpoint_2m,
      humidity: c.relative_humidity_2m,
      pressure: c.surface_pressure,
      windSpeed: c.wind_speed_10m,
      windGusts: c.wind_gusts_10m,
      windDir: c.wind_direction_10m,
      cloudCover: c.cloud_cover,
      visibility: c.visibility,
      weatherCode: c.weather_code,
      isDay: c.is_day,
      utcOffsetSeconds: data.utc_offset_seconds || 0,
      timezoneAbbr: data.timezone_abbreviation || '',
      hourly,
      daily,
      _lat: lat.toFixed(1),
      _lon: lon.toFixed(1),
    };
    console.log('[STRATUM] Weather loaded:', cachedWeather);
    return cachedWeather;
  } catch (err) {
    console.warn('[STRATUM] Weather fetch failed:', err.message);
    return null;
  } finally {
    fetchingWeather = false;
  }
}

const WMO_CODES = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
  80: 'Showers', 81: 'Mod Showers', 82: 'Heavy Showers',
  95: 'Thunderstorm', 96: 'T-Storm + Hail', 99: 'Heavy T-Storm',
};

export function weatherDescription(code) {
  return WMO_CODES[code] || 'Unknown';
}

export function windDirToCardinal(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function formatVisibility(meters) {
  if (meters >= 10000) return '>10 km';
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
}

// Weather code → icon character for compact display
export function weatherIcon(code) {
  if (code === 0) return '☀';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁';
  if (code >= 45 && code <= 48) return '🌫';
  if (code >= 51 && code <= 55) return '🌦';
  if (code >= 61 && code <= 65) return '🌧';
  if (code >= 71 && code <= 75) return '❄';
  if (code >= 80 && code <= 82) return '🌧';
  if (code >= 95) return '⛈';
  return '☁';
}

// Flight condition category based on visibility & cloud cover
// W1: Density Altitude — the altitude the aircraft "feels" based on air density.
// pressureHPa = surface pressure, tempC = temperature, elevFt = field elevation.
// Returns density altitude in feet. Higher DA = worse performance.
export function computeDensityAltitude(pressureHPa, tempC, elevFt = 0) {
  if (pressureHPa == null || tempC == null) return null;
  // Pressure altitude: PA = (1013.25 - QNH) × 30 + field elevation
  const pa = (1013.25 - pressureHPa) * 30 + elevFt;
  // ISA temp at this altitude: 15°C - 2°C per 1000ft
  const isaTemp = 15 - 2 * (pa / 1000);
  // Density altitude: PA + 120 × (OAT - ISA)
  return Math.round(pa + 120 * (tempC - isaTemp));
}

// ── W2: Destination Weather Cache ──
// Separate cache for destination airport weather (to not clobber user-location weather)
const _destWeatherCache = new Map(); // "lat,lon" → { data, fetchedAt }
let _destFetching = null;

export async function fetchDestinationWeather(lat, lon) {
  const key = `${lat.toFixed(1)},${lon.toFixed(1)}`;
  const cached = _destWeatherCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < 900000) return cached.data; // 15 min cache
  if (_destFetching === key) return cached?.data || null;
  _destFetching = key;

  try {
    // Use Worker edge-cached endpoint (15 min cache) with direct API fallback
    const workerUrl = `/api/weather?lat=${lat}&lon=${lon}`;
    const directUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`
      + `&current=wind_speed_10m,wind_gusts_10m,wind_direction_10m,visibility,cloud_cover,weather_code`;
    let res;
    try {
      res = await fetch(workerUrl, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error('Worker weather failed');
    } catch {
      res = await fetch(directUrl, { signal: AbortSignal.timeout(8000) });
    }
    if (!res.ok) return null;
    const data = await res.json();
    const c = data.current;
    const result = {
      windSpeed: c.wind_speed_10m,
      windGusts: c.wind_gusts_10m,
      windDir: c.wind_direction_10m,
      visibility: c.visibility,
      cloudCover: c.cloud_cover,
      weatherCode: c.weather_code,
    };
    _destWeatherCache.set(key, { data: result, fetchedAt: Date.now() });
    return result;
  } catch {
    return null;
  } finally {
    _destFetching = null;
  }
}

// ── W3: Turbulence Indicator ──
// Composite assessment from gust factor, WMO convective codes, and proximity to heavy traffic
export function estimateTurbulence(weather, nearbyHeavy = 0) {
  if (!weather) return null;
  let score = 0;

  // Gust factor: gusts / sustained wind ratio
  if (weather.windGusts != null && weather.windSpeed != null && weather.windSpeed > 5) {
    const gustFactor = weather.windGusts / weather.windSpeed;
    if (gustFactor > 2.0) score += 3;
    else if (gustFactor > 1.5) score += 2;
    else if (gustFactor > 1.2) score += 1;
  }

  // High wind speed alone
  if (weather.windSpeed > 50) score += 2;
  else if (weather.windSpeed > 30) score += 1;

  // WMO convective codes (thunderstorms)
  const wc = weather.weatherCode;
  if (wc >= 95) score += 3; // thunderstorm
  else if (wc >= 80) score += 1; // showers

  // Wake turbulence from nearby heavy aircraft
  if (nearbyHeavy >= 3) score += 2;
  else if (nearbyHeavy >= 1) score += 1;

  if (score >= 5) return { label: 'SEVERE', color: '#ff4444' };
  if (score >= 3) return { label: 'MODERATE', color: '#ee8833' };
  if (score >= 1) return { label: 'LIGHT', color: '#e8c36a' };
  return { label: 'SMOOTH', color: '#44dd88' };
}

export function flightCategory(visibility, cloudCover) {
  const visKm = visibility / 1000;
  if (visKm >= 8 && cloudCover < 50) return { label: 'VFR', color: '#44dd88' };
  if (visKm >= 5 && cloudCover < 75) return { label: 'MVFR', color: '#5aacff' };
  if (visKm >= 1.6 && cloudCover < 90) return { label: 'IFR', color: '#ff4444' };
  return { label: 'LIFR', color: '#cc44cc' };
}
