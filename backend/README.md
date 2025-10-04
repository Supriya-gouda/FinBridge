# FinBridge Backend - Smart Alerts & Financial Health

Express.js backend for FinBridge with Smart Alerts and Financial Health Score features.

## Features Implemented

### Smart Alerts System
- ✅ Create, read, update, delete alerts
- ✅ Mark alerts as read
- ✅ Filter alerts by type, priority, status
- ✅ Upcoming alerts (next 7 days)
- ✅ Automatic alert generation based on user data
- ✅ Alert settings management
- ✅ Multiple alert types: bills, EMIs, investments, goals, market updates

### Financial Health Score
- ✅ Comprehensive score calculation with 6 components:
  - Financial literacy (20% weight)
  - Savings rate (20% weight)
  - Debt management (15% weight)
  - Insurance coverage (10% weight)
  - Emergency fund (20% weight)
  - Investment activity (15% weight)
- ✅ Score history and trend analysis
- ✅ Detailed breakdown with recommendations
- ✅ Resilience insights and risk assessment

## Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup
1. Create a new Supabase project at https://supabase.com
2. In your Supabase dashboard, go to SQL Editor
3. Execute the SQL schema from `schema.sql` file
4. Update your `.env` file with the Supabase credentials

### 4. Run the Server
```powershell
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:4000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Smart Alerts
- `POST /api/alerts` - Create new alert
- `GET /api/alerts` - Get user alerts (with filters)
- `GET /api/alerts/upcoming` - Get upcoming alerts
- `PATCH /api/alerts/:alertId/read` - Mark alert as read
- `PATCH /api/alerts/:alertId` - Update alert
- `DELETE /api/alerts/:alertId` - Delete alert
- `POST /api/alerts/generate` - Generate automatic alerts
- `GET /api/alerts/settings` - Get alert settings
- `PUT /api/alerts/settings` - Update alert settings

### Financial Health
- `GET /api/health-score` - Get latest financial health score
- `POST /api/health-score/calculate` - Calculate new score
- `GET /api/health-score/history` - Get score history
- `GET /api/health-score/breakdown` - Get detailed breakdown
- `GET /api/resilience/insights` - Get resilience insights

## API Usage Examples

### Create Alert
```javascript
POST /api/alerts
Headers: { "X-User-ID": "user-123" }
Body: {
  "type": "bill",
  "title": "Credit Card Bill Due",
  "description": "Your credit card bill is due soon",
  "amount": 15000,
  "dueDate": "2025-10-10",
  "priority": "high",
  "frequency": "monthly"
}
```

### Get User Alerts
```javascript
GET /api/alerts?enabled=true&priority=high&limit=10
Headers: { "X-User-ID": "user-123" }
```

### Calculate Financial Health Score
```javascript
POST /api/health-score/calculate
Headers: { "X-User-ID": "user-123" }
```

## Database Schema

The system uses the following main tables:
- `smart_alerts` - User alerts and notifications
- `resilience_scores` - Financial health scores
- `transactions` - User financial transactions
- `goals` - User financial goals
- `user_progress` - Learning progress tracking
- `alert_settings` - User alert preferences

## Data Requirements

For the financial health score to work properly, the system needs:
1. **Transaction data** (income, expenses, investments, savings)
2. **Goal data** (financial goals with targets and progress)
3. **Learning progress** (completed modules and lessons)

## Authentication

Currently uses a simplified authentication system with `X-User-ID` header for demo purposes. In production, integrate with:
- Supabase Auth (recommended)
- JWT tokens
- Session-based auth

## Error Handling

All endpoints return standardized responses:
```javascript
// Success
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}

// Error
{
  "success": false,
  "error": "Error description"
}
```

## Development Notes

- The backend gracefully handles missing Supabase credentials for development
- Row Level Security (RLS) is enabled on all tables
- All database operations use prepared statements
- CORS is configured for frontend development

## Testing

Test the API endpoints:
```powershell
# Health check
curl http://localhost:4000/api/health

# Create alert (replace with actual user ID)
curl -X POST http://localhost:4000/api/alerts ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: demo-user-123" ^
  -d "{\"type\":\"bill\",\"title\":\"Test Alert\",\"description\":\"Test description\"}"

# Get alerts
curl http://localhost:4000/api/alerts?userId=demo-user-123
```

## Production Deployment

1. Set up proper environment variables
2. Configure database with production credentials
3. Enable SSL/HTTPS
4. Set up proper authentication
5. Configure CORS for production domain
6. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **Database connection fails**
   - Check Supabase credentials in `.env`
   - Verify Supabase project is active
   - Check network connectivity

2. **CORS errors**
   - Verify frontend URL in CORS configuration
   - Check if frontend is running on expected port

3. **Missing data for score calculation**
   - Ensure user has transaction data
   - Add sample goals and progress data
   - Check database constraints

### Debug Mode
Set `NODE_ENV=development` for detailed error logging.
