@echo off
REM SmartSheti Translation API Startup Script
REM Provides real-time translation: English ↔ Hindi ↔ Marathi

echo ========================================
echo SmartSheti Translation API Server
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

REM Check and install required packages
echo Checking required packages...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing Flask...
    pip install flask flask-cors requests
    if errorlevel 1 (
        echo ERROR: Failed to install required packages
        pause
        exit /b 1
    )
)

echo.
echo Starting Translation API Server...
echo.
echo Supported Languages:
echo   - English (en)
echo   - Hindi (hi)
echo   - Marathi (mr)
echo.
echo The server will be available at:
echo   http://localhost:5001/api/translate
echo.
echo Press Ctrl+C to stop the server
echo.

python translation_api.py

pause
