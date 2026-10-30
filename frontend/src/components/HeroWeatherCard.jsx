import React, { useState } from 'react';
import { WeatherConditionIcon, StarIcon, DownloadIcon, SunriseIcon, SunsetIcon } from './WeatherIcons';

export default function HeroWeatherCard({
  weather,
  unit = 'C',
  isFavorite,
  onToggleFavorite,
  onDownloadReport,
  onShare
}) {
  const [copiedToast, setCopiedToast] = useState(false);

  if (!weather) return null;

  const currentTemp = unit === 'C' ? weather.temperature_c : weather.temperature_f;
  const feelsLike = unit === 'C' ? weather.feels_like_c : weather.feels_like_f;
  const maxTemp = unit === 'C' ? weather.temp_max_c : weather.temp_max_f;
  const minTemp = unit === 'C' ? weather.temp_min_c : weather.temp_min_f;
  const unitSymbol = `°${unit}`;

  const handleCopySummary = () => {
    const text = `🌤️ Weather in ${weather.city}, ${weather.country}: ${currentTemp}${unitSymbol}, ${weather.condition}. High: ${maxTemp}${unitSymbol} / Low: ${minTemp}${unitSymbol}. (Via WeatherWise)`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
      if (onShare) onShare();
    });
  };

  return (
    <div className="hero-weather-card">
      {/* Top Header: City info + Quick Action Buttons */}
      <div className="hero-card-header">
        <div className="hero-location-block">
          <div className="hero-city-row">
            <h2 className="hero-city-name">{weather.city}</h2>
            {weather.country && (
              <span className="hero-country-badge">{weather.country}</span>
            )}
            <button
              type="button"
              onClick={() => onToggleFavorite(weather.city)}
              className={`hero-favorite-btn ${isFavorite ? 'favorited' : ''}`}
              title={isFavorite ? 'Remove from saved locations' : 'Bookmark to saved locations'}
              aria-label="Bookmark this city"
            >
              <StarIcon size={22} filled={isFavorite} color={isFavorite ? '#FFC66D' : '#94A3B8'} />
            </button>
          </div>

          <p className="hero-meta-coords">
            {weather.region ? `${weather.region} • ` : ''}
            Lat {weather.latitude}°N, Lon {weather.longitude}°E • Live Open-Meteo Intelligence
          </p>
        </div>

        {/* Action Buttons */}
        <div className="hero-actions-group">
          <button
            type="button"
            onClick={handleCopySummary}
            className="hero-pill-btn"
            title="Share or copy weather summary"
          >
            <span>{copiedToast ? '✓ Copied!' : '📤 Share'}</span>
          </button>

          <button
            type="button"
            onClick={onDownloadReport}
            className="hero-pill-btn accent"
            title="Download formatted text report"
          >
            <DownloadIcon size={15} color="#5BA9E8" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Main Temperature & Icon Showcase */}
      <div className="hero-showcase-row">
        {/* Left: Weather Condition Icon + Dynamic Condition Tag */}
        <div className="hero-icon-container">
          <WeatherConditionIcon category={weather.category} size={92} />
        </div>

        {/* Center: Large Expressive Temperature */}
        <div className="hero-temp-block">
          <div className="hero-temp-display">
            <span className="hero-temp-number">{Math.round(currentTemp)}</span>
            <span className="hero-temp-degree">{unitSymbol}</span>
          </div>
          <div className="hero-condition-text">{weather.condition}</div>
        </div>

        {/* Right: High/Low & Feels Like Badges */}
        <div className="hero-metrics-summary">
          <div className="hero-summary-pill feels-like">
            <span className="pill-label">Apparent:</span>
            <span className="pill-val">Feels like {feelsLike}{unitSymbol}</span>
          </div>

          <div className="hero-summary-pill range">
            <span className="range-item high">
              <span className="range-arrow">▲</span> H: {maxTemp}{unitSymbol}
            </span>
            <span className="range-divider">•</span>
            <span className="range-item low">
              <span className="range-arrow">▼</span> L: {minTemp}{unitSymbol}
            </span>
          </div>

          <div className="hero-updated-label">
            Updated: {weather.last_updated || 'Just now'}
          </div>
        </div>
      </div>

      {/* Daylight Arc Tracker (Sunrise to Sunset Progress) */}
      <div className="daylight-arc-strip">
        <div className="daylight-node sunrise">
          <SunriseIcon size={18} color="#FFC66D" />
          <div className="daylight-text">
            <span className="daylight-label">Sunrise</span>
            <span className="daylight-time">{weather.sunrise || '06:30 AM'}</span>
          </div>
        </div>

        <div className="daylight-progress-track">
          <div className="daylight-track-line" />
          <div
            className="daylight-progress-fill"
            style={{ width: `${Math.max(5, Math.min(95, weather.daylight_progress || 50))}%` }}
          />
          <div
            className="daylight-sun-marker"
            style={{ left: `${Math.max(5, Math.min(95, weather.daylight_progress || 50))}%` }}
            title={`Sun Position: ${weather.daylight_progress}% of daylight elapsed`}
          >
            ☀️
          </div>
        </div>

        <div className="daylight-node sunset">
          <SunsetIcon size={18} color="#5BA9E8" />
          <div className="daylight-text">
            <span className="daylight-label">Sunset</span>
            <span className="daylight-time">{weather.sunset || '06:45 PM'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

