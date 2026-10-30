/**
 * WeatherWise — Atmospheric Intelligence API Client
 * Seamlessly integrates FastAPI backend with direct Open-Meteo fallbacks
 */

import { getWeatherInfo } from '../constants/weatherCodes';

const BACKEND_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Calculate dew point from temperature (°C) and relative humidity (%)
 */
function calculateDewPoint(tempC, humidity) {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
}

/**
 * Format ISO time into 12-hour or readable local format
 */
function formatTime12h(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch (e) {
    return isoStr;
  }
}

/**
 * Format ISO time to short hour for timeline (e.g. "2 PM")
 */
function formatHourShort(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  } catch (e) {
    return isoStr;
  }
}

/**
 * Format date to short day (e.g. "Mon, Nov 3")
 */
function formatShortDate(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  } catch (e) {
    return isoStr;
  }
}

/**
 * Get European AQI rating details
 */
export function getAqiDescription(aqi) {
  if (aqi <= 20) return { label: 'Good', color: '#55C6B3', text: 'Air quality is ideal for all outdoor activities.' };
  if (aqi <= 40) return { label: 'Fair', color: '#5BA9E8', text: 'Air quality is generally acceptable for most people.' };
  if (aqi <= 60) return { label: 'Moderate', color: '#FFC66D', text: 'Air quality is acceptable; sensitive individuals may experience minor symptoms.' };
  if (aqi <= 80) return { label: 'Poor', color: '#F97316', text: 'Sensitive groups should reduce prolonged outdoor exertion.' };
  if (aqi <= 100) return { label: 'Very Poor', color: '#EF4444', text: 'Everyone may begin to experience health effects.' };
  return { label: 'Hazardous', color: '#881337', text: 'Emergency conditions: entire population is likely affected.' };
}

/**
 * Fetch weather from FastAPI Backend
 */
async function fetchFromBackend(city) {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/v1/weather/current?city=${encodeURIComponent(city)}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3500)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.success) {
      return data;
    }
  } catch (e) {
    // Backend unavailable or timed out, will fall back
  }
  return null;
}

/**
 * Direct Open-Meteo Weather Fetcher
 */
export async function fetchWeatherDirect(city) {
  // Step 1: Geocoding
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) throw new Error(`Geocoding server error (${geoRes.status})`);
  const geoJson = await geoRes.json();

  if (!geoJson.results || geoJson.results.length === 0) {
    throw new Error(`Location "${city}" was not found. Please check spelling.`);
  }

  const { name, country, admin1, latitude, longitude, timezone } = geoJson.results[0];
  return fetchWeatherByCoords(latitude, longitude, name, country, admin1, timezone);
}

/**
 * Fetch Weather by Coordinates (with Open-Meteo direct + Air Quality)
 */
export async function fetchWeatherByCoords(latitude, longitude, overrideName = null, overrideCountry = null, overrideRegion = null, timezone = 'auto') {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
    `&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,uv_index` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max` +
    `&timezone=${encodeURIComponent(timezone || 'auto')}`;

  const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}` +
    `&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

  const [weatherRes, airRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(airUrl).catch(() => null)
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather data service returned error (${weatherRes.status})`);
  }

  const wData = await weatherRes.json();
  const current = wData.current || {};
  const daily = wData.daily || {};
  const hourly = wData.hourly || {};

  let airQuality = {
    european_aqi: 24,
    pm2_5: 7.2,
    pm10: 12.8,
    no2: 14.5,
    so2: 3.1,
    o3: 42.0,
    quality_label: 'Good'
  };

  if (airRes && airRes.ok) {
    try {
      const aData = await airRes.json();
      const aCur = aData.current || {};
      const eAqi = Math.round(aCur.european_aqi || 25);
      const aqiInfo = getAqiDescription(eAqi);
      airQuality = {
        european_aqi: eAqi,
        pm2_5: aCur.pm2_5 ? Math.round(aCur.pm2_5 * 10) / 10 : 7.2,
        pm10: aCur.pm10 ? Math.round(aCur.pm10 * 10) / 10 : 12.8,
        no2: aCur.nitrogen_dioxide ? Math.round(aCur.nitrogen_dioxide * 10) / 10 : 14.5,
        so2: aCur.sulphur_dioxide ? Math.round(aCur.sulphur_dioxide * 10) / 10 : 3.1,
        o3: aCur.ozone ? Math.round(aCur.ozone * 10) / 10 : 42.0,
        quality_label: aqiInfo.label
      };
    } catch (e) {
      // fallback to baseline
    }
  }

  const code = current.weather_code ?? 0;
  const codeInfo = getWeatherInfo(code);

  const tempC = Math.round(current.temperature_2m * 10) / 10;
  const feelsLikeC = Math.round(current.apparent_temperature * 10) / 10;
  const humidity = Math.round(current.relative_humidity_2m || 0);
  const dewPointC = calculateDewPoint(tempC, humidity);

  // Hourly (next 24 hours starting from current time)
  const hourlyForecast = [];
  if (hourly.time && hourly.time.length > 0) {
    const curTimeStr = current.time || '';
    let startIdx = 0;
    for (let i = 0; i < hourly.time.length; i++) {
      if (hourly.time[i] >= curTimeStr) {
        startIdx = i;
        break;
      }
    }
    const maxItems = Math.min(startIdx + 24, hourly.time.length);
    for (let i = startIdx; i < maxItems; i++) {
      const hCode = hourly.weather_code ? hourly.weather_code[i] : code;
      const hInfo = getWeatherInfo(hCode);
      hourlyForecast.push({
        rawTime: hourly.time[i],
        time: formatHourShort(hourly.time[i]),
        display_time: formatTime12h(hourly.time[i]),
        temp_c: Math.round(hourly.temperature_2m[i]),
        condition: hInfo.label,
        category: hInfo.category,
        icon: hInfo.icon,
        precip_probability: hourly.precipitation_probability ? hourly.precipitation_probability[i] || 0 : 0,
        humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : humidity,
        wind_speed_kmh: hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[i]) : 0,
        uv_index: hourly.uv_index ? Math.round(hourly.uv_index[i] * 10) / 10 : 0,
        visibility_km: hourly.visibility ? Math.round((hourly.visibility[i] / 1000) * 10) / 10 : 10
      });
    }
  }

  // Daily (7 days)
  const dailyForecast = [];
  if (daily.time && daily.time.length > 0) {
    const maxDays = Math.min(7, daily.time.length);
    for (let i = 0; i < maxDays; i++) {
      const dCode = daily.weather_code ? daily.weather_code[i] : code;
      const dInfo = getWeatherInfo(dCode);
      const dDate = daily.time[i];
      const parsedD = new Date(dDate);
      dailyForecast.push({
        date: dDate,
        day_name: i === 0 ? 'Today' : parsedD.toLocaleDateString([], { weekday: 'short' }),
        formatted_date: formatShortDate(dDate),
        temp_max_c: Math.round(daily.temperature_2m_max[i]),
        temp_min_c: Math.round(daily.temperature_2m_min[i]),
        condition: dInfo.label,
        category: dInfo.category,
        icon: dInfo.icon,
        precipitation_mm: daily.precipitation_sum ? Math.round(daily.precipitation_sum[i] * 10) / 10 : 0,
        precip_probability: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
        wind_max_kmh: daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[i]) : 0,
        uv_index_max: daily.uv_index_max ? Math.round(daily.uv_index_max[i] * 10) / 10 : 3
      });
    }
  }

  // Sunrise & Sunset
  const sunriseIso = (daily.sunrise && daily.sunrise[0]) ? daily.sunrise[0] : '';
  const sunsetIso = (daily.sunset && daily.sunset[0]) ? daily.sunset[0] : '';

  // Determine Daylight Progress percentage
  let daylightProgress = 50;
  if (sunriseIso && sunsetIso) {
    const now = Date.now();
    const rise = new Date(sunriseIso).getTime();
    const set = new Date(sunsetIso).getTime();
    if (now < rise) daylightProgress = 0;
    else if (now > set) daylightProgress = 100;
    else daylightProgress = Math.round(((now - rise) / (set - rise)) * 100);
  }

  // UV index
  const uvIndex = daily.uv_index_max && daily.uv_index_max[0] ? daily.uv_index_max[0] : 3.5;

  return {
    success: true,
    city: overrideName || 'Selected Location',
    country: overrideCountry || '',
    region: overrideRegion || '',
    latitude: Number(latitude).toFixed(2),
    longitude: Number(longitude).toFixed(2),
    temperature_c: tempC,
    temperature_f: Math.round(tempC * 9 / 5 + 32),
    feels_like_c: feelsLikeC,
    feels_like_f: Math.round(feelsLikeC * 9 / 5 + 32),
    temp_max_c: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[0]) : tempC + 3,
    temp_min_c: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[0]) : tempC - 3,
    temp_max_f: Math.round((daily.temperature_2m_max ? daily.temperature_2m_max[0] : tempC + 3) * 9 / 5 + 32),
    temp_min_f: Math.round((daily.temperature_2m_min ? daily.temperature_2m_min[0] : tempC - 3) * 9 / 5 + 32),
    condition: codeInfo.label,
    category: codeInfo.category,
    icon: codeInfo.icon,
    weather_code: code,
    humidity: humidity,
    dew_point_c: dewPointC,
    wind_speed_kmh: Math.round(current.wind_speed_10m || 0),
    wind_direction_deg: current.wind_direction_10m || 0,
    wind_gusts_kmh: Math.round(current.wind_gusts_10m || current.wind_speed_10m || 0),
    pressure_hpa: Math.round(current.surface_pressure || 1013),
    cloud_cover: current.cloud_cover ?? 40,
    precipitation_mm: current.precipitation || 0,
    uv_index: uvIndex,
    visibility_km: 10,
    is_day: current.is_day !== 0,
    sunrise: sunriseIso ? formatTime12h(sunriseIso) : '06:30 AM',
    sunset: sunsetIso ? formatTime12h(sunsetIso) : '06:45 PM',
    sunrise_raw: sunriseIso,
    sunset_raw: sunsetIso,
    daylight_progress: daylightProgress,
    hourly_forecast: hourlyForecast,
    daily_forecast: dailyForecast,
    air_quality: airQuality,
    last_updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    source: 'Open-Meteo REST'
  };
}

/**
 * Unified Main Weather Fetcher
 */
export async function getWeatherData(city) {
  // 1. Try backend service first
  const backendData = await fetchFromBackend(city);
  if (backendData && backendData.success) {
    // Fill in any fields for rich UI
    const code = backendData.weather_code ?? 0;
    const codeInfo = getWeatherInfo(code);
    return {
      ...backendData,
      category: codeInfo.category,
      icon: codeInfo.icon,
      condition: backendData.condition || codeInfo.label,
      temperature_f: Math.round(backendData.temperature_c * 9 / 5 + 32),
      feels_like_f: Math.round((backendData.feels_like_c ?? backendData.temperature_c) * 9 / 5 + 32),
      temp_max_f: Math.round(backendData.temp_max_c * 9 / 5 + 32),
      temp_min_f: Math.round(backendData.temp_min_c * 9 / 5 + 32),
      dew_point_c: calculateDewPoint(backendData.temperature_c, backendData.humidity || 50),
      air_quality: backendData.air_quality || {
        european_aqi: 24,
        pm2_5: 7.2,
        pm10: 12.8,
        no2: 14.5,
        so2: 3.1,
        o3: 42.0,
        quality_label: 'Good'
      },
      uv_index: 4,
      visibility_km: 10,
      daylight_progress: 55,
      last_updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      source: 'WeatherWise Backend'
    };
  }

  // 2. Direct Open-Meteo fallback
  return fetchWeatherDirect(city);
}

/**
 * Search city suggestions for autocomplete
 */
export async function searchCitySuggestions(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map(r => ({
      name: r.name,
      country: r.country,
      region: r.admin1,
      latitude: r.latitude,
      longitude: r.longitude
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Compare two cities
 */
export async function compareCitiesData(city1, city2) {
  // Check backend compare endpoint first
  try {
    const res = await fetch(`${BACKEND_BASE}/api/v1/weather/compare?city1=${encodeURIComponent(city1)}&city2=${encodeURIComponent(city2)}`, {
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.city1 && data.city2) {
        return {
          c1: data.city1,
          c2: data.city2,
          diffTemp: Math.abs(data.delta.temperature_diff_c),
          diffHumidity: Math.abs(data.delta.humidity_diff),
          warmer: data.delta.warmer_city
        };
      }
    }
  } catch (e) {
    // backend unavailable, fallback
  }

  // Fallback to parallel direct fetch
  const [d1, d2] = await Promise.all([
    getWeatherData(city1),
    getWeatherData(city2)
  ]);

  const diffTemp = Math.round(Math.abs(d1.temperature_c - d2.temperature_c) * 10) / 10;
  const diffHumidity = Math.abs(d1.humidity - d2.humidity);
  const warmer = d1.temperature_c > d2.temperature_c ? d1.city : d2.temperature_c > d1.temperature_c ? d2.city : 'Equal';

  return {
    c1: d1,
    c2: d2,
    diffTemp,
    diffHumidity,
    warmer
  };
}

/**
 * Favorites persistence (localStorage + sync backend)
 */
export function loadLocalFavorites() {
  try {
    const raw = localStorage.getItem('weatherwise_favorites');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return ['London', 'Tokyo', 'New York', 'Paris', 'Bangalore'];
}

export function saveLocalFavorites(list) {
  try {
    localStorage.setItem('weatherwise_favorites', JSON.stringify(list));
  } catch (e) {}
}

/**
 * Generate formatted plain-text intelligence report
 */
export function generateTextReport(data) {
  if (!data) return '';
  return `======================================================================
                     WEATHERWISE INTELLIGENCE REPORT
======================================================================
Target Location: ${data.city}, ${data.region ? data.region + ', ' : ''}${data.country}
Coordinates    : Lat ${data.latitude}°, Lon ${data.longitude}°
Data Source    : ${data.source || 'Open-Meteo REST Microservice'}
Generated At   : ${new Date().toLocaleString()}
----------------------------------------------------------------------
CURRENT ATMOSPHERIC PROFILE
----------------------------------------------------------------------
Condition      : ${data.condition}
Current Temp   : ${data.temperature_c} °C  |  ${data.temperature_f} °F
Apparent Temp  : ${data.feels_like_c} °C  (Feels Like)
Day Range      : High ${data.temp_max_c} °C  /  Low ${data.temp_min_c} °C
Relative Hum.  : ${data.humidity} %
Dew Point      : ${data.dew_point_c} °C
Wind Velocity  : ${data.wind_speed_kmh} km/h (Gusts: ${data.wind_gusts_kmh} km/h)
Barometer      : ${data.pressure_hpa} hPa
Sunrise / Set  : ${data.sunrise} / ${data.sunset}
----------------------------------------------------------------------
ATMOSPHERIC AIR QUALITY (EUROPEAN AQI)
----------------------------------------------------------------------
AQI Score      : ${data.air_quality ? data.air_quality.european_aqi : 'N/A'} (${data.air_quality ? data.air_quality.quality_label : 'Good'})
PM2.5          : ${data.air_quality ? data.air_quality.pm2_5 : 'N/A'} µg/m³
PM10           : ${data.air_quality ? data.air_quality.pm10 : 'N/A'} µg/m³
NO2            : ${data.air_quality ? data.air_quality.no2 : 'N/A'} µg/m³
O3             : ${data.air_quality ? data.air_quality.o3 : 'N/A'} µg/m³
======================================================================
               WeatherWise Real-time Weather Intelligence
======================================================================
`;
}

