import React from "react";
import { Download, Package, Search } from "lucide-react";
import DataTable from "../../../accessories/data-table";

interface Order {
  id: string;
  orderNumber: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  items: number;
  total: number;
  date: string;
  status: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

const OrderListTab = () => {
  // Sample data - replace with actual data from API
  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2025-001",
      eventName: "Summer Music Festival",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      items: 2,
      total: 300.0,
      date: "2025-01-15",
      status: "delivered",
    },
    {
      id: "2",
      orderNumber: "ORD-2025-002",
      eventName: "Tech Conference 2025",
      customerName: "Jane Smith",
      customerEmail: "jane.smith@example.com",
      items: 1,
      total: 75.0,
      date: "2025-01-14",
      status: "confirmed",
    },
    {
      id: "3",
      orderNumber: "ORD-2025-003",
      eventName: "Art Exhibition",
      customerName: "Bob Johnson",
      customerEmail: "bob.johnson@example.com",
      items: 3,
      total: 150.0,
      date: "2025-01-13",
      status: "processing",
    },
    {
      id: "4",
      orderNumber: "ORD-2025-004",
      eventName: "Food & Wine Festival",
      customerName: "Alice Williams",
      customerEmail: "alice.williams@example.com",
      items: 1,
      total: 200.0,
      date: "2025-01-12",
      status: "shipped",
    },
    {
      id: "5",
      orderNumber: "ORD-2025-005",
      eventName: "Comedy Night",
      customerName: "Charlie Brown",
      customerEmail: "charlie.brown@example.com",
      items: 4,
      total: 120.0,
      date: "2025-01-11",
      status: "cancelled",
    },
  ];

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Orders</span>
            <Package className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-xs text-gray-500 mt-1">All time orders</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <span className="text-sm text-green-600 font-medium">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {orders.filter((o) => o.status === "delivered").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Delivered orders</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Orders</span>
            <span className="text-sm text-yellow-600 font-medium">
              {
                orders.filter(
                  (o) => o.status === "processing" || o.status === "confirmed"
                ).length
              }
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            $
            {orders
              .filter(
                (o) => o.status === "processing" || o.status === "confirmed"
              )
              .reduce((sum, o) => sum + o.total, 0)
              .toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending revenue</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-4">
        {/* Table Header with Search and Actions */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Order List</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white rounded-lg border border-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* DataTable */}
        {filteredOrders.length > 0 ? (
          <DataTable
            data={filteredOrders.map((order) => ({
              ticketName: order.eventName,
              attendeeName: order.customerName,
              noOfTickets: order.items.toString(),
              bookingId: order.orderNumber,
              purchaseDate: new Date(order.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }))}
            totalPages={Math.ceil(orders.length / 10)}
            onPageChange={(page) => {
              console.log("Page changed to:", page);
              // Handle page change logic here
            }}
          />
        ) : (
          <div className="px-6 py-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No orders found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListTab;
