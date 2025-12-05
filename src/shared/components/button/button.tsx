import React from "react";
import { cn } from "../../utils/classnames";

// Centralized button style classes
export const BUTTON_STYLES = {
  auth: "py-3 px-4 rounded-[14px] text-base",
} as const;

// Button component interface
interface CustomButtonProps {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

// Custom Button Component
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  icon,
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  className = "",
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-full",
        "bg-[#7417C6]",
        "hover:bg-[#5f1399]",
        "disabled:bg-gray-400",
        "disabled:cursor-not-allowed",
        "text-white",
        "font-medium",
        "text-lg",
        "py-4",
        "px-6",
        "rounded-2xl",
        "transition-colors",
        "duration-200",
        "flex",
        "items-center",
        "justify-center",
        "gap-2",
        "shadow-sm",
        "cursor-pointer",
        "relative",
        className
      )}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white absolute"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      <span className={loading ? "opacity-0" : ""}>{title}</span>
    </button>
  );
};

// Export the CustomButton component so it can be imported elsewhere
export { CustomButton };
