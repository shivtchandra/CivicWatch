
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  other_user_id: string;
  other_user_name?: string | null;
}

export interface GeneralMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export function useGeneralConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  // Get all conversations for current user, and join profiles to fetch other user's name
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("general_conversations")
      .select(`
        id, user1_id, user2_id,
        user1:profiles!general_conversations_user1_id_fkey(full_name),
        user2:profiles!general_conversations_user2_id_fkey(full_name)
      `);

    if (error) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const mapped = (data as any[]).map((conv) => {
      let other_user_id, other_user_name;
      if (conv.user1_id === user.id) {
        other_user_id = conv.user2_id;
        other_user_name = conv.user2?.full_name;
      } else {
        other_user_id = conv.user1_id;
        other_user_name = conv.user1?.full_name;
      }
      return {
        ...conv,
        other_user_id,
        other_user_name,
      };
    });
    setConversations(mapped);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  return { conversations, loading, refresh: fetchConversations };
}

export function useGeneralMessages(conversationId: string, otherUserId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GeneralMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all messages in this conversation
  const fetchMessages = useCallback(async () => {
    if (!user || !conversationId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("general_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages((data as GeneralMessage[]) || []);
    setLoading(false);
  }, [user, conversationId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Real-time updates (optional)
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel("general_messages:" + conversationId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "general_messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as GeneralMessage]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  // Send a new message
  const sendMessage = useCallback(async (text: string) => {
    if (!user || !conversationId) return { error: "Not authorized" };
    const { error } = await supabase.from("general_messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      recipient_id: otherUserId,
      content: text,
    });
    return { error };
  }, [user, conversationId, otherUserId]);

  return { messages, loading, fetchMessages, sendMessage };
}

// Create or fetch conversation with user
export async function getOrCreateGeneralConversation(currentUserId: string, targetUserId: string) {
  // Always store smaller uuid in user1/user2 for uniqueness
  const [user1_id, user2_id] = [currentUserId, targetUserId].sort();
  // Try to fetch
  let { data: conv, error } = await supabase
    .from("general_conversations")
    .select("*")
    .or(`and(user1_id.eq.${user1_id},user2_id.eq.${user2_id})`)
    .maybeSingle();
  if (!conv) {
    const { data: created, error: createError } = await supabase
      .from("general_conversations")
      .insert({ user1_id, user2_id })
      .select()
      .maybeSingle();
    conv = created;
  }
  return { conversation: conv, error };
}
