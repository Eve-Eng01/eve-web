import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import logoImg from '../../../assets/evelogo.png';

interface NavbarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <header className="bg-gray-900 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">

        <div className="flex flex-row items-center gap-[2%] w-[421px]">
            {/* logo */}
            <img src={logoImg} alt="" className='w-[87px] h-[57px]'/>
            {/* Search Bar */}
            <div className=" max-w-lg">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for events, vendors....."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>
            </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-white">{user.name}</div>
              <div className="text-sm text-gray-300">{user.email}</div>
            </div>
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <Bell className="h-6 w-6" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;