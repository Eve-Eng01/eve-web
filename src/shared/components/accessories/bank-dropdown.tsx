import React from "react";
import { SearchableDropdown, type DropdownOption } from "./searchable-dropdown";

export interface BankOption {
  value: string;
  label: string;
  icon?: string;
}

interface BankDropdownProps {
  label?: string;
  options: BankOption[];
  value: BankOption | null;
  onChange: (option: BankOption) => void;
  placeholder?: string;
  className?: string;
}

export const BankDropdown: React.FC<BankDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select a bank",
  className = "",
}) => {
  const dropdownOptions: DropdownOption[] = options.map((option) => ({
    value: option.value,
    label: option.label,
    icon: option.icon,
  }));

  const handleChange = (option: DropdownOption): void => {
    const bankOption: BankOption = {
      value: option.value,
      label: option.label,
      icon: typeof option.icon === "string" ? option.icon : undefined,
    };
    onChange(bankOption);
  };

  const selectedValue: DropdownOption | null = value
    ? {
        value: value.value,
        label: value.label,
        icon: value.icon,
      }
    : null;

  return (
    <SearchableDropdown
      label={label}
      options={dropdownOptions}
      value={selectedValue}
      onChange={handleChange}
      placeholder={placeholder}
      searchPlaceholder="Search"
      className={className}
      dropdownWidth="auto"
    />
  );
};

