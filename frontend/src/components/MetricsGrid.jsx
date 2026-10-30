import React from 'react';
import {
  DropletIcon,
  WindIcon,
  BarometerIcon,
  EyeIcon,
  AqiLeafIcon,
  UvSunIcon,
  ThermometerIcon
} from './WeatherIcons';
import { getAqiDescription } from '../services/weatherApi';

export default function MetricsGrid({ weather, unit = 'C', windUnit = 'km/h' }) {
  if (!weather) return null;

  // Unit conversions
  const windFactor = windUnit === 'mph' ? 0.621371 : 1;
  const windDisplay = Math.round(weather.wind_speed_kmh * windFactor);
  const gustsDisplay = Math.round((weather.wind_gusts_kmh || weather.wind_speed_kmh) * windFactor);
  const dewPointDisplay = unit === 'C' ? weather.dew_point_c : Math.round(weather.dew_point_c * 9 / 5 + 32);
  const tempUnit = `°${unit}`;

  // Humidity comfort
  const humidity = weather.humidity || 50;
  const humidityStatus = humidity < 30 ? 'Dry' : humidity <= 60 ? 'Optimal' : 'Humid';

  // Pressure evaluation
  const pressure = weather.pressure_hpa || 1013;
  const pressureStatus = pressure < 1005 ? 'Low' : pressure > 1022 ? 'High' : 'Normal';

  // UV evaluation
  const uv = weather.uv_index || 3;
  const uvRating = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Very High';
  const uvColor = uv <= 2 ? '#55C6B3' : uv <= 5 ? '#FFC66D' : uv <= 7 ? '#F97316' : '#EF4444';

  // AQI evaluation
  const aqiVal = weather.air_quality ? weather.air_quality.european_aqi : 25;
  const aqiInfo = getAqiDescription(aqiVal);

  const metrics = [
    {
      id: 'humidity',
      label: 'Relative Humidity',
      value: `${humidity}%`,
      sub: `${humidityStatus} atmosphere`,
      icon: <DropletIcon size={20} color="#5BA9E8" />,
      progress: humidity,
      progressColor: '#5BA9E8'
    },
    {
      id: 'wind',
      label: 'Wind & Gusts',
      value: `${windDisplay} ${windUnit}`,
      sub: `Gusts up to ${gustsDisplay} ${windUnit} • ${weather.wind_direction_deg || 0}°`,
      icon: <WindIcon size={20} color="#55C6B3" />,
      progress: Math.min(100, Math.round((windDisplay / 80) * 100)),
      progressColor: '#55C6B3'
    },
    {
      id: 'pressure',
      label: 'Barometric Pressure',
      value: `${pressure} hPa`,
      sub: `${pressureStatus} atmospheric weight`,
      icon: <BarometerIcon size={20} color="#FFC66D" />,
      progress: Math.min(100, Math.max(10, Math.round(((pressure - 960) / 80) * 100))),
      progressColor: '#FFC66D'
    },
    {
      id: 'aqi',
      label: 'Air Quality Index',
      value: `${aqiVal} AQI`,
      sub: `${aqiInfo.label} — WHO baseline`,
      icon: <AqiLeafIcon size={20} color={aqiInfo.color} />,
      progress: Math.min(100, aqiVal),
      progressColor: aqiInfo.color
    },
    {
      id: 'uv',
      label: 'UV Radiation Index',
      value: `${uv}`,
      sub: `${uvRating} solar exposure`,
      icon: <UvSunIcon size={20} color={uvColor} />,
      progress: Math.min(100, Math.round((uv / 11) * 100)),
      progressColor: uvColor
    },
    {
      id: 'dewpoint',
      label: 'Dew Point',
      value: `${dewPointDisplay}${tempUnit}`,
      sub: 'Condensation threshold',
      icon: <ThermometerIcon size={20} color="#5BA9E8" />,
      progress: Math.min(100, Math.max(10, Math.round(humidity * 0.9))),
      progressColor: '#5BA9E8'
    },
    {
      id: 'visibility',
      label: 'Atmospheric Visibility',
      value: `${weather.visibility_km || 10} km`,
      sub: 'Clear line of sight',
      icon: <EyeIcon size={20} color="#55C6B3" />,
      progress: 95,
      progressColor: '#55C6B3'
    },
    {
      id: 'cloud',
      label: 'Cloud Cover / Precip',
      value: `${weather.cloud_cover ?? 35}%`,
      sub: `${weather.precipitation_mm || 0} mm observed`,
      icon: <span style={{ fontSize: '18px' }}>☁️</span>,
      progress: weather.cloud_cover ?? 35,
      progressColor: '#718096'
    }
  ];

  return (
    <section className="metrics-grid-container" aria-label="Key meteorological observations">
      <div className="section-header-compact">
        <h3 className="section-title">Atmospheric Metrics</h3>
        <span className="section-badge">Live Sensor Data</span>
      </div>

      <div className="metrics-cards-grid">
        {metrics.map((m) => (
          <div key={m.id} className="metric-glass-card">
            <div className="metric-card-top">
              <div className="metric-icon-bubble">{m.icon}</div>
              <span className="metric-label">{m.label}</span>
            </div>

            <div className="metric-value-row">
              <div className="metric-number-display">{m.value}</div>
            </div>

            <div className="metric-subtext">{m.sub}</div>

            {/* Mini Progress Bar */}
            <div className="metric-progress-track">
              <div
                className="metric-progress-fill"
                style={{
                  width: `${m.progress}%`,
                  backgroundColor: m.progressColor
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

