import { Check, ChevronDown, Search } from "lucide-react";
import React, { useState } from "react";

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export interface PhoneData {
  country: Country;
  phoneNumber: string;
}

interface PhoneInputProps {
  label?: string;
  value?: PhoneData;
  onChange?: (data: PhoneData) => void;
  className?: string;
}

const countries: Country[] = [
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    flag: "🇳🇬",
  },
  {
    code: "US",
    name: "United States",
    dialCode: "+234",
    flag: "🇺🇸",
  },
  {
    code: "GH",
    name: "Ghana",
    dialCode: "+234",
    flag: "🇬🇭",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
  },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({ label, onChange, className = "" }) => {
  const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>("815-882-489");

  const filteredCountries: Country[] = countries.filter(
    (country) => country.name.toLowerCase().includes(searchTerm.toLowerCase()) || country.dialCode.includes(searchTerm),
  );

  const handleCountrySelect = (country: Country): void => {
    setSelectedCountry(country);
    setIsCountryOpen(false);
    setSearchTerm("");
    if (onChange) {
      onChange({
        country: country,
        phoneNumber: phoneNumber,
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPhoneNumber(e.target.value);
    if (onChange) {
      onChange({
        country: selectedCountry,
        phoneNumber: e.target.value,
      });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-gray-600 text-sm mb-2 font-medium">{label}</label>}

      <div className="flex bg-gray-100 rounded-lg overflow-hidden focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500 transition-all">
        {/* Country Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCountryOpen(!isCountryOpen)}
            className="flex items-center px-3 py-3 text-gray-800 hover:bg-gray-200 focus:outline-none transition-colors"
          >
            <span className="text-lg mr-2">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 text-gray-400 transition-transform ${isCountryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isCountryOpen && (
            <div className="absolute z-50 top-full left-0 w-80 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {/* Search */}
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Country"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{country.flag}</span>
                      <span className="text-gray-800 text-sm">{country.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm font-medium mr-2">{country.dialCode}</span>
                      {selectedCountry.code === country.code && <Check className="w-4 h-4 text-purple-600" />}
                    </div>
                  </button>
                ))}

                {filteredCountries.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-sm">No countries found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300"></div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="815-882-489"
          className="flex-1 px-4 py-3 bg-transparent border-0 text-gray-800 placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Overlay to close dropdown */}
      {isCountryOpen && <div className="fixed inset-0 z-40" onClick={() => setIsCountryOpen(false)} />}
    </div>
  );
};
