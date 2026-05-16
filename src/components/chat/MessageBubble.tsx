import { formatDistanceToNow } from "date-fns";
import type { MessageData } from "@/types";

interface MessageBubbleProps {
  message: MessageData;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
          isOwn
            ? "bg-rose-500 text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm"
        }`}
      >
        <p>{message.content}</p>
        <p className={`text-xs mt-1 ${isOwn ? "text-rose-200" : "text-gray-400"}`}>
          {formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
