# FinBridge API Testing Script
# Run this script to test all API endpoints

Write-Host "Starting FinBridge API Testing..." -ForegroundColor Green
Write-Host "Prerequisites: Backend should be running on port 4000" -ForegroundColor Yellow

# Test 1: Health Endpoints
Write-Host "`nTest 1: Health Check Endpoints" -ForegroundColor Cyan
try {
    Write-Host "Testing /health..." -ForegroundColor White
    $health = Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET
    Write-Host "Health endpoint working!" -ForegroundColor Green
    $health | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    Write-Host "`nTesting /api/health..." -ForegroundColor White
    $apiHealth = Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method GET
    Write-Host "API health endpoint working!" -ForegroundColor Green
    $apiHealth | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "API health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Smart Alerts Endpoints
Write-Host "`nTest 2: Smart Alerts API" -ForegroundColor Cyan
$testUserId = "test-user-" + (Get-Random -Maximum 1000)
Write-Host "Using test user ID: $testUserId" -ForegroundColor Yellow

# Get alerts
try {
    Write-Host "`nTesting GET /api/alerts..." -ForegroundColor White
    $alerts = Invoke-RestMethod -Uri "http://localhost:4000/api/alerts?userId=$testUserId" -Method GET
    Write-Host "Get alerts working!" -ForegroundColor Green
    $alerts | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "Get alerts failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAPI Testing Complete!" -ForegroundColor Green
Write-Host "Frontend should be accessible at: http://localhost:8080" -ForegroundColor Cyan