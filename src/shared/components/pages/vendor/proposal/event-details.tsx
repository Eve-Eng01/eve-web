import { memo } from "react";
import eventImage from "@assets/event/event-image.png";

const EventDetails = () => {
  return (
    <div className="p-5 bg-[#F7F7F7] space-y-6">
      <div className="w-full aspect-video max-h-[350px] relative bg-black/10">
        <img
          src={eventImage}
          alt="Event"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="space-y-2">
        <h1 className="font-medium text-2xl">Tech Innovation Summit 2025</h1>
        <p className="opacity-60">
          The Tech Innovation Summit 2025 is a two-day flagship technology
          conference that will gather over 500 industry leaders, startup
          founders, investors, and tech enthusiasts from across Africa Read
          More. Date oct 25, 2025, lagos nigeria budget $500k-1.2m
        </p>
      </div>
    </div>
  );
};

export default memo(EventDetails);
