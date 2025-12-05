import React from "react";
import type { ChangeEvent } from "react";
import { CustomButton } from "@components/accessories/button";
import VerifiedBadge from "@components/accessories/verified-badge";

export interface ProfileFormData {
  fullName: string;
  email: string;
  companyName: string;
  location: string;
  organizerNumber: string;
}

interface ProfileSettingProps {
  formData: ProfileFormData;
  onFormDataChange: (field: keyof ProfileFormData) => (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  onSaveChanges: () => void;
}

const ProfileSetting: React.FC<ProfileSettingProps> = ({
  formData,
  onFormDataChange,
  onSaveChanges,
}) => {
  return (
    <>
      <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 items-start w-full">
        {/* Profile Section */}
        <div className="flex gap-4 sm:gap-5 items-start justify-center sm:justify-start w-full">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] rounded-full border border-[rgba(0,0,0,0.08)] bg-white p-1.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden border border-[rgba(0,0,0,0.08)]">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Verified Tick Badge */}
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex items-center justify-center border-2 border-white rounded-full">
              <div className="w-6 h-6 sm:w-8 sm:h-8">
                <VerifiedBadge size={24} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 items-start w-full">
          <div className="flex gap-4 items-center w-full">
            <h2 className="text-lg sm:text-xl font-medium text-[#2d2d2d] leading-[24px] sm:leading-[28px] tracking-[0.1px]">
              Profile Information
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 w-full">
            {/* Full Name */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={onFormDataChange("fullName")}
                className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent"
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
                onChange={onFormDataChange("email")}
                className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent"
              />
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                Company name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={onFormDataChange("companyName")}
                className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent"
              />
            </div>

            {/* Location and Organizer Number */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-[15px] items-stretch sm:items-center w-full">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={onFormDataChange("location")}
                  className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-normal text-[#5a5a5a] leading-5">
                  Organizer Number
                </label>
                <input
                  type="tel"
                  value={formData.organizerNumber}
                  onChange={onFormDataChange("organizerNumber")}
                  className="h-12 sm:h-14 border border-[#dfdfdf] rounded-[14px] px-4 sm:px-[18px] text-sm sm:text-base font-medium text-[#2d2d2d] leading-6 tracking-[0.08px] focus:outline-none focus:ring-2 focus:ring-[#7417c6] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="mt-8 sm:mt-12 md:mt-16 flex justify-end w-full">
        <CustomButton
          title="Save Changes"
          onClick={onSaveChanges}
          className="!w-full sm:!w-auto px-8 sm:px-12 py-3 sm:py-4 rounded-[14px] text-sm sm:text-base font-medium leading-6 tracking-[0.08px]"
        />
      </div>
    </>
  );
};

export default ProfileSetting;

