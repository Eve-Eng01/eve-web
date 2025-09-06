import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import logo from "../../assets/evaLogo.png";
import bottom from "../../assets/onBoarding/bottom.png";
import { CustomButton } from "../Accessories/Button";
import { DropdownInput } from "../Accessories/DropdownInput";
import { InputField } from "../Accessories/InputFIeld";
import "./onboard.css";
import CountryList from "country-list-with-dial-code-and-flag";
import { ServiceOne } from "./SubServices/one";

// Type definitions
interface DropdownOption {
  value: string;
  label: string;
}

interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

interface PhoneData {
  country: Country;
  phoneNumber: string;
}

interface FormData {
  companyName: string;
  businessType: DropdownOption | null;
  phoneData: PhoneData | undefined;
  location: string;
}

// Custom Phone Input Component using DropdownInput
interface CustomPhoneInputProps {
  label?: string;
  value: PhoneData | undefined;
  onChange: (data: PhoneData) => void;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({ label, value, onChange }) => {
  // Get all countries from the npm package
  const countries: Country[] = CountryList.getAll();

  // Convert countries to dropdown options
  const countryOptions: DropdownOption[] = countries.map((country) => ({
    value: country.code,
    label: `${country.flag} ${country.name} (${country.dial_code})`,
  }));

  const selectedCountryOption = value
    ? countryOptions.find((option) => option.value === value.country.code) || null
    : null;

  const handleCountryChange = (option: DropdownOption) => {
    const selectedCountry = countries.find((country) => country.code === option.value);
    if (selectedCountry) {
      onChange({
        country: selectedCountry,
        phoneNumber: value?.phoneNumber || "",
      });
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value?.country) {
      onChange({
        country: value.country,
        phoneNumber: e.target.value,
      });
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-gray-600 text-sm mb-2 font-medium">{label}</label>}

      <div className="flex gap-2">
        {/* Country Dropdown */}
        <div className="w-2/5">
          <DropdownInput
            options={countryOptions}
            value={selectedCountryOption}
            onChange={handleCountryChange}
            placeholder="Select country"
            searchable={true}
          />
        </div>

        {/* Phone Number Input */}
        <div className="w-3/5">
          <input
            type="tel"
            placeholder="Phone number"
            value={value?.phoneNumber || ""}
            onChange={handlePhoneNumberChange}
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Display selected country dial code */}
      {value?.country && (
        <div className="mt-1 text-sm text-gray-500">
          Selected: {value.country.flag} {value.country.name} ({value.country.dial_code})
        </div>
      )}
    </div>
  );
};

// Main Onboarding Form Component
export function RouteComponent() {
  const [currentTab, setCurrentTab] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: "Eve Even Platform",
    businessType: null,
    phoneData: undefined,
    location: "Ibeju Lekki Lagos, Nigeria.",
  });

  const [businessTypes, setBusinessTypes] = useState<DropdownOption[]>([
    { value: "catering", label: "Catering/Baking" },
    { value: "videography", label: "Videographers" },
    { value: "photography", label: "Photographers" },
    { value: "music", label: "Musicians & DJs" },
    { value: "security", label: "Security Service" },
  ]);

  const handleAddNewBusinessType = (newOption: DropdownOption) => {
    setBusinessTypes([...businessTypes, newOption]);
  };

  const handleContinue = () => {
    if (currentTab < 5) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handleGoBack = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 1:
        return (
          <div className=" mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex items-center justify-center">
                <img src={logo} alt="" className="w-[60px] h-[60px]" />
              </div>
              <h2 className="text-black header">How are you going to use Eve?</h2>
              <p className="text-black para">
                Tell Us Who You Are, Choose one to get the most relevant features and recommendations.
              </p>
            </div>

            <InputField
              label="Company Name"
              placeholder="Eve Even Platform"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />

            <DropdownInput
              label="Business Type"
              options={businessTypes}
              value={formData.businessType}
              onChange={(option) => setFormData({ ...formData, businessType: option })}
              placeholder="Select business type"
              searchable={true}
              addNewOption={true}
              onAddNew={handleAddNewBusinessType}
            />

            <CustomPhoneInput
              label="Phone Number"
              value={formData.phoneData}
              onChange={(data) => setFormData({ ...formData, phoneData: data })}
            />

            <InputField
              label="Location"
              placeholder="Ibeju Lekki Lagos, Nigeria."
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <div className="space-y-4 bottom">
              <CustomButton title="Continue" onClick={handleContinue} />
            </div>
          </div>
        );

      case 2:
        return <ServiceOne continue={handleContinue} back={handleGoBack} />;
      case 3:
        return (
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tab Three</h2>
            <p className="text-gray-600 mb-8">This is the content for the third tab.</p>
            <div className="space-y-4">
              <CustomButton title="Continue" onClick={handleContinue} />
              <button onClick={handleGoBack} className="goBack">
                {" "}
                Go back
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tab Four</h2>
            <p className="text-gray-600 mb-8">This is the content for the fourth tab.</p>
            <div className="space-y-4">
              <CustomButton title="Continue" onClick={handleContinue} />
              <button onClick={handleGoBack} className="goBack">
                {" "}
                Go back
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tab Five</h2>
            <p className="text-gray-600 mb-8">This is the final tab. You've completed the onboarding process!</p>
            <div className="space-y-4">
              <CustomButton
                title="Complete"
                onClick={() => alert("Onboarding Complete!")}
                className="bg-green-600 hover:bg-green-700"
              />
              <button onClick={handleGoBack} className="goBack">
                {" "}
                Go back
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((tab) => (
            <div
              key={tab}
              className={`w-12 h-1 rounded-full transition-colors ${
                tab <= currentTab ? "bg-purple-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-[40px]">
      <div className="w-full max-w-2xl">
        {renderProgressBar()}
        {renderTabContent()}
      </div>
      {/* Decorative elements on the bottom side */}
      <div className="overflow-hidden pointer-events-none">
        <div className="relative">
          <img src={bottom} alt="" className="w-full img" />
        </div>
      </div>
    </div>
  );
}

// Define the route using createFileRoute
export const Route = createFileRoute("/Onboarding/Services")({
  component: RouteComponent,
});
