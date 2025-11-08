import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import DeleteConfirmationModal from "../../../accessories/delete-confirmation-modal";

const DraftedEvent = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const events = [
    {
      id: 1,
      title: "Elevate 2025: Innovation & Impact Summit",
      time: "10:00 AM - 4:00 PM",
      status: "Draft (to Start: 15 Mar 2025)",
      lastEdited: "10 Feb 2025",
      type: "Visual Event",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    },
    {
      id: 2,
      title: "Elevate 2025: Innovation & Impact Summit",
      time: "10:00 AM - 4:00 PM",
      status: "Draft (to Start: 15 Mar 2025)",
      lastEdited: "10 Feb 2025",
      type: "Physical Event",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    },
  ];

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#f4f4f4] p-2 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Event Image */}
              <div className={`h-[254px] relative overflow-hidden`}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="p-6 bg-[#f4f4f4]">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
                    {event.title}
                  </h3>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Time</span> {event.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {event.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Last Edited:</span>{" "}
                    {event.lastEdited}
                  </p>
                </div>

                {/* Event Type Badge */}
                <div className="flex justify-end">
                  <span
                    className={`inline-flex items-center text-sm font-medium bg-[#F1E8F9] p-5 rounded-xl ${
                      event.type === "Visual Event"
                        ? "text-purple-600"
                        : "text-purple-600"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                    {event.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={() => {}}
        title="Delete Draft"
        description={
          <p className="text-gray-600 mb-8 px-4 leading-relaxed">
            This action cannot be undone. Once you delete this draft, all event
            details you've saved so far will be permanently removed.
          </p>
        }
      />
    </>
  );
};

export default DraftedEvent;
