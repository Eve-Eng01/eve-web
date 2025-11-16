import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import { MessagingScreen } from "@components/pages/messaging/messaging-screen";
import {
  Conversation,
  Message,
} from "@components/pages/messaging/conversation-item";

export const Route = createFileRoute("/messages/")({
  component: RouteComponent,
});

// Sample data - replace with actual API calls
const sampleConversations: Conversation[] = [
  {
    id: "1",
    name: "Elegant Moments events",
    email: "gabrielemumwen20@gmail.com",
    lastMessage:
      "Sure thing the services can be provided as fast as you want...",
    timestamp: "1:25 pm",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Event Pro Solutions",
    email: "contact@eventpro.com",
    lastMessage: "Thank you for your proposal!",
    timestamp: "12:30 pm",
    isOnline: false,
  },
  {
    id: "3",
    name: "Wedding Planners Inc",
    email: "info@weddingplanners.com",
    lastMessage: "Can we schedule a call?",
    timestamp: "11:15 am",
    unreadCount: 1,
    isOnline: true,
  },
];

const sampleMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Hey",
      timestamp: new Date(2025, 8, 8, 13, 25).toISOString(),
      isSent: false,
      isRead: true,
    },
    {
      id: "2",
      text: '"I need catering for 100 people, it is a church events and i and the event is on on monday under ₦500,000"',
      timestamp: new Date(2025, 8, 8, 13, 25).toISOString(),
      isSent: false,
      isRead: true,
    },
    {
      id: "3",
      text: "Hey",
      timestamp: new Date(2025, 8, 8, 13, 25).toISOString(),
      isSent: true,
      isRead: true,
    },
    {
      id: "4",
      text: "Sure thing, i'm handling an event by june 16 at eko hotel, lagos state and my budget is up there",
      timestamp: new Date(2025, 8, 8, 13, 25).toISOString(),
      isSent: true,
      isRead: true,
    },
    {
      id: "5",
      text: "Can you give me the good expirence i need for my event.?",
      timestamp: new Date(2025, 8, 8, 13, 25).toISOString(),
      isSent: true,
      isRead: true,
    },
    {
      id: "6",
      text: "Hey",
      timestamp: new Date(2025, 8, 8, 13, 25).toISOString(),
      isSent: false,
      isRead: true,
    },
    {
      id: "7",
      text: "Sure thing the services can be provided as fast as you want including any arrangement and preperation you want.",
      timestamp: new Date(2025, 8, 8, 13, 25).toISOString(),
      isSent: false,
      isRead: true,
    },
    {
      id: "8",
      text: "If Your Free you can tell me more.",
      timestamp: new Date(2025, 8, 8, 13, 25).toISOString(),
      isSent: false,
      isRead: true,
    },
  ],
};

export function RouteComponent() {
  return (
    <DashboardLayout>
      <MessagingScreen
        initialConversations={sampleConversations}
        initialMessages={sampleMessages}
      />
    </DashboardLayout>
  );
}
