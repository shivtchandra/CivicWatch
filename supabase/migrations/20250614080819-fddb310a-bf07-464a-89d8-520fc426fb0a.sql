
-- Enable RLS and basic policies so users can see and manage their own data

-- For safety_alerts table
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own safety alerts"
  ON public.safety_alerts
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users see their own safety alerts OR alerts for their city"
  ON public.safety_alerts
  FOR SELECT
  USING (user_id = auth.uid() OR city = (select city from profiles where id = auth.uid()));

-- For civic_reports table
ALTER TABLE public.civic_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own civic reports"
  ON public.civic_reports
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users see their own civic reports OR reports for their city"
  ON public.civic_reports
  FOR SELECT
  USING (user_id = auth.uid() OR city = (select city from profiles where id = auth.uid()));

-- For profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see/update their own profile"
  ON public.profiles
  FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

