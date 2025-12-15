import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import logo from "@assets/evaLogo.png";
import bottom from "@assets/onBoarding/bottom.png";
import { CustomButton } from "@components/accessories/button";
import { DropdownInput, type DropdownOption } from "@components/accessories/dropdown-input";
import { InputField } from "@components/accessories/input-field";
import { GooglePlacesAutocomplete } from "@components/accessories/google-places-autocomplete";
import { CustomPhoneInput, type PhoneData } from "@components/accessories/custom-phone-input";
import "./onboard.css";
import { ServiceOne } from "./sub-services/one";
import { ServiceTwo } from "./sub-services/two";
import { ServiceThree } from "./sub-services/three";
import { ServiceFour } from "./sub-services/four";

// Type definitions - re-export for backward compatibility
export type { DropdownOption };
export type { PhoneData };

export interface FormData {
  companyName: string;
  businessType: DropdownOption | null;
  phoneData: PhoneData | undefined;
  location: string;
}

// Main Onboarding Form Component
export function RouteComponent() {
  const [currentTab, setCurrentTab] = useState(1);
  const navigate = useNavigate();
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
    } else {
      navigate({ to: "/organizer/onboarding/sub-services/review" });
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
              <h2 className="text-black header">
                How are you going to use Eve?
              </h2>
              <p className="text-black para">
                Tell Us Who You Are, Choose one to get the most relevant
                features and recommendations.
              </p>
            </div>

            <InputField
              parentClassName="mb-[30px]"
              label="Company Name"
              placeholder="Eve Even Platform"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
            />

            <DropdownInput
              className="mb-[30px]"
              label="Business Type"
              options={businessTypes}
              value={formData.businessType}
              onChange={(option) =>
                setFormData({ ...formData, businessType: option })
              }
              placeholder="Select business type"
              searchable={true}
              addNewOption={true}
              onAddNew={handleAddNewBusinessType}
            />

            <CustomPhoneInput
              label="Phone Number"
              value={formData.phoneData}
              onChange={(data) => setFormData({ ...formData, phoneData: data })}
              showHelperText={true}
              phonePlaceholder="Enter phone number"
            />

            <GooglePlacesAutocomplete
              parentClassName="mb-[30px]"
              label="Location"
              placeholder="Ibeju Lekki Lagos, Nigeria."
              value={formData.location}
              onChange={(value) =>
                setFormData({ ...formData, location: value })
              }
            />

            <div className="space-y-4 bottom">
              <CustomButton
                disabled={
                  formData.companyName &&
                  formData.businessType &&
                  formData.phoneData &&
                  formData.location === ""
                    ? true
                    : false
                }
                title="Continue"
                onClick={handleContinue}
              />
            </div>
          </div>
        );

      case 2:
        return <ServiceOne continue={handleContinue} back={handleGoBack} />;
      case 3:
        return <ServiceTwo continue={handleContinue} back={handleGoBack} />;
      case 4:
        return <ServiceThree continue={handleContinue} back={handleGoBack} />;

      case 5:
        return <ServiceFour continue={handleContinue} back={handleGoBack} />;

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
export const Route = createFileRoute("/_organizer/organizer/onboarding/services")({
  component: RouteComponent,
});
