import React, { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { cn } from "../../../utils/classnames";

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = "Type message",
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[rgba(0,0,0,0.05)] bg-[#f4f4f4] min-h-[80px] sm:min-h-[100px] md:h-[115px] flex items-center justify-center py-3 sm:py-4 md:py-0">
      <div className="w-full max-w-full md:max-w-[616px] h-full relative flex items-center px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-[22px] w-full">
          {/* Input area */}
          <div className="flex-1 relative min-w-0">
            <div className="bg-[#eaeaea] border border-[#bfbfbf] h-[48px] sm:h-[52px] md:h-[57px] rounded-full relative flex items-center px-3 sm:px-4 md:px-[15px]">
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                {/* Emoji button */}
                <button
                  type="button"
                  className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
                  disabled={disabled}
                >
                  <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </button>

                {/* Text input with cursor indicator */}
                <div className="flex items-center gap-1.5 sm:gap-[6px] flex-1 min-w-0">
                  <div className="w-px h-4 sm:h-[18px] bg-[#7726cd] flex-shrink-0" />
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className={cn(
                      "flex-1 bg-transparent border-0 outline-none resize-none overflow-hidden",
                      "text-sm sm:text-[14px] font-medium text-[#2d2d2d] leading-[20px]",
                      "placeholder:text-[#2d2d2d]",
                      "transition-all duration-200",
                      "min-w-0",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                    style={{ minHeight: "20px", maxHeight: "120px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className={cn(
              "flex-shrink-0 w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] md:w-[57px] md:h-[57px] rounded-full transition-all duration-200",
              "bg-[#7417c6] hover:bg-[#6a15b8] active:scale-95",
              "disabled:bg-gray-300 disabled:cursor-not-allowed",
              "flex items-center justify-center"
            )}
          >
            <Send className="w-5 h-5 sm:w-6 sm:h-6 md:w-[26.243px] md:h-[26.243px] text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

