
-- Add city column to profiles table
ALTER TABLE public.profiles ADD COLUMN city TEXT;

-- Add city column to safety_alerts table  
ALTER TABLE public.safety_alerts ADD COLUMN city TEXT;

-- Add city column to civic_reports table
ALTER TABLE public.civic_reports ADD COLUMN city TEXT;

-- Create a cities table for predefined city options
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  state TEXT,
  country TEXT DEFAULT 'United States',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample cities (you can modify these)
INSERT INTO public.cities (name, state) VALUES 
  ('New York', 'NY'),
  ('Los Angeles', 'CA'),
  ('Chicago', 'IL'),
  ('Houston', 'TX'),
  ('Phoenix', 'AZ'),
  ('Philadelphia', 'PA'),
  ('San Antonio', 'TX'),
  ('San Diego', 'CA'),
  ('Dallas', 'TX'),
  ('San Jose', 'CA'),
  ('Austin', 'TX'),
  ('Jacksonville', 'FL'),
  ('Fort Worth', 'TX'),
  ('Columbus', 'OH'),
  ('Charlotte', 'NC'),
  ('San Francisco', 'CA'),
  ('Indianapolis', 'IN'),
  ('Seattle', 'WA'),
  ('Denver', 'CO'),
  ('Boston', 'MA');

-- Enable RLS for cities table
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view cities
CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);

-- Update RLS policies to filter by city for safety alerts
DROP POLICY IF EXISTS "Anyone can view safety alerts" ON public.safety_alerts;
CREATE POLICY "Anyone can view safety alerts in their city" ON public.safety_alerts 
FOR SELECT USING (
  city IS NULL OR 
  city IN (
    SELECT city FROM public.profiles WHERE id = auth.uid()
  ) OR
  auth.uid() IS NULL
);

-- Update RLS policies to filter by city for civic reports  
DROP POLICY IF EXISTS "Anyone can view civic reports" ON public.civic_reports;
CREATE POLICY "Anyone can view civic reports in their city" ON public.civic_reports
FOR SELECT USING (
  city IS NULL OR
  city IN (
    SELECT city FROM public.profiles WHERE id = auth.uid()
  ) OR
  auth.uid() IS NULL
);
