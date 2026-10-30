/**
 * WeatherWise — WMO Weather Interpretation Codes (WW)
 * Standardized meteorological condition mappings
 */

export const WEATHER_CODES = {
  0: { label: 'Clear Sky', category: 'clear', icon: '☀️', gradient: 'from-amber-400 to-sky-400' },
  1: { label: 'Mainly Clear', category: 'clear', icon: '🌤️', gradient: 'from-amber-300 to-sky-400' },
  2: { label: 'Partly Cloudy', category: 'partly_cloudy', icon: '⛅', gradient: 'from-sky-300 to-slate-400' },
  3: { label: 'Overcast', category: 'cloudy', icon: '☁️', gradient: 'from-slate-400 to-slate-600' },
  45: { label: 'Foggy', category: 'fog', icon: '🌫️', gradient: 'from-slate-300 to-slate-500' },
  48: { label: 'Depositing Rime Fog', category: 'fog', icon: '🌫️', gradient: 'from-slate-300 to-slate-500' },
  51: { label: 'Light Drizzle', category: 'drizzle', icon: '🌦️', gradient: 'from-teal-300 to-sky-500' },
  53: { label: 'Moderate Drizzle', category: 'drizzle', icon: '🌦️', gradient: 'from-teal-400 to-sky-600' },
  55: { label: 'Dense Drizzle', category: 'drizzle', icon: '🌧️', gradient: 'from-teal-500 to-sky-700' },
  56: { label: 'Light Freezing Drizzle', category: 'snow', icon: '🌨️', gradient: 'from-blue-200 to-slate-400' },
  57: { label: 'Dense Freezing Drizzle', category: 'snow', icon: '🌨️', gradient: 'from-blue-300 to-slate-500' },
  61: { label: 'Slight Rain', category: 'rain', icon: '🌧️', gradient: 'from-sky-400 to-blue-600' },
  63: { label: 'Moderate Rain', category: 'rain', icon: '🌧️', gradient: 'from-sky-500 to-blue-700' },
  65: { label: 'Heavy Rain', category: 'rain', icon: '⛈️', gradient: 'from-blue-600 to-slate-800' },
  66: { label: 'Light Freezing Rain', category: 'snow', icon: '🌨️', gradient: 'from-sky-300 to-slate-500' },
  67: { label: 'Heavy Freezing Rain', category: 'snow', icon: '🌨️', gradient: 'from-sky-400 to-slate-600' },
  71: { label: 'Slight Snow Fall', category: 'snow', icon: '🌨️', gradient: 'from-blue-100 to-slate-300' },
  73: { label: 'Moderate Snow Fall', category: 'snow', icon: '❄️', gradient: 'from-blue-200 to-slate-400' },
  75: { label: 'Heavy Snow Fall', category: 'snow', icon: '❄️', gradient: 'from-blue-300 to-slate-500' },
  77: { label: 'Snow Grains', category: 'snow', icon: '❄️', gradient: 'from-blue-200 to-slate-400' },
  80: { label: 'Slight Rain Showers', category: 'rain', icon: '🌦️', gradient: 'from-teal-400 to-sky-600' },
  81: { label: 'Moderate Rain Showers', category: 'rain', icon: '🌧️', gradient: 'from-sky-500 to-blue-700' },
  82: { label: 'Violent Rain Showers', category: 'rain', icon: '⛈️', gradient: 'from-blue-700 to-slate-900' },
  85: { label: 'Slight Snow Showers', category: 'snow', icon: '🌨️', gradient: 'from-blue-200 to-slate-400' },
  86: { label: 'Heavy Snow Showers', category: 'snow', icon: '❄️', gradient: 'from-blue-300 to-slate-500' },
  95: { label: 'Thunderstorm', category: 'thunder', icon: '⚡', gradient: 'from-amber-500 to-slate-900' },
  96: { label: 'Thunderstorm with Slight Hail', category: 'thunder', icon: '⛈️', gradient: 'from-amber-600 to-slate-900' },
  99: { label: 'Thunderstorm with Heavy Hail', category: 'thunder', icon: '⛈️', gradient: 'from-red-500 to-slate-950' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || {
    label: 'Partly Cloudy',
    category: 'partly_cloudy',
    icon: '⛅',
    gradient: 'from-sky-300 to-slate-400'
  };
}

export const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lon: 77.5946 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
  { name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194 }
];

