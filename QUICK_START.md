# Quick Start Guide - SmartSheti Market Price System

## 🚀 5-Minute Deployment

### Step 1: Install Dependencies

```powershell
# Install Python packages
pip install requests beautifulsoup4 lxml Flask Flask-CORS

# OR use requirements file
pip install -r requirements.txt
```

### Step 2: Test Locally

```powershell
# Set UTF-8 encoding for console (Windows)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Test the scraper
python backend\python\multi_source_price_scraper.py wheat rice tomato

# Expected output:
# ✅ Found price ₹24/kg from data.gov.in API
# OR fallback to MandiPrices/MSP
```

### Step 3: Consolidate Initial Price Data

```powershell
# Fetch and save prices for all crops
python consolidate_prices.py

# This creates/updates: data/json/prices.json
```

### Step 4: Test Vercel API Locally

```powershell
# Start local server
python api\index.py

# Opens on http://localhost:5000
# Test in browser:
# http://localhost:5000/api/health
# http://localhost:5000/api/realprice/wheat
```

### Step 5: Deploy to Vercel

```powershell
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Note the deployment URL, e.g.:
# https://farmer-abc123.vercel.app
```

### Step 6: Verify Deployment

Visit these URLs (replace with your Vercel URL):

```
https://your-app.vercel.app/
https://your-app.vercel.app/api/health
https://your-app.vercel.app/api/realprice/wheat
https://your-app.vercel.app/frontend/html/market-demand.html
```

---

## ✅ Verification Checklist

### Backend API
- [ ] `/api/health` returns `{"status": "healthy"}`
- [ ] `/api/realprice/wheat` returns price data
- [ ] Price is NOT ₹25 (should be real data or MSP ~₹24)
- [ ] Response includes `source`, `confidence`, `historical_prices`

### Frontend
- [ ] Open market-demand.html in browser
- [ ] Select "Wheat" → Price displays immediately
- [ ] Badge shows "🟢 LIVE Data" or "🔵 Recent Data" (NOT "Loading...")
- [ ] Chart displays with 8 data points
- [ ] Changing crop updates the display

### Cron Job (After Deployment)
- [ ] Go to Vercel Dashboard → Your Project → Settings → Cron Jobs
- [ ] Verify cron is enabled: `"0 * * * *"` (hourly)
- [ ] Trigger manually: `curl https://your-app.vercel.app/api/cron/update-prices`
- [ ] Check response for success

---

## 🐛 Quick Troubleshooting

### "Price still shows ₹25/kg"

**Fix:**
1. Check browser DevTools → Console tab for errors
2. Check Network tab → Look for `/api/realprice/wheat` request
3. If 404: Check Vercel deployment included `api/index.py`
4. If 500: Check Vercel function logs

**Quick test:**
```javascript
// In browser console on market-demand.html
priceFetcher.generatePriceData('wheat', 'Maharashtra', 'Pune')
  .then(d => console.log('Got price:', d.current_price))
```

### "Connection errors when running scraper"

This is **NORMAL** - data.gov.in sometimes throttles requests or has connectivity issues.

**Expected behavior:**
```
INFO: Trying source: data.gov.in API (priority 1)
ERROR: Connection error for Wheat
INFO: Trying source: MandiPrices.com (priority 2)
INFO: ℹ️ Using MSP Rate ₹24/kg for wheat
```

**The scraper will:**
1. Try data.gov.in (may fail due to network/rate limits)
2. Fallback to MandiPrices.com
3. As last resort, use MSP rates
4. **Always return a valid price**

### "Cron job not running"

**Verify cron configuration in vercel.json:**
```json
{
  "crons": [{
    "path": "/api/cron/update-prices",
    "schedule": "0 * * * *"
  }]
}
```

**Manual trigger:**
```powershell
curl "https://your-app.vercel.app/api/cron/update-prices"
```

---

## 📊 What Changed vs Original Code

### ✅ Fixed Issues
1. **Prices now display correctly** (was stuck at ₹25/kg)
2. **Badge updates** (was stuck at "Loading...")
3. **Multi-source reliability** (was single-source with failures)
4. **Automatic updates** (was manual-only)

### ✨ New Features
1. **4-source scraping system** (data.gov.in → MandiPrices → AgMarkNet → MSP)
2. **Hourly auto-updates** via Vercel cron
3. **Confidence scoring** (0-100% based on source)
4. **Price prediction** module (moving averages)
5. **Consolidated data** (single prices.json)
6. **Enhanced error handling** (graceful fallbacks)

### 📦 Files Created
- `backend/python/multi_source_price_scraper.py` (800 lines)
- `backend/python/price_predictor.py` (280 lines)
- `api/cron/update-prices.py` (170 lines)
- `consolidate_prices.py` (140 lines)
- `requirements.txt`
- `MARKET_PRICE_OVERHAUL.md` (full documentation)
- `QUICK_START.md` (this file)

### ✏️ Files Modified
- `api/index.py` - Added multi-source support
- `frontend/html/market-demand.html` - Removed 400+ duplicate lines
- `data/json/prices.json` - Consolidated format

---

## 💡 Pro Tips

### For Development

```powershell
# Watch logs while testing
Get-Content logs\price_updates.log -Wait

# Test specific crop
python backend\python\multi_source_price_scraper.py mango

# Test prediction
python backend\python\price_predictor.py
```

### For Production

1. **Monitor Vercel logs** regularly (first week)
2. **Check cron job execution** daily
3. **Verify data freshness** - prices should update hourly
4. **Set up API key rotation** (optional, data.gov.in public key works)

### Performance Optimization

Already implemented:
- ✅ 30-minute cache per source
- ✅ Vercel edge caching (30 min)
- ✅ Confidence-based prioritization
- ✅ Lazy loading in frontend

Future optimizations:
- IndexedDB caching in browser
- Service worker caching
- WebSocket for real-time updates

---

## 📞 Need Help?

**Common Questions:**

**Q: Why does scraper sometimes return MSP fallback?**  
A: data.gov.in API has rate limits and occasional downtime. This is expected - MSP fallback ensures price always displays.

**Q: Can I add more crops?**  
A: Yes! Edit `PRIORITY_CROPS` in `consolidate_prices.py` and `api/cron/update-prices.py`

**Q: How to change update frequency?**  
A: Edit `vercel.json` cron schedule. Current: `"0 * * * *"` (hourly)
- Every 30 min: `"*/30 * * * *"`
- Every 6 hours: `"0 */6 * * *"`

**Q: Prices in quintal or kg?**  
A: All prices displayed in **₹/kg**. Scraper auto-converts quintal → kg

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Opening market-demand.html shows real prices (not ₹25)  
✅ Badge shows data source (not "Loading...")  
✅ Chart displays with historical data  
✅ Changing crops updates prices  
✅ API health check returns 200  
✅ Cron job executes hourly  
✅ prices.json updates automatically  

---

**Last Updated:** February 10, 2026  
**Time to Deploy:** ~5-10 minutes  
**Difficulty:** ⭐⭐☆☆☆ (Easy-Medium)
