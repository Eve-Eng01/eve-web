import React, { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";
import FilterIcon from "./filter-icon";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedValues?: string[];
  onSelectionChange?: (selectedValues: string[]) => void;
  multiple?: boolean;
  className?: string;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selectedValues = [],
  onSelectionChange,
  multiple = false,
  className = "",
  triggerRef,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeRef = triggerRef || buttonRef;

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      // Close on ESC key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsVisible(false);
          setTimeout(() => setIsOpen(false), 300);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          activeRef?.current &&
          !activeRef.current.contains(target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(target)
        ) {
          setIsVisible(false);
          setTimeout(() => setIsOpen(false), 300);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, activeRef]);

  const handleOptionClick = (option: FilterOption) => {
    if (multiple) {
      const newSelection = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];
      onSelectionChange?.(newSelection);
    } else {
      onSelectionChange?.(
        selectedValues.includes(option.value) ? [] : [option.value]
      );
      setIsVisible(false);
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const isSelected = (value: string) => selectedValues.includes(value);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`border border-[#eaeaea] flex gap-2 h-[56px] items-center justify-center px-3 py-[10px] rounded-[14px] hover:bg-gray-50 transition-colors w-[200px] ${className}`}
      >
        <p className="font-medium leading-[20px] text-[14px] text-[#2d2d2d]">
          Filter
        </p>
        <FilterIcon color="#2d2d2d" />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 bg-white border border-[#eaeaea] rounded-[14px] py-2 min-w-[186px] top-full mt-2 right-0 transition-opacity duration-300 ease-out shadow-[0_4px_12px_rgba(116,23,198,0.25)] ${
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option, index) => (
            <React.Fragment key={option.id}>
              <div
                onClick={() => handleOptionClick(option)}
                className="flex items-center justify-between gap-2 h-[52px] px-2 mx-2 rounded-[8px] cursor-pointer transition-colors hover:bg-gray-50"
              >
                <p className="font-medium leading-[20px] text-[14px] text-[#2d2d2d]">
                  {option.label}
                </p>
                {isSelected(option.value) && (
                  <Check className="w-6 h-6 text-[#2d2d2d] shrink-0" />
                )}
              </div>
              {index < options.length - 1 && (
                <div className="h-px bg-[#eaeaea] my-1 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
