import React, { useMemo } from "react";
import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Settings,
  User,
  LogOut,
  MessageSquare,
  Plus,
  Banknote,
  MessageCircle,
  LineChart,
  UserStar,
  PlusSquare,
  TicketIcon,
} from "lucide-react";
import Navbar from "../accessories/nav-bar";
import { useNavigate, useLocation } from "@tanstack/react-router";
import ChatWidget from "@components/accessories/MessagePopup";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: User;
  isVendor?: boolean;
}

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  isActive?: boolean;
}

// @Ufuoma we have a white background on the main content area, so we need to make the sidebar background color the same as the main content area
const NavSection: React.FC<{ title: string; items: NavItem[] }> = ({
  title,
  items,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = useMemo(() => location.pathname, [location.pathname]);

  const handleNavigation = (href: string, label: string) => {
    console.log(`Navigating to ${label}...`);
    navigate({ to: href });
  };
  return (
    <div className="mb-8">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = pathName === item.href;
          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.href, item.label)}
              className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer ${
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive
                    ? "text-purple-500"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  isVendor,
}) => {
  const generalNavItems: NavItem[] = useMemo(
    () =>
      isVendor
        ? [
            {
              icon: TicketIcon,
              label: "My Dashboard",
              href: "/vendor",
            },
            {
              icon: PlusSquare,
              label: "Profile & services",
              href: "/vendor/services",
            },
            {
              icon: UserStar,
              label: "Event opportunities",
              href: "/vendor/event",
            },
            {
              icon: LineChart,
              label: "Sales & reports",
              href: "/organizer",
            },
          ]
        : [
            {
              icon: Calendar,
              label: "My Events",
              href: "/organizer",
            },
            {
              icon: Plus,
              label: "Create New",
              href: "/events/create",
            },
            {
              icon: Users,
              label: "Attendees",
              href: "/organizer/attendee",
            },
            {
              icon: TrendingUp,
              label: "Sales & Reports",
              href: "/organizer/sales",
            },
          ],
    [isVendor]
  );

  const vendorNavItems: NavItem[] = useMemo(
    () =>
      isVendor
        ? [
            {
              icon: Users,
              label: "My proposals",
              href: "/vendor/proposal",
            },
            {
              icon: Banknote,
              label: "Submit proposal",
              href: "/vendor",
            },
            {
              icon: MessageCircle,
              label: "Messages",
              href: "/vendor",
            },
          ]
        : [
            {
              icon: Users,
              label: "Browse Vendors",
              href: "/organizer/vendors",
            },
            {
              icon: FileText,
              label: "RFPs & Proposals",
              href: "/proposals",
            },
            {
              icon: MessageSquare,
              label: "Messages",
              href: "/messages",
            },
          ],
    [isVendor]
  );

  const bottomNavItems: NavItem[] = useMemo(
    () =>
      isVendor
        ? [
            {
              icon: Settings,
              label: "Setting",
              href: "/settings",
            },
          ]
        : [
            {
              icon: Settings,
              label: "Setting",
              href: "/settings",
            },
            {
              icon: User,
              label: "Account",
              href: "/account",
            },
            {
              icon: LogOut,
              label: "Log Out",
              href: "/logout",
            },
          ],
    [isVendor]
  );

  return (
    <>
      {/* Top Header */}
      <Navbar
        user={{
          name: "Gabriel Emumwen",
          email: "gabrielemumwen20@gmail.com",
          avatar: undefined,
        }}
      />
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            {/* Navigation */}
            <div className="flex-1 px-3">
              <NavSection title="GENERAL" items={generalNavItems} />
              <NavSection
                title={
                  isVendor
                    ? "Proposals & communications"
                    : "VENDORS & PROPOSALS"
                }
                items={vendorNavItems}
              />
            </div>

            {/* Bottom Navigation */}
            <div className="px-3 mt-auto">
              <NavSection
                title={isVendor ? "Account" : "GENERAL"}
                items={bottomNavItems}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-white">
            <div className="py-6 px-6">{children}</div>
          </main>
        </div>
      </div>
      <ChatWidget/>
    </>
  );
};
