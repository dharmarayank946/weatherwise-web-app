import React from 'react';

export default function Navigation({ activeTab, setActiveTab, favoritesCount = 0 }) {
  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: '🌤️' },
    { id: 'hourly', label: '24h Hourly', icon: '🕒' },
    { id: 'daily', label: '7-Day Outlook', icon: '📅' },
    { id: 'airquality', label: 'Air Quality (AQI)', icon: '🍃' },
    { id: 'radar', label: 'Doppler Radar', icon: '📡' },
    { id: 'compare', label: 'City Compare', icon: '⚖️' },
    { id: 'favorites', label: `Saved (${favoritesCount})`, icon: '⭐' },
    { id: 'report', label: 'Report', icon: '📄' },
  ];

  return (
    <nav className="app-nav-container" aria-label="Weather intelligence navigation">
      <div className="nav-tabs-track">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              role="tab"
              aria-selected={isActive}
            >
              <span className="nav-tab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="nav-tab-label">{tab.label}</span>
              {isActive && <span className="nav-tab-active-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

