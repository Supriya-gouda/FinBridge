# 🚀 Quick Start Testing Commands

## Step 1: Start Backend (Run these commands in order)

```powershell
# Open PowerShell and run these commands one by one:

# 1. Navigate to backend directory
cd "E:\Hackthon\FinBridge\backend"

# 2. Verify you're in the right location
pwd
ls

# 3. Start the backend server
node index.js
```

**Expected Output:**
```
🚀 Starting FinBridge Backend...
📝 Environment variables loaded from: E:\Hackthon\FinBridge\backend\.env
🔗 Supabase URL: Set ✅
🔑 Supabase Key: Set ✅
✅ FinBridge backend listening on port 4000
🌐 Health check: http://localhost:4000/health
```

## Step 2: Test Backend (Open NEW PowerShell window)

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET

# Expected response:
# {
#   "status": "ok",
#   "uptime": 123.456,
#   "features": ["Smart Alerts", "Financial Health Score", "Database Integration"]
# }
```

## Step 3: Start Frontend (Open ANOTHER PowerShell window)

```powershell
# 1. Navigate to frontend directory
cd "E:\Hackthon\FinBridge\frontend"

# 2. Start frontend server
npm run dev
```

**Expected Output:**
```
VITE v7.1.9  ready in 2672 ms
➜  Local:   http://localhost:8080/
```

## Step 4: Access Application

1. **Open browser and go to:** `http://localhost:8080`
2. **You should see:** FinBridge landing page

## Step 5: Test Smart Alerts API

```powershell
# Create a test alert
$newAlert = @{
    user_id = "test-user-123"
    type = "bill"
    title = "Test Bill Reminder"
    message = "Your electricity bill is due in 3 days"
    priority = "high"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/alerts" -Method POST -Body $newAlert -ContentType "application/json"
```

## Step 6: Test Financial Health Score

```powershell
# Get health score
Invoke-RestMethod -Uri "http://localhost:4000/api/health-score?user_id=test-user-123" -Method GET

# Calculate new score
$scoreData = @{
    user_id = "test-user-123"
    financial_literacy = 85
    savings_rate = 75
    debt_management = 90
    insurance_coverage = 70
    emergency_fund = 80
    investment_portfolio = 85
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/health-score/calculate" -Method POST -Body $scoreData -ContentType "application/json"
```

## 🔧 Troubleshooting

**If backend won't start:**
1. Make sure you're in `E:\Hackthon\FinBridge\backend` directory
2. Check if index.js exists: `ls index.js`
3. Try: `node .\index.js` (with backslash)

**If frontend won't start:**
1. Make sure you're in `E:\Hackthon\FinBridge\frontend` directory  
2. Run: `npm install` first if needed
3. Then: `npm run dev`

**If APIs don't respond:**
1. Check backend is running on port 4000
2. Test with browser: `http://localhost:4000/health`
3. Check for firewall blocking

## 📋 Success Checklist

- [ ] Backend starts without errors
- [ ] Health endpoint responds
- [ ] Frontend loads at localhost:8080
- [ ] Can create alerts via API
- [ ] Can calculate health scores
- [ ] Frontend connects to backend