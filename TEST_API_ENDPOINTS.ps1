# 🧪 FinBridge API Testing Script
# Run this script to test all API endpoints

Write-Host "🚀 Starting FinBridge API Testing..." -ForegroundColor Green
Write-Host "📋 Prerequisites: Backend should be running on port 4000" -ForegroundColor Yellow

# Test 1: Health Endpoints
Write-Host "`n🔍 Test 1: Health Check Endpoints" -ForegroundColor Cyan
try {
    Write-Host "Testing /health..." -ForegroundColor White
    $health = Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET
    Write-Host "✅ Health endpoint working!" -ForegroundColor Green
    $health | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    Write-Host "`nTesting /api/health..." -ForegroundColor White
    $apiHealth = Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method GET
    Write-Host "✅ API health endpoint working!" -ForegroundColor Green
    $apiHealth | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ API health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Smart Alerts Endpoints
Write-Host "`n📢 Test 2: Smart Alerts API" -ForegroundColor Cyan
$testUserId = "test-user-" + (Get-Random -Maximum 1000)
Write-Host "Using test user ID: $testUserId" -ForegroundColor Yellow

# Get alerts
try {
    Write-Host "`nTesting GET /api/alerts..." -ForegroundColor White
    $alerts = Invoke-RestMethod -Uri "http://localhost:4000/api/alerts?userId=$testUserId" -Method GET
    Write-Host "✅ Get alerts working!" -ForegroundColor Green
    $alerts | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Get alerts failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Create new alert
try {
    Write-Host "`nTesting POST /api/alerts..." -ForegroundColor White
    $newAlert = @{
        user_id = $testUserId
        type = "bill"
        title = "Test Bill Reminder"
        message = "This is a test bill reminder for Rs. 2,500"
        priority = "high"
    } | ConvertTo-Json

    $createdAlert = Invoke-RestMethod -Uri "http://localhost:4000/api/alerts" -Method POST -Body $newAlert -ContentType "application/json"
    Write-Host "✅ Create alert working!" -ForegroundColor Green
    $createdAlert | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Create alert failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test alert settings
try {
    Write-Host "`nTesting POST /api/alerts/settings..." -ForegroundColor White
    $settings = @{
        user_id = $testUserId
        bill_reminders = $true
        investment_opportunities = $true
        goal_progress = $false
        market_insights = $true
        emi_reminders = $true
        budget_limit = 50000
        emergency_fund_target = 100000
    } | ConvertTo-Json

    $savedSettings = Invoke-RestMethod -Uri "http://localhost:4000/api/alerts/settings" -Method POST -Body $settings -ContentType "application/json"
    Write-Host "✅ Alert settings working!" -ForegroundColor Green
    $savedSettings | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Alert settings failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Financial Health Score
Write-Host "`n📊 Test 3: Financial Health Score API" -ForegroundColor Cyan

# Get health score
try {
    Write-Host "`nTesting GET /api/health-score..." -ForegroundColor White
    $healthScore = Invoke-RestMethod -Uri "http://localhost:4000/api/health-score?user_id=$testUserId" -Method GET
    Write-Host "✅ Get health score working!" -ForegroundColor Green
    $healthScore | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Get health score failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Calculate health score
try {
    Write-Host "`nTesting POST /api/health-score/calculate..." -ForegroundColor White
    $scoreData = @{
        user_id = $testUserId
        financial_literacy = 85
        savings_rate = 75
        debt_management = 90
        insurance_coverage = 70
        emergency_fund = 80
        investment_portfolio = 85
    } | ConvertTo-Json

    $calculatedScore = Invoke-RestMethod -Uri "http://localhost:4000/api/health-score/calculate" -Method POST -Body $scoreData -ContentType "application/json"
    Write-Host "✅ Calculate health score working!" -ForegroundColor Green
    $calculatedScore | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Calculate health score failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Error Handling
Write-Host "`n🚨 Test 4: Error Handling" -ForegroundColor Cyan

try {
    Write-Host "`nTesting invalid endpoint..." -ForegroundColor White
    $invalidResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/invalid-endpoint" -Method GET
} catch {
    Write-Host "✅ Error handling working! (Expected 404)" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "📝 Check the results above for any failed tests" -ForegroundColor Yellow
Write-Host "🌐 Frontend should be accessible at: http://localhost:8080" -ForegroundColor Cyan