import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import logo from "@assets/evaLogo.png";
import "../onboard.css";
import { TickCircle } from "iconsax-reactjs";
import { CustomButton } from "@components/accessories/button";
import {
  AvaliabilityTypeCardProps,
  avaliabilityTypes,
} from "@/dummy-data/data";
import { ServiceOneProps } from "./one";
import { useUpdateOnboardingProfile } from "@/shared/api/services/onboarding";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const AvaliableTypeCard: React.FC<AvaliabilityTypeCardProps> = ({
  avaliableType,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        p-4 sm:p-5 md:p-6
        rounded-xl sm:rounded-2xl
        border-2
        cursor-pointer
        transition-all
        duration-200
        flex
        items-center
        justify-between
        gap-3 sm:gap-4
        touch-manipulation
        active:scale-[0.98]
        ${isSelected ? "border-[#7417C6] bg-purple-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50"}
      `}
    >
      <div className="flex-1 min-w-0">
        <h3
          className={`
          text-base sm:text-lg md:text-xl
          font-medium
          leading-tight
          ${isSelected ? "text-[#7417C6]" : "text-gray-800"}
        `}
        >
          {avaliableType.title}
        </h3>
        {avaliableType.description && (
          <p
            className={`
            text-sm sm:text-base
            mt-1 sm:mt-2
            leading-relaxed
            ${isSelected ? "text-purple-600" : "text-gray-600"}
          `}
          >
            {avaliableType.description}
          </p>
        )}
      </div>

      {/* Check icon */}
      <div className="flex-shrink-0">
        <TickCircle
          color={isSelected ? "#7417C6" : "#D5D5D5"}
          variant="Outline"
          size={isSelected ? 24 : 20}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_vendor/vendor/onboarding/sub-services/two")({
  component: ServiceTwo,
});

// Validation schema for availability
const availabilitySchema = yup.object({
  availability: yup.string().required("Please select your availability"),
});

export function ServiceTwo({
  continue: handleContinue,
  back: handleGoBack,
}: ServiceOneProps) {
  const [selectedType, setSelectedType] = useState<string>("");

  // API mutation hook
  const updateProfile = useUpdateOnboardingProfile({
    onSuccess: () => {
      handleContinue();
    },
  });

  // Form validation
  const form = useForm({
    resolver: yupResolver(availabilitySchema) as any,
    mode: "onChange",
    defaultValues: {
      availability: "",
    },
  });

  const { formState, setValue } = form;
  const { isValid } = formState;

  const handleAvailabilitySelect = (typeId: string) => {
    setSelectedType(typeId);
    // Find the full title for the selected availability
    const selectedAvailability = avaliabilityTypes.find((type) => type.id === typeId);
    if (selectedAvailability) {
      setValue("availability", selectedAvailability.title, { shouldValidate: true });
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) return;

    const selectedAvailability = avaliabilityTypes.find((type) => type.id === selectedType);
    if (!selectedAvailability) return;

    try {
      await updateProfile.mutateAsync({
        availability: selectedAvailability.title,
      });
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
          <img src={logo} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[60px] lg:h-[60px]" />
        </div>
        <h2 className="text-black header text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight">
          Set Your Availability
        </h2>
        <p className="text-black para text-sm sm:text-base mt-2 sm:mt-3 max-w-xl mx-auto">
          Join a network of trusted vendors and grow your business by connecting
          with event planners and attendees.
        </p>
      </div>

      {/* User type selector */}
      <div className="w-full max-w-2xl space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {avaliabilityTypes.map((avaliableType) => (
          <AvaliableTypeCard
            key={avaliableType.id}
            avaliableType={avaliableType}
            isSelected={selectedType === avaliableType.id}
            onClick={() => handleAvailabilitySelect(avaliableType.id)}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
        <CustomButton
          title={updateProfile.isPending ? "Saving..." : "Continue"}
          onClick={handleSubmit}
          disabled={!isValid || selectedType === "" || updateProfile.isPending}
          loading={updateProfile.isPending}
        />
 
        <CustomButton
            onClick={handleGoBack}
            title="Go back"
            className="goBack bg-transparent text-black "
            disabled={updateProfile.isPending}
          />
      </div>
    </div>
  );
}
