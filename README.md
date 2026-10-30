# WeatherWise — Atmospheric Intelligence & Weather Radar

> **Tagline:** *Atmospheric intelligence, elegantly presented.*  
> **Architecture:** React + Vite Web Application, Python FastAPI Production Microservice, and Python Tkinter Desktop Application.  
> **Data Provider:** Open-Meteo REST API (Live, global, zero API keys required).

---

## 1. Overview

**WeatherWise** is a full-stack weather intelligence application featuring:
- **Atmospheric React + Vite Web Application:** An atmospheric UI utilizing the custom WeatherWise palette (Deep Midnight Navy, Slate Blue, Sky Blue, Ice Blue, Cloud White, Teal, and Warm Sunshine) with Space Grotesk & DM Sans typography.
- **Dynamic Weather Animations:** Subtle floating cloud drift, gentle falling rain streaks, drifting snowflakes, and solar aura.
- **Meteorological Dashboards:** Real-time 24-hour hourly trend with SVG curve, 7-day extended outlook with relative span range bars, European Air Quality Index (AQI) with 5 WHO pollutants, Canvas-based Doppler Radar sweep, side-by-side city comparison with delta calculations, and formatted intelligence report generation.
- **Python FastAPI Backend:** Production microservice providing REST endpoints for current weather, forecasts, dual-city comparison, AQI breakdown, and report generation.
- **Python Tkinter Desktop Application:** Original multi-page desktop GUI and interactive terminal application.

---

## 2. Web Application Features

1. **🌤️ Atmospheric Dashboard:**
   - Deep Midnight Navy hero weather card with large expressive temperature typography in Space Grotesk.
   - Dynamic weather condition badge and custom animated SVG icon suite.
   - Daylight Arc Tracker: Real-time sunrise/sunset tracking with sun progress marker.
   - 8 atmospheric metric cards: Relative Humidity, Wind & Gusts, Barometric Pressure, European AQI, UV Radiation Index, Dew Point, Visibility, and Precipitation/Cloud Cover.

2. **🕒 24-Hour Atmospheric Trajectory:**
   - Horizontally scrollable hour-by-hour timeline.
   - Interactive SVG temperature trend curve with gradient fill and peak highlights.
   - Precipitation probabilities and hourly condition indicators.

3. **📅 7-Day Extended Outlook:**
   - Weekly forecast with daily highs, lows, and condition descriptions.
   - Relative temperature span range bars comparing daily variations against the week's range.

4. **🍃 Air Quality (AQI):**
   - European AQI gauge with WHO threshold evaluation (Good, Fair, Moderate, Poor, Very Poor).
   - Real-time concentration breakdown for PM2.5, PM10, NO₂, SO₂, and O₃ with actionable outdoor health advisories.

5. **📡 Doppler Radar Sweep:**
   - Interactive Canvas radar screen featuring 50km to 200km concentric distance rings.
   - Rotating sweep beam with azimuth readout, speed controls (0.5x, 1x, 2x), pause/resume, and dBZ reflectivity echo legend.

6. **⚖️ City Comparison:**
   - Side-by-side meteorological comparison of two locations.
   - Automatic delta metrics: temperature variance, humidity variance, and warmer city highlight.

7. **⭐ Bookmarked Locations:**
   - Saved cities stored in `localStorage` and synchronized with the backend.
   - One-click dashboard switching and bookmark removal.

8. **📄 Intelligence Report:**
   - Formatted plain-text meteorological bulletin preview.
   - One-click clipboard copy and `.txt` file download.

9. **⚙️ Preferences & Settings:**
   - Temperature unit toggle: Celsius (°C) and Fahrenheit (°F).
   - Wind velocity unit toggle: km/h and mph.
   - Visual theme switcher: Atmospheric Cloud Light vs. Deep Midnight Navy.
   - Animation toggle (Active vs. Reduced Motion).
   - Configurable auto-refresh interval (Off, 5m, 15m, 30m).

---

## 3. Tech Stack

- **Frontend:** React 18, Vite 5, Space Grotesk & DM Sans typography, Canvas API, Hardware-accelerated CSS keyframes.
- **Backend:** Python 3.11+, FastAPI, Uvicorn, Requests, Pydantic.
- **Deployment:** Vercel (Frontend), Render (FastAPI Backend).
- **Data Source:** Open-Meteo REST API & Geocoding Service (zero API keys needed).

---

## 4. Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### 1. Run the Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
The web dashboard opens at `http://localhost:5175`.

### 2. Run the FastAPI Backend (Optional)
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation available at `http://localhost:8000/docs`.

### 3. Run the Desktop Application (Tkinter)
```bash
python main.py
```

---

## 5. Deployment Guide

### Deploy Python FastAPI Backend on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect this GitHub repository.
3. Configure the service:
   - **Root Directory:** Leave blank (repository root) or `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `PYTHON_VERSION`: `3.11.9`
   - `CORS_ORIGINS`: `*` (or your Vercel deployment domain)
5. Verify deployment: visit `https://<your-render-app>.onrender.com/health`.

### Deploy React Frontend on Vercel
1. Import this repository into [Vercel](https://vercel.com).
2. Configure project settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Environment Variable:
   - `VITE_API_URL`: `https://<your-render-app>.onrender.com` (leave unset to use direct Open-Meteo API).
4. Deploy and verify.

---

## 6. License
MIT License. Created for WeatherWise Intelligence.
