@echo off
REM SmartSheti Price API Startup Script
REM This script starts the real-time price API server

echo ========================================
echo SmartSheti Price API Server
echo ========================================
echo.

cd /d "%~dp0backend\api"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Flask is installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing required packages...
    pip install flask flask-cors
    if errorlevel 1 (
        echo ERROR: Failed to install required packages
        pause
        exit /b 1
    )
)

echo.
echo Starting Price API Server...
echo.
echo The server will be available at:
echo   http://localhost:5000/api/prices
echo.
echo Press Ctrl+C to stop the server
echo.

python simple_price_api.py

pause
