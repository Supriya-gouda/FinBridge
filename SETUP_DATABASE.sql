-- Smart Alerts & Financial Health Score Extension for FinBridge
-- Run this SQL in your Supabase SQL Editor to add the missing tables and columns

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

-- 7. Insert sample data for testing
-- Create a demo user if it doesn't exist
INSERT INTO public.users (user_id, name, email, created_at) 
VALUES ('demo-user-123', 'Demo User', 'demo@finbridge.com', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Sample alert settings for demo user
INSERT INTO public.alert_settings (user_id, bill_reminders, investment_opportunities, goal_progress, budget_limit)
VALUES ('demo-user-123', true, true, true, 25000)
ON CONFLICT (user_id) DO NOTHING;

-- Sample transactions for demo user
INSERT INTO public.transactions (user_id, transaction_date, description, amount, category, transaction_type)
VALUES 
    ('demo-user-123', CURRENT_DATE - INTERVAL '5 days', 'Salary Credit', 50000, 'Income', 'income'),
    ('demo-user-123', CURRENT_DATE - INTERVAL '3 days', 'Grocery Shopping', 2500, 'Food', 'expense'),
    ('demo-user-123', CURRENT_DATE - INTERVAL '2 days', 'Mutual Fund SIP', 5000, 'Investment', 'investment'),
    ('demo-user-123', CURRENT_DATE - INTERVAL '1 day', 'Emergency Fund', 3000, 'Savings', 'savings'),
    ('demo-user-123', CURRENT_DATE - INTERVAL '7 days', 'Rent Payment', 15000, 'Housing', 'expense'),
    ('demo-user-123', CURRENT_DATE - INTERVAL '10 days', 'Insurance Premium', 2000, 'Insurance', 'expense')
ON CONFLICT DO NOTHING;

-- Sample goals for demo user
INSERT INTO public.goals (user_id, title, description, target_amount, current_amount, target_date, category, goal_type, status)
VALUES 
    ('demo-user-123', 'Emergency Fund', 'Build 6 months emergency fund', 300000, 150000, CURRENT_DATE + INTERVAL '12 months', 'Emergency', 'emergency_fund', 'active'),
    ('demo-user-123', 'Vacation Fund', 'Save for Europe trip', 200000, 50000, CURRENT_DATE + INTERVAL '8 months', 'Travel', 'vacation', 'active'),
    ('demo-user-123', 'Car Purchase', 'Buy a new car', 800000, 200000, CURRENT_DATE + INTERVAL '18 months', 'Vehicle', 'car', 'active')
ON CONFLICT DO NOTHING;

-- Sample user progress for demo user
INSERT INTO public.user_progress (user_id, lesson_id, task_id, progress_status, score)
VALUES 
    ('demo-user-123', gen_random_uuid(), gen_random_uuid(), 'completed', 85),
    ('demo-user-123', gen_random_uuid(), gen_random_uuid(), 'completed', 90),
    ('demo-user-123', gen_random_uuid(), gen_random_uuid(), 'in_progress', 70),
    ('demo-user-123', gen_random_uuid(), gen_random_uuid(), 'completed', 95)
ON CONFLICT DO NOTHING;

-- Sample alerts for demo user
INSERT INTO public.smart_alerts (user_id, alert_type, title, description, amount, due_date, priority, enabled, frequency)
VALUES 
    ('demo-user-123', 'bill', 'Credit Card Bill Due', 'Your HDFC credit card bill of ₹12,500 is due in 3 days', 12500, CURRENT_DATE + INTERVAL '3 days', 'high', true, 'monthly'),
    ('demo-user-123', 'investment', 'SIP Due Tomorrow', 'Your monthly SIP of ₹5,000 will be debited tomorrow', 5000, CURRENT_DATE + INTERVAL '1 day', 'medium', true, 'monthly'),
    ('demo-user-123', 'goal', 'Emergency Fund Goal', 'You are 50% towards your emergency fund goal. Add ₹10,000 more!', 10000, NULL, 'medium', true, 'weekly'),
    ('demo-user-123', 'emi', 'Home Loan EMI', 'Your home loan EMI of ₹35,000 is due on 5th', 35000, CURRENT_DATE + INTERVAL '1 day', 'high', true, 'monthly'),
    ('demo-user-123', 'market', 'Gold Price Alert', 'Gold prices have dropped by 2% - Good time to buy', NULL, NULL, 'low', true, 'daily')
ON CONFLICT DO NOTHING;

-- Sample financial health score for demo user
INSERT INTO public.resilience_scores (user_id, literacy_score, savings_score, debt_score, insurance_score, emergency_fund_score, investment_score, overall_score, calculated_at)
VALUES ('demo-user-123', 85, 65, 78, 45, 60, 70, 72, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;