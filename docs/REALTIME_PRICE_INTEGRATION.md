# SmartSheti Real-Time Price Integration

## 🌾 Overview
This system provides **real-time agricultural market prices** directly from the internet using the Government of India's data.gov.in API.

## 📊 How It Works

### Direct Internet API (Primary)
The market demand page fetches prices **directly from the browser** by calling:
- **API**: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`
- **Source**: Government of India Open Data Platform
- **Data**: Official APMC commodity prices
- **No backend required** - runs entirely in browser JavaScript

### Fallback: Static MSP Prices
When internet is unavailable, the system uses:
- Government MSP 2025-26 rates (Minimum Support Prices)
- Always available offline

## 🚀 Usage

### No Setup Required!
Just open the market demand page and select a crop. Prices are fetched automatically from the internet.

### Visual Indicators
- 🟢 **Live Internet Data** = Real-time from data.gov.in
- 📊 **Estimated Price** = Static fallback rates

## 🔧 How It Works

### Frontend Code (market-demand.html)
```javascript
// Direct API call to data.gov.in
const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
    ?api-key=YOUR_KEY&format=json&filters[commodity]=Wheat`;

const response = await fetch(apiUrl);
const data = await response.json();
// Display real prices from data.records
```

### Crop Name Mapping
The system automatically tries multiple name variations:
- `wheat` → `['Wheat', 'Wheat (Dara)']`
- `tomato` → `['Tomato', 'Tomato Hybrid']`
- `onion` → `['Onion', 'Onion Red']`

## 💰 Crops Covered

### Major Crops (30+)
- Cereals: Wheat, Rice, Maize, Jowar, Bajra
- Pulses: Tur, Moong, Urad, Chana
- Oilseeds: Groundnut, Soybean, Cotton
- Vegetables: Tomato, Onion, Potato, Cabbage, Cauliflower
- Fruits: Mango, Banana, Grapes, Pomegranate, Orange, Apple
- Spices: Chilli, Turmeric, Garlic, Ginger

## 📈 Price Data Format

API returns data like:
```json
{
  "records": [
    {
      "commodity": "Wheat",
      "market": "Pune",
      "modal_price": "2450",
      "unit": "Quintal",
      "arrival_date": "2026-01-05"
    }
  ]
}
```

The frontend converts to per-kg prices:
- Quintal ÷ 100 = Per kg price
- Ton ÷ 1000 = Per kg price

## 🛠️ Configuration

### API Key (Optional)
The system uses a public API key by default. For higher rate limits:
1. Get free API key from: https://data.gov.in
2. Update in `market-demand.html`:
```javascript
this.dataGovApiKey = 'YOUR_NEW_API_KEY_HERE';
```

## 🐛 Troubleshooting

### "No internet data" message
- Check internet connection
- data.gov.in may be temporarily down
- System will use MSP fallback automatically

### Prices not updating
- Refresh the page
- Check browser console for API errors
- Verify network connectivity

## 🎯 Benefits

✅ **No backend required** - runs in browser
✅ **Real government data** - official APMC prices
✅ **Instant updates** - fetches on each page load
✅ **Offline fallback** - MSP prices always available
✅ **Simple architecture** - just HTML + JavaScript

---

**Note**: Market prices come from official government APMC data. Prices update daily when markets report to AGMARKNET.
