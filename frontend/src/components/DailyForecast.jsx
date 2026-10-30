import React from 'react';
import { WeatherConditionIcon } from './WeatherIcons';

export default function DailyForecast({ dailyData = [], unit = 'C' }) {
  if (!dailyData || dailyData.length === 0) return null;

  // Calculate week's absolute min and max for relative range bar alignment
  const allMins = dailyData.map((d) => (unit === 'C' ? d.temp_min_c : Math.round(d.temp_min_c * 9 / 5 + 32)));
  const allMaxs = dailyData.map((d) => (unit === 'C' ? d.temp_max_c : Math.round(d.temp_max_c * 9 / 5 + 32)));
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const weekSpan = weekMax - weekMin || 1;

  return (
    <section className="daily-forecast-section" aria-label="7-Day Extended Outlook">
      <div className="section-header-compact">
        <div>
          <h3 className="section-title">7-Day Extended Outlook</h3>
          <p className="section-subtitle">Weekly temperature extremes and precipitation projections</p>
        </div>
        <span className="section-badge">Open-Meteo Multi-model</span>
      </div>

      <div className="daily-rows-list">
        {dailyData.map((day, idx) => {
          const minTemp = unit === 'C' ? day.temp_min_c : Math.round(day.temp_min_c * 9 / 5 + 32);
          const maxTemp = unit === 'C' ? day.temp_max_c : Math.round(day.temp_max_c * 9 / 5 + 32);

          // Calculate bar offsets
          const leftPercent = Math.max(0, Math.min(85, ((minTemp - weekMin) / weekSpan) * 100));
          const widthPercent = Math.max(12, Math.min(100 - leftPercent, ((maxTemp - minTemp) / weekSpan) * 100));

          return (
            <div key={day.date || idx} className="daily-row-card">
              {/* Day & Date */}
              <div className="daily-day-info">
                <span className={`daily-day-name ${idx === 0 ? 'today-highlight' : ''}`}>
                  {day.day_name}
                </span>
                <span className="daily-calendar-date">{day.formatted_date}</span>
              </div>

              {/* Icon & Condition */}
              <div className="daily-condition-block">
                <div className="daily-icon-box">
                  <WeatherConditionIcon category={day.category} size={30} />
                </div>
                <span className="daily-condition-label">{day.condition}</span>
              </div>

              {/* Rain Chance */}
              <div className="daily-precip-info">
                {day.precip_probability > 0 || day.precipitation_mm > 0 ? (
                  <span className="daily-rain-tag">
                    💧 {day.precip_probability}% ({day.precipitation_mm}mm)
                  </span>
                ) : (
                  <span className="daily-rain-tag zero">💧 0%</span>
                )}
              </div>

              {/* Min Temp */}
              <span className="daily-temp-min">{minTemp}°</span>

              {/* Relative Range Bar */}
              <div className="daily-range-bar-track">
                <div
                  className="daily-range-bar-fill"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`
                  }}
                />
              </div>

              {/* Max Temp */}
              <span className="daily-temp-max">{maxTemp}°</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

