import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Video, MoreVertical, ChevronLeft, Search } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'business';
  timestamp: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'contacts' | 'chat'>('chat');
  const [selectedContact, setSelectedContact] = useState<Contact | null>({
    id: 2,
    name: 'Elegant Moments events',
    email: 'gabrielemumwen20@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    lastMessage: 'come and open the gate for....',
    timestamp: '12:30 Pm',
    unread: 2,
    online: true
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "I need catering for 100 people, it is a church events and i and the event is on monday under ₦500,000",
      sender: 'user',
      timestamp: '1:25 pm'
    },
    {
      id: 2,
      text: "Hey",
      sender: 'business',
      timestamp: '1:25 pm'
    },
    {
      id: 3,
      text: "Sure thing the services can be provided as fast as you want including any arrangement and preperation you want.\n\nIf Your Free you can tell me more.",
      sender: 'business',
      timestamp: '1:25 pm'
    },
    {
      id: 4,
      text: "Sure thing, i'm handling an event by june 16 at eko hotel, lagos state and my budget is up there",
      sender: 'user',
      timestamp: '1:25 pm'
    },
    {
      id: 5,
      text: "Can you give me the good expirence i need for my event?",
      sender: 'user',
      timestamp: '1:25 pm'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const contacts: Contact[] = [
    {
      id: 1,
      name: 'Emumwen Gabriel',
      email: 'emumwen@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      lastMessage: 'come and open the gate for....',
      timestamp: '12:30 Pm',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Elegant Moments events',
      email: 'gabrielemumwen20@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      lastMessage: 'come and open the gate for....',
      timestamp: '12:30 Pm',
      unread: 2,
      online: true
    },
    {
      id: 3,
      name: 'Elegant Moments events',
      email: 'info@elegantmoments.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      lastMessage: 'come and open the gate for....',
      timestamp: '12:30 Pm',
      unread: 2,
      online: false
    },
    {
      id: 4,
      name: 'Elegant Moments events',
      email: 'contact@elegantmoments.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      lastMessage: 'come and open the gate for....',
      timestamp: '12:30 Pm',
      unread: 2,
      online: true
    }
  ];

  const handleSend = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openChat = (contact: Contact) => {
    setSelectedContact(contact);
    setView('chat');
  };

  const closeWidget = () => {
    setIsOpen(false);
    setTimeout(() => {
      setView('contacts');
      setSelectedContact(null);
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-2xl transition-all duration-500 hover:scale-110 ${
          isOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'
        }`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div
        className={`absolute bottom-0 right-0 bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Contacts View */}
        <div
          className={`absolute inset-0 bg-white transition-transform duration-500 ease-in-out ${
            view === 'contacts' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Contacts Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Chat</h2>
              <button
                onClick={closeWidget}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button className="flex-1 py-3 text-sm font-medium text-purple-600 border-b-2 border-purple-600 bg-purple-50">
              Messages
            </button>
            <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative">
              Unread
              <span className="absolute top-3 right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              Proposals
            </button>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact, index) => (
              <div
                key={contact.id}
                onClick={() => openChat(contact)}
                className="flex items-center gap-3 px-4 py-4 hover:bg-purple-50 cursor-pointer border-b border-gray-100 transition-all hover:translate-x-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {contact.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat View */}
        <div
          className={`absolute inset-0 bg-white flex flex-col transition-transform duration-500 ease-in-out ${
            view === 'chat' ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('contacts')}
                className="p-2 hover:bg-gray-100 rounded-full transition-all hover:-translate-x-1"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <div className="relative">
                <img
                  src={selectedContact?.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                {selectedContact?.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedContact?.name}</h3>
                <p className="text-xs text-gray-500">{selectedContact?.email}</p>
              </div>
            </div>

            {/* Close Button + Action Buttons */}
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110">
                <Video size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110">
                <MoreVertical size={20} className="text-gray-600" />
              </button>

              {/* CLOSE BUTTON ADDED HERE */}
              <button
                onClick={closeWidget}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Date Divider */}
          <div className="py-3 text-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              September 8, 2025
            </span>
          </div>

          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 transition-all hover:shadow-md ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span>{message.timestamp}</span>
                    {message.sender === 'user' && (
                      <svg className="w-4 h-4 text-purple-300" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.354 5.354a.5.5 0 0 0-.708-.708L7 9.293 4.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l5-5z"/>
                        <path d="M15.354 5.354a.5.5 0 0 0-.708-.708L10 9.293l-.354-.353a.5.5 0 0 0-.708.708l.5.5a.5.5 0 0 0 .708 0l5.208-5.207z"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
              <button className="text-gray-500 hover:text-purple-600 transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className={`p-2 rounded-full transition-all ${
                  inputMessage.trim()
                    ? 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-110'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;