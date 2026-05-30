# SmartSheti Project Documentation

## 1. Product Requirements Document (PRD)

### 1.1 Product Vision
SmartSheti is an advanced agricultural decision support platform designed specifically for farmers in Maharashtra. The platform aims to empower farmers with data-driven insights, intelligent crop recommendations, real-time market prices, and weather forecasting to maximize their yield and profitability while mitigating risks.

### 1.2 Target Audience
- **Primary Users:** Farmers and agricultural practitioners in Maharashtra.
- **Secondary Users:** Agricultural consultants, students, and researchers.

### 1.3 Key Features
- **Intelligent Crop Recommendation:** Recommends optimal crops based on land size, soil type, irrigation method, current temperature, and season. Covers 48 specific crops grown in Maharashtra.
- **Market Price Tracking:** Real-time and predictive market prices for 20+ priority crops across multiple APMC markets in Maharashtra using a multi-source fallback mechanism (Data.gov.in API -> MandiPrices Scraper -> MSP Fallback).
- **Pest Risk Analyzer:** Evaluates current weather conditions against pest survival profiles to warn farmers of potential outbreaks. Covers Aphids, Whitefly, Pink Bollworm, and Thrips.
- **7-Day Farm Operations Planner:** Recommends optimal days for specific farming activities (plowing, sowing, spraying) based on short-term weather forecasts.
- **Multilingual Support:** English, Hindi, and Marathi interfaces to ensure local accessibility.
- **Progressive Web App (PWA):** Installable on mobile devices for offline caching and native app-like experience.

### 1.4 Success Metrics
- Increase in accurate crop adoptions based on localized recommendations.
- High reliability in market price fetching (measured by successful API resolutions without hitting the hardcoded fallback).
- User engagement across different language settings (Marathi/Hindi usage).

---

## 2. Technical Requirements Document (TRD)

### 2.1 Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Tailwind CSS, Leaflet.js (maps).
- **Backend:** Python 3 (Flask structure deployed as Serverless Functions via Vercel).
- **Database:** SQLite (local caching via `database.py`) and static JSON files for crop catalogs. Note: Vercel deployment relies on JSON file caching due to stateless serverless environments.
- **Hosting/Deployment:** Vercel (Frontend & Serverless API).

### 2.2 System Architecture
- **Client-Side Rendering:** The frontend is entirely static, relying on Vanilla JS to fetch data from APIs and JSON files asynchronously.
- **Serverless API Proxy:** The Python backend (`api/index.py`) acts as a secure proxy to fetch sensitive data (like `data.gov.in`) using environment variables, avoiding client-side exposure of API keys.
- **Cron Jobs:** Scheduled tasks (`api/cron/update-prices.py`) run hourly to keep the local market price caches warm.

### 2.3 External APIs
- **Weather Data:** OpenWeatherMap API (Current weather, 7-day forecast).
- **Market Prices:** Data.gov.in API (Daily agricultural prices resource `9ef84268-d588-465a-a308-a864a43d0070`), MandiPrices (Scraping).
- **Translation:** MyMemory Translation API.

### 2.4 Security & Performance
- API keys must be securely stored in Vercel Environment Variables (`DATA_GOV_IN_API_KEY`, `OPENWEATHER_API_KEY`, etc.).
- Implementation of caching (e.g., `prices.json`, `market_data.json`) to respect external API rate limits.
- Vercel `vercel.json` configures CORS allowing cross-origin requests and caches responses for 30 minutes.
- Cron endpoints are protected by `CRON_SECRET` authorization tokens.

---

## 3. Application Flow

1. **Onboarding / Home Page (`index.html`):**
   - User is presented with the value proposition.
   - Quick access to core features (Crop Suggestion, Weather, Marketplace).
   - Language selector available in the header.

2. **Crop Suggestion (`crop-suggestion.html`):**
   - User inputs: Location (District/Taluka), Land Size, Soil Type, Irrigation Method.
   - Flow: `crop_recommendation_engine.js` cross-references inputs against `Maharashtra_crops.json`.
   - Output: Top 8 diversified crop suggestions with suitability scores and estimated profitability.

3. **Market Demand & Prices (`market-demand.html`):**
   - User navigates to the market dashboard.
   - Flow: `market_data_manager.js` calls `/api/realprice/{crop}`. The Python backend resolves the price via data.gov.in or fallback methods.
   - Output: Current prices, 8-week historical trends (rendered via charts), and APMC market comparisons.

4. **Weather & Farm Operations (`weather.html`):**
   - User grants location access or searches for a district.
   - Flow: Fetches data from OpenWeatherMap.
   - Output: Current conditions, 7-day forecast, Pest Risk warnings, and Farm Operations planning schedule.

5. **Marketplace (`marketplace.html`):**
   - Static grid of agricultural inputs (seeds, fertilizers) with reliable image fallbacks.

---

## 4. UI/UX Brief

### 4.1 Design Philosophy
- **Utilitarian & Accessible:** The design prioritizes readability and ease of use for non-technical users. High contrast, large touch targets, and clear iconography.
- **Local Context:** Prominent use of local language (Marathi/Hindi) and familiar agricultural imagery.

### 4.2 Visual Identity
- **Primary Colors:** Earthy tones (Greens `#10B981` and Browns `#EBE4DB`) to reflect agriculture.
- **Typography:** Roboto font family for clean, legible text.
- **Components:** Card-based layouts (Tailwind CSS) for displaying crops and weather data to ensure responsive reflowing on mobile devices.

### 4.3 Key UX Patterns
- **Loading States:** Full-screen transition overlays with a plant logo to mask data-fetching delays.
- **Error Handling:** Graceful fallbacks for images (`onerror` replaces broken links with a default logo) and mock data labels ("Demo Mode") when live market APIs fail.
- **Navigation:** Bottom-bar style mobile menu for easy one-handed thumb navigation.

---

## 5. Backend Schema & Data Models

### 5.1 API Endpoints (Vercel Serverless)

| Endpoint | Method | Parameters | Description |
|---|---|---|---|
| `/api/realprice/<crop>` | GET | `?state=` (default: Maharashtra), `?market=` | Fetches canonical price data with intelligent multi-source fallback. |
| `/api/prices/bulk` | GET | `?crops=wheat,rice,cotton`, `?state=` | Fetches data for multiple crops at once. |
| `/api/prices/markets/<crop>`| GET | `?state=` | Retrieves available APMC markets for a specific crop. |
| `/api/health` | GET | None | Health check endpoint returning service info. |

### 5.2 SQLite Database Schema (`farm_database.db`)

Used primarily for local development/caching.

#### Table: `crop_prices`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| `crop_name` | TEXT | NOT NULL, UNIQUE | Canonical crop name |
| `state` | TEXT | | Target state (e.g., Maharashtra) |
| `unit` | TEXT | | Pricing unit (e.g., kg, quintal) |
| `current_price` | REAL | | Latest aggregated price |
| `source` | TEXT | | Data source (e.g., API, Scraped) |
| `color` | TEXT | | UI hex color for charts |
| `last_updated` | TEXT | | ISO Timestamp |
| `historical_labels`| TEXT | | JSON string of time periods |
| `historical_data` | TEXT | | JSON string of past prices |

#### Table: `market_prices`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| `crop_id` | INTEGER | NOT NULL, FOREIGN KEY | References `crop_prices(id)` ON DELETE CASCADE |
| `market_name` | TEXT | NOT NULL | APMC Market Name |
| `district` | TEXT | | Market District |
| `price` | REAL | | Local market price |

### 5.3 JSON Static Data Models

#### `Maharashtra_crops.json`
Central knowledge base for the recommendation engine (48 crops).
```json
{
  "name": "Rice",
  "varieties": ["Basmati", "IR-64"],
  "season": "Kharif",
  "ideal_temperature_c": { "min": 22, "max": 32 },
  "rainfall_requirement_mm": [1500, 3000],
  "best_soil_types": ["Deep alluvial soil", "Clayey loam"],
  "agroclimatic_zones": ["Konkan", "Western Ghat"],
  "duration_days": "120-150",
  "fertilizer_recommendation": "N:P:K 100:50:50 kg/ha",
  "common_pests": ["Stem Borer"]
}
```

#### `data/json/prices.json`
Primary cache updated by the Vercel cron job. Stores 8-week price trends for top priority crops.
```json
{
  "wheat": {
    "labels": ["7W ago", "6W ago", "Current"],
    "data": [2550, 2470.74, 2405.42],
    "color": "#FFA500",
    "state": "Maharashtra",
    "unit": "₹/quintal"
  }
}
```

#### `pests.json`
Weather-condition-based pest risk assessment data.
```json
{
  "name": "Aphids", 
  "icon": "🐛",
  "conditions": {
    "temperature": { "min": 18, "max": 35 },
    "humidity": { "min": 50, "max": 100 },
    "cloudCover": { "min": 30, "max": 100 },
    "windSpeed": { "min": 0, "max": 15 }
  },
  "riskLevel": "moderate",
  "affectedCrops": ["Cotton", "Wheat"],
  "prevention": ["Use yellow sticky traps"],
  "treatment": ["Neem oil spray"]
}
```
