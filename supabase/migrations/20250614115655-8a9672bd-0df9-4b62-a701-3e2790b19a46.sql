
-- Allow users to delete only their own safety_alerts
CREATE POLICY "Users can delete their own safety_alerts"
  ON public.safety_alerts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow users to delete only their own civic_reports
CREATE POLICY "Users can delete their own civic_reports"
  ON public.civic_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- No changes needed to the schema, as user_id is already present
