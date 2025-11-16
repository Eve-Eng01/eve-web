import React, { useRef, useEffect } from "react";
import { Video, Phone, MoreVertical, ArrowLeft } from "lucide-react";
import { MessageItem, Message } from "./message-item";
import { MessageInput } from "./message-input";
import { Conversation } from "./conversation-item";

interface ChatConversationProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  currentUserId?: string;
  onBack?: () => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  conversation,
  messages,
  onSendMessage,
  currentUserId,
  onBack,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    try {
      const date = new Date(message.timestamp).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    } catch (e) {
      // Fallback for invalid dates
      const fallbackDate = "Today";
      if (!groups[fallbackDate]) {
        groups[fallbackDate] = [];
      }
      groups[fallbackDate].push(message);
    }
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex flex-col h-full bg-[#f4f4f4] border-l border-[gainsboro] w-full">
      {/* Header */}
      <div className="bg-[#f4f4f4] px-4 sm:px-5 md:px-6 py-3 sm:py-4 relative">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
            {/* Back button - Mobile only */}
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden flex-shrink-0 w-10 h-10 rounded-full bg-[#eaeaea] flex items-center justify-center hover:bg-[#dfdfdf] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            
            {/* Online indicator */}
            {conversation.isOnline && (
              <div className="hidden sm:block left-[24.96px] top-[53.99px] w-[10px] h-[10px] bg-[#17b26a] rounded-full flex-shrink-0" />
            )}
            
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                {conversation.avatar ? (
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {conversation.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Online indicator for mobile */}
              {conversation.isOnline && (
                <div className="sm:hidden absolute bottom-0 right-0 w-3 h-3 bg-[#17b26a] rounded-full border-2 border-white" />
              )}
            </div>
            
            {/* Name and email */}
            <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
              <h3 className="text-base sm:text-[18px] font-medium text-[#2d2d2d] leading-[26px] tracking-[0.09px] truncate">
                {conversation.name}
              </h3>
              <p className="text-xs sm:text-[14px] font-medium text-[#777777] leading-[20px] truncate">
                {conversation.email}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
            <button className="w-10 h-10 sm:w-12 md:w-[54px] sm:h-12 md:h-[54px] rounded-full bg-[#eaeaea] flex items-center justify-center hover:bg-[#dfdfdf] transition-colors">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
            <button className="w-10 h-10 sm:w-12 md:w-[54px] sm:h-12 md:h-[54px] rounded-full bg-[#eaeaea] flex items-center justify-center hover:bg-[#dfdfdf] transition-colors">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
            <button className="w-10 h-10 sm:w-12 md:w-[54px] sm:h-12 md:h-[54px] rounded-full bg-[#eaeaea] flex items-center justify-center hover:bg-[#dfdfdf] transition-colors">
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-4 sm:space-y-5 md:space-y-6"
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-2 sm:space-y-3">
            {/* Date separator */}
            <div className="flex items-center justify-center py-1 sm:py-2">
              <span className="text-sm sm:text-[16px] font-medium text-[#5a5a5a] leading-[24px] tracking-[0.08px]">
                {date}
              </span>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message, index) => (
              <div
                key={message.id}
                className="mb-2 sm:mb-3"
                style={{
                  animation: "fadeIn 0.3s ease-out",
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: "both",
                }}
              >
                <MessageItem message={message} />
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

