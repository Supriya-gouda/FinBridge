-- 001_create_investment_recommendations_table.sql
-- Creates the investment_recommendations table used to store recommendation blobs per user

-- Ensure the pgcrypto extension is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.investment_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  recommendation jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index to speed up queries by user
CREATE INDEX IF NOT EXISTS idx_investment_recommendations_user_id ON public.investment_recommendations (user_id);
