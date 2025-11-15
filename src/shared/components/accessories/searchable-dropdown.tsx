import React, { useState, useRef, useEffect } from "react";
import { Check, Search } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
  flag?: string;
}

interface SearchableDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: DropdownOption | null;
  onChange: (option: DropdownOption) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownWidth?: "auto" | "full";
  renderOption?: (option: DropdownOption) => React.ReactNode;
  renderTrigger?: (option: DropdownOption) => React.ReactNode;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search",
  className = "",
  triggerClassName = "",
  dropdownWidth = "full",
  renderOption,
  renderTrigger,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filteredOptions: DropdownOption[] = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (option: DropdownOption): void => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
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

  // Calculate dropdown width based on trigger width for auto mode
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  
  useEffect(() => {
    if (isOpen && dropdownWidth === "auto" && triggerRef.current) {
      const triggerWidth = triggerRef.current.offsetWidth;
      setDropdownStyle({ width: `${triggerWidth}px` });
    } else if (dropdownWidth === "full") {
      setDropdownStyle({ width: "100%" });
    }
  }, [isOpen, dropdownWidth]);

  const defaultRenderOption = (option: DropdownOption): React.ReactNode => {
    return (
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {option.icon && (
          <div className="shrink-0">
            {typeof option.icon === "string" ? (
              <img
                src={option.icon}
                alt={option.label}
                className="w-6 h-6 rounded object-cover"
              />
            ) : (
              option.icon
            )}
          </div>
        )}
        {option.flag && (
          <div className="shrink-0 text-base">{option.flag}</div>
        )}
        <span className="text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] truncate">
          {option.label}
        </span>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-normal text-[#5a5a5a] leading-5 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent transition-all bg-white ${triggerClassName}`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {value ? (
              renderTrigger ? (
                renderTrigger(value)
              ) : (
                <>
                  {value.icon && (
                    <div className="shrink-0">
                      {typeof value.icon === "string" ? (
                        <img
                          src={value.icon}
                          alt={value.label}
                          className="w-6 h-6 rounded object-cover"
                        />
                      ) : (
                        value.icon
                      )}
                    </div>
                  )}
                  {value.flag && (
                    <div className="shrink-0 text-base">{value.flag}</div>
                  )}
                  <span className="text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] truncate">
                    {value.label}
                  </span>
                </>
              )
            ) : (
              <span className="text-sm sm:text-base font-medium text-[#5a5a5a] leading-6 tracking-[0.08px]">
                {placeholder}
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-[#2d2d2d] shrink-0 transition-transform ${
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
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 bg-[#f4f4f4] border border-[#dfdfdf] rounded-[16px] shadow-lg overflow-hidden"
            style={dropdownStyle}
          >
            {/* Search Input */}
            <div className="border-b border-[#eaeaea]">
              <div className="bg-[#eaeaea] flex items-center gap-2 h-14 rounded-[16px] px-4">
                <Search className="w-6 h-6 text-[#777777] shrink-0" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none placeholder:text-[#777777] text-sm leading-5 font-normal text-[#2d2d2d]"
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="py-1 max-h-[500px] overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <React.Fragment key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleOptionSelect(option)}
                      className="w-full px-4 py-3.5 text-left hover:bg-white flex items-center justify-between transition-colors"
                    >
                      {renderOption ? renderOption(option) : defaultRenderOption(option)}
                      {value?.value === option.value && (
                        <Check className="w-6 h-6 text-[#7417c6] shrink-0" />
                      )}
                    </button>
                    {index < filteredOptions.length - 1 && (
                      <div className="h-px w-full bg-[#eaeaea] mx-4" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-[#5a5a5a] text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

