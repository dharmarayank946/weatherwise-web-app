import React, { useMemo } from 'react';

/**
 * Atmospheric Dynamic Weather Effects Overlay
 * Subtle, lightweight, hardware-accelerated CSS animations
 */
export default function WeatherEffects({ category = 'clear', enabled = true, isDay = true }) {
  if (!enabled) return null;

  // Rain Drops generator (memoized so positions don't jump every render)
  const raindrops = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.6 + Math.random() * 2).toFixed(1)}%`,
      delay: `${(Math.random() * 1.5).toFixed(2)}s`,
      duration: `${(0.7 + Math.random() * 0.4).toFixed(2)}s`,
      opacity: (0.35 + Math.random() * 0.4).toFixed(2),
      length: `${Math.floor(22 + Math.random() * 20)}px`
    }));
  }, []);

  // Snowflakes generator
  const snowflakes = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.2 + Math.random() * 3).toFixed(1)}%`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
      duration: `${(3 + Math.random() * 2.5).toFixed(2)}s`,
      size: `${Math.floor(4 + Math.random() * 6)}px`,
      opacity: (0.4 + Math.random() * 0.5).toFixed(2)
    }));
  }, []);

  const isRainy = category === 'rain' || category === 'drizzle' || category === 'thunder';
  const isSnowy = category === 'snow';
  const isCloudy = category === 'cloudy' || category === 'partly_cloudy' || isRainy;

  return (
    <div className="weather-effects-container" aria-hidden="true">
      {/* Gentle Floating Atmospheric Cloud Silhouettes */}
      {isCloudy && (
        <div className="floating-clouds-layer">
          <div className="drifting-cloud cloud-1" />
          <div className="drifting-cloud cloud-2" />
          <div className="drifting-cloud cloud-3" />
        </div>
      )}

      {/* Rain Effect */}
      {isRainy && (
        <div className="rain-effect-layer">
          {raindrops.map((drop) => (
            <span
              key={drop.id}
              className="raindrop-streak"
              style={{
                left: drop.left,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                opacity: drop.opacity,
                height: drop.length
              }}
            />
          ))}
        </div>
      )}

      {/* Snow Effect */}
      {isSnowy && (
        <div className="snow-effect-layer">
          {snowflakes.map((flake) => (
            <span
              key={flake.id}
              className="drifting-snowflake"
              style={{
                left: flake.left,
                animationDelay: flake.delay,
                animationDuration: flake.duration,
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity
              }}
            />
          ))}
        </div>
      )}

      {/* Clear Sky Warm Sunshine Radial Aura */}
      {category === 'clear' && isDay && (
        <div className="solar-glow-aura" />
      )}
    </div>
  );
}

