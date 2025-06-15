
-- 1. Create a messages table for report-based conversations
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('safety_alert', 'civic_report')),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- 2. Enable Row-Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Only sender or recipient can see the message
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- 4. Policy: Only sender can insert (send) a message to valid recipient
CREATE POLICY "Users can send messages to other users"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND recipient_id <> auth.uid()
  );

-- 5. Policy: Only mark as read if recipient
CREATE POLICY "Recipient can update read_at"
  ON public.messages
  FOR UPDATE
  USING (recipient_id = auth.uid());

-- OPTIONAL: Policy to allow sender/recipient to delete their own messages
CREATE POLICY "Sender or recipient can delete their messages"
  ON public.messages
  FOR DELETE
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

