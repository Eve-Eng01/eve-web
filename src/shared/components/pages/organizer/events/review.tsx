import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trash2,
  MoreVertical,
  Edit,
  Image as ImageIcon,
} from "lucide-react";
import { Ticket } from "./ticketing";
import { DateTimePicker } from "../../../accessories/date-time-picker";
import { Ticket2 } from "iconsax-reactjs";

interface ReviewProps {
  tickets?: Ticket[];
  dateTimeEntries?: DateTimeEntry[];
  setDateTimeEntries?: (entries: DateTimeEntry[]) => void;
}

export interface DateTimeEntry {
  id: number;
  date: number;
  month: number;
  year: number;
  startTime: string;
  endTime: string;
}

const Review: React.FC<ReviewProps> = ({
  tickets = [],
  dateTimeEntries = [],
  setDateTimeEntries = () => {}, // no-op if not provided
}) => {
  const eventImage =
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop";

  const [showScheduler, setShowScheduler] = useState(false);

  const TicketsTable = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b">
        <span className="font-medium text-gray-700">
          {tickets.length} Ticket{tickets.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">10 January 2025</span>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-3 flex items-center gap-1">
            <span className="text-sm font-medium text-gray-500">
              Ticket Name
            </span>
          </div>
          <div className="col-span-3 flex items-center gap-1">
            <span className="text-sm font-medium text-gray-500">
              Ticket Price
            </span>
          </div>
          <div className="col-span-2 flex items-center gap-1">
            <span className="text-sm font-medium text-gray-500">Quantity</span>
          </div>
          <div className="col-span-3 flex items-center gap-1">
            <span className="text-sm font-medium text-gray-500">
              Ticket Sold
            </span>
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* Rows */}
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className={`grid grid-cols-12 gap-4 px-6 py-5 items-center ${
                index !== tickets.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="col-span-3">
                <span className="text-gray-800 font-medium">
                  {ticket.ticketName}
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-gray-800 font-medium">
                  ${parseFloat(ticket.ticketPrice || "0").toFixed(2)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-800 font-medium">
                  {ticket.quantity}
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-gray-800 font-medium">
                  {ticket.ticketsSold}/{ticket.quantity}
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-end gap-2">
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            No tickets added yet.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Event Summary */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 h-48 bg-purple-600 relative flex-shrink-0">
            <img
              src={eventImage}
              alt="Event"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">
                Elevate 2025: Innovation & Impact Summit
              </h3>
              <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Edit className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Date (multiple Date)</span>
                <span>21 Mar 2025</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Time</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Location:</span>
                <span>Landmark Centre, VI, Lagos</span>
              </div>

              <div className="flex items-center gap-2">
                <Ticket2 className="w-4 h-4" />
                <span className="font-medium">
                  {tickets.length} Ticket{tickets.length !== 1 ? "s" : ""}:
                </span>
                <Users className="w-4 h-4 ml-2" />
                <span className="font-medium">Quantity</span>
                <span className="font-semibold">
                  {tickets.reduce((sum, t) => sum + Number(t.quantity || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button className="w-full md:w-auto px-6 py-2.5 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium flex items-center justify-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Change Image
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <TicketsTable />

      {/* Organizer */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          Enter Organizer name
        </h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-800 font-medium">Eve International Event</p>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2">
          <span>Add Organizer</span>
          <span className="text-lg">+</span>
        </button>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-800">
          Event Visibility
        </h3>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="visibility"
            className="mt-1 w-5 h-5 text-purple-600"
          />
          <div>
            <p className="font-semibold text-gray-800">Public:</p>
            <p className="text-sm text-gray-600">
              Anyone can find and buy tickets.
            </p>
          </div>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="visibility"
            defaultChecked
            className="mt-1 w-5 h-5 text-purple-600"
          />
          <div>
            <p className="font-semibold text-gray-800">Private</p>
            <p className="text-sm text-gray-600">
              Only invited guests with a special link can view.
            </p>
          </div>
        </label>
      </div>

      {/* Refund Policy */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-800">Refund Policy</h3>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="refund"
            className="mt-1 w-5 h-5 text-purple-600"
          />
          <div>
            <p className="font-semibold text-gray-800">Automated Refund</p>
            <p className="text-sm text-gray-600">
              The system processes refunds automatically.
            </p>
          </div>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="refund"
            defaultChecked
            className="mt-1 w-5 h-5 text-purple-600"
          />
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-800">Time-Bound Refund</p>
              <p className="text-sm text-gray-600">
                Refunds allowed up to a set date before the event.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Enter the day you intend to make the refund
              </p>
              <input
                type="text"
                placeholder="7 Days"
                className="w-full max-w-xs px-4 py-2.5 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </label>
      </div>

      {/* Publish Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-800">
          Publish Settings
        </h3>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="publish"
            className="mt-1 w-5 h-5 text-purple-600"
          />
          <div>
            <p className="font-semibold text-gray-800">Publish Now</p>
            <p className="text-sm text-gray-600">
              Make your event public immediately.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="publish"
            defaultChecked
            className="mt-1 w-5 h-5 text-purple-600"
          />
          <div className="w-full space-y-3">
            <div>
              <p className="font-semibold text-gray-800">
                Schedule Publish date
              </p>
              <p className="text-sm text-gray-600">
                Pick a date/time to go live automatically.
              </p>
            </div>

            <button
              onClick={() => setShowScheduler(!showScheduler)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-left text-gray-600 hover:border-purple-300 transition-colors flex items-center justify-between"
            >
              <span>Schedule the Date and Time for your event</span>
              <svg
                className={`w-5 h-5 transition-transform ${showScheduler ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Only render DateTimePicker if function is provided */}
            {showScheduler && setDateTimeEntries && (
              <div className="mt-4">
                <DateTimePicker
                  dateTimeEntries={dateTimeEntries}
                  setDateTimeEntries={setDateTimeEntries}
                />
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default Review;
