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

//