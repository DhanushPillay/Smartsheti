# 🌾 SmartSheti - Smart Agricultural Platform

SmartSheti is a comprehensive agricultural platform that empowers Maharashtra farmers with intelligent crop suggestions, real-time weather information, market demand analysis, and automated translation—all in their preferred language.

**🌐 Live Demo:** [https://smartsheti-rho.vercel.app](https://smartsheti-rho.vercel.app)

---

## ✨ Key Features

### 🌱 Smart Crop Recommendations
- **Weather-based suggestions**: Temperature-compatible crop recommendations (25% scoring weight)
- **Soil & irrigation analysis**: Matches crops to your soil type and water availability
- **Diversity algorithm**: Recommends varied crop categories for better risk management
- **Profitability insights**: Based on 2025-26 MSP rates and market trends
- **56+ crops** across 8 categories with real yield and cost data

### 🌤️ Real-time Weather Integration
- **Live Weather Data**: Accurate temperature, humidity, wind speed, and pressure via OpenWeatherMap API
- **"Feels Like" Precision**: Accounts for humidity and wind for realistic temperature perception
- **Pest Risk Analysis**: Advanced algorithms predict pest threats (aphids, whiteflies, bollworms, etc.)
- **Smart Irrigation Advice**: Personalized watering recommendations based on soil moisture and rain
- **7-Day Forecast**: Detailed planning data for the week ahead

### 💰 Live Market Prices & Demand
- **Dynamic Price Trends**: Visual charts showing price movements over the last 8 weeks
- **Mandi Comparison**: Compare prices across 5 major Maharashtra markets (Mumbai, Pune, Nashik, Nagpur, Aurangabad APMC)
- **4-Tier Price System**: Live API → Cached data → Government API → MSP fallback
- **15+ crops tracked**: Wheat, Rice, Cotton, Sugarcane, Tomato, Onion, Potato, and more
- **Visual Indicators**: Color-coded sources (🟢 Live, 🔵 Recent, 🟣 Official)

### 🌐 Comprehensive Translation System
- **100% Language Coverage**: Every button, tooltip, chart label, and dynamic text is translatable
- **3-Language Support**: Seamless switching between **English, Hindi (हिंदी), and Marathi (मराठी)**
- **Hybrid Engine**: Combines a static dictionary (927+ terms) with real-time MyMemory API translation
- **Context-Aware**: Handles complex UI elements like dropdowns and dynamic charts
- **User Preference**: Remembers your language choice across sessions

### � Agricultural Marketplace
- **Curated Products**: Browse high-quality seeds, fertilizers, and equipment
- **Trusted Partners**: Direct links to verified platforms (e.g., BigHaat)
- **Category Filtering**: Filter by seeds, tools, or fertilizers
- **Price Comparison**: View current prices and discounts

### 📱 PWA Support (Installable App)
- **Installable**: Functions as a native app on Android/iOS/Desktop
- **Offline Capable**: Caches essential assets for faster loading and basic offline access
- **App-like Experience**: Full-screen mode without browser UI
- **Auto-Updates**: Automatically stays up-to-date with the latest version

---

## 💡 How to Use

### 1. **Visit the Website**
Go to [https://smartsheti-rho.vercel.app](https://smartsheti-rho.vercel.app)

### 2. **Select Your Language**
- Click the translate button (🌐 EN) in the top navigation
- Choose: English | हिंदी (Hindi) | मराठी (Marathi)

### 3. **Get Crop Recommendations**
- Navigate to **Crop Suggestion** page
- Enter your location or select from the interactive Maharashtra map
- Choose your soil type (Black Cotton, Red Lateritic, Alluvial, etc.)
- Select land size and irrigation method
- Get personalized crop recommendations with profitability estimates

### 4. **Check Weather & Pest Risks**
- Go to **Weather** page
- Search for your location
- View current weather conditions
- Get pest risk warnings based on weather patterns
- Receive smart irrigation advice with 7-day forecast

### 5. **Monitor Market Prices**
- Visit **Market Demand** page
- Search for any crop using the autocomplete search
- View 8-week price trend charts
- Compare prices across different APMCs
- Track demand indicators and market insights

---

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5, CSS3, JavaScript | Core web technologies |
| Tailwind CSS | Modern utility-first styling |
| Leaflet.js | Interactive maps for location selection |
| Chart.js | Price trend visualization |
| Material Icons | Beautiful UI icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Python 3.8+ | Backend programming language |
| Flask | Lightweight web framework for APIs |
| Flask-CORS | Cross-origin resource sharing |
| BeautifulSoup4 | Web scraping for market data |
| Selenium | Browser automation for data collection |

### APIs & Data Sources
| API | Purpose |
|-----|---------|
| OpenWeatherMap API | Real-time weather data |
| data.gov.in API | Government agricultural market prices |
| MyMemory Translation API | Multilingual translation support |
| AgMarkNet | APMC market data |

---

## 📁 Project Structure

```
farmer/
├── index.html                 # Homepage (root entry point)
├── vercel.json               # Vercel deployment configuration
│
├── frontend/
│   ├── html/                  # Feature pages
│   │   ├── crop-suggestion.html    # Crop recommendation system
│   │   ├── weather.html            # Weather & pest analysis
│   │   ├── market-demand.html      # Market prices & trends
│   │   └── marketplace.html        # Agricultural products
│   │
│   ├── css/                   # Stylesheets
│   │   ├── Home page.css           # Homepage styles
│   │   ├── crop-suggestion.css     # Crop page styles
│   │   ├── weather.css             # Weather page styles
│   │   └── mobile-improvements.css # Responsive design
│   │
│   ├── js/                    # JavaScript modules
│   │   ├── translations.js         # 927+ translated terms (EN/HI/MR)
│   │   ├── crop_recommendation_engine.js  # Smart crop scoring
│   │   ├── market_data_manager.js  # Market data handling
│   │   ├── pest_risk_analyzer.js   # Weather-based pest analysis
│   │   ├── maharashtra-locations.js # District/location data
│   │   └── crop_images.js          # Crop image database
│   │
│   └── assets/images/         # Images and icons
│
├── backend/
│   ├── api/                   # Flask API servers
│   │   ├── simple_price_api.py     # Price API (port 5000)
│   │   ├── translation_api.py      # Translation API (port 5001)
│   │   └── enhanced_price_api.py   # Advanced price logic
│   │
│   ├── python/                # Core Python scripts
│   │   ├── real_agmarknet_scraper.py  # data.gov.in integration
│   │   ├── web_price_scraper.py       # Multi-source scraping
│   │   └── pest.py                    # Pest risk algorithms
│   │
│   ├── prices.json            # Cached crop prices (15+ crops)
│   └── requirements.txt       # Python dependencies
│
├── data/
│   ├── csv/                   # Historical market data
│   └── json/                  # Static data (crops, markets)
│
├── docs/                      # Documentation & guides
└── scripts/                   # Automation scripts
    ├── run_scraper.bat            # Update price data
    ├── start_price_api.bat        # Start price server
    └── start_translation_api.bat  # Start translation server
```

---

## 🚀 Local Development

### Prerequisites
- Python 3.8+
- Node.js (optional, for serving)
- OpenWeatherMap API key (free tier available)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/DhanushPillay/Smartsheti.git
   cd farmer
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start the Price API** (optional)
   ```bash
   python api/simple_price_api.py
   # Runs on http://localhost:5000
   ```

4. **Open the website**
   - Simply open `index.html` in your browser, or
   - Use a local server: `python -m http.server 8080`

---

## 🔍 Price Data Accuracy & Disclaimer

SmartSheti shows crop prices using a multi-source fallback system:

| Priority | Source | Description |
|----------|--------|-------------|
| 1 | Government Real-Time API | data.gov.in official modal prices |
| 2 | Local Price Cache | Historical data when live feeds unavailable |
| 3 | Seasonal Estimates | For fruits without official sources |
| 4 | MSP Fallback | Minimum Support Price for eligible crops |

### Important Notes
- **MSP ≠ Market Price**: MSP is a government support benchmark
- **Fruits Have No MSP**: Fruit prices are seasonal wholesale approximations
- **Prices Vary**: Actual prices depend on variety, quality, district, and season
- Cross-check official sources (local APMC, e-NAM portal) for financial decisions

> **Disclaimer**: All data provided "AS IS" without warranty. Validate before making economic decisions.

---

## 📊 Current Data Coverage

| Category | Count | Examples |
|----------|-------|----------|
| Crops Database | 56+ | Cereals, Cash Crops, Vegetables, Fruits, Pulses, Spices |
| MSP Rates | 35+ | Updated 2025-26 government rates |
| Translated Terms | 927+ | Complete UI in 3 languages |
| Maharashtra Districts | All | Location-based recommendations |
| APMC Markets | 5 | Mumbai, Pune, Nashik, Nagpur, Aurangabad |

---

## 🐛 Known Limitations

- Weather data requires internet connection
- Some crops may have limited historical price data
- Prices are indicative and should be verified with local markets
- Government API may have rate limits during peak hours

---

## 🤝 Contributing

We welcome contributions to SmartSheti!

1. **Explore the Code**: Check the project structure above
2. **Report Issues**: Help us by reporting bugs or suggesting features
3. **Submit Pull Requests**: Follow existing code style

---

## 📄 License

This project is developed for educational purposes as part of a college project (PBL - Project Based Learning).

---

## 👥 Team & Support

**Developed by:** Dhanush Pillay & Shubhangini Dixit  
**Institution:** MIT-ADT  
**Year:** 2025

For support or questions:
- Check documentation in `docs/` folder
- Open an issue on GitHub
- Contact the development team

---

## 🙏 Acknowledgments

- AgMarkNet for market data
- data.gov.in for government APIs
- MyMemory Translation API
- OpenWeather API
- Maharashtra Agriculture Department
- All contributors and testers

---

**⭐ If you find this project helpful, please star it on GitHub!**
