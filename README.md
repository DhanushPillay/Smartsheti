# 🌾 SmartSheti - Smart Agricultural Platform

SmartSheti is a comprehensive agricultural platform that empowers Maharashtra farmers with intelligent crop suggestions, real-time weather information, market demand analysis, and automated translation—all in their preferred language.

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

## 📁 Project Structure

```
farmer/
├── frontend/
│   ├── html/              # Web pages (Home, Weather, Market Demand, etc.)
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

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Edge)
- Internet connection (for weather data and API translation)

### Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/DhanushPillay/Smartsheti.git
   cd Smartsheti
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

#### Option 1: Quick Start (Recommended)
Double-click `scripts/start_all_apis.bat` to start both APIs automatically.

#### Option 2: Manual Start
```bash
# Terminal 1 - Price API
cd backend/api
python simple_price_api.py

# Terminal 2 - Translation API
cd backend/api
python translation_api.py
```

#### Option 3: Frontend Only (without APIs)
- Navigate to `frontend/html/`
- Open `Home page.html` in your web browser
- Features will work with static data (no live prices/translation for new words)

### API Endpoints

**Price API** (Port 5000):
- `http://localhost:5000/api/prices` - Get all crop prices
- `http://localhost:5000/api/prices/<crop>` - Get specific crop price
- `http://localhost:5000/api/health` - Health check

**Translation API** (Port 5001):
- `http://localhost:5001/api/translate` - Translate single text
- `http://localhost:5001/api/translate/batch` - Translate multiple texts
- `http://localhost:5001/api/health` - Health check

## 💡 Usage

### For Farmers

1. **Open the application**
   - Navigate to `frontend/html/Home page.html`

2. **Select your language**
   - Click the translate button (🌐 EN)
   - Choose: English | हिंदी | मराठी

3. **Get crop recommendations**
   - Go to Crop Suggestion page
   - Enter your location (or select from map)
   - Select soil type, land size, irrigation method
   - Get personalized recommendations with profitability estimates

4. **Check weather & pest risks**
   - View current weather conditions
   - Get pest risk warnings based on weather
   - Receive smart irrigation advice

5. **Monitor market prices**
   - See live crop prices with demand trends
   - Compare prices across different markets
   - Track price history and forecasts

### For Developers

#### Adding New Features
- **No translation coding needed!** Just write normal HTML
- New text automatically translates if Translation API is running
- Add crop data to `data/json/Maharashtra_crops.json`

#### Key Files
- **Crop Engine**: `frontend/js/crop_recommendation_engine.js`
- **Translations**: `frontend/js/translations.js` (927 pre-translated terms)
- **Price API**: `backend/api/simple_price_api.py`
- **Translation API**: `backend/api/translation_api.py`
- **Price Scraper**: `backend/python/enhanced_agmarknet_scraper.py`

#### Testing
- Open `frontend/test/translation_test.html` for translation testing
- Open `frontend/test/translation_api_test.html` for API testing

## 🛠️ Technologies Used

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Tailwind CSS** - Utility-first styling
- **Leaflet.js** - Interactive maps for location selection
- **Material Icons** - UI icons
- **Chart.js** - Price trend visualization (optional)

### Backend
- **Python 3.8+**
- **Flask** - Web framework for APIs
- **Flask-CORS** - Cross-origin resource sharing
- **BeautifulSoup4** - Web scraping for market data
- **Requests** - HTTP library

### APIs & Data
- **MyMemory Translation API** - Free translation service (2000 chars/day)
- **OpenWeather API** - Weather data
- **AgMarkNet** - Government agricultural market data
- **JSON/CSV** - Local data storage

### Key Features & Libraries
- **Auto-translation system** with 3-tier fallback
- **4-tier price API** with multi-source fallback
- **Temperature-based recommendations** with diversity algorithm
- **Real-time data caching** for performance

## ⚙️ Configuration

### Adding Static Translations (Optional)
Edit `frontend/js/translations.js` to add frequently-used terms:
```javascript
en: { yourTerm: "Your Term" },
hi: { yourTerm: "आपका शब्द" },
mr: { yourTerm: "तुमचा शब्द" }
```
*Note: Not required! API will translate new words automatically.*

### Weather API Key
Set your OpenWeather API key in `frontend/html/Weather_page(3).html`:
```javascript
const WEATHER_API_KEY = 'your_api_key_here';
```

### Translation API Token (For Higher Limits)
Set `HF_TOKEN` environment variable for Hugging Face translation:
```bash
set HF_TOKEN=your_huggingface_token
```
Or edit `backend/api/translation_api.py` to add Google Translate fallback.

### Price Data Sources
Update scraper URLs in `backend/python/enhanced_agmarknet_scraper.py` if government APIs change.

## 📚 Documentation

Comprehensive guides available in `docs/` folder:

- **[AUTO_TRANSLATION_GUIDE.md](docs/AUTO_TRANSLATION_GUIDE.md)** - How zero-code auto-translation works
- **[TRANSLATION_API_GUIDE.md](docs/TRANSLATION_API_GUIDE.md)** - Translation API setup and usage
- **[PRICE_SETUP_GUIDE.md](docs/PRICE_SETUP_GUIDE.md)** - Price API configuration
- **[REALTIME_PRICE_INTEGRATION.md](docs/REALTIME_PRICE_INTEGRATION.md)** - Technical details
- **[CROP_SUGGESTION_SYSTEM.md](docs/CROP_SUGGESTION_SYSTEM.md)** - Recommendation algorithm
- **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Detailed project organization

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### File Organization Guidelines
- HTML files → `frontend/html/`
- JavaScript → `frontend/js/`
- CSS → `frontend/css/`
- Python scripts → `backend/python/`
- APIs → `backend/api/`
- Data → `data/json/` or `data/csv/`
- Documentation → `docs/`
- Utilities → `scripts/`

## 🐛 Known Issues & Limitations

- Translation API has rate limits (2000 chars/day on free tier)
- Weather API requires internet connection
- Price scraper depends on government website availability
- Some crops may have limited historical price data

## 🔮 Future Enhancements

- [ ] ML-based price prediction
- [ ] Push notifications for price alerts
- [ ] Offline mode with cached data
- [ ] More languages (Gujarati, Kannada, etc.)
- [ ] Mobile app (React Native/Flutter)
- [ ] Integration with government schemes database

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
