
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGeneralMessages } from "@/hooks/useGeneralMessages";
import { toast } from "@/hooks/use-toast";

interface GeneralMessageThreadProps {
  conversationId: string;
  otherUserId: string;
  otherUserName?: string | null;
}

const GeneralMessageThread: React.FC<GeneralMessageThreadProps> = ({
  conversationId,
  otherUserId,
  otherUserName,
}) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useGeneralMessages(conversationId, otherUserId);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { error } = await sendMessage(text.trim());
    if (error) {
      toast({
        title: "Send failed",
        description: typeof error === "string" ? error : (error as any)?.message || "Failed to send message",
        variant: "destructive",
      });
    }
    setText("");
  };

  if (!user) return null;

  return (
    <div className="border rounded-md bg-gray-100 max-h-96 flex flex-col p-2">
      <div className="text-sm font-bold mb-2 text-center text-blue-700">
        Direct chat with {otherUserName || "User"}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 px-1" style={{ minHeight: 120, maxHeight: 220 }}>
        {loading ? (
          <div className="text-xs text-gray-400 text-center">Loading...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-xs text-gray-400 text-center">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs px-3 py-2 rounded-md mb-2 text-sm ${
                    msg.sender_id === user.id
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

export default GeneralMessageThread;
