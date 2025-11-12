import { cn } from "@utils/classnames";
import React, { memo } from "react";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  parentClassName?: string;
}

export const TextArea: React.FC<InputFieldProps> = memo(
  ({
    label,
    placeholder,
    value,
    onChange,
    className = "",
    parentClassName = "",
  }) => {
    return (
      <div className={cn("w-full", parentClassName)}>
        {label && (
          <label className="block text-gray-600 text-sm mb-2 font-medium">
            {label}
          </label>
        )}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            `w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all`,
            className
          )}
        />
      </div>
    );
  }
);

TextArea.displayName = "Text area";
