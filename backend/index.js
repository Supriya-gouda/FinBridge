// Load environment variables first - specify path explicitly
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🚀 Starting FinBridge Backend...');
console.log('📝 Environment variables loaded from:', path.join(__dirname, '.env'));
console.log('📂 Current directory:', __dirname);
console.log('🔗 Supabase URL:', process.env.SUPABASE_URL ? 'Set ✅' : 'Missing ❌');
console.log('🔑 Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌');
console.log('🔌 Port:', process.env.PORT || '4000 (default)');

const express = require('express');
const cors = require('cors');

console.log('📦 Loading modules...');

try {
  const { initializeDatabase } = require('./models/database');
  const smartAlertsRoutes = require('./routes/smartAlerts');
  const financialHealthRoutes = require('./routes/financialHealth');
  const personalityProfilerRoutes = require('./routes/personalityProfiler');
  console.log('✅ All modules loaded successfully');

  const app = express();
  const port = process.env.PORT || 4000;

  // Enable CORS for all routes (allows frontend to communicate with backend)
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'], // Support multiple frontend ports
    credentials: true
  }));

  app.use(express.json());

  console.log('🔧 Configuring routes...');

  // Initialize database schema on startup
  initializeDatabase();

  // API Routes
  app.use('/api', smartAlertsRoutes);
  app.use('/api', financialHealthRoutes);
  app.use('/api', personalityProfilerRoutes);

  // Health check endpoint (separate from API routes)
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      uptime: process.uptime(),
      features: [
        'Smart Alerts',
        'Financial Health Score',
        'Personality Profiler & Behavioral Insights',
        'Database Integration'
      ]
    });
  });

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'FinBridge API is running',
      uptime: process.uptime(),
      endpoints: {
        'smart_alerts': '/api/alerts',
        'financial_health': '/api/health-score',
        'personality_profiler': '/api/personality'
      }
    });
  });

  app.get('/', (req, res) => {
    res.send('FinBridge backend is running with Smart Alerts, Financial Health & Personality Profiler features');
  });

  app.listen(port, () => {
    console.log(`\n🚀 FinBridge Backend Starting...`);
    console.log(`📊 Database Schema Information:`);
    console.log(`   - Using existing Supabase database`);
    console.log(`   - Tables: users, transactions, goals, resilience_scores, notifications, etc.`);
    console.log(`   - New tables needed: smart_alerts, alert_settings, user_personality_profiles, personality_challenges`);
    console.log(`\n📋 To complete the setup, run this SQL in your Supabase SQL Editor:`);
    console.log(`================================================\n`);
    console.log(`-- Add missing tables for Smart Alerts & Financial Health`);
    console.log(`\n-- 1. Add missing columns to existing resilience_scores table`);
    console.log(`ALTER TABLE public.resilience_scores`);
    console.log(`ADD COLUMN IF NOT EXISTS investment_score integer;`);
    console.log(`\n-- 2. Create smart_alerts table for notifications and alerts`);
    console.log(`CREATE TABLE IF NOT EXISTS public.smart_alerts (`);
    console.log(`    id uuid NOT NULL DEFAULT gen_random_uuid(),`);
    console.log(`    user_id uuid REFERENCES public.users(user_id) ON DELETE CASCADE,`);
    console.log(`    alert_type character varying(50) NOT NULL,`);
    console.log(`    title character varying(255) NOT NULL,`);
    console.log(`    description text,`);
    console.log(`    amount numeric(12,2),`);
    console.log(`    due_date date,`);
    console.log(`    priority character varying(10) DEFAULT 'medium',`);
    console.log(`    enabled boolean DEFAULT true,`);
    console.log(`    frequency character varying(20) DEFAULT 'monthly',`);
    console.log(`    is_read boolean DEFAULT false,`);
    console.log(`    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    CONSTRAINT smart_alerts_pkey PRIMARY KEY (id)`);
    console.log(`);`);
    console.log(`\n-- 3. Create alert_settings table for user preferences`);
    console.log(`CREATE TABLE IF NOT EXISTS public.alert_settings (`);
    console.log(`    id uuid NOT NULL DEFAULT gen_random_uuid(),`);
    console.log(`    user_id uuid REFERENCES public.users(user_id) ON DELETE CASCADE,`);
    console.log(`    bill_reminders boolean DEFAULT true,`);
    console.log(`    investment_opportunities boolean DEFAULT true,`);
    console.log(`    goal_progress boolean DEFAULT true,`);
    console.log(`    market_updates boolean DEFAULT true,`);
    console.log(`    emi_reminders boolean DEFAULT true,`);
    console.log(`    budget_alerts boolean DEFAULT true,`);
    console.log(`    emergency_fund_low boolean DEFAULT true,`);
    console.log(`    spending_spikes boolean DEFAULT false,`);
    console.log(`    budget_limit numeric(12,2) DEFAULT 25000,`);
    console.log(`    emergency_fund_target numeric(12,2) DEFAULT 100000,`);
    console.log(`    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    CONSTRAINT alert_settings_pkey PRIMARY KEY (id),`);
    console.log(`    CONSTRAINT alert_settings_user_id_unique UNIQUE (user_id)`);
    console.log(`);`);
    console.log(`\n-- 4. Create user_personality_profiles table`);
    console.log(`CREATE TABLE IF NOT EXISTS public.user_personality_profiles (`);
    console.log(`    id uuid NOT NULL DEFAULT gen_random_uuid(),`);
    console.log(`    user_id uuid REFERENCES public.users(user_id) ON DELETE CASCADE,`);
    console.log(`    personality_type character varying(50) NOT NULL,`);
    console.log(`    assessment_answers jsonb NOT NULL,`);
    console.log(`    assessment_scores jsonb,`);
    console.log(`    confidence_level numeric(5,2) DEFAULT 0,`);
    console.log(`    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    CONSTRAINT personality_profiles_pkey PRIMARY KEY (id),`);
    console.log(`    CONSTRAINT personality_profiles_user_unique UNIQUE (user_id)`);
    console.log(`);`);
    console.log(`\n-- 5. Create personality_challenges table`);
    console.log(`CREATE TABLE IF NOT EXISTS public.personality_challenges (`);
    console.log(`    id uuid NOT NULL DEFAULT gen_random_uuid(),`);
    console.log(`    user_id uuid REFERENCES public.users(user_id) ON DELETE CASCADE,`);
    console.log(`    personality_type character varying(50) NOT NULL,`);
    console.log(`    title character varying(255) NOT NULL,`);
    console.log(`    description text,`);
    console.log(`    target_amount numeric(12,2) DEFAULT 0,`);
    console.log(`    duration_days integer DEFAULT 30,`);
    console.log(`    difficulty character varying(20) DEFAULT 'beginner',`);
    console.log(`    status character varying(20) DEFAULT 'pending',`);
    console.log(`    progress numeric(5,2) DEFAULT 0,`);
    console.log(`    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,`);
    console.log(`    CONSTRAINT personality_challenges_pkey PRIMARY KEY (id)`);
    console.log(`);`);
    console.log(`\n-- 6. Update transactions table to include transaction_type if missing`);
    console.log(`ALTER TABLE public.transactions`);
    console.log(`ADD COLUMN IF NOT EXISTS transaction_type character varying(20) DEFAULT 'expense';`);
    console.log(`\n-- 7. Update goals table to include goal_type and status if missing`);
    console.log(`ALTER TABLE public.goals`);
    console.log(`ADD COLUMN IF NOT EXISTS goal_type character varying(50),`);
    console.log(`ADD COLUMN IF NOT EXISTS status character varying(20) DEFAULT 'active';`);
    console.log(`\n-- 8. Create indexes for better performance`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_smart_alerts_user_id ON public.smart_alerts(user_id);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_smart_alerts_type_enabled ON public.smart_alerts(alert_type, enabled);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_smart_alerts_due_date ON public.smart_alerts(due_date);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_resilience_scores_user_id ON public.resilience_scores(user_id);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_resilience_scores_calculated_at ON public.resilience_scores(calculated_at);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(transaction_type);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_alert_settings_user_id ON public.alert_settings(user_id);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_personality_profiles_user_id ON public.user_personality_profiles(user_id);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_personality_challenges_user_id ON public.personality_challenges(user_id);`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_personality_challenges_status ON public.personality_challenges(status);`);
    console.log(`\n================================================\n`);
    console.log(`✅ Backend ready! API endpoints available:`);
    console.log(`   📢 Smart Alerts:`);
    console.log(`      GET  /api/alerts - Get user alerts`);
    console.log(`      POST /api/alerts - Create new alert`);
    console.log(`      PATCH /api/alerts/:id/read - Mark alert as read`);
    console.log(`      GET  /api/alerts/upcoming - Get upcoming alerts`);
    console.log(`      POST /api/alerts/generate - Generate automatic alerts`);
    console.log(`      GET/PUT /api/alerts/settings - Manage alert settings\n`);
    console.log(`   🏥 Financial Health:`);
    console.log(`      GET  /api/health-score - Get latest score`);
    console.log(`      POST /api/health-score/calculate - Calculate new score`);
    console.log(`      GET  /api/health-score/history - Get score history`);
    console.log(`      GET  /api/health-score/breakdown - Get detailed breakdown`);
    console.log(`      GET  /api/resilience/insights - Get resilience insights\n`);
    console.log(`   🧠 Personality Profiler:`);
    console.log(`      POST /api/personality-profiler/assessment - Complete personality assessment`);
    console.log(`      GET  /api/personality-profiler/profile/:userId - Get user profile`);
    console.log(`      GET  /api/personality-profiler/challenges/:userId - Get personalized challenges`);
    console.log(`      PUT  /api/personality-profiler/challenges/:id/progress - Update challenge progress`);
    console.log(`      GET  /api/personality-profiler/insights/:userId - Get behavioral insights`);
    console.log(`      GET  /api/personality-profiler/types - Get all personality types\n`);
    console.log(`💡 Use X-User-ID header or userId query param for authentication`);
    console.log(`✅ FinBridge backend listening on port ${port}`);
    console.log(`🌐 Health check: http://localhost:${port}/health`);
    console.log(`🔌 API endpoints: http://localhost:${port}/api/health`);
  }).on('error', (error) => {
    console.error('❌ Server startup error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`🚨 Port ${port} is already in use!`);
      console.error(`💡 To fix this:`);
      console.error(`   1. Find the process: netstat -ano | findstr :${port}`);
      console.error(`   2. Kill the process: taskkill /PID <PID> /F`);
      console.error(`   3. Or use a different port: PORT=${port + 1} npm start`);
    }
    process.exit(1);
  });

} catch (error) {
  console.error('❌ Error starting backend:', error);
  process.exit(1);
}
