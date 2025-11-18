# SmartSheti Project Structure

This document describes the organized structure of the SmartSheti agricultural platform project.

## Directory Structure

```
College pbl/
├── frontend/                    # Frontend files
│   ├── html/                   # HTML pages
│   │   ├── Home page.html
│   │   ├── Weather_page(3).html
│   │   ├── crop_suggestion page(2).html
│   │   ├── crop_price_trends.html
│   │   ├── market_demand.html
│   │   ├── market_demand_fixed.html
│   │   ├── price_monitor.html
│   │   ├── debug_panel.html
│   │   └── test_python_integration.html
│   ├── js/                     # JavaScript files
│   │   ├── translations.js      # Multi-language support
│   │   ├── translations_simple.js
│   │   ├── maharashtra-locations.js
│   │   ├── market_data_manager.js
│   │   └── python_bridge.js
│   ├── css/                    # Stylesheets
│   │   ├── Home page.css
│   │   ├── Weather_page(3).css
│   │   ├── crop_suggestion page(2).css
│   │   ├── crop_price_trends.css
│   │   ├── market_demand.css
│   │   ├── market_demand_fixed.css
│   │   ├── price_monitor.css
│   │   ├── debug_panel.css
│   │   └── test_python_integration.css
│   └── assets/                 # Static assets
│       └── images/            # Images and icons
│           └── plant-logo.svg
│
├── backend/                     # Backend files
│   ├── python/                 # Python scripts
│   │   ├── agmarknet_scraper.py
│   │   ├── enhanced_agmarknet_scraper.py
│   │   ├── dynamic_price_updater.py
│   │   ├── demo_dynamic_graphs.py
│   │   ├── price_chart_generator.py
│   │   ├── pest.py
│   │   └── __pycache__/       # Python cache files
│   ├── api/                    # API files
│   │   ├── backend_api.py
│   │   ├── enhanced_price_api.py
│   │   └── price_update_api.py
│   └── requirements.txt        # Python dependencies
│
├── data/                       # Data files
│   ├── json/                   # JSON data files
│   │   ├── market_data.json
│   │   ├── market_summary.json
│   │   ├── prices.json
│   │   ├── prices_backup.json
│   │   └── wheat_price_trends.json
│   └── csv/                    # CSV data files
│       └── market_data.csv
│
├── logs/                       # Log files
│   ├── agmarknet_scraper.log
│   └── price_scraper.log
│
├── scripts/                    # Utility scripts
│   └── run_scraper.bat
│
├── docs/                       # Documentation
│   └── README_SCRAPER.md
│
└── PROJECT_STRUCTURE.md        # This file
```

## File Descriptions

### Frontend
- **HTML Pages**: All user interface pages including home, weather, crop suggestions, and market data
- **JavaScript**: Client-side logic, translations, and API integrations
- **Assets**: Static files like images, icons, and logos

### Backend
- **Python Scripts**: Data scraping, processing, and analysis scripts
- **API**: REST API endpoints for frontend-backend communication
- **Requirements**: Python package dependencies

### Data
- **JSON**: Structured data files for market prices, summaries, and trends
- **CSV**: Tabular data exports and imports

### Logs
- Application logs for debugging and monitoring

### Scripts
- Utility and automation scripts

### Documentation
- Project documentation and README files

## Getting Started

1. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. Start the backend API server:
   ```bash
   python backend/api/backend_api.py
   ```

3. Open the frontend:
   - Open `frontend/html/Home page.html` in a web browser

## Development Guidelines

- Keep HTML files in `frontend/html/`
- Keep JavaScript files in `frontend/js/`
- Keep Python scripts in `backend/python/`
- Keep API endpoints in `backend/api/`
- Keep data files organized by type in `data/`
- Keep logs in `logs/` directory
- Update this structure document when adding new directories

## Next Steps for Organization

1. ✅ **COMPLETED**: Create CSS files in `frontend/css/` for styling
2. ✅ **COMPLETED**: Move API-related Python files to `backend/api/`
3. ✅ **COMPLETED**: Extract embedded CSS from HTML files to separate CSS files
4. Create separate modules for different functionalities
5. Add proper documentation for each module
6. Implement proper configuration management

## Recent Updates

### CSS Extraction Complete ✅
- Extracted embedded CSS from all HTML files
- Created corresponding CSS files in `frontend/css/`:
  - `Home page.css`
  - `Weather_page(3).css`
  - `crop_suggestion page(2).css`
  - `crop_price_trends.css`
  - `market_demand.css`
  - `market_demand_fixed.css`
  - `price_monitor.css`
  - `debug_panel.css`
  - `test_python_integration.css`
- Updated HTML files to link to external CSS files
- Improved maintainability and separation of concerns