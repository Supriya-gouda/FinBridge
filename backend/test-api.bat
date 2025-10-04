@echo off
echo 🚀 FinBridge API Testing Script
echo ================================

set API_BASE_URL=http://localhost:4000
set TEST_USER_ID=test-user-123

echo.
echo 🏥 Testing Health Endpoints...
echo.

echo Testing /health endpoint:
curl -s -X GET %API_BASE_URL%/health
echo.
echo.

echo Testing /api/health endpoint:
curl -s -X GET %API_BASE_URL%/api/health
echo.
echo.

echo 🔔 Testing Smart Alerts API...
echo.

echo Creating a new alert:
curl -s -X POST %API_BASE_URL%/api/alerts ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: %TEST_USER_ID%" ^
  -d "{\"alert_type\":\"bill\",\"title\":\"Test Credit Card Bill\",\"description\":\"Your test credit card bill is due in 3 days\",\"priority\":\"high\",\"due_date\":\"2025-01-15\",\"amount\":5000}"
echo.
echo.

echo Getting user alerts:
curl -s -X GET %API_BASE_URL%/api/alerts ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Getting filtered alerts:
curl -s -X GET "%API_BASE_URL%/api/alerts?type=bill&priority=high" ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Getting upcoming alerts:
curl -s -X GET %API_BASE_URL%/api/alerts/upcoming ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Generating automatic alerts:
curl -s -X POST %API_BASE_URL%/api/alerts/generate ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Getting alert settings:
curl -s -X GET %API_BASE_URL%/api/alerts/settings ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Updating alert settings:
curl -s -X PUT %API_BASE_URL%/api/alerts/settings ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: %TEST_USER_ID%" ^
  -d "{\"bill_reminders\":true,\"investment_opportunities\":false,\"budget_limit\":30000}"
echo.
echo.

echo 📊 Testing Financial Health API...
echo.

echo Calculating financial health score:
curl -s -X POST %API_BASE_URL%/api/health-score/calculate ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Getting latest score:
curl -s -X GET %API_BASE_URL%/api/health-score ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Getting score breakdown:
curl -s -X GET %API_BASE_URL%/api/health-score/breakdown ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Getting score history:
curl -s -X GET %API_BASE_URL%/api/health-score/history ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo Getting resilience insights:
curl -s -X GET %API_BASE_URL%/api/resilience/insights ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo ⚠️ Testing Error Handling...
echo.

echo Testing authentication requirement (should fail):
curl -s -X GET %API_BASE_URL%/api/alerts
echo.
echo.

echo Testing invalid data (should fail):
curl -s -X POST %API_BASE_URL%/api/alerts ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: %TEST_USER_ID%" ^
  -d "{\"description\":\"Invalid alert - missing required fields\"}"
echo.
echo.

echo Testing 404 endpoint (should return 404):
curl -s -X GET %API_BASE_URL%/api/nonexistent ^
  -H "X-User-ID: %TEST_USER_ID%"
echo.
echo.

echo ✅ Testing complete!
echo.
echo 📋 Next Steps:
echo 1. Check if all endpoints returned valid JSON responses
echo 2. Run database migration if you see "table does not exist" errors
echo 3. Verify Supabase credentials if you see connection errors
echo 4. Test frontend integration once backend is working

pause