import React, { useState } from 'react';
import { compareCitiesData } from '../services/weatherApi';
import { WeatherConditionIcon } from './WeatherIcons';

const PRESET_PAIRS = [
  { c1: 'London', c2: 'Paris' },
  { c1: 'Tokyo', c2: 'New York' },
  { c1: 'Dubai', c2: 'Singapore' },
  { c1: 'Sydney', c2: 'San Francisco' }
];

export default function CityCompare({ unit = 'C', defaultCity1 = 'London', defaultCity2 = 'Paris' }) {
  const [city1, setCity1] = useState(defaultCity1);
  const [city2, setCity2] = useState(defaultCity2);
  const [compareResult, setCompareResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRunCompare = async (c1Name = city1, c2Name = city2) => {
    if (!c1Name.trim() || !c2Name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await compareCitiesData(c1Name.trim(), c2Name.trim());
      setCompareResult(data);
    } catch (err) {
      setError(err.message || 'Failed to compare cities. Please verify the city names.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (pair) => {
    setCity1(pair.c1);
    setCity2(pair.c2);
    handleRunCompare(pair.c1, pair.c2);
  };

  const tempSymbol = `°${unit}`;

  return (
    <section className="city-compare-section" aria-label="Side-by-side Meteorological Comparison">
      <div className="section-header-compact">
        <div>
          <h3 className="section-title">Side-by-Side City Comparison</h3>
          <p className="section-subtitle">Dual-location atmospheric divergence and microclimate analysis</p>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="preset-pairs-row">
        <span className="preset-label">Quick Pairs:</span>
        {PRESET_PAIRS.map((p) => (
          <button
            key={`${p.c1}-${p.c2}`}
            type="button"
            className="preset-pair-chip"
            onClick={() => loadPreset(p)}
          >
            {p.c1} vs {p.c2}
          </button>
        ))}
      </div>

      {/* Input Fields & Action */}
      <div className="compare-form-row">
        <input
          type="text"
          value={city1}
          onChange={(e) => setCity1(e.target.value)}
          placeholder="First city (e.g. London)"
          className="compare-input"
          aria-label="First city to compare"
        />
        <span className="compare-vs-badge">VS</span>
        <input
          type="text"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
          placeholder="Second city (e.g. Paris)"
          className="compare-input"
          aria-label="Second city to compare"
        />
        <button
          type="button"
          onClick={() => handleRunCompare()}
          className="compare-submit-btn"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Compare Cities'}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="compare-error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* Results Presentation */}
      {compareResult && (
        <div className="compare-results-wrapper">
          {/* Delta Highlights Banner */}
          <div className="compare-delta-banner">
            <span className="delta-icon">🌡️</span>
            <span className="delta-headline">
              Temperature Variance: <strong>{compareResult.diffTemp}°C</strong>
            </span>
            <span className="delta-separator">•</span>
            <span className="delta-sub">
              {compareResult.warmer !== 'Equal' ? (
                <>
                  <strong style={{ color: '#FFC66D' }}>{compareResult.warmer}</strong> is noticeably warmer
                </>
              ) : (
                'Identical temperature observed in both cities'
              )}
            </span>
          </div>

          {/* Side by side comparison cards */}
          <div className="compare-cards-duo">
            {/* City 1 Card */}
            <div className={`compare-city-card ${compareResult.warmer === compareResult.c1.city ? 'warmer-card' : ''}`}>
              <div className="compare-card-header">
                <div>
                  <h4 className="compare-card-city">{compareResult.c1.city}</h4>
                  <span className="compare-card-country">{compareResult.c1.country}</span>
                </div>
                <WeatherConditionIcon category={compareResult.c1.category || 'partly_cloudy'} size={42} />
              </div>

              <div className="compare-temp-row">
                <span className="compare-big-temp">
                  {unit === 'C' ? compareResult.c1.temperature_c : Math.round(compareResult.c1.temperature_c * 9 / 5 + 32)}
                  {tempSymbol}
                </span>
                <span className="compare-condition">{compareResult.c1.condition}</span>
              </div>

              <div className="compare-metrics-list">
                <div className="compare-metric-row">
                  <span className="metric-name">💧 Humidity:</span>
                  <span className="metric-val">{compareResult.c1.humidity}%</span>
                </div>
                <div className="compare-metric-row">
                  <span className="metric-name">💨 Wind Speed:</span>
                  <span className="metric-val">{compareResult.c1.wind_speed_kmh} km/h</span>
                </div>
                <div className="compare-metric-row">
                  <span className="metric-name">⏲️ Pressure:</span>
                  <span className="metric-val">{compareResult.c1.pressure_hpa || 1013} hPa</span>
                </div>
              </div>
            </div>

            {/* City 2 Card */}
            <div className={`compare-city-card ${compareResult.warmer === compareResult.c2.city ? 'warmer-card' : ''}`}>
              <div className="compare-card-header">
                <div>
                  <h4 className="compare-card-city">{compareResult.c2.city}</h4>
                  <span className="compare-card-country">{compareResult.c2.country}</span>
                </div>
                <WeatherConditionIcon category={compareResult.c2.category || 'partly_cloudy'} size={42} />
              </div>

              <div className="compare-temp-row">
                <span className="compare-big-temp">
                  {unit === 'C' ? compareResult.c2.temperature_c : Math.round(compareResult.c2.temperature_c * 9 / 5 + 32)}
                  {tempSymbol}
                </span>
                <span className="compare-condition">{compareResult.c2.condition}</span>
              </div>

              <div className="compare-metrics-list">
                <div className="compare-metric-row">
                  <span className="metric-name">💧 Humidity:</span>
                  <span className="metric-val">{compareResult.c2.humidity}%</span>
                </div>
                <div className="compare-metric-row">
                  <span className="metric-name">💨 Wind Speed:</span>
                  <span className="metric-val">{compareResult.c2.wind_speed_kmh} km/h</span>
                </div>
                <div className="compare-metric-row">
                  <span className="metric-name">⏲️ Pressure:</span>
                  <span className="metric-val">{compareResult.c2.pressure_hpa || 1013} hPa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

