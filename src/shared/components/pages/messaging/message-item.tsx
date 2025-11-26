import React from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "../../../utils/classnames";

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
}

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isFirstInGroup = true; // You can implement grouping logic if needed
  const isLastInGroup = true; // You can implement grouping logic if needed

  return (
    <div
      className={cn(
        "flex w-full transition-all duration-300 ease-out",
        message.isSent ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-[12px]",
          message.isSent ? "items-end justify-center" : "items-start justify-center"
        )}
      >
        <div
          className={cn(
            "max-w-[85%] sm:max-w-[343px] px-2.5 sm:px-[10px] py-2 sm:py-[10px]",
            message.isSent
              ? "bg-[#7417c6] text-white"
              : "bg-[#f4f4f4] text-[#2d2d2d]"
          )}
          style={{
            borderRadius: message.isSent
              ? isFirstInGroup
                ? "24px 24px 0px 24px" // rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[24px] - all 24px
                : "20px 24px 24px 20px" // rounded-bl-[20px] rounded-tl-[20px] rounded-tr-[24px] - top-left 20px, top-right 24px, bottom-right 24px, bottom-left 20px
              : isFirstInGroup
              ? "24px 24px 24px 24px" // rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px] - all 24px
              : "20px 20px 20px 20px", // rounded-br-[20px] rounded-tl-[20px] rounded-tr-[20px] - all 20px
          }}
        >
          <p className="text-sm sm:text-[16px] font-medium leading-[24px] tracking-[0.08px] whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
        {isLastInGroup && (
          <div
            className={cn(
              "flex items-center gap-[8px]",
              message.isSent ? "flex-row" : "flex-row-reverse"
            )}
          >
            <span className="text-xs sm:text-[14px] font-medium text-[#666666] leading-normal tracking-[-0.14px]">
              {new Date(message.timestamp).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            {message.isSent && (
              <CheckCheck
                className={cn(
                  "w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0",
                  message.isRead ? "text-white" : "text-white opacity-70"
                )}
              />
            )}
            {!message.isSent && (
              <CheckCheck
                className={cn(
                  "w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0",
                  message.isRead ? "text-[#17b26a]" : "text-gray-400"
                )}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

