import React from 'react';
import { getAqiDescription } from '../services/weatherApi';

export default function AirQualityCard({ airQuality, city = 'Target City' }) {
  if (!airQuality) return null;

  const aqiVal = airQuality.european_aqi || 25;
  const aqiInfo = getAqiDescription(aqiVal);

  const pollutants = [
    {
      code: 'PM2.5',
      name: 'Fine Particulate Matter',
      value: airQuality.pm2_5,
      unit: 'µg/m³',
      limit: 15,
      desc: 'Microscopic particles that penetrate deep into lungs'
    },
    {
      code: 'PM10',
      name: 'Inhalable Particulate Matter',
      value: airQuality.pm10,
      unit: 'µg/m³',
      limit: 45,
      desc: 'Dust, pollen, and larger airborne particles'
    },
    {
      code: 'NO₂',
      name: 'Nitrogen Dioxide',
      value: airQuality.no2,
      unit: 'µg/m³',
      limit: 25,
      desc: 'Traffic combustion and urban emission gases'
    },
    {
      code: 'SO₂',
      name: 'Sulfur Dioxide',
      value: airQuality.so2,
      unit: 'µg/m³',
      limit: 40,
      desc: 'Industrial smelting and power station emissions'
    },
    {
      code: 'O₃',
      name: 'Surface Ozone',
      value: airQuality.o3,
      unit: 'µg/m³',
      limit: 100,
      desc: 'Formed when pollutants react with sunlight'
    }
  ];

  return (
    <section className="air-quality-container" aria-label="Atmospheric Air Quality & Health">
      <div className="section-header-compact">
        <div>
          <h3 className="section-title">Atmospheric Air Quality Index (AQI)</h3>
          <p className="section-subtitle">Real-time European AQI & WHO pollutant thresholds for {city}</p>
        </div>
        <span
          className="aqi-status-pill"
          style={{ backgroundColor: `${aqiInfo.color}25`, color: aqiInfo.color, borderColor: aqiInfo.color }}
        >
          ● {aqiInfo.label}
        </span>
      </div>

      {/* Hero AQI Meter Card */}
      <div className="aqi-hero-card">
        <div className="aqi-hero-left">
          <div className="aqi-score-badge" style={{ borderColor: aqiInfo.color }}>
            <span className="aqi-big-number" style={{ color: aqiInfo.color }}>{aqiVal}</span>
            <span className="aqi-score-label">European AQI</span>
          </div>

          <div className="aqi-rating-details">
            <h4 className="aqi-rating-title" style={{ color: aqiInfo.color }}>
              Air Quality is {aqiInfo.label}
            </h4>
            <p className="aqi-rating-narrative">{aqiInfo.text}</p>
          </div>
        </div>

        {/* Health Advisory Guidelines */}
        <div className="aqi-advisory-box">
          <div className="advisory-title">Health & Outdoor Advisory</div>
          <div className="advisory-items-list">
            <div className="advisory-item">
              <span className="advisory-icon">🏃</span>
              <span>
                {aqiVal <= 40 ? 'Outdoor exercise and sports are completely safe.' : 'Consider moderating high-intensity outdoor activities.'}
              </span>
            </div>
            <div className="advisory-item">
              <span className="advisory-icon">🪟</span>
              <span>
                {aqiVal <= 50 ? 'Safe to open windows for home atmospheric ventilation.' : 'Keep windows closed during peak traffic hours.'}
              </span>
            </div>
            <div className="advisory-item">
              <span className="advisory-icon">😷</span>
              <span>
                {aqiVal <= 60 ? 'No masks required for general public.' : 'Sensitive individuals should consider wearing filtration masks.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Pollutants Grid */}
      <div className="pollutants-grid">
        {pollutants.map((p) => {
          const ratio = p.value ? Math.min(100, Math.round((p.value / p.limit) * 100)) : 20;
          const isElevated = ratio > 100;
          const statusColor = isElevated ? '#EF4444' : ratio > 65 ? '#FFC66D' : '#55C6B3';

          return (
            <div key={p.code} className="pollutant-card">
              <div className="pollutant-top-row">
                <span className="pollutant-code">{p.code}</span>
                <span
                  className="pollutant-status-tag"
                  style={{ color: statusColor, backgroundColor: `${statusColor}18` }}
                >
                  {isElevated ? 'Elevated' : ratio > 65 ? 'Moderate' : 'Within Limits'}
                </span>
              </div>

              <div className="pollutant-name">{p.name}</div>

              <div className="pollutant-reading">
                <span className="pollutant-val">{p.value ?? '--'}</span>
                <span className="pollutant-unit">{p.unit}</span>
              </div>

              {/* Threshold Meter */}
              <div className="pollutant-bar-track">
                <div
                  className="pollutant-bar-fill"
                  style={{ width: `${Math.min(100, ratio)}%`, backgroundColor: statusColor }}
                />
              </div>

              <div className="pollutant-limit-note">
                WHO 24h Guideline: {p.limit} {p.unit}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

