import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, DollarSign } from "lucide-react";

import type { CategoryOption } from "./multi-select-category-dropdown";

interface IndividualProposalLimitsProps {
  categories: CategoryOption[];
  limits: Record<string, string>;
  onChange: (limits: Record<string, string>) => void;
  className?: string;
}

export const IndividualProposalLimits: React.FC<
  IndividualProposalLimitsProps
> = ({ categories, limits, onChange, className = "" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleLimitChange = (categoryValue: string, value: string): void => {
    onChange({
      ...limits,
      [categoryValue]: value,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="bg-[#f4f4f4] border border-[#eaeaea] rounded-[16px] sm:rounded-[20px] p-1.5 sm:p-2">
        {/* Dropdown Trigger - Shows placeholder */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full h-[60px] sm:h-[70px] bg-white border-2 border-dashed border-[#dfdfdf] rounded-[12px] sm:rounded-[16px] px-3 sm:px-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent transition-all"
        >
          <span className="text-sm sm:text-base md:text-lg font-semibold text-[#2d2d2d] leading-[20px] sm:leading-[24px] md:leading-[26px] tracking-[0.09px]">
            Enter proposals For each Vendors
          </span>
          <div className="bg-white rounded-[6px] sm:rounded-[8px] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <ChevronDown
              className={`w-4 h-4 sm:w-5 sm:h-5 text-[#2d2d2d] transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 bg-white border border-[#eaeaea] rounded-[16px] shadow-lg overflow-hidden min-w-[200px]"
          >
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-[#2d2d2d]">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Category List with Limits - Stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col sm:flex-row gap-[10px] items-start mt-2 w-full">
          {/* Mobile: Category and Input stacked together */}
          <div className="flex flex-col gap-[10px] w-full sm:hidden">
            {categories.map((category) => (
              <div key={category.value} className="flex flex-col gap-[10px] w-full">
                {/* Category Name */}
                <div className="bg-white border border-dashed border-[#eaeaea] rounded-[10px] px-3 py-2.5 w-full min-h-[40px] flex items-center">
                  <span className="text-xs font-medium text-[#777777] leading-4">
                    {category.label}
                  </span>
                </div>
                {/* Proposal Limit Input */}
                <div className="bg-white border border-dashed border-[#eaeaea] rounded-[10px] px-3 py-2.5 w-full min-h-[40px] flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#777777] shrink-0" />
                  <input
                    type="number"
                    value={limits[category.value] || ""}
                    onChange={(e) =>
                      handleLimitChange(category.value, e.target.value)
                    }
                    placeholder="0"
                    min="0"
                    className="flex-1 text-xs font-medium text-[#2d2d2d] leading-4 bg-transparent border-0 outline-none focus:ring-0 p-0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Two columns side-by-side */}
          <>
            {/* Left Column - Category Names */}
            <div className="hidden sm:flex flex-1 flex-col gap-[10px] items-start">
              {categories.map((category) => (
                <div
                  key={category.value}
                  className="bg-white border border-dashed border-[#eaeaea] rounded-[12px] px-4 py-3 w-full min-h-[44px] flex items-center"
                >
                  <span className="text-sm font-medium text-[#777777] leading-5">
                    {category.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column - Proposal Limits */}
            <div className="hidden sm:flex flex-1 flex-col gap-[10px] items-start">
              {categories.map((category) => (
                <div
                  key={category.value}
                  className="bg-white border border-dashed border-[#eaeaea] rounded-[12px] px-4 py-3 w-full min-h-[44px] flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4 text-[#777777] shrink-0" />
                  <input
                    type="number"
                    value={limits[category.value] || ""}
                    onChange={(e) =>
                      handleLimitChange(category.value, e.target.value)
                    }
                    placeholder="0"
                    min="0"
                    className="flex-1 text-sm font-medium text-[#2d2d2d] leading-5 bg-transparent border-0 outline-none focus:ring-0 p-0"
                  />
                </div>
              ))}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};
