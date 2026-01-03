import React, { memo, useCallback } from "react";
import { CustomButton } from "../../button/button";
import { useNavigate } from "@tanstack/react-router";
import { Event as EventCardProps } from "@/shared/api/services/events";

const EventCard: React.FC<EventCardProps> = ({
  media,
  name,
  description,
  vendorServices,
  // isClosingSoon,
  // isNew,
  _id,
}) => {
  const navigate = useNavigate();

  const viewEventDetails = useCallback(
    (id: string) => {
      navigate({
        to: "/vendor/event/$eventId",
        params: { eventId: id },
      });
    },
    [navigate]
  );
  return (
    <div className="rounded-xl overflow-hidden bg-[#f4f4f4]">
      <div className="w-full aspect-video relative bg-black/10">
        <img
          src={media?.url || ""}
          alt={name || "Unable to load image"}
          className="w-full h-full object-cover object-center"
        />
        {/* <div className="absolute top-4 right-4 inline-flex items-center gap-2">
          {isNew && (
            <span className="bg-[#DDF5EB] text-[#17B26A] inline-flex py-1 px-2 text-xs rounded-md">
              New
            </span>
          )}
          {isClosingSoon && (
            <span className="bg-[#FEF4E6] text-[#F79009] inline-flex py-1 px-2 text-xs rounded-md">
              Closing soon
            </span>
          )}
        </div> */}
      </div>
      <div className="px-4">
        <div className="py-4">
          <h3 className="text-lg font-medium">
            {name || "Title not available"}
          </h3>
        </div>
        <div className="py-4 border-t border-b border-black/10 border-dashed">
          <p className="text-sm text-black/60">
            {description || "Description not available"}
          </p>
        </div>
        <div className="py-4 flex items-center justify-between gap-6">
          <p>Services</p>

          <span className="inline-flex text-xs rounded-md py-1 px-2 bg-[#D3F0F9] text-[#0094C1]">
            {vendorServices?.map((service) => service?.name).join(", ")}
          </span>
        </div>
        <div className="pb-4 flex items-center gap-6">
          <CustomButton
            title="View Event"
            className="flex-1 text-xs"
            onClick={() => viewEventDetails(_id)}
          />
          <CustomButton
            title="Remove event"
            className="flex-1 text-xs bg-[#cbc9c9] text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(EventCard);
