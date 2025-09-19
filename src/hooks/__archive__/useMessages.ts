
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Message {
  id: string;
  report_id: string;
  report_type: "safety_alert" | "civic_report";
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export function useMessages(reportId: string, reportType: "safety_alert" | "civic_report", recipientId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all messages for this report between current user and recipient
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),` +
        `(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`
      )
      .eq("report_id", reportId)
      .eq("report_type", reportType)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data as Message[]);
    setLoading(false);
  }, [user, reportId, reportType, recipientId]);

  useEffect(() => {
    fetchMessages();
    if (!user) return;

    // Real-time subscription for new messages
    const channel = supabase.channel(`messages_${reportId}_${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `report_id=eq.${reportId}` },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, reportId, user]);

  // Send a message
  const sendMessage = async (text: string) => {
    if (!user || !recipientId || !reportId) return { error: "Not logged in" };

    const { error } = await supabase.from("messages").insert([
      {
        report_id: reportId,
        report_type: reportType,
        sender_id: user.id,
        recipient_id: recipientId,
        content: text,
      },
    ]);
    if (!error) fetchMessages();
    return { error };
  };

  return { messages, loading, sendMessage };
}
