import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { cn } from "../../utils/classnames";
import clsx from "clsx";

// Button component interface
interface CustomButtonProps {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Custom Button Component
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  icon,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        clsx(
          `w-full
        bg-[#7417C6]
        hover:bg-[#7417C6]
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
      `,
          className
        )
      )}
    >
      <span>{title}</span>
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};

// Export the CustomButton component so it can be imported elsewhere
export { CustomButton };

//
