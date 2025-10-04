# Database Setup Guide

## Overview
This guide explains how to set up the database for the FinBridge application with Smart Alerts and Financial Health Score features.

## Prerequisites
- Supabase project created
- Backend server running with Supabase connection

## Step 1: Environment Configuration

Your backend is already configured with these environment variables:
```
SUPABASE_URL=https://uxwhjkqwycwrhmeeppiy.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

## Step 2: Execute Database Migration

1. **Open Supabase SQL Editor**:
   - Go to https://app.supabase.com
   - Select your project
   - Navigate to SQL Editor

2. **Run the Migration Script**:
   - Copy the contents of `SETUP_DATABASE.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**:
   After running the script, you should have these new tables:
   - `smart_alerts` - Stores user alerts
   - `alert_settings` - User alert preferences
   - Sample data will be inserted for testing

## Step 3: Test API Endpoints

Your backend server is running on port 4000. Test these endpoints:

### Smart Alerts API
- `GET http://localhost:4000/api/smart-alerts` - Get all alerts
- `POST http://localhost:4000/api/smart-alerts` - Create alert
- `PATCH http://localhost:4000/api/smart-alerts/:id/read` - Mark as read

### Financial Health API
- `GET http://localhost:4000/api/financial-health/score` - Get latest score
- `POST http://localhost:4000/api/financial-health/calculate` - Calculate new score
- `GET http://localhost:4000/api/financial-health/breakdown` - Get score breakdown

## Step 4: Frontend Integration Status

✅ **Completed**:
- Backend API services implemented
- Frontend API clients created (`smartAlertsAPI.ts`, `financialHealthAPI.ts`)
- Dashboard component updated with real API integration
- Error handling and loading states added

✅ **Current Features**:
- Real-time financial health score calculation
- Smart alerts display on dashboard
- Alert management system
- Score breakdown with recommendations

## Step 5: Next Steps

1. **Execute the database migration** (SETUP_DATABASE.sql)
2. **Test the API endpoints** using the health check
3. **The frontend will automatically connect** to your backend APIs

## API Health Check

Visit `http://localhost:4000/health` to verify your backend is running correctly.

## Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env` file
- Check Supabase project URL and API key
- Ensure RLS policies allow operations

### API Errors
- Check backend console for detailed error messages
- Verify database tables exist after migration
- Test database connection with health endpoint

### Frontend Issues
- Check browser console for API call errors
- Verify backend is running on port 4000
- Ensure CORS is properly configured

## Architecture Summary

```
Frontend (React/TypeScript)
    ↓ API Calls
Backend (Express.js)
    ↓ Database Queries
Supabase (PostgreSQL)
```

Your application now has:
- **Smart Alerts System**: Automated alerts based on user behavior
- **Financial Health Score**: 6-component scoring algorithm
- **Real-time Updates**: Live data from your Supabase database
- **User Dashboard**: Integrated alerts and health score display

## Database Schema

The migration creates:
1. **smart_alerts** table with alert data
2. **alert_settings** table for user preferences
3. Sample alerts for testing
4. Proper indexes for performance

Run the migration and your FinBridge application will be fully functional with all Smart Alerts and Financial Health features!