# SmartSheti - Agricultural Platform

SmartSheti is a comprehensive agricultural platform that provides farmers with intelligent crop suggestions, real-time weather information, market demand analysis, and price monitoring tools.

## Features

- **Crop Suggestions**: Personalized crop recommendations based on location, soil type, and climate conditions
- **Weather Information**: Real-time weather updates with pest risk analysis and irrigation advice
- **Market Demand**: Live market prices and demand analysis
- **Multi-language Support**: Available in English, Hindi, and Marathi
- **Price Monitoring**: Real-time agricultural commodity price tracking

## Project Structure

```
College pbl/
├── frontend/          # Frontend files (HTML, JS, CSS, Assets)
├── backend/           # Backend files (Python scripts, APIs)
├── data/              # Data files (JSON, CSV)
├── logs/              # Application logs
├── scripts/           # Utility scripts
└── docs/              # Documentation
```

## Installation

1. **Clone or download the project**

2. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start the backend server:**
   ```bash
   python api/backend_api.py
   ```

4. **Open the frontend:**
   - Navigate to `frontend/html/`
   - Open `Home page.html` in your web browser

## Usage

### For Farmers
1. Open the home page
2. Select your preferred language (English/Hindi/Marathi)
3. Use the crop suggestion tool by entering your location and soil details
4. Check weather information and pest risk analysis
5. Monitor market prices and demand for your crops

### For Developers
1. Frontend files are in `frontend/` directory
2. Backend Python scripts are in `backend/python/`
3. API endpoints are in `backend/api/`
4. Data files are organized in `data/` directory

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python, Flask (for APIs)
- **Data**: JSON, CSV files
- **Scraping**: BeautifulSoup, Requests
- **Charts**: Chart.js (for data visualization)

## Configuration

- Edit `backend/api/backend_api.py` to configure API endpoints
- Modify `frontend/js/translations.js` to add more languages
- Update data sources in scraping scripts as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## File Organization Guidelines

- **HTML files**: Place in `frontend/html/`
- **JavaScript files**: Place in `frontend/js/`
- **CSS files**: Place in `frontend/css/`
- **Python scripts**: Place in `backend/python/`
- **API files**: Place in `backend/api/`
- **Data files**: Place in `data/json/` or `data/csv/`
- **Images/Assets**: Place in `frontend/assets/images/`

## License

This project is developed for educational purposes as part of a college project.

## Support

For support or questions about this project, please refer to the documentation in the `docs/` directory or contact the development team.

---

**Note**: This is a college project (PBL - Project Based Learning) focused on developing a comprehensive agricultural platform for farmers.
