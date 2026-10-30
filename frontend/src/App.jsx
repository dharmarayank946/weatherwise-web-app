import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import WeatherEffects from './components/WeatherEffects';
import HeroWeatherCard from './components/HeroWeatherCard';
import MetricsGrid from './components/MetricsGrid';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import AirQualityCard from './components/AirQualityCard';
import WeatherRadar from './components/WeatherRadar';
import CityCompare from './components/CityCompare';
import FavoritesManager from './components/FavoritesManager';
import WeatherReportView from './components/WeatherReportView';
import SettingsModal from './components/SettingsModal';
import LoadingSkeleton from './components/LoadingSkeleton';

import {
  getWeatherData,
  fetchWeatherByCoords,
  loadLocalFavorites,
  saveLocalFavorites,
  generateTextReport
} from './services/weatherApi';

export default function App() {
  // Weather state
  const [cityInput, setCityInput] = useState('London');
  const [currentCity, setCurrentCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tab & Navigation
  const [activeTab, setActiveTab] = useState('overview');

  // User Preferences (with LocalStorage initializers)
  const [unit, setUnit] = useState(() => localStorage.getItem('ww_unit') || 'C');
  const [windUnit, setWindUnit] = useState(() => localStorage.getItem('ww_wind_unit') || 'km/h');
  const [theme, setTheme] = useState(() => localStorage.getItem('ww_theme') || 'light');
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem('ww_animations');
    return saved !== null ? saved === 'true' : true;
  });
  const [autoRefreshMins, setAutoRefreshMins] = useState(() => {
    const saved = localStorage.getItem('ww_autorefresh');
    return saved !== null ? Number(saved) : 15;
  });

  // Saved Favorites
  const [favorites, setFavorites] = useState(loadLocalFavorites);

  // Modals & Toasts
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('ww_unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('ww_wind_unit', windUnit);
  }, [windUnit]);

  useEffect(() => {
    localStorage.setItem('ww_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ww_animations', String(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('ww_autorefresh', String(autoRefreshMins));
  }, [autoRefreshMins]);

  useEffect(() => {
    saveLocalFavorites(favorites);
  }, [favorites]);

  // Toast notification helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Main weather fetcher
  const loadWeather = useCallback(async (cityName, isSilentRefresh = false) => {
    if (!isSilentRefresh) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    try {
      const data = await getWeatherData(cityName);
      if (data && data.success) {
        setWeatherData(data);
        setCurrentCity(data.city || cityName);
        setCityInput(data.city || cityName);
      } else {
        throw new Error(data?.error || `Could not fetch weather for "${cityName}"`);
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve weather observations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather('London');
  }, [loadWeather]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefreshMins || autoRefreshMins <= 0 || !currentCity) return;
    const intervalMs = autoRefreshMins * 60 * 1000;
    const timer = setInterval(() => {
      loadWeather(currentCity, true);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [autoRefreshMins, currentCity, loadWeather]);

  // Handle Geolocation (Current Location)
  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const data = await fetchWeatherByCoords(lat, lon, 'Current Location');
          setWeatherData(data);
          setCurrentCity(data.city);
          setCityInput(data.city);
          showToast(`📍 Location detected: ${data.city}`);
        } catch (err) {
          setError('Failed to resolve atmospheric conditions for your GPS location.');
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        showToast('Location access denied or unavailable.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Favorites management
  const toggleFavorite = (cityName) => {
    if (!cityName) return;
    if (favorites.includes(cityName)) {
      setFavorites(favorites.filter((c) => c !== cityName));
      showToast(`Removed "${cityName}" from saved locations.`);
    } else {
      setFavorites([...favorites, cityName]);
      showToast(`⭐ Saved "${cityName}" to bookmarks!`);
    }
  };

  const removeFavorite = (cityName) => {
    setFavorites(favorites.filter((c) => c !== cityName));
    showToast(`Removed "${cityName}" from saved locations.`);
  };

  const selectFavoriteCity = (cityName) => {
    setCityInput(cityName);
    loadWeather(cityName);
    setActiveTab('overview');
  };

  // Download Plain-Text Weather Report
  const handleDownloadReport = () => {
    if (!weatherData) return;
    const txt = generateTextReport(weatherData);
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weatherwise_${weatherData.city.toLowerCase().replace(/\s+/g, '_')}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📄 Meteorological report downloaded.');
  };

  return (
    <div className={`weatherwise-app-root ${theme}-theme`}>
      {/* Subtle Atmospheric Dynamic Weather Effects Overlay */}
      <WeatherEffects
        category={weatherData?.category || 'clear'}
        enabled={animationsEnabled}
        isDay={weatherData?.is_day !== false}
      />

      <div className="app-layout-shell">
        {/* Top Header */}
        <Header
          cityInput={cityInput}
          setCityInput={setCityInput}
          onSearch={(city) => loadWeather(city)}
          onGeoLocation={handleGeoLocation}
          geoLoading={geoLoading}
          unit={unit}
          toggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
          theme={theme}
          toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          onRefresh={() => loadWeather(currentCity, true)}
          refreshing={refreshing}
          lastUpdated={weatherData?.last_updated}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* Global Navigation Tabs */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          favoritesCount={favorites.length}
        />

        {/* Toast Notification */}
        {toast && (
          <div className="app-toast-banner" role="alert">
            {toast}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="app-error-alert" role="alert">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <strong>Observation Notice:</strong> {error}
            </div>
            <button
              type="button"
              className="error-retry-btn"
              onClick={() => loadWeather(currentCity)}
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="app-main-viewport">
          {/* Loading Skeleton */}
          {loading && <LoadingSkeleton />}

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {!loading && weatherData && activeTab === 'overview' && (
            <div className="tab-pane active fade-in-scale">
              {/* Hero Weather Display */}
              <HeroWeatherCard
                weather={weatherData}
                unit={unit}
                isFavorite={favorites.includes(weatherData.city)}
                onToggleFavorite={toggleFavorite}
                onDownloadReport={handleDownloadReport}
                onShare={() => showToast('Summary copied to clipboard!')}
              />

              {/* 8 Atmospheric Metrics */}
              <MetricsGrid
                weather={weatherData}
                unit={unit}
                windUnit={windUnit}
              />

              {/* Quick Hourly Forecast Snapshot */}
              <HourlyForecast
                hourlyData={weatherData.hourly_forecast}
                unit={unit}
              />

              {/* Quick 7-Day Forecast Snapshot */}
              <DailyForecast
                dailyData={weatherData.daily_forecast}
                unit={unit}
              />
            </div>
          )}

          {/* TAB 2: 24-HOUR HOURLY TRAJECTORY */}
          {!loading && weatherData && activeTab === 'hourly' && (
            <div className="tab-pane active fade-in-scale">
              <HourlyForecast
                hourlyData={weatherData.hourly_forecast}
                unit={unit}
              />
              <MetricsGrid
                weather={weatherData}
                unit={unit}
                windUnit={windUnit}
              />
            </div>
          )}

          {/* TAB 3: 7-DAY OUTLOOK */}
          {!loading && weatherData && activeTab === 'daily' && (
            <div className="tab-pane active fade-in-scale">
              <DailyForecast
                dailyData={weatherData.daily_forecast}
                unit={unit}
              />
            </div>
          )}

          {/* TAB 4: AIR QUALITY (AQI) */}
          {!loading && weatherData && activeTab === 'airquality' && (
            <div className="tab-pane active fade-in-scale">
              <AirQualityCard
                airQuality={weatherData.air_quality}
                city={weatherData.city}
              />
            </div>
          )}

          {/* TAB 5: DOPPLER RADAR */}
          {activeTab === 'radar' && (
            <div className="tab-pane active fade-in-scale">
              <WeatherRadar currentCity={currentCity} />
            </div>
          )}

          {/* TAB 6: CITY COMPARE */}
          {activeTab === 'compare' && (
            <div className="tab-pane active fade-in-scale">
              <CityCompare
                unit={unit}
                defaultCity1={currentCity}
                defaultCity2={currentCity.toLowerCase() === 'london' ? 'Paris' : 'London'}
              />
            </div>
          )}

          {/* TAB 7: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="tab-pane active fade-in-scale">
              <FavoritesManager
                favorites={favorites}
                onSelectCity={selectFavoriteCity}
                onRemoveFavorite={removeFavorite}
                onAddCurrentCity={(city) => toggleFavorite(city)}
                currentCityName={weatherData?.city || currentCity}
              />
            </div>
          )}

          {/* TAB 8: INTELLIGENCE REPORT */}
          {!loading && weatherData && activeTab === 'report' && (
            <div className="tab-pane active fade-in-scale">
              <WeatherReportView
                weatherData={weatherData}
                onDownloadReport={handleDownloadReport}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <span className="footer-brand">WeatherWise Atmospheric Intelligence</span>
            <span className="footer-dot">•</span>
            <span>Real-time Open-Meteo REST & WMO Standard</span>
            <span className="footer-dot">•</span>
            <span>Zero API Keys Required</span>
          </div>
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        unit={unit}
        setUnit={setUnit}
        windUnit={windUnit}
        setWindUnit={setWindUnit}
        animationsEnabled={animationsEnabled}
        setAnimationsEnabled={setAnimationsEnabled}
        theme={theme}
        setTheme={setTheme}
        autoRefreshMins={autoRefreshMins}
        setAutoRefreshMins={setAutoRefreshMins}
      />
    </div>
  );
}
