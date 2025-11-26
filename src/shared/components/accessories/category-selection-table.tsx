import React, { useState, useRef, useEffect } from "react";
import { Search, Check, X, ChevronDown } from "lucide-react";
import type { CategoryOption } from "./multi-select-category-dropdown";

interface CategorySelectionTableProps {
  label?: string;
  categories: CategoryOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  columns?: number;
}

export const CategorySelectionTable: React.FC<
  CategorySelectionTableProps
> = ({
  label,
  categories,
  selectedValues,
  onChange,
  placeholder = "Select categories",
  searchPlaceholder = "Search",
  className = "",
  columns = 7,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [responsiveColumns, setResponsiveColumns] = useState<number>(columns);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = categories.filter((category) =>
    selectedValues.includes(category.value)
  );

  // Calculate responsive columns based on window size
  useEffect(() => {
    const calculateColumns = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          setResponsiveColumns(2);
        } else if (window.innerWidth < 1024) {
          setResponsiveColumns(3);
        } else {
          setResponsiveColumns(columns);
        }
      }
    };

    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    return () => window.removeEventListener("resize", calculateColumns);
  }, [columns]);

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

  // Distribute categories across columns - responsive column count
  const distributeCategories = (): CategoryOption[][] => {
    const result: CategoryOption[][] = [];
    const itemsPerColumn = Math.ceil(
      filteredCategories.length / responsiveColumns
    );

    for (let i = 0; i < responsiveColumns; i++) {
      const start = i * itemsPerColumn;
      const end = start + itemsPerColumn;
      result.push(filteredCategories.slice(start, end));
    }

    return result;
  };

  const columnsData = distributeCategories();

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[#5a5a5a] leading-5 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full min-h-[56px] sm:min-h-[64px] bg-[rgba(244,244,244,0.7)] border border-[#eaeaea] rounded-[12px] sm:rounded-[16px] px-3 sm:px-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent transition-all"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap flex-1 min-w-0 py-1.5 sm:py-2">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className="border border-[rgba(0,0,0,0.1)] rounded-[6px] sm:rounded-[8px] px-1.5 sm:px-2 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-1.5 bg-white"
                >
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border border-[#dfdfdf] rounded-[2px] sm:rounded-[3px] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#7417c6] rounded-[1px] sm:rounded-[2px]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#2d2d2d] leading-4 sm:leading-5">
                    {option.label}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveCategory(e, option.value)}
                    className="ml-0.5 sm:ml-1 hover:bg-gray-100 rounded p-0.5 transition-colors shrink-0"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500" />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-xs sm:text-sm font-medium text-[#5a5a5a] leading-4 sm:leading-5">
                {placeholder}
              </span>
            )}
          </div>
          <div className="ml-1.5 sm:ml-2 shrink-0 bg-white rounded-[10px] sm:rounded-[12px] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            <ChevronDown
              className={`w-4 h-4 sm:w-5 sm:h-5 text-[#2d2d2d] transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Table Format - Renders inline, pushes content down */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="mt-2 border border-[#eaeaea] rounded-[16px] sm:rounded-[20px] bg-white overflow-hidden w-full"
          >
            <div className="relative min-h-[200px] sm:min-h-[300px]">
              {/* Search Bar */}
              <div className="bg-white h-[44px] sm:h-[47px] left-[4px] right-[4px] rounded-[12px] sm:rounded-[16px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] m-1 absolute top-[4px] z-10">
                <div className="flex gap-1.5 sm:gap-2 items-center h-full px-2.5 sm:px-3">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#2d2d2d] shrink-0" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none placeholder:text-[#777777] text-sm sm:text-base leading-4 sm:leading-5 font-normal text-[#2d2d2d]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Categories Grid - Table Format */}
              <div className="flex gap-2 sm:gap-3 items-start pt-[60px] sm:pt-[67px] px-2 sm:px-4 pb-2 sm:pb-4 overflow-x-auto">
                {columnsData.map((columnCategories, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1 items-start justify-center"
                  >
                    {columnCategories.map((category) => {
                      const isSelected = selectedValues.includes(
                        category.value
                      );
                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => handleToggleCategory(category.value)}
                          className="border border-[rgba(0,0,0,0.1)] rounded-[8px] px-2 py-1.5 flex gap-1.5 items-center hover:bg-gray-50 transition-colors w-full text-left"
                        >
                          <div
                            className={`w-3.5 h-3.5 border rounded-[3px] flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-[#7417c6] bg-[#7417c6]"
                                : "border-[#dfdfdf] bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <Check
                                className="w-2.5 h-2.5 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium leading-5 ${
                              isSelected
                                ? "text-[#2d2d2d]"
                                : "text-[#5a5a5a]"
                            }`}
                          >
                            {category.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

