# SmartSheti 🌾 - Agricultural Decision Support Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://smartsheti-rho.vercel.app)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA-orange)](#progressive-web-app-pwa)
[![License](https://img.shields.io/badge/license-Educational-blue)](#license)

> **Empowering Maharashtra Farmers with Smart Agricultural Insights**

A comprehensive web-based platform that assists farmers with intelligent crop recommendations, real-time weather monitoring, and live market price information. Features multilingual support (English, Hindi, Marathi) and is accessible as a Progressive Web App for easy mobile access.

**🌐 Live Website:** [https://smartsheti-rho.vercel.app](https://smartsheti-rho.vercel.app)

---

## Overview

SmartSheti is a student project developed as part of Project Based Learning at MIT-ADT University. The platform integrates multiple agricultural data sources to provide farmers with crop recommendations, weather forecasts, and market price trends through a user-friendly web interface.

---

## Features

### Crop Recommendation System
- Provides crop suggestions based on user-inputted parameters (soil type, location, water availability)
- Uses a rule-based algorithm to match crops with local conditions
- Displays estimated profitability based on static market price data
- Limited to common crops grown in Maharashtra region

### Weather Information
- Integrates OpenWeatherMap API for current weather conditions
- Displays temperature, humidity, precipitation, and wind data
- Provides basic pest risk indicators based on weather conditions
- Location search functionality for Maharashtra districts and villages

### Market Price Tracking ⚡ **NEW: Multi-Source System**
- **✨ 4-source price aggregation** with intelligent fallback
  1. 🥇 data.gov.in API (Government authoritative data) - Priority 1
  2. 🥈 MandiPrices.com (Web scraping) - Priority 2
  3. 🥉 AgMarkNet HTML (Direct scraping fallback) - Priority 3
  4. 🔄 MSP Fallback (Minimum Support Price) - Last resort
- **⏰ Automated hourly updates** via Vercel cron jobs
- **📊 Confidence scoring** (0-100%) based on source reliability
- **🎯 Price prediction** using moving average algorithms
- Shows 8-week historical price trends with interactive charts
- Covers 20+ major crops: wheat, rice, cotton, onions, tomatoes, fruits
- Compares prices across 5+ APMC markets in Maharashtra
- **Real-time status badges:**
  - 🟢 LIVE Data (Confidence ≥90%)
  - 🔵 Recent Data (70-89%)
  - 🟡 Cached Data (50-69%)
  - ⚪ MSP/Estimate (<50%)

**📚 Documentation:**
- [Complete Overhaul Guide](MARKET_PRICE_OVERHAUL.md) - Full implementation details
- [Quick Start Guide](QUICK_START.md) - 5-minute deployment
- [API Documentation](#api-endpoints-new) - Endpoint reference

### Progressive Web App (PWA)
- Installable on mobile devices and desktop browsers
- Basic offline functionality through service worker caching
- Responsive design for mobile and desktop viewing

### Multilingual Interface
- Supports English, Hindi, and Marathi languages
- Uses combination of translation API and custom dictionary
- Manual language selection available

---

## Technical Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Tailwind CSS for styling
- Leaflet.js for mapping
- Material Icons
- Direct API integration with data.gov.in

**Deployment:**
- Vercel (Static Hosting)
- No backend required for core features

---

## Known Limitations and Issues

### Data Accuracy
- **Market prices** are fetched live from data.gov.in API (Government of India)
- **Weather data** is limited to OpenWeatherMap's free tier accuracy
- **Crop recommendations** use simplified rule-based logic rather than machine learning models

### Technical Constraints
- **API rate limits**: data.gov.in free API has request limitations
- **No database**: User data is stored locally, limiting personalization
- **Translation quality**: Automated translations may not be contextually accurate for agricultural terminology
- **No user authentication**: Cannot save user preferences or track individual farms

### User Experience
- **Limited offline functionality**: Only cached pages work offline; dynamic data requires internet connection
- **Mobile responsiveness**: Some pages may have layout issues on smaller screens
- **No notification system**: Cannot alert users about price changes or weather warnings
- **Limited crop database**: Covers only common Maharashtra crops, not region-specific varieties

### Development Status
- **Beta/Educational Project**: Built for learning purposes, not production-grade
- **Maintenance**: Limited ongoing development; data scrapers may break without regular updates
- **No warranty**: Recommendations should not be solely relied upon for financial decisions

---

## API Endpoints (NEW)

SmartSheti now provides a robust multi-source API for agricultural market prices.

### Base URL
```
Production: https://smartsheti-rho.vercel.app/api
Local: http://localhost:5000/api
```

### Endpoints

#### 1. Get Price for Single Crop
```http
GET /api/realprice/{crop}?state=Maharashtra
```
**Parameters:**
- `crop` (path) - Crop name (e.g., wheat, rice, tomato)
- `state` (query) - State name (default: Maharashtra)

**Response:**
```json
{
  "success": true,
  "crop": "wheat",
  "current_price": 24.5,
  "change_percentage": "+2.3%",
  "historical_prices": [22, 23, 23.5, 24, 24.5],
  "market_comparison": [...],
  "source": "data.gov.in API",
  "source_badge": "🟢 LIVE Data",
  "confidence": 95,
  "timestamp": "2026-02-10T09:30:00",
  "is_fallback": false
}
```

#### 2. Get Bulk Prices
```http
GET /api/prices/bulk?crops=wheat,rice,cotton&state=Maharashtra
```

#### 3. Get Markets for Crop
```http
GET /api/prices/markets/{crop}?state=Maharashtra
```

#### 4. Health Check
```http
GET /api/health
```

**Full API documentation:** See [MARKET_PRICE_OVERHAUL.md](MARKET_PRICE_OVERHAUL.md)

---

## Setup and Installation

### Quick Start (Recommended)

**See [QUICK_START.md](QUICK_START.md) for 5-minute deployment guide**

### Prerequisites
```bash
Python 3.8 or higher (Python 3.13+ recommended)
pip (Python package manager)
Git
Node.js (for Vercel deployment only)
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DhanushPillay/Smartsheti.git
cd farmer
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

**Dependencies include:**
- `requests` - HTTP client for API calls
- `beautifulsoup4` - HTML parsing for web scraping
- `Flask` - API framework (local development)
- `Flask-CORS` - CORS handling

3. **Initialize price data**
```bash
# Fetch initial prices from all sources
python consolidate_prices.py
```

4. **Test the multi-source scraper**
```bash
# Windows: Set UTF-8 encoding first
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Test scraper
python backend\python\multi_source_price_scraper.py wheat rice tomato
```

5. **Run backend API locally** (optional for testing)
```bash
python api/index.py
# API available at http://localhost:5000
```

6. **Serve the frontend**
```bash
# From the root directory
python -m http.server 8080
# Or use any static server
```

7. **Access the application**
```
Open browser: http://localhost:8080
Market Prices: http://localhost:8080/frontend/html/market-demand.html
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Your app will be live at: https://your-project.vercel.app
```

**Post-deployment:**
1. Verify cron job is enabled in Vercel dashboard
2. Check `/api/health` returns success
3. Test `/api/realprice/wheat` shows real prices
4. Monitor Vercel function logs for any errors

---

## Project Structure

```
farmer/
├── frontend/
│   ├── html/           # Web pages
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript modules
│   └── assets/         # Images and static files
├── backend/
│   ├── api/            # Flask API endpoints
│   ├── python/         # Data scraping scripts
│   └── prices.json     # Market price data store
├── data/
│   ├── json/           # Static data files
│   └── csv/            # CSV data exports
├── docs/               # Documentation files
├── index.html          # Main entry point
├── manifest.json       # PWA manifest
└── service-worker.js   # Service worker for PWA
```

---

## Data Sources

- **Weather Data**: OpenWeatherMap API (free tier)
- **Market Prices**: data.gov.in API (Government of India - live data)
- **Geographic Data**: Manual compilation of Maharashtra districts and talukas
- **Translation**: MyMemory Translation API + custom dictionary

**Note**: Market prices are fetched live from government API when internet is available.

---

## Development Team

**Developers:** Dhanush Pillay, Shubhangini Dixit  
**Institution:** MIT-ADT University  
**Project Type:** Academic Project (Project Based Learning)  
**Year:** 2024-2025

---

## Disclaimer

This is an educational project developed for learning purposes. The agricultural recommendations, market prices, and weather predictions provided by this platform are based on limited data sources and simplified algorithms. 

**Important:**
- Do not make significant financial or agricultural decisions based solely on this platform
- Always consult with local agricultural experts and extension officers
- Market prices shown may not reflect real-time values
- Weather forecasts are subject to third-party API accuracy
- The developers assume no liability for decisions made using this platform

---

## License

This project is developed for educational purposes. Please contact the developers for usage permissions.

---

## Future Improvements Needed

- Implement proper database for dynamic data management
- Develop machine learning models for crop recommendations
- Add user authentication and personalized farm profiles
- Implement push notifications for price alerts
- Expand crop database with regional varieties
- Improve translation accuracy for agricultural terms
- Add soil testing integration
- Develop mobile native applications for better offline support
