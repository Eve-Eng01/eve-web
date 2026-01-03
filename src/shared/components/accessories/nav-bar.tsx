import React from "react";
import { Search, Bell, User } from "lucide-react";
import logoImg from "@assets/eve.png";

interface NavbarProps {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
    profilePictureUrl?: string | null;
  };
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#170528] shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-row items-center gap-2 sm:gap-[2%] flex-1 min-w-0">
          {/* logo */}
          <img src={logoImg} alt="" className="w-[77px] h-[57px] " />
          {/* Search Bar */}
          {/* <div className="hidden sm:block flex-1 max-w-lg min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for events, vendors....."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
          </div> */}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {user.avatar || user.profilePictureUrl ? (
                  <img
                    src={user.avatar || user.profilePictureUrl || ""}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-white">{user.name}</div>
              <div className="text-sm text-gray-300">{user.email}</div>
            </div>
          </div>

          {/* <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
