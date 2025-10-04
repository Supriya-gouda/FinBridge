# Crowd Wisdom Tracker - API Testing

## Test the Backend API

To test the Crowd Wisdom API endpoints, follow these steps:

### 1. Start the Backend Server
```powershell
cd backend
npm install
npm start
```

The server will start on http://localhost:4000

### 2. Test API Endpoints

#### Health Check
```
GET http://localhost:4000/api/health
```

#### Save a Metric
```
POST http://localhost:4000/api/crowd/metrics
Content-Type: application/json

{
  "user_id": "test-user-1",
  "metric": "savings_rate", 
  "value": 25.5
}
```

#### Compare Metrics
```
GET http://localhost:4000/api/crowd/compare/test-user-1/savings_rate
```

### 3. Test Frontend

```powershell
cd frontend
npm install
npm run dev
```

Navigate to http://localhost:8080/crowd-wisdom

## Features Implemented

### Backend (Express.js)
- ✅ POST `/api/crowd/metrics` - Save user financial metrics
- ✅ GET `/api/crowd/compare/:userId/:metric` - Compare with community
- ✅ In-memory storage (ready for Supabase integration)
- ✅ Input validation and error handling
- ✅ Percentile calculation algorithm

### Frontend (React + TypeScript)  
- ✅ CrowdWisdom.tsx page component
- ✅ Metric selection dropdown (4 financial metrics)
- ✅ Value input with validation
- ✅ Community comparison visualization
- ✅ Percentile rank display with progress bar
- ✅ Responsive design matching FinBridge theme
- ✅ Authentication integration
- ✅ Dashboard navigation card

### Integration
- ✅ Added route to App.tsx (/crowd-wisdom)
- ✅ Added navigation card to Dashboard
- ✅ Updated Supabase types for crowd_wisdom table
- ✅ CORS configured for frontend-backend communication

## Available Metrics

1. **Savings Rate (%)** - Percentage of income saved monthly
2. **Debt-to-Income Ratio (%)** - Total debt as percentage of monthly income  
3. **Emergency Fund (Months)** - Months of expenses covered by emergency fund
4. **Investment Allocation (%)** - Percentage of income allocated to investments

## Usage Flow

1. User selects a financial metric from dropdown
2. User enters their value for that metric
3. System saves to crowd_wisdom table via API
4. System calculates user's percentile rank vs community
5. Display results with visualization:
   - User's value
   - Community average
   - Percentile rank (0-100)
   - Performance message and progress bar

## Database Schema

```sql
CREATE TABLE crowd_wisdom (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  metric VARCHAR NOT NULL,
  value DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, metric)
);
```

## Next Steps

1. **Backend Enhancement**: Replace in-memory storage with Supabase
2. **Additional Metrics**: Add more financial health indicators
3. **Historical Tracking**: Store metric history over time
4. **Demographics**: Add age/income brackets for better comparisons
5. **Gamification**: Add badges for top performers
6. **Anonymization**: Enhanced privacy features