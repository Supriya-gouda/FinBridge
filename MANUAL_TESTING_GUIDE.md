# 🧪 FinBridge Manual Testing Guide

## 📋 **Prerequisites**
- Backend running on: http://localhost:4000
- Frontend running on: http://localhost:8080
- Database: Supabase (SETUP_DATABASE.sql executed)

---

## 🔧 **Test 1: Backend API Health Check**

### 1.1 Basic Health Check
**URL:** http://localhost:4000/health
**Method:** GET
**Expected Response:**
```json
{
  "status": "ok",
  "uptime": 123.456,
  "features": [
    "Smart Alerts",
    "Financial Health Score", 
    "Database Integration"
  ]
}
```

### 1.2 API Health Check  
**URL:** http://localhost:4000/api/health
**Method:** GET
**Expected Response:**
```json
{
  "status": "ok",
  "message": "FinBridge API is running",
  "uptime": 123.456,
  "endpoints": {
    "smart_alerts": "/api/alerts",
    "financial_health": "/api/health-score"
  }
}
```

**Testing Methods:**
```powershell
# Method 1: Browser
# Visit URLs directly in browser

# Method 2: PowerShell
Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET
Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method GET

# Method 3: Curl (if available)
curl http://localhost:4000/health
curl http://localhost:4000/api/health
```

---

## 📢 **Test 2: Smart Alerts API Testing**

### 2.1 Get All Alerts
**URL:** http://localhost:4000/api/alerts
**Method:** GET
**Expected Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "id": 1,
      "user_id": "test-user-123",
      "type": "bill",
      "title": "Electricity Bill Due",
      "message": "Your electricity bill of ₹2,500 is due in 3 days",
      "priority": "high",
      "is_read": false,
      "created_at": "2025-10-04T10:30:00Z"
    }
  ]
}
```

### 2.2 Create New Alert
**URL:** http://localhost:4000/api/alerts
**Method:** POST
**Request Body:**
```json
{
  "user_id": "test-user-123",
  "type": "investment",
  "title": "SIP Due Tomorrow",
  "message": "Your monthly SIP of ₹5,000 is scheduled for tomorrow",
  "priority": "medium"
}
```

**PowerShell Test Command:**
```powershell
$body = @{
    user_id = "test-user-123"
    type = "investment"
    title = "SIP Due Tomorrow"
    message = "Your monthly SIP of ₹5,000 is scheduled for tomorrow"
    priority = "medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/alerts" -Method POST -Body $body -ContentType "application/json"
```

### 2.3 Update Alert Settings
**URL:** http://localhost:4000/api/alerts/settings
**Method:** POST
**Request Body:**
```json
{
  "user_id": "test-user-123",
  "bill_reminders": true,
  "investment_opportunities": true,
  "goal_progress": false,
  "market_insights": true,
  "emi_reminders": true
}
```

---

## 📊 **Test 3: Financial Health Score API**

### 3.1 Get Health Score
**URL:** http://localhost:4000/api/health-score?user_id=test-user-123
**Method:** GET
**Expected Response:**
```json
{
  "success": true,
  "score": 75,
  "breakdown": {
    "financial_literacy": 80,
    "savings_rate": 70,
    "debt_management": 85,
    "insurance_coverage": 60,
    "emergency_fund": 75,
    "investment_portfolio": 80
  },
  "recommendations": [
    "Consider increasing your emergency fund to 6 months of expenses",
    "Review your insurance coverage to ensure adequate protection"
  ]
}
```

### 3.2 Update Health Score
**URL:** http://localhost:4000/api/health-score
**Method:** POST
**Request Body:**
```json
{
  "user_id": "test-user-123",
  "financial_literacy": 85,
  "savings_rate": 75,
  "debt_management": 90,
  "insurance_coverage": 70,
  "emergency_fund": 80,
  "investment_portfolio": 85
}
```

**PowerShell Test:**
```powershell
$healthData = @{
    user_id = "test-user-123"
    financial_literacy = 85
    savings_rate = 75
    debt_management = 90
    insurance_coverage = 70
    emergency_fund = 80
    investment_portfolio = 85
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/health-score" -Method POST -Body $healthData -ContentType "application/json"
```

---

## 🖥️ **Test 4: Frontend Interface Testing**

### 4.1 Dashboard Testing
1. **Navigate to:** http://localhost:8080
2. **Test Scenarios:**
   - ✅ Financial Health Score displays (0-100)
   - ✅ Score breakdown shows 6 components
   - ✅ Recent alerts list appears
   - ✅ Quick action buttons work
   - ✅ Progress indicators animate

### 4.2 Smart Alerts Page Testing
1. **Navigate to:** http://localhost:8080 → Smart Alerts
2. **Test Scenarios:**
   - ✅ Alert list loads and displays
   - ✅ Alert filtering works (All, Unread, High Priority)
   - ✅ Mark as read functionality
   - ✅ Delete alert functionality
   - ✅ Settings panel opens and saves
   - ✅ Manual alert creation
   - ✅ Toast notifications appear

### 4.3 Alert Settings Testing
1. **Open Settings Panel**
2. **Test Each Setting:**
   - ✅ Bill Reminders toggle
   - ✅ Investment Opportunities toggle
   - ✅ Goal Progress toggle
   - ✅ Market Insights toggle
   - ✅ EMI Reminders toggle
   - ✅ Predictive Nudges toggle
   - ✅ Budget Limit input (₹50,000)
   - ✅ Emergency Fund Target (₹100,000)

---

## 🎯 **Test 5: End-to-End Workflow Testing**

### Scenario 1: New User Journey
1. **Visit Dashboard** → Health score shows placeholder
2. **View Alerts** → Empty state displayed
3. **Configure Settings** → Preferences saved
4. **Create Alert** → New alert appears in list
5. **Mark as Read** → Status updates
6. **Health Score Update** → Score recalculates

### Scenario 2: Alert Management
1. **Create Multiple Alerts** (different types/priorities)
2. **Filter by Priority** → Only high priority shown
3. **Mark Some as Read** → Filter shows only unread
4. **Delete Alert** → Confirmation dialog appears
5. **Settings Update** → Preferences persist

---

## ✅ **Success Criteria Checklist**

### Backend API
- [ ] Health endpoints respond correctly
- [ ] Smart Alerts CRUD operations work
- [ ] Financial Health Score calculations accurate
- [ ] Error handling works (try invalid data)
- [ ] CORS allows frontend requests

### Frontend Interface
- [ ] Pages load without errors
- [ ] API integration works
- [ ] UI components render correctly
- [ ] User interactions provide feedback
- [ ] Toast notifications appear
- [ ] Responsive design works

### Database Integration
- [ ] Data persists across sessions
- [ ] Queries return expected results
- [ ] Foreign key relationships work
- [ ] Created/updated timestamps accurate

---

## 🐛 **Common Issues & Solutions**

### Issue 1: Backend Not Starting
**Symptoms:** Cannot connect to API
**Solution:** 
```powershell
cd E:\Hackthon\FinBridge\backend
node index.js
# Check for environment variables in console
```

### Issue 2: Frontend Compilation Errors
**Symptoms:** TypeScript errors in browser
**Solution:**
```powershell
cd E:\Hackthon\FinBridge\frontend
npm install
npm run dev
```

### Issue 3: Database Connection Issues
**Symptoms:** API returns 500 errors
**Solution:**
- Check Supabase credentials in backend/.env
- Ensure SETUP_DATABASE.sql was executed
- Verify network connectivity

### Issue 4: CORS Errors
**Symptoms:** Frontend can't reach backend
**Solution:** Backend already configured for localhost:8080

---

## 📱 **Mobile Testing (Optional)**
- Test on mobile browsers
- Check responsive design
- Verify touch interactions
- Test on different screen sizes