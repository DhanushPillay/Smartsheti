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
- **Live Weather Data**: Accurate temperature, humidity, wind speed, and pressure
- **"Feels Like" Precision**: Accounts for humidity and wind for realistic temperature perception
- **Pest Risk Analysis**: Advanced algorithms predict pest threats based on weather patterns
- **Smart Irrigation Advice**: Personalized watering recommendations based on soil moisture and rain
- **7-Day Forecast**: Detailed planning data for the week ahead

### 💰 Live Market Prices & Demand
- **Dynamic Price Trends**: Visual charts showing price movements over the last 60 days
- **Mandi Comparison**: Compare prices across different markets (e.g., Mumbai vs Pune APMC)
- **4-Tier Price System**: Live API → Cached data → Government API → MSP fallback
- **Visual Indicators**: Color-coded badges for price sources (🟢 Live, 🔵 Recent, 🟣 Official)

### 🌐 Comprehensive Translation System
- **100% Language Coverage**: Every button, tooltip, chart label, and dynamic text is translatable
- **3-Language Support**: Seamless switching between **English, Hindi (हिंदी), and Marathi (मराठी)**
- **Hybrid Engine**: Combines a static dictionary (927+ terms) with real-time API translation
- **Context-Aware**: Handles complex UI elements like dropdowns and dynamic charts
- **User Preference**: Remembers your language choice across sessions

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
6. **Data Integrity**: Smart translation system preserves live data (weather, prices) while translating labels

### 📊 Current Data Coverage

- **56 crops** across 8 categories (Cereals, Cash Crops, Pulses, Vegetables, etc.)
- **35+ crops** with updated 2025-26 MSP rates
- **927 pre-translated terms** in 3 languages
- **Maharashtra districts** with location-based recommendations
- **Real-time Weather** with "Feels Like" precision

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
│   ├── html/              # Feature pages (Weather, Market, Crops)
│   ├── css/               # Modular CSS (Tailwind + Custom)
│   ├── js/                # Logic (Translations, Charts, Weather)
│   ├── assets/images/     # Images and icons
│   └── components/        # Reusable UI components (Header, Footer)
├── backend/
│   ├── api/               # Flask APIs (Price API, Translation API)
│   ├── python/            # Core scripts (Scrapers, Analysis, Charts)
│   │   ├── agmarknet_scraper.py        # Government data scraper
│   │   ├── enhanced_price_api.py       # Advanced price logic
│   │   └── pest.py                     # Pest risk algorithms
│   ├── prices.json        # Current crop prices database
│   └── requirements.txt   # Python dependencies
├── data/
│   ├── csv/               # Historical market data
│   └── json/              # Static data (Crops, Markets, Translations)
├── docs/                  # Documentation & Guides
└── scripts/               # Automation scripts (Start servers, Update data)
```

## 🚀 Recent Updates
- **UI/UX Polish**: Fixed language dropdown animations and z-index issues across all pages.
- **Data Integrity**: Resolved issues where translation logic was overwriting live weather data.
- **Performance**: Optimized translation loading to prevent "flicker" on page load.
- **Documentation**: Added comprehensive guides for Translation API and Real-time Systems.

## 🤝 Contributing

We welcome contributions to SmartSheti! To get involved:
1. **Explore the Code**: Check the project structure and understand the codebase.
2. **Report Issues**: Help us by reporting bugs or suggesting features.
3. **Submit Pull Requests**: For code changes, please submit a pull request with a clear description of the changes.

Please follow the existing code style and ensure your contributions align with the project's goals.

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
