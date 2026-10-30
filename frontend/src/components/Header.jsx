import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, GpsIcon, RefreshIcon, SettingsIcon, CloseIcon } from './WeatherIcons';
import { POPULAR_CITIES } from '../constants/weatherCodes';
import { searchCitySuggestions } from '../services/weatherApi';

export default function Header({
  cityInput,
  setCityInput,
  onSearch,
  onGeoLocation,
  geoLoading,
  unit,
  toggleUnit,
  theme,
  toggleTheme,
  onRefresh,
  refreshing,
  lastUpdated,
  onOpenSettings
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchContainerRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(cityInput);
    }, 280);
    return () => clearTimeout(handler);
  }, [cityInput]);

  // Fetch suggestions
  useEffect(() => {
    let active = true;
    if (debouncedQuery && debouncedQuery.trim().length >= 2) {
      searchCitySuggestions(debouncedQuery).then((results) => {
        if (active) {
          setSuggestions(results);
        }
      });
    } else {
      setSuggestions([]);
    }
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setShowSuggestions(false);
      onSearch(cityInput.trim());
    }
  };

  const selectSuggestion = (cityName) => {
    setCityInput(cityName);
    setShowSuggestions(false);
    onSearch(cityName);
  };

  return (
    <header className="app-header">
      {/* Brand Section */}
      <div className="brand-group">
        <div className="brand-logo-emblem" aria-hidden="true">
          <span className="brand-symbol">🌤️</span>
        </div>
        <div className="brand-titles">
          <div className="brand-name-row">
            <h1 className="brand-name">WeatherWise</h1>
            <span className="brand-version-badge">v3.0</span>
          </div>
          <p className="brand-tagline">Atmospheric Intelligence & Live Radar</p>
        </div>
      </div>

      {/* Dynamic Search & Location */}
      <div className="header-search-wrapper" ref={searchContainerRef}>
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-box">
            <span className="search-input-icon">
              <SearchIcon size={18} color="#5BA9E8" />
            </span>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search city, state or coordinates..."
              className="search-input"
              aria-label="Search city or location"
            />
            {cityInput && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setCityInput('')}
                aria-label="Clear search input"
              >
                <CloseIcon size={14} color="#718096" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="search-submit-btn"
            aria-label="Search weather for entered city"
          >
            <span>Search</span>
          </button>

          {/* Current Location Button */}
          <button
            type="button"
            onClick={onGeoLocation}
            className={`geo-btn ${geoLoading ? 'loading' : ''}`}
            title="Use current GPS location"
            aria-label="Use current location"
            disabled={geoLoading}
          >
            <GpsIcon size={17} color={geoLoading ? '#FFC66D' : '#5BA9E8'} />
            <span className="geo-btn-label">GPS</span>
          </button>
        </form>

        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && (
          <div className="search-dropdown-menu">
            {suggestions.length > 0 ? (
              <div className="dropdown-section">
                <div className="dropdown-section-title">Matching Locations</div>
                {suggestions.map((item, idx) => (
                  <button
                    key={`${item.name}-${item.latitude}-${idx}`}
                    className="dropdown-item"
                    type="button"
                    onClick={() => selectSuggestion(item.name)}
                  >
                    <span className="item-pin">📍</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-meta">
                      {item.region ? `${item.region}, ` : ''}{item.country}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="dropdown-section">
                <div className="dropdown-section-title">Popular Metropolises</div>
                <div className="popular-chips-grid">
                  {POPULAR_CITIES.slice(0, 6).map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      className="popular-chip"
                      onClick={() => selectSuggestion(city.name)}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Actions: Unit Toggle, Refresh, Theme & Settings */}
      <div className="header-controls">
        {/* Unit Toggle °C / °F */}
        <div className="unit-toggle-pill" role="group" aria-label="Temperature unit selection">
          <button
            type="button"
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => unit !== 'C' && toggleUnit()}
            aria-label="Set temperature unit to Celsius"
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => unit !== 'F' && toggleUnit()}
            aria-label="Set temperature unit to Fahrenheit"
          >
            °F
          </button>
        </div>

        {/* Theme Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="header-icon-btn"
          title={`Switch to ${theme === 'light' ? 'Deep Midnight Navy' : 'Atmospheric Cloud'} mode`}
          aria-label="Toggle theme mode"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Manual Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          className="header-icon-btn"
          title={`Refresh weather data (Last updated: ${lastUpdated || 'just now'})`}
          aria-label="Refresh current weather data"
          disabled={refreshing}
        >
          <RefreshIcon size={17} color="#5BA9E8" spinning={refreshing} />
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="header-icon-btn"
          title="WeatherWise Preferences & Settings"
          aria-label="Open settings modal"
        >
          <SettingsIcon size={17} color="#718096" />
        </button>
      </div>
    </header>
  );
}

