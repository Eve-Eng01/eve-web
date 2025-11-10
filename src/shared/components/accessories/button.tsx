import React from "react";
import { cn } from "../../utils/classnames";

// Button component interface
interface CustomButtonProps {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

// Custom Button Component
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  icon,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  loading = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        `
        w-full
        bg-[#7417C6]
        hover:bg-[#7417C6]
        disabled:bg-gray-400
        disabled:cursor-not-allowed
        text-white
        font-medium
        text-lg
        py-4
        px-6
        rounded-2xl
        transition-colors
        duration-200
        flex
        items-center
        justify-center
        gap-2
        shadow-sm
        cursor-pointer
        relative
        `,
        loading && "bg-gray-400",
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

// Demo component showing usage examples
const ButtonDemo: React.FC = () => {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Custom Button Examples
        </h1>

        {/* Basic button like in the image */}
        <CustomButton title="Continue" onClick={handleClick} />

        {/* Button with icon */}
        <CustomButton
          title="Save Changes"
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
          onClick={handleClick}
        />

        {/* Button with different icon */}
        <CustomButton
          title="Download File"
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          onClick={handleClick}
        />

        {/* Disabled button */}
        <CustomButton
          title="Disabled Button"
          disabled={true}
          onClick={handleClick}
        />

        {/* Button without icon (icon is optional) */}
        <CustomButton
          title="Simple Button"
          onClick={() => console.log("Simple button clicked")}
        />
      </div>
    </div>
  );
};
