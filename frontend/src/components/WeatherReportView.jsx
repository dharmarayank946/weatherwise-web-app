import React, { useState } from 'react';
import { generateTextReport } from '../services/weatherApi';
import { DownloadIcon } from './WeatherIcons';

export default function WeatherReportView({ weatherData, onDownloadReport }) {
  const [copied, setCopied] = useState(false);

  if (!weatherData) return null;

  const reportText = generateTextReport(weatherData);

  const handleCopy = () => {
    navigator.clipboard?.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section className="weather-report-section" aria-label="Weather Intelligence Report">
      <div className="section-header-compact">
        <div>
          <h3 className="section-title">Meteorological Intelligence Report</h3>
          <p className="section-subtitle">
            Formatted plain-text atmospheric bulletin for {weatherData.city}, {weatherData.country}
          </p>
        </div>

        <div className="report-actions-row">
          <button
            type="button"
            className="report-btn secondary"
            onClick={handleCopy}
          >
            <span>{copied ? '✓ Copied to Clipboard' : '📋 Copy Report'}</span>
          </button>

          <button
            type="button"
            className="report-btn primary"
            onClick={onDownloadReport}
          >
            <DownloadIcon size={16} color="#FFFFFF" />
            <span>Download .TXT File</span>
          </button>
        </div>
      </div>

      {/* Formatted Text Box */}
      <div className="report-pre-box">
        <pre className="report-pre-content">{reportText}</pre>
      </div>
    </section>
  );
}

