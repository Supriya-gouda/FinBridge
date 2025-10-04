-- FinBridge Database Schema for Supabase
-- Execute this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase auth handles this, but we may need additional fields)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Smart alerts table
CREATE TABLE IF NOT EXISTS smart_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- bill, investment, goal, market, emi, budget, emergency
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(12,2),
  due_date DATE,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  enabled BOOLEAN DEFAULT true,
  frequency VARCHAR(20) DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Financial health scores table
CREATE TABLE IF NOT EXISTS resilience_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  literacy_score INTEGER CHECK (literacy_score >= 0 AND literacy_score <= 100),
  savings_score INTEGER CHECK (savings_score >= 0 AND savings_score <= 100),
  debt_score INTEGER CHECK (debt_score >= 0 AND debt_score <= 100),
  insurance_score INTEGER CHECK (insurance_score >= 0 AND insurance_score <= 100),
  emergency_fund_score INTEGER CHECK (emergency_fund_score >= 0 AND emergency_fund_score <= 100),
  investment_score INTEGER CHECK (investment_score >= 0 AND investment_score <= 100),
  calculated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'investment', 'savings')),
  category VARCHAR(100),
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_name VARCHAR(255) NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  target_date DATE,
  goal_type VARCHAR(50) CHECK (goal_type IN ('emergency_fund', 'vacation', 'house', 'car', 'education', 'retirement', 'other')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_name VARCHAR(100) NOT NULL,
  lesson_name VARCHAR(100) NOT NULL,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  completed_at TIMESTAMP,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alert settings table
CREATE TABLE IF NOT EXISTS alert_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_reminders BOOLEAN DEFAULT true,
  investment_opportunities BOOLEAN DEFAULT true,
  goal_progress BOOLEAN DEFAULT true,
  market_updates BOOLEAN DEFAULT true,
  emi_reminders BOOLEAN DEFAULT true,
  budget_alerts BOOLEAN DEFAULT true,
  emergency_fund_low BOOLEAN DEFAULT true,
  spending_spikes BOOLEAN DEFAULT false,
  budget_limit DECIMAL(12,2) DEFAULT 25000,
  emergency_fund_target DECIMAL(12,2) DEFAULT 100000,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_smart_alerts_user_id ON smart_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_type_enabled ON smart_alerts(alert_type, enabled);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_due_date ON smart_alerts(due_date);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_priority ON smart_alerts(priority);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_is_read ON smart_alerts(is_read);

CREATE INDEX IF NOT EXISTS idx_resilience_scores_user_id ON resilience_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_resilience_scores_calculated_at ON resilience_scores(calculated_at);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_type ON goals(goal_type);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_progress(module_name);

CREATE INDEX IF NOT EXISTS idx_alert_settings_user_id ON alert_settings(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resilience_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for smart_alerts
CREATE POLICY "Users can view their own alerts" ON smart_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts" ON smart_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" ON smart_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" ON smart_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for resilience_scores
CREATE POLICY "Users can view their own scores" ON resilience_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" ON resilience_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for goals
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_progress
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for alert_settings
CREATE POLICY "Users can view their own settings" ON alert_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON alert_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON alert_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insert some sample data for testing (optional)
-- Uncomment the following lines if you want sample data

/*
-- Sample transactions (replace 'your-user-id' with actual user ID)
INSERT INTO transactions (user_id, amount, transaction_type, category, description, transaction_date) VALUES
('your-user-id', 50000, 'income', 'salary', 'Monthly salary', '2025-10-01'),
('your-user-id', 15000, 'expense', 'rent', 'Monthly rent payment', '2025-10-01'),
('your-user-id', 5000, 'expense', 'groceries', 'Monthly groceries', '2025-10-02'),
('your-user-id', 10000, 'savings', 'emergency_fund', 'Emergency fund contribution', '2025-10-01'),
('your-user-id', 5000, 'investment', 'mutual_fund', 'Monthly SIP', '2025-10-01');

-- Sample goals
INSERT INTO goals (user_id, goal_name, target_amount, current_amount, target_date, goal_type, status) VALUES
('your-user-id', 'Emergency Fund', 300000, 150000, '2026-10-01', 'emergency_fund', 'active'),
('your-user-id', 'Vacation to Europe', 200000, 50000, '2026-06-01', 'vacation', 'active'),
('your-user-id', 'Car Purchase', 800000, 200000, '2027-01-01', 'car', 'active');

-- Sample user progress
INSERT INTO user_progress (user_id, module_name, lesson_name, completion_percentage, points_earned) VALUES
('your-user-id', 'Basic Financial Literacy', 'Understanding Money', 100, 50),
('your-user-id', 'Basic Financial Literacy', 'Budgeting Basics', 100, 50),
('your-user-id', 'Investment Fundamentals', 'Types of Investments', 80, 40),
('your-user-id', 'Investment Fundamentals', 'Risk and Return', 60, 30);

-- Sample alert settings
INSERT INTO alert_settings (user_id, budget_limit, emergency_fund_target) VALUES
('your-user-id', 30000, 300000);
*/