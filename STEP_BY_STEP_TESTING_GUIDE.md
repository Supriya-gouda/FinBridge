# 🧪 FinBridge Step-by-Step Manual Testing Guide

## 📋 **Prerequisites & Setup**

### Step 1: Verify Project Structure
```
E:\Hackthon\FinBridge\
├── backend/          # Express.js API server
├── frontend/         # React TypeScript app
├── SETUP_DATABASE.sql # Database migration script
└── Documentation files
```

### Step 2: Check Required Software
- ✅ **Node.js** (v14 or higher)
- ✅ **PowerShell** (for testing commands)
- ✅ **Web Browser** (Chrome/Edge recommended)
- ✅ **Supabase Account** (for database)

---

## 🚀 **Phase 1: Backend Setup & Testing**

### Step 3: Start Backend Server
1. **Open PowerShell as Administrator**
2. **Navigate to backend directory:**
   ```powershell
   cd E:\Hackthon\FinBridge\backend
   ```

3. **Verify files exist:**
   ```powershell
   ls
   # Should show: index.js, package.json, .env, etc.
   ```

4. **Install dependencies (if needed):**
   ```powershell
   npm install
   ```

5. **Start the backend server:**
   ```powershell
   node index.js
   ```

6. **Expected Output:**
   ```
   🚀 Starting FinBridge Backend...
   📝 Environment variables loaded from: E:\Hackthon\FinBridge\backend\.env
   🔗 Supabase URL: Set ✅
   🔑 Supabase Key: Set ✅
   ✅ FinBridge backend listening on port 4000
   🌐 Health check: http://localhost:4000/health
   ```

### Step 4: Test Backend Health
1. **Keep the backend terminal open**
2. **Open a new PowerShell window**
3. **Test basic health endpoint:**
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET
   ```

4. **Expected Response:**
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

5. **Test API health endpoint:**
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method GET
   ```

6. **Expected Response:**
   ```json
   {
     "status": "ok",
     "message": "FinBridge API is running",
     "endpoints": {
       "smart_alerts": "/api/alerts",
       "financial_health": "/api/health-score"
     }
   }
   ```

---

## 🌐 **Phase 2: Frontend Setup & Testing**

### Step 5: Start Frontend Server
1. **Open another PowerShell window**
2. **Navigate to frontend directory:**
   ```powershell
   cd E:\Hackthon\FinBridge\frontend
   ```

3. **Install dependencies (if needed):**
   ```powershell
   npm install
   ```

4. **Start the frontend server:**
   ```powershell
   npm run dev
   ```

5. **Expected Output:**
   ```
   VITE v7.1.9  ready in 2672 ms
   ➜  Local:   http://localhost:8080/
   ➜  Network: http://192.168.x.x:8080/
   ```

### Step 6: Access Frontend Interface
1. **Open your web browser**
2. **Navigate to:** `http://localhost:8080`
3. **You should see:** FinBridge landing page with hero section

---

## 🗄️ **Phase 3: Database Setup**

### Step 7: Setup Supabase Database
1. **Log into your Supabase dashboard**
2. **Open SQL Editor**
3. **Copy the contents of `E:\Hackthon\FinBridge\SETUP_DATABASE.sql`**
4. **Paste and execute the SQL script**
5. **Verify tables were created:**
   - `smart_alerts`
   - `alert_settings` 
   - Updated `resilience_scores`, `transactions`, `goals`

---

## 📊 **Phase 4: Financial Health Score Testing**

### Step 8: Test Financial Health API
1. **In PowerShell, test getting health score:**
   ```powershell
   $testUser = "test-user-123"
   Invoke-RestMethod -Uri "http://localhost:4000/api/health-score?user_id=$testUser" -Method GET
   ```

2. **Expected Response:**
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
     }
   }
   ```

### Step 9: Test Score Calculation
1. **Calculate new health score:**
   ```powershell
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

2. **Expected Response:**
   ```json
   {
     "success": true,
     "score": 80,
     "message": "Health score calculated successfully"
   }
   ```

---

## 📢 **Phase 5: Smart Alerts Testing**

### Step 10: Test Alerts API
1. **Get existing alerts:**
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:4000/api/alerts?userId=test-user-123" -Method GET
   ```

2. **Create a new alert:**
   ```powershell
   $newAlert = @{
       user_id = "test-user-123"
       type = "bill"
       title = "Electricity Bill Due"
       message = "Your electricity bill of Rs. 2,500 is due in 3 days"
       priority = "high"
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "http://localhost:4000/api/alerts" -Method POST -Body $newAlert -ContentType "application/json"
   ```

3. **Expected Response:**
   ```json
   {
     "success": true,
     "alert": {
       "id": "uuid-here",
       "title": "Electricity Bill Due",
       "message": "Your electricity bill of Rs. 2,500 is due in 3 days",
       "priority": "high",
       "is_read": false
     }
   }
   ```

### Step 11: Test Alert Settings
1. **Update alert preferences:**
   ```powershell
   $settings = @{
       user_id = "test-user-123"
       bill_reminders = $true
       investment_opportunities = $true
       goal_progress = $false
       market_insights = $true
       emi_reminders = $true
       budget_limit = 50000
       emergency_fund_target = 100000
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "http://localhost:4000/api/alerts/settings" -Method POST -Body $settings -ContentType "application/json"
   ```

---

## 🖥️ **Phase 6: Frontend Interface Testing**

### Step 12: Test Dashboard Page
1. **Navigate to:** `http://localhost:8080`
2. **Check Dashboard elements:**
   - ✅ Financial Health Score displays (0-100)
   - ✅ Score breakdown shows 6 components
   - ✅ Recent alerts section appears
   - ✅ Quick action buttons visible

### Step 13: Test Smart Alerts Page
1. **Navigate to:** `http://localhost:8080` → Click "Smart Alerts" in navigation
2. **Test Alert List:**
   - ✅ Alerts load and display
   - ✅ Different alert types shown (bill, investment, etc.)
   - ✅ Priority indicators visible (High/Medium/Low)
   - ✅ Timestamps show correctly

3. **Test Alert Interactions:**
   - ✅ Click "Mark as Read" on an alert
   - ✅ Click "Delete" on an alert (with confirmation)
   - ✅ Use filter buttons (All, Unread, High Priority)

### Step 14: Test Alert Settings Panel
1. **Click "Settings" button on Smart Alerts page**
2. **Test each setting:**
   - ✅ Toggle "Bill Reminders" on/off
   - ✅ Toggle "Investment Opportunities" on/off
   - ✅ Toggle "Goal Progress" on/off
   - ✅ Toggle "Market Insights" on/off
   - ✅ Toggle "EMI Reminders" on/off
   - ✅ Enter budget limit (e.g., 50000)
   - ✅ Enter emergency fund target (e.g., 100000)

3. **Save settings and verify:**
   - ✅ Click "Save Settings" button
   - ✅ Success toast notification appears
   - ✅ Settings persist when reopening panel

### Step 15: Test Create New Alert
1. **Click "Create Alert" button**
2. **Fill out the form:**
   - **Type:** Select from dropdown (bill, investment, goal, etc.)
   - **Title:** Enter custom title
   - **Message:** Enter detailed message
   - **Priority:** Select High/Medium/Low
   - **Amount:** Enter optional amount

3. **Submit and verify:**
   - ✅ Click "Create Alert" button
   - ✅ Success notification appears
   - ✅ New alert appears in the list
   - ✅ Form resets after creation

---

## 🎯 **Phase 7: End-to-End Workflow Testing**

### Step 16: Complete User Journey Test
1. **Start fresh:** Clear browser cache/storage
2. **Visit Dashboard:** Check initial state
3. **View Alerts:** Should show empty or sample data
4. **Configure Settings:** Set personal preferences
5. **Create Multiple Alerts:** Different types and priorities
6. **Test Filtering:** Use all filter options
7. **Mark as Read:** Test status changes
8. **Delete Alerts:** Test removal functionality
9. **Check Health Score:** Verify calculations update

### Step 17: Cross-Browser Testing
1. **Test in Chrome:** All functionality works
2. **Test in Edge:** All functionality works
3. **Test in Firefox:** All functionality works
4. **Check mobile view:** Responsive design works

---

## ✅ **Phase 8: Validation Checklist**

### Backend API Validation
- [ ] Health endpoints respond correctly (200 status)
- [ ] Smart Alerts CRUD operations work
- [ ] Financial Health Score calculations accurate
- [ ] Error handling works (test with invalid data)
- [ ] CORS allows frontend requests
- [ ] Database connections stable

### Frontend Interface Validation
- [ ] All pages load without console errors
- [ ] API integration works (network tab shows successful requests)
- [ ] UI components render correctly
- [ ] User interactions provide immediate feedback
- [ ] Toast notifications appear and disappear
- [ ] Responsive design works on different screen sizes
- [ ] Navigation between pages works

### Data Persistence Validation
- [ ] Alert settings persist across browser sessions
- [ ] Created alerts remain after page refresh
- [ ] Health scores update and save correctly
- [ ] Marked as read status persists
- [ ] Deleted alerts don't reappear

---

## 🐛 **Phase 9: Error Scenarios Testing**

### Step 18: Test Error Handling
1. **Backend Down Scenario:**
   - Stop backend server
   - Try to use frontend
   - Should show connection error messages

2. **Invalid Data Scenario:**
   ```powershell
   # Test with invalid user ID
   Invoke-RestMethod -Uri "http://localhost:4000/api/alerts?userId=invalid" -Method GET
   ```

3. **Network Issues:**
   - Test with slow network
   - Test with intermittent connectivity

---

## 🎉 **Success Criteria**

### ✅ Complete Success Indicators:
1. **Backend running stable** on port 4000
2. **Frontend accessible** on port 8080
3. **All API endpoints responding** with correct data
4. **Database operations working** (create, read, update, delete)
5. **UI fully functional** with proper error handling
6. **Real-time updates** between frontend and backend
7. **Settings persist** across sessions
8. **Responsive design** works on all devices

### 📊 Performance Benchmarks:
- API response time: < 500ms
- Page load time: < 3 seconds
- Database query time: < 200ms
- UI interaction responsiveness: < 100ms

---

## 🔧 **Troubleshooting Guide**

### Common Issues & Solutions:

**Issue 1: "Cannot connect to backend"**
- Solution: Ensure backend is running on port 4000
- Check: `netstat -ano | findstr :4000`

**Issue 2: "TypeScript compilation errors"**
- Solution: Run `npm install` in frontend directory
- Check: All dependencies are installed

**Issue 3: "Database connection failed"**
- Solution: Verify Supabase credentials in `.env`
- Check: Internet connectivity to Supabase

**Issue 4: "CORS errors in browser"**
- Solution: Backend already configured for localhost:8080
- Check: Frontend is running on correct port

**Issue 5: "Alerts not loading"**
- Solution: Run database migration script
- Check: Required tables exist in Supabase

---

## 📱 **Advanced Testing (Optional)**

### Mobile Device Testing:
1. Connect mobile device to same network
2. Access `http://[your-ip]:8080`
3. Test touch interactions
4. Verify responsive layout

### Performance Testing:
1. Create 100+ alerts and test loading
2. Test with multiple browser tabs
3. Check memory usage over time
4. Test rapid API calls

### Security Testing:
1. Test with malicious input data
2. Check for XSS vulnerabilities
3. Verify HTTPS in production
4. Test authentication boundaries

---

This comprehensive guide covers all aspects of manual testing for your FinBridge application. Follow each step sequentially for best results!