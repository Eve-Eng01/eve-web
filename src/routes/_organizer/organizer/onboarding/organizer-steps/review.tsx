import { useState, useEffect } from "react";
import logo from "@assets/evaLogo.png";
import { CustomButton } from "@components/accessories/button";
import { TickCircle, Edit } from "iconsax-reactjs";
import { PortfolioLink } from "../sub-services/four";
import { useCreateOnboardingProfile } from "@/shared/api/services/onboarding";
import type { CreateOnboardingRequest } from "@/shared/api/services/onboarding/types";
import { useAuthStore } from "@/shared/stores/auth-store";
import { CustomPhoneInput, DropdownOption } from "../services";
import { DropdownInput } from "@components/accessories/dropdown-input";
import { getCountriesOptions } from "../profile";

export interface OrganizerReviewStepProps {
  continue: () => void;
  back: () => void;
  formData: {
    companyName: string;
    country: DropdownOption | null;
    phoneData: {
      country: { dial_code: string; code: string; name: string; flag: string };
      phoneNumber: string;
    } | undefined;
    location: string;
    businessType: string | null;
  };
  portfolioLinks: PortfolioLink[];
}

export function OrganizerReviewStep({
  back: handleGoBack,
  formData,
  portfolioLinks,
}: OrganizerReviewStepProps) {
  const createProfileMutation = useCreateOnboardingProfile();
  const user = useAuthStore((state) => state.user);

  // State for all editable fields
  const [editableData, setEditableData] = useState({
    companyName: formData.companyName,
    location: formData.location,
    country: formData.country,
    phoneData: formData.phoneData,
    businessType: formData.businessType,
  });

  const [countriesOptions, setCountriesOptions] = useState<DropdownOption[]>([]);
  const [businessTypes] = useState<DropdownOption[]>([
    { value: "Event Planning", label: "Event Planning" },
    { value: "Corporate Events", label: "Corporate Events" },
    { value: "Wedding Planning", label: "Wedding Planning" },
    { value: "Conference Management", label: "Conference Management" },
    { value: "Festival Organization", label: "Festival Organization" },
  ]);

  // Load countries on mount
  useEffect(() => {
    const countriesList = getCountriesOptions();
    setCountriesOptions(countriesList);
  }, []);

  // Handle input change
  const handleInputChange = (field: "companyName" | "location", value: string) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle country change
  const handleCountryChange = (option: DropdownOption | null) => {
    setEditableData((prev) => ({ ...prev, country: option }));
  };

  // Handle phone change
  const handlePhoneChange = (phoneData: {
    country: { dial_code: string; code: string; name: string; flag: string };
    phoneNumber: string;
  }) => {
    setEditableData((prev) => ({ ...prev, phoneData }));
  };

  // Handle business type change
  const handleBusinessTypeChange = (option: DropdownOption | null) => {
    setEditableData((prev) => ({
      ...prev,
      businessType: option?.value || null,
    }));
  };

  // Helper to focus inputs when edit icon is clicked (purely visual cue)
  const focusField = (fieldId: string) => {
    const el = document.getElementById(fieldId);
    if (el instanceof HTMLInputElement) {
      el.focus();
    }
  };

  // Get business type option from value
  const getBusinessTypeOption = (): DropdownOption | null => {
    if (!editableData.businessType) return null;
    return (
      businessTypes.find((bt) => bt.value === editableData.businessType) || null
    );
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!editableData.phoneData || !editableData.country) {
      return;
    }

    // Format portfolio links for API (map platform to brand)
    const links = portfolioLinks.map((link) => ({
      brand: link.platform,
      url: link.url,
    }));

    // Prepare request data
    const requestData: CreateOnboardingRequest = {
      role: "organizer",
      companyName: editableData.companyName,
      country: editableData.country.label,
      phone: {
        countryCode: editableData.phoneData.country.dial_code,
        number: editableData.phoneData.phoneNumber,
      },
      location: editableData.location,
      links: links.length > 0 ? links : undefined,
      completed: true,
    };

    try {
      await createProfileMutation.mutateAsync(requestData);
      // Navigation is handled in the hook's onSuccess
    } catch (error) {
      // Error is handled in the hook's onError
      console.error("Failed to create profile:", error);
    }
  };

  return (

      <div className="flex flex-col justify-center items-center px-4 w-full max-w-2xl">
        {/* Header */}
        <div className="mx-auto mb-4">
          <img src={logo} alt="" className="w-[60px] h-[60px]" />
        </div>
        <h2 className="text-black header text-center">Review Your Information</h2>
        <p className="text-black para text-center">
          Here's a summary of everything you've added. Make sure your details
          are correct before submitting your profile.
        </p>

        {/* Profile Information Section */}
        <div className="mb-[50px] w-full">
          <div className="flex items-center gap-3 mb-8">
            <TickCircle size="32" color="#000" variant="Bold" />
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
          </div>

          <div className="space-y-6">
            {/* Full Name (from user) */}
            {user?.firstName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={`${user.firstName} ${user.lastname || ""}`.trim()}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Email Address (from user) */}
            {user?.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Registered Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered Company Name
              </label>
              <div className="relative">
                <input
                  id="review-company-name"
                  type="text"
                  value={editableData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none pr-12 bg-white"
                  placeholder="Enter company name"
                />
                <button
                  type="button"
                  onClick={() => focusField("review-company-name")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
                  aria-label="Edit company name"
                >
                  <Edit size="18" color="#7417C6" variant="Outline" />
                </button>
              </div>
            </div>

            {/* Country */}
            <div>
              <DropdownInput
                className=""
                label="Country"
                options={countriesOptions}
                value={editableData.country}
                onChange={handleCountryChange}
                placeholder="Select your Country"
                searchable={true}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <input
                  id="review-location"
                  type="text"
                  value={editableData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none pr-12 bg-white"
                  placeholder="Enter location"
                />
                <button
                  type="button"
                  onClick={() => focusField("review-location")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
                  aria-label="Edit location"
                >
                  <Edit size="18" color="#7417C6" variant="Outline" />
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <CustomPhoneInput
                label="Phone Number"
                value={editableData.phoneData}
                onChange={handlePhoneChange}
              />
            </div>

            {/* Business Type */}
        
          </div>
        </div>

        {/* Portfolio Links Section */}
        {portfolioLinks.length > 0 && (
          <div className="mb-[50px] w-full">
            <div className="flex items-center gap-3 mb-8">
              <TickCircle size="32" color="#000" variant="Bold" />
              <h2 className="text-xl font-semibold text-gray-900">
                Portfolio Links
              </h2>
            </div>
            <div className="space-y-3">
              {portfolioLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {link.platform}
                  </div>
                  <div className="text-sm text-gray-600 truncate flex-1">
                    {link.url}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full  mb-12 otherbtn">
          <CustomButton
            title={
              createProfileMutation.isPending
                ? "Creating Profile..."
                : "Submit Profile"
            }
            onClick={handleSubmit}
            disabled={createProfileMutation.isPending}
            loading={createProfileMutation.isPending}
          />
          <CustomButton
            onClick={handleGoBack}
            title="Go back"
            className="goBack bg-transparent text-black "
            disabled={createProfileMutation.isPending}
          />
        </div>
      </div>

  );
}

