// Database schema and initialization
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not found. Some features may not work.');
  console.warn('   Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
}

const supabase = supabaseUrl && supabaseKey ? 
  createClient(supabaseUrl, supabaseKey) : 
  null;

// SQL to create missing tables for Smart Alerts feature
const createMissingTablesSQL = `
-- Add missing tables for Smart Alerts & Financial Health

-- 1. Add missing columns to existing resilience_scores table
ALTER TABLE public.resilience_scores 
ADD COLUMN IF NOT EXISTS investment_score integer;

-- 2. Create smart_alerts table for notifications and alerts
CREATE TABLE IF NOT EXISTS public.smart_alerts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(user_id) ON DELETE CASCADE,
    alert_type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    amount numeric(12,2),
    due_date date,
    priority character varying(10) DEFAULT 'medium',
    enabled boolean DEFAULT true,
    frequency character varying(20) DEFAULT 'monthly',
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT smart_alerts_pkey PRIMARY KEY (id)
);

-- 3. Create alert_settings table for user preferences
CREATE TABLE IF NOT EXISTS public.alert_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(user_id) ON DELETE CASCADE,
    bill_reminders boolean DEFAULT true,
    investment_opportunities boolean DEFAULT true,
    goal_progress boolean DEFAULT true,
    market_updates boolean DEFAULT true,
    emi_reminders boolean DEFAULT true,
    budget_alerts boolean DEFAULT true,
    emergency_fund_low boolean DEFAULT true,
    spending_spikes boolean DEFAULT false,
    budget_limit numeric(12,2) DEFAULT 25000,
    emergency_fund_target numeric(12,2) DEFAULT 100000,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT alert_settings_pkey PRIMARY KEY (id),
    CONSTRAINT alert_settings_user_id_unique UNIQUE (user_id)
);

-- 4. Update transactions table to include transaction_type if missing
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS transaction_type character varying(20) DEFAULT 'expense';

-- 5. Update goals table to include goal_type and status if missing
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS goal_type character varying(50),
ADD COLUMN IF NOT EXISTS status character varying(20) DEFAULT 'active';

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_smart_alerts_user_id ON public.smart_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_type_enabled ON public.smart_alerts(alert_type, enabled);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_due_date ON public.smart_alerts(due_date);
CREATE INDEX IF NOT EXISTS idx_resilience_scores_user_id ON public.resilience_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_resilience_scores_calculated_at ON public.resilience_scores(calculated_at);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_alert_settings_user_id ON public.alert_settings(user_id);
`;

// Functions to initialize database
const initializeDatabase = async () => {
  try {
    console.log('🚀 FinBridge Backend Starting...');
    console.log('📊 Database Schema Information:');
    console.log('   - Using existing Supabase database');
    console.log('   - Tables: users, transactions, goals, resilience_scores, notifications, etc.');
    console.log('   - New tables needed: smart_alerts, alert_settings');
    console.log('');
    console.log('📋 To complete the setup, run this SQL in your Supabase SQL Editor:');
    console.log('================================================');
    console.log(createMissingTablesSQL);
    console.log('================================================');
    console.log('');
    console.log('✅ Backend ready! API endpoints available:');
    console.log('   📢 Smart Alerts:');
    console.log('      GET  /api/alerts - Get user alerts');
    console.log('      POST /api/alerts - Create new alert');
    console.log('      PATCH /api/alerts/:id/read - Mark alert as read');
    console.log('      GET  /api/alerts/upcoming - Get upcoming alerts');
    console.log('      POST /api/alerts/generate - Generate automatic alerts');
    console.log('      GET/PUT /api/alerts/settings - Manage alert settings');
    console.log('');
    console.log('   🏥 Financial Health:');
    console.log('      GET  /api/health-score - Get latest score');
    console.log('      POST /api/health-score/calculate - Calculate new score');
    console.log('      GET  /api/health-score/history - Get score history');
    console.log('      GET  /api/health-score/breakdown - Get detailed breakdown');
    console.log('      GET  /api/resilience/insights - Get resilience insights');
    console.log('');
    console.log('💡 Use X-User-ID header or userId query param for authentication');
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
};

// Sample data for testing
const sampleData = {
  demoUser: {
    user_id: 'demo-user-123',
    name: 'Demo User',
    email: 'demo@finbridge.com'
  },
  sampleTransactions: [
    {
      user_id: 'demo-user-123',
      transaction_date: new Date().toISOString().split('T')[0],
      description: 'Salary Credit',
      amount: 50000,
      category: 'Income',
      transaction_type: 'income'
    },
    {
      user_id: 'demo-user-123',
      transaction_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Grocery Shopping',
      amount: 2500,
      category: 'Food',
      transaction_type: 'expense'
    },
    {
      user_id: 'demo-user-123',
      transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Mutual Fund SIP',
      amount: 5000,
      category: 'Investment',
      transaction_type: 'investment'
    }
  ],
  sampleGoals: [
    {
      user_id: 'demo-user-123',
      title: 'Emergency Fund',
      description: 'Build 6 months emergency fund',
      target_amount: 300000,
      current_amount: 150000,
      target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: 'Emergency',
      goal_type: 'emergency_fund',
      status: 'active'
    }
  ]
};

module.exports = {
  supabase,
  createMissingTablesSQL,
  initializeDatabase,
  sampleData
};