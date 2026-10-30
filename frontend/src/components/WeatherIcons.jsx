import React from 'react';

/**
 * Animated Weather Condition Icon Router
 */
export function WeatherConditionIcon({ category = 'partly_cloudy', size = 48, className = '' }) {
  switch (category) {
    case 'clear':
      return <SunIcon size={size} className={className} />;
    case 'partly_cloudy':
      return <PartlyCloudyIcon size={size} className={className} />;
    case 'cloudy':
      return <CloudIcon size={size} className={className} />;
    case 'drizzle':
      return <DrizzleIcon size={size} className={className} />;
    case 'rain':
      return <RainIcon size={size} className={className} />;
    case 'thunder':
      return <ThunderIcon size={size} className={className} />;
    case 'snow':
      return <SnowIcon size={size} className={className} />;
    case 'fog':
      return <FogIcon size={size} className={className} />;
    default:
      return <PartlyCloudyIcon size={size} className={className} />;
  }
}

// ☀️ Clear Sun Icon with subtle rotating rays
export function SunIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`weather-icon-sun ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="60%" stopColor="#FFC66D" />
          <stop offset="100%" stopColor="#FFA000" />
        </radialGradient>
        <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Sun Rays */}
      <g className="anim-sun-rays" stroke="#FFC66D" strokeWidth="3" strokeLinecap="round">
        <line x1="32" y1="6" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="58" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
      </g>
      {/* Sun Core */}
      <circle cx="32" cy="32" r="16" fill="url(#sunGrad)" filter="url(#sunGlow)" />
    </svg>
  );
}

// ⛅ Partly Cloudy
export function PartlyCloudyIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`weather-icon-partly ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunBehind" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="100%" stopColor="#FFC66D" />
        </radialGradient>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCEFFC" />
        </linearGradient>
      </defs>
      {/* Sun behind */}
      <g className="anim-sun-behind">
        <circle cx="24" cy="24" r="13" fill="url(#sunBehind)" />
        <line x1="24" y1="5" x2="24" y2="8" stroke="#FFC66D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="24" x2="11" y2="24" stroke="#FFC66D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="11" y1="11" x2="13.5" y2="13.5" stroke="#FFC66D" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Soft foreground cloud */}
      <path
        d="M26 48h22a10 10 0 0 0 1.2-19.9 14 14 0 0 0-25.2-4.5A11 11 0 0 0 16 34a11 11 0 0 0 10 14z"
        fill="url(#cloudGrad)"
        stroke="#5BA9E8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ☁️ Overcast Cloud
export function CloudIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`weather-icon-cloud ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cloudOvercast" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F7FAFD" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      <path
        d="M22 46h24a12 12 0 0 0 2-23.8 17 17 0 0 0-30.8-5.2A13 13 0 0 0 10 29a13 13 0 0 0 12 17z"
        fill="url(#cloudOvercast)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// 🌧️ Rain with animated droplets
export function RainIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`weather-icon-rain ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <path
        d="M20 38h24a10 10 0 0 0 1.5-19.8 14 14 0 0 0-25.5-4.2A11 11 0 0 0 10 24a11 11 0 0 0 10 14z"
        fill="url(#rainCloud)"
        stroke="#64748B"
        strokeWidth="1.5"
      />
      {/* Animated Rain Drops */}
      <line x1="20" y1="44" x2="17" y2="52" stroke="#5BA9E8" strokeWidth="2.5" strokeLinecap="round" className="anim-raindrop d1" />
      <line x1="28" y1="44" x2="25" y2="54" stroke="#55C6B3" strokeWidth="2.5" strokeLinecap="round" className="anim-raindrop d2" />
      <line x1="36" y1="44" x2="33" y2="52" stroke="#5BA9E8" strokeWidth="2.5" strokeLinecap="round" className="anim-raindrop d3" />
      <line x1="44" y1="44" x2="41" y2="54" stroke="#55C6B3" strokeWidth="2.5" strokeLinecap="round" className="anim-raindrop d4" />
    </svg>
  );
}

// 🌦️ Drizzle
export function DrizzleIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`weather-icon-drizzle ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 38h24a10 10 0 0 0 1.5-19.8 14 14 0 0 0-25.5-4.2A11 11 0 0 0 10 24a11 11 0 0 0 10 14z"
        fill="#E0F2FE"
        stroke="#5BA9E8"
        strokeWidth="1.5"
      />
      <circle cx="22" cy="46" r="1.5" fill="#55C6B3" className="anim-drizzle d1" />
      <circle cx="32" cy="48" r="1.5" fill="#5BA9E8" className="anim-drizzle d2" />
      <circle cx="42" cy="46" r="1.5" fill="#55C6B3" className="anim-drizzle d3" />
    </svg>
  );
}

// ⚡ Thunderstorm
export function ThunderIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`weather-icon-thunder ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 36h24a10 10 0 0 0 1.5-19.8 14 14 0 0 0-25.5-4.2A11 11 0 0 0 10 22a11 11 0 0 0 10 14z"
        fill="#334155"
        stroke="#1E293B"
        strokeWidth="1.5"
      />
      {/* Lightning Flash */}
      <polygon
        points="34,32 26,45 32,45 28,58 40,43 33,43"
        fill="#FFC66D"
        stroke="#FFA000"
        strokeWidth="1"
        className="anim-lightning"
      />
    </svg>
  );
}

// ❄️ Snow
export function SnowIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`weather-icon-snow ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 36h24a10 10 0 0 0 1.5-19.8 14 14 0 0 0-25.5-4.2A11 11 0 0 0 10 22a11 11 0 0 0 10 14z"
        fill="#F0F9FF"
        stroke="#BAE6FD"
        strokeWidth="1.5"
      />
      <g className="anim-snowflakes" fill="#38BDF8">
        <text x="18" y="48" fontSize="10">❄</text>
        <text x="28" y="54" fontSize="10">❄</text>
        <text x="38" y="48" fontSize="10">❄</text>
      </g>
    </svg>
  );
}

// 🌫️ Fog
export function FogIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`weather-icon-fog ${className}`} xmlns="http://www.w3.org/2000/svg">
      <line x1="16" y1="24" x2="48" y2="24" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" className="anim-fog-1" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" className="anim-fog-2" />
      <line x1="18" y1="40" x2="46" y2="40" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" className="anim-fog-3" />
      <line x1="14" y1="48" x2="50" y2="48" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" className="anim-fog-4" />
    </svg>
  );
}

// ==========================================
// Atmospheric UI Icons
// ==========================================

export function ThermometerIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

export function DropletIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export function WindIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}

export function BarometerIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
      <path d="M8 12a4 4 0 0 1 8 0" strokeDasharray="2 2" />
    </svg>
  );
}

export function SunriseIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0" />
      <path d="M12 2v7" />
      <path d="M4.93 10.93l1.41 1.41" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="M19.07 10.93l-1.41 1.41" />
      <path d="M22 22H2" />
      <path d="M8 6l4-4 4 4" />
    </svg>
  );
}

export function SunsetIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0" />
      <path d="M12 9v7" />
      <path d="M4.93 10.93l1.41 1.41" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="M19.07 10.93l-1.41 1.41" />
      <path d="M22 22H2" />
      <path d="M16 12l-4 4-4-4" />
    </svg>
  );
}

export function AqiLeafIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function UvSunIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function EyeIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function GpsIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

export function SearchIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function StarIcon({ size = 18, filled = false, color = '#FFC66D' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function DownloadIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function RefreshIcon({ size = 18, color = 'currentColor', spinning = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={spinning ? 'spin-anim' : ''}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

export function SettingsIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function CloseIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

