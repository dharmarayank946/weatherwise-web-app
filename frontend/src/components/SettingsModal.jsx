import React from 'react';
import { CloseIcon } from './WeatherIcons';

export default function SettingsModal({
  isOpen,
  onClose,
  unit,
  setUnit,
  windUnit,
  setWindUnit,
  animationsEnabled,
  setAnimationsEnabled,
  theme,
  setTheme,
  autoRefreshMins,
  setAutoRefreshMins
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">WeatherWise Preferences</h3>
            <p className="modal-subtitle">Configure meteorological units and visual atmosphere</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <CloseIcon size={18} color="#718096" />
          </button>
        </div>

        <div className="settings-list">
          {/* Temperature Scale */}
          <div className="setting-row">
            <div>
              <div className="setting-label">Temperature Scale</div>
              <div className="setting-desc">Primary unit for ambient temperature displays</div>
            </div>
            <div className="setting-pill-options">
              <button
                type="button"
                className={`pill-option ${unit === 'C' ? 'active' : ''}`}
                onClick={() => setUnit('C')}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                className={`pill-option ${unit === 'F' ? 'active' : ''}`}
                onClick={() => setUnit('F')}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="setting-row">
            <div>
              <div className="setting-label">Wind Velocity Units</div>
              <div className="setting-desc">Velocity measurement format for gusts and breezes</div>
            </div>
            <div className="setting-pill-options">
              <button
                type="button"
                className={`pill-option ${windUnit === 'km/h' ? 'active' : ''}`}
                onClick={() => setWindUnit('km/h')}
              >
                km/h
              </button>
              <button
                type="button"
                className={`pill-option ${windUnit === 'mph' ? 'active' : ''}`}
                onClick={() => setWindUnit('mph')}
              >
                mph
              </button>
            </div>
          </div>

          {/* Visual Theme */}
          <div className="setting-row">
            <div>
              <div className="setting-label">Atmospheric Theme</div>
              <div className="setting-desc">Light cloud atmospheric palette or midnight contrast</div>
            </div>
            <div className="setting-pill-options">
              <button
                type="button"
                className={`pill-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                ☁️ Cloud Light
              </button>
              <button
                type="button"
                className={`pill-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                🌙 Midnight Navy
              </button>
            </div>
          </div>

          {/* Background Animations */}
          <div className="setting-row">
            <div>
              <div className="setting-label">Weather Animations</div>
              <div className="setting-desc">Floating clouds, rain streaks, and drifting snow</div>
            </div>
            <div className="setting-pill-options">
              <button
                type="button"
                className={`pill-option ${animationsEnabled ? 'active' : ''}`}
                onClick={() => setAnimationsEnabled(true)}
              >
                Active
              </button>
              <button
                type="button"
                className={`pill-option ${!animationsEnabled ? 'active' : ''}`}
                onClick={() => setAnimationsEnabled(false)}
              >
                Reduced Motion
              </button>
            </div>
          </div>

          {/* Auto Refresh */}
          <div className="setting-row">
            <div>
              <div className="setting-label">Auto-Refresh Interval</div>
              <div className="setting-desc">Background polling frequency for live meteorological feeds</div>
            </div>
            <div className="setting-pill-options">
              {[
                { val: 0, label: 'Off' },
                { val: 5, label: '5m' },
                { val: 15, label: '15m' },
                { val: 30, label: '30m' }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  className={`pill-option ${autoRefreshMins === opt.val ? 'active' : ''}`}
                  onClick={() => setAutoRefreshMins(opt.val)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="settings-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

