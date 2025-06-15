
-- Enable RLS for cities table (if not already enabled)
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view cities (public data)
DROP POLICY IF EXISTS "Anyone can view cities" ON public.cities;
CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);
