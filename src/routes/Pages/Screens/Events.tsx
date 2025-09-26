import { createFileRoute } from '@tanstack/react-router'
import { Calendar } from 'iconsax-reactjs';
import { ChevronDown, Users } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout } from '../Dashboard/DashboardLayout';
import { CustomButton } from '../../Accessories/Button';
import calenderImg from "../../../assets/calender.png"

export const Route = createFileRoute('/Pages/Screens/Events')({
  component: RouteComponent,
})

export const User = {
    name: 'Gabriel Emumwen',
    email: 'gabrielemumwen20@gmail.com',
  };
export function RouteComponent() {

    const [selectedDate, setSelectedDate] = useState('August 5, 2025');
    const [activeTab, setActiveTab] = useState('Current Event');
  
    const tabs = ['Current Event', 'Scheduled Event', 'Passed Event', 'Drafted Event'];

  return (
    <DashboardLayout user={User}>
        <div>
            {/* Welcome Header */}
            <div className="mb-8">
            <h1 className="text-3xl font-[400] text-gray-900 mb-2">
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
                    <img src={calenderImg} alt="" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    You Have No upcoming Event
                </h3>
                <p className="text-gray-600 text-center max-w-md mb-8">
                    You haven't added any upcoming events. Once you do, they'll appear here for easy access.
                </p>

                <div className="w-full max-w-md otherbtn mt-[40px]">
                    <CustomButton title="Continue" onClick={() => console.log("testing")} />
                </div>
            </div>
        </div>
    </DashboardLayout>
  )
}