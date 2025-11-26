import { Download, Calendar, Clock, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import React from "react";
import SearchBar from "../../../accessories/SearchBar";
import DataTable from "../../../accessories/data-table";
import SalesRevenueChart from "../../../accessories/search-bar";

interface Payout {
  id: string;
  accName: string;
  accNumber: string;
  amountPaid: number;
  transferFee: number;
  paymentDate: string;
  status: "Successful" | "Pending" | "Failed";
}

interface EventData {
  id: string;
  name: string;
  imageUrl?: string;
  startTime: string;
  endTime: string;
  date: string;
  venue: string;
}

interface PayoutsTabProps {
  onRequestPayout?: () => void;
}

const PayoutsTab: React.FC<PayoutsTabProps> = ({ onRequestPayout }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "24 hours" | "7 days" | "30 days"
  >("7 days");

  // Filter options - can be passed from parent or API
  const filterOptions = [
    { id: "1", label: "Checked-In", value: "checked-in" },
    { id: "2", label: "No Show", value: "no-show" },
    { id: "3", label: "Pending", value: "pending" },
    { id: "4", label: "Refund Policy", value: "refund-policy" },
  ];

  // Mock event data - replace with actual data from API
  const eventData: EventData = {
    id: "1",
    name: "Elevate 2025: Innovation & Impact Summit",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop&q=80",
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    date: "15 Mar 2025",
    venue: "27, eve's avenue lagos, Nigeria.",
  };
  // Generate mock data for multiple pages based on Figma design
  const generateMockPayouts = (): Payout[] => {
    const accountNames = ["Anthony Mary", "Gabriel Emumwen"];
    const accountNumber = "2109444094";
    const statuses: ("Successful" | "Pending" | "Failed")[] = [
      "Successful",
      "Successful",
      "Successful",
      "Pending",
      "Pending",
      "Failed",
    ];

    // Based on Figma: amounts range from $22,000 to $90,000
    const amounts = [90000, 80000, 76000, 66000, 56000, 34000, 22000];
    const transferFees = [10.0, 24.0, 24.9, 50.0, 50.99, 74.0];

    const payouts: Payout[] = [];

    // Generate data for multiple years as shown in Figma
    const years = [2025, 2025, 2025, 2025, 2025, 2024, 2023, 2023];
    const baseMonth = 8; // September (0-indexed, so 8 = September)

    for (let i = 0; i < 28; i++) {
      const accName = accountNames[i % accountNames.length];
      const amountPaid = amounts[i % amounts.length];
      const transferFee = transferFees[i % transferFees.length];
      const status = statuses[i % statuses.length];

      // Cycle through years
      const year = years[i % years.length];
      const date = new Date(year, baseMonth, 5);

      payouts.push({
        id: (i + 1).toString(),
        accName,
        accNumber: accountNumber,
        amountPaid,
        transferFee,
        paymentDate: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status,
      });
    }

    return payouts.sort((a, b) => {
      const dateA = new Date(a.paymentDate);
      const dateB = new Date(b.paymentDate);
      return dateB.getTime() - dateA.getTime();
    });
  };

  // Sample data - replace with actual data from API
  // Use useMemo to prevent regenerating data on every render
  const payouts: Payout[] = useMemo(() => generateMockPayouts(), []);

  // Calculate total revenue for chart (all successful payouts)
  const totalRevenue = payouts
    .filter((payout) => payout.status === "Successful")
    .reduce((sum, payout) => sum + payout.amountPaid, 0);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format currency with no decimals for large amounts
  const formatCurrencyNoDecimals = (amount: number) => {
    return `$${amount.toLocaleString("en-US")}`;
  };

  // Status component with colored dot
  const StatusBadge = ({
    status,
  }: {
    status: "Successful" | "Pending" | "Failed";
  }) => {
    const statusConfig = {
      Successful: { color: "#17b26a", label: "Successful" },
      Pending: { color: "#f79009", label: "Pending" },
      Failed: { color: "#f04438", label: "Failed" },
    };

    const config = statusConfig[status];

    return (
      <div className="flex gap-1 items-center justify-start">
        <div
          className="size-2 rounded-full shrink-0"
          style={{ backgroundColor: config.color }}
        />
        <p
          className="font-['Poppins',sans-serif] font-medium leading-[24px] text-[16px] tracking-[0.08px]"
          style={{ color: config.color }}
        >
          {config.label}
        </p>
      </div>
    );
  };

  //TODO: make this a reusable banner component
  return (
    <div className="space-y-6">
      {/* Event Banner */}
      <div className="relative w-full h-[281px] rounded-xl overflow-hidden flex items-center">
        {eventData.imageUrl ? (
          <img
            src={eventData.imageUrl}
            alt={eventData.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg font-medium">
                No Event Image
              </p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-purple-700/40" />

        {/* Event Details Overlay */}
        <div className="relative z-10 left-6 flex flex-col gap-1">
          <h2 className="font-semibold leading-[24px] text-[16px] text-white tracking-[0.08px]">
            {eventData.name}
          </h2>
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-4 h-4" />
            <p className="font-medium leading-[20px] text-[14px]">
              Time {eventData.startTime} – {eventData.endTime}
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Calendar className="w-4 h-4" />
            <p className="font-medium leading-[20px] text-[14px]">
              Date: {eventData.date}
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <p className="font-medium leading-[20px] text-[14px]">
              Venue: {eventData.venue}
            </p>
          </div>
        </div>
      </div>

      {/* Sales Revenue Chart */}
      <SalesRevenueChart
        revenue={totalRevenue}
        percentageChange={3.2}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={setSelectedFilters}
        multipleFilters={true}
      />

      {/* Table Section */}
      <div className="flex flex-col gap-4">
        {/* Table Header with Actions */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Payout History
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={onRequestPayout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#7417C6] hover:bg-[#5f12a0] rounded-lg transition-colors"
            >
              Request Payout
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white rounded-lg border border-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          data={payouts.map((payout) => ({
            accName: payout.accName,
            accNumber: payout.accNumber,
            amountPaid: formatCurrencyNoDecimals(payout.amountPaid),
            transferFee: formatCurrency(payout.transferFee),
            paymentDate: payout.paymentDate,
            status: <StatusBadge status={payout.status} />,
          }))}
          itemsPerPage={10}
          onPageChange={(page) => {
            console.log("Page changed to:", page);
            // Handle page change logic here
          }}
        />
      </div>
    </div>
  );
};

export default PayoutsTab;
