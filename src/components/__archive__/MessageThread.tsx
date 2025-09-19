
import React, { useState, useRef, useEffect } from "react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface MessageThreadProps {
  reportId: string;
  reportType: "safety_alert" | "civic_report";
  recipientId: string;
  recipientName?: string;
}
const MessageThread: React.FC<MessageThreadProps> = ({
  reportId,
  reportType,
  recipientId,
  recipientName,
}) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const { messages, loading, sendMessage } = useMessages(reportId, reportType, recipientId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!text.trim()) return;

    // Prevent sending to yourself or with no recipient
    if (!recipientId || recipientId === user.id) {
      toast({
        title: "Cannot send message",
        description: recipientId === user.id
          ? "You cannot message yourself about your own report."
          : "Cannot send message: No valid recipient.",
        variant: "destructive",
      });
      return;
    }

    // Logging for troubleshooting
    console.log("Sending message", {
      reportId,
      reportType,
      recipientId,
      senderId: user?.id,
      text: text.trim(),
    });

    const { error } = await sendMessage(text.trim());
    if (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : (error as any)?.message || "Failed to send message";
      toast({
        title: "Send failed",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("Message send error", error);
    } else {
      // Success - show visual feedback if helpful
      // toast({ title: "Message sent!", description: "Your message was delivered." });
    }
    setText("");
  };

  if (!user) return null;

  return (
    <div className="border rounded-md bg-gray-100 mt-4 max-h-80 flex flex-col px-2 py-2">
      <div className="text-sm font-bold mb-2 text-center text-blue-700">
        Message {recipientName ? recipientName : "Reporter"}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 px-1" style={{ minHeight: 120, maxHeight: 200 }}>
        {loading ? (
          <div className="text-xs text-gray-400 text-center">Loading...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-xs text-gray-400 text-center">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id}
                  className={`max-w-xs px-3 py-2 rounded-md mb-2 text-sm ${msg.sender_id === user.id
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-white border text-gray-900 self-start mr-auto"
                  }`}
                  title={new Date(msg.created_at).toLocaleString()}
                >
                  {msg.content}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-1 pt-2">
        <input
          className="flex-1 border rounded p-2 text-sm"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded font-semibold text-sm disabled:opacity-70"
          disabled={loading || !text.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageThread;

