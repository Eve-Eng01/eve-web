import React, { useState, useMemo } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatConversation } from "./chat-conversation";
import { Conversation } from "./conversation-item";
import { Message } from "./message-item";

interface MessagingScreenProps {
  initialConversations?: Conversation[];
  initialMessages?: Record<string, Message[]>;
  currentUserId?: string;
}

export const MessagingScreen: React.FC<MessagingScreenProps> = ({
  initialConversations = [],
  initialMessages = {},
  currentUserId,
}) => {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(initialMessages);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >(conversations[0]?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const selectedConversation = useMemo(
    () =>
      conversations.find((conv) => conv.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const currentMessages = useMemo(
    () => messages[selectedConversationId || ""] || [],
    [messages, selectedConversationId]
  );

  const handleSendMessage = (text: string) => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      isSent: true,
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [
        ...(prev[selectedConversationId] || []),
        newMessage,
      ],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              lastMessage: text,
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }),
            }
          : conv
      )
    );
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // On mobile, hide sidebar when conversation is selected
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  return (
    <div className="flex flex-col flex-1 md:flex-row h-[calc(100vh-180px)] md:h-[calc(100vh-120px)] rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm w-full">
      {/* Sidebar - Mobile: hidden when conversation is shown, Desktop: always visible */}
      <div
        className={`
          ${showSidebar ? "flex" : "hidden"} 
          md:flex
          w-full 
          md:flex-1
          min-w-0 
          border-r border-gray-200 
          h-full
        `}
      >
        <ChatSidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Conversation - Mobile: hidden when sidebar is shown, Desktop: always visible */}
      <div
        className={`
          ${!showSidebar ? "flex" : "hidden"} 
          md:flex
          md:flex-1
          min-w-0 
          w-full
        `}
      >
        <ChatConversation
          conversation={selectedConversation}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          currentUserId={currentUserId}
          onBack={handleBackToSidebar}
        />
      </div>
    </div>
  );
};
