import { Calendar } from 'iconsax-reactjs';
import { ChevronDown, Users } from 'lucide-react';
import React, { useState } from 'react';

export const EventDashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('August 5, 2025');
    const [activeTab, setActiveTab] = useState('Current Event');
  
    const tabs = ['Current Event', 'Scheduled Event', 'Passed Event', 'Drafted Event'];
  
    return (
      <div>
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, Anthony Mary 👋👋
          </h1>
        </div>
  
        {/* Event Tabs and Date Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  activeTab === tab
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
  
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{selectedDate}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
  
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-64 h-48 mb-8">
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
              <div className="relative">
                <Calendar className="w-20 h-20 text-purple-400" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
  
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            You Have No upcoming Event
          </h3>
          <p className="text-gray-600 text-center max-w-md mb-8">
            You haven't added any upcoming events. Once you do, they'll appear here for easy access.
          </p>
  
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-150">
            CREATE NEW EVENT
          </button>
        </div>
      </div>
    );
  };