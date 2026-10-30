import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-container" aria-label="Loading atmospheric observations...">
      {/* Hero Skeleton */}
      <div className="skeleton-card hero-skeleton">
        <div className="skeleton-line title-line" />
        <div className="skeleton-line subtitle-line" />
        <div className="skeleton-hero-body">
          <div className="skeleton-circle" />
          <div className="skeleton-temp" />
          <div className="skeleton-pills-col">
            <div className="skeleton-pill" />
            <div className="skeleton-pill" />
          </div>
        </div>
        <div className="skeleton-line arc-line" />
      </div>

      {/* Metrics Grid Skeletons */}
      <div className="skeleton-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-card metric-skeleton">
            <div className="skeleton-line metric-title" />
            <div className="skeleton-line metric-val" />
            <div className="skeleton-line metric-sub" />
          </div>
        ))}
      </div>

      {/* Hourly Strip Skeleton */}
      <div className="skeleton-card hourly-skeleton">
        <div className="skeleton-line strip-title" />
        <div className="skeleton-strip-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-hour-cell" />
          ))}
        </div>
      </div>
    </div>
  );
}

