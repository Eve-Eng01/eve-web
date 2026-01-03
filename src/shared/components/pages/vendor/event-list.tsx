import React, { memo } from "react";
import EmptyContent from "../../accessories/empty-content";
import { ArrowRight } from "iconsax-reactjs";
import EventCard from "./event-card";
import { cn } from "../../../utils/classnames";
import CalendarImage from "@assets/calender.png";
import { Event as EventCardProps } from "@/shared/api/services/events";
import ErrorContainer from "@components/accessories/error-container";

type EventListProps = {
  events: EventCardProps[];
  title?: string;
  className?: string;
  hideSeeMore?: boolean;
  hideHeader?: boolean;
  error?: string | null;
  loading?: boolean;
  refetch?: () => void;
};

const EventList: React.FC<EventListProps> = ({
  events = [],
  title = " Event Opportunities for you",
  error,
  loading,
  className,
  hideSeeMore = false,
  hideHeader = false,
  refetch,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex-row items-center justify-between flex">
        {!hideHeader && (
          <div className="flex-1 flex-row items-center gap-2 flex">
            <h1 className="font-medium text-xl text-black">{title}</h1>
            <span className="bg-[#7417C6] text-white size-6 rounded-full text-xs inline-flex items-center justify-center">
              {events?.length || 0}
            </span>
          </div>
        )}
        {!hideSeeMore && (
          <a
            href="/vendor/event"
            className="text-sm opacity-60 inline-flex items-center gap-1"
          >
            <span>See more</span>
            <ArrowRight className="size-4" />
          </a>
        )}
      </div>

      {!loading && !error && !!events && events?.length < 1 && (
        <EmptyContent
          title="🕓 No Event Opportunities Yet"
          description="There are no event opportunities available at the moment. Once new events matching your service category are posted, you’ll see them here."
          image={CalendarImage}
        />
      )}
      {!loading && !error && !!events && events?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {events?.map((event) => (
            <EventCard key={event?._id} {...event} />
          ))}
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center py-12 min-h-[400px]">
          <span className="loading loading-spinner text-primary w-12 h-12"></span>
        </div>
      )}
      {!!error && <ErrorContainer error={error} refetchFunction={refetch} />}
    </div>
  );
};

export default memo(EventList);
