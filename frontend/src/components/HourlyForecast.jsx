import React, { useRef, useState } from 'react';
import { WeatherConditionIcon } from './WeatherIcons';

export default function HourlyForecast({ hourlyData = [], unit = 'C' }) {
  const scrollRef = useRef(null);
  const [activeHourIndex, setActiveHourIndex] = useState(0);

  if (!hourlyData || hourlyData.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Convert temperatures if unit is F
  const temps = hourlyData.map((h) => (unit === 'C' ? h.temp_c : Math.round(h.temp_c * 9 / 5 + 32)));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  // Generate SVG Trend Line coordinates
  const svgWidth = Math.max(760, hourlyData.length * 76);
  const svgHeight = 64;
  const paddingX = 38;
  const stepX = (svgWidth - paddingX * 2) / (hourlyData.length - 1 || 1);

  const points = temps.map((t, idx) => {
    const x = paddingX + idx * stepX;
    // higher temp = smaller y (closer to top)
    const norm = (t - minTemp) / range;
    const y = svgHeight - 12 - norm * (svgHeight - 24);
    return { x, y, temp: t };
  });

  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <section className="hourly-forecast-section" aria-label="24-Hour Atmospheric Trajectory">
      <div className="section-header-compact">
        <div>
          <h3 className="section-title">24-Hour Atmospheric Trajectory</h3>
          <p className="section-subtitle">Real-time temperature trends and precipitation probability</p>
        </div>
        <div className="scroll-controls-group">
          <button
            type="button"
            className="scroll-arrow-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll hourly forecast left"
          >
            ‹
          </button>
          <button
            type="button"
            className="scroll-arrow-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll hourly forecast right"
          >
            ›
          </button>
        </div>
      </div>

      {/* SVG Temperature Curve Visual */}
      <div className="hourly-trend-svg-container">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="hourly-trend-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="tempCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5BA9E8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5BA9E8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#55C6B3" />
              <stop offset="50%" stopColor="#5BA9E8" />
              <stop offset="100%" stopColor="#FFC66D" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#tempCurveGrad)" />
          <path d={pathD} fill="none" stroke="url(#strokeGrad)" strokeWidth="3" strokeLinecap="round" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === activeHourIndex ? 5 : 3}
              fill={i === activeHourIndex ? '#FFC66D' : '#5BA9E8'}
              stroke="#101B2D"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      {/* Horizontally Scrollable Hour Cards */}
      <div className="hourly-cards-track" ref={scrollRef}>
        {hourlyData.map((h, idx) => {
          const tempVal = temps[idx];
          const isSelected = activeHourIndex === idx;

          return (
            <button
              key={`${h.rawTime || idx}`}
              type="button"
              className={`hourly-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setActiveHourIndex(idx)}
            >
              <span className="hourly-card-time">{idx === 0 ? 'Now' : h.time}</span>
              <div className="hourly-card-icon">
                <WeatherConditionIcon category={h.category} size={34} />
              </div>
              <span className="hourly-card-temp">{tempVal}°</span>

              {/* Rain Probability */}
              {h.precip_probability > 0 ? (
                <div className="hourly-precip-pill">
                  <span className="precip-drop">💧</span>
                  <span className="precip-pct">{h.precip_probability}%</span>
                </div>
              ) : (
                <div className="hourly-precip-pill dry">
                  <span className="precip-pct">0%</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

