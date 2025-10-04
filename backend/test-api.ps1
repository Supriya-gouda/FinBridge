# PowerShell API Testing Script for FinBridge Backend
# This script tests all API endpoints to identify bugs and issues

$API_BASE_URL = "http://localhost:4000"
$TEST_USER_ID = "test-user-123"

$totalTests = 0
$passedTests = 0
$failedTests = 0

# Function to make HTTP requests
function Test-APIEndpoint {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    $global:totalTests++
    
    try {
        Write-Host "`n🔍 $Method $Url" -ForegroundColor Cyan
        
        # Add default headers
        $Headers["X-User-ID"] = $TEST_USER_ID
        $Headers["Content-Type"] = "application/json"
        
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
        }
        
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            Write-Host "📤 Request Body: $jsonBody" -ForegroundColor Yellow
            $params.Body = $jsonBody
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        Write-Host "✅ SUCCESS - Status: 200" -ForegroundColor Green
        Write-Host "📥 Response: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        
        $global:passedTests++
        return $response
        
    } catch {
        Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            Write-Host "📊 Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
        
        $global:failedTests++
        return $null
    }
}

# Function to test without authentication
function Test-APIEndpoint-NoAuth {
    param(
        [string]$Method,
        [string]$Url
    )
    
    $global:totalTests++
    
    try {
        Write-Host "`n🔍 $Method $Url (No Auth)" -ForegroundColor Cyan
        
        $response = Invoke-RestMethod -Uri $Url -Method $Method -ErrorAction Stop
        Write-Host "❌ UNEXPECTED SUCCESS - Should have required auth" -ForegroundColor Red
        $global:failedTests++
        return $false
        
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✅ SUCCESS - Correctly returned 401 Unauthorized" -ForegroundColor Green
            $global:passedTests++
            return $true
        } else {
            Write-Host "❌ FAILED - Expected 401 but got $($_.Exception.Response.StatusCode)" -ForegroundColor Red
            $global:failedTests++
            return $false
        }
    }
}

Write-Host "🚀 Starting FinBridge API Tests" -ForegroundColor Magenta
Write-Host "=" * 60 -ForegroundColor Magenta

# Test 1: Health Endpoints
Write-Host "`n🏥 Testing Health Endpoints..." -ForegroundColor Blue

Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/health" -Headers @{}
Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/health" -Headers @{}

# Test 2: Smart Alerts API
Write-Host "`n🔔 Testing Smart Alerts API..." -ForegroundColor Blue

# Create an alert
$newAlert = @{
    alert_type = "bill"
    title = "Test Credit Card Bill"
    description = "Your test credit card bill is due in 3 days"
    priority = "high"
    due_date = "2025-01-15"
    amount = 5000
}

$createdAlert = Test-APIEndpoint -Method "POST" -Url "$API_BASE_URL/api/alerts" -Body $newAlert

# Get user alerts
$userAlerts = Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/alerts"

# Get filtered alerts
Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/alerts?type=bill&priority=high"

# Get upcoming alerts
Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/alerts/upcoming"

# Generate automatic alerts
Test-APIEndpoint -Method "POST" -Url "$API_BASE_URL/api/alerts/generate"

# Get alert settings
Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/alerts/settings"

# Update alert settings
$alertSettings = @{
    bill_reminders = $true
    investment_opportunities = $false
    budget_limit = 30000
}

Test-APIEndpoint -Method "PUT" -Url "$API_BASE_URL/api/alerts/settings" -Body $alertSettings

# If we have alerts, test marking as read and deleting
if ($userAlerts -and $userAlerts.data -and $userAlerts.data.Count -gt 0) {
    $alertId = $userAlerts.data[0].id
    
    # Mark as read
    Test-APIEndpoint -Method "PATCH" -Url "$API_BASE_URL/api/alerts/$alertId/read"
    
    # Delete alert
    Test-APIEndpoint -Method "DELETE" -Url "$API_BASE_URL/api/alerts/$alertId"
}

# Test 3: Financial Health API
Write-Host "`n📊 Testing Financial Health API..." -ForegroundColor Blue

# Calculate new score
Test-APIEndpoint -Method "POST" -Url "$API_BASE_URL/api/health-score/calculate"

# Get latest score
Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/health-score"

# Get score breakdown
Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/health-score/breakdown"

# Get score history
Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/health-score/history"

# Get resilience insights
Test-APIEndpoint -Method "GET" -Url "$API_BASE_URL/api/resilience/insights"

# Test 4: Error Handling
Write-Host "`n⚠️ Testing Error Handling..." -ForegroundColor Yellow

# Test authentication requirement
Test-APIEndpoint-NoAuth -Method "GET" -Url "$API_BASE_URL/api/alerts"

# Test invalid data
$invalidAlert = @{
    description = "Invalid alert - missing required fields"
}

Test-APIEndpoint -Method "POST" -Url "$API_BASE_URL/api/alerts" -Body $invalidAlert

# Test 404 endpoint
try {
    Invoke-RestMethod -Uri "$API_BASE_URL/api/nonexistent" -Method "GET" -ErrorAction Stop
    Write-Host "❌ FAILED - Should have returned 404" -ForegroundColor Red
    $global:failedTests++
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ SUCCESS - Correctly returned 404" -ForegroundColor Green
        $global:passedTests++
    } else {
        Write-Host "❌ FAILED - Expected 404 but got $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $global:failedTests++
    }
}
$global:totalTests++

# Final Results
Write-Host "`n" + "=" * 60 -ForegroundColor Magenta
Write-Host "📊 TEST SUMMARY" -ForegroundColor Magenta
Write-Host "=" * 60 -ForegroundColor Magenta
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests ✅" -ForegroundColor Green
Write-Host "Failed: $failedTests ❌" -ForegroundColor Red
$successRate = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 1) } else { 0 }
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -gt 80) { "Green" } elseif ($successRate -gt 60) { "Yellow" } else { "Red" })

Write-Host "`n🎯 RECOMMENDATIONS:" -ForegroundColor Cyan
if ($failedTests -eq 0) {
    Write-Host "✅ All tests passed! Your API is working correctly." -ForegroundColor Green
    Write-Host "✅ Ready for database migration and frontend integration." -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Common issues:" -ForegroundColor Yellow
    Write-Host "   - Database tables may not exist (run SETUP_DATABASE.sql)" -ForegroundColor Yellow
    Write-Host "   - Supabase credentials missing in .env file" -ForegroundColor Yellow
    Write-Host "   - Backend server may not be running" -ForegroundColor Yellow
}

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. 🗃️ Run database migration (SETUP_DATABASE.sql) in Supabase" -ForegroundColor White
Write-Host "2. 🔑 Verify Supabase credentials in .env file" -ForegroundColor White
Write-Host "3. 🌐 Test frontend integration" -ForegroundColor White
Write-Host "4. 🚀 Deploy to production" -ForegroundColor White