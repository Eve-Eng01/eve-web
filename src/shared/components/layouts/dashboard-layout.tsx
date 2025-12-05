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
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import Navbar from "../accessories/nav-bar";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useSidebar } from "../../contexts/sidebar-context";
import { useLogout } from "../../api/services/auth/auth.hooks";
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
  onClick?: () => void;
  isLogout?: boolean;
}

// @Ufuoma we have a white background on the main content area, so we need to make the sidebar background color the same as the main content area
const NavSection: React.FC<{
  title: string;
  items: NavItem[];
  isCollapsed: boolean;
}> = ({ title, items, isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = useMemo(() => location.pathname, [location.pathname]);

  const handleNavigation = (item: NavItem) => {
    // Handle logout specially
    if (item.isLogout && item.onClick) {
      item.onClick();
      return;
    }
    
    // Handle custom onClick
    if (item.onClick) {
      item.onClick();
      return;
    }
    
    // Regular navigation
    console.log(`Navigating to ${item.label}...`);
    navigate({ to: item.href });
  };
  
  return (
    <div className="mb-8">
      {!isCollapsed && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = !item.isLogout && pathName === item.href;
          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className={`w-full group flex items-center ${
                isCollapsed ? "justify-center px-2" : "px-3"
              } py-2 text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer ${
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : item.isLogout
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon
                className={`${isCollapsed ? "" : "mr-3"} h-5 w-5 ${
                  isActive
                    ? "text-purple-500"
                    : item.isLogout
                    ? "text-red-500 group-hover:text-red-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              {!isCollapsed && item.label}
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
  // Use global sidebar context
  const {
    isSidebarOpen,
    isCollapsed,
    isMobile,
    toggleSidebar,
    closeSidebar,
    toggleCollapse,
  } = useSidebar();
  
  // Get logout function
  const handleLogout = useLogout();
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
              href: "/vendor/messages",
            },
            {
              icon: User,
              label: "Account",
              href: "/vendor/account",
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
              href: "/organizer/request-vendors",
            },
            {
              icon: MessageSquare,
              label: "Messages",
              href: "/organizer/messages",
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
            {
              icon: LogOut,
              label: "Log Out",
              href: "#",
              isLogout: true,
              onClick: handleLogout,
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
              href: "/organizer/account",
            },
            {
              icon: LogOut,
              label: "Log Out",
              href: "#",
              isLogout: true,
              onClick: handleLogout,
            },
          ],
    [isVendor, handleLogout]
  );

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";
  const sidebarPadding = isCollapsed ? "pl-0" : "pl-3";

  return (
    <>
      {/* Top Header - Fixed */}
      <Navbar
        user={{
          name: "Gabriel Emumwen",
          email: "gabrielemumwen20@gmail.com",
          avatar: undefined,
        }}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-[64px] sm:top-[89px] left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[64px] sm:top-[89px] bottom-0 flex-col pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
          isMobile
            ? isSidebarOpen
              ? "flex w-64"
              : "hidden"
            : isSidebarOpen
              ? `flex ${sidebarWidth}`
              : "hidden"
        }`}
      >
        {/* Close Button - Desktop */}
        {!isMobile && isSidebarOpen && (
          <div className="flex justify-end px-3 mb-4">
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={`h-5 w-5 text-gray-600 transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}

        {/* Close Button - Mobile */}
        {isMobile && isSidebarOpen && (
          <div className="flex justify-end px-3 mb-4">
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className={`flex-1 ${sidebarPadding}`}>
          <NavSection
            title="GENERAL"
            items={generalNavItems}
            isCollapsed={isCollapsed}
          />
          <NavSection
            title={
              isVendor
                ? "Proposals & communications"
                : "VENDORS & PROPOSALS"
            }
            items={vendorNavItems}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Bottom Navigation */}
        <div className={`${sidebarPadding} mt-auto`}>
          <NavSection
            title={isVendor ? "Account" : "GENERAL"}
            items={bottomNavItems}
            isCollapsed={isCollapsed}
          />
        </div>
      </aside>

      {/* Main Content - Responsive padding */}
      <main
        className={`pt-[64px] sm:pt-[89px] min-h-screen bg-gray-50 w-full transition-all duration-300 ${
          isMobile
            ? ""
            : isSidebarOpen
              ? isCollapsed
                ? "md:pl-16"
                : "md:pl-64"
              : "md:pl-0"
        }`}
      >
        <div className="bg-white min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-89px)] w-full">
          <div className="py-4 px-4 sm:py-6 sm:px-6 w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      </main>
      <ChatWidget/>
    </>
  );
};
