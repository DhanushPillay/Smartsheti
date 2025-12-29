# SmartSheti - Agricultural Decision Support Platform

A web-based agricultural platform designed to assist farmers in Maharashtra with crop planning, weather monitoring, and market price information. The application provides multilingual support (English, Hindi, and Marathi) and is accessible as a Progressive Web App.

**Live Website:** [https://smartsheti-rho.vercel.app](https://smartsheti-rho.vercel.app)

---

## Overview

SmartSheti is a student project developed as part of Project Based Learning at MIT-ADT University. The platform integrates multiple agricultural data sources to provide farmers with crop recommendations, weather forecasts, and market price trends through a user-friendly web interface.

---

## Features

### Crop Recommendation System
- Provides crop suggestions based on user-inputted parameters (soil type, location, water availability)
- Uses a rule-based algorithm to match crops with local conditions
- Displays estimated profitability based on static market price data
- Limited to common crops grown in Maharashtra region

### Weather Information
- Integrates OpenWeatherMap API for current weather conditions
- Displays temperature, humidity, precipitation, and wind data
- Provides basic pest risk indicators based on weather conditions
- Location search functionality for Maharashtra districts and villages

### Market Price Tracking
- Displays agricultural commodity prices from available data sources
- Shows basic price trend visualization (8-week historical data)
- Covers major crops: wheat, rice, cotton, onions, and others
- Compares prices across major APMC markets in Maharashtra

### Progressive Web App (PWA)
- Installable on mobile devices and desktop browsers
- Basic offline functionality through service worker caching
- Responsive design for mobile and desktop viewing

### Multilingual Interface
- Supports English, Hindi, and Marathi languages
- Uses combination of translation API and custom dictionary
- Manual language selection available

---

## Technical Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Tailwind CSS for styling
- Leaflet.js for mapping
- Material Icons

**Backend:**
- Python 3.8+
- Flask-based REST APIs
- Web scraping with BeautifulSoup4 and Selenium

**Deployment:**
- Vercel (Frontend & Serverless Functions)
- Static data files (JSON)

---

## Known Limitations and Issues

### Data Accuracy
- **Market prices** are not truly real-time; they depend on manual scraping from government websites that may update irregularly
- **Weather data** is limited to OpenWeatherMap's free tier accuracy
- **Crop recommendations** use simplified rule-based logic rather than machine learning models
- Price trend data is limited and may not reflect actual market volatility

### Technical Constraints
- **Web scraping reliability**: Government data sources (AgMarkNet) frequently change their HTML structure, breaking scrapers
- **No database**: All data is stored in static JSON files, limiting scalability and update frequency
- **API rate limits**: Free-tier weather API has request limitations
- **Translation quality**: Automated translations may not be contextually accurate for agricultural terminology
- **No user authentication**: Cannot save user preferences or track individual farms

### User Experience
- **Limited offline functionality**: Only cached pages work offline; dynamic data requires internet connection
- **Mobile responsiveness**: Some pages may have layout issues on smaller screens
- **No notification system**: Cannot alert users about price changes or weather warnings
- **Limited crop database**: Covers only common Maharashtra crops, not region-specific varieties

### Development Status
- **Beta/Educational Project**: Built for learning purposes, not production-grade
- **Maintenance**: Limited ongoing development; data scrapers may break without regular updates
- **No warranty**: Recommendations should not be solely relied upon for financial decisions

---

## Setup and Installation

### Prerequisites
```bash
Python 3.8 or higher
Git
```

### Local Development

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

3. **Run the backend API** (optional for local testing)
```bash
python api/simple_price_api.py
```

4. **Serve the frontend**
```bash
# From the root directory
python -m http.server 8080
```

5. **Access the application**
```
Open browser: http://localhost:8080
```

---

## Project Structure

```
farmer/
├── frontend/
│   ├── html/           # Web pages
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript modules
│   └── assets/         # Images and static files
├── backend/
│   ├── api/            # Flask API endpoints
│   ├── python/         # Data scraping scripts
│   └── prices.json     # Market price data store
├── data/
│   ├── json/           # Static data files
│   └── csv/            # CSV data exports
├── docs/               # Documentation files
├── index.html          # Main entry point
├── manifest.json       # PWA manifest
└── service-worker.js   # Service worker for PWA
```

---

## Data Sources

- **Weather Data**: OpenWeatherMap API (free tier)
- **Market Prices**: AgMarkNet (Government of India), data.gov.in
- **Geographic Data**: Manual compilation of Maharashtra districts and talukas
- **Translation**: MyMemory Translation API + custom dictionary

**Note**: Data accuracy and availability depend on third-party sources that may be unavailable or outdated.

---

## Development Team

**Developers:** Dhanush Pillay, Shubhangini Dixit  
**Institution:** MIT-ADT University  
**Project Type:** Academic Project (Project Based Learning)  
**Year:** 2024-2025

---

## Disclaimer

This is an educational project developed for learning purposes. The agricultural recommendations, market prices, and weather predictions provided by this platform are based on limited data sources and simplified algorithms. 

**Important:**
- Do not make significant financial or agricultural decisions based solely on this platform
- Always consult with local agricultural experts and extension officers
- Market prices shown may not reflect real-time values
- Weather forecasts are subject to third-party API accuracy
- The developers assume no liability for decisions made using this platform

---

## License

This project is developed for educational purposes. Please contact the developers for usage permissions.

---

## Future Improvements Needed

- Implement proper database for dynamic data management
- Integrate real-time market price APIs
- Develop machine learning models for crop recommendations
- Add user authentication and personalized farm profiles
- Build automated testing for web scrapers
- Implement push notifications for price alerts
- Expand crop database with regional varieties
- Improve translation accuracy for agricultural terms
- Add soil testing integration
- Develop mobile native applications for better offline support
