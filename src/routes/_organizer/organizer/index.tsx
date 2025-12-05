import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "iconsax-reactjs";
import { ChevronDown, Users } from "lucide-react";
import { useState, useRef } from "react";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import CreateEvent from "@components/pages/organizer/events/create-event";
import ScheduledEvent from "@components/pages/organizer/events/scheduled-event";
import PassedEvent from "@components/pages/organizer/events/passed-event";
import DraftedEvent from "@components/pages/organizer/events/drafter-event";
import DatePickerDropdown from "@components/accessories/date-picker-dropdown";

export const Route = createFileRoute("/_organizer/organizer/")({
  component: RouteComponent,
});

export const User = {
  name: "Gabriel Emumwen",
  email: "gabrielemumwen20@gmail.com",
};
export function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2025, 7, 5) // August 5, 2025
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerButtonRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("Current Event");

  const tabs = [
    "Current Event",
    "Scheduled Event",
    "Passed Event",
    "Drafted Event",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Current Event":
        return <CreateEvent onNavigateToTab={setActiveTab} />;

      case "Scheduled Event":
        return <ScheduledEvent />;

      case "Passed Event":
        return <PassedEvent />;

      case "Drafted Event":
        return <DraftedEvent />;

      default:
        return null;
    }
  };

  return (
    <DashboardLayout user={User}>
      <div>
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
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div
            ref={datePickerButtonRef}
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="flex items-center space-x-2 cursor-pointer border border-gray-200 rounded-lg p-2 bg-white"
          >
            <span className="text-sm text-gray-600">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Select Date"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">{renderTabContent()}</div>
      </div>

      {/* Date Picker Dropdown */}
      <DatePickerDropdown
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        triggerRef={datePickerButtonRef}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </DashboardLayout>
  );
}
