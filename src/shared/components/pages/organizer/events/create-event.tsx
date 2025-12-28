import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import EmptyEventCard from "../../../accessories/empty-event-card";
import { useGetUserEventsByStatus } from "@/shared/api/services/events/events.hooks";
import type { Event } from "@/shared/api/services/events/types";

type CreateEventProps = {
  onNavigateToTab: (tab: string) => void;
  autoShowForm?: boolean;
  isActive?: boolean;
};

// CreateEvent Component - Shows published events for Current Event tab
const CreateEvent = ({ isActive = false }: CreateEventProps) => {
  const navigate = useNavigate();
  const { data: eventsResponse, isLoading, error } = useGetUserEventsByStatus(
    "published",
    isActive
  );

  // Get published events
  const publishedEvents = useMemo(() => {
    if (!eventsResponse?.data?.events) return [];
    return eventsResponse.data.events;
  }, [eventsResponse]);

  // Format event data for display
  const formattedEvents = useMemo(() => {
    return publishedEvents.map((event: Event) => {
      const firstOccurrence = event.occurrences?.[0];
      const firstTimeSlot = firstOccurrence?.timeSlots?.[0];

      const startDate = firstTimeSlot?.startAt
        ? new Date(firstTimeSlot.startAt)
        : null;

      const endDate = firstTimeSlot?.endAt
        ? new Date(firstTimeSlot.endAt)
        : null;

      const timeStr =
        startDate && endDate
          ? `${startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
          : "Time TBD";

      const dateStr = startDate
        ? startDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Date TBD";

      const typeStr =
        event.format === "virtual"
          ? "Virtual Event"
          : event.format === "hybrid"
            ? "Hybrid Event"
            : "Physical Event";

      return {
        id: event._id,
        title: event.name,
        time: timeStr,
        date: dateStr,
        type: typeStr,
        image:
          event.media?.url ||
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        event,
      };
    });
  }, [publishedEvents]);

  const handleContinue = () => {
    navigate({ to: "/organizer/events/create" });
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12 min-h-[400px]">
          <span className="loading loading-spinner text-primary w-12 h-12"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 mb-4">Failed to load current events</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (formattedEvents.length === 0) {
    return (
      <EmptyEventCard
        title="No Current Events"
        description="You don't have any events happening right now. Current events will appear here."
        buttonText="CREATE NEW EVENT"
        onButtonClick={handleContinue}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-[24px]">
        {formattedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-[#f4f4f4] p-[8px] flex items-center relative cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate({ to: `/organizer/events/${event.id}` })}
          >
            <div className="flex flex-col items-start justify-center flex-1 min-w-0 relative">
              <div className="bg-[#f1e8f9] h-[254px] overflow-hidden relative w-full">
                <img
                  src={event.image}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />
              </div>
              <div className="border-2 border-dashed border-[#dfdfdf] h-[196px] overflow-hidden relative rounded-bl-[12px] rounded-br-[12px] w-full">
                <div className="absolute bg-[#f1e8f9] bottom-[-2px] flex gap-[6px] items-center justify-center px-[12px] py-[8px] right-[-2px] rounded-[8px]">
                  <div className="relative shrink-0 size-[6px]">
                    <div className="absolute inset-0 bg-[#7417c6] rounded-full"></div>
                  </div>
                  <p className="font-medium leading-[20px] relative shrink-0 text-[14px] text-[#7417c6]">
                    {event.type}
                  </p>
                </div>
                <div className="absolute flex items-start justify-between left-1/2 top-[22px] -translate-x-1/2 w-[calc(100%-32px)] max-w-[471px]">
                  <div className="flex flex-col gap-[8px] items-start justify-center relative shrink-0 flex-1 min-w-0 pr-4">
                    <p className="font-medium leading-[24px] relative shrink-0 text-[16px] text-[#2d2d2d] tracking-[0.08px]">
                      {event.title}
                    </p>
                    <div className="flex flex-col gap-[12px] items-start leading-[20px] relative shrink-0 text-[14px] text-[#5a5a5a] font-normal">
                      <p className="relative shrink-0">Date: {event.date}</p>
                      <p className="relative shrink-0">Time: {event.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateEvent;
