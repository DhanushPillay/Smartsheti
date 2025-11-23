# AGMARKNET Market Data Integration

This project integrates live agricultural market data from AGMARKNET (https://agmarknet.gov.in/) into the SmartSheti platform's market demand page.

## 🚀 Features

- **Real-time Market Data**: Scrapes commodity prices from AGMARKNET
- **Multiple Markets**: Covers major APMCs in Maharashtra
- **Price Trends**: 7-day price trend analysis
- **Dynamic Updates**: Auto-refreshing market data every 5 minutes
- **Fallback System**: Mock data when live data isn't available
- **Export Options**: Data export to JSON and CSV formats

## 📁 Files Overview

### Python Scraper
- `backend/python/agmarknet_scraper.py` - Main web scraping script
- `backend/requirements.txt` - Python dependencies
- `scripts/run_scraper.bat` - Easy-to-run batch file for Windows

### JavaScript Integration
- `frontend/js/market_data_manager.js` - Handles data loading and UI updates
- `frontend/html/market-demand.html` - Integrated with live data display

### Generated Data Files
- `data/json/market_data.json` - Complete market data
- `data/json/market_summary.json` - Aggregated market summary
- `data/json/wheat_price_trends.json` - Price trend data
- `data/csv/market_data.csv` - Data in CSV format for analysis

## 🛠️ Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Scraper

#### Option A: Use the batch file (Windows)
```bash
run_scraper.bat
```

#### Option B: Run directly
```bash
python agmarknet_scraper.py
```

### 3. Open Market Demand Page
Open `market_demand.html` in your browser to see the live data integration.

## 📊 Data Structure

### Market Data Format
```json
{
  "commodity": "Wheat",
  "variety": "Local",
  "grade": "FAQ",
  "min_price": 2400,
  "max_price": 2600,
  "modal_price": 2500,
  "unit": "Quintal",
  "arrivals": 450,
  "market": "Pune APMC",
  "district": "Pune",
  "state": "Maharashtra",
  "date": "2025-07-29",
  "trend": "+5%"
}
```

### Markets Covered
- Mumbai APMC
- Pune APMC
- Nashik APMC
- Nagpur APMC
- Aurangabad APMC

## 🔄 How It Works

1. **Data Scraping**: Python script scrapes AGMARKNET for latest prices
2. **Data Processing**: Processes and formats data into JSON files
3. **Auto-Loading**: JavaScript automatically loads fresh data
4. **UI Updates**: Market demand page displays real-time information
5. **Auto-Refresh**: Data refreshes every 5 minutes automatically

## 🌐 Web Scraping Considerations

### Legal & Ethical
- Respects robots.txt guidelines
- Implements reasonable delays between requests
- Uses appropriate User-Agent headers
- For educational and agricultural development purposes

### Technical Features
- Retry logic for failed requests
- Error handling and logging
- Rate limiting to prevent server overload
- Fallback to mock data when needed

## 📈 Market Data Features

### Price Trends
- 7-day price history
- Visual chart representation
- Percentage change indicators
- Trend analysis

### Market Comparison
- Multi-market price comparison
- Real-time price updates
- Market-wise trend analysis

### Demand Analysis
- High-demand commodity identification
- Market sentiment indicators
- Supply-demand balance insights

## 🔧 Customization

### Adding New Markets
Edit the `markets` list in `agmarknet_scraper.py`:

```python
markets = [
    {"market": "Your APMC", "district": "Your District", "state": "Your State"},
    # ... add more markets
]
```

### Changing Update Frequency
Modify the update interval in `market_data_manager.js`:

```javascript
this.updateInterval = 5 * 60 * 1000; // 5 minutes (in milliseconds)
```

### Adding New Commodities
The scraper automatically detects available commodities from AGMARKNET.

## 🚨 Troubleshooting

### Common Issues

1. **No data files generated**: 
   - Check internet connection
   - Verify AGMARKNET website is accessible
   - Check Python dependencies are installed

2. **Page shows mock data**: 
   - Run the scraper first to generate JSON files
   - Ensure files are in the same directory as HTML file

3. **Scraper fails**: 
   - AGMARKNET website structure may have changed
   - Check logs in `agmarknet_scraper.log`

### Debug Mode
Enable detailed logging by running:
```bash
python agmarknet_scraper.py --debug
```

## 📋 Dependencies

### Python Packages
- `requests` - HTTP requests
- `beautifulsoup4` - HTML parsing
- `lxml` - XML/HTML parser
- `selenium` - Browser automation (if needed)
- `pandas` - Data manipulation
- `numpy` - Numerical operations

### Browser Requirements
- Modern browser with JavaScript enabled
- Internet connection for live data

## 🔮 Future Enhancements

- **Real-time Alerts**: Price change notifications
- **Historical Analysis**: Long-term trend analysis
- **Predictive Models**: Price forecasting
- **More Markets**: Pan-India market coverage
- **API Integration**: Direct AGMARKNET API integration
- **Mobile App**: Mobile-responsive design

## 📞 Support

For issues or questions:
1. Check the generated log files
2. Verify all dependencies are installed
3. Ensure internet connectivity
4. Review AGMARKNET website status

## ⚖️ Legal Notice

This tool is for educational and agricultural development purposes. Please respect AGMARKNET's terms of service and use responsibly. The tool implements ethical scraping practices with appropriate delays and error handling.

---

**Note**: AGMARKNET's website structure may change. The scraper includes fallback mechanisms and mock data to ensure the application continues to function even when live data is unavailable.
