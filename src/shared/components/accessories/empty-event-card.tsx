import React from "react";
import calendarIllustration from "@assets/empty-states/draqft.svg";

type EmptyEventCardProps = {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

const EmptyEventCard: React.FC<EmptyEventCardProps> = ({
  title,
  description,
  buttonText = "CREATE NEW EVENT",
  onButtonClick,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-[#f4f4f4] rounded-[16px] w-full min-h-[600px] flex items-center justify-center relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          {/* Calendar Illustration */}
          <div className="relative shrink-0 mb-6">
            <div className="relative size-[202px]">
              {/* Gradient background circle */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#c7a2e8] to-[rgba(244,244,244,0)] rounded-full"></div>
              {/* Calendar illustration container */}
              <div className="absolute inset-[21.29%_13.37%_21.74%_13.37%]">
                <div className="w-full h-full relative flex items-center justify-center">
                  <img
                    src={calendarIllustration}
                    alt="Calendar illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-[24px] items-center">
            <div className="flex flex-col gap-[4px] items-center text-center">
              <p className="font-medium leading-[28px] text-[20px] text-[#2d2d2d] tracking-[0.1px]">
                {title}
              </p>
              <p className="font-normal leading-[24px] text-[16px] text-[#777] tracking-[0.08px] w-[442px] whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {/* Create New Event Button */}
            {onButtonClick && (
              <button
                onClick={onButtonClick}
                className="bg-[#7417c6] h-[64px] flex items-center justify-center px-[48px] py-[12px] rounded-[14px] w-[267px] hover:bg-[#5f1399] transition-colors"
              >
                <p className="font-bold leading-[20px] text-[14px] text-white text-center">
                  {buttonText}
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyEventCard;

