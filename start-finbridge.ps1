# FinBridge Application Startup Script - Enhanced Version
# Run this script to start both backend and frontend servers

Write-Host "🚀 Starting FinBridge Application..." -ForegroundColor Green
Write-Host ""

# Function to check if a process is running on a port
function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
        return !$connection.TcpTestSucceeded
    } catch {
        return $true
    }
}

# Check Node.js and npm
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    pause; exit 1
}

try {
    $npmVersion = npm --version 2>$null  
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    pause; exit 1
}

Write-Host ""

# Backend Setup
Write-Host "📦 Setting up Backend Server..." -ForegroundColor Yellow
Set-Location "d:\FinBridge\FinBridge\backend"

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install --silent

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
    
    # Check if port 4000 is available
    if (!(Test-Port 4000)) {
        Write-Host "⚠️ Port 4000 is busy. Trying to start anyway..." -ForegroundColor Yellow
    }
    
    Write-Host "🚀 Starting backend server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\FinBridge\FinBridge\backend'; Write-Host 'FinBridge Backend Starting...' -ForegroundColor Green; npm start" -WindowStyle Normal
    
    Start-Sleep -Seconds 3
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    pause; exit 1
}

# Frontend Setup  
Write-Host "📦 Setting up Frontend Server..." -ForegroundColor Yellow
Set-Location "d:\FinBridge\FinBridge\frontend"

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install --silent

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
    
    # Check if port 8080 is available
    if (!(Test-Port 8080)) {
        Write-Host "⚠️ Port 8080 is busy. Vite will use alternative port." -ForegroundColor Yellow
    }
    
    Write-Host "🚀 Starting frontend development server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\FinBridge\FinBridge\frontend'; Write-Host 'FinBridge Frontend Starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal
    
    Start-Sleep -Seconds 3
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    pause; exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "🎉 FinBridge Application Started!" -ForegroundColor Green  
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Servers:" -ForegroundColor White
Write-Host "  Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Open your browser and go to:" -ForegroundColor White
Write-Host "  http://localhost:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ New Feature Available:" -ForegroundColor Magenta
Write-Host "  Dashboard → Crowd Wisdom Tracker" -ForegroundColor Gray
Write-Host "  Compare your financial metrics with peers!" -ForegroundColor Gray
Write-Host ""
Write-Host "Both servers are running in separate windows." -ForegroundColor White
Write-Host "Wait 30-60 seconds for full startup, then open the browser." -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")