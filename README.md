# 🌾 SmartSheti - Smart Agricultural Platform

SmartSheti is a comprehensive agricultural platform that empowers Maharashtra farmers with intelligent crop suggestions, real-time weather information, market demand analysis, and automated translation—all in their preferred language.

**🌐 Live Demo:** [https://smartsheti-rho.vercel.app](https://smartsheti-rho.vercel.app)

## ✨ Key Features

### 🌱 Smart Crop Recommendations
- **Weather-based suggestions**: Temperature-compatible crop recommendations (25% scoring weight)
- **Soil & irrigation analysis**: Matches crops to your soil type and water availability
- **Diversity algorithm**: Recommends varied crop categories for better risk management
- **Profitability insights**: Based on 2025-26 MSP rates and market trends

### 🌤️ Real-time Weather Integration
- Live weather data with temperature, humidity, wind, and pressure
- **Pest risk analysis**: Predicts pest threats based on weather conditions
- **Smart irrigation advice**: Personalized watering recommendations
- 7-day weather forecast for planning

### 💰 Live Market Prices
- **4-tier price system**: Live API → Cached data → Government API → MSP fallback
- Current 2025-26 MSP rates for 35+ crops
- Market demand trends and price indicators
- Visual price source badges (🟢 Live, 🔵 Recent, 🟣 Official, ⚪ MSP)

### 🌐 Automatic Translation (Zero-Code!)
- **Auto-translates everything**: No manual coding needed for new content
- **3-tier system**: Static dictionary (927 words) → Smart matching → Live API
- Supports **English, Hindi (हिंदी), Marathi (मराठी)**
- **NEW**: Add any text to website → Translates automatically via API
- One-click language switching with localStorage persistence

### 📊 Additional Features
- Interactive Maharashtra location map with district selection
- Crop image database with 56+ crops
- Market demand analysis and price comparison
- Responsive design for mobile and desktop

## 💡 How to Use

### 1. **Visit the Website**
Go to [https://smartsheti-rho.vercel.app](https://smartsheti-rho.vercel.app)

### 2. **Select Your Language**
- Click the translate button (🌐 EN) in the top navigation
- Choose: English | हिंदी (Hindi) | मराठी (Marathi)
- Language preference is saved automatically

### 3. **Get Crop Recommendations**
- Navigate to **Crop Suggestion** page
- Enter your location or select from the interactive Maharashtra map
- Choose your soil type (Black, Red, Alluvial, etc.)
- Select land size and irrigation method
- Get personalized crop recommendations with profitability estimates

### 4. **Check Weather & Pest Risks**
- Go to **Weather** page
- View current weather conditions for your location
- Get pest risk warnings based on weather patterns
- Receive smart irrigation advice
- See 7-day forecast for planning

### 5. **Monitor Market Prices**
- Visit **Market Demand** page
- Browse live crop prices with demand trends
- Compare prices across different markets
- Track price history and forecasts
- View price source indicators for transparency

### 6. **Explore Marketplace**
- Connect with buyers and sellers
- List your produce
- Find best market opportunities

## 🎯 Key Highlights

### ✨ What Makes SmartSheti Special

1. **Zero-Code Translation**: Add any new feature → Translates automatically (no manual coding!)
2. **Weather-Smart Crops**: Recommendations adapt to current temperature and conditions
3. **Real-Time Prices**: 4-tier fallback ensures you always get price data
4. **Maharashtra-Focused**: 56+ crops, district-wise data, local languages
5. **Mobile-Friendly**: Responsive design works on phones, tablets, and desktop

### 📊 Current Data Coverage

- **56 crops** across 8 categories (Cereals, Cash Crops, Pulses, Vegetables, etc.)
- **35+ crops** with updated 2025-26 MSP rates
- **927 pre-translated terms** in 3 languages
- **Maharashtra districts** with location-based recommendations

## 🛠️ Technologies Used

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)** - Core web technologies
- **Tailwind CSS** - Modern utility-first styling
- **Leaflet.js** - Interactive maps for location selection
- **Material Icons** - Beautiful UI icons
- **Chart.js** - Price trend visualization

### Backend
- **Python 3.8+** - Backend programming language
- **Flask** - Lightweight web framework for APIs
- **BeautifulSoup4** - Web scraping for market data
- **Flask-CORS** - Cross-origin resource sharing

### APIs & Data Sources
- **MyMemory Translation API** - Multilingual translation support
- **OpenWeather API** - Real-time weather data
- **AgMarkNet** - Government agricultural market data
- **data.gov.in** - Official crop price data

## 🔍 Price Data Accuracy & Disclaimer

SmartSheti shows crop prices using a multi-source fallback system to ensure data availability. However, displayed prices should be treated as indicative, not exact trading prices.

### Data Source Hierarchy
1. **Government Real-Time API** (data.gov.in) – Official modal prices
2. **Local Price Cache** – Historical data when live feeds unavailable
3. **Seasonal Estimates** – For fruits without official sources
4. **MSP Fallback** – Minimum Support Price for eligible crops

### Important Notes
- **MSP ≠ Market Price**: MSP is a government support benchmark
- **Fruits Have No MSP**: Fruit prices are seasonal wholesale approximations
- **Prices Vary**: Actual prices depend on variety, quality, district, and season
- **Modal Price**: Central tendency at a market, not minimum or maximum

### Usage Guidance
Cross-check official sources (local APMC, e-NAM portal) for financial decisions. This platform is educational and demonstrative.

> **Disclaimer**: All data provided "AS IS" without warranty. Validate before making economic decisions.

## 📁 Project Structure

```
farmer/
├── index.html             # Homepage (root entry point)
├── frontend/
│   ├── html/              # Other pages (Crop Suggestion, Weather, Market Demand, etc.)
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript (crop engine, translations, maps)
│   ├── assets/images/     # Images and icons
│   └── test/              # Test pages
├── backend/
│   ├── api/               # Flask APIs (Price API, Translation API)
│   ├── python/            # Core scripts (scrapers, price updater)
│   ├── prices.json        # Current crop prices
│   └── requirements.txt   # Python dependencies
├── data/
│   ├── csv/               # Market data CSV files
│   └── json/              # Crop data, prices, market summary
├── scripts/               # Batch files and utility scripts
│   ├── start_all_apis.bat        # Start both APIs
│   ├── start_price_api.bat       # Start price API only
│   ├── start_translation_api.bat # Start translation API only
│   ├── run_scraper.bat           # Run market scraper
│   └── update_html_files.py      # CSS extraction utility
├── docs/                  # Documentation and guides
│   ├── AUTO_TRANSLATION_GUIDE.md
│   ├── TRANSLATION_API_GUIDE.md
│   ├── PRICE_SETUP_GUIDE.md
│   └── ... (other guides)
├── logs/                  # Application logs
└── README.md              # This file
```





## 🎯 Key Highlights

### ✨ What Makes SmartSheti Special

1. **Zero-Code Translation**: Add any new feature → Translates automatically (no manual coding!)
2. **Weather-Smart Crops**: Recommendations adapt to current temperature and conditions
3. **Real-Time Prices**: 4-tier fallback ensures you always get price data
4. **Maharashtra-Focused**: 56+ crops, district-wise data, local languages
5. **Mobile-Friendly**: Responsive design works on phones, tablets, and desktop

### 📊 Current Data Coverage

- **56 crops** across 8 categories (Cereals, Cash Crops, Pulses, Vegetables, etc.)
- **35+ crops** with updated 2025-26 MSP rates
- **927 pre-translated terms** in 3 languages
- **Maharashtra districts** with location-based recommendations

## 🔍 Price Data Accuracy & Disclaimer

SmartSheti shows crop prices using a multi-source fallback chain designed to keep the interface functional even when live feeds are unavailable. However, displayed values (especially for fruits) should be treated as indicative only, not exact trading or procurement prices.

### Data Source Hierarchy (Attempt Order)
1. **Government Real-Time (data.gov.in)** – Dataset: `9ef84268-d588-465a-a308-a864a43d0070` (modal prices, often per quintal)
2. **Local Price API (`simple_price_api.py`)** – Historical JSON (simulated / previously scraped)
3. **Seasonal Fruit Fallback** – Estimated wholesale midpoint ranges (e.g., Mango: ₹55/kg harvest season, ₹95/kg off-season)
4. **MSP Fallback** – Minimum Support Price converted from ₹/quintal → ₹/kg for eligible crops (cereals, pulses, oilseeds, not fruits)

### Important Differences
- **MSP ≠ Market Price**: MSP is a government support benchmark, not a guaranteed sale price.
- **Fruits Have No MSP**: Fruit values shown when no real data are seasonal wholesale approximations (variety, grade, packing, and district can shift actual price widely).
- **Unit Conversions**: Government data often reports ₹/quintal. We convert to ₹/kg by dividing by 100; errors may occur if unit metadata is inconsistent.
- **Modal Price Meaning**: Modal price is a central tendency at a market, not minimum nor maximum; extreme trades may differ.

### Accuracy Caveats
- Prices can vary hourly by arrival volume, quality, and weather.
- Variety-specific differences (e.g., Alphonso vs. Totapuri mango) are not distinguished.
- Scraper/API interruptions will trigger fallbacks which may freeze or approximate values.
- Historical trend synthesis for missing weeks uses a volatility model (purely indicative).

### Usage Guidance
Do not rely on these displayed prices for contracts, large-scale procurement, or financial planning without cross-checking an official source (local APMC bulletin, e-NAM portal, or verified trader quotes).

If you need higher precision: integrate a dedicated feed or expand the scraper to capture per-market variety-level data.

> **Disclaimer**: All price data are provided “AS IS” without warranty. The project is educational and demonstrative; validate before making economic decisions.



## 🐛 Known Limitations

- Weather data requires internet connection
- Some crops may have limited historical price data
- Prices are indicative and should be verified with local markets

## 📄 License

This project is developed for educational purposes as part of a college project.

## 👥 Team & Support

**Developed by:** Dhanush Pillay & Shubhangini Dixit  
**Institution:** MIT-ADT
**Year:** 2025

For support or questions:
- Check documentation in `docs/` folder
- Open an issue on GitHub
- Contact the development team

## 🙏 Acknowledgments

- AgMarkNet for market data
- MyMemory Translation API
- OpenWeather API
- Maharashtra Agriculture Department
- All contributors and testers

---

**⭐ If you find this project helpful, please star it on GitHub!**

**Note**: This is a college project (PBL - Project Based Learning) focused on developing a comprehensive agricultural platform for farmers.
