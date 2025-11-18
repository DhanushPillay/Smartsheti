@echo off
REM SmartSheti - Start All API Services
REM Starts both Price API and Translation API servers

echo ========================================
echo SmartSheti API Services
echo ========================================
echo.
echo Starting all backend services...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org/
    pause
    exit /b 1
)

REM Install required packages
echo Checking and installing required packages...
pip install flask flask-cors requests >nul 2>&1

echo.
echo ========================================
echo Starting Services:
echo ========================================
echo.
echo 1. Price API       - http://localhost:5000
echo 2. Translation API - http://localhost:5001
echo.
echo Both services will start in separate windows.
echo Close this window to stop all services.
echo.

REM Start Price API in new window
start "SmartSheti Price API" cmd /k "cd /d %~dp0backend\api && python simple_price_api.py"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Translation API in new window
start "SmartSheti Translation API" cmd /k "cd /d %~dp0backend\api && python translation_api.py"

echo.
echo ========================================
echo ✅ Services Started Successfully!
echo ========================================
echo.
echo 🌾 Price API:       http://localhost:5000
echo 🌐 Translation API: http://localhost:5001
echo.
echo Check the opened windows for service logs.
echo Press any key to exit this launcher...
echo (Services will continue running in background)
pause >nul
