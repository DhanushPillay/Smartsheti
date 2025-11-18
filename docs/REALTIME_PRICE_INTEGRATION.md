# SmartSheti Real-Time Price Integration

## 🌾 Overview
This system provides **real-time agricultural market prices** for SmartSheti using multiple data sources with automatic fallback.

## 📊 Price Data Sources (in priority order)

### 1. **Local Backend API** (Primary - Real-time)
- **URL**: `http://localhost:5000/api/prices`
- **Update Frequency**: Every 5 minutes (when running)
- **Data Source**: AGMARKNET scraper
- **Coverage**: Major crops in Maharashtra

### 2. **Cached Price File** (Secondary - Recent)
- **Location**: `backend/prices.json`
- **Update**: Manual or scheduled scraper runs
- **Advantage**: Works offline

### 3. **Government Open API** (Tertiary - Official)
- **URL**: `https://api.data.gov.in`
- **Source**: Government of India Open Data Portal
- **Advantage**: Official APMC data
- **Limitation**: May have rate limits

### 4. **Static MSP Prices** (Fallback - Guaranteed)
- **Source**: Government MSP 2025-26 rates
- **Advantage**: Always available
- **Limitation**: Not real-time market prices

## 🚀 Quick Start

### Option 1: Start Price API Server
```bash
# Double-click to run:
start_price_api.bat

# Or manually:
cd backend/api
python simple_price_api.py
```

### Option 2: Use Static Prices (No server needed)
The system automatically uses cached prices from `backend/prices.json` or falls back to MSP rates.

## 🔧 How It Works

### Frontend Integration
The crop recommendation engine tries each source in order:

```javascript
// 1. Try local API (if server running)
fetch('http://localhost:5000/api/prices')

// 2. Try cached file
fetch('../../backend/prices.json')

// 3. Try Government API
fetch('https://api.data.gov.in/resource/...')

// 4. Use static MSP/market prices
// Fallback to hardcoded values
```

### Price Calculation
```javascript
// MSP crops: Use Government Minimum Support Price
pricePerKg = msp / 100  // Convert quintal to kg

// Market crops: Use current market rates
pricePerKg = marketPrice

// Apply seasonal adjustments
adjustedPrice = pricePerKg * seasonalFactor
```

## 📈 Available Endpoints

### Get All Prices
```
GET http://localhost:5000/api/prices
```

### Get Specific Crop Price
```
GET http://localhost:5000/api/prices/wheat
GET http://localhost:5000/api/prices/rice
GET http://localhost:5000/api/prices/cotton
```

### Health Check
```
GET http://localhost:5000/api/health
```

## 🌟 Features

✅ **Multi-source fallback** - Always gets best available price
✅ **Automatic retry** - Tries multiple APIs
✅ **CORS enabled** - Works with any frontend
✅ **Real-time updates** - When API server running
✅ **Offline support** - Uses cached data
✅ **MSP guarantee** - Government support prices for major crops
✅ **Seasonal adjustment** - Prices adjust based on season
✅ **Maharashtra focus** - Prices specific to state markets

## 💰 Current Price Coverage

### MSP Crops (Government Guaranteed)
- Cotton: ₹7,521/quintal
- Wheat: ₹2,425/quintal
- Rice: ₹2,320/quintal
- Jowar: ₹3,450/quintal
- Maize: ₹2,225/quintal
- Soybean: ₹4,892/quintal
- Groundnut: ₹6,377/quintal
- Tur: ₹7,550/quintal

### Market Rate Crops (Variable)
- Onion: ₹20-30/kg
- Tomato: ₹15-25/kg
- Potato: ₹12-18/kg
- Grapes: ₹40-60/kg
- Banana: ₹12-18/kg
- And 20+ more crops...

## 🔄 Updating Prices

### Manual Update (Backend Scraper)
```bash
cd backend/python
python enhanced_agmarknet_scraper.py
```

### Automatic Updates (Start API Server)
```bash
# Starts server with auto-updates every 5 minutes
start_price_api.bat
```

## 🛠️ Requirements

### Python Packages
```bash
pip install flask flask-cors requests beautifulsoup4
```

### For Scraper (Optional)
```bash
pip install selenium webdriver-manager
```

## 📝 Configuration

### Enable Government API
1. Get API key from: https://data.gov.in
2. Update in `crop_recommendation_engine.js`:
```javascript
const apiUrl = `https://api.data.gov.in/resource/...?api-key=YOUR_KEY_HERE`;
```

### Change Update Interval
Edit `simple_price_api.py`:
```python
# Update every N minutes
UPDATE_INTERVAL = 5  # minutes
```

## 🐛 Troubleshooting

### "Port 5000 already in use"
```bash
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### "CORS Error"
- Make sure API server is running
- Check browser console for exact error
- Verify CORS is enabled in API

### "No price data available"
1. Check if `prices.json` exists in `backend/` or `data/json/`
2. Run scraper to generate data
3. System will use MSP fallback values

## 📊 Price Data Format

```json
{
  "lastUpdated": "2025-11-18T10:30:00",
  "source": "AGMARKNET",
  "wheat": {
    "data": [2400, 2450, 2425],
    "labels": ["2W ago", "1W ago", "Current"],
    "unit": "₹/quintal",
    "state": "Maharashtra"
  }
}
```

## 🎯 Future Enhancements

- [ ] Add more APMC markets
- [ ] WebSocket for real-time updates
- [ ] Price prediction using ML
- [ ] Price alerts for farmers
- [ ] Historical price analysis
- [ ] Export price data

## 📞 Support

For issues or questions:
- Check logs in console
- Review `backend/api/simple_price_api.py`
- Verify network connectivity
- Ensure Python 3.8+ installed

---

**Note**: Market prices fluctuate daily. Real-time data is subject to availability from AGMARKNET and government APIs. The system ensures you always get the best available price data through its multi-tier fallback mechanism.
