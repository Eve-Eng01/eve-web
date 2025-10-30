import React, { memo } from "react";
import EmptyContent from "../../Accessories/EmptyContent";
import { ArrowRight } from "iconsax-reactjs";
import EventCard, { EventCardProps } from "./EventCard";
import { cn } from "../../../shared/utils/classnames";
import CalendarImage from "../../../assets/calender.png";

type EventListProps = {
  events: EventCardProps[];
  title?: string;
  className?: string;
};

const EventList: React.FC<EventListProps> = ({
  events = [],
  title = " Event Opportunities for you",
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex-row items-center justify-between flex">
        <div className="flex-1 flex-row items-center gap-2 flex">
          <h1 className="font-medium text-xl text-black">{title}</h1>
          <span className="bg-[#7417C6] text-white size-6 rounded-full text-xs inline-flex items-center justify-center">
            {events?.length || 0}
          </span>
        </div>
        <a
          href="/Pages/Screens/Events"
          className="text-sm opacity-60 inline-flex items-center gap-1"
        >
          <span>See more</span>
          <ArrowRight className="size-4" />
        </a>
      </div>

      {events?.length < 1 && (
        <EmptyContent
          title="🕓 No Event Opportunities Yet"
          description="There are no event opportunities available at the moment. Once new events matching your service category are posted, you’ll see them here."
          image={CalendarImage}
        />
      )}
      {events && events?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <EventCard key={event?.id} {...event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(EventList);
