-- 003_create_alerts_table.sql
CREATE TABLE IF NOT EXISTS public.user_alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  amount numeric,
  due_date timestamptz,
  priority text DEFAULT 'low',
  enabled boolean DEFAULT true,
  frequency text DEFAULT 'once',
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_alerts_user_id ON public.user_alerts (user_id);
