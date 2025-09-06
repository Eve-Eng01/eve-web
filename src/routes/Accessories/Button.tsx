import { createFileRoute } from "@tanstack/react-router";
import React from "react";

// Button component interface
interface CustomButtonProps {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Custom Button Component
const CustomButton: React.FC<CustomButtonProps> = ({ title, icon, onClick, disabled = false, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        bg-purple-600
        hover:bg-purple-700
        disabled:bg-purple-400
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
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{title}</span>
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
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Custom Button Examples</h1>

        {/* Basic button like in the image */}
        <CustomButton title="Continue" onClick={handleClick} />

        {/* Button with icon */}
        <CustomButton
          title="Save Changes"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          onClick={handleClick}
        />

        {/* Button with different icon */}
        <CustomButton
          title="Download File"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <CustomButton title="Disabled Button" disabled={true} onClick={handleClick} />

        {/* Button without icon (icon is optional) */}
        <CustomButton title="Simple Button" onClick={() => console.log("Simple button clicked")} />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/Accessories/Button")({
  component: RouteComponent,
});

export function RouteComponent() {
  return <ButtonDemo />;
}
