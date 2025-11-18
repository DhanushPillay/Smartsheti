@echo off
echo ====================================
echo    AGMARKNET Market Data Scraper
echo ====================================
echo.

echo Installing required Python packages...
pip install -r requirements.txt

echo.
echo Starting market data scraping...
python agmarknet_scraper.py

echo.
echo Scraping completed! Check the generated files:
echo - market_data.json
echo - market_data.csv  
echo - market_summary.json
echo - wheat_price_trends.json
echo.

echo The market demand page will now show live data!
echo Open market_demand.html in your browser to see the results.
echo.
pause
