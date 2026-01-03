import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CountryList from "country-list-with-dial-code-and-flag";
import { CustomButton } from "@components/accessories/button";
import ProfilePictureUpload from "@components/accessories/profile-picture-upload";
import { CustomPhoneInput, type PhoneData } from "@components/accessories/custom-phone-input";
import { DropdownInput, type DropdownOption } from "@components/accessories/dropdown-input";
import { GooglePlacesAutocomplete } from "@components/accessories/google-places-autocomplete";
import Modal from "@components/accessories/main-modal";
import { AddPortfolioModal, SocialIcon } from "@/shared/components/portfolio-link-modal";
import { BadgeCheck } from "lucide-react";
import { onboardingSchema } from "@/shared/forms/schemas/onboarding.schema";

export interface ProfileFormData {
  fullName: string;
  email: string;
  companyName: string;
  country?: string;
  phone?: {
    countryCode: string;
    number: string;
  };
  location: string;
  links?: Array<{
    id?: string;
    brand: string;
    url: string;
  }>;
  profilePictureUrl?: string;
  isVerified?: boolean;
}

interface ProfileSettingProps {
  formData: ProfileFormData;
  onFormDataChange: (field: keyof ProfileFormData, value: any) => void;
  onSaveChanges: () => void;
  countryOptions?: DropdownOption[];
  onProfileUpdate?: () => void;
}

const ProfileSetting: React.FC<ProfileSettingProps> = ({
  formData,
  onFormDataChange,
  onSaveChanges,
  countryOptions = [],
  onProfileUpdate,
}) => {
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);

  // Initialize React Hook Form with validation (companyName excluded since it's read-only)
  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    resolver: yupResolver(onboardingSchema) as any,
    mode: "onChange",
    defaultValues: {
      companyName: formData.companyName || "", // Still included for schema validation but field is read-only
      country: formData.country || "",
      phone: formData.phone
        ? {
            countryCode: formData.phone.countryCode,
            number: formData.phone.number,
          }
        : {
            countryCode: "",
            number: "",
          },
      location: formData.location || "",
    },
  });

  // Sync form values when formData changes externally (e.g., from API)
  useEffect(() => {
    setValue("companyName", formData.companyName || "", { shouldValidate: false });
    setValue("country", formData.country || "", { shouldValidate: false });
    if (formData.phone) {
      setValue("phone.countryCode", formData.phone.countryCode, { shouldValidate: false });
      setValue("phone.number", formData.phone.number, { shouldValidate: false });
    } else {
      setValue("phone.countryCode", "", { shouldValidate: false });
      setValue("phone.number", "", { shouldValidate: false });
    }
    setValue("location", formData.location || "", { shouldValidate: false });
  }, [formData.companyName, formData.country, formData.phone?.countryCode, formData.phone?.number, formData.location, setValue]);

  const handleSaveChanges = useCallback(() => {
    handleSubmit(
      () => {
        // Image upload happens in the editor modal, so just save profile changes
        onSaveChanges();
      },
      (validationErrors) => {
        console.error("Validation errors:", validationErrors);
      }
    )();
  }, [handleSubmit, onSaveChanges]);

  const handlePhoneChange = useCallback((phoneData: PhoneData) => {
    onFormDataChange("phone", {
      countryCode: phoneData.country.dial_code,
      number: phoneData.phoneNumber,
    });
    setValue("phone.countryCode", phoneData.country.dial_code, { shouldValidate: true });
    setValue("phone.number", phoneData.phoneNumber, { shouldValidate: true });
  }, [onFormDataChange, setValue]);

  const handleCountryChange = useCallback((option: DropdownOption) => {
    const countryValue = option?.label || "";
    onFormDataChange("country", countryValue);
    setValue("country", countryValue, { shouldValidate: true });
  }, [onFormDataChange, setValue]);


  // Memoize phone data transformation - find country by dial_code
  const phoneData = useMemo((): PhoneData | undefined => {
    if (!formData.phone?.countryCode || !formData.phone?.number) return undefined;
    
    // Get all countries and find the one matching the dial_code
    const countries = CountryList.getAll();
    const foundCountry = countries.find(
      (country) => country.dial_code === formData.phone?.countryCode
    );

    if (!foundCountry) return undefined;

    return {
      country: {
        name: foundCountry.name,
        code: foundCountry.code,
        dial_code: foundCountry.dial_code,
        flag: foundCountry.flag,
      },
      phoneNumber: formData.phone.number,
    };
  }, [formData.phone]);

  // Memoize country option lookup
  const countryOption = useMemo((): DropdownOption | null => {
    if (!formData.country) return null;
    return countryOptions.find((opt) => opt.label === formData.country) || null;
  }, [formData.country, countryOptions]);

  const handleAddLink = useCallback((platform: string, url: string) => {
    const newLink = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      brand: platform,
      url,
    };
    const currentLinks = formData.links || [];
    onFormDataChange("links", [...currentLinks, newLink]);
    setIsLinksModalOpen(false);
  }, [formData.links, onFormDataChange]);

  const handleRemoveLink = useCallback((id: string) => {
    const currentLinks = formData.links || [];
    onFormDataChange("links", currentLinks.filter((link) => link.id !== id));
  }, [formData.links, onFormDataChange]);

  const handleImageUploaded = useCallback((url: string) => {
    onFormDataChange("profilePictureUrl", url);
    onProfileUpdate?.();
  }, [onFormDataChange, onProfileUpdate]);

  return (
    <>
      <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 items-start w-full">
        {/* Profile Section with Verified Badge */}
        <div className="flex gap-4 sm:gap-5 items-start justify-center sm:justify-start w-full">
          {/* Profile Picture Upload */}
          <ProfilePictureUpload
            currentImageUrl={formData.profilePictureUrl}
            onImageUploaded={handleImageUploaded}
          />
          {/* Verified Badge */}
          {formData.isVerified && (
            <div className="flex items-center gap-2 mt-4">
              <BadgeCheck className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Verified</span>
            </div>
          )}
        </div>

        {/* Profile Information Form */}
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 items-start w-full">
          <div className="flex gap-4 items-center w-full">
            <h2 className="text-lg sm:text-xl font-medium text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
              Profile Information
            </h2>
          </div>

          {/* Two-column layout on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* Full Name */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                readOnly
                className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                Organization Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                readOnly
                className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Country */}
            {countryOptions.length > 0 && (
              <div className="flex flex-col gap-2 w-full">
                <DropdownInput
                  label="Country"
                  options={countryOptions}
                  value={countryOption}
                  onChange={handleCountryChange}
                  placeholder="Select your Country"
                  searchable={true}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
            )}

            {/* Phone Number */}
            <div className="flex flex-col gap-2 w-full">
              <CustomPhoneInput
                label="Phone Number"
                value={phoneData}
                onChange={handlePhoneChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.countryCode?.message ||
                    errors.phone.number?.message ||
                    "Phone number is required"}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2 w-full">
              <GooglePlacesAutocomplete
                parentClassName=""
                label="Location"
                placeholder="Enter your location"
                value={formData.location}
                onChange={(value) => {
                  onFormDataChange("location", value);
                  setValue("location", value, { shouldValidate: true });
                }}
                error={errors.location?.message}
              />
            </div>
          </div>

          {/* Portfolio Links Section */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#2d2d2d]">
                Portfolio Links
              </h3>
              <button
                onClick={() => setIsLinksModalOpen(true)}
                className="w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Add portfolio link"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3">
              {!formData.links || formData.links.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No portfolio links added yet. Click the + button to add one.
                </p>
              ) : (
                formData.links.map((link) => (
                  <div
                    key={link.id || link.brand}
                    className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3"
                  >
                    <SocialIcon platform={link.brand} />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {link.brand}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {link.url}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveLink(link.id || link.brand)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 shrink-0"
                      aria-label="Remove portfolio link"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="mt-8 sm:mt-12 md:mt-16 flex justify-end w-full">
        <CustomButton
          title="Save Changes"
          onClick={handleSaveChanges}
          disabled={!isValid}
          className="w-full! sm:w-auto! px-8 sm:px-12 py-3 sm:py-4 rounded-[14px] text-sm sm:text-base font-medium leading-6 tracking-[0.08px] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Add Portfolio Link Modal */}
      <Modal
        isOpen={isLinksModalOpen}
        onClose={() => setIsLinksModalOpen(false)}
        size="md"
        animationDuration={400}
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        <AddPortfolioModal
          onAddLink={handleAddLink}
          onClose={() => setIsLinksModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default ProfileSetting;
