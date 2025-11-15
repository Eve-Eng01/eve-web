import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Check } from "lucide-react";

export interface CategoryOption {
  value: string;
  label: string;
}

interface MultiSelectCategoryDropdownProps {
  label?: string;
  options: CategoryOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export const MultiSelectCategoryDropdown: React.FC<
  MultiSelectCategoryDropdownProps
> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select categories",
  searchPlaceholder = "Search",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filteredOptions: CategoryOption[] = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const handleToggleCategory = (value: string): void => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleRemoveCategory = (
    e: React.MouseEvent,
    value: string
  ): void => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
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
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[#5a5a5a] leading-5 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full min-h-[64px] bg-[rgba(244,244,244,0.7)] border border-[#eaeaea] rounded-[16px] px-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent transition-all"
        >
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0 py-2">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className="border border-[rgba(0,0,0,0.1)] rounded-[8px] px-2 py-1.5 flex items-center gap-1.5 bg-white"
                >
                  <div className="w-4 h-4 border border-[#dfdfdf] rounded-[3px] flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#7417c6] rounded-[2px]" />
                  </div>
                  <span className="text-sm font-semibold text-[#2d2d2d] leading-5">
                    {option.label}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveCategory(e, option.value)}
                    className="ml-1 hover:bg-gray-100 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-sm font-medium text-[#5a5a5a] leading-5">
                {placeholder}
              </span>
            )}
          </div>
          <div className="ml-2 shrink-0 bg-white rounded-[12px] w-10 h-10 flex items-center justify-center">
            <svg
              className={`w-5 h-5 text-[#2d2d2d] transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-2 bg-white border border-[#eaeaea] rounded-[20px] shadow-lg overflow-hidden w-full"
          >
            {/* Search Input */}
            <div className="bg-white h-[47px] rounded-[16px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] m-1">
              <div className="flex items-center gap-2 h-full px-3">
                <Search className="w-6 h-6 text-[#2d2d2d] shrink-0" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none placeholder:text-[#777777] text-base leading-5 font-normal text-[#2d2d2d]"
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="py-2 px-4 max-h-[300px] overflow-y-auto">
              <div className="flex flex-col gap-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleToggleCategory(option.value)}
                        className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-1.5 transition-colors rounded-[8px] border border-[#eaeaea]"
                      >
                        <div
                          className={`w-3.5 h-3.5 border rounded-[3px] flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-[#7417c6] bg-[#7417c6]"
                              : "border-[#dfdfdf] bg-transparent"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium leading-5 ${
                            isSelected
                              ? "text-[#2d2d2d]"
                              : "text-[#5a5a5a]"
                          }`}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-2 py-3 text-sm text-[#5a5a5a] text-center">
                    No options found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

