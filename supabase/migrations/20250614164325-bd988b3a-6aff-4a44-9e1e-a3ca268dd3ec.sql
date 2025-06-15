
-- 1. Create a general_conversations table to store conversations between users
CREATE TABLE public.general_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Each conversation is always between exactly 2 users
  CONSTRAINT user_pair UNIQUE (user1_id, user2_id)
);

-- 2. Create a general_messages table to store direct messages between users
CREATE TABLE public.general_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.general_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- 3. Enable row-level security (RLS) on both tables
ALTER TABLE public.general_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS: Only allow a participant to view their conversations
CREATE POLICY "Users can select their own conversations" 
  ON public.general_conversations 
  FOR SELECT 
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- 5. RLS: Only allow a participant to insert a conversation (in code, always insert user1_id < user2_id to avoid duplicates)
CREATE POLICY "Users can create a conversation with others"
  ON public.general_conversations
  FOR INSERT
  WITH CHECK (
    (user1_id = auth.uid() OR user2_id = auth.uid())
    AND user1_id <> user2_id
  );

-- 6. RLS: Only participants can insert/select messages in their conversation
CREATE POLICY "Users can insert/select their own messages"
  ON public.general_messages
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.general_conversations
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversation"
  ON public.general_messages
  FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.general_conversations
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

-- 7. Allow only recipients to update read_at
CREATE POLICY "Recipients can update read_at"
  ON public.general_messages
  FOR UPDATE
  USING (recipient_id = auth.uid());
