# SmartSheti 🌾 - Agricultural Decision Support Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://smartsheti-rho.vercel.app)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA-orange)](#progressive-web-app-pwa)
[![License](https://img.shields.io/badge/license-Educational-blue)](#license)

> **Empowering Maharashtra Farmers with Smart Agricultural Insights**

A comprehensive web-based platform that assists farmers with intelligent crop recommendations, real-time weather monitoring, pest risk analysis, farm operations planning, and live market price information. Features multilingual support (English, Hindi, Marathi) and is accessible as a Progressive Web App for easy mobile access.

**🌐 Live Website:** [https://smartsheti-rho.vercel.app](https://smartsheti-rho.vercel.app)

---

## Overview

SmartSheti is a student project developed as part of Project Based Learning at MIT-ADT University. The platform integrates multiple agricultural data sources to provide farmers with comprehensive crop planning, weather forecasts, and market price trends through a user-friendly web interface powered by an advanced predictive Python backend.

---

## Features

### Advanced Crop Recommendation Engine
- Intelligent scoring based on temperature, soil compatibility, irrigation type, land size, and seasonal price factors
- Ensures diverse crop recommendations to avoid monoculture
- Calculates dynamic profitability using real-time market data (MSP or live market prices)
- Region-specific adaptations for Maharashtra's agroclimatic zones

### Comprehensive Pest Risk Analyzer (NEW)
- Advanced rule-engine evaluating current weather conditions against pest survival profiles (temperature, humidity, wind, rainfall)
- Assesses multi-factor relevance based on region, season, and affected crops
- Detects risks for major pests (e.g., Aphids, Whitefly, Stem Borer, Bollworm, Armyworm)
- Generates critical alerts and tailors prevention and treatment recommendations

### 7-Day Farm Operations Planner (NEW)
- Analyzes upcoming weather forecasts to recommend optimal days for critical activities (plowing, sowing, spraying, irrigation, harvesting)
- Uses precise weather constraints (e.g., wind speed for spraying, rainfall for harvesting)
- Highlights operation warnings for prolonged rain or extreme heat

### Market Price Tracking ⚡ **Multi-Source System**
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

### Weather Information
- Integrates OpenWeatherMap API for current weather conditions
- Displays temperature, humidity, precipitation, and wind data
- Location search functionality for Maharashtra districts and villages

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

**Backend & Data:**
- Python 3 with Flask (API Endpoints & Data Aggregation)
- SQLite (Local caching and data storage via `database.py`)
- Vercel Serverless Functions
- Web Scraping (BeautifulSoup4) for market prices

**Deployment:**
- Vercel (Frontend & Serverless Backend)

---

## Known Limitations and Issues

### Data Accuracy
- **Market prices** depend on external sources (data.gov.in, MandiPrices, AgMarkNet) which can have varying latency or availability
- **Weather data** relies on OpenWeatherMap's free tier accuracy
- **Price Predictions** utilize moving averages rather than deep learning models

### Technical Constraints
- **API rate limits**: external APIs like data.gov.in have request limits, mitigated via our caching layer
- **Local Database**: Currently uses SQLite for data caching, limiting cross-user personalization without a dedicated cloud database
- **Translation quality**: Automated translations may not be perfectly context-accurate for complex agricultural terminology
- **No user authentication**: Cannot save persistent user preferences or track individual farms across devices

### Development Status
- **Beta/Educational Project**: Built for learning purposes, not production-grade
- **Maintenance**: Limited ongoing development; data scrapers may break without regular updates
- **No warranty**: Recommendations should not be solely relied upon for financial decisions

---

## API Endpoints

SmartSheti provides a robust multi-source API for agricultural market prices.

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

**Full API documentation:** See [MARKET_PRICE_OVERHAUL.md](docs/MARKET_PRICE_OVERHAUL.md)

---

## Setup and Installation

### Quick Start (Recommended)

**See [QUICK_START.md](docs/QUICK_START.md) for 5-minute deployment guide**

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

3. **Initialize price data**
```bash
# Fetch initial prices from all sources
python scripts/python/consolidate_prices.py
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

---

## Project Structure

```
farmer/
├── api/
│   ├── index.py        # Vercel Serverless entry point
│   └── cron/           # Scheduled automation tasks
├── frontend/
│   ├── html/           # Web pages
│   ├── css/            # Stylesheets
│   ├── js/             # Core logic (Pest analysis, Crop Engine, etc.)
│   └── assets/         # Images and static files
├── backend/
│   ├── database.py     # SQLite DB configurations
│   └── python/         # Price predictors, scrapers, chart generators
├── data/               # Persistent data (SQLite db, JSON caches)
├── scripts/            # Consolidation and utility scripts
├── docs/               # Documentation files
├── index.html          # Main entry point
├── manifest.json       # PWA manifest
└── service-worker.js   # Service worker for PWA
```

---

## Data Sources

- **Weather Data**: OpenWeatherMap API (free tier)
- **Market Prices**: data.gov.in API, MandiPrices, AgMarkNet
- **Geographic Data**: Manual compilation of Maharashtra districts and talukas
- **Translation**: MyMemory Translation API + custom dictionary

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
