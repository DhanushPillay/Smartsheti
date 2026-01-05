# Market Price Setup Guide

## 🚀 Quick Start

**No setup required!** The market demand page fetches prices directly from the internet.

## How It Works

The frontend JavaScript calls the **data.gov.in API** directly:
1. User selects a crop
2. Browser fetches real prices from government API
3. Prices display with "🟢 Live Internet Data" badge

## Price Sources

### 1. 🟢 Internet API (Primary)
- **What**: data.gov.in government commodity prices
- **How**: Direct browser fetch (no backend)
- **Update**: Real-time on each page load

### 2. 📊 MSP Fallback
- **What**: Minimum Support Prices 2025-26
- **When**: If internet unavailable
- **Note**: Always works offline

## What You'll See

### In Market Demand Page:
```
Price: ₹24.25/kg
🟢 Live Internet Data    ← Green badge = real data
```

### Badge Meanings:
- **🟢 Live Internet Data** = Fresh from government API
- **📊 Estimated Price** = Fallback MSP rates

## Configuration (Optional)

### Change API Key
If you hit rate limits, get your own key from https://data.gov.in

Edit `market-demand.html`:
```javascript
this.dataGovApiKey = 'YOUR_API_KEY_HERE';
```

## Troubleshooting

### "No internet data"
- Check your internet connection
- System auto-uses fallback prices

### Prices seem old
- Refresh the page to fetch latest
- Government data updates daily

## Summary

✅ **Just use the website** - prices fetch automatically
✅ **No backend needed** - direct API calls from browser  
✅ **Offline support** - MSP fallback always works

---

The system is designed to work out-of-the-box with zero configuration! 🌾
