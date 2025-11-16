import React, { useState } from "react";
import { Search } from "lucide-react";
import { ConversationItem, Conversation } from "./conversation-item";
import { cn } from "../../../utils/classnames";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

type TabType = "messages" | "unread" | "proposals";

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchQuery = "",
  onSearchChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("messages");
  const [searchValue, setSearchValue] = useState(searchQuery);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const unreadCount = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  );

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      conv.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchValue.toLowerCase());

    if (activeTab === "unread") {
      return matchesSearch && (conv.unreadCount || 0) > 0;
    }
    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#f4f4f4] w-full">
      {/* Header */}
      <div className="bg-[#f4f4f4] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-[40px] p-4 sm:p-5 md:p-[20px]">
        <h2 className="font-['Inter',sans-serif] font-medium text-2xl sm:text-[28px] md:text-[32px] text-[#0d0d0d] leading-normal tracking-[-0.32px] shrink-0">
          Chat
        </h2>

        {/* Search */}
        <div className="flex-1 relative w-full sm:w-auto">
          <div className="bg-white border-2 border-[#7417c6] h-[45px] sm:h-[45.318px] rounded-full relative">
            <div className="absolute left-3 sm:left-[13px] top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-[4px]">
              <div className="rotate-180 scale-y-[-1]">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Emumw"
                className="bg-transparent border-0 outline-none font-['Inter',sans-serif] font-medium text-sm sm:text-[16px] text-[#2d2d2d] leading-normal tracking-[-0.16px] placeholder:text-[#2d2d2d] w-full sm:w-auto pr-3 sm:pr-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#f4f4f4] flex flex-col gap-4 sm:gap-5 md:gap-[24px] p-4 sm:p-5 md:p-[20px] flex-1 min-h-0">
        <div className="flex gap-2 sm:gap-[9px] w-full shrink-0">
          <button
            onClick={() => setActiveTab("messages")}
            className={cn(
              "flex-1 h-[44px] sm:h-[48px] rounded-full transition-all duration-200 flex items-center justify-center",
              activeTab === "messages"
                ? "bg-white border border-[#7417c6] text-[#7726cd]"
                : "bg-[#f4f4f4] border border-[rgba(0,0,0,0.1)] text-[#434141]"
            )}
          >
            <span className="font-['Poppins',sans-serif] font-medium text-sm sm:text-[16px] leading-[24px] tracking-[0.08px]">
              Messages
            </span>
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={cn(
              "flex-1 h-[44px] sm:h-[48px] rounded-full transition-all duration-200 flex items-center justify-center relative",
              activeTab === "unread"
                ? "bg-white border border-[#7417c6] text-[#7726cd]"
                : "bg-[#f4f4f4] border border-[rgba(0,0,0,0.1)] text-[#434141]"
            )}
          >
            <div className="flex items-center gap-1 sm:gap-[4px]">
              <span className="font-['Poppins',sans-serif] font-medium text-sm sm:text-[16px] leading-[24px] tracking-[0.08px]">
                Unread
              </span>
              {unreadCount > 0 && (
                <div className="bg-[#7726cd] rounded-full w-5 h-5 sm:w-[22.047px] sm:h-[22.047px] flex items-center justify-center shrink-0">
                  <span className="font-['Poppins',sans-serif] font-medium text-xs sm:text-[14px] text-white leading-normal tracking-[-0.14px]">
                    {unreadCount}
                  </span>
                </div>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={cn(
              "flex-1 h-[44px] sm:h-[48px] rounded-full transition-all duration-200 flex items-center justify-center",
              activeTab === "proposals"
                ? "bg-white border border-[#7417c6] text-[#7726cd]"
                : "bg-[#f4f4f4] border border-[rgba(0,0,0,0.1)] text-[#434141]"
            )}
          >
            <span className="font-['Poppins',sans-serif] font-medium text-sm sm:text-[16px] leading-[24px] tracking-[0.08px]">
              Proposals
            </span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-[12px] overflow-y-auto flex-1 min-h-0">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === selectedConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm px-4">
              {searchValue ? "No results found..." : "No conversations"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

