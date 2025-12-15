import React from "react";
import CountryList from "country-list-with-dial-code-and-flag";
import { DropdownInput, type DropdownOption } from "./dropdown-input";

// Type definitions
export interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export interface PhoneData {
  country: Country;
  phoneNumber: string;
}

export interface CustomPhoneInputProps {
  label?: string;
  value: PhoneData | undefined;
  onChange: (data: PhoneData) => void;
  showHelperText?: boolean;
  phonePlaceholder?: string;
  countryPlaceholder?: string;
}

export const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  label,
  value,
  onChange,
  showHelperText = false,
  phonePlaceholder = "Phone number",
  countryPlaceholder,
}) => {
  // Get all countries from the npm package
  const countries: Country[] = CountryList.getAll();

  // Dedupe by ISO code and sort alphabetically to avoid repeats
  const uniqueCountries = Array.from(
    new Map(countries.map((country) => [country.code, country])).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Prefer Nigeria dial code for placeholder; fall back to the first country
  const defaultCountry =
    uniqueCountries.find((country) => country.code === "NG") ||
    uniqueCountries[0];

  // Convert countries to dropdown options with richer search text
  const countryOptions: DropdownOption[] = uniqueCountries.map((country) => ({
    value: country.code,
    label: `${country.flag} ${country.name} (${country.dial_code})`,
    searchText: `${country.name} ${country.code} ${country.dial_code} ${country.dial_code.replace("+", "")}`,
  }));

  const selectedCountryOption = value
    ? countryOptions.find((option) => option.value === value.country.code) ||
      null
    : null;

  const handleCountryChange = (option: DropdownOption) => {
    const selectedCountry = uniqueCountries.find(
      (country) => country.code === option.value
    );
    if (selectedCountry) {
      onChange({
        country: selectedCountry,
        phoneNumber: value?.phoneNumber || "",
      });
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const country = value?.country || defaultCountry;
    onChange({
      country,
      phoneNumber: e.target.value,
    });
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-600 text-sm mb-2 font-medium">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Country Dropdown */}
        <div className="sm:w-2/5">
          <DropdownInput
            className="mb-0"
            options={countryOptions}
            value={selectedCountryOption}
            onChange={handleCountryChange}
            placeholder={
              countryPlaceholder ||
              `Select (${defaultCountry?.dial_code || "+000"})`
            }
            searchable={true}
          />
        </div>

        {/* Phone Number Input */}
        <div className="sm:w-3/5 w-full">
          <input
            type="tel"
            placeholder={phonePlaceholder}
            value={value?.phoneNumber || ""}
            onChange={handlePhoneNumberChange}
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Display selected country dial code */}
      {value?.country && (
        <div className="mt-1 text-sm text-gray-500">
          Selected: {value.country.flag} {value.country.name} (
          {value.country.dial_code})
        </div>
      )}

      {/* Helper text for dial code expectation */}
      {showHelperText && (
        <p className="mt-2 text-xs text-gray-500">
          Choose your country code, then enter the number without the leading
          zero.
        </p>
      )}
    </div>
  );
};

