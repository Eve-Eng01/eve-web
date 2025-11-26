import React from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "../../../utils/classnames";

export interface Conversation {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick?: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-2 sm:px-[8px] py-2.5 sm:py-[12px] rounded-lg transition-all duration-200 text-left",
        "hover:bg-[#f4f4f4] active:scale-[0.98]",
        isActive && "bg-[#f4f4f4]"
      )}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-[12px]">
        {/* Left side: Avatar + Name/Message */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-[12px] flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 md:w-[52px] sm:h-12 md:h-[52px] rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base overflow-hidden">
              {conversation.avatar ? (
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                conversation.name.charAt(0).toUpperCase()
              )}
            </div>
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* Name and Message */}
          <div className="flex flex-col items-start flex-1 min-w-0">
            <h3 className="font-['Poppins',sans-serif] font-medium text-base sm:text-lg md:text-[20px] text-[#2d2d2d] leading-[28px] tracking-[0.1px] truncate w-full">
              {conversation.name}
            </h3>
            <p className="font-['Poppins',sans-serif] font-medium text-sm sm:text-[16px] text-[#777777] leading-[24px] tracking-[0.08px] truncate w-full">
              {conversation.lastMessage}
            </p>
          </div>
        </div>

        {/* Right side: Timestamp + Unread badge */}
        <div className="flex flex-col gap-0.5 sm:gap-[2px] items-end shrink-0">
          <span className="font-['Poppins',sans-serif] font-medium text-xs sm:text-sm md:text-[16px] text-[#777777] leading-[24px] tracking-[0.08px] whitespace-nowrap">
            {conversation.timestamp}
          </span>
          {conversation.unreadCount && conversation.unreadCount > 0 && (
            <div className="bg-[#7726cd] rounded-full w-5 h-5 sm:w-[22.047px] sm:h-[22.047px] flex items-center justify-center">
              <span className="font-['Poppins',sans-serif] font-medium text-xs sm:text-[14px] text-white leading-normal tracking-[-0.14px]">
                {conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

