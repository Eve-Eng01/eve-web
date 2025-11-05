import React, { useMemo } from "react";
import { Download, Calendar, Clock, MapPin } from "lucide-react";
import SearchBar from "../../../accessories/SearchBar";
import DataTable from "../../../accessories/data-table";

interface Sale {
  id: string;
  eventName: string;
  customer: string;
  ticketType: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: "completed" | "pending" | "refunded";
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

const SalesTab = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

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
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop&q=80", // Event banner image
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    date: "15 Mar 2025",
    venue: "27, eve's avenue lagos, Nigeria.",
  };
  // Generate mock data for multiple pages
  const generateMockSales = (): Sale[] => {
    const events = [
      "Summer Music Festival",
      "Tech Conference 2025",
      "Art Exhibition",
      "Food & Wine Festival",
      "Comedy Night",
      "Film Festival",
      "Jazz Concert",
      "Business Summit",
      "Yoga Retreat",
      "Photography Workshop",
      "Cooking Class",
      "Dance Performance",
    ];

    const customers = [
      "John Doe",
      "Jane Smith",
      "Bob Johnson",
      "Alice Williams",
      "Charlie Brown",
      "Diana Prince",
      "Edward Norton",
      "Fiona Apple",
      "George Lucas",
      "Helen Keller",
      "Ian McKellen",
      "Julia Roberts",
      "Kevin Hart",
      "Laura Croft",
      "Michael Jordan",
      "Nancy Drew",
      "Oscar Wilde",
      "Penelope Cruz",
      "Quentin Tarantino",
      "Rachel Green",
      "Steve Jobs",
      "Tina Fey",
      "Uma Thurman",
      "Vincent Van Gogh",
      "Winston Churchill",
      "Xavier Woods",
      "Yoko Ono",
      "Zoe Saldana",
    ];

    const ticketTypes = [
      "VIP",
      "General Admission",
      "Early Bird",
      "Premium",
      "Standard",
      "Student",
    ];
    const statuses: ("completed" | "pending" | "refunded")[] = [
      "completed",
      "completed",
      "completed",
      "pending",
      "refunded",
    ];
    const prices = [50, 75, 100, 150, 200, 250];

    const sales: Sale[] = [];
    const baseDate = new Date("2025-01-01");

    for (let i = 1; i <= 28; i++) {
      const eventName = events[Math.floor(Math.random() * events.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const ticketType =
        ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const price = prices[Math.floor(Math.random() * prices.length)];
      const total = price * quantity;
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const saleDate = new Date(baseDate);
      saleDate.setDate(baseDate.getDate() + i);

      sales.push({
        id: i.toString(),
        eventName,
        customer,
        ticketType,
        quantity,
        price,
        total,
        date: saleDate.toISOString().split("T")[0],
        status,
      });
    }

    return sales.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  // Sample data - replace with actual data from API
  // Use useMemo to prevent regenerating data on every render
  const sales: Sale[] = useMemo(() => generateMockSales(), []);

  // Calculate metrics from sales data
  const totalRevenue = sales
    .filter((sale) => sale.status === "completed")
    .reduce((sum, sale) => sum + sale.total, 0);

  const totalTicketsSold = sales
    .filter((sale) => sale.status === "completed")
    .reduce((sum, sale) => sum + sale.quantity, 0);

  // Total payout payments (all completed sales)
  const totalPayoutPayments = totalRevenue;

  // Next payout date (example: next month)
  const nextPayoutDate = new Date();
  nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 1);
  const nextPayoutFormatted = nextPayoutDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format currency with commas
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

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
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg font-medium">
                No Event Image
              </p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-700/40" />

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

      {/* Summary Cards - Matching Figma Design */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-[22px]">
        {/* Total Sales Revenue */}
        <div className="bg-[#f4f4f4] border border-[#eaeaea] w-full sm:flex-1 sm:min-w-[calc(50%-11px)] lg:min-w-0 h-[84px] rounded-[12px] flex items-center">
          <div className="flex flex-col gap-1 sm:gap-[8px] items-start pl-[22px] pr-4">
            <p className="font-medium leading-[20px] text-[14px] text-[#777777]">
              Total Sales Revenue
            </p>
            <p className="font-semibold leading-[24px] sm:leading-[32px] text-[20px] sm:text-[24px] text-[#7417c6] tracking-[0.12px]">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Total Ticket Sold */}
        <div className="bg-[#f4f4f4] border border-[#eaeaea] w-full sm:flex-1 sm:min-w-[calc(50%-11px)] lg:min-w-0 h-[84px] rounded-[12px] flex items-center">
          <div className="flex flex-col gap-1 sm:gap-[8px] items-start pl-[24px] pr-4">
            <p className="font-medium leading-[20px] text-[14px] text-[#777777]">
              Total Ticket Sold
            </p>
            <p className="font-semibold leading-[24px] sm:leading-[32px] text-[20px] sm:text-[24px] text-[#7417c6] tracking-[0.12px]">
              {formatNumber(totalTicketsSold)}
            </p>
          </div>
        </div>

        {/* Total Payout Payments */}
        <div className="bg-[#f4f4f4] border border-[#eaeaea] w-full sm:flex-1 sm:min-w-[calc(50%-11px)] lg:min-w-0 h-[84px] rounded-[12px] flex items-center">
          <div className="flex flex-col gap-1 sm:gap-[8px] items-start pl-[21px] pr-4">
            <p className="font-medium leading-[20px] text-[14px] text-[#777777]">
              Total Payout Payments
            </p>
            <p className="font-semibold leading-[24px] sm:leading-[32px] text-[20px] sm:text-[24px] text-[#7417c6] tracking-[0.12px]">
              {formatCurrency(totalPayoutPayments)}
            </p>
          </div>
        </div>

        {/* Next Payout */}
        <div className="bg-[#f4f4f4] border border-[#eaeaea] w-full sm:flex-1 sm:min-w-[calc(50%-11px)] lg:min-w-0 h-[84px] rounded-[12px] flex items-center">
          <div className="flex flex-col gap-1 sm:gap-[8px] items-start pl-[24px] pr-4">
            <p className="font-medium leading-[20px] text-[14px] text-[#777777]">
              Next Payout
            </p>
            <p className="font-semibold leading-[24px] sm:leading-[32px] text-[20px] sm:text-[24px] text-[#7417c6] tracking-[0.12px]">
              {nextPayoutFormatted}
            </p>
          </div>
        </div>
      </div>

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
            Sales Transactions
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white rounded-lg border border-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* DataTable */}
        <DataTable
          data={sales.map((sale) => ({
            ticketName: `${sale.eventName}: ${sale.ticketType}`,
            attendeeName: sale.customer,
            noOfTickets: sale.quantity.toString(),
            bookingId: `BK-${sale.id.padStart(6, "0")}`,
            purchaseDate: new Date(sale.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
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

export default SalesTab;
