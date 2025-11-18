# 🚀 Getting Real-Time Market Prices

## Quick Start (3 Easy Steps)

### Step 1: Install Dependencies
```bash
pip install flask flask-cors
```

### Step 2: Start the Price API Server
**Windows:** Double-click `start_price_api.bat`

**OR manually:**
```bash
cd backend/api
python simple_price_api.py
```

### Step 3: Use Your Website
Open your SmartSheti website and generate crop recommendations. You'll see live price indicators:

- 🟢 **Live** = Real-time from API server
- 🔵 **Recent** = Cached from file
- 🟣 **Official** = Government API
- ⚪ **MSP** = Static MSP rates

## How It Works

### Without API Server (Default)
✅ Uses cached prices from `backend/prices.json`
✅ Falls back to Government MSP rates
✅ No setup required!

### With API Server (Recommended)
✅ Real-time market prices every 5 minutes
✅ Fresh data from AGMARKNET
✅ Better recommendations
✅ Price trend analysis

## Price Sources Explained

### 1. 🟢 Local API (Live Data)
- **What**: Your own price API server
- **Update**: Every 5 minutes
- **Accuracy**: High (current market rates)
- **Setup**: Run `start_price_api.bat`

### 2. 🔵 Cached Data (Recent)
- **What**: Pre-loaded price file
- **Update**: Manual or scheduled
- **Accuracy**: Good (last update time)
- **Setup**: None needed

### 3. 🟣 Government API (Official)
- **What**: data.gov.in APMC data
- **Update**: Daily
- **Accuracy**: Official government data
- **Setup**: May need API key for high usage

### 4. ⚪ MSP (Guaranteed)
- **What**: Minimum Support Price 2025-26
- **Update**: Yearly (by government)
- **Accuracy**: Fixed government rates
- **Setup**: Built-in fallback

## Checking Price Sources

### Test the API
Open in browser: `http://localhost:5000/api/prices`

You should see:
```json
{
  "wheat": {
    "data": [2400, 2450, 2425],
    "unit": "₹/quintal",
    "state": "Maharashtra"
  },
  ...
}
```

### Check Specific Crop
`http://localhost:5000/api/prices/wheat`

## Troubleshooting

### "Cannot connect to API"
✅ Make sure API server is running
✅ Check `http://localhost:5000/api/health`
✅ System will auto-fallback to cached/MSP prices

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <number> /F
```

### "No price data"
✅ Check if `backend/prices.json` exists
✅ Run the scraper: `python backend/python/enhanced_agmarknet_scraper.py`
✅ System uses MSP as final fallback

## Updating Price Data

### Manual Update (Scraper)
```bash
cd backend/python
python enhanced_agmarknet_scraper.py
```
This creates/updates `backend/prices.json`

### Automatic Updates
The API server auto-updates every 5 minutes when running

## What You'll See

### In Crop Recommendations:
```
Price: ₹24.25/kg  🟢 Live
                  ↑
            Price indicator shows data source
```

### Color Meanings:
- **Green** 🟢 = Fresh live data (best)
- **Blue** 🔵 = Recent cached data (good)
- **Purple** 🟣 = Official gov data (reliable)
- **Gray** ⚪ = MSP fallback (guaranteed minimum)

## Advanced Configuration

### Change Update Interval
Edit `simple_price_api.py`:
```python
UPDATE_INTERVAL = 5  # minutes (change as needed)
```

### Add Government API Key
Edit `crop_recommendation_engine.js`:
```javascript
const apiKey = 'YOUR_API_KEY_HERE';
```
Get free key: https://data.gov.in

## Benefits of Real-Time Prices

✅ **Accurate profitability** estimates
✅ **Better decisions** for farmers
✅ **Market-driven** recommendations
✅ **Seasonal adjustments** automatic
✅ **Multiple data sources** = reliability

## System Architecture

```
User Opens Website
       ↓
Selects Location/Soil
       ↓
Clicks "Get Recommendations"
       ↓
System tries (in order):
  1. Local API (localhost:5000)  ← Start this for live prices
  2. Cached File (prices.json)
  3. Government API (data.gov.in)
  4. Static MSP (built-in)
       ↓
Shows Crops with Price Badge 🟢🔵🟣⚪
```

## Price Coverage

### Current Crops with Prices:
- Cotton, Wheat, Rice, Maize, Jowar
- Soybean, Sugarcane, Groundnut
- Onion, Tomato, Potato
- Grapes, Banana, Orange, Pomegranate
- Tur, Chilli, Turmeric, Garlic
- And 20+ more...

## FAQ

**Q: Do I need to start the API server?**
A: No! The system works fine without it, using cached/MSP prices. But API gives live updates.

**Q: How often should I update prices?**
A: API auto-updates every 5 min. Or run scraper weekly for cache.

**Q: What if internet is down?**
A: System uses cached file automatically. No internet needed.

**Q: Are MSP prices accurate?**
A: Yes! MSP is official government rate. But market rates vary and are better for vegetables.

**Q: Can I add more crops?**
A: Yes! Edit `profitabilityMap` in `crop_recommendation_engine.js`

---

## Summary

**Easiest**: Just use the website (uses cached/MSP prices)

**Better**: Run `start_price_api.bat` for live updates

**Best**: Run scraper + API server for fresh data

No matter what, you'll always get price data through the multi-tier fallback system! 🌾
