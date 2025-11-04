import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import SalesTab from "@components/pages/organizer/sales/sales-tab";
import OrderListTab from "@components/pages/organizer/sales/order-list-tab";
import PayoutsTab from "@components/pages/organizer/sales/payout-tab";
import SettingsModal from "@components/accessories/setting-modal";
import DatePickerDropdown from "@components/accessories/date-picker-dropdown";

export const Route = createFileRoute("/organizer/sales")({
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
  const [activeTab, setActiveTab] = useState("Sales");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLDivElement>(null);

  const tabs = ["Sales", "Order List", "Payouts"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Sales":
        return <SalesTab />;

      case "Order List":
        return <OrderListTab />;

      case "Payouts":
        return <PayoutsTab />;

      default:
        return null;
    }
  };

  return (
    <DashboardLayout user={User}>
      <div className="bg-white ">
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-1">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors duration-150 text-gray-600 hover:text-gray-900 hover:bg-gray-100`}
            >
              Back
            </button>
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
            ref={settingsButtonRef}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center space-x-2 cursor-pointer border border-gray-200 rounded-lg px-4 py-2 relative z-50 bg-white"
          >
            <span className="text-sm text-gray-600">Setting</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">{renderTabContent()}</div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        triggerRef={settingsButtonRef}
      />

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
