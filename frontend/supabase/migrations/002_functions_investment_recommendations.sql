-- 002_functions_investment_recommendations.sql
-- Adds RPC functions to insert and fetch investment recommendations

-- Function: add_investment_recommendation(user_uuid uuid, rec jsonb)
CREATE OR REPLACE FUNCTION public.add_investment_recommendation(user_uuid uuid, rec jsonb)
RETURNS TABLE(id uuid, user_id uuid, recommendation jsonb, created_at timestamptz) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.investment_recommendations (user_id, recommendation)
  VALUES (user_uuid, rec)
  RETURNING id, user_id, recommendation, created_at;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: get_investment_recommendations(user_uuid uuid, limit integer DEFAULT 50, offset integer DEFAULT 0)
CREATE OR REPLACE FUNCTION public.get_investment_recommendations(user_uuid uuid, limit integer DEFAULT 50, offset integer DEFAULT 0)
RETURNS TABLE(id uuid, user_id uuid, recommendation jsonb, created_at timestamptz) AS $$
BEGIN
  RETURN QUERY
  SELECT id, user_id, recommendation, created_at
  FROM public.investment_recommendations
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT limit OFFSET offset;
END; $$ LANGUAGE plpgsql STABLE SECURITY INVOKER;
