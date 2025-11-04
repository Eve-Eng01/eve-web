import React from "react";
import { Search } from "lucide-react";
import FilterDropdown, { FilterOption } from "./filter-dropdown";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  selectedFilters?: string[];
  onFilterChange?: (selectedValues: string[]) => void;
  multipleFilters?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for Users booking ID, Attendee Name etc",
  value = "",
  onChange,
  filterOptions = [],
  selectedFilters = [],
  onFilterChange,
  multipleFilters = false,
  className = "",
}) => {
  return (
    <div className={`flex gap-4 items-center ${className}`}>
      {/* Search Input */}
      <div className="bg-[#f4f4f4] border-2 border-[#eaeaea] flex gap-2 h-[56px] items-center px-4 py-[14px] rounded-[16px] flex-1">
        <Search className="w-5 h-5 text-[#777777] shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none placeholder:text-[#777777] text-[12px] leading-[16px] tracking-[0.06px] font-normal text-[#2d2d2d]"
        />
      </div>

      {/* Filter Dropdown */}
      {filterOptions.length > 0 && (
        <FilterDropdown
          options={filterOptions}
          selectedValues={selectedFilters}
          onSelectionChange={onFilterChange}
          multiple={multipleFilters}
        />
      )}
    </div>
  );
};

export default SearchBar;
