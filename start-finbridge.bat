@echo off
echo Starting FinBridge Application...
echo.

echo Installing Backend Dependencies...
cd /d "d:\FinBridge\FinBridge\backend"
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo Starting Backend Server...
start "FinBridge Backend" cmd /k "npm start"
timeout /t 3

echo Installing Frontend Dependencies...
cd /d "d:\FinBridge\FinBridge\frontend"
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Starting Frontend Development Server...
start "FinBridge Frontend" cmd /k "npm run dev"

echo.
echo ================================
echo FinBridge Application Starting...
echo ================================
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:8080
echo.
echo Both servers are starting in separate windows.
echo Wait a few moments then navigate to http://localhost:8080
echo.
pause