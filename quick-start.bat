echo Starting FinBridge Backend...
cd /d "d:\FinBridge\FinBridge\backend"
start "FinBridge Backend" cmd /k "node index.js"

timeout /t 3

echo Starting FinBridge Frontend...
cd /d "d:\FinBridge\FinBridge\frontend"  
start "FinBridge Frontend" cmd /k "npm run dev"

echo.
echo FinBridge is starting!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:8080
echo.
echo Wait a moment then open http://localhost:8080 in your browser
pause