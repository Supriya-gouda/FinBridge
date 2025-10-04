-- 004_alerts_rpcs_and_policies.sql
-- Adds RPCs for alerts and deletion, and enables RLS with policies for user-scoped access

-- Delete investment recommendation RPC (deletes only if it belongs to the calling user)
CREATE OR REPLACE FUNCTION public.delete_investment_recommendation(rec_id uuid)
RETURNS TABLE(id uuid, user_id uuid, recommendation jsonb, created_at timestamptz) AS $$
BEGIN
  RETURN QUERY
  DELETE FROM public.investment_recommendations
  WHERE id = rec_id
    AND user_id::text = auth.uid()
  RETURNING id, user_id, recommendation, created_at;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alerts RPC: add a user alert (parameters mirror the table columns)
CREATE OR REPLACE FUNCTION public.add_user_alert(
  user_uuid uuid,
  p_type text,
  p_title text,
  p_description text DEFAULT NULL,
  p_amount numeric DEFAULT NULL,
  p_due_date timestamptz DEFAULT NULL,
  p_priority text DEFAULT 'low',
  p_enabled boolean DEFAULT true,
  p_frequency text DEFAULT 'once',
  p_metadata jsonb DEFAULT NULL
)
RETURNS TABLE(id uuid, user_id uuid, type text, title text, description text, amount numeric, due_date timestamptz, priority text, enabled boolean, frequency text, metadata jsonb, created_at timestamptz) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.user_alerts(user_id, type, title, description, amount, due_date, priority, enabled, frequency, metadata)
  VALUES(user_uuid, p_type, p_title, p_description, p_amount, p_due_date, p_priority, p_enabled, p_frequency, p_metadata)
  RETURNING id, user_id, type, title, description, amount, due_date, priority, enabled, frequency, metadata, created_at;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alerts RPC: fetch alerts for a user
CREATE OR REPLACE FUNCTION public.get_user_alerts(user_uuid uuid, limit integer DEFAULT 50, offset integer DEFAULT 0)
RETURNS TABLE(id uuid, user_id uuid, type text, title text, description text, amount numeric, due_date timestamptz, priority text, enabled boolean, frequency text, metadata jsonb, created_at timestamptz) AS $$
BEGIN
  RETURN QUERY
  SELECT id, user_id, type, title, description, amount, due_date, priority, enabled, frequency, metadata, created_at
  FROM public.user_alerts
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT limit OFFSET offset;
END; $$ LANGUAGE plpgsql STABLE SECURITY INVOKER;

-- Enable Row Level Security and add policies so users may only access their own rows
ALTER TABLE public.investment_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to access their recommendations"
  ON public.investment_recommendations
  FOR ALL
  USING (auth.uid() = user_id::text)
  WITH CHECK (auth.uid() = user_id::text);

ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to access own alerts"
  ON public.user_alerts
  FOR ALL
  USING (auth.uid() = user_id::text)
  WITH CHECK (auth.uid() = user_id::text);

