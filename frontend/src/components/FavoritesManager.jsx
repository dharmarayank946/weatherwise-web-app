import React from 'react';
import { StarIcon, CloseIcon } from './WeatherIcons';
import { POPULAR_CITIES } from '../constants/weatherCodes';

export default function FavoritesManager({
  favorites = [],
  onSelectCity,
  onRemoveFavorite,
  onAddCurrentCity,
  currentCityName
}) {
  const isCurrentSaved = favorites.includes(currentCityName);

  return (
    <section className="favorites-section" aria-label="Bookmarked Meteorological Locations">
      <div className="section-header-compact">
        <div>
          <h3 className="section-title">Saved Meteorological Locations</h3>
          <p className="section-subtitle">Quick-access pinned cities stored in your local atmospheric profile</p>
        </div>
        {!isCurrentSaved && currentCityName && (
          <button
            type="button"
            className="save-current-pill-btn"
            onClick={() => onAddCurrentCity(currentCityName)}
          >
            <StarIcon size={16} filled={false} color="#FFC66D" />
            <span>Pin "{currentCityName}"</span>
          </button>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="favorites-cards-grid">
          {favorites.map((cityName) => (
            <div key={cityName} className="favorite-card">
              <button
                type="button"
                className="favorite-city-btn"
                onClick={() => onSelectCity(cityName)}
                title={`Switch dashboard view to ${cityName}`}
              >
                <span className="favorite-pin">📍</span>
                <span className="favorite-name">{cityName}</span>
              </button>

              <button
                type="button"
                className="favorite-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(cityName);
                }}
                title={`Remove ${cityName} from favorites`}
                aria-label={`Remove ${cityName}`}
              >
                <CloseIcon size={16} color="#718096" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="favorites-empty-card">
          <span className="empty-star-icon">⭐</span>
          <h4 className="empty-title">No Bookmarked Cities Yet</h4>
          <p className="empty-desc">
            Bookmark any city by clicking the star icon in the main weather dashboard, or select one of these global stations:
          </p>
          <div className="empty-suggestions-row">
            {POPULAR_CITIES.slice(0, 5).map((c) => (
              <button
                key={c.name}
                type="button"
                className="suggestion-city-chip"
                onClick={() => onSelectCity(c.name)}
              >
                + {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

