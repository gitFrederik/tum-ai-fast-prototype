"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./MessageBubble";
import { Send, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import type { MessageData } from "@/types";

interface ChatWindowProps {
  matchId: string;
  petName: string;
}

export function ChatWindow({ matchId, petName }: ChatWindowProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    const res = await fetch(`/api/messages/${matchId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pusher subscription
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;

    let pusher: import("pusher-js").default;
    import("pusher-js").then(({ default: PusherJS }) => {
      pusher = new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
        authEndpoint: "/api/pusher/auth",
      });

      const channel = pusher.subscribe(`private-match-${matchId}`);
      channel.bind("message", (data: MessageData) => {
        setMessages((prev) => [...prev, data]);
      });
    });

    return () => {
      pusher?.unsubscribe(`private-match-${matchId}`);
    };
  }, [matchId]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`/api/messages/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send");
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
    } catch {
      toast.error("Failed to send message");
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const suggestPlaydate = () => {
    setInput("Hey! Would you like to arrange a playdate? 🐾");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-400">
            <span className="text-4xl">🐾</span>
            <p className="text-sm">Start the conversation with {petName}&apos;s owner!</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === session?.user?.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2">
        <button
          onClick={suggestPlaydate}
          className="flex items-center gap-1.5 text-xs text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors"
        >
          <Calendar className="w-3 h-3" /> Suggest a playdate
        </button>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
