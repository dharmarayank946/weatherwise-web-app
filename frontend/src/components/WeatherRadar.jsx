import React, { useRef, useEffect, useState } from 'react';

export default function WeatherRadar({ currentCity = 'London' }) {
  const canvasRef = useRef(null);
  const [radarSpeed, setRadarSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [azimuthDegrees, setAzimuthDegrees] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;
    let animId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = width / 2 - 24;

      // Dark atmospheric midnight canvas
      ctx.fillStyle = '#101B2D';
      ctx.fillRect(0, 0, width, height);

      // Radar Range Rings
      ctx.strokeStyle = 'rgba(91, 169, 232, 0.22)';
      ctx.lineWidth = 1.5;
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 4) * r, 0, Math.PI * 2);
        ctx.stroke();

        // Distance tags
        ctx.fillStyle = 'rgba(91, 169, 232, 0.6)';
        ctx.font = '10px "Space Grotesk", sans-serif';
        ctx.fillText(`${r * 50}km`, cx + 6, cy - (radius / 4) * r + 12);
      }

      // Compass Crosshairs
      ctx.strokeStyle = 'rgba(91, 169, 232, 0.25)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      // Cardinal direction labels
      ctx.fillStyle = '#5BA9E8';
      ctx.font = 'bold 12px "Space Grotesk", sans-serif';
      ctx.fillText('N', cx - 5, cy - radius - 6);
      ctx.fillText('S', cx - 4, cy + radius + 16);
      ctx.fillText('E', cx + radius + 8, cy + 4);
      ctx.fillText('W', cx - radius - 18, cy + 4);

      // Dynamic Precipitation Clusters (Echoes)
      const echoes = [
        { x: cx + 45, y: cy - 60, r: 28, color: 'rgba(85, 198, 179, 0.45)' },
        { x: cx + 55, y: cy - 50, r: 18, color: 'rgba(255, 198, 109, 0.55)' },
        { x: cx - 70, y: cy + 40, r: 35, color: 'rgba(85, 198, 179, 0.4)' },
        { x: cx - 60, y: cy + 45, r: 15, color: 'rgba(91, 169, 232, 0.55)' }
      ];

      echoes.forEach((e) => {
        const grad = ctx.createRadialGradient(e.x, e.y, 2, e.x, e.y, e.r);
        grad.addColorStop(0, e.color);
        grad.addColorStop(1, 'rgba(16, 27, 45, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Advance beam angle
      if (!isPaused) {
        angle = (angle + 0.03 * radarSpeed) % (Math.PI * 2);
        setAzimuthDegrees(Math.round((angle * 180) / Math.PI));
      }

      // Sweep Beam Gradient
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      sweepGrad.addColorStop(0, 'rgba(91, 169, 232, 0.4)');
      sweepGrad.addColorStop(1, 'rgba(91, 169, 232, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - 0.38, angle);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Sharp Leading Beam
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.strokeStyle = '#5BA9E8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [radarSpeed, isPaused]);

  return (
    <section className="weather-radar-section" aria-label="Live Doppler Radar Sweep">
      <div className="section-header-compact">
        <div>
          <h3 className="section-title">Doppler Radar Atmospheric Sweep</h3>
          <p className="section-subtitle">
            Target Station: {currentCity} • Azimuth: {azimuthDegrees}° • Range: 200 km
          </p>
        </div>
        <div className="radar-live-indicator">
          <span className="live-pulse-dot" />
          <span>LIVE SCAN</span>
        </div>
      </div>

      {/* Radar Canvas Frame */}
      <div className="radar-canvas-container">
        <div className="radar-canvas-halo">
          <canvas
            ref={canvasRef}
            width={380}
            height={380}
            className="radar-screen-canvas"
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="radar-controls-bar">
        <div className="radar-btn-group">
          <button
            type="button"
            className={`radar-control-btn ${!isPaused ? 'active' : ''}`}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            type="button"
            className={`radar-control-btn ${radarSpeed === 0.5 ? 'active' : ''}`}
            onClick={() => setRadarSpeed(0.5)}
          >
            0.5x
          </button>
          <button
            type="button"
            className={`radar-control-btn ${radarSpeed === 1 ? 'active' : ''}`}
            onClick={() => setRadarSpeed(1)}
          >
            1x
          </button>
          <button
            type="button"
            className={`radar-control-btn ${radarSpeed === 2 ? 'active' : ''}`}
            onClick={() => setRadarSpeed(2)}
          >
            2x
          </button>
        </div>

        {/* dBZ Reflectivity Legend */}
        <div className="radar-legend-row">
          <span className="legend-label">Echo dBZ:</span>
          <span className="legend-chip">
            <span className="chip-dot" style={{ backgroundColor: '#55C6B3' }} /> Light Rain (20 dBZ)
          </span>
          <span className="legend-chip">
            <span className="chip-dot" style={{ backgroundColor: '#FFC66D' }} /> Moderate Rain (35 dBZ)
          </span>
          <span className="legend-chip">
            <span className="chip-dot" style={{ backgroundColor: '#EF4444' }} /> Heavy Storm (50 dBZ)
          </span>
        </div>
      </div>
    </section>
  );
}

